(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .factory('OrderCoefficientSettingService', OrderCoefficientSettingService);

    OrderCoefficientSettingService.$inject = ['$http', '$q'];

    function OrderCoefficientSettingService($http, $q) {
        var service = {
            getOrderRule: getOrderRule,
            saveOrderRule: saveOrderRule
        };

        return service;

        function getOrderRule(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/repair-wealth/order-coefficient-setting', {
                    params: params
                })
                //.get('data/order.json')
                .success(function (response) {
                    deferred.resolve(response)
                })
                .error(function (response) {
                    deferred.reject(response)
                });
            return deferred.promise;
        }

        function saveOrderRule(params) {
            var deferred = $q.defer();
            $http
                .post(apiBaseUrl + '/repair-wealth/order-coefficient-setting', params)
                .success(function (response) {
                    deferred.resolve(response)
                })
                .error(function () {
                    deferred.reject(response)
                });
            return deferred.promise;
        }
    }
})();