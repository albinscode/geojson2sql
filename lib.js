const axios = require('axios')
const fs = require('fs')
const logger = require('./logger.js').logger

/**
 * @param the file or url to fetch
 * @return content as a json object
 */
async function getContent(fileLocation) {

    let content = null;
    // url case
    if (fileLocation.indexOf('http') > -1) {
        logger.debug(`Fetching ${fileLocation} content url...`)
        const response = await axios.get(fileLocation)
        content = response.data
    }
    // file case
    else {
        logger.debug(`Fetching ${fileLocation} file content...`)
        const strContent = await fs.promises.readFile(fileLocation)
        content = JSON.parse(strContent)
    }

    if (logger.isDebugEnabled()) logger.debug(content)

    return content
}

/**
 * @param json, the geojson object
 * @param options contains several options to format sql orders
 * @return an array of sql orders as string
 */
function generateSql(json, options) {

    // we browse features
    return json.features.map( feature => {

        // origin crs (projection)

        // coordinates
        if (feature.geometry.type !== 'Polygon') new Error(`${feature.geometry.type} not implemented`)

        // stored as MULTIPOLYGON
        const geometryType = 'MULTIPOLYGON'

        // we get the first array of coordinates as far
        // as we only manage polygon
        const geometryCoords = feature.geometry.coordinates[0]
            .map(coord => coord[0] + ' ' + coord[1])
            .join(',')

        // we represent them as WKT
        // for multipolygon, three parenthesis
        let geom = `st_transform('SRID=${options.geometrySridFrom};${geometryType}(((${geometryCoords})))', ${options.geometrySridTo})`

        // properties (used for column mapping)
        let propertiesKept = Object.keys(feature.properties).reduce( (acc, key) => {
            // a key column to keep for sql request
            if (options.columns[key]) {
                // we take the opportunity to map it with new name
                acc[options.columns[key]] = feature.properties[key]
            }
            return acc
        }, {})

        // we add the geometry column
        propertiesKept[options.geometryColumn] = geom

        // we add additional fixed or incremented columns/values
        options.addedColumns.forEach( elt => {
            let value  = elt.mode === 'fixed' ? elt.value : elt.value++

            propertiesKept[elt.name] = value
        })

        let columns = Object.keys(propertiesKept).join(', ')
        let values = Object.values(propertiesKept)
            .map(elt => typeof elt === 'number' || elt.indexOf('st_') > -1 ? elt : `'${elt}'`)
            .join(', ')

        return `INSERT INTO ${options.sqlTableName} (${columns}) VALUES (${values})`
    })
}

module.exports.getContent = getContent
module.exports.generateSql = generateSql
