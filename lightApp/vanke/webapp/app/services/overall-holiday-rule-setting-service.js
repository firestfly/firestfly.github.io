'use strict';

(function (w) {
    w.VkrmsApp.factory('OverallHolidayRuleSettingsService', ['$http', '$q', function ($http, $q) {
        var factory = {
            getHolidayRule: getHolidayRule,
            saveHolidayRuleSetting: saveHolidayRuleSetting,
            getWHolidayValiditys: getWHolidayValiditys,
            getWWorkHoursRules: getWWorkHoursRules,
            getYHolidayValiditys: getYHolidayValiditys,
            getWorkdayHolidayRule: getWorkdayHolidayRule,
            saveWorkdayHolidayRule: saveWorkdayHolidayRule,
            getNotOHolidayRule: getNotOHolidayRule,
            saveNotOHolidayRule: saveNotOHolidayRule
        };
        return factory;
        function saveNotOHolidayRule(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/integrate-holiday-monthly-rules-noto',
                method: "PATCH",
                data: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function () {
                deferred.reject("failed");
            });
            return deferred.promise;
        }
        function getNotOHolidayRule(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/integrate-holiday-monthly-rules-noto',
                method: "GET",
                params: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function () {
                deferred.reject("failed");
            });
            return deferred.promise;
        }
        function saveWorkdayHolidayRule(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/integrate-holiday-rule-setting/region-ids',
                method: "POST",
                data: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function () {
                deferred.reject("failed");
            });
            return deferred.promise;
        }
        function getWorkdayHolidayRule (params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/integrate-holiday-rule-setting/region-ids',
                method: "GET",
                params: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function () {
                deferred.reject("failed");
            });
            return deferred.promise;
        }
        function saveHolidayRuleSetting(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/integrate-holiday-monthly-rules',
                method: "PATCH",
                data: params
            }).success(function (result) {
                deferred.resolve(result);
            }).error(function () {
                deferred.reject("failed");
            });
            return deferred.promise;
        }

        function getWWorkHoursRules() {
            return [{text: "1", value: "标准工时"}, {text: "2", value: "综合工时"}];
        }

        function getYHolidayValiditys() {
            return ['本考勤周期', 1, 2, 3]
        }

        function getWHolidayValiditys() {
            return [{
                text: 1,
                value: 1
            }, {
                text: 2,
                value: 2
            }, {
                text: 3,
                value: 3
            }, {
                text: -1,
                value: "-"
            }, {
                text: 0,
                value: "本考勤周期"
            }];
        }

        function getHolidayRule(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/integrate-holiday-monthly-rules', {
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