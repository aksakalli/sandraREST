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
        $http.get('../api/').success(function (data) {
            var keyspaceNames = new Array();
            keyspaceNames.push("");
            for (var i = 0; i < data.length; i++) {
                keyspaceNames.push(data[i].keyspace_name);
            }
            $scope.keyspaces = keyspaceNames;
        });
        $scope.neighborhoods = ['Chelsea', 'Financial District', 'Midtown', 'West Village', 'Williamsburg'];
        $scope.selectedKeysapce = ""
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
