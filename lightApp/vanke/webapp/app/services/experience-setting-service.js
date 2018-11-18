'use strict';

(function (w) {
    w.VkrmsApp.factory('ExperienceSettingsService', ['$http', '$q', function ($http, $q) {
        var factory = {
            getPost: getPost,
            getTargetName: getTargetName,
            getSituation: getSituation,
            getExperienceSetting: getExperienceSetting,
            saveExperienceSetting: saveExperienceSetting
        };
        return factory;
        function getPost() {
            var deferred = $q.defer();

            $http.get(apiBaseUrl + '/standard-post').success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function saveExperienceSetting(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/experience-rules-setting',
                method: "POST",
                data: params
            }).success(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

        function getSituation(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/standard-post/target/situation', {
                params: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getTargetName(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/standard-post/target', {
                params: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getExperienceSetting(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/experience-rules-setting', {
                params: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }]);
})(window);