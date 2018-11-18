'use strict';
VkrmsApp.controller('PostExpRuleController', ['$scope', '$http', '$location', 'CommonService', 'DataTableService', 'PostExpRuleService', function ($scope, $http, $location, commonService, dataTableService, PostExpRuleService) {
    var config = PostExpRuleService.getConfiguration();

    $scope.open = open;
    $scope.clear = clear;
    $scope.search = searchRule;
    $scope.searchFromEnterKey = searchFromEnterKey;

    init();
    fetchData();
    bindEvent();

    function searchFromEnterKey(e) {
        if (e.keyCode === 13) {
            $scope.search();
        }
    }
    function init() {
        $scope.title = "万科资源管理信息系统 - " + config.title + "规则管理";
        commonService.applySearchStatus($scope);
        $scope.rules = [];
    }

    function fetchData() {
        PostExpRuleService.getRules(config.api).then(function (result) {
            $scope.rules = result.data;
            if ($scope.rules.length == 0) {
                PostExpRuleService.initTable(config.tableName);
            }
        });
    }

    function open() {
        PostExpRuleService.openAddDialog(config.api, config.authorityUrl, config.configUrl, config.dto);
    }

    function clear() {
        $scope.searchInputValue = "";
        dataTableService.dataTableSearchByColumn(config.tableName, 0, "");
    }

    function searchRule() {
        dataTableService.dataTableSearchByColumn(config.tableName, 0, $scope.searchInputValue);
        commonService.storageSearchStatus($scope, {
            searchInputValue: $scope.searchInputValue
        })
    }

    function bindEvent() {
        $scope.$on('$viewContentLoaded', function () {
            PostExpRuleService.bindEvent(config.api, config.tableName);
        });
        $scope.$on('ngRepeatFinished', function () {
            PostExpRuleService.initTable(config.tableName);
        });
    }
}]);

VkrmsApp.controller('NewPostExpRuleController', ['$scope', '$modalInstance', 'PostExpRuleService', 'api', 'dto', function ($scope, $modalInstance, PostExpRuleService, api, dto) {
    init();
    $scope.ok = ok;
    $scope.cancel = cancle;

    function init() {
        $scope.newRule = {};
        $scope.newRule[dto] = '';
    }

    function ok() {
        if ($scope.newRule[dto] !== '') {
            PostExpRuleService.addRule(api, $scope.newRule)
                .then(function (result) {
                    result.postExpRule = $scope.newRule[dto];
                    $modalInstance.close(result);
                }, function (error) {
                    $modalInstance.close(error);
                });
        }
    }

    function cancle() {
        $modalInstance.dismiss('cancel');
    }
}]);

VkrmsApp.controller('DeletePostExpRuleController', ['$scope', '$modalInstance', 'PostExpRuleService', 'taskRuleId', 'api', function ($scope, $modalInstance, PostExpRuleService, taskRuleId, api) {
    $scope.ok = ok;
    $scope.cancel = cancle;
    function ok() {
        PostExpRuleService.deleteRule(api, taskRuleId)
            .then(function (result) {
                $modalInstance.close(result);
            }, function (error) {
                $modalInstance.close(error);
            });
    }

    function cancle() {
        $modalInstance.dismiss();
    }
}]);