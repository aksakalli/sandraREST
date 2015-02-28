'use strict';

var sandraServices = angular.module('sandraServices', ['ngResource']);

sandraServices.factory('Keyspace', ['$resource',
    function ($resource) {
        return $resource('/browser/', {}, {
            query: {method: 'GET', isArray: true}
        });
    }]);

sandraServices.factory('ColumnFamily', ['$resource',
    function ($resource) {
        return $resource('/browser/:keyspace', {}, {
            query: {method: 'GET', isArray: true}
        });
    }]);

sandraServices.factory('Column', ['$resource',
    function ($resource) {
        return $resource('/browser/:keyspace/:columnFamily/columns', {}, {
            query: {method: 'GET', isArray: true}
        });
    }]);

sandraServices.factory('CQL', ['$resource',
    function ($resource) {
        return $resource('/query/:keyspace/', {keyspace: '@keyspace'}, {
            query: {method: 'PUT'}
        });
    }]);