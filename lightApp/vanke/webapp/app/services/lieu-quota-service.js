/**
 * Created by wangq34 on 2016/11/21.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('LieuQuotaService', LieuQuotaService);

    LieuQuotaService.$inject = ['$http', '$q'];

    function LieuQuotaService($http, $q) {
        var service = {
            getLieuQuotaList: getLieuQuotaList,
            getDetail: getDetail,
            preLiquidate: preLiquidate,
            getSearchDetail: getSearchDetail,
            getOvertimeRestRule: getOvertimeRestRule
        };

        return service;

        function getLieuQuotaList(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/lieuLeave/search", {
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

        function getSearchDetail(params, type) {
            var deferred = $q.defer();

            var url = "";
            if (type == "月休") {
                url = apiBaseUrl + '/holiday-monthly/' + params['search[value]'].id + '/detail';
            } else {
                url = apiBaseUrl + "/lieuLeave/search-detail";
            }

            $http.get(url, {
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

        function getDetail(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/lieuLeave/detail", {
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

        function preLiquidate(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/lieuLeave/pre-liquidate", {
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

        function getOvertimeRestRule(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/lieuLeave/overtime-rest-rule", {
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