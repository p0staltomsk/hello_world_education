var app = angular.module('Zealite_popup', []);

app.run(function() {});

app.controller("PopupCtrl", ['$scope', '$http', function ($scope, $http) {

	if(!localStorage.color) {localStorage.color = 'FFFFFF';}
	if(!localStorage.server) {localStorage.server = 'x20';}
	
	$scope.color = localStorage.color;
	$scope.server = localStorage.server;	
	
	if(!localStorage.friends){
		$scope.friends = {};
	} else {
		$scope.friends = JSON.parse(localStorage.friends);
	}
	if(!localStorage.enemies){
		$scope.enemies = {};
	} else {
		$scope.enemies = JSON.parse(localStorage.enemies);
	}
	
	$scope.admin = '[Adm]';
	$scope.method = 'GET';
	$scope.response = null;
	$scope.mmm = [];
	$scope.url = 'http://zealite.net/cur_stats.json';	
	
	$http({method: $scope.method, url: $scope.url}).
	then(function(response) {
		
		$scope.model = response.data[$scope.server];
		var cnt = $scope.users = response.data[$scope.server].o;
		
		/* chrome.browserAction.setBadgeBackgroundColor({ color: [127, 0, 0, 255] });
		chrome.browserAction.setBadgeText({text: cnt.toString()}); */
			
		// TODO: сделать сортировку списка
		angular.forEach(response.data[$scope.server].n, function (field, key) {
			angular.forEach($scope.friends, function (ffield, fkey) {
				if(ffield == field.n+' '+field.ln) {
					$scope.mmm[key] = 1;
				}
			});
			angular.forEach($scope.enemies, function (efield, ekey) {
				if(efield == field.n+' '+field.ln) {
					$scope.mmm[key] = 1;
				}
			});
			if(!$scope.mmm[key]) {
				$scope.mmm[key] = 0;
			}
		});
		
		if(localStorage.server == 'x20') {
			// $scope.model = response.data['x1']; //+ 'Игроки *x1*'
			//$scope.users = response.data['x1'].o;
			//$scope.users = response.data['x1'].o;
		}
		
		// console.log($scope.mmm);
		
	}, function(response) {
		$scope.users = 'load error';
	});
	
	$scope.mark = function(arg, mark, index) {
		
		$scope.mmm[index] = 1;
		
		if(mark == 'friend') {
			var friendsCnt = 0;
			var fa = 0;
			angular.forEach($scope.friends, function (field, key) {
				if(field == arg) { fa = 1; }
				friendsCnt++;
			});			
			if(fa != 1){
				$scope.friends[friendsCnt] = arg;
				localStorage.setItem("friends", JSON.stringify($scope.friends));				
			}
		}
		
		if(mark == 'enemy') {
			var enemiesCnt = 0;
			var ea = 0;
			angular.forEach($scope.enemies, function (field, key) {
				if(field == arg) { ea = 1; }
				enemiesCnt++;
			});
			if(ea != 1){
				$scope.enemies[enemiesCnt] = arg;
				localStorage.setItem("enemies", JSON.stringify($scope.enemies));				
			}
		}
	}
}]);