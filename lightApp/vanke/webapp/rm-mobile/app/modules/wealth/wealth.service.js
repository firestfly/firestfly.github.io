(function () {
    'use strict';

    angular
        .module('rmMobile.home')
        .factory('WealthService', WealthService);

    WealthService.$inject = ['$http', '$q'];

    function WealthService($http, $q) {
        var service = {
            getWealthValue: getWealthValue,
            getWealthValueDetails: getWealthValueDetails,
            getNotWealthValueDetails: getNotWealthValueDetails,
            getWealthValueHistory: getWealthValueHistory,
            getNotWealthValueType: getNotWealthValueType
        };
        return service;
        function getNotWealthValueType() {
            var deferred = $q.defer();
            $http.get('dictionary?code=NOT_TASK_WEALTH_TYPE', {cache: true})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
        function getNotWealthValueDetails(params) {
            var deferred = $q.defer();
            $http.get(baseUrl + '/internal/api/wealth-value-app/details/not-task', {params: params})
                .success(function (response) {
                    deferred.resolve(response.result && response.result.notTaskWealthValueDetail);
                }).error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getWealthValueDetails(params) {
            var deferred = $q.defer();
            $http.get(baseUrl + '/internal/api/wealth-value-app/details/task', {params: params})
                .success(function (response) {
                    deferred.resolve(response.result && response.result.taskWealthValueDetail);
                }).error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getWealthValueHistory(params) {
            var deferred = $q.defer();
            $http.get(baseUrl + '/internal/api/wealth-value-app/exchange-history', {params: params})
                .success(function (response) {
                    deferred.resolve(response.result);
                }).error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getWealthValue(employeeId) {
            var deferred = $q.defer();
            $http.get(baseUrl + '/internal/api/wealth-value-app/employee-id/' + employeeId, {cache: true})
                .success(function (response) {
                    deferred.resolve(response.result);
                }).error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }
    }
})();
