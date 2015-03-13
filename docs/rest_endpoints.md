##REST Endpoints

A rest api for keyspaces, column families and columns are provided under “/browser/”
url. These group of URLs allows to managing meta data.

All required parameters for create and update operation need to be sent as the same object as retrieved. (However remember that Cassandra only allows to update some parameters.)

###Keyspace:
```
/browser/
GET     get list of keyspaces
​
/browser/:keyspace/
POST    add new keyspace
​PUT     change properties for given keyspace
​DELETE ​ drop given keyspace
```

###Column Family:
```
/browser/:keyspace/
GET     get list of column families for given keyspace
​
/browser/:keyspace/:columnfamily
GET     get rows of data for given column family
POST    add new column family
PUT     change properties for given column family
DELETE  drop given column family
```

###Column
```
/browser/:keyspace/:columnfamily/columns/
GET     get list of columns for given column family

/browser/:keyspace/:columnfamily/columns/:column
POST    add new column
PUT     change properties for given column
DELETE  drop given column
```

Besides these functionalities, a CQL query service is provided to run given CQL queries.

###CQL
```
/query/   {"query": String}
PUT     run CQL query globally

/query/:keyspace/   {"query": String}
PUT     run CQL query for given keyspace
```
