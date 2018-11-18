'use strict';

VkrmsApp.controller('TaskPointRuleConfigController', ['$scope', '$http', '$location', 'CommonService', 'DataTableService', 'TaskPointRuleService', function ($scope, $http, $location, commonService, dataTableService, taskPointRuleService) {
    var tableName = "task-point-rules-config-table",
        ruleId = $location.search().id,
        rulesCache = [];

    $scope.title = "万科资源管理信息系统 - 任务积分规则设置";

    $scope.taskPointRuleConfigs = [];
    commonService.applySearchStatus($scope);
    taskPointRuleService.getTaskPointRules(ruleId).then(function (rules) {
        $scope.taskPointRuleConfigs = rulesCache = rules;
        if ($scope.taskPointRuleConfigs.length == 0) {
            taskPointRuleService.initTable(tableName);
        }
    });

    $scope.open = function (typeId, e) {
        var config = taskPointRuleService.getTaskPointRuleByTypeId(typeId, rulesCache);
        var newTaskRuleModal = commonService.createModal({
            'templateUrl': 'taskPointRuleConfigDialog.html',
            'controller': 'TaskPointRuleConfigModalController',
            'size': 'lg',
            'resolve': {
                'taskPointRuleConfig': function () {
                    return config;
                },
                'ruleId': function () {
                    return ruleId;
                }
            }
        });

        newTaskRuleModal.result.then(function (result) {
            if (result == 'unchanged') {
                return;
            }

            var cell = window.dataTable.cell($(e.target).parents('td')),
                row = cell.index().row;

            window.dataTable.cell(row, 3).data(result.standardWorkingHourCoefficient);
            window.dataTable.cell(row, 4).data(result.responseTimeSetting.standardDurationInHours);
            window.dataTable.cell(row, 5).data(result.responseTimeSetting.aboveStandardPoint);
            window.dataTable.cell(row, 6).data(result.responseTimeSetting.belowStandardPoint);
            window.dataTable.cell(row, 7).data(result.finishTimeSetting.standardDurationInHours);
            window.dataTable.cell(row, 8).data(result.finishTimeSetting.aboveStandardPoint);
            window.dataTable.cell(row, 9).data(result.finishTimeSetting.belowStandardPoint);
            window.dataTable.cell(row, 10).data(result.assessmentSetting.oneStarPoint);
            window.dataTable.cell(row, 11).data(result.assessmentSetting.twoStarPoint);
            window.dataTable.cell(row, 12).data(result.assessmentSetting.threeStarPoint);
            window.dataTable.cell(row, 13).data(result.assessmentSetting.fourStarPoint);
            window.dataTable.cell(row, 14).data(result.assessmentSetting.fiveStarPoint);
            window.dataTable.cell(row, 15).data(result.incomeCoefficient);

            taskPointRuleService.updateTaskPointRules(result, rulesCache);
        }, function (dismiss) {
        });
    };

    $scope.$on('ngRepeatFinished', function () {
        taskPointRuleService.initTable(tableName);
    });

    $scope.clear = function () {
        $scope.searchInputValue = "";
        dataTableService.dataTableSearchByColumn(tableName, 0, "");
    };

    $scope.search = function () {
        dataTableService.dataTableSearchByColumn(tableName, 0, $scope.searchInputValue);
        commonService.storageSearchStatus($scope, {
            searchInputValue: $scope.searchInputValue
        })
    };

}]);

VkrmsApp.controller('TaskPointRuleConfigModalController', ['$scope', '$modalInstance', 'CommonService', 'taskPointRuleConfig', 'ruleId', function ($scope, $modalInstance, commonService, taskPointRuleConfig, ruleId) {
    $scope.taskPointRuleConfig = angular.copy(taskPointRuleConfig);
    $scope.original = taskPointRuleConfig;

    $scope.ok = function () {
        if (isChanged()) {
            if (isNew()) {
                commonService.httpPost('/task-rules/' + ruleId + '/point-rule', $scope.taskPointRuleConfig).then(function (result) {
                    $modalInstance.close(result);
                });
            } else {
                commonService.httpPut('/task-rules/' + ruleId + '/point-rule/' + $scope.taskPointRuleConfig.id, $scope.taskPointRuleConfig).then(function (result) {
                    $modalInstance.close(result);
                });
            }
        } else {
            $modalInstance.close('unchanged');
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function isNew() {
        return $scope.original.id == null;
    }

    function isChanged() {
        return ($scope.taskPointRuleConfig.responseTimeSetting.standardDurationInHours != $scope.original.responseTimeSetting.standardDurationInHours ||
        $scope.taskPointRuleConfig.responseTimeSetting.aboveStandardPoint != $scope.original.responseTimeSetting.aboveStandardPoint ||
        $scope.taskPointRuleConfig.responseTimeSetting.belowStandardPoint != $scope.original.responseTimeSetting.belowStandardPoint ||
        $scope.taskPointRuleConfig.finishTimeSetting.standardDurationInHours != $scope.original.finishTimeSetting.standardDurationInHours ||
        $scope.taskPointRuleConfig.finishTimeSetting.aboveStandardPoint != $scope.original.finishTimeSetting.aboveStandardPoint ||
        $scope.taskPointRuleConfig.finishTimeSetting.belowStandardPoint != $scope.original.finishTimeSetting.belowStandardPoint ||
        $scope.taskPointRuleConfig.assessmentSetting.oneStarPoint != $scope.original.assessmentSetting.oneStarPoint ||
        $scope.taskPointRuleConfig.assessmentSetting.twoStarPoint != $scope.original.assessmentSetting.twoStarPoint ||
        $scope.taskPointRuleConfig.assessmentSetting.threeStarPoint != $scope.original.assessmentSetting.threeStarPoint ||
        $scope.taskPointRuleConfig.assessmentSetting.fourStarPoint != $scope.original.assessmentSetting.fourStarPoint ||
        $scope.taskPointRuleConfig.assessmentSetting.fiveStarPoint != $scope.original.assessmentSetting.fiveStarPoint ||
        $scope.taskPointRuleConfig.standardWorkingHourCoefficient != $scope.original.standardWorkingHourCoefficient ||
        $scope.taskPointRuleConfig.incomeCoefficient != $scope.original.incomeCoefficient)
    }
}]);