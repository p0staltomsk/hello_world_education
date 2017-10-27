var app = angular.module('_popup', []);

app.run(function () {});

/**
 *  PopupCtrl controller
 */
app.controller("PopupCtrl", ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http)
{
    console.log("PopupCtrl init"/*, app, $rootScope*/);

    $scope.getBTC 	    = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=USD';
    $scope.getDOPE 	    = 'https://api.coinmarketcap.com/v1/ticker/dopecoin/?convert=BTC';
    $scope.btcDATA 	    = '';
    $scope.dopeDATA 	= '';
    $scope.buyAlert = localStorage.buyAlert ? localStorage.buyAlert : '';

    /**
     *	call ajax func
     */
    $scope.callAtInterval = function() {

        /**
         *  RUN ONCE SEARCH LOG
         */
        $http({
            method: "GET",
            url: $scope.getBTC,
            dataType: "json"
        }).
        then(function(response) {

            console.log(response.data[0].last_updated, response.data[0].percent_change_1h);

            $scope.btcDATA = response.data[0].price_usd.substring(0, 4).toString();

        }, function(response) {
            /*
            * Trow here
            * */
        });

        /**
         *  RUN ONCE SEARCH LOG
         */
        $http({
            method: "GET",
            url: $scope.getDOPE,
            dataType: "json"
        }).
        then(function(response) {

            $scope.dopeDATA = response.data[0].price_btc.substring(6, 10).toString();

        }, function(response) {
            /*
            * Trow here
            * */
        });
    };

    $scope.change = function() {

        localStorage.buyAlert = $scope.buyAlert = $scope.buyAlert;
        console.log('change function localStorage.buyAlert', localStorage.buyAlert);
    };

    /**
     *	make Notifications request every minute
     */
    $scope.callAtInterval();

}]);