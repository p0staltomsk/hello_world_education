var app = angular.module('_popup', []);

app.run(function() {});

app.controller("PopupCtrl", ['$scope', '$http', function ($scope, $http) {
		
	$scope.method = 'GET';
	$scope.response = null;
	/* $scope.search_text = ''; */
	
	$scope.url = 'http://coub.com/api/v2/search?q=';
	$scope.url_foot = '&order_by=newest_popular';
	
	$scope.searchFunc = function() {
	
		console.log('searchFunc function',$scope.url+$scope.search_text+$scope.url_foot);
		
		$http({method: $scope.method, url: $scope.url+$scope.search_text+$scope.url_foot}).
		then(function(response) {		
			
			$scope.model = response;		
			console.log(response);
					
			/* chrome.browserAction.setBadgeBackgroundColor({ color: [127, 0, 0, 255] });
			chrome.browserAction.setBadgeText({text: cnt.toString()}); */
						
		}, function(response) {
			$scope.model = 'no data';
			console.log('no data');
		});
	}
}]);