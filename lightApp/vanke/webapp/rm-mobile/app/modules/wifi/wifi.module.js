/**
 * Created by wangq34 on 2016/7/18.
 */

(function () {
    'use strict';

    angular
        .module('rmMobile.wifi', [])
        .factory('WifiService', WifiService);

    WifiService.$inject = ['$http', '$q'];

    function WifiService($http, $q) {
        var service = {
            getWifiInfo: getWifiInfo,
            getFixedPosts: getFixedPosts,
            saveWifiInfo: saveWifiInfo,
            getWifiLists: getWifiLists,
            updateWifiInfo: updateWifiInfo,
            deleteWifiInfo: deleteWifiInfo
        };

        return service;

        function saveWifiInfo(params) {
            var deferred = $q.defer();
            $http
                .post(baseUrl + '/internal/api/wifi/addWifi', params)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function updateWifiInfo(params) {
            var deferred = $q.defer();
            $http
                .put(baseUrl + '/internal/api/wifi/updateWifi', params)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getFixedPosts(departmentId) {
            var deferred = $q.defer();
            $http
                .get(baseUrl + '/internal/api/posts/department-id/' + departmentId)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getWifiInfo(params) {
            var deferred = $q.defer();
            $http
                .get(baseUrl + '/internal/api/wifi/wifi-detail', {
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

        function getWifiLists(departmentId) {
            var deferred = $q.defer();
            $http
                .get(baseUrl + '/internal/api/wifi/searchWifi/' + departmentId)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function deleteWifiInfo(id) {
            var deferred = $q.defer();
            $http
                .delete(baseUrl + '/internal/api/wifi/' + id)
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