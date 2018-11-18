/**
 * Created by ushio on 2017/5/15.
 */
'use strict';

VkrmsApp.controller('AttendanceLockDetailController', ['$scope', '$http', '$filter', 'CommonService', function ($scope, $http, $filter, commonService) {
    var selectedProject = [];
    $scope.tab = 1;
    $scope.keyOvertimeData = [];
    $scope.attendanceCycle = {};
    $scope.overtimeDetail = {};
    $scope.holidayDetail = {};
    $scope.switchTab = switchTab;
    $scope.lock = lock;
    $scope.createModal = createModal;
    $scope.exportFile = exportFile;
    $scope.selectedPage = 1;
    $scope.pageSize = 10;
    $scope.pageSizes = [10, 50, 100];

    init();

    function init() {
        $scope.total = 0;
        $scope.pages = 0;
        $scope.attendanceDetails = JSON.parse(sessionStorage["searchState_attendance-lock-detail"]);
        getKeyOvertimeData();
        selectedProject.push({
            attendanceLockId: $scope.attendanceDetails.attendanceLockId,
            departmentId: $scope.attendanceDetails.departmentId,
            status: $scope.attendanceDetails.status
        });
    }
    // 分页
    $scope.currentPage = function (page) {
        return page ? page : $scope.selectedPage
    }
    $scope.changePageSize = function () {
        $scope.selectedPage = 1;
        $scope.pageSize = $scope.pageSizes[angular.element('[name="pageSize"]').val()];
        switchRequest();
    };
    $scope.pageCount = function () {
        var pageCount = Math.ceil($scope.total / $scope.pageSize) || 1;
        return pageCount;
    };
    $scope.prevPage = function () {
        if ($scope.currentPage() > 1) {
            $scope.selectedPage--;
            angular.element('[name="currentPage"]').val($scope.selectedPage - 1)
            switchRequest();
        }
    };
    $scope.nextPage = function () {
        if ($scope.currentPage() < $scope.pageCount()) {
            $scope.selectedPage++;
            angular.element('[name="currentPage"]').val($scope.selectedPage - 1)
            switchRequest();
        }
    };

    $scope.reload = function () {
        $scope.selectedPage = parseInt(angular.element('[name="currentPage"]').val()) + 1;
        console.log($scope.selectedPage)
        switchRequest();
    }

    function switchRequest() {
        if ($scope.tab == 2) {
            console.log($scope.selectedPage)
            getOvertimeDetail();
        }
        if ($scope.tab == 3) {
            console.log($scope.selectedPage)
            getHolidayDetail();
        }
    }

    function switchTab(tab) {
        $scope.tab = tab;
        if (tab == 1) {
            getKeyOvertimeData();
        }
        if ($scope.tab == 2) {
            getOvertimeDetail();
        }
        if ($scope.tab == 3) {
            getHolidayDetail();
        }
    }

    function createModal () {
        var label = '';
        if ($scope.tab == 1) {
            label = '考勤汇总'
        }
        if ($scope.tab == 2) {
            label = '加班明细和值班'
        }
        var params = getExportParams();
        commonService.createModal({
            'templateUrl': 'exportOvertimeAttendance.html',
            'controller': 'ExportOvertimeAttendanceDetailController',
            'resolve': {
                'params': function () {
                    return params;
                },
                'label': function () {
                    return label;
                }
            }
        });
    }

    function exportFile() {
        if ($scope.tab == 1) {
            downloadFile(baseUrl + '/file/attendanceCheckExport');
        }
        if ($scope.tab == 2) {
            downloadFile(baseUrl + '/file/lockCycleOvertimeDetail');
        }
        if ($scope.tab == 3) {
            downloadFile(baseUrl + '/file/lockCycleHolidayDetail');
        }
    }

    function downloadFile(url) {
        commonService.downloadFile(url, getExportParams());
    }

    function getKeyOvertimeData() {
        $http.get(apiBaseUrl + '/lock-cycle-overtime-data', getParams(), {
            headers: utils.generateHeaders()
        }).success(function (result) {
            var data = result.data ? result.data[0] : {};
            if (data) {
                $scope.keyOvertimeData = data.keyOvertimeData;
                if (data.attendanceCycle) {
                    $scope.attendanceCycle = {
                        first: $filter('date')(new Date(data.attendanceCycle[0].beginDate), 'M.d') + '-' + $filter('date')(new Date(data.attendanceCycle[0].endDate), 'M.d'),
                        second: $filter('date')(new Date(data.attendanceCycle[1].beginDate), 'M.d') + '-' + $filter('date')(new Date(data.attendanceCycle[1].endDate), 'M.d'),
                        third: $filter('date')(new Date(data.attendanceCycle[2].beginDate), 'M.d') + '-' + $filter('date')(new Date(data.attendanceCycle[2].endDate), 'M.d')
                    }
                }
            }
        });
    }

    function getOvertimeDetail() {
        $http.get(apiBaseUrl + '/lock-cycle-overtime-detail', getPaginateParams(), {
            headers: utils.generateHeaders()
        }).success(function (result) {
            $scope.overtimeDetails = result.data;
            $scope.total = result.recordsTotal;
            $scope.pages = _.range(1, $scope.pageCount() + 1);
        });
    }

    function getHolidayDetail() {
        $http.get(apiBaseUrl + '/lock-cycle-holiday-detail', getPaginateParams(), {
            headers: utils.generateHeaders()
        }).success(function (result) {
            $scope.holidayDetails = result.data;
            $scope.total = result.recordsTotal;
            $scope.pages = _.range(1, $scope.pageCount() + 1);
        });
    }

    function getExportParams() {
        return {
            "start": ($scope.currentPage()-1) * $scope.pageSize,
            "length": $scope.pageSize,
            "departments": $scope.attendanceDetails.departmentId,
            "beginDate": $filter('date')(new Date($scope.attendanceDetails.beginDate), 'MM/dd/yyyy'),
            "endDate": $filter('date')(new Date($scope.attendanceDetails.endDate), 'MM/dd/yyyy'),
            "keywords": '',
            "jobStatus": '',
            "lockCycleId": $scope.attendanceDetails.attendanceLockId
        }
    }
    function getPaginateParams () {
        return {
            params: {
                'search[value]': {
                    attendanceLockId: $scope.attendanceDetails.attendanceLockId,
                    departmentId: $scope.attendanceDetails.departmentId
                },
                start: ($scope.currentPage()-1) * $scope.pageSize,
                length: $scope.pageSize
            }
        }
    }
    function getParams() {
        return {
            params: {
                'search[value]': {
                    'attendanceLockId': $scope.attendanceDetails.attendanceLockId,
                    'departmentId': $scope.attendanceDetails.departmentId
                }
            }
        }
    }

    function lock() {
        var config = {
            "title": "提示",
            "icon": "fa-exclamation-circle",
            "content": "定案后会以此结果计算考勤工资，如需查看考勤结果请先点击“预定案”后导出预定案结果，是否确认定案？",
            "callback": function () {
                $http.post(apiBaseUrl + '/attendance-set-lock', selectedProject, {
                    headers: utils.generateHeaders()
                }).success(function (attendanceCheck) {
                    if (attendanceCheck.errorMessage) {
                        commonService.alert({
                            content: attendanceCheck.errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                        return;
                    }
                    var now = new Date();
                    var year = now.getFullYear();
                    var month = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
                    var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
                    $scope.attendanceDetails.lockDate = year + '-' + month + '-' + day;
                    $scope.attendanceDetails.status = '已定案'
                }).error(function (data, status, headers, config) {
                    commonService.alert({
                        content: '定案操作失败，请重试',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                });
            }
        };
        commonService.confirm(config);
    }
}]);

VkrmsApp.controller('ExportOvertimeAttendanceDetailController', ['$scope', '$modalInstance', '$filter', 'CommonService', 'params', 'label', function ($scope, $modalInstance, $filter, commonService, params, label) {
    $scope.label = label;
    $scope.beginDate = $filter('date')(new Date(params.beginDate), 'MM.dd');
    $scope.endDate = $filter('date')(new Date(params.endDate), 'MM.dd');

    $scope.exportFile = function () {
        if (label == '考勤汇总') {
            commonService.downloadFile('/file/attendanceCheckExport', params);
        }
        if (label == '加班明细和值班') {
            commonService.downloadFile('/file/lockCycleOvertimeDetail', params);
        }
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
