var express = require('express');
var router = express.Router();

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1']});


/**
 * List all keyspaces for this node
 */
router.get('/', function(req, res, next) {
    client.execute('select keyspace_name from system.schema_keyspaces', function (err, result) {
        if(err !== null) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return
        }
        var keyspaces = result.rows;
        res.json(keyspaces);
    });
});

/**
 * List all column_families for given key_space
 */
router.get('/:keyspace/', function(req, res, next) {
    var query = 'select keyspace_name, columnfamily_name from system.schema_columnfamilies where keyspace_name = ?';
    var params = [req.params.keyspace];

    client.execute(query, params, {prepare: true}, function (err, result) {
        if(err !== null) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return
        }
        var columnfamilies = result.rows;
        res.json(columnfamilies);
    });
});

/**
 * List all columns for given column family
 */
router.get('/:keyspace/:columnfamily/', function(req, res, next) {
    var query = 'select * from system.schema_columns where keyspace_name = ? and columnfamily_name= ?';
    var params = [req.params.keyspace, req.params.columnfamily];

    client.execute(query, params, {prepare: true}, function (err, result) {
        if(err !== null) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return
        }
        var columns = result.rows;
        res.json(columns);
    });
});

/**
 * Fetch data rows from given column_family
 */
router.get('/:keyspace/:columnfamily/select', function(req, res, next) {
    var query = 'select * from ' + req.params.keyspace + '.' + req.params.columnfamily;

    client.execute(query,  function (err, result) {
        if(err !== null) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        var columns = result.rows;
        res.json(columns);
    });
});


/**
 * Execute a query
 */
router.put('/', function(req, res, next) {
    if(req.body.query === undefined) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = "query parameter is missing";
        error.name = "missing parameter";
        next(error);
        return
    }

    client.execute(req.body.query, function (err, result) {
        if(err !== null) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            error.name = err.name;
            next(error);
            return
        }
        res.json(result);
    });
});

/**
 * Execute a query for given keyspace
 */
router.put('/:keyspace/', function(req, res, next) {
    client.keyspace = req.params.keyspace;
    client.execute(req.body.query, function (err, result) {
    if(err !== null) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = err.message;
        error.name = err.name;
        next(error);
        return
    }
    res.json(result);
    });
});


router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err.name
    });
});



module.exports = router;