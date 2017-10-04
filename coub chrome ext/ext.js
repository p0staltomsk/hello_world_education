if(window.angular === undefined) {

    /**
     *  If Coub.com tab
     */
    console.log('Coub Ext.js init on coub.com! 👊 coub.localStorage:', localStorage); /* @TODO, CoubPlayer DEBUS HERE*/
    chrome.runtime.sendMessage({ "newIconPath" : 1 });

    if(!localStorage.soundLow) // @TODO settings not work now
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
        ".coub__user-stamp-small__wrapper span{color:orangered !important;}" +
        ".-color--emperor {color:orangered !important;}" +
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

    $(document).ready(function(){

        $('body').flowtype({
            minimum : 360,
            maximum : 480
        });

    });

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

    app.controller("headPopupCtrl", ['$scope', function ($scope) {
        console.log("headPopupCtrl init");
    }]);

    app.controller("PopupCtrl", ['$scope', '$http', function ($scope, $http) {

        console.log('PopupCtrl init');

        getCurrentTab().then(function(tab){});

        function getCurrentTab(){
            return new Promise(function(resolve, reject){
                chrome.tabs.query({
                    active: true,               // Select active tabs
                    lastFocusedWindow: true     // In the current window
                }, function(tabs) {
                    resolve(tabs[0]);
                    $scope.serverCTU = tabs[0].url; // CURRENT TAB URL
                });
            });
        }

        $scope.page                     = 1;
        $scope.per_page                 = 50;
        $scope.method                   = 'GET';
        $scope.methodPost               = 'POST';
        $scope.response                 = null;
        $scope.serverUrl                = 'http://coub.com';
        /*$scope.missingAvatarUrl         = 'images/avatar-svg.png';*/
        $scope.urlNotifications         = 'http:/coub.com/api/v2/notifications';
        $scope.urlAbout                 = 'http:/coub.com/api/v2/users/me';
        $scope.urlItem                  = 'http:/coub.com/api/v2/coubs/';
        $scope.urlSearch                = 'http://coub.com/api/v2/search?q=';
        $scope.url_foot                 = '&order_by=views_count';
        $scope.dataType                 = 'json';
        $scope.dataNotification         = [];
        $scope.audioByCode              = [];
        $scope.followStatus             = [];
        $scope.dataUser                 = (localStorage.dataUser)               ? JSON.parse(localStorage.dataUser)         : [];
        $scope.dataUserIcon             = (localStorage.dataUserIcon)           ? JSON.parse(localStorage.dataUserIcon)     : '';
        $scope.logData                  = (localStorage.logData)                ? JSON.parse(localStorage.logData)          : '';
        $scope.dataChannelBachground    = (localStorage.dataChannelBachground)  ? localStorage.dataChannelBachground        : '';
        $scope.dataChannelViewsCount    = (localStorage.dataChannelViewsCount)  ? localStorage.dataChannelViewsCount        : '';

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

                console.log(response.data.channels, response.data.current_channel.id);

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
                        /*console.log($scope.dataChannelBachground);*/
                        /*console.log(field.background_coub);
                        console.log(field.background_coub.audio_file_url);*/
                    }
                });

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

            if(!localStorage.lastData) {

                console.log('no last data');

            } else {

                console.log('has last data'/*, JSON.parse(localStorage.lastData)*/);

                /**
                 * 	Only important events need
                 */
                angular.forEach(JSON.parse(localStorage.lastData), function (field, key) {

                    if(field.important === true) {

                        $scope.dataNotification.push(field);

                        $http({
                            method:     $scope.method,
                            url:        $scope.urlItem + field.object.permalink,
                            dataType:   $scope.dataType
                        }).
                        then(function(response) {

/*
                            console.log(response.data);
*/

                            $scope.audioByCode.push([field.object.permalink, response.data.audio_file_url, response.data.file_versions.mobile.audio[1]]);

                        }, function(response) {
                            /*
                            * Trow here
                            * */
                        });
                        //
                    }
                });

                chrome.browserAction.setBadgeText({text: $scope.dataNotification.length.toString()});

                console.log($scope.audioByCode);
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
            url: $scope.urlNotifications + '?page='+$scope.page + '&per_page=' + $scope.per_page, // http://coub.com/dev/docs/Coub+API/Notifications
            dataType: $scope.dataType
        }).
        then(function(response) {

            /*console.log(response.data.notifications);*/

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
         *  markAllReaded
         */
        $scope.markAllReaded = function () {

            /**
             *  markAllReaded
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

            /**
             *  DO FOLLOW
             */
            $http({
                method: $scope.methodPost,
                url: $scope.serverUrl + '/api/v2/follows?id=' + $userId + '&channel_id=' + $channelId,
                headers: ''
            }).then(function (response) {

                if(response.data.status)
                    $scope.followStatus = [$userId,"ok"];

            }, function (response) {

                $scope.followStatus = [$userId,"false"]
                /*
                * Trow here
                * */
            });
        }

        /**
         *  unfollow to user
         */
        $scope.unfollow = function ($channelId, $userId) {

            console.log('UNFOLLOW DEBUG',$channelId, $userId);

            /**
             *  DO UNFOLLOW
             */
            /*$http({
                method: $scope.methodPost,
                url: $scope.serverUrl + '/api/v2/follows?id=' + $userId + '&channel_id=' + $channelId,
                headers: ''
            }).then(function (response) {

                console.log(response.data);

            }, function (response) {

                /!*
                * Trow here
                * *!/
            });*/
        }

        /**
         *  follow to user
         */
        $scope.tryMakeCoub = function ($serverCTU) {

            /*<!-- @TODO editor_create_pasteALinkScreen_fromClipboard -->
            <!-- http://coub.com/create input-field -rn https://www.youtube.com/watch?v=e1PFFPjzIgc -->*/

            console.log($serverCTU);
            /*location.href='http://coub.com';*/
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

    chrome.browserAction.setIcon({path:"icon.png"});
}