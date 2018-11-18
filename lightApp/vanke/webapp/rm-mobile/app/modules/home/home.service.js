/**
 * Created by wangq34 on 2016/7/19.
 */

(function () {
    'use strict';

    angular
        .module('rmMobile.home')
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$http', '$q'];

    function HomeService($http, $q) {
        var service = {
            isSettingUp: isSettingUp
        };
        return service;

        function isSettingUp(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/wifi/wifi-detail', {
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
