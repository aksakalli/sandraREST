var express = require('express');
var router = express.Router();

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1']});


var object_to_string = function(object){
    var array = [];
    for (var key in object)
        array.push(["", key, ": ", object[key], ""].join("\'"));
    return "{" + array.join(", ") + "}";
};

/**
 * List all keyspaces for this node
 */
router.get('/', function(req, res, next) {
    client.execute('select * from system.schema_keyspaces', function (err, result) {
        if(err !== null) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return
        }
        for(var i=0;i<result.rows.length;i++){
            result.rows[i].replication = JSON.parse(result.rows[i].strategy_options);
        }
        res.json(result.rows);
    });
});

/**
 * List all columnfamilies for given keyspace
 */
router.get('/:keyspace/', function(req, res, next) {
    var query = 'select keyspace_name, columnfamily_name from system.schema_columnfamilies where keyspace_name = ?',
        params = [req.params.keyspace];

    client.execute(query, params, {prepare: true}, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Create a keyspace
 */
router.post('/:keyspace/', function(req, res, next) {
    if (!req.body.replication ||
        !req.body.replication.class ||
        (req.body.replication.class == 'SimpleStrategy' && !req.body.replication.replication_factor) ||
        (req.body.replication.class == 'NetworkTopologyStrategy' && req.body.replication.length == 1)) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = 'missing or invalid parameters';
        next(error);
        return
    }
    var query = "CREATE KEYSPACE " + req.params.keyspace + " " +
                "WITH replication = " + object_to_string(req.body.replication) + ";";

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Update given keyspace
 */
router.put('/:keyspace/', function(req, res, next) {
    if (!req.body.replication) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = err.message;
        next(error);
        return
    }

    var query = "ALTER KEYSPACE " + req.params.keyspace + " " +
        "WITH replication = " + object_to_string(req.body.replication) + ";";

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Delete given keyspace
 */
router.delete('/:keyspace/', function(req, res, next) {
    var query = 'DROP KEYSPACE ' + req.params.keyspace;

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Get row data for given table
 */
router.get('/:keyspace/:table/', function(req, res, next) {
    client.keyspace = req.params.keyspace;
    var query = 'SELECT * FROM ' + req.params.table + ";";

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Create Table
 */
router.post('/:keyspace/:table/', function(req, res, next) {
    if (!req.body.columns ||
        !req.body.key ||
        req.body.columns.length == 0) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = err.message;
        next(error);
        return
    }
    client.keyspace = req.params.keyspace;

    var structure_string = [],
        option_string = [];

    for (var index in req.body.columns)
        structure_string.push(req.body.columns[index].name + " " + req.body.columns[index].type)

    for (var index in req.body.options) {
        if (req.body.options[index].name == 'compression')
            req.body.options[index].value = object_to_string(req.body.options[index].value);

        if (req.body.options[index].name == 'compaction')
            req.body.options[index].value = object_to_string(req.body.options[index].value);

        option_string.push(req.body.options[index].name + ' = ' + req.body.options[index].value);
    }

    structure_string = " (" + structure_string.join(", ") + ", PRIMARY KEY (" + req.body.key + "))";
    option_string = option_string.join(" AND ");

    var query = "CREATE TABLE " + req.params.table + structure_string +
        (option_string.length ? (" WITH" + option_string) : "") + ";";

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Update table
 */
router.put('/:keyspace/:table/', function(req, res, next) {
    if (!req.body.options ||
        req.body.options.length == 0) {
        var error = new Error('Bad Request');
        error.status = 400;
        error.message = err.message;
        next(error);
        return
    }
    client.keyspace = req.params.keyspace;

    var option_string = [];
    for (var index in req.body.options) {
        if (req.body.options[index].name == 'compression')
            req.body.options[index].value = object_to_string(req.body.options[index].value);

        if (req.body.options[index].name == 'compaction')
            req.body.options[index].value = object_to_string(req.body.options[index].value);

        option_string.push(req.body.options[index].name + ' = ' + req.body.options[index].value);
    }

    option_string = option_string.join(" AND ");

    var query = "ALTER TABLE " + req.params.table + " WITH " + option_string;

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Delete table
 */
router.delete('/:keyspace/:table/', function(req, res, next) {
    client.keyspace = req.params.keyspace;
    var query = 'DROP TABLE ' + req.params.table;

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Columns
 */
router.get('/:keyspace/:table/columns/', function(req, res, next) {
    var query = 'select * from system.schema_columns where keyspace_name = ? and columnfamily_name= ?';
    var params = [req.params.keyspace, req.params.table];

    client.execute(query, params, {prepare: true}, function (err, result) {
        if(err !== null) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return
        }
        res.json(result.rows);
    });
});

/**
 * Drop column
 */
router.delete('/:keyspace/:table/columns/:column', function(req, res, next) {
    client.keyspace = req.params.keyspace;
    var query = 'ALTER TABLE ' + req.params.table + ' DROP ' + req.params.column ;

    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Create column
 */
router.post('/:keyspace/:table/columns/:column', function(req, res, next) {
    client.keyspace = req.params.keyspace;
    var query = 'ALTER TABLE ' + req.params.table + ' ADD ' + req.params.column + ' ' + req.body.type;
    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
    });
});

/**
 * Update column ALTER TABLE monsters.addamsFamily ALTER lastKnownLocation TYPE uuid;
 */
router.put('/:keyspace/:table/columns/:column', function(req, res, next) {
    client.keyspace = req.params.keyspace;
    var query = 'ALTER TABLE ' + req.params.table + ' ALTER ' + req.params.column + ' TYPE ' + req.body.type;
    client.execute(query, function(err, result){
        if (err) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = err.message;
            next(error);
            return;
        }
        res.json(result.rows);
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