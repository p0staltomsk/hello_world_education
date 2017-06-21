var app = angular.module('Zealite_background', []);

app.run(function() {});

app.controller("BackgroundCtrl", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
	
	$scope.method = 'jsonp';
	$scope.response = null;
	$scope.url = 'http:/coub.com/api/v2/notifications';	
	
	$scope.callAtInterval = function() {
				
		$http({method: $scope.method, url: $scope.url, dataType: 'jsonp'}).
		then(function(response) {
						
			console.log(response);
			
		}, function(response) {
		});
	}
	$scope.callAtInterval();
	/* $interval( function(){ $scope.callAtInterval(); }, 600000); */
}]);