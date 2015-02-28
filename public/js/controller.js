'use strict';

var sanraControllers = angular.module('sanraControllers', []);

sanraControllers.controller('AppCtrl', [
    '$scope',
    '$mdSidenav',
    function ($scope, $mdSidenav) {
        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };
    }
]);

sanraControllers.controller('TextQueryController', [
    '$scope',
    'Keyspace',
    'CQL',
    function ($scope, Keyspace, CQL) {
        $scope.codemirrorLoaded = function (_editor) {
            _editor.setOption('mode', 'text/x-cassandra');
            _editor.setOption('lineWrapping', true);
            _editor.setSize(null, 'auto');

            var element = angular.element(_editor.doc.cm.getWrapperElement());
            element.addClass('md-input');
        };

        //dummy query
        $scope.cqlQuery = 'select * from users';
        $scope.inProgress = false;

        //TODO: still buggy
        $scope.loadKeyspaces = function () {

            $scope.keyspaces = Keyspace.query();
/*
            return $scope.keyspaces = Keyspace.query().$promise.then(
                function(a){
                    $scope.keyspaces =a;
                }

            );*/
            /*$scope.keyspaces = null;
            return Keyspace.query(function (keyspaces) {
                //keyspaces.unshift({keyspace_name: ''});
                $scope.keyspaces = keyspaces;
            }).$q;*/
        };

        $scope.selectedKeyspaceName = '';
        $scope.executeQuery = function () {
            $scope.inProgress = true;
            CQL.query({'keyspace': $scope.selectedKeyspaceName, query: $scope.cqlQuery}, function (result) {
                $scope.inProgress = false;
                $scope.queryResult = result;
            }, function (result) {
                //query error result
                $scope.inProgress = false;
                $scope.queryResult = result.data;
            });
        };
    }
]);

sanraControllers.controller('Explorer', [
    '$scope',
    '$mdDialog',
    'Keyspace',
    'ColumnFamily',
    'Column',
    function ($scope, $mdDialog, Keyspace, ColumnFamily, Column) {
        var init = function () {
            $scope.keyspaces = Keyspace.query();
            $scope.currentItem = null;
        };
        init();

        $scope.refresh = function () {
            init();
        };

        $scope.setCurrentItem = function (item) {
            $scope.currentItem = item;
        };

        $scope.getColumnFamilies = function (keyspace) {
            if (!keyspace.isActive) {
                keyspace.columnFamilies = ColumnFamily.query({keyspace: keyspace.keyspace_name});
                keyspace.isActive = true;
            }
            else {
                keyspace.isActive = false;
            }
        };

        $scope.getColumns = function (keyspace, columnFamily) {
            if (!columnFamily.isActive) {
                columnFamily.columns = Column.query({
                    keyspace: keyspace.keyspace_name,
                    columnFamily: columnFamily.columnfamily_name
                });
                columnFamily.isActive = true;
            }
            else {
                columnFamily.isActive = false;
            }
        };

        $scope.selectColumn = function (column) {
            $scope.currentItem = column;
        };

        $scope.showConfirm = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('Drop the Keyspace')
                .content('Are you sure you want to drop the keyspace?')
                .ariaLabel('Lucky day')
                .ok('Yes, drop it')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                //yes
            }, function () {
                //no
            });
        };
    }
]);

