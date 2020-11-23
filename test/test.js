const assert = require('assert')
const lib = require('../lib.js')

describe('Main tests', function() {
    describe('Url/File fetching', function() {
        xit('Shall retrieve json from url', async function() {
            this.timeout(5000)
            const data = await lib.getContent('https://www.data.gouv.fr/fr/datasets/r/cd286e29-0408-4d92-b6c8-e2c9a2269c9f')
            // 9 arrondissements for Lyon city
            assert.equal(data.features.length, 9)
        })
        it('Shall retrieve json from file', async function() {
            const data = await lib.getContent('./test/adr_void_lieu.json')
            // 9 arrondissements for Lyon city
            assert.equal(data.features.length, 9)
        })
        it('Generate sql minimal', async function() {
            const data = await lib.getContent('./test/minimal.json')
            assert.equal(data.features.length, 1)
            let options = {
                sqlTableName: 'mytable',
                geometryColumn: 'geom',
                geometrySridFrom: '4171',
                geometrySridTo: '2154',
                columns: {
                    'insee': 'codeinsee',
                    'nomreduit': 'nom',

                },
                addedColumns: [
                    {
                        name: 'departement',
                        mode: 'fixed',
                        value: 69
                    },
                    {
                        name: 'id',
                        mode: 'increment',
                        value: 1
                    }
                ]
            }
            const sqlList = lib.generateSql(data, options)
            assert.equal(sqlList.length, 1)
            console.log(sqlList[0])
        })
    })
})
