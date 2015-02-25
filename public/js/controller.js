'use strict';

app.controller('AppCtrl', [
    '$scope',
    '$mdSidenav',
    function ($scope, $mdSidenav) {
        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };
    }
]);

app.controller('TextQueryController', [
    '$scope',
    '$http',
    function($scope, $http){
        $scope.inProgress = false;

        $scope.loadKeyspaces = function(){
            return $http.get('../api/').success(function (data) {
                var keyspaceNames = [];
                keyspaceNames.push("");
                for (var i = 0; i < data.length; i++) {
                    keyspaceNames.push(data[i].keyspace_name);
                }
                $scope.keyspaces = keyspaceNames;
            });
        };

        $scope.selectedKeysapce = '';
        $scope.executeQuery = function(){
            $scope.inProgress = true;
            $http.put('../api/'+$scope.selectedKeysapce, {query : $scope.query}).success(function(data){
                $scope.inProgress = false;
                $scope.queryResult = data;
            }).error(function(data){
                $scope.inProgress = false;
                $scope.queryResult = data;
            });
        };
    }
])

app.controller('explorer', [
    '$scope',
    '$http',
    function($scope, $http){
        $http.get('../api/').success(function (data) {
            var keyspaces = [];
            for (var i = 0; i < data.length; i++) {
                keyspaces.push({name: data[i].keyspace_name, columnFamilies:null});
            }
            $scope.keyspaces = keyspaces;
        });

        $scope.getColumnFamilies = function(keyspace){
            if(keyspace.columnFamilies === null){
                $http.get('../api/'+keyspace.name).success(function (data) {
                    var columnFamilies = [];
                    for (var i = 0; i < data.length; i++) {
                        columnFamilies.push({name: data[i].columnfamily_name, columns:null});
                    }
                    keyspace.columnFamilies = columnFamilies;
                });
            }
            else{
                keyspace.columnFamilies = null;
            }

        };

        $scope.getColumns = function(keyspace,columnFamily){
            if(columnFamily.columns === null){
                $http.get('../api/'+keyspace.name+'/'+columnFamily.name).success(function (data) {
                    var columns = [];
                    columnFamily.columns = data;
                });
            }
            else{
                columnFamily.columns = null;
            }

        };
    }
])

