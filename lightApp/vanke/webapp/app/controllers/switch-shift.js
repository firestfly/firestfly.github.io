'use strict';

VkrmsApp.controller('SwitchShiftController', ['$scope', '$filter', '$routeParams', '$http', '$timeout', 'CommonService', function ($scope, $filter, $routeParams, $http, $timeout, commonService) {
    $scope.title = "万科资源管理信息系统 - 倒班管理";
    $scope.shifts = [];
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false
    };
    var defaultDepartmentId;
    $scope.saveSwitchShift = saveSwitchShift;
    $scope.cancelSwitchShift = cancelSwitchShift;

    function getSearchParams() {
        return {
            length: $scope.page,
            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                departments: _.pluck($scope.selectedDepartments, 'department_id')
            }
        }
    }

    $scope.$on("selectpicker-loaded", function () {
        setTimeout(function () {
            search();
        }, 100);
    });
    function initShiftGroup(data) {
        $http.get(apiBaseUrl + "/page-view-switch-shift", {
            params: data
        }).success(function (response) {
            $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
            $scope.shiftLists = [];
            for (var i = 0; i < response.length; i++) {
                response.data[i].onDutyTime = getDate(response.data[i].onDutyTime);
                response.data[i].offDutyTime = getDate(response.data[i].offDutyTime);
                response.data[i].switchShiftName = '-';
                $scope.shiftLists.push(response.data[i].name);
                response[i].switcSelect = response[i].switchShiftId;
            }
            $scope.shifts = response.data;
            $scope.shiftsDefaultState = true;
            if (response.data.length == 0) {
                $scope.shiftsSearchResult = true;
            } else {
                $scope.shiftsSearchResult = false;
            }
        });
    }

    function cancelSwitchShift(shift) {
        shift.showSwitchShift = !shift.showSwitchShift;
    }

    function saveSwitchShift(shift, item) {
        var data = {
            departmentId: defaultDepartmentId.join(''),
            shiftId: shift.shiftId,
            switchShiftId: item
        }
        console.log(defaultDepartmentId)
        if (!data.departmentId) {
            commonService.alert({'content': '保存失败，请选择组织范围后再做修改保存！', 'icon': 'fa-exclamation-circle'});
            return false;
        }
        $http.post(apiBaseUrl + "/switch-shift-config/", data)
            .then(function (result) {
                shift.showSwitchShift = !shift.showSwitchShift;
                initShiftGroup(getSearchParams());
            }, function (data) {

            })
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

    $scope.search = search;
    function search() {
        defaultDepartmentId = _.pluck($scope.selectedDepartments, 'department_id')
        if (defaultDepartmentId == 0) {
            commonService.alert({'content': '请选择查询组织范围', 'icon': 'fa-exclamation-circle'});
            return false;
        }
        commonService.storageSearchStatus($scope);
        initShiftGroup(getSearchParams());
    }

}]);