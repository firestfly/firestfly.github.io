'use strict';

VkrmsApp.controller('AttendanceFillController', ['$scope', 'CommonService', '$filter', 'AttendanceFillService', '$routeParams', '$timeout', function ($scope, commonService, $filter, attendanceFillService, $routeParams, $timeout) {
    $scope.title = "万科资源管理信息系统 - 出勤表";
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false,
        isEmployeeSapSelectpickerMultipe: false
    };
    var isNewAttendanceFill = location.hash.indexOf("new-") >= 0;
    $scope.newAttendanceFillBack = isNewAttendanceFill ? "new-" : "";
    $scope.selectedEmployeeSap = [];
    $scope.showValidationMessages = false;
    commonService.initTimepicker("#attendanceTime");

    $('#attendanceTime').on('changeTime.timepicker', function (e) {
        $scope.attendanceTime = e.time.value;
    });

    $scope.$on('companies-loaded', function () {
        $timeout(function () {
            if ($routeParams.departments) {
                $scope.selectedCompanies = $routeParams.companies;
                $scope.selectedDepartments = $routeParams.departments;
                $scope.departments = $routeParams.departments;
            }
            $('#select-company').selectpicker('refresh');
            $("#select-department").selectpicker('refresh');
        }, 0, false);
    });

    $scope.$watch("selectedDepartments", function () {
        console.log($scope.selectedDepartments)
    }, true);


    $scope.attendanceTime = $filter('date')(new Date(), 'HH:mm');
    $scope.data = {};
    $scope.saveInfo = function (form) {
        var employeeId = $scope.selectedEmployeeSap.length && $scope.selectedEmployeeSap[0].employeeId;
        if (!employeeId) {
            commonService.alert({
                content: "请选择人员后再提交",
                icon: "fa-exclamation-circle"
            });
            return;
        }
        $scope.showValidationMessages = true;
        if (!form.$valid) {
            return;
        }
        commonService.storageSearchStatus($scope, {
            selectedCompanies: $scope.selectedCompanies,
            selectedDepartments: $scope.selectedDepartments,
            departments: $scope.departments,
            employeeSap: $scope.employeeSap
        });
        $scope.data.employeeId = employeeId;
        var attendanceFillDate = $filter('date')($('#attendanceDate').datepicker('getDate'), 'yyyy-MM-dd')
        $scope.data.attendanceFillTime = attendanceFillDate + ' ' + $scope.attendanceTime + ":00";
        var tips = "为" + $scope.selectedEmployeeSap[0].name + "（SAP编号：" +  $scope.selectedEmployeeSap[0].sapId + ",资源编号：" +
            employeeId + "）补签" + $filter('date')($('#attendanceDate').datepicker('getDate'), 'yyyy年MM月dd日') + ' ' + $scope.attendanceTime + "在" + $scope.data.attendanceArea + "的打卡?";
        var config = {
            "title": "请确认以下操作",
            "icon": "fa-exclamation-circle",
            "content": tips,
            "callback": function () {
                attendanceFillService.saveAttendanceFillInfo($scope.data, isNewAttendanceFill).then(function (result) {
                    if (result.status == "success") {
                        commonService.alert({
                            content: "保存成功",
                            icon: "fa-exclamation-circle"
                        });
                    } else {
                        commonService.alert({
                            content: result.errorMessage,
                            icon: "fa-exclamation-circle"
                        });
                    }
                })
            }
        };
        var departmentId = _.pluck($scope.selectedDepartments, 'department_id');
        attendanceFillService.getOnlineRmTime(departmentId[0]).then(function (result) {
            if (result && result > attendanceFillDate) {
                commonService.alert({
                    content: "该项目" + utils.transferDateToCN(result, "-") + "上线RM，之前日期无法操作签到管理，请重新选择签到时间",
                    icon: "fa-exclamation-circle"
                });
            } else {
                commonService.confirm(config);
            }
        });
    };
}]);