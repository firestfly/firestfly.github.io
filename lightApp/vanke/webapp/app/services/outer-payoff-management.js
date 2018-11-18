/**
 * Created by ushio on 2017/9/29.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('OuterPayoffManagementService', outerPayoffManagementService);

    outerPayoffManagementService.$inject = ['$http', '$q'];

    function outerPayoffManagementService($http, $q) {
        var service = {
            searchPayoffList: searchPayoffList,
            setPayoffRange: setPayoffRange,
            searchOuterStaff: searchOuterStaff
        };
        return service;

        function searchOuterStaff(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/search-outer-users", {
                    params: params
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function searchPayoffList(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/outer-payoff-search", {
                    params: params
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function setPayoffRange(data) {
            var deferred = $q.defer();
            $http
                .post(apiBaseUrl + "/outer-payoff-range-set", data)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

    }
})();