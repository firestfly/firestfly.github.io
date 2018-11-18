'use strict';

(function (w) {
    w.VkrmsApp.factory('NotTaskWealthService', ['$http', '$q', '$timeout', 'CommonService', function ($http, $q, $timeout, commonService) {
        return {
            delNotTaskWealth: delNotTaskWealth,
            getNotTaskWealthSetting: getNotTaskWealthSetting,
            getStandardWealthValue: getStandardWealthValue,
            saveNotTaskWealthInput: saveNotTaskWealthInput,
        };
        function getStandardWealthValue(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/not-task-wealth/department/standard-wealth-value', {params: params})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getNotTaskWealthSetting(data) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/not-task-wealth/settings', {params: data})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function delNotTaskWealth(id) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/not-task-wealth/' + id,
                method: "DELETE"
            }).success(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

        function saveNotTaskWealthInput(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/not-task-wealth',
                method: "PUT",
                data: params
            }).success(function (result) {
                deferred.resolve(result);
            });

            return deferred.promise;
        }


    }]);
})(window);