'use strict';

VkrmsApp.controller('JobIncentiveRuleConfigController', ['$scope', '$http', '$location', 'CommonService', 'DataTableService', 'JobIncentiveRuleService', function ($scope, $http, $location, commonService, dataTableService, jobIncentiveRuleService) {
    var tableName = "job-incentive-rules-config-table",
        ruleId = $location.search().id,
        rulesCache = [];
    commonService.applySearchStatus($scope);
    $scope.title = "万科资源管理信息系统 - 提成规则设置";

    $scope.jobIncentiveRuleConfigs = [];

    jobIncentiveRuleService.getJobIncentiveRules(ruleId).then(function (rules) {
        $scope.jobIncentiveRuleConfigs = rulesCache = rules;
        if ($scope.jobIncentiveRuleConfigs.length == 0) {
            jobIncentiveRuleService.initTable(tableName);
        }
    });

    $scope.open = function (typeId, e) {
        var config = jobIncentiveRuleService.getJobIncentiveRuleByTypeId(typeId, rulesCache);
        var newJobRuleModal = commonService.createModal({
            'templateUrl': 'jobIncentiveRuleConfigDialog.html',
            'controller': 'JobIncentiveRuleConfigModalController',
            'resolve': {
                'jobIncentiveRuleConfig': function () {
                    return config;
                },
                'ruleId': function () {
                    return ruleId;
                }
            }
        });

        newJobRuleModal.result.then(function (result) {
            if (result == 'unchanged') {
                return;
            }

            var cell = window.dataTable.cell($(e.target).parents('td')),
                row = cell.index().row;

            window.dataTable.cell(row, 1).data(result.incentiveRadix);
            window.dataTable.cell(row, 2).data(result.basicExchangeCoefficient);
            window.dataTable.cell(row, 3).data(result.incentiveExchangeCoefficient);

            jobIncentiveRuleService.updateJobIncentiveRules(result, rulesCache);
        }, function (dismiss) {
        });
    };

    $scope.$on('ngRepeatFinished', function () {
        jobIncentiveRuleService.initTable(tableName);
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
    $scope.searchFromEnterKey = function (e) {
        if (e.keyCode === 13) {
            $scope.search();
        }
    }
}]);

VkrmsApp.controller('JobIncentiveRuleConfigModalController', ['$scope', '$modalInstance', 'CommonService', 'jobIncentiveRuleConfig', 'ruleId', function ($scope, $modalInstance, commonService, jobIncentiveRuleConfig, ruleId) {
    $scope.jobIncentiveRuleConfig = angular.copy(jobIncentiveRuleConfig);
    $scope.original = jobIncentiveRuleConfig;

    $scope.ok = function () {
        if (isChanged()) {
            if (isNew()) {
                commonService.httpPost('/job-rules/' + ruleId + '/incentive-rule', $scope.jobIncentiveRuleConfig).then(function (result) {
                    $modalInstance.close(result);
                });
            } else {
                commonService.httpPut('/job-rules/' + ruleId + '/incentive-rule/' + $scope.jobIncentiveRuleConfig.id, $scope.jobIncentiveRuleConfig).then(function (result) {
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
        return ($scope.jobIncentiveRuleConfig.incentiveRadix != $scope.original.incentiveRadix ||
        $scope.jobIncentiveRuleConfig.basicExchangeCoefficient != $scope.original.basicExchangeCoefficient ||
        $scope.jobIncentiveRuleConfig.incentiveExchangeCoefficient != $scope.original.incentiveExchangeCoefficient)
    }
}]);