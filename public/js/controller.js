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
        $scope.codemirrorLoaded = function(_editor){
            var $editor = angular.element(document.getElementsByClassName('CodeMirror'));
            $editor.addClass('md-input');
            $editor.css({
                'border-style': 'solid',
                'height': '2em'
            });

            _editor.on("focus", function(){ $editor.parent().addClass('md-input-focused');    });
            _editor.on("blur", function() { $editor.parent().removeClass('md-input-focused'); });
        };

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
]);

app.controller('explorer', [
    '$scope',
    '$http',
    function($scope, $http){
        $http.get('../api/').success(function (data) {
            var keyspaces = [];
            for (var i = 0; i < data.length; i++) {
                keyspaces.push({name: data[i].keyspace_name, columnFamilies:null, isActive:false});
            }
            $scope.keyspaces = keyspaces;
        });

        $scope.currentItem = null;

        $scope.getColumnFamilies = function(keyspace){
            $scope.currentItem = keyspace;
            if(keyspace.isActive === false){
                $http.get('../api/'+keyspace.name).success(function (data) {
                    var columnFamilies = [];
                    for (var i = 0; i < data.length; i++) {
                        columnFamilies.push({name: data[i].columnfamily_name, columns:null, isActive:false});
                    }
                    keyspace.columnFamilies = columnFamilies;
                    keyspace.isActive = true;
                });
            }
            else{
                keyspace.isActive = false;
            }

        };

        $scope.getColumns = function(keyspace,columnFamily){
            $scope.currentItem = columnFamily;
            if(columnFamily.isActive === false){
                $http.get('../api/'+keyspace.name+'/'+columnFamily.name).success(function (data) {
                    var columns = [];
                    columnFamily.columns = data;
                    columnFamily.isActive = true;
                });
            }
            else{
                columnFamily.isActive = false;
            }
        };

        $scope.selectColumn = function(column){
            $scope.currentItem = column;
        }
    }
]);

