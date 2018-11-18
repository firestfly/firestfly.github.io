'use strict';
(function (w) {
    w.VkrmsApp.factory('PostService', ['$http', 'CommonService', '$q', function ($http, commonService, $q) {
        return {
            getPost: function (params) {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + '/post/departmentId', {params: params}).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            editePost: function (param) {
                var deferred = $q.defer();
                $http({
                    url: apiBaseUrl + '/post',
                    method: "PUT",
                    data: param
                }).success(function (result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            addPost: function (param) {
                var deferred = $q.defer();
                $http({
                    url: apiBaseUrl + '/post',
                    method: "POST",
                    data: param
                }).success(function (result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            },
            delPost: function (id) {
                var deferred = $q.defer();
                $http({
                    url: apiBaseUrl + '/post/' + id,
                    method: "DELETE"
                }).success(function (result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            }
        };
    }]);
})(window);
