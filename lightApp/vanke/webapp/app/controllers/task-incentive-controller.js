'use strict';

VkrmsApp.controller('TaskIncentiveController', ['$scope', '$http', 'DataTableService', 'CommonService', 'TaskIncentiveService', 'UserService', function ($scope, $http, dataTableService, commonService, taskIncentiveService, userService) {
    $scope.title = "万科资源管理信息系统 - 任务提成按月汇总";

    $scope.commonSearchBarConfig = {
        companySelecterLabel: "公司范围",
        departmentSelecterLabel: "部门/项目",
        workgroupSelecterLabel: "岗位专业分类"
    };
    $scope.$on('$viewContentLoaded', function () {
        var loginUserObj = {};
        userService.getCurrentUser().then(function (result) {
            loginUserObj = result;
        }, function (result) {
        });
        var config = {
            "ajax": {
                "url": "task-summary",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "columnDefs": [
                {
                    "targets": -4,
                    "render": function ( data ) {
                        return formatNumber(data);
                    }
                },
                {
                    "targets": -3,
                    "render": function ( data ) {
                        return  formatNumber(data);
                    }
                },
                {
                    "targets": -2,
                    "render": function ( data ) {
                        return formatNumber(data);
                    }
                },
                {
                    "targets": -1,
                    "render": function ( data ) {
                        return formatNumber(data);
                    }
                }
            ]
        };
        dataTableService.initDataTable("task-incentive-monthly-table", config);
        $(".dataTables_empty").parent().hide();
    });

    $scope.search = function () {
        if ( !isSearchInfoValid() ) {
            return;
        }

        var selectedDates = commonService.getSelectedDates();
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords
        };
        dataTableService.dataTableSearch("task-incentive-monthly-table", data);
        commonService.storageSearchStatus($scope);
    };

    $scope.export = function () {
        var selectedDates = commonService.getSelectedDates();
        if (null == selectedDates.beginDate || null == selectedDates.endDate || undefined == selectedDates.beginDate || undefined == selectedDates.endDate) {
            commonService.alert({
                content: '请选择开始时间和结束时间',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        var params = {
            start: ($scope.currentPage - 1) * $scope.pageSize,
            length: $scope.pageSize,
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords
        };
        taskIncentiveService.exportTaskIncentive(params);
    };

    function formatNumber (numberString) {
        if ( numberString != "-" ) {
            return parseFloat(numberString).toFixed(2);
        } else {
            return numberString;
        }
    }

    function isSearchInfoValid () {
        var selectedDates = commonService.getSelectedDates();
        if ( !$scope.selectedDepartments || $scope.selectedDepartments.length < 1 ) {
            commonService.alert({
                content: "请选择查询部门",
                icon: "fa-exclamation-circle"
            });
            return false;
        }
        /*if ( !$scope.selectedGroups || $scope.selectedGroups.length < 1 ) {
            commonService.alert({
                content: "请选择员工子组",
                icon: "fa-exclamation-circle"
            });
            return false;
         }*/
        if ( !selectedDates.beginDate || !selectedDates.endDate ) {
            commonService.alert({
                content: "请选择开始时间和结束时间",
                icon: "fa-exclamation-circle"
            });
            return false;
        }
        return true;
    }

}]);

