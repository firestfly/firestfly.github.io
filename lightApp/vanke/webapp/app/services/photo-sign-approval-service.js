/**
 * Created by ushio on 2017/11/9.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .factory('PhotoSignApprovalService', photoSignApprovalService);

    photoSignApprovalService.$inject = ['$http', '$q'];

    function photoSignApprovalService($http, $q) {
        var service = {
            search: search,
            approve: approve
        };
        return service;

        function search(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/picture-sign-approve", {
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

        function approve(params) {
            var deferred = $q.defer();
            $http
                .post(apiBaseUrl + "/picture-sign-approve", params)
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