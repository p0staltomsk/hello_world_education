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

	/**
	 *	call ajax func
	 */
	$scope.callAtInterval = function() {

        /**
         *  RUN ONCE SEARCH LOG
         */
        $http({
            method: "GET",
            url: "https://api.coinmarketcap.com/v1/ticker/dopecoin/?convert=BTC",
            dataType: "json"
        }).
        then(function(response) {

            console.log(response.data[0].price_btc.substring(7, 10));

            chrome.browserAction.setBadgeBackgroundColor({ color: 'gray' });
            chrome.browserAction.setBadgeText({text: response.data[0].price_btc.substring(7, 10).toString()});

        }, function(response) {
            /*
            * Trow here
            * */
        });
	}

	/**
	 *	make Notifications request every minute
	 */
	$scope.callAtInterval();
	$interval( function(){ $scope.callAtInterval(); }, 60000);

}]);
