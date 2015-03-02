var Browser = require('./browser');

Browser.Column = {
    getProperties: function (req, res, next) {
        var query = 'SELECT * FROM system.schema_columns WHERE keyspace_name = ? AND columnfamily_name = ? AND column_name = ?;',
            params = [req.params.keyspace, req.params.column_family, req.params.column];

        //var query = 'SELECT * FROM system.schema_columns WHERE keyspace_name = :keyspace AND columnfamily_name = :column_family AND column_name = :column;',
        //    params = req.params;

        Browser.executePreparedQuery(query, params, res, next);
    },

    add: function (req, res, next) {
        if (!req.body.type) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "Column type is missing.";
            next(error);
            return
        }

        Browser.client.keyspace = req.params.keyspace;
        var query = ['ALTER TABLE', req.params.column_family,
                    'ADD', req.params.column, req.body.type].join(" ") + ';';

        Browser.executeQuery(query, res, next);
    },

    edit: function (req, res, next) {
        if (!req.body.type) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "Column type is missing";
            next(error);
            return
        }

        Browser.client.keyspace = req.params.keyspace;

        var query = ['ALTER TABLE', req.params.column_family,
                    'ALTER', req.params.column, 'TYPE', req.body.type].join(" ") + ';';

        Browser.executeQuery(query, res, next);
    },

    delete: function (req, res, next) {
        Browser.client.keyspace = req.params.keyspace;

        var query = ['ALTER TABLE', req.params.column_family,
                    'DROP', req.params.column].join(" ") + ';';

        Browser.executeQuery(query, res, next);
    }
};

module.exports = Browser;