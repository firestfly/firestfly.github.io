'use strict';

VkrmsApp.controller('TaskReportController', ['$scope', '$http', '$timeout', 'CommonService', 'DataTableService', function ($scope, $http, $timeout, commonService, dataTableService) {
    $scope.title = "万科资源管理信息系统 - 任务信息";


    $scope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            $("#input-search-field").attr("placeholder", "输入资源编号/SAP编号/姓名/任务 搜索");
        }, 100, false);
        var config = {
            "ajax": {
                "url": "tasks",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "scrollX": true
        };
        dataTableService.initDataTable("task-table", config);
    });

    $scope.search = function () {
        var selectedDates = commonService.getSelectedDates();
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords
        };
        dataTableService.dataTableSearch("task-table", data);
    };
    $scope.export = function () {
        var url = baseUrl + "/file/export-excel-task";
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
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords
        };

        commonService.downloadFile(url, params);

        /*
         var workingGroupsParam = null == params.workingGroups || params.workingGroups.length == 0 ? "" : "&workingGroups=" + params.workingGroups;
         var departmentsParam = null == params.departments || params.departments.length == 0 ? "" : "&departments=" + params.departments;
         location.href = url + "?beginDate=" + params.beginDate +
         "&endDate=" + params.endDate + "&keywords=" + params.keywords + workingGroupsParam + departmentsParam;*/
    };


}]);
