var Browser = require('./browser');

Browser.ColumnFamily = {

    view: function (req, res, next) {
        Browser.client.keyspace = req.params.keyspace;
        var query = 'SELECT * FROM ' + req.params.column_family + ";";

        Browser.executeQuery(query, res, next);
    },

    listColumns: function (req, res, next) {
        //console.log(result.meta.columns);
        var query = 'SELECT * FROM system.schema_columns WHERE keyspace_name = ? AND columnfamily_name = ?;',
            params = [req.params.keyspace, req.params.column_family];

        Browser.executePreparedQuery(query, params, res, next);
    },

    getKey: function (req, res, next) {
        this.listColumns(req, res, next);

        var key = [];
        for (var column in Browser.result)
            if (Browser.result[column].type == "partition_key")
                key.append(Browser.result[column].column_name);

        return key[0];
    },

    listRows: function (req, res, next) {
    },

    add: function (req, res, next) {
        if (!req.body.columns ||
            !req.body.key ||
            !req.body.columns.length) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "";
            next(error);
            return
        }
        Browser.client.keyspace = req.params.keyspace;

        var structure_string = [],
            option_string = [];

        for (var index in req.body.columns)
            structure_string.push(req.body.columns[index].name + " " + req.body.columns[index].type)

        for (var index in req.body.options) {
            if (req.body.options[index].name == 'compression')
                req.body.options[index].value = Browser.objectToString(req.body.options[index].value);

            if (req.body.options[index].name == 'compaction')
                req.body.options[index].value = Browser.objectToString(req.body.options[index].value);

            option_string.push(req.body.options[index].name + ' = ' + req.body.options[index].value);
        }

        structure_string = "(" + structure_string.join(", ") + ", PRIMARY KEY (" + req.body.key + "))";
        option_string = option_string.join(" AND ");

        var query = ["CREATE TABLE", req.params.column_family, structure_string].join(" ") +
            (option_string.length ? (" WITH" + option_string) : "") + ";";

        Browser.executeQuery(query, res, next);
    },

    edit: function (req, res, next) {
        if (!req.body.options ||
            !req.body.options.length) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "Options parameter is not defined properly";
            next(error);
            return
        }
        Browser.client.keyspace = req.params.keyspace;

        var option_string = [];
        for (var index in req.body.options) {
            if (req.body.options[index].name == 'compression')
                req.body.options[index].value = Browser.objectToString(req.body.options[index].value);

            if (req.body.options[index].name == 'compaction')
                req.body.options[index].value = Browser.objectToString(req.body.options[index].value);

            option_string.push(req.body.options[index].name + ' = ' + req.body.options[index].value);
        }

        option_string = option_string.join(" AND ");

        var query = ["ALTER TABLE", req.params.column_family, "WITH", option_string].join(" ");

        Browser.executeQuery(query, res, next);
    },

    delete: function (req, res, next) {
        Browser.client.keyspace = req.params.keyspace;
        var query = 'DROP TABLE ' + req.params.column_family;

        Browser.executeQuery(query, res, next);
    }
};

module.exports = Browser;