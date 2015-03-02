var cassandra = require('cassandra-driver');

var Browser = {
    client: {},
    result: {},

    setup: function (config) {
        if (this.client.shutdown)
            this.client.shutdown();

        this.client = new cassandra.Client(config);
    },

    listKeyspaces: function (req, res, next) {
        var query = 'SELECT * FROM system.schema_keyspaces;';

        Browser.executeQuery(query, res, next);
    },

    objectToString: function (object) {
        var array = [];
        for (var key in object)
            array.push(["", key, ": ", object[key], ""].join("\'"));
        return "{" + array.join(", ") + "}";
    },

    executeQuery: function (query, res, next) {
        Browser.client.execute(query, function (err, result) {
            if (err !== null) {
                var error = new Error('Bad Request');
                error.status = 400;
                error.message = err.message;
                next(error);
                return
            }
            //Browser.result = result.rows;
            res.json(result.rows);
        });
    },

    executePreparedQuery: function (query, params, res, next) {
        Browser.client.execute(query, params, {prepare: true}, function (err, result) {
            if (err !== null) {
                var error = new Error('Bad Request');
                error.status = 400;
                error.message = err.message;
                next(error);
                return
            }
            //Browser.result = result.rows;
            res.json(result.rows);
        });
    }
};

module.exports = Browser;