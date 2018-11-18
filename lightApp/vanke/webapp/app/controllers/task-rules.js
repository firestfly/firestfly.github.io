'use strict';

VkrmsApp.directive('onFinishRender', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
}]);

VkrmsApp.controller('TaskRuleController', ['$scope', '$http', '$location', 'CommonService', 'DataTableService', 'TaskRuleService', function ($scope, $http, $location, commonService, dataTableService, taskRuleService) {
    var config = taskRuleService.getConfigurationByType($location.path()),
        search = $("#search");

    $scope.title = "万科资源管理信息系统 - " + config.title + "规则管理";
    commonService.applySearchStatus($scope);
    $scope.rules = [];
    taskRuleService.getRules(config.api).then(function (result) {
        $scope.rules = result.data;
        if ($scope.rules.length == 0) {
            taskRuleService.initTable(config.tableName);
        }
    });

    $scope.open = function () {
        taskRuleService.openAddDialog(config.api, config.authorityUrl, config.configUrl, config.dto);
    };

    $scope.clear = function () {
        $scope.searchInputValue = "";
        dataTableService.dataTableSearchByColumn(config.tableName, 0, "");
    };

    $scope.$on('$viewContentLoaded', function () {
        taskRuleService.bindEvent(config.api, config.tableName);
    });

    $scope.$on('ngRepeatFinished', function () {
        taskRuleService.initTable(config.tableName);
    });

    $scope.search = function () {
        dataTableService.dataTableSearchByColumn(config.tableName, 0, $scope.searchInputValue);
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

VkrmsApp.controller('NewRuleController', ['$scope', '$modalInstance', 'TaskRuleService', 'api', 'dto', function ($scope, $modalInstance, taskRuleService, api, dto) {
    $scope.newRule = {};
    $scope.newRule[dto] = '';

    $scope.ok = function () {
        if ($scope.newRule[dto] !== '') {
            taskRuleService.addRule(api, $scope.newRule)
                .then(function (result) {
                    $modalInstance.close(result);
                }, function (error) {
                    $modalInstance.close(error);
                });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

VkrmsApp.controller('DeleteRuleController', ['$scope', '$modalInstance', 'TaskRuleService', 'taskRuleId', 'api', function ($scope, $modalInstance, taskRuleService, taskRuleId, api) {
    $scope.ok = function () {
        taskRuleService.deleteRule(api, taskRuleId)
            .then(function (result) {
                $modalInstance.close(result);
            }, function (error) {
                $modalInstance.close(error);
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);
