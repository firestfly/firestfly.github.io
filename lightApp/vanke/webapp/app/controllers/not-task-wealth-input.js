'use strict';

VkrmsApp.controller('NotTaskWealthInputController', ['$scope', '$filter', 'CommonService', 'NotTaskWealthService', '$timeout', function ($scope, $filter, commonService, notTaskWealthService, $timeout) {
    $scope.title = "万科资源管理信息系统 - 非任务财富值录入";
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false,
        isEmployeeSapSelectpickerMultipe: false
    };
    $scope.changeDuration = changeDuration;
    $scope.saveInfo = saveInfo;
    $scope.reset = reset;
    init();
    $("#select-employee").selectpicker();
    function init() {
        getTaskWealthType();
    }

    function watchWealthType() {
        if (!$scope.selectedDepartments || !$scope.selectedDepartments.length || !$scope.selectedTaskWealthType) {
            return;
        }
        var params = {
            departmentId: $scope.selectedDepartments[0].department_id,
            notTaskWealthType: $scope.selectedTaskWealthType
        };
        notTaskWealthService.getStandardWealthValue(params).then(function (result) {
            if (result.status == 'fail') {
                console.log('aaaa')
                $scope.employeeSap = null;
                $scope.selectedEmployeeSap = null;
                $scope.departmentRule = false;
            } else {
                $scope.standardWealthValue = result && result.standardWealthValue;
                getEmployeeSap();
                changeDuration();
                $scope.departmentRule = true;
            }

        });
    }

    function getTaskWealthType() {
        commonService.getTaskWealthType().then(function (data) {
            $scope.taskWealthType = data;
            $scope.selectedTaskWealthType = "NOT_TASK_WEALTH_TYPE_HOLIDAY";
            $timeout(function () {
                $("#not-task-wealth-type").selectpicker();
                // $("#not-task-wealth-type").on("changed.bs.select", watchWealthType);
                // $scope.$watch("selectedDepartments", watchWealthType);
            }, 200);
        });
    }

    // $("#not-task-wealth-type").on("changed.bs.select", watchWealthType);
    $scope.$watch("selectedTaskWealthType", watchWealthType);
    $scope.$watch("selectedDepartments", watchWealthType);
    $scope.$watch("selectedStandardWorkJobs", watchWealthType);
    $scope.$watch("selectedGroups", watchWealthType);

    function getEmployeeSap() {
        var params = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId')
        };
        if (!params.departments || !params.departments.length) {
            return;
        }
        params = {
            "search[value]": JSON.stringify(params)
        };
        commonService.getEmployeeSap(params).then(function (result) {
            $scope.employeeSap = result;
            $scope.selectedEmployeeSap = $scope.employeeSap[0];
            $timeout(function () {
                $("#select-employee").selectpicker("refresh");
            }, 20);
        })
    }

    function saveInfo(form) {
        if (!$scope.departmentRule) {
            commonService.alert({
                content: "请先设置好该项目下的非任务财富值规则，再录入财富值。",
                icon: "fa-exclamation-circle"
            });
            return;
        }
        var beginDate, endDate;
        // // 判断是否选择了人员
        if (!$scope.selectedEmployeeSap) {
            commonService.alert({
                content: "请选择人员后再提交",
                icon: "fa-exclamation-circle"
            });
            return;
        }
        // 判断该部门有没有设置好规则
        if ($scope.duration && !/^\d/.test(+$scope.wealthValueSum)) {
            commonService.alert({
                content: "请先设置好该项目下的非任务财富值规则",
                icon: "fa-exclamation-circle"
            });
            return;
        }
        $scope.showValidationMessages = true;

        // 判断表单必填项是否完整
        if (!form.$valid) {
            return;
        }
        beginDate = new Date(utils.transferDateTo($scope.beginDate));
        endDate = new Date(utils.transferDateTo($scope.endDate));

        if (beginDate > endDate) {
            commonService.alert({
                content: "开始时间不能大于结束时间",
                icon: "fa-exclamation-circle"
            });
            return;
        }
        // 时长必须为（结束时间 - 开始时间）* 24 * 60
        if ($scope.duration > (endDate - beginDate) / 1000 / 60 + 24 * 60) {
            commonService.alert({
                content: "输入时长过长",
                icon: "fa-exclamation-circle"
            });
            return;
        }

        var param = {
            employeeId: $scope.selectedEmployeeSap.employeeId,
            notTaskWealthType: $scope.selectedTaskWealthType,
            duration: $scope.duration,
            isConvert: 0,
            beginDate: $filter("date")(beginDate, "yyyy-MM-dd"),
            endDate: $filter("date")(endDate, "yyyy-MM-dd")
        };
        var content = "确定为" + $scope.selectedEmployeeSap.name + "添加" + $scope.wealthValueSum + "财富值?";
        var config = {
            "title": "提示",
            "icon": "fa-exclamation-circle",
            "content": content,
            "callback": function () {
                notTaskWealthService.saveNotTaskWealthInput(param).then(function (result) {
                    if (result && result.status === "success") {
                        commonService.alert({
                            content: "录入成功！",
                            icon: "fa-exclamation-circle"
                        });
                        reset();
                        commonService.storageSearchStatus($scope);
                        reset();
                        $scope.showValidationMessages = false;
                    } else {
                        commonService.alert({
                            content: result.errorMessage || "录入失败",
                            icon: "fa-exclamation-circle"
                        });
                    }
                });
            }
        };
        commonService.confirm(config);
    }

    function reset() {
        $scope.beginDate = null;
        $scope.endDate = null;
        $scope.duration = null;
        $scope.wealthValueSum = null;
    }

    function changeDuration() {
        if (/^\d/.test(+$scope.duration)) {
            $scope.wealthValueSum = $scope.standardWealthValue ? ($scope.duration * $scope.standardWealthValue).toFixed(2) : 0;
        }
    }
}]);