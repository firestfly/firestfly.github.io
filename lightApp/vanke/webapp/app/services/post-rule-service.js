'use strict';
(function (w) {
    w.VkrmsApp.factory('PostRuleService', ['$http', 'CommonService', '$q', function ($http, commonService, $q) {
        return {
            getDays: function () {
                return [
                    {id: 0, name: '工作日'},
                    {id: 1, name: '休息日'},
                    {id: 2, name: '法定节假日'}
                ];
            },
            getRule: function (id) {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + '/post-rule/' + id).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getDepartmentShifts: function (id) {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + '/department-fixed-post-collect/' + id).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            saveJobs: function (param) {
                $http({
                    url: apiBaseUrl + '/post-rule/job',
                    method: "POST",
                    data: param
                }).success(function (result) {

                });
            },
            addRule: function (param) {
                var deferred = $q.defer();
                $http({
                    url: apiBaseUrl + '/post-rule',
                    method: "POST",
                    data: param
                }).success(function (result) {
                    deferred.resolve(result);
                }).error(function () {
                    deferred.reject("failed");
                });
                return deferred.promise;
            },
            delRule: function (id) {
                var deferred = $q.defer();
                $http.delete(apiBaseUrl + '/post-time-rule/' + id)
                    .success(function () {
                        deferred.resolve("succeed");
                    }).error(function () {
                        deferred.reject("failed");
                    });
                return deferred.promise;
            },
            editeRule: function (param) {
                var deferred = $q.defer();
                $http({
                    url: apiBaseUrl + '/post-rule',
                    method: "PUT",
                    data: param
                }).success(function (result) {
                    deferred.resolve("succeed");
                }).error(function () {
                    deferred.reject("failed");
                });
                return deferred.promise;
            }
        };
    }]);
})(window);
