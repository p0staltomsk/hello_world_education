var app = angular.module('_options', []);

app.run(function() {});

app.controller("OptionsCtrl", ['$scope', function ($scope) {

    console.log('OptionsCtrl init');

    /**
     *  @TODO USE IT
     *  localStorage.clear();
     */
    $scope.loadOptions = function() {
        console.log(localStorage);
        $scope.hideHand             = localStorage.hideHand;
        $scope.hideChatIcon         = localStorage.hideChatIcon;
        $scope.soundLow             = localStorage.soundLow;
        $scope.showOnlyImportant    = localStorage.showOnlyImportant;
    }

    /**
     *
     */
    $scope.saveOptions = function() {

        var field = document.getElementById("hideHand");
        localStorage.hideHand = field.checked;

        var field = document.getElementById("hideChatIcon");
        localStorage.hideChatIcon = field.checked;

        var field = document.getElementById("soundLow");
        localStorage.soundLow = field.checked;

        var field = document.getElementById("showOnlyImportant");
        localStorage.showOnlyImportant = field.checked;
    }

    $scope.loadOptions();

}]);