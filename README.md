# sandraREST
Cassandra manager

### TODO

* Text query side
  * tab function for text query screen: allowing working on multiple queries like sql server manager using [this module]
  (https://material.angularjs.org/#/demo/material.components.tabs)
  * ~~[syntax highlighter](http://codemirror.net/mode/sql/index.html?mime=text/x-cassandra) for cql input~~
  (some improvement require)
* Database explorer
  * CRUD functions for keyspace, table ...etc (rest and ui development) (in progress)
  * making host and port properties dynamic (rest and ui development) (in progress)
* Other
  * refactoring REST browser code (now everything was written in router)
  * unit test(?)

### Technologies
* [Cassandra](https://cassandra.apache.org/)
* [Node.js](http://nodejs.org/)
* [Express.js](http://expressjs.com/)
* [Angular.js](https://angularjs.org/)
* [Material Design](https://material.angularjs.org/)
* [CodeMirror](http://codemirror.net/)


### Similar Apps
* [Virgil](https://github.com/hmsonline/virgil/wiki)
* [ArrestDB](https://github.com/alixaxel/ArrestDB)

### REST endpoints
#### Query
`/query/:keyspace/`

* `PUT {query: String}` - run query on given keyspace

#### Browser
`/browser/`

* `GET` - get keyspaces
* ~~`POST`~~
* ~~`PUT`~~
* ~~`DELETE`~~

`/browser/:keyspace/`

* `GET` - get list of tables for given keyspace
* `POST {replication: {class: String, %class_properties%} }` - add new keyspace (`CREATE KEYSPACE`)
* `PUT {replication: {class: String, %class_properties%} }` - change properties of given keyspace (`ALTER KEYSPACE`)
* `DELETE` - drop given keyspace (`DROP KEYSPACE`)

`/browser/:keyspace/:table/`

* `GET` - get the whole table for preview
* `POST {columns: [ {name: String, type: String} ], key: String, (options: [ {name: String, value: String|{}} ])? }` - add new table (`CREATE TABLE`)
* `PUT {options: [ {name: String, value: String|{}} ]}` - change options of given table (`ALTER TABLE WITH`)
* `DELETE` - drop given table (`DROP TABLE`)

`/browser/:keyspace/:table/columns/`

* `GET` - get list of columns for given table
* ~~`POST`~~
* ~~`PUT`~~
* ~~`DELETE`~~

`/browser/:keyspace/:table/columns/:column/`

* `GET` - get column properties (type and if it is a key)
* `POST {type: String}` - add new column
* `PUT {name: String, type: String}` - change properties of given column
* `DELETE` - delete given column

`/browser/:keyspace/:table/rows/`

* `GET` - ?
* `POST {name: String}` - ?
* `PUT {name: String}` - ?
* `DELETE` - ?

`/browser/:keyspace/:table/rows/:row_key_value`

* `GET` - fetch single row
* `POST {name: String}` -
* `PUT {name: String}` - ?
* `DELETE` - delete row

`/browser/:keyspace/:table/rows/:row_key_value/:column`

* `GET` - get cell
* ~~`POST {name: String}`~~
* `PUT {name: String}` - Edit row value
* ~~`DELETE`~~