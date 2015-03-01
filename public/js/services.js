'use strict';

var sandraServices = angular.module('sandraServices', ['ngResource']);

sandraServices.factory('Keyspace', ['$resource',
    function ($resource) {
        return $resource('/browser/:keyspace', {keyspace:'@keyspace_name'}, {
            query: {method: 'GET', params:{keyspace_name:''}, isArray: true},
            update: {method: 'PUT'},
            save: {method: 'POST'}
        });
    }]);

sandraServices.factory('ColumnFamily', ['$resource',
    function ($resource) {
        return $resource('/browser/:keyspace/:columnFamily', {keyspace:'@keyspace_name',columnFamily:'@columnfamily_name'}, {
            query: {method: 'GET', params:{columnFamily:''}, isArray: true}
        });
    }]);

sandraServices.factory('Column', ['$resource',
    function ($resource) {
        return $resource('/browser/:keyspace/:columnFamily/columns/:column', {keyspace:'@keyspace_name',columnFamily:'@columnfamily_name',column:'@column_name'}, {
            query: {method: 'GET', params:{column:''}, isArray: true}
        });
    }]);

sandraServices.factory('CQL', ['$resource',
    function ($resource) {
        return $resource('/query/:keyspace/', {keyspace: '@keyspace'}, {
            query: {method: 'PUT'}
        });
    }]);

sandraServices.factory('Utilities', [
    function () {
        var utils = {};
        utils.strategyClassOptions = ['SimpleStrategy','NetworkTopologyStrategy'];
        utils.cqlDataTypes = ['ascii','bigint','blob','boolean','counter','decimal','double','float','int','text','timestamp','uuid','timeuuid','varchar','varint'];

        return utils;
    }]);