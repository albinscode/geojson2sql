# Presentation

This tiny script allows to transform geojson data to sql insert queries compatible with Postgis.

Only multipolygon are managed currently.

# Installation

To use correct node version, please use node version manager tool (`nvm`) and run `nvm use`.

~~~
npm install
~~~


# Running

It can fetch geojson data from url or from file.

Here is an example from a test file.

~~~
node main.js -g ./test/minimal.json
~~~

Will give the following output:

~~~
INSERT INTO mytable (codeinsee, nom, geom, departement, id) VALUES ('69381', 'LYON 1', st_transform('SRID=4171;MULTIPOLYGON(((4.830494 45.764543999057146,4.830494 45.764543999057146)))', 2154), 69, 1)
~~~

Note: the geometry is buggy (not well terminated) for the needs of basic testing.

# Configuration

The config.json file allows you to configure the tool to fit some basic needs.

You can review the previous example to understand the basic features.

~~~

{
    "sqlTableName": "commune",
    "geometryColumn": "polygon",
    "geometrySridFrom": "4171",
    "geometrySridTo": "2154",
    "columns": {
        "insee": "codeinsee",
        "nomreduit": "libelle"
    },
    "addedColumns": [
        {
            "name": "departement_id",
            "mode": "fixed",
            "value": 69
        },
        {
            "name": "id",
            "mode": "increment",
            "value": 974000026
        }
    ]
}
~~~

* sqlTableName specifies the name of the sql table to insert data into
* geometryColumn specifies the name of the column used to store geometry data
* geometrySridFrom specifies the SRID of the current geometry
* geometrySridTo specifies the wanted SRID for resulting geometry (a st_transform function will be applied)
* columns specifies the existing columns defined in geojson to keep and rename as destination columns. In our example it means we rename `insee` to `codeinsee` and `nomreduit` to `libelle`. All other found properties won't be mapped
* addedColumns specifies some additional columns to avoid rewriting manually the sql orders. In our example it means "add a departement id with static value 69" and "add id with initial value 974000026 and increment it for each new line inserted"
