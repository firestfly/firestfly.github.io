'use strict';

VkrmsApp.factory('JobIncentiveRuleService', ['$http', '$q', 'CommonService', 'DataTableService', function ($http, $q, commonService, dataTableService) {

    function initJobIncentiveConfig(jobs) {
        var configs = [];
        for (var i = 0; i < jobs.length; i++) {
            var config = {};
            config.id = null;
            config.workJob = {
                "id": jobs[i].workJobId,
                "name": jobs[i].workJobName
            };
            config.incentiveRadix = 0;
            config.basicExchangeCoefficient = 0;
            config.incentiveExchangeCoefficient = 0;
            configs.push(config);
        }
        return configs;
    }

    function mergeJobIncentiveConfig(dest, src) {
        var jobIncentiveRules = dest;
        for (var i = 0; i < src.length; i++) {
            var rule = src[i];
            for (var j = 0; j < dest.length; j++) {
                if (src[i].workJob.id == jobIncentiveRules[j].workJob.id) {
                    jobIncentiveRules[j].id = rule.id;
                    jobIncentiveRules[j].incentiveRadix = rule.incentiveRadix;
                    jobIncentiveRules[j].basicExchangeCoefficient = rule.basicExchangeCoefficient;
                    jobIncentiveRules[j].incentiveExchangeCoefficient = rule.incentiveExchangeCoefficient;
                    break;
                }
            }
        }
        return jobIncentiveRules;
    }

    return {
        initTable: function (tableName) {
            var config = {
                "serverSide": false
            };
            dataTableService.initDataTable(tableName, config);
        },
        getJobIncentiveRules: function (ruleId) {
            var deferred = $q.defer();
            commonService.getStandardWorkJobs().then(function (jobs) {
                var jobIncentiveRules = initJobIncentiveConfig(jobs);
                commonService.httpGet('job-rules/' + ruleId + '/incentive-rule').then(function (rules) {
                    jobIncentiveRules = mergeJobIncentiveConfig(jobIncentiveRules, rules);
                    deferred.resolve(jobIncentiveRules);
                });
            });
            return deferred.promise;
        },
        getJobIncentiveRuleByTypeId: function (typeId, rules) {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].workJob.id == typeId) {
                    return rules[i];
                }
            }
            return null;
        },
        updateJobIncentiveRules: function (rule, rules) {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].workJob.id == rule.workJob.id) {
                    angular.extend(rules[i], rule);
                    break;
                }
            }
        }
    };
}]);