/**
 *  NOW WORK IN COUB.COM SITE
 */

if(window.angular === undefined) {

    var permalink = window.location.pathname.replace('/view/', '');
    var where = permalink.search('/');

    // console.log('Coub Ext.js init on coub.com! 👊 coub.localStorage:', localStorage);

    chrome.runtime.sendMessage({ "newIconPath" : 1 });

} else {

    /**
     *  if on ext popup window
     */
    // console.log('Coub Ext.js init inside ext! 👊 ext.localStorage:', localStorage);
    chrome.runtime.sendMessage({ "newIconPath" : 0 });

    /**
     *  JQUERY HACK FOR FONT SIZES
     */
    $(document).ready(function(){
        $('body').flowtype({
            minimum : 360,
            maximum : 480
        });
    });

    /**
     *  ANGULAR
     */
    var app = angular.module('_popup', []);

    app.run(function () {});

    /**
     *  head controller
     */
    app.controller("headPopupCtrl", ['$scope', '$http', function ($scope, $http)
    {
        // console.log("headPopupCtrl init");
    }]);

    /**
     *  body controller
     */
    app.controller("PopupCtrl", ['$scope', '$http', function ($scope, $http)
    {
        // console.log('PopupCtrl init');

        $scope.page                     = 1;
        $scope.per_page                 = 100;
        $scope.method                   = 'GET';
        $scope.methodPost               = 'POST';
        $scope.serverUrl                = 'http://coub.com';
        $scope.urlNotifications         = 'http:/coub.com/api/v2/notifications';
        $scope.urlAbout                 = 'http:/coub.com/api/v2/users/me';
        $scope.urlItem                  = 'http:/coub.com/api/v2/coubs/';
        $scope.urlSearch                = 'http://coub.com/api/v2/search?q=';
        $scope.url_foot                 = '&order_by=views_count';
        $scope.dataType                 = 'json';
        $scope.dataNotification         = [];
        $scope.followStatus             = [];
        $scope.audioByCode              = [];
        $scope.arrPermalinkData         = [];
        $scope.bgLoading                = true;
        $scope.dataUser                 = (localStorage.dataUser)               ? JSON.parse(localStorage.dataUser)         : [];
        $scope.dataUserIcon             = (localStorage.dataUserIcon)           ? JSON.parse(localStorage.dataUserIcon)     : '';
        $scope.logData                  = (localStorage.logData)                ? JSON.parse(localStorage.logData)          : '';
        $scope.dataChannelBachground    = (localStorage.dataChannelBachground)  ? localStorage.dataChannelBachground        : '';
        $scope.dataChannelViewsCount    = (localStorage.dataChannelViewsCount)  ? localStorage.dataChannelViewsCount        : '';

        /**
         * Load from storage
         */
        $scope.loadOptions = function()
        {
            /*
            * Get coub account and channels info
            * */
            $http({
                method: $scope.method,
                url: $scope.urlAbout,
                dataType: $scope.dataType
            }).
            then(function(response) {

                // console.log(response.data.channels, response.data.current_channel.id);

                /**
                 * 	Only current channet background need
                 */
                angular.forEach(response.data.channels, function (field, key) {

                    if(field.id === response.data.current_channel.id) {

                        $scope.dataChannelViewsCount = field.views_count;
                        localStorage.dataChannelViewsCount = $scope.dataChannelViewsCount;

                        if(field.background_coub != null) {

                            $scope.dataChannelBachground = field.background_coub.image_versions.template.replace('%{version}', 'tiny');
                            localStorage.dataChannelBachground = field.background_coub.image_versions.template.replace('%{version}', 'tiny');
                        } else {
                            $scope.dataChannelBachground = field.timeline_banner_image.replace('%{version}', 'small');
                            localStorage.dataChannelBachground = field.timeline_banner_image.replace('%{version}', 'small');
                        }
                    }
                });

                /**
                 *  save user pic and cache
                 */
                localStorage.dataUser = JSON.stringify(response.data);
                $scope.dataUser = response.data;
                localStorage.dataUserIcon = JSON.stringify(response.data.current_channel.avatar_versions.template.replace('%{version}', 'small'));
                $scope.dataUserIcon = response.data.current_channel.avatar_versions.template.replace('%{version}', 'small');

            }, function(data) {
                /*
                * Trow here
                * */
            });

            /**
             *  GET NOFIFICATIONS
             */
            $http({
                method: $scope.method,
                url: $scope.urlNotifications + '?page='+$scope.page + '&per_page=' + $scope.per_page, // http://coub.com/dev/docs/Coub+API/Notifications
                dataType: $scope.dataType
            }).
            then(function(response) {

                /*console.log(localStorage);*/

                $scope.dataNotification = [];
                var objData = {};
                var cnt = 0;

                /**
                 *	set last data to storage
                 */
                localStorage.lastData = JSON.stringify(response.data.notifications);

                /**
                 * 	Only important events need
                 */
                angular.forEach(response.data.notifications, function (field, key) {

                    if(field.important === true) { /* && localStorage.showOnlyImportant === true*/

                        field.iframeLink = "https://coub.com/embed/" + field.object.permalink + "?muted=false&autostart=false&originalSize=false&startWithHD=false";

                        $scope.dataNotification.push(field);

                        console.log(field);

                        /**
                         *	get mp3 path's
                         */
                        $http({
                            method:     $scope.method,
                            url:        $scope.urlItem + field.object.permalink,
                            dataType:   $scope.dataType
                        }).
                        then(function(response) {

                            $scope.arrPermalinkData.push(response.data);

                            /*console.log(response.data);*/

                            var audio;
                            audio = [
                                field.object.permalink,
                                response.data.audio_file_url,
                                response.data.file_versions.mobile.audio[1]
                            ];

                            objData[cnt] = audio;
                            $scope.audioByCode.push(audio);

                            cnt++;

                        }, function(data) {
                            /*
                            * Trow here
                            * */
                        });
                    }

                    /**
                     *
                     */
                    if((key - 1) == response.data.notifications.length) {

                        $scope.bgLoading = true;

                        // firing an event downwards
                        /*$scope.$broadcast('myCustomEvent', $scope.bgLoading);
                        $scope.$emit('myCustomEvent', $scope.bgLoading);*/
                    }
                });

                // listen for the event in the relevant $scope
                $scope.$on('myCustomEvent', function (event, data) {

                    /*console.log("HUI",data);*/

                    /*localStorage.setItem("audioByCode", JSON.stringify(objData));
                    console.log($scope.arrPermalinkData, objData, $scope.bgLoading);*/
                });

                /*console.log($scope.bgLoading);*/

                chrome.browserAction.setBadgeText({text: $scope.dataNotification.length.toString()});

            }, function(data) {
                /*
                * Trow here
                * */
            });

            /**
             *  counter
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

            if(!localStorage.lastData) {

                /*console.log('no last data');*/

            } else {

                /*console.log('has last data'/!*, JSON.parse(localStorage.lastData)*!/);*/

                /**
                 * 	Only important events need
                 */
                angular.forEach(JSON.parse(localStorage.lastData), function (field, key) {

                    if(field.important === true) {
                        $scope.dataNotification.push(field);
                    }
                });
            }
        }

        /**
         *	get storage
         */
        $scope.loadOptions();

        /**
         *  markAllReaded
         */
        $scope.markAllReaded = function ()
        {
            /**
             *  markAllReaded
             */
            $http({
                method: $scope.methodPost,
                url: $scope.serverUrl + '/api/v2/channels/notifications_viewed',
                headers: ''
            }).then(function (response) {

                // console.log(response.data);

                /**
                 * SHIT CODE?
                 * @type {Array}
                 */
                $scope.dataNotification = [];
                localStorage.lastData = [];
                chrome.browserAction.setBadgeText({text: $scope.dataNotification.length.toString()});

                /**
                 *	get storage
                 */
                /*$scope.loadOptions();*/

            }, function (data) {
                /*
                * Trow here
                * */
            });
        }

        $scope.loga = function ($arg)
        {
            console.log($arg);
        }

        /**
         *  follow to user
         */
        $scope.follow = function ($channelId, $userId)
        {
            /**
             *  DO FOLLOW
             */
            $http({
                method: $scope.methodPost,
                url: $scope.serverUrl + '/api/v2/follows?id=' + $userId + '&channel_id=' + $channelId,
                headers: ''
            }).then(function (response) {

                if(response.data.status) {
                    $scope.followStatus = [$userId, "ok"];
                }

            }, function (data) {

                $scope.followStatus = [$userId, "false"];
            });
        }

        /**
         *  unfollow to user
         *  @TODO go
         */
        $scope.unfollow = function ($channelId, $userId)
        {
            // console.log('UNFOLLOW DEBUG', $channelId, $userId);
        }

        /**
         *  follow to user
         *  @TODO what is it?
         */
        $scope.tryMakeCoub = function ($serverCTU)
        {
            console.log($serverCTU);
        }

        /**
         *  Search by name now
         */
        $scope.searchFunc = function ()
        {
            /**
             *  DO SEARCH
             */
            $http({
                method: $scope.method,
                url: $scope.urlSearch + $scope.search_text + $scope.url_foot,
                headers: ''
            }).then(function (response) {

                $scope.model = response;
                // console.log(response);

            }, function (data) {
                /*
                * Trow here
                * */
            });
        }

        $scope.searchByEnter = function(keyEvent) {
            if (keyEvent.which === 13) {
                $scope.searchFunc();
            }
        }

        /**
         *  GET & SET CURRENT TAB URL TO VAR
         */
        getCurrentTab().then(function(tab){});

        /**
         *  SET CURRENT TAB URL TO VAR
         * @returns {Promise}
         */
        function getCurrentTab()
        {
            return new Promise(function(resolve, reject) {
                chrome.tabs.query({
                    active: true,                   // Select active tabs
                    lastFocusedWindow: true         // In the current window
                }, function(tabs) {

                    resolve(tabs[0]);

                    if(tabs[0] != undefined)
                        $scope.serverCTU = tabs[0].url; // CURRENT TAB URL
                });
            });
        }

    }]);

    /**
     *  set ext Icon
     */
    chrome.browserAction.setIcon({path:"logo.png"});
}
