'use strict';
VkrmsApp.controller('ShiftGroupController', ['$rootScope', '$scope', '$http', '$location', 'CommonService', 'DataTableService', 'ShiftGroupService', function ($rootScope, $scope, $http, $location, commonService, dataTableService, ShiftGroupService) {
    var config = ShiftGroupService.getConfiguration();
    var tableName = "shift-group-table";

    $scope.title = "万科资源管理信息系统 - " + config.title + "规则管理";
    $scope.open = open;
    $scope.search = searchRule;

    bindEvent();

    $scope.$on('$viewContentLoaded', function () {
        commonService.applySearchStatus($scope);
        var settings = {
            "ajax": {
                "url": "shift-group-collect",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "columns": [
                {data: "shiftGroupName"},
                {data: "shiftGroupId"}
            ],
            "columnDefs": [
                {
                    "targets": -1,
                    "render": function (data, type, row) {
                        var str = '<a href="#/shift-group-authority/' + data +
                            '">设置班次组范围</a> |<a href="#/shifts-config/' + data +
                            '">设置班次组</a> |<a href="javascript:void(0)" class="text-danger" data="' +
                            data + '" type="delete">删除</a>';
                        return str;
                    }
                }
            ],
            scrollX: true
        };
        dataTableService.initDataTable(tableName, settings);
    });

    function open() {
        ShiftGroupService.openAddDialog(config.api, config.authorityUrl, config.configUrl, config.dto);
    }

    function searchRule() {
        var data = {
            "keywords": $scope.keywords
        };
        dataTableService.dataTableSearch(tableName, data);
        commonService.storageSearchStatus($scope, {
            "keywords": $scope.keywords
        });
    }

    function bindEvent() {
        $scope.$on('$viewContentLoaded', function () {
            ShiftGroupService.bindEvent(config.api, config.tableName);
        });
        $scope.$on('ngRepeatFinished', function () {
            ShiftGroupService.initTable(config.tableName);
        });
    }
}]);

VkrmsApp.controller('NewShiftsGroupController', ['$rootScope', '$scope', '$modalInstance', 'CommonService', 'ShiftGroupService', 'api', 'dto', function ($rootScope, $scope, $modalInstance, commonService, ShiftGroupService, api, dto) {
    init();
    $scope.ok = ok;
    $scope.cancel = cancle;

    function init() {
        $scope.newShiftGroup = {};
        $scope.newShiftGroup[dto] = '';
    }

    function ok() {
        if ($scope.newShiftGroup[dto] !== '') {
            ShiftGroupService.addShiftGroup(api, $scope.newShiftGroup)
                .then(function (result) {
                    result.shiftGroup = $scope.newShiftGroup[dto];
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

VkrmsApp.controller('DeleteShiftsGroupController', ['$scope', '$modalInstance', 'ShiftGroupService', 'shiftGroupId', 'api', function ($scope, $modalInstance, ShiftGroupService, shiftGroupId, api) {
    $scope.ok = ok;
    $scope.cancel = cancle;
    function ok() {
        ShiftGroupService.deleteShiftGroup(api, shiftGroupId)
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