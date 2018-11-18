/**
 * Created by wangq34 on 2016/11/4.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('ExperienceSearchService', ExperienceSearchService);

    ExperienceSearchService.$inject = ['$http', '$q'];

    function ExperienceSearchService($http, $q) {
        var service = {
            getExperienceSearchList: getExperienceSearchList,
            getDetail: getDetail
        };

        return service;

        function getExperienceSearchList(params) {
            var deferred = $q.defer();
            console.log(params);
            $http
                //.get('data/experience-search.json')
                .get(apiBaseUrl + "/experience-search/search", {
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
                .get(apiBaseUrl + "/experience-search/detail", {
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