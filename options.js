var app = angular.module('Zealite_options', []); /* 'ngMaterial', 'ngMessages', 'material.svgAssetsCache' */

app.run(function() {});

app.controller("OptionsCtrl", ['$scope', function ($scope) {

	$scope.saved = 0;
	
	var date = new Date();
	/* $scope.myDate = date;
	
	$scope.minDate = new Date(	
	$scope.myDate.getFullYear(),
	$scope.myDate.getMonth() - 2,
	$scope.myDate.getDate());
	
	$scope.maxDate = new Date(
	$scope.myDate.getFullYear(),
	$scope.myDate.getMonth() + 2,
	$scope.myDate.getDate()); */
		
	// console.log($scope);
	
	var time = date.getHours();
	if(date.getMinutes().toString().length == 1) {
		time += ':0'+date.getMinutes();
	} else {
		time += ':'+date.getMinutes();
	}
	if(date.getSeconds().toString().length == 1) {
		time += ':0'+date.getSeconds();	
	} else {
		time += ':'+date.getSeconds();
	}

	$scope.timeNow = time;
		
	$scope.loadOptions = function() {
		var favColor = localStorage.color;
		$scope.adminAlert = localStorage.adminAlert;
		$scope.connectTelegroup = localStorage.connectTelegroup;
		/* $scope.telegroup = 'LIF_zealite_x20_channel_dev'; */
		
		if (favColor == undefined) {
			localStorage.color = "FFFFFF";
		}
		$scope.color = localStorage.color;
		
		var favServer = localStorage.server;
		if (favServer == undefined) {
			localStorage.server = "x20";
		}
		
		var select = document.getElementById("color");
		for (var i = 0; i < select.children.length; i++) {
			var child = select.children[i];			
			if (child.value == favColor) {
				child.selected = "true";
				break;
			}
		}
		
		var server = document.getElementById("server");
		for (var i = 0; i < server.children.length; i++) {
			var child = server.children[i];			
			if (child.value == favServer) {
				child.selected = "true";
				break;
			}
		}
		
		var restartTime = localStorage.restartTime;
		var time = document.getElementById("restartTime");
		for (var i = 0; i < time.children.length; i++) {
			var child = time.children[i];			
			if (child.value == restartTime) {
				child.selected = "true";
				break;
			}
		}
		
		var jhTime = localStorage.jhTime;
		var time = document.getElementById("jhTime");
		for (var i = 0; i < time.children.length; i++) {
			var child = time.children[i];			
			if (child.value == jhTime) {
				child.selected = "true";
				break;
			}
		}		
	}
	
	if(!localStorage.friends){
		$scope.friends = {};
	} else {
		$scope.friends = JSON.parse(localStorage.friends);
	}
	var friendsCnt = 0;
	angular.forEach($scope.friends, function (field, key) {
		friendsCnt++;		
	});
	
	if(!localStorage.enemies){
		$scope.enemies = {};
	} else {
		$scope.enemies = JSON.parse(localStorage.enemies);
	}
	var enemiesCnt = 0;
	angular.forEach($scope.enemies, function (field, key) {
		enemiesCnt++;		
	});	
	
	$scope.saveOptions = function() {
		var select = document.getElementById("color");
		var color = select.children[select.selectedIndex].value;
		localStorage.color = color;
		
		var select = document.getElementById("server");
		var server = select.children[select.selectedIndex].value;
		localStorage.server = server;
		
		var select = document.getElementById("restartTime");
		var restartTime = select.children[select.selectedIndex].value;
		localStorage.restartTime = restartTime;
		
		var select = document.getElementById("jhTime");
		var jhTime = select.children[select.selectedIndex].value;
		localStorage.jhTime = jhTime;
				
		var field = document.getElementById("friend");
		var friend = field.value;
		if(friend) {
			$scope.friends[friendsCnt] = friend;
			localStorage.setItem("friends", JSON.stringify($scope.friends));
		}
		
		var field = document.getElementById("enemy");
		var enemy = field.value;
		if(enemy) {
			$scope.enemies[enemiesCnt] = enemy;
			localStorage.setItem("enemies", JSON.stringify($scope.enemies));
		}
		
		var field = document.getElementById("adminAlert");
		var adminAlert = field.checked;
		localStorage.adminAlert = adminAlert;
		
		var field = document.getElementById("connectTelegroup");
		var connectTelegroup = field.checked;
		localStorage.connectTelegroup = connectTelegroup;
				
		location.reload();
	}
	
	$scope.delFriend = function(index) {
		var Friends = JSON.parse(localStorage.friends);
		var newFriends = {};
		var cnt=0;		
		angular.forEach(Friends, function (field, key) {
			if(key!=index) {
				newFriends[cnt] = field;				
			} else {
				cnt--;
			}
			cnt++;
		});		
		$scope.friends = newFriends;
		localStorage.setItem("friends", JSON.stringify(newFriends));
	}
	
	$scope.delEnemy = function(index) {
		var Enemies = JSON.parse(localStorage.enemies);
		var newEnemies = {};
		var cnt=0;
		angular.forEach(Enemies, function (field, key) {
			if(key!=index) {
				newEnemies[cnt] = field;
			} else {
				cnt--;
			}
			cnt++;
		});		
		$scope.enemies = newEnemies;
		localStorage.setItem("enemies", JSON.stringify(newEnemies));
	}
	
	$scope.loadOptions();
	console.log(localStorage);
}]);