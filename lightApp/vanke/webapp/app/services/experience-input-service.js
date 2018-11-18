/**
 * Created by deepsky on 2016/11/15.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('ExperienceInputService', ExperienceInputService);

    ExperienceInputService.$inject = ['$http', '$q'];

    function ExperienceInputService($http, $q) {
        var service = {
            experienceView: experienceView,
            getOneLevelTarget: getOneLevelTarget,
            getTwoLevelTarget: getTwoLevelTarget,
            getThreeLevelTarget: getThreeLevelTarget,
            getExperienceFromTarget: getExperienceFromTarget,
            imageUploads: imageUploads
        };

        return service;

        function experienceView(params) {
            var deferred = $q.defer();
            $http
                // .get('data/experience-search.json')
                .get(apiBaseUrl + "/experience-view", {
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

        function getOneLevelTarget(jobId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/target-type/one/jobId/" + jobId)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getTwoLevelTarget(number) {
            var deferred = $q.defer();
            $http
                // .get('data/one.json')
                .get(apiBaseUrl + "/target-type/two/targetNumber/" + number)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getThreeLevelTarget(number) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/target-type/three/targetNumber/" + number)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getExperienceFromTarget(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/get-post-experience", {
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

        function imageUploads(params, type) {
            var deferred = $q.defer();
            $http
                .post(apiBaseUrl + "/file/saveFile", params, {
                    headers: {'content-disposition': type}
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