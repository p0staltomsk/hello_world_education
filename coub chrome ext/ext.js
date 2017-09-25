if(window.angular === undefined) {

    console.log('Coub Ext.js init 👊');
    //console.log(this.document.all);

    chrome.runtime.sendMessage({ "newIconPath" : 1 });

    /*.viewer.viewer--v2 .viewer__hand*/

    /*chrome.runtime.onInstalled.addListener(function() {
        console.log('chrome.runtime.onInstalled.addListener ext.js init');
    });*/

} else {

    console.log('Coub Ext.js init 👊');
    chrome.runtime.sendMessage({ "newIconPath" : 0 });

    var app = angular.module('_popup', []);

    app.run(function () {});

    app.controller("PopupCtrl", ['$scope', '$http', function ($scope, $http) {

        console.log('PopupCtrl init');

        $scope.serverUrl = 'http://coub.com';

        $scope.page = 1;
        $scope.per_page = 50;
        $scope.method = 'GET';
        $scope.response = null;
        $scope.urlNotifications = 'http:/coub.com/api/v2/notifications';
        $scope.urlAbout = 'http:/coub.com/api/v2/users/me';
        $scope.dataType = 'json';
        $scope.dataNotification = [];
        $scope.dataUser = [];

        /*
        * Get coub account and channels info
        * */
        $http({
            method: $scope.method,
            url: $scope.urlAbout,
            dataType: $scope.dataType
        }).
        then(function(response) {

            console.log(response.data.current_channel.avatar_versions.template.replace('%{version}', 'small'));
            $scope.dataUser = response.data;
            $scope.dataUserIcon = response.data.current_channel.avatar_versions.template.replace('%{version}', 'small');
            $scope.dataUserIcon = response.data.current_channel.avatar_versions.template.replace('%{version}', 'small');

        }, function(response) {
            /*
            * Trow here
            * */
        });

        $http({
            method: $scope.method,
            url: $scope.urlNotifications+'?page='+$scope.page+'&per_page='+$scope.per_page,
            dataType: $scope.dataType
        }).
        then(function(response) {

            /*console.log(response.data.notifications);*/

            angular.forEach(response.data.notifications, function (field, key) {
                // $scope.arImportant['kind'] = field.kind;

                if(field.important === true)
                    $scope.dataNotification.push(field);
                    // console.log( field.kind, field.liked, field.recoubed, field.senders[0] );
            });

        }, function(response) {
            /*
            * Trow here
            * */
        });

        console.log( $scope.dataNotification );

        if($scope.important !== undefined) {

            chrome.browserAction.setBadgeBackgroundColor({color: 'gray'});

            if ($scope.important > 20)
                chrome.browserAction.setBadgeBackgroundColor({color: 'green'});
            if ($scope.important > 40)
                chrome.browserAction.setBadgeBackgroundColor({color: 'pink'});
            if ($scope.important > 80)
                chrome.browserAction.setBadgeBackgroundColor({color: 'red'});

            chrome.browserAction.setBadgeText({text: $scope.important.toString()});
        }

        /* $scope.search_text = ''; */
        /* // /api/v2/channels/notifications_viewed
        // /api/v2/notifications */

        $scope.urlSearch = 'http://coub.com/api/v2/search?q=';
        $scope.url_foot = '&order_by=views_count';

        $scope.searchFunc = function () {

            // console.log('searchFunc function',$scope.url+$scope.search_text+$scope.url_foot);

            $http({
                method: $scope.method,
                url: $scope.urlSearch + $scope.search_text + $scope.url_foot,
                headers: ''
            }).then(function (response) {

                $scope.model = response;
                console.log(response);

                /* chrome.browserAction.setBadgeBackgroundColor({ color: [127, 0, 0, 255] });
                chrome.browserAction.setBadgeText({text: cnt.toString()}); */

            }, function (response) {

                /*
                * Trow here
                * */
                console.log('no data');
                $scope.model = 'no data'; // ???
            });
        }
    }]);
}