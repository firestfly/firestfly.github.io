'use strict';

VkrmsApp.controller('NewAttendanceCheckController', ['$scope', '$http', 'DataTableService', 'CommonService', 'UserService', 'AttendanceTaskService', 'SignInAreaTaskservice', function ($scope, $http, dataTableFactory, commonService, userService, attendanceTaskService, signInAreaTaskservice) {
    $scope.title = "万科资源管理信息系统 - 考勤结果";
    $scope.selectedStatus = "0";
    $scope.selectedType = "0";

    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        companySelecterLabel: "公司范围",
        departmentSelecterLabel: "部门/项目",
        workgroupSelecterLabel: "岗位专业分类"
    };

    var tableName = "attendance-check-table-new";

    $scope.$on('selectpicker-loaded', function () {
        var settings = {
            "ajax": {
                "url": "attendance-results-new",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "columns": [
                {data: "scheduleId"},
                {data: "missAttendance"},
                {data: "employeeName"},
                {data: "onDutyDate"},
                {data: "postName"},
                {data: "shiftName"},
                {data: "beginTime"},
                {data: "endTime"},
                {data: "actualOnDutyTime"},
                {data: "actualOffDutyTime"},
                {data: "workDayOvertimeDuration"},
                {data: "offDayOvertimeDuration"},
                {data: "holidayOvertimeDuration"},
                {data: "managerDutyCount"},
                {data: "repairGeneralCount"},
                {data: "repairNightCount"},
                {data: "otherNightCount"},
                {data: "lateDuration"},
                {data: "earlyDuration"},
                {data: "halfDayAbsentDuration"},
                {data: "absenteeismDuration"},
                {data: "workDuration"},
                {data: "resourceId"},
                {data: "sapId"},
                {data: "company"},
                {data: "department"},
                {data: "workingGroups"},
                {data: "jobStatus"}
            ],
            "columnDefs": [
                {
                    "targets": [0, 1],
                    "visible": false
                },
                {
                    "targets": [10],
                    "render": function (data, type, row) {
                        if (row["shiftName"] == "月休") {
                            return "-";
                        } else {
                            return data;
                        }
                    }
                },
                {
                    "targets": [6, 7],
                    "render": function (data, type, row) {
                        if (row["shiftName"] == "月休") {
                            return "-";
                        } else if (data) {
                            data = new Date(data);
                            var H = data.getHours();
                            var M = data.getMinutes();
                            H = H >= 10 ? H : "0" + H;
                            M = M >= 10 ? M : "0" + M;
                            var resultTimeStr = H + ":" + M;
                            var onDutyDate = new Date(row["onDutyDate"]).getDate(),
                                attentEndDate = data.getDate();
                            if (onDutyDate !== attentEndDate) {
                                return "次日" + resultTimeStr;
                            }
                            return resultTimeStr;
                        }
                    }
                },
                {
                    "targets": [-1],
                    "render": function (data) {
                        return ["-", "在职", "离职", "在入职"][+data]
                    }
                }
            ],
            scrollX: true
        };
        dataTableFactory.initDataTable(tableName, settings, getSearchParams());
    });
    function getSearchParams() {
        var selectedDates = commonService.getSelectedDates();
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "attendanceStatus": $scope.selectedStatus,
            "abnormalAttendanceType": $scope.selectedType,
            "jobStatus": $scope.jobStatus,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
            "attendanceResult": $scope.selectedAttendanceResult || []
        };
        return data;
    }
    $scope.search = function () {
        dataTableFactory.dataTableSearch(tableName, getSearchParams());
        commonService.storageSearchStatus($scope);
    };

    $scope.export = exportAttendanceCheck;

    function exportAttendanceCheck() {
        var selectedDates = commonService.getSelectedDates();
        if (null == selectedDates.beginDate || null == selectedDates.endDate || undefined == selectedDates.beginDate || undefined == selectedDates.endDate) {
            commonService.alert({
                content: '请选择开始时间和结束时间',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "attendanceStatus": $scope.selectedStatus,
            "abnormalAttendanceType": $scope.selectedType,
            "jobStatus": $scope.jobStatus,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
            "attendanceResult": $scope.selectedAttendanceResult || []
        };
        attendanceTaskService.exportAttendanceCheck(data);
    }

}]);

