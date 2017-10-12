var app = angular.module('_options', []);

app.run(function() {});

app.controller("OptionsCtrl", ['$scope', function ($scope) {

    $scope.buyAlert = localStorage.buyAlert ? localStorage.buyAlert : '';

    console.log('OptionsCtrl init');

    $scope.change = function() {

        localStorage.buyAlert = $scope.buyAlert = $scope.buyAlert;
        console.log('change function localStorage.buyAlert', localStorage.buyAlert);
    };

}]);