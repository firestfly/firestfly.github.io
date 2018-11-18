/**
 * Created by wangq34 on 2016/11/4.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('ExperienceVerifyService', ExperienceVerifyService);

    ExperienceVerifyService.$inject = ['$http', '$q'];

    function ExperienceVerifyService($http, $q) {
        var service = {
            getExperienceVerifyList: getExperienceVerifyList,
            verify: verify
        };

        function getExperienceVerifyList(params) {
            var deferred = $q.defer();
            $http
                //.get('data/experience-verify.json')
                .get(apiBaseUrl + "/experience-verify/search", {
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

        function verify(params) {
            var deferred = $q.defer();
            $http
                .post(apiBaseUrl + "/experience-verify/verify", params)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        return service;

    }
})();