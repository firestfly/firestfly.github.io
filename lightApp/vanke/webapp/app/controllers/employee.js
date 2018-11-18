'use strict';

VkrmsApp.controller('EmployeeController', ['$scope', '$http', 'EmployeeService', 'DataTableService', 'CommonService', '$timeout', function ($scope, $http, employeeService, dataTableService, commonService, $timeout) {
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: true,
        isDepartmentSelectpickerMultipe: true
    };
    $scope.exportTemplate = exportTemplate;

    var optStr,
        isOnlySeeEmployees = location.hash.indexOf("employees-see") >= 0;
    optStr = isOnlySeeEmployees ? '<a href="#" type="view">查看详情</a>' : '<a href="#" type="view">查看详情</a> | <a href="#" type="edit">修改</a>';

    $scope.$on('$viewContentLoaded', function () {
        var config = {
            "ajax": {
                "url": "employees",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "columnDefs": [
                {
                    "targets": -1,
                    "data": null,
                    //"defaultContent": '<a href="#" type="view">查看详情</a> | <a href="#" type="edit">修改</a> | <a href="javascript:;" type="delete">删除</a>'
                    "defaultContent": optStr
                },
                {
                    "targets": 7,
                    "render": function (data, type, row) {
                        if (data && data == "0") {
                            return "否";
                        } else if (data && data == "1") {
                            return "是";
                        } else {
                            return "-";
                        }
                    }
                }
            ],
            "initComplete": function () {
                bindLink();
            }
        };
        $timeout(function () {
            $('#button-group .vk-nowrap').append('<div class="operation-buttons"><a href="#/employee-create" class="btn btn-primary">新增</a></div>');
            dataTableService.initDataTable("employee-table", config);
            if (isOnlySeeEmployees) {
                $(".operation-buttons").remove();
                $('#exportTemplateBtn').remove();
            }
        }, 100);

    });

    function refreshTable() {
        window.dataTable.draw('page');
    }

    function bindLink() {
        var employeeTable = $('#employee-table tbody');
        employeeTable.on('click', 'a[type=view]', function (index, value) {
            var hash = "#/employee",
                search = "?id=" + window.dataTable.row($(this).parents('tr')).data()[0];
            if (isOnlySeeEmployees) {
                search += "&isOnlySeeEmployees=1";
            }
            $(this).attr('href', hash + search);
        });

        !isOnlySeeEmployees && employeeTable.on('click', 'a[type=edit]', function (index, value) {
            var hash = "#/employee-edit",
                search = "?id=" + window.dataTable.row($(this).parents('tr')).data()[0];
            $(this).attr('href', hash + search);
        });

        employeeTable.on('click', 'a[type=delete]', function (index, value) {
            var id = window.dataTable.row($(this).parents('tr')).data()[0];
            var config = {
                "title": "删除提示",
                "icon": "fa-exclamation-circle",
                "content": "确认删除该人员？",
                "callback": function () {
                    employeeService.deleteEmployee(id).then(function () {
                        refreshTable();
                    });
                }
            };
            commonService.confirm(config);
        });
    }

    $scope.search = function () {
        var selectedDates = commonService.getSelectedDates();
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            //"beginDate": selectedDates.beginDate,
            //"endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "jobStatus": $scope.jobStatus,
            "isAdjustJobLevel": $scope.isAdjustJobLevel
        };
        dataTableService.dataTableSearch("employee-table", data);
        commonService.storageSearchStatus($scope);
    };

    $scope.export = function () {
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "keywords": $scope.keywords,
            //"attendanceStatus": $scope.selectedStatus || null,
            //"abnormalAttendanceType": $scope.selectedType || null,
            "jobStatus": $scope.jobStatus,
            "isAdjustJobLevel": $scope.isAdjustJobLevel || ""
        };
        employeeService.exportEmployeeDetail(data);
    };

    function getSearchParams() {
        return {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "keywords": $scope.keywords,
            //"attendanceStatus": $scope.selectedStatus || null,
            //"abnormalAttendanceType": $scope.selectedType || null,
            "jobStatus": $scope.jobStatus,
            "isAdjustJobLevel": $scope.isAdjustJobLevel || ""
        }
    }

    function exportTemplate() {
        employeeService.exportTemplate(getSearchParams());
    }

}]);
'use strict';
VkrmsApp.directive('historyBack', function () {
    return {
        restrict: "AC",
        link: function (scope, ele, attr) {
            ele.bind("click", function () {
                history.back();
            })
        }
    };
});
VkrmsApp.directive('tips', function () {
    return {
        restrict: "AC",
        link: function (scope, ele, attr) {
            $(ele).tooltip({
                html: true
            });
        }
    };
});