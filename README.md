# sandraREST

![screen shot](docs/img/screenshot.png)

sandraREST is a Cassandra Manager REST API and Web UI.

## Features

* Present database
* Run a CQL query
* Drop/Update/Create Keyspace
* Drop Column Family
* Drop/Update/Create Column
* List data of Column Family
* Download query result as CSV

## Getting Started

As the project required use of multiple external dependencies
for both client and server side, bower and npm are used to
manage those respectively.

Cassandra client configuration is stored under root folder in
`cassandra_config.json`. It is possible to configure contact
points and many other client options.

running the source code:
```bash
npm install
bower install
node bin/www
```

## Architecture

Main advantage of a REST API is that such organization of
a client­server communication allows single server to support
numerous client applications through the unified interfaces.

![interface guide](docs/img/overview.png)

In the particular case, server with REST API was developed on
the node.js. Client side is single page web­application based
on angular.js framework that served on 'public' folder as static
and only relies on REST API for access to the database data.

[REST Endpoints](docs/rest_endpoints.md)


## License

Released under [the MIT license][license].



