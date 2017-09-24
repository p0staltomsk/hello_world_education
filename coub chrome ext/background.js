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
		) {

    console.log('BackgroundCtrl init');

    $scope.page = 1;
    $scope.per_page = 50;
    $scope.important = 0;
	$scope.method = 'GET';
	$scope.response = null;
	$scope.url = 'http:/coub.com/api/v2/notifications';
	$scope.searchLog = 'http:/coub.com/api/v2/search_logs';
	$scope.dataType = 'json';

    $http({
		method: $scope.method,
		url: $scope.searchLog,
		dataType: $scope.dataType
    }).
    then(function(response) {

        console.log(response.data);

    }, function(response) {
    });

	$scope.callAtInterval = function() {

        $scope.important = 0;

		$http({
			method: $scope.method,
			url: $scope.url+'?page='+$scope.page+'&per_page='+$scope.per_page,
			dataType: $scope.dataType}).
		then(function(response) {

            $scope.per_page = 100;

			console.log(response.data.notifications);

            angular.forEach(response.data.notifications, function (field, key) {

            	/*console.log(field.read_at);*/

            	if(field.important === true)
                    $scope.important++;

            });

            chrome.browserAction.setBadgeBackgroundColor({ color: 'gray' });

            if($scope.important > 20)
                chrome.browserAction.setBadgeBackgroundColor({ color: 'green' });
            if($scope.important > 30)
                chrome.browserAction.setBadgeBackgroundColor({ color: 'pink' });
            if($scope.important > 40)
                chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });

            chrome.browserAction.setBadgeText({text: $scope.important.toString()});

		}, function(response) {
		});

        /*chrome.runtime.onMessage.addListener(

        	function(request, sender, sendResponse) {

            	console.log(request, sender, sendResponse);
                if(!request.newIconPath)
                    chrome.browserAction.setIcon({path:"icon.png"});
            }
        );*/
	}

	$scope.callAtInterval();
	$interval( function(){ $scope.callAtInterval(); }, 60000);
}]);

chrome.runtime.onInstalled.addListener(function() {

    console.log('chrome.runtime.onInstalled.addListener init');

    chrome.runtime.onMessage.addListener(

    	function(request, sender, sendResponse) {

        	// console.log(request, sender, sendResponse);

        	if(request.newIconPath)
                chrome.browserAction.setIcon({path:"icon_connect.png"});
        }
    );
});