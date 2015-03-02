var Browser = require('./browser');

/** `/browser/:keyspace/:column_family/rows/:row_key`
  * `GET` - fetch single row
  * `POST {columns:[{key: value}]}` - add new row
  * `PUT {columns:[{key: value}]}` - edit whole row
  * `DELETE` - delete row
  */
Browser.Row = {
    fetch: function (req, res, next) {
        Browser.client.keyspace = req.params.keyspace;

        var key = Browser.ColumnFamily.getKey(req, res, next);
        var query = ['SELECT * FORM', req.params.column_family,
                    "WHERE", key, '=', req.params.row_key].join(" ") + ";";

        Browser.executeQuery(query, res, next);
    },

    add: function (req, res, next) {
        Browser.client.keyspace = req.params.keyspace;
        var key = Browser.ColumnFamily.getKey(req, res, next);

        if (!req.body.columns ||
            req.body.columns.length != Browser.result[0].length) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "Column type is missing";
            next(error);
            return
        }

        var keys = [key],
            values = [req.params.row_key];

        for (var i in req.body.columns){
            keys.push(req.body.columns[i].key);
            values.push(req.body.columns[i].value);
        }

        console.log(req.body.columns.length, Browser.result[0].length);

        var query = ['INSERT INTO', req.params.column_family,
                    "(", keys.join(", "), ")",
                    'VALUES (', values.join(", "), ")"].join(" ") + ";";

        Browser.executeQuery(query, res, next);
    },

    edit: function (req, res, next) {
        Browser.client.keyspace = req.param.keyspace;
        var key = Browser.ColumnFamily.getKey(req, res, next);

        if (!req.body.columns ||
            req.body.columns.length != Browser.result[0].length) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "";
            next(error);
            return
        }

        console.log(req.body.columns.length, Browser.result[0].length);

        var query = ['UPDATE', req.params.column_family,
                    'USING', Browser.result, 'WITH', req.body.columns,
                    "WHERE", key, '=', req.params.row_key].join(" ") + ";";

        Browser.executeQuery(query, res, next);
    },

    delete: function (req, res, next) {
        Browser.client.keyspace = req.param.keyspace;

        var key = Browser.ColumnFamily.getKey(req, res, next);
        var query = ['DELETE FROM', req.params.column_family, key, '=', req.params.row_key].join(" ") + ";";

        Browser.executeQuery(query, res, next);
    }
};

module.exports = Browser;