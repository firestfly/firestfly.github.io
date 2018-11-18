'use strict';

VkrmsApp.controller('OvertimeAttendanceCheckController', ['$scope', '$http', 'CommonService', 'OvertimeAttendanceCheckService', '$filter', function ($scope, $http, commonService, overtimeAttendanceCheckService, $filter) {
    $scope.title = "万科资源管理信息系统 - 考勤汇总";
    $scope.pageSize = 10;
    $scope.total = 0;
    $scope.currentPage = 1;
    $scope.pageSizes = [10, 50, 100];
    $scope.commonSearchBarConfig = {
        companySelecterLabel: "公司范围",
        departmentSelecterLabel: "部门/项目",
        workgroupSelecterLabel: "岗位专业分类"
    };
    var isNewOvertimeAttendance = location.hash.indexOf("new-") >= 0;
    $scope.recalculate = recalculate;

    function recalculate(id) {
        // var beginDate = $('#localCycleDatepicker input[name=start]').datepicker('getDate'),
        //     endDate = $('#localCycleDatepicker input[name=end]').datepicker('getDate');
        // beginDate = $filter('date')(new Date(beginDate), "yyyy-MM-dd");
        // endDate = $filter('date')(new Date(endDate), "yyyy-MM-dd");
        var params = {
            beginDate: "2017-05-21",
            endDate: "2017-06-20",
            employeeId: id
        };
        overtimeAttendanceCheckService.recalculate(params).then(function (result) {
            if (result.status != "success") {
                commonService.alert({
                    content: result.errorMessage || "重预定案失败！",
                    icon: "fa-exclamation-circle"
                });
            } else {
                commonService.alert({
                    content: "重预定案成功！",
                    icon: "fa-exclamation-circle"
                });
            }
        })
    }
    $scope.search = function () {
        search(1);
    };
    $scope.offDayCountStyle = {
        cursor: 'pointer',
        color: 'red'
    };
    $scope.changePage = search;
    $scope.reload = reload;
    $scope.nextPage = nextPage;
    $scope.pageCount = pageCount;
    $scope.changePageSize = changePageSize;
    $scope.export = exportScheet;
    $scope.openRestDetail = openRestDetail;
    $scope.jobStatusArr = {
        "01": "在职",
        "02": "离职"
    };
    $scope.staffTypeArr = {
        '01': '全日制',
        '02': '实习',
        '03': '业务外包员工',
        '05': '乐邦',
        '10': '其他',
        '12': '非全日制',
        '21': '劳务派遣员工',
        '31': '退休返聘',
        '32': '顾问（非返聘）',
        '41': '合资方派遣人员',
        '51': '家属',
        '52': '董监事',
        '53': '残障人员'
    };
    $scope.$on("selectpicker-loaded", function () {
        search();
    });
    function exportScheet() {
        var selectedDates = commonService.getSelectedDates();
        var params = {
            "start": ($scope.currentPage - 1) * $scope.pageSize,
            "length": $scope.pageSize,
            "departments": _.pluck($scope.selectedDepartments, "department_id"),
            "workingGroups": _.pluck($scope.selectedGroups, "work_group_id"),
            "beginDate": utils.formatDate($("#localCycleDatepicker input[name=start]").datepicker("getDate")),
            "endDate": utils.formatDate($("#localCycleDatepicker input[name=end]").datepicker("getDate")),
            "keywords": $scope.keywords,
            "jobStatus": $scope.jobStatus,
            "staffType": $scope.staffType ? $scope.staffType : null,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, "workJobId"),
            "lockCycleId": $scope.selectedLockCycle.lockCycleId
        };
        // commonService.createModal({
        //     'templateUrl': 'exportOvertimeAttendance.html',
        //     'controller': 'ExportOvertimeAttendanceCheckController',
        //     'resolve': {
        //         'params': function () {
        //             return params;
        //         }
        //     }
        // });
        overtimeAttendanceCheckService.exportOverTimeAttendanceCheck(params);
    }

    function loadTableData(params) {
        overtimeAttendanceCheckService.searchOvertimeAttendanceCheck(params, isNewOvertimeAttendance).then(function (overtimeAttendanceCheckPagingDTO) {
            console.log($scope.overtimeAttendanceCheckPagingDTO);
            $scope.overtimeAttendanceCheckPagingDTO = overtimeAttendanceCheckPagingDTO.data;
            $scope.total = overtimeAttendanceCheckPagingDTO.data.recordsTotal;
            $scope.pages = _.range(1, $scope.pageCount() + 1);
        });
    }

    function openRestDetail(item) {
        if (item.offDayCount == '0' || !isSearchInfoValid()) return;
        var restTypeLists = null;
        var beginDate = $filter("date")(new Date(utils.formatDate($("#localCycleDatepicker input[name=start]").datepicker("getDate"))), "yyyy-MM-dd"),
            endDate = $filter("date")(new Date(utils.formatDate($("#localCycleDatepicker input[name=end]").datepicker("getDate"))), "yyyy-MM-dd");
        var modelBar = {
            beginDate: beginDate,
            endDate: endDate,
            name: item.employeeName,
            resourceId: item.resourceId,
            sapId: item.sapId
        };
        $http.get(apiBaseUrl + "/new-attendance-checks-holiday/employee-id/" + item.resourceId + "/on-duty-day/" + beginDate + "/off-duty-day/" + endDate)
            .success(function (result) {
                restTypeLists = result;
                var restTypeModel = commonService.createModal({
                    'templateUrl': 'restTypeDialog.html',
                    'controller': 'RestTypesModalController',
                    'resolve': {
                        'message': function () {
                            return '休假汇总信息';
                        },
                        'restTypeLists': function () {
                            return restTypeLists;
                        },
                        'modelBar': function () {
                            return modelBar;
                        }
                    }
                })
            });
    }

    function search(isSearchBtn) {
        if (!isSearchInfoValid()) {
            return;
        }
        var beginDate = $('#localCycleDatepicker input[name=start]').datepicker('getDate'),
            endDate = $('#localCycleDatepicker input[name=end]').datepicker('getDate');
        beginDate = $filter('date')(new Date(beginDate), "yyyy-MM-dd");
        endDate = $filter('date')(new Date(endDate), "yyyy-MM-dd");
        $scope.canRecalculate = beginDate >= "2017-05-21" && endDate <= "2017-06-21";
        var params = {
            "start": ($scope.currentPage - 1) * $scope.pageSize,
            "length": $scope.pageSize,
            "departments": _.pluck($scope.selectedDepartments, "department_id"),
            "workingGroups": _.pluck($scope.selectedGroups, "work_group_id"),
            "beginDate": utils.formatDate($("#localCycleDatepicker input[name=start]").datepicker("getDate")),
            "endDate": utils.formatDate($("#localCycleDatepicker input[name=end]").datepicker("getDate")),
            "keywords": $scope.keywords,
            "jobStatus": $scope.jobStatus,
            "staffType": $scope.staffType ? $scope.staffType : null,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, "workJobId"),
            "lockCycleId": $scope.selectedLockCycle.lockCycleId
        };
        if (isSearchBtn) {
            $scope.currentPage = 1;
            params.start = 0;
        }
        loadTableData(params);
        commonService.storageSearchStatus($scope);
    }

    function nextPage() {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
        search();
    }

    function reload() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        search();
    }

    function pageCount() {
        return Math.ceil($scope.total / $scope.pageSize);
    }

    function changePageSize() {
        $scope.currentPage = 1;
        search();
    }

    function isSearchInfoValid() {
        if (!$scope.selectedDepartments || $scope.selectedDepartments.length < 1) {
            commonService.alert({
                content: "请选择查询部门",
                icon: "fa-exclamation-circle"
            });
            return false;
        }
        if (!$('#localCycleDatepicker input[name=start]').datepicker('getDate') || !$('#localCycleDatepicker input[name=end]').datepicker('getDate')) {
            commonService.alert({
                content: "请选择开始时间和结束时间",
                icon: "fa-exclamation-circle"
            });
            return false;
        }
        return true;
    }
}]);
VkrmsApp.controller('RestTypesModalController', ['$scope', '$modalInstance', 'CommonService', 'message', 'restTypeLists', 'modelBar', function ($scope, $modalInstance, commonService, message, restTypeLists, modelBar) {
    $scope.message = message;
    $scope.restTypeLists = restTypeLists;
    $scope.modelBar = modelBar;
    setTimeout(function () {
        $('.modal-dialog').width(800);
    }, 0);

    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

VkrmsApp.controller('ExportOvertimeAttendanceCheckController', ['$scope', '$modalInstance', 'OvertimeAttendanceCheckService', 'params', function ($scope, $modalInstance, overtimeAttendanceCheckService, params) {

    $scope.exportOvertimeAttendanceDetail = function () {
        overtimeAttendanceCheckService.exportOvertimeAttendanceDetail(params);
        $modalInstance.close();
    };

    $scope.exportOvertimeAttendanceSummary = function () {
        overtimeAttendanceCheckService.exportOvertimeAttendanceSummary(params);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
