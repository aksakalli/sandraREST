var express = require('express');
var router = express.Router();

var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['127.0.0.1']});


/**
 * Execute a query
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