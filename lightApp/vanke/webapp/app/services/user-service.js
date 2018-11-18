'use strict';

VkrmsApp.factory('UserService', ['$http', '$q', function ($http, $q) {
    return {
        currentUser: {},
        getCurrentUser: function (params) {
            var deferred = $q.defer();
            if (angular.isUndefined(params)) {
                params = {cache: true}
            }
            if (!angular.isObject(params)) {
                params = {};
            }
            var href = "/users/-";
            if (location.hash.indexOf("department-info-view") >= 0) {
                href = "/users-departments/-"
            }
            $http.get(apiBaseUrl + href, params).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getUserEmployee: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/users/employee/-', {cache: true}).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getSelectedUser: function(employeeId) {
            if (employeeId) {
                var deferred = $q.defer();

                $http.get(apiBaseUrl + '/users?employeeId=' + employeeId).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        },
        updateSelectedUser: function (userId, data) {
            if (userId) {
                var deferred = $q.defer();

                $http.post(apiBaseUrl + '/users/' + userId, data).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        },
        getCurrentUserRoleGroups: function () {
            var deferred = $q.defer();

            $http.get(apiBaseUrl + '/roleGroups').success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        getSelectedUserRoleGroups: function (employeeId) {
            if (employeeId) {
                var deferred = $q.defer();

                $http.get(apiBaseUrl + '/roleGroups/' + employeeId).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        },
        updateSelectedUserRoleGroups: function (employeeId, data) {
            if (employeeId) {
                var deferred = $q.defer();

                $http.put(apiBaseUrl + '/roleGroups/' + employeeId, data).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        },
        loginUserData: null
    }
}]);