var Browser = require('./browser');

Browser.Keyspace = {
    listColumnFamilies: function (req, res, next) {
        var query = 'SELECT * FROM system.schema_columnfamilies WHERE keyspace_name = ?;',
            params = [req.params.keyspace];

        Browser.executePreparedQuery(query, params, res, next);
    },

    add: function (req, res, next) {
        if (!req.body.replication || !req.body.replication.class ||
            (req.body.replication.class == 'SimpleStrategy' && !req.body.replication.replication_factor) ||
            (req.body.replication.class == 'NetworkTopologyStrategy' && Object.keys(req.body.replication).length == 1)) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "Wrong keyspace init parameters";
            next(error);
            return
        }
        var query = ["CREATE KEYSPACE", req.params.keyspace,
                "WITH replication", "=", Browser.objectToString(req.body.replication)].join(" ") + ";";

        Browser.executeQuery(query, res, next);
    },

    edit: function (req, res, next) {
        if (!req.body.replication) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "Replication parameter is missing";
            next(error);
            return
        }

        var query = ["ALTER KEYSPACE", req.params.keyspace,
                "WITH replication", "=", Browser.objectToString(req.body.replication)].join(" ") + ";";

        Browser.executeQuery(query, res, next);
    },

    delete: function (req, res, next) {
        var query = 'DROP KEYSPACE ' + req.params.keyspace;

        Browser.executeQuery(query, res, next);
    }
};

module.exports = Browser;