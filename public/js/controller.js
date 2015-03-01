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

        $scope.loadKeyspaces = function () {
            Keyspace.query(function (keyspaces) {
                keyspaces.unshift({keyspace_name: ''});
                $scope.keyspaces = keyspaces;
            });
        };

        $scope.selectedKeyspaceName = '';
        $scope.executeQuery = function () {
            $scope.inProgress = true;
            CQL.query({'keyspace': $scope.selectedKeyspaceName, query: $scope.cqlQuery}, function (result) {
                $scope.inProgress = false;
                $scope.queryResult = result;
            }, function (answer) {
                //query error result
                $scope.inProgress = false;
                $scope.queryResult = answer.data;
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

        $scope.dropKeyspace = function(keyspace){
            var confirm = $mdDialog.confirm()
                .title('Drop the Keyspace')
                .content('Are you sure you want to drop "'+ keyspace.keyspace_name +'"?')
                .ariaLabel('Drop')
                .ok('Yes, drop it')
                .cancel('Cancel');

            $mdDialog.show(confirm).then((function(k){
                return function(){
                    var keyspace = new Keyspace({ 'keyspace_name' : k.keyspace_name });
                    keyspace.$delete(function(){
                        init();
                    },function(answer){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .title(answer.data.error)
                                .content(answer.data.message)
                                .ariaLabel(answer.data.error)
                                .ok('Ok')
                        );
                    });
                }
            })(keyspace));

        };

        $scope.addUpdateKeyspace = function(initialKeyspace){
            $mdDialog.show({
                controller: AddUpdateKeyspaceController,
                templateUrl: 'partials/dialogforms/keyspace.html',
                locals : { initialKeyspace : initialKeyspace }
            }).then(function() {
                init();
            });

            function AddUpdateKeyspaceController($scope, $mdDialog,Keyspace, initialKeyspace){
                $scope.strategyClassOptions = ['SimpleStrategy','NetworkTopologyStrategy'];
                console.log(initialKeyspace);
                if(initialKeyspace){
                    $scope.operationType = 'Update';
                    initialKeyspace.replication.replication_factor = parseInt(initialKeyspace.replication.replication_factor);
                    initialKeyspace.replication.class = 'SimpleStrategy';
                }
                else{
                    $scope.operationType = 'Create';
                    initialKeyspace = {
                        keyspace_name: '',
                        replication: {
                            class:'SimpleStrategy',
                            replication_factor:''
                        }
                    };
                }
                $scope.keyspace = initialKeyspace;

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function() {
                    if(!$scope.keyspace.keyspace_name){
                        $scope.errorMessage = 'please fill the name field';
                        return;
                    }
                    var keyspace = new Keyspace($scope.keyspace);
                    if($scope.operationType == 'Update'){
                        keyspace.$update({},function(a){
                            $mdDialog.hide(a);
                        },function(answer){
                            $scope.errorMessage = answer.data.message;
                        });
                    }else{
                        keyspace.$save({},function(a){
                            $mdDialog.hide(a);
                        },function(answer){
                            $scope.errorMessage = answer.data.message;
                        });
                    }

                };
            }
            AddUpdateKeyspaceController.$inject = ['$scope', '$mdDialog','Keyspace','initialKeyspace'];
        };

        $scope.dropColumnFamily = function(columnFamily){
            var confirm = $mdDialog.confirm()
                .title('Drop the Column Family')
                .content('Are you sure you want to drop "'+ columnFamily.columnfamily_name +'"?')
                .ariaLabel('Drop')
                .ok('Yes, drop it')
                .cancel('Cancel');

            $mdDialog.show(confirm).then((function(c){
                return function(){
                    var columnFamily = new ColumnFamily({
                        'keyspace_name' : c.keyspace_name,
                        'columnfamily_name' : c.columnfamily_name
                    });
                    columnFamily.$delete(function(){
                        init();
                    },function(answer){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .title(answer.data.error)
                                .content(answer.data.message)
                                .ariaLabel(answer.data.error)
                                .ok('Ok')
                        );
                    });
                }
            })(columnFamily));

        };
    }
]);



