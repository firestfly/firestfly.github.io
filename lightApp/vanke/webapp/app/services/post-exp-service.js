'use strict';

(function (w) {
    w.VkrmsApp.factory('PostExpService', ['$http', '$q', function ($http, $q) {

        var factory = {
            createPostExp: createPostExp,
            updatePostExp: updatePostExp,
            getPostExp: getPostExp
        }

        return factory;

        function createPostExp(data) {
            var deferred = $q.defer();

            $http.post(apiBaseUrl + '/post-exp', data).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function updatePostExp(data) {
            var deferred = $q.defer();

            $http.put(apiBaseUrl + '/post-exp', data).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getPostExp(data) {
            var deferred = $q.defer();

            $http.get(apiBaseUrl + '/post-exp-collect/' + data.experienceRuleId + '/' + data.postId + '/' + data.postExperienceId).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    }]);
})(window);