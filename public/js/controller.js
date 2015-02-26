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
        /*
        $scope.codemirrorLoaded = function(_editor){
            var $editor = angular.element(document.getElementsByClassName('CodeMirror'));
            $editor.addClass('md-input');
            $editor.css({
                'border-style': 'solid',
                'height': '2em'
            });

            _editor.on("focus", function(){ $editor.parent().addClass('md-input-focused');    });
            _editor.on("blur", function() { $editor.parent().removeClass('md-input-focused'); });
        };*/

        //dummy query
        $scope.cqlQuery ='select * from users';
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
            console.log($scope.ebeler);
            $scope.inProgress = true;
            $http.put('../api/'+$scope.selectedKeysapce, {query : $scope.cqlQuery}).success(function(data){
                $scope.inProgress = false;
                $scope.queryResult = data;
            }).error(function(data){
                $scope.inProgress = false;
                $scope.queryResult = data;
            });
        };
    }
]);

app.controller('Explorer', [
    '$scope',
    '$http',
    '$mdDialog',
    function($scope, $http, $mdDialog){

        var init = function() {
            $http.get('../api/').success(function (data) {
                var keyspaces = [];
                for (var i = 0; i < data.length; i++) {
                    keyspaces.push({name: data[i].keyspace_name, columnFamilies:null, isActive:false});
                }
                $scope.keyspaces = keyspaces;
            });

            $scope.currentItem = null;
        };
        init();
        $scope.refresh = function(){
            init();
        };

        $scope.setCurrentItem = function(item){
            $scope.currentItem = item;
        };

        $scope.getColumnFamilies = function(keyspace){
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

        $scope.showConfirm = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .content('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .ok('Please do it!')
                .cancel('Sounds like a scam')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                $scope.alert = 'You decided to get rid of your debt.';
            }, function() {
                $scope.alert = 'You decided to keep your debt.';
            });
        };
    }
]);

