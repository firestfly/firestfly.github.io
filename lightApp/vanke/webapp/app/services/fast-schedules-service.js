/**
 * Created by wangq34 on 2016/8/29.
 */

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .factory('FastScheduleService', FastScheduleService);

    FastScheduleService.$inject = ['$q', '$http'];

    function FastScheduleService($q, $http) {
        var service = {
            getPosts: getPosts,
            getShifts: getShifts,
            getEmployees: getEmployees,
            saveFastSchedule: saveFastSchedule,
            getExtraRules: getExtraRules,
        };

        return service;

        function saveFastSchedule(data) {
            var deferred = $q.defer();
            $http
                .post(apiBaseUrl + "/fast-schedule", data)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getEmployees(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/fast-schedule/employee", {
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

        function getShifts(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/fast-schedule/shift", {
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

        function getPosts(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/fast-schedule/post", {
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

        function getExtraRules(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/extra-post-rules", {
                    params: {"search": JSON.stringify(params)}
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