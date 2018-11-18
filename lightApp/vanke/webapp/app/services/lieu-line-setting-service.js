/**
 * Created by ushio on 2017/3/16.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('LieuLineSettingService', LieuLineSettingService);

    LieuLineSettingService.$inject = ['$http', '$q'];

    function LieuLineSettingService($http, $q) {
        var service = {
            getLieuLineList: getLieuLineList,
            getLieuLineNotOList: getLieuLineNotOList,
            save: save,
            saveNotO: saveNotO,
            getAttendanceList: getAttendanceList
        };

        return service;
        function saveNotO(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/holiday-monthly-rules-noto',
                method: "PATCH",
                data: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function () {
                deferred.reject("failed");
            });
            return deferred.promise;
        }
        function getLieuLineNotOList (params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/holiday-monthly-rules-noto', {
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
        function getLieuLineList (params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/holiday-monthly-rules', {
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

        function save(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/holiday-monthly-rules',
                method: "PATCH",
                data: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function () {
                deferred.reject("failed");
            });
            return deferred.promise;
        }
        function getAttendanceList () {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/attendance-lock-cycle-later')
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