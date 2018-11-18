'use strict';

VkrmsApp.controller('ShiftViewController', ['$scope', '$filter', '$routeParams', '$http', '$timeout', 'CommonService', function ($scope, $filter, $routeParams, $http, $timeout, commonService) {
    $scope.title = "万科资源管理信息系统 - 班次设置";
    $scope.shifts = [];
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false
    };
    $scope.shiftTypes = [{
        id: 0,
        value: '常规班次'
    }, {
        id: 1,
        value: '常规加班'
    }, {
        id: 2,
        value: '值班经理值班'
    }, {
        id: 5,
        value: '维修普通值班'
    }, {
        id: 3,
        value: '维修夜间值班'
    }, {
        id: 4,
        value: '其他夜班'
    }];

    $scope.$on('$viewContnetLoaded', function () {
        $timeout(function () {
            var defaultDepartmentId = _.pluck($scope.selectedDepartments, 'department_id');
            if (defaultDepartmentId.length > 0) {
                initShiftGroup(getSearchParams())
            } else {
                $scope.shiftsSearchResult = true;
                $scope.shiftsDefaultState = true;
            }
        }, 50)
    })

    function getSearchParams() {
        return {
            "length": $scope.page || 10,
            "start": ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                departments: _.pluck($scope.selectedDepartments, 'department_id')
            }
        }
    }

    function initShiftGroup(params) {
        $http.get(apiBaseUrl + "/view-shift-config", {
            params: params
        })
            .success(function (result) {
                for (var i = 0; i < result.data.length; i++) {
                    result.data[i].onDutyTime = getDate(result.data[i].onDutyTime);
                    result.data[i].offDutyTime = getDate(result.data[i].offDutyTime);
                    result.data[i].diningStartDatetime = getDate(result.data[i].diningStartDatetime);
                    result.data[i].diningEndDatetime = getDate(result.data[i].diningEndDatetime);
                }
                $scope.shifts = result.data;
                $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
                $scope.shiftsDefaultState = true;
                $scope.shiftsSearchResult = result.data.length == 0;
            });
    }

    $scope.computeShiftTime = function (shift) {
        if (!shift.diningDuration) {
            shift.diningDuration = 0;
        }
        var onDutyHours = shift.onDutyTime.getHours(),
            onDutyMinutes = shift.onDutyTime.getMinutes(),
            offDutyHours = shift.offDutyTime.getHours(),
            offDutyMinutes = shift.offDutyTime.getMinutes(),
            onDutyTime = onDutyHours + onDutyMinutes / 60,
            offDutyTime = offDutyHours + offDutyMinutes / 60,
            shiftTime = offDutyTime - onDutyTime - shift.diningDuration;

        if (offDutyTime < onDutyTime) {
            shiftTime = shiftTime + 24;
        }

        return (new Number(shiftTime)).toFixed(2);
    };

    function getDate(time) {
        if (!time) {
            return;
        }
        var d = new Date(),
            month = parseInt(d.getMonth()),
            dd = parseInt(d.getDate()),
            yyyy = parseInt(d.getFullYear()),
            hms = time.split(":"),
            hh = hms[0],
            mm = hms[1],
            ss = hms[2];

        return new Date(yyyy, month, dd, hh, mm, ss, 0);
    }

    $scope.search = searchShift;

    function searchShift() {
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id')
        };

        if (data.departments.length == 0) {
            commonService.alert({
                'content': '请选择查询组织范围',
                'icon': 'fa-exclamation-circle'
            });
            return false;
        }
        initShiftGroup(getSearchParams());
        commonService.storageSearchStatus($scope);
    }


}]);