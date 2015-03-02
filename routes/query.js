var cassandra = require('cassandra-driver');

var Query = {
    client: {},

    setup: function (config) {
        if (this.client.shutdown)
            this.client.shutdown();

        this.client = new cassandra.Client(config);
    },

    executeGlobaly: function (req, res, next) {
        Query.client.execute(req.body.query, function (err, result) {
            if (err) {
                var error = new Error('Bad Request');
                error.status = 400;
                error.message = err.message;
                error.name = err.name;
                next(error);
                return
            }
            res.json(result);
        });
    },

    executeOnKeyspace: function (req, res, next) {
        this.client.keyspace = req.params.keyspace;
        this.client.execute(req.body.query, function (err, result) {
            if (err) {
                var error = new Error('Bad Request');
                error.status = 400;
                error.message = err.message;
                error.name = err.name;
                next(error);
                return
            }
            res.json(result);
        });
    }
};

module.exports = Query;