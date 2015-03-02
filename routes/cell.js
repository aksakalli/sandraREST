var Browser = require('./browser');

/** `/browser/:keyspace/:column_family/rows/:row_key/:column`
  * `GET` - get cell
  * ~~`POST {name: String}`~~
  * `PUT {name: String}` - Edit row value
  * ~~`DELETE`~~
  */

Browser.prototype.Cell = {};

Browser.prototype.Cell.fetch = function(req, res, next) {
    var query = 'SELECT * FROM system.schema_columns WHERE keyspace_name = ? AND columnfamily_name = ? AND column_name = ?;',
        params = [req.params.keyspace, req.params.column_family, req.params.column];

    //var query = 'SELECT * FROM system.schema_columns WHERE keyspace_name = :keyspace AND columnfamily_name = :column_family AND column_name = :column;',
    //    params = req.params;

    this.executePreparedQuery(query, params, res, next);
};

Browser.prototype.Cell.add = function(req, res, next) {
    if (!req.body.type) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = err.message;
        next(error);
        return
    }

    this.client.keyspace = req.param.keyspace;
    var query = ['SELECT * FROM ', req.params.column_family, 'WHERE', req.params.column, req.body.type].join(" ") + ';';

    this.executePreparedQuery(query, params, res, next);
};

Browser.prototype.Cell.edit = function(req, res, next) {
    if (!req.body.type) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = err.message;
        next(error);
        return
    }

    this.client.keyspace = req.param.keyspace;

    var query = ['ALTER TABLE', req.params.column_family, 'ALTER', req.params.column, 'TYPE' , req.body.type].join(" ") + ';';

    this.executePreparedQuery(query, params, res, next);
};

Browser.prototype.Cell.delete = function(req, res, next) {
    this.client.keyspace = req.param.keyspace;

    var query = ['ALTER TABLE', req.params.column_family, 'DROP', req.params.column].join(" ") + ';';

    this.executePreparedQuery(query, params, res, next);
};

module.exports = Browser;