var app = angular.module('_options', []);

app.run(function() {});

app.controller("OptionsCtrl", ['$scope', '$http', function ($scope, $http) {

    // console.log('OptionsCtrl init');

    /**
     *  @TODO USE IT
     *  localStorage.clear();
     */

    $scope.hideHand             = localStorage.hideHand;
    $scope.hideChatIcon         = localStorage.hideChatIcon;
    $scope.soundLow             = localStorage.soundLow;
    $scope.showOnlyImportant    = localStorage.showOnlyImportant;

    $scope.method               = 'GET';

    $scope.urlFollowers         = 'http://coub.com/api/v2/action_subjects_data/followings_list';
    $scope.channelId            = '?id=' + "3484021";
    $scope.followersPageStr     = '&page=';
    $scope.followersPage        = 1;
    $scope.total_pages          = 1;
    $scope.users                = [];

    $scope.dataType             = 'json';

    $scope.loadOptions = function(arg) {

        // console.log(localStorage);

        /*
        * Get coub account and channels info
        * */
        $http({
            method: $scope.method,
            url: $scope.urlFollowers + $scope.channelId + $scope.followersPageStr + arg,
            dataType: $scope.dataType
        }).
        then(function(response) {

            $scope.followersPage        = response.data.page;
            $scope.total_pages          = response.data.total_pages;

            /*console.log(response.data.channels);*/

            /**
             * 	Only current channet background need
             */
            angular.forEach(response.data.channels, function (field, key) {

                if(field.i_follow_him === true && field.followers_count < 100 ) {

                    var user;
                    user = [
                        field.title,
                        field.description,
                        field.permalink,
                        field.followers_count,
                        field.id,
                        field.avatar_versions.template ? field.avatar_versions.template.replace('%{version}', 'small') : ''
                    ];

                    $scope.users.push(user);
                }
            });

            if($scope.total_pages > $scope.followersPage) {

                // $scope.loadOptions($scope.followersPage + 1);
            }

        }, function(data) {
            /*
            * Trow here
            * */
        });
    }

    $scope.loadOptions($scope.followersPage);

    // console.log($scope.users);

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

}]);