if(window.angular === undefined) {

    /**
     *  If Coub.com tab
     */
    console.log('Coub Ext.js init on coub.com! 👊 coub.localStorage:', localStorage, CoubPlayer);
    chrome.runtime.sendMessage({ "newIconPath" : 1 });

    if(!localStorage.soundLow) // @TODO not work now
        localStorage.player_sound_level = "0.15";

    /**
     *  localStorage.clear();
     */

    /**
     *  @desc Modify coub.com CSS
     * @type {{type: string, style: Element, content: string, append: script.append}}
     */
    var script = {

        type: 'text/css', style: document.createElement('style'),
        content: "" +
        ".viewer__hand, #hs-beacon {display:none !important;} " +
        ".coub__description{background-color:#f8f8f8 !important;} " +
        ".coub__views-count span{color:orangered !important;}" +
        ".channel__description {/*background-color:#f8f8f8 !important;*/}" +
        "",
        append: function() {

            this.style.type = this.type;
            this.style.appendChild(document.createTextNode(this.content));
            document.head.appendChild(this.style);

        }
    };

    script.append();

} else {

    /**
     *  if on ext popup window
     */
    console.log('Coub Ext.js init inside ext! 👊 ext.localStorage:', localStorage);
    chrome.runtime.sendMessage({ "newIconPath" : 0 });

    /*function getword(info,tab) {
        console.log("Word " + info.selectionText + " was clicked.");
        chrome.tabs.create({
            url: "http://www.google.com/search?q=" + info.selectionText,
        });
    }
    chrome.contextMenus.create({
        title: "Search: %s",
        contexts:["selection"],
        onclick: getword,
    });*/

    var app = angular.module('_popup', []);

    app.run(function () {});

    app.controller("PopupCtrl", ['$scope', '$http', function ($scope, $http) {

        console.log('PopupCtrl init');

        $scope.serverUrl = 'http://coub.com';

        $scope.page             = 1;
        $scope.per_page         = 50;
        $scope.method           = 'GET';
        $scope.methodPost       = 'POST';
        $scope.response         = null;
        $scope.urlNotifications = 'http:/coub.com/api/v2/notifications';
        $scope.urlAbout         = 'http:/coub.com/api/v2/users/me';
        $scope.urlSearch        = 'http://coub.com/api/v2/search?q=';
        $scope.url_foot         = '&order_by=views_count';
        $scope.dataType         = 'json';
        $scope.dataNotification = [];
        $scope.dataUser         = (localStorage.dataUser)       ? JSON.parse(localStorage.dataUser)     : [];
        $scope.dataUserIcon     = (localStorage.dataUserIcon)   ? JSON.parse(localStorage.dataUserIcon) : '';
        $scope.logData          = (localStorage.logData)        ? JSON.parse(localStorage.logData)      : '';

        /**
         * Load from storage
         */
        $scope.loadOptions = function() {

            /*
            * Get coub account and channels info
            * */
            $http({
                method: $scope.method,
                url: $scope.urlAbout,
                dataType: $scope.dataType
            }).
            then(function(response) {

                /*console.log(response.data.current_channel.avatar_versions.template.replace('%{version}', 'small'));*/

                /**
                 *  save user pic and cache
                 */
                localStorage.dataUser = JSON.stringify(response.data);
                $scope.dataUser = response.data;
                localStorage.dataUserIcon = JSON.stringify(response.data.current_channel.avatar_versions.template.replace('%{version}', 'small'));
                $scope.dataUserIcon = response.data.current_channel.avatar_versions.template.replace('%{version}', 'small');

            }, function(response) {
                /*
                * Trow here
                * */
            });

            /*console.log(localStorage);*/

            if(!localStorage.lastData){
                console.log('no last data');
            } else {
                console.log('has last data'/*, JSON.parse(localStorage.lastData)*/);

                /**
                 * 	Only important events need
                 */
                angular.forEach(JSON.parse(localStorage.lastData), function (field, key) {

                    if(field.important === true)
                        $scope.dataNotification.push(field);
                });
            }
        }

        /**
         *	get storage
         */
        $scope.loadOptions();

        /**
         *
         */
        $http({
            method: $scope.method,
            url: $scope.urlNotifications+'?page='+$scope.page+'&per_page='+$scope.per_page,
            dataType: $scope.dataType
        }).
        then(function(response) {

            $scope.dataNotification = [];

            /**
             * 	Only important events need
             */
            angular.forEach(response.data.notifications, function (field, key) {

                if(field.important === true)
                    $scope.dataNotification.push(field);
            });

        }, function(response) {
            /*
            * Trow here
            * */
        });

        /*console.log( $scope.dataNotification );*/

        /**
         *
         */
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

        /**
         *  follow to user
         */
        $scope.markAllReaded = function () {

            /**
             *  DO FOLLOW
             */
            $http({
                method: $scope.methodPost,
                url: $scope.serverUrl + '/api/v2/channels/notifications_viewed',
                headers: ''
            }).then(function (response) {

                console.log(response.data);

            }, function (response) {

                /*
                * Trow here
                * */
            });
        }

        /**
         *  follow to user
         */
        $scope.follow = function ($channelId, $userId) {

            console.log($channelId, $userId);

            /**
             *  DO FOLLOW
             */
            $http({
                method: $scope.methodPost,
                url: $scope.serverUrl + '/api/v2/follows?id=' + $userId + '&channel_id=' + $channelId,
                headers: ''
            }).then(function (response) {

                console.log(response.data);

            }, function (response) {

                /*
                * Trow here
                * */
            });
        }

        /**
         *  Search by name now
         */
        $scope.searchFunc = function () {

            /**
             *  DO SEARCH
             */
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
            });
        }
    }]);
}