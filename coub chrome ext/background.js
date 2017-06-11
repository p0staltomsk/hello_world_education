var app = angular.module('Zealite_background', []);

app.run(function() {});

app.controller("BackgroundCtrl", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
	
	/* $scope.method = 'GET';
	$scope.response = null;
	$scope.url = 'http:/coub.com/api/v2/notifications';	
	
	$scope.callAtInterval = function() {
				
		$http({method: $scope.method, url: $scope.url}).
		then(function(response) {
						
			console.log(response);
			
		}, function(response) {
		});
	}
	$interval( function(){ $scope.callAtInterval(); }, 600000); */
}]);