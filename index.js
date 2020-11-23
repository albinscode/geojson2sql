const program = require('commander')
const axios = require('axios')
const lib = require('./lib.js')
const logger = require('./logger.js').logger
const config = require('./config.json')

// command
program
    .version('0.0.1')
    .requiredOption('-g, --geojson <geojson>', 'the input geojson file or url')

program.parse(process.argv)

logger.info(program.geojson)

// run the main command
main(program.geojson)

async function main(fileLocation) {
    // getContent(program.geojson).then( d => logger.info(d))
    const jsonContent = await lib.getContent(fileLocation)
    lib.generateSql(jsonContent, config).forEach( sql => console.log(sql))
}
