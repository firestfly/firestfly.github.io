/**
 * Created by ushio on 2017/5/3.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('LeaveRecordsListService', LeaveRecordsListService);

    LeaveRecordsListService.$inject = ['$http', '$q'];

    function LeaveRecordsListService($http, $q) {
        var service = {
            getList: getList,
            getApproveList: getApproveList
        };

        return service;

        function getList(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/leave-records-list', {
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

        function getApproveList(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/leave-approve-list', {
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
    }
})();