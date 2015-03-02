var config =    require("../cassandra_config.json"),
    Browser =   require("../routes/browser");
                require("../routes/keyspace");
                require("../routes/column_family");
                require("../routes/column");
                //require("../routes/row");
                //require("../routes/cell");

Browser.setup(config);

var simple_req = {params: {}, body:{}},
    simple_res = {json: function(data){}},
    simple_next = function(error){ throw error };

exports.testAddKeyspace = {
    positiveTest: function (test) {
        simple_req = {
            params: {
                keyspace: "positiveTest"
            },
            body: {
                replication: {
                    class: "SimpleStrategy",
                    replication_factor: 3
                }
            }
        };

        test.doesNotThrow(function () {
            Browser.Keyspace.add(simple_req, simple_res, simple_next)
        });
        test.done();
    },
    negativeTest1: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest1"
            },
            body: {}
        };

        test.throws(function () {
            Browser.Keyspace.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    },
    negativeTest2: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest2"
            },
            body: {
                replication: {}
            }
        };

        test.throws(function () {
            Browser.Keyspace.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    },
    negativeTest3: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest3"
            },
            body: {
                replication: {
                    class: "SimpleStrategy",
                    secondAttr: {}
                }
            }
        };

        test.throws(function () {
            Browser.Keyspace.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    },
    negativeTest4: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest4"
            },
            body: {
                replication: {
                    class: "NetworkTopologyStrategy"
                }
            }
        };

        test.throws(function () {
            Browser.Keyspace.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    }
};

exports.editAddKeyspace = {
    positiveTest: function (test) {
        simple_req = {
            params: {
                keyspace: "positiveTest"
            },
            body: {
                replication: {
                    class: "SimpleStrategy",
                    replication_factor: 3
                }
            }
        };

        test.doesNotThrow(function () {
            Browser.Keyspace.edit(simple_req, simple_res, simple_next)
        });
        test.done();
    },
    negativeTest1: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest1"
            },
            body: {}
        };

        test.throws(function () {
            Browser.Keyspace.edit(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    }
};

exports.testAddColumnFamily = {
    positiveTest: function (test) {
        simple_req = {
            params: {
                keyspace: "positiveTest",
                column_family: "positiveTest"
            },
            body: {
                columns: [
                    {name: 'id', type: 'uuid'}
                ],
                key: "id"
            }
        };

        test.doesNotThrow(function () {
            Browser.ColumnFamily.add(simple_req, simple_res, simple_next)
        });
        test.done();
    },
    negativeTest1: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest1",
                column_family: "negativeTest1"
            },
            body: {
                key: "id"
            }
        };

        test.throws(function () {
            Browser.ColumnFamily.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    },
    negativeTest2: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest2",
                column_family: "negativeTest2"
            },
            body: {
                columns: [
                    {name: 'id', type: 'uuid'}
                ]
            }
        };

        test.throws(function () {
            Browser.ColumnFamily.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    },
    negativeTest3: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest3",
                column_family: "negativeTest3"
            },
            body: {
                columns: [],
                key: "id"
            }
        };

        test.throws(function () {
            Browser.ColumnFamily.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    }
};

exports.testEditColumnFamily = {
    positiveTest: function (test) {
        simple_req = {
            params: {
                keyspace: "positiveTest",
                column_family: "positiveTest"
            },
            body: {
                options: [
                    {name: 'comment', value: 'Positive test'}
                ]
            }
        };

        test.doesNotThrow(function () {
            Browser.ColumnFamily.edit(simple_req, simple_res, simple_next)
        });
        test.done();
    },
    negativeTest1: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest1",
                column_family: "negativeTest1"
            },
            body: {}
        };

        test.throws(function () {
            Browser.ColumnFamily.edit(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    },
    negativeTest2: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest2",
                column_family: "negativeTest2"
            },
            body: {
                options: []
            }
        };

        test.throws(function () {
            Browser.ColumnFamily.edit(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    }
};

exports.testAddColumn = {
    positiveTest: function (test) {
        simple_req = {
            params: {
                keyspace: "positiveTest",
                column_family: "positiveTest",
                column: "positiveTest"
            },
            body: {
                type: "varchar"
            }
        };

        test.doesNotThrow(function () {
            Browser.Column.add(simple_req, simple_res, simple_next)
        });
        test.done();
    },
    negativeTest1: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest1",
                column_family: "negativeTest1",
                column: "negativeTest1"
            },
            body: {}
        };

        test.throws(function () {
            Browser.Column.add(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    }
};

exports.testEditColumn = {
    positiveTest: function (test) {
        simple_req = {
            params: {
                keyspace: "positiveTest",
                column_family: "positiveTest",
                column: "positiveTest"
            },
            body: {
                type: "varchar"
            }
        };

        test.doesNotThrow(function () {
            Browser.Column.edit(simple_req, simple_res, simple_next)
        });
        test.done();
    },
    negativeTest1: function (test) {
        simple_req = {
            params: {
                keyspace: "negativeTest1",
                column_family: "negativeTest1",
                column: "negativeTest1"
            },
            body: {}
        };

        test.throws(function () {
            Browser.Column.edit(simple_req, simple_res, simple_next)
        }, Error);
        test.done();
    }
};