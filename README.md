# sandraREST
Cassandra manager

#todo
add host and port selection form

# some notes
select * from system.schema_keyspaces;

DataStax Node.js driver for Cassandra:
http://www.datastax.com/dev/blog/introducing-datastax-nodejs-driver-cassandra

http://textangular.com/
http://stackoverflow.com/questions/25581560/dynamic-syntax-highlighting-with-angularjs-and-highlight-js
https://github.com/angular-ui/ui-ace

Other rest examples:
https://github.com/hmsonline/virgil/wiki
https://github.com/alixaxel/ArrestDB


Default cassandra ports:
7199 - JMX (was 8080 pre Cassandra 0.8.xx)
7000 - Internode communication (not used if TLS enabled)
7001 - TLS Internode communication (used if TLS enabled)
9160 - Thift client API
9042 - CQL native transport port
