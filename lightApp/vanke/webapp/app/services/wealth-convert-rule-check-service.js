/**
 * Created by wangq34 on 2016/10/17.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('WealthConvertRuleCheckService', WealthConvertRuleCheckService);

    WealthConvertRuleCheckService.$inject = ['$http', '$q'];

    function WealthConvertRuleCheckService($http, $q) {
        var service = {
            getConvertResult: getConvertResult,
            getWealthDetail: getWealthDetail
        };

        return service;
        function getWealthDetail(params) {
            var deferred = $q.defer();
            $http
                .get('internal/api/wealth-convert/wealth-detail', {
                    params: params
                })
                .success(function (response) {
                    deferred.resolve(response)
                })
                .error(function (response) {
                    deferred.reject(response)
                });
            return deferred.promise;
        }

        function getConvertResult(params) {
            var deferred = $q.defer();

            $http
                .get('internal/api/wealth-convert/wealth-convert-rule', {
                    params: params
                })
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