'use strict';

VkrmsApp.factory('TaskPointRuleService', ['$http', '$q', 'CommonService', 'DataTableService', function ($http, $q, commonService, dataTableService) {

    function initTaskPointConfig(tasks) {
        var configs = [];
        for (var i = 0; i < tasks.length; i++) {
            var config = {};
            config.id = null;
            config.taskType = {
                "id": tasks[i].id,
                "serialNumber": tasks[i].serialNumber,
                "description": tasks[i].description,
                "standardWorkingMinute": tasks[i].standardWorkingMinute,
                "parentType": angular.extend({}, tasks[i].parentType),
                "parentTypeDescription": tasks[i].parentTypeDescription
            };
            config.standardWorkingHourCoefficient = 0;
            config.responseTimeSetting = {
                "standardDurationInHours": 0,
                "aboveStandardPoint": 0,
                "belowStandardPoint": 0
            };
            config.finishTimeSetting = {
                "standardDurationInHours": 0,
                "aboveStandardPoint": 0,
                "belowStandardPoint": 0
            };
            config.assessmentSetting = {
                "oneStarPoint": 0,
                "twoStarPoint": 0,
                "threeStarPoint": 0,
                "fourStarPoint": 0,
                "fiveStarPoint": 0
            };
            config.incomeCoefficient = 0;
            configs.push(config);
        }
        return configs;
    }

    function mergeTaskPointConfig(dest, src) {
        var taskPointRules = dest;
        for (var i = 0; i < src.length; i++) {
            var rule = src[i];
            for (var j = 0; j < dest.length; j++) {
                if (src[i].taskType && taskPointRules[j].taskType && src[i].taskType.id == taskPointRules[j].taskType.id) {
                    taskPointRules[j].id = rule.id;
                    taskPointRules[j].responseTimeSetting.standardDurationInHours = rule.responseTimeSetting.standardDurationInHours;
                    taskPointRules[j].responseTimeSetting.aboveStandardPoint = rule.responseTimeSetting.aboveStandardPoint;
                    taskPointRules[j].responseTimeSetting.belowStandardPoint = rule.responseTimeSetting.belowStandardPoint;
                    taskPointRules[j].finishTimeSetting.standardDurationInHours = rule.finishTimeSetting.standardDurationInHours;
                    taskPointRules[j].finishTimeSetting.aboveStandardPoint = rule.finishTimeSetting.aboveStandardPoint;
                    taskPointRules[j].finishTimeSetting.belowStandardPoint = rule.finishTimeSetting.belowStandardPoint;
                    taskPointRules[j].assessmentSetting.oneStarPoint = rule.assessmentSetting.oneStarPoint;
                    taskPointRules[j].assessmentSetting.twoStarPoint = rule.assessmentSetting.twoStarPoint;
                    taskPointRules[j].assessmentSetting.threeStarPoint = rule.assessmentSetting.threeStarPoint;
                    taskPointRules[j].assessmentSetting.fourStarPoint = rule.assessmentSetting.fourStarPoint;
                    taskPointRules[j].assessmentSetting.fiveStarPoint = rule.assessmentSetting.fiveStarPoint;
                    taskPointRules[j].standardWorkingHourCoefficient = rule.standardWorkingHourCoefficient;
                    taskPointRules[j].incomeCoefficient = rule.incomeCoefficient;
                    break;
                }
            }
        }
        return taskPointRules;
    }

    return {
        initTable: function (tableName) {
            var config = {
                "serverSide": false,
                "scrollX": true
            };
            dataTableService.initDataTable(tableName, config);
        },
        getTaskPointRules: function (ruleId) {
            var deferred = $q.defer();
            commonService.httpGet('task-types-with-parent-description').then(function (tasks) {
                var taskPointRules = initTaskPointConfig(tasks);
                commonService.httpGet('task-rules/' + ruleId + '/point-rule').then(function (rules) {
                    taskPointRules = mergeTaskPointConfig(taskPointRules, rules);
                    deferred.resolve(taskPointRules);
                });
            });
            return deferred.promise;
        },
        getTaskPointRuleByTypeId: function (typeId, rules) {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].taskType.id == typeId) {
                    return rules[i];
                }
            }
            return null;
        },
        updateTaskPointRules: function (rule, rules) {
            for (var i = 0; i < rules.length; i++) {
                if (rules[i].taskType.id == rule.taskType.id) {
                    angular.extend(rules[i], rule);
                    break;
                }
            }
        }
    };
}]);