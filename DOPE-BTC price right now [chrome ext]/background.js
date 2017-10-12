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

        $scope.getBTC 	= 'https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=USD';
        $scope.getDOPE 	= 'https://api.coinmarketcap.com/v1/ticker/dopecoin/?convert=BTC';
        $scope.nowDOPE 	= 1;
        $scope.buyAlert = localStorage.buyAlert ? localStorage.buyAlert : '';
		$scope.karet = '^';

		/**
		 *	call ajax func
		 */
		$scope.callAtInterval = function() {

            $scope.karet = '';

			/**
			 *  RUN ONCE SEARCH LOG
			 */
			$http({
				method: "GET",
				url: ($scope.nowDOPE) ? $scope.getDOPE : $scope.getBTC,
				dataType: "json"
			}).
			then(function(response) {

                if($scope.nowDOPE == 1) {

                    $scope.nowDOPE = 0;
                    str = response.data[0].price_btc.substring(6, 10).toString();
                    chrome.browserAction.setBadgeBackgroundColor({ color: 'green' });

                    console.log('nowDOPE buyAlert > price_btc', $scope.buyAlert, response.data[0].price_btc.substring(7, 10));

                    if($scope.buyAlert > response.data[0].price_btc.substring(7, 10)) {

                    	alert(
                            'buy alert! ' +
                            $scope.buyAlert + ' > ' +
                            response.data[0].price_btc.substring(7, 10)
                        );
                    }
                }
                else {

                    $scope.nowDOPE = 1;
                    str = response.data[0].price_usd.substring(0, 4).toString();
                    chrome.browserAction.setBadgeBackgroundColor({ color: 'orange' });
                }

				chrome.browserAction.setBadgeText({text: str + $scope.karet});

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
