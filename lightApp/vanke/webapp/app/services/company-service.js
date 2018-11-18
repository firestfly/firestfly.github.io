'use strict';

VkrmsApp.factory('CompanyService', ['$http', '$q', function ($http, $q) {
    return {
        getCompanies: function() {
            var deferred = $q.defer();

            $http.get(apiBaseUrl + '/companies').success(function(result) {
                deferred.resolve(result);
            }).error(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        },
        getAllDepartments: function() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/allDepartments').success(function(result) {
                deferred.resolve(result);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getAllWorkGroups: function() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/workgroups').success(function(result) {
                deferred.resolve(result);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getWorkJobs: function() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/workJobs').success(function(result) {
                deferred.resolve(result);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getSkills: function() {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/skills').success(function(result) {
                deferred.resolve(result);
            }).error(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
}]);