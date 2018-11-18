'use strict';

(function (w) {
    w.VkrmsApp.factory('HolidayRuleSettingsService', ['$http', '$q', function ($http, $q) {
        var factory = {
            getHolidayRule: getHolidayRule,
            saveHolidayRuleSetting: saveHolidayRuleSetting,
            getWHolidayValiditys: getWHolidayValiditys,
            getWWorkHoursRules: getWWorkHoursRules,
            getYHolidayValiditys: getYHolidayValiditys,
            getWorkdayHolidayRule: getWorkdayHolidayRule,
            saveWorkdayHolidayRule: saveWorkdayHolidayRule
        };
        return factory;
        function saveWorkdayHolidayRule(params) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/workday/holiday-rule-setting',
                method: "PUT",
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
                url: apiBaseUrl + '/workday/holiday-rule-setting',
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
                url: apiBaseUrl + '/holiday-rule-setting/region-ids',
                method: "POST",
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
            return ["本考勤周期", 1, 2, 3];
        }

        function getHolidayRule(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/holiday-rule-setting/region-ids', {
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