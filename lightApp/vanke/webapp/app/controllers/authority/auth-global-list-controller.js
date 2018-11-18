'use strict';

VkrmsApp.controller('AuthGlobalListController', ['$scope', '$http', 'DataTableService', 'CommonService', 'SelectedEmployee', function ($scope, $http, dataTableService, commonService, selectedEmployee) {
    $scope.title = "万科资源管理信息系统 - 权限管理";
    $scope.selectedEmployee = selectedEmployee;
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: true,
        isDepartmentSelectpickerMultipe: true
    };
    $scope.$on('$viewContentLoaded', function () {
        var config = {
            "ajax": {
                "url": "employees",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "columnDefs": [{
                "targets": -1,
                "data": null,
                "defaultContent": '<a type="configOrgAuth" class="configOrgAuth pt5 pb5 ib">设置权限</a>'
            }],
            "initComplete": function () {
                bindLink();
            }
        };
        dataTableService.initDataTable("employee-table", config);

        window.dataTable.on('draw.dt', function () {
            bindLink();
        });
    });

    function bindLink() {
        updateSelectedPerson();

        var employeeTable = $('#employee-table tbody');
        employeeTable.find('a[type=configOrgAuth]').each(function (index, value) {
            var hash = "#/authority/auth-organization-config";
            $(this).attr('href', hash);
        });
    }

    function updateSelectedPerson() {
        $(".configOrgAuth").on('click', function () {
            var employeeDetail = window.dataTable.row($(this).parents('tr')).data();
            employeeDetail.pop(0);
            $scope.selectedEmployee.employeeDetail = employeeDetail;
            $scope.selectedEmployee.employeeId = employeeDetail[0];
        });
    }

    $scope.search = function () {
        var selectedDates = commonService.getSelectedDates();
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "jobStatus": $scope.jobStatus
        };
        dataTableService.dataTableSearch("employee-table", data);
        bindLink();
        commonService.storageSearchStatus($scope);
    };

}]);
