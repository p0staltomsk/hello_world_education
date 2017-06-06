var app = angular.module('Zealite_background', []);

app.run(function() {});

app.controller("BackgroundCtrl", ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

	if(!localStorage.server) {localStorage.server = 'x20';}
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
	
	$scope.adminAlert = localStorage.adminAlert;
	$scope.connectTelegroup = localStorage.connectTelegroup;
	$scope.admin = '[Adm]';
	$scope.method = 'GET';
	$scope.response = null;
	$scope.url = 'http://zealite.net/cur_stats.json';	
	
	$scope.callAtInterval = function() {
		
		$scope.sendTelegramBg = '';
		
		$http({method: $scope.method, url: $scope.url}).
		then(function(response) {
			
			var cnt = response.data[$scope.server].o;
			var fcnt = 0;
			var ecnt = 0;
			
			angular.forEach(response.data[$scope.server].n, function (field, key) {
				if(field.ln == $scope.admin && $scope.adminAlert == 'true') {
					alert('АДМИН В ИГРЕ!');
				}
				
				$scope.sendTelegramBg += '<pre>'+field.n+' '+field.ln+'</pre>';
				
				angular.forEach($scope.friends, function (ffield, fkey) {
					if(ffield == field.n+' '+field.ln) {
						fcnt++;
					}				
				});
				angular.forEach($scope.enemies, function (efield, ekey) {
					if(efield == field.n+' '+field.ln) {
						ecnt++;
					}
				});
			});
			
			chrome.browserAction.setBadgeBackgroundColor({ color: 'gray' });
			
			// TODO: перекраска иконки в завис от друзей/врагов/нуля
			if(fcnt > ecnt) {
				chrome.browserAction.setBadgeBackgroundColor({ color: 'green' }); // console.log('друзей больше');
			}
			if(ecnt > fcnt) {
				chrome.browserAction.setBadgeBackgroundColor({ color: 'red' }); // console.log('врагов больше');
			}
			if(ecnt == fcnt) {
				chrome.browserAction.setBadgeBackgroundColor({ color: 'yellow' }); // console.log('всех поровну');
			}
			if(ecnt == 0 && fcnt == 0) {
				chrome.browserAction.setBadgeBackgroundColor({ color: 'gray' }); // console.log('тишина');
			}
			
			chrome.browserAction.setBadgeText({text: cnt.toString()});
			
			var headers = {
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'POST',
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			};
			
			var botapi = 'bot152753553:AAHSaj2LFgpL9bf0mrAW1PL8BJZ5KKb-XOg';			
			var channel = '@LIF_zealite_x20_channel_dev';
			var sendurl = '';
						
			if(parseInt(cnt) > 20) {
				sendurl = 'https://api.telegram.org/'+botapi+
				'/sendMessage?chat_id='+channel+'&text=online: '+cnt+
				' человек ('+$scope.server+')'+$scope.sendTelegramBg+'&disable_notification=false&parse_mode=HTML';
			} else {
				sendurl = 'https://api.telegram.org/'+botapi+
				'/sendMessage?chat_id='+channel+'&text=online: '+cnt+
				' человек ('+$scope.server+')'+$scope.sendTelegramBg+'&disable_notification=true&parse_mode=HTML';
			}
			
			if($scope.connectTelegroup == 'true') {
				$http({method: 'POST', headers: headers, url: sendurl}).
				then(function(response) {
					
					$scope.message_id = response.data.result.message_id;
					//console.log(response);
					
				}, function(response) {
				});
			}
						
			// console.log(cnt);
			
		}, function(response) {
		});
	}
	$scope.callAtInterval();
	
	// console.log($scope.connectTelegroup);
	
	if($scope.connectTelegroup == 'true') {
		$interval( function(){ $scope.callAtInterval(); }, 600000);
	} else {
		$interval( function(){ $scope.callAtInterval(); }, 60000);
	}
}]);