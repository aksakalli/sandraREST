var router =    require('express').Router(),
    config =    require('../cassandra_config.json'),
    Connect,
    Query =     require('./query'),
    Browser =   require('./browser');
                require('./keyspace');
                require('./column_family');
                require('./column');
                //require('./row');
                //require('./cell');

Connect = {
    config: [],

    setup: function(config) {
        this.config = config;

        Query.setup(config);
        Browser.setup(config);
    },

    list: function (req, res) {
        res.json(Connect.config);
    },

    add: function (req, res, next) {
        if (!req.body.address || !req.body.address.length) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "No IP address supplied.";
            next(error);
            return
        }

        Connect.config.contactPoints.push(req.body.address);

        Connect.setup(Connect.config);

        res.json(Connect.config.contactPoints);
    },

    change: function (req, res, next) {
        if (!req.body.address || !req.body.address.length) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "No IP address supplied.";
            next(error);
            return
        }

        Connect.config.contactPoints = req.body.address;

        Connect.setup(Connect.config);

        res.json(Connect.config.contactPoints);
    },

    delete: function (req, res, next) {
        if (!req.body.address || !req.body.address.length) {
            var error = new Error('Bad Request');
            error.status = 400;
            error.message = "No IP address supplied.";
            next(error);
            return
        }

        for (var i in req.body.address)
            if (req.body.address[i] in Connect.config)
                Connect.config.contactPoints.slice(Connect.config.contactPoints.indexOf(req.body.address[i]));

        Connect.setup(Connect.config);

        res.json(Connect.config.contactPoints);
    }
};

Connect.setup(config);

router.get(     '/connect/',                                                Connect.list);
router.post(    '/connect/',                                                Connect.add);
router.put(     '/connect/',                                                Connect.change);
router.delete(  '/connect/',                                                Connect.delete);

router.put(     '/query/',                                                  Query.executeGlobaly);
router.put(     '/query/:keyspace',                                         Query.executeOnKeyspace);

router.get(     '/browser/',                                                Browser.listKeyspaces);

router.get(     '/browser/:keyspace/',                                      Browser.Keyspace.listColumnFamilies);
router.post(    '/browser/:keyspace/',                                      Browser.Keyspace.add);
router.put(     '/browser/:keyspace/',                                      Browser.Keyspace.edit);
router.delete(  '/browser/:keyspace/',                                      Browser.Keyspace.delete);

router.get(     '/browser/:keyspace/:column_family/',                       Browser.ColumnFamily.view);
router.post(    '/browser/:keyspace/:column_family/',                       Browser.ColumnFamily.add);
router.put(     '/browser/:keyspace/:column_family/',                       Browser.ColumnFamily.edit);
router.delete(  '/browser/:keyspace/:column_family/',                       Browser.ColumnFamily.delete);

router.get(     '/browser/:keyspace/:column_family/columns/',               Browser.ColumnFamily.listColumns);

router.get(     '/browser/:keyspace/:column_family/columns/:column/',       Browser.Column.getProperties);
router.post(    '/browser/:keyspace/:column_family/columns/:column/',       Browser.Column.add);
router.put(     '/browser/:keyspace/:column_family/columns/:column/',       Browser.Column.edit);
router.delete(  '/browser/:keyspace/:column_family/columns/:column/',       Browser.Column.delete);

router.get(     '/browser/:keyspace/:column_family/rows/',                  Browser.ColumnFamily.view);

//router.get(     '/browser/:keyspace/:column_family/rows/:row_key/',         Browser.Row.fetch);
//router.post(    '/browser/:keyspace/:column_family/rows/:row_key/',         Browser.Row.add);
//router.put(     '/browser/:keyspace/:column_family/rows/:row_key/',         Browser.Row.edit);
//router.delete(  '/browser/:keyspace/:column_family/rows/:row_key/',         Browser.Row.delete);

//router.get(     '/browser/:keyspace/:column_family/rows/:row_key/:column/', Browser.Cell.fetch);
//router.post(    '/browser/:keyspace/:column_family/rows/:row_key/:column/', Browser.Cell.add);
//router.put(     '/browser/:keyspace/:column_family/rows/:row_key/:column/', Browser.Cell.edit);
//router.delete(  '/browser/:keyspace/:column_family/rows/:row_key/:column/', Browser.Cell.delete);

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