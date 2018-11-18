(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .factory('RepairWealthRuleService', RepairWealthRuleService);

    RepairWealthRuleService.$inject = ['$http', '$q'];

    function RepairWealthRuleService($http, $q) {
        var service = {
            getRepairWealthRule: getRepairWealthRule,
            saveRepairWealthRule: saveRepairWealthRule
        };

        return service;

        function getRepairWealthRule(params) {
            var deferred = $q.defer();
            // apiBaseUrl + "/repair-wealth/repair-wealth-rule"
            // data/wealth.json
            $http
                .get(apiBaseUrl + "/repair-wealth/repair-wealth-rule", {
                    params: params
                })
                .success(function (fixedPostSchedules) {
                    deferred.resolve(fixedPostSchedules);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function saveRepairWealthRule(params) {
            var deferred = $q.defer();
            // apiBaseUrl + "/repair-wealth/repair-wealth-rule"
            // data/wealth.json
            $http
                .post(apiBaseUrl + "/repair-wealth/repair-wealth-rule", params)
                .success(function (fixedPostSchedules) {
                    deferred.resolve(fixedPostSchedules);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    }
})();