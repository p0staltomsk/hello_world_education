var app = angular.module('Coub_background', []);

app.run(function() {});

app.controller(
	"BackgroundCtrl",
	[
		'$scope',
		'$http',
		'$interval',
		function (
			$scope,
			$http,
			$interval
		)
	{

	/**
	 * 	JUST LOG HERE
	 */
    console.log('BackgroundCtrl init');

    $scope.page = 1;
    $scope.per_page = 50;
    $scope.important = 0;
	$scope.method = 'GET';
	$scope.response = null;
	$scope.url = 'http:/coub.com/api/v2/notifications';
	$scope.searchLog = 'http:/coub.com/api/v2/search_logs';
	$scope.dataType = 'json';

	/**
	 *	call ajax func
	 */
	$scope.callAtInterval = function() {

        /**
		 * @desc important count
         * @type {number}
         */
        $scope.important = 0;

        /**
		 * 	DO ajax requesr to coub.com
         */
		$http({
			method: $scope.method,
			url: $scope.url+'?page='+$scope.page+'&per_page='+$scope.per_page,
			dataType: $scope.dataType}).
		then(function(response) {

            /**
			 * 	@desc next time per page count
             * @type {number}
             */
            $scope.per_page = 100;

			/*console.log(response.data.notifications);*/

            /**
			 *	set last data to storage
             */
            localStorage.lastData = JSON.stringify(response.data.notifications);

            /**
			 * 	Only important events need
             */
            angular.forEach(response.data.notifications, function (field, key) {

            	if(field.important === true) {
                    $scope.important++;
                }
            });

            /**
			 *	Ext Notifications count style
             */
            chrome.browserAction.setBadgeBackgroundColor({ color: 'gray' });

            if($scope.important > 15)
                chrome.browserAction.setBadgeBackgroundColor({ color: 'green' });
            if($scope.important > 30)
                chrome.browserAction.setBadgeBackgroundColor({ color: 'pink' });
            if($scope.important > 60)
                chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });

            chrome.browserAction.setBadgeText({text: $scope.important.toString()});

		}, function(response) {
            /*
            * Trow here
            * */
		});

        /*chrome.runtime.onMessage.addListener(

        	function(request, sender, sendResponse) {

            	console.log(request, sender, sendResponse);
                if(!request.newIconPath)
                    chrome.browserAction.setIcon({path:"icon.png"});
            }
        );*/
	}

	/**
	 * Load from storage
	 */
	$scope.loadOptions = function() {

        /**
         *  RUN ONCE SEARCH LOG
         */
        $http({
            method: $scope.method,
            url: $scope.searchLog,
            dataType: $scope.dataType
        }).
        then(function(response) {

            /*console.log(response.data);*/

            /**
             *	set last search log data to storage
             */
            localStorage.logData = JSON.stringify(response.data); // JSON.parse(localStorage.logData)

        }, function(response) {
            /*
            * Trow here
            * */
        });

        /**
		 * 	check storage
         */
		if(!localStorage.lastData){
            console.log('no last data');
		} else {
            console.log('has last data'/*, JSON.parse(localStorage.lastData)*/);
		}

        /**
		 *  LOG HERE
         */
        console.log(localStorage);
	}

	/**
	 *	get storage
	 */
	$scope.loadOptions();

	/**
	 *	make Notifications request every minute
	 */
	$scope.callAtInterval();
	$interval( function(){ $scope.callAtInterval(); }, 60000);
}]);

/**
 *	If u tab visit coub.com change icon
 */
chrome.runtime.onInstalled.addListener(function() {

    console.log('chrome.runtime.onInstalled.addListener background.js init');

    chrome.runtime.onMessage.addListener(

        function(request, sender, sendResponse) { // console.log(request, sender, sendResponse);

            if(request.newIconPath) {

                console.log('request.newIconPath = 1', this);
            	chrome.browserAction.setIcon({path: "icon_connect.png"});

            }
        }
    );
});