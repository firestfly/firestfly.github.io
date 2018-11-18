/**
 * Created by deepsky on 2017/5/2.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .factory('OtherHolidayBalanceService', OtherHolidayBalanceService);

    OtherHolidayBalanceService.$inject = ['$location', '$http', '$q'];

    function OtherHolidayBalanceService($location, $http, $q) {
        var service;
        service = {
            getOtherHolidayBalanceList: getOtherHolidayBalanceList,
            updateBalance: updateBalance,
            saveBalance: saveBalance
        };
        return service;

        function getOtherHolidayBalanceList(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/other-holiday-balance', {
                    params: params
                })
                // .get('http://localhost:8082/list', {
                //     params: params
                // })
                .success(function (response) {
                    deferred.resolve(response)
                })
                .error(function (response) {
                    deferred.reject(response)
                });
            return deferred.promise;
        }

        function updateBalance(id, params) {
            var deferred = $q.defer();
            $http.patch(apiBaseUrl + '/other-holiday-balance/' + id, params)
                .success(function (response) {
                    deferred.resolve(response)
                })
                .error(function (response) {
                    deferred.reject(response)
                });
            return deferred.promise;
        }

        function saveBalance(params) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + '/other-holiday-balance', params)
                .success(function (response) {
                    deferred.resolve(response)
                })
                .error(function (response) {
                    deferred.reject(response)
                });
            return deferred.promise;
        }

    }
})();