chrome.runtime.onInstalled.addListener(function() {

    console.log('chrome background.html init');

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {   console.log(request, sender, sendResponse);
            if(request.newIconPath)
                chrome.browserAction.setIcon({path:"icon_connect.png"});
        }
	);

});

var app = angular.module('Coub_background', []);

app.run(function() {});

app.controller("BackgroundCtrl", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

    console.log('angular Coub_background module init');
	
	$scope.method = 'jsonp';
	$scope.response = null;
	$scope.url = 'http:/coub.com/api/v2/notifications';	
	
	$scope.callAtInterval = function() {
				
		/*$http({method: $scope.method, url: $scope.url, dataType: 'jsonp'}).
		then(function(response) {
						
			console.log(response);
			
		}, function(response) {
		});*/

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {   console.log(request, sender, sendResponse);
                if(!request.newIconPath)
                    chrome.browserAction.setIcon({path:"icon.png"});
            }
        );
	}

	$scope.callAtInterval();
	$interval( function(){ $scope.callAtInterval(); }, 60000);
}]);
