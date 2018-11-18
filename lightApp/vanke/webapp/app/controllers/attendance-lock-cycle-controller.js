'use strict';

VkrmsApp.controller('AttendanceLockCycleController', ['$scope', '$modal', '$timeout', '$q', 'AttendanceLockCycleService', '$filter', function ($scope, $modal, $timeout, $q, attendanceLockService, $filter) {
    $scope.$parent.title = "万科资源管理信息系统 - 定案周期设置";

    var vm = {};
    var search = function () {
        var params = {
            start: ($scope.currentPage - 1) * $scope.pageSize,
            length: $scope.pageSize
        };
        attendanceLockService.searchPage(params)
            .then(function (result) {
                vm.attendanceLocks = result.data.attendanceLockList;
                _.each(vm.attendanceLocks, function (attendanceLockCycle) {
                    attendanceLockCycle.startDatePicker = {opened: false};
                    attendanceLockCycle.endDatePicker = {opened: false};
                    attendanceLockCycle.startDate = new Date(attendanceLockCycle.startDate);
                    attendanceLockCycle.endDate = new Date(attendanceLockCycle.endDate);
                });
                $scope.total = result.data.recordsTotal;
                $scope.pages = _.range(1, $scope.pageCount() + 1);
            });
    };
    var fnLoadAll = search;
    $scope.pageSize = 10;
    $scope.currentPage = 1;
    $scope.pageSizes = [10, 50, 100];

    var init = function () {
        $scope.total = 0;
        $scope.pages = 0;
    };
    init();
    $scope.changePageSize = function () {
        $scope.currentPage = 1;
        search();
    };
    $scope.pageCount = function () {
        var pageCount = Math.ceil($scope.total / $scope.pageSize);
        return pageCount;
    };
    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
        search();
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
        }
        search();
    };

    $scope.reload = function () {
        search();
    };

    var generateId = function () {
        var newId = Math.floor((Math.random() * 100) + 1);
        while (true) {
            var isNewIdExisting = _.some(vm.attendanceLocks, function (attendanceLockCycle) {
                return attendanceLockCycle.attendance_lock_id === newId;
            });
            if (isNewIdExisting) {
                newId = Math.floor((Math.random() * 100) + 1);
            } else {
                return newId;
            }
        }
    };

    var openDialog = function (data) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'attendance-lock-dialog.html',
            controller: 'AttendanceLockDialogController',
            size: 'sm',
            resolve: {
                data: function () {
                    return data;
                }
            }
        });

        return modalInstance;
    }

    fnLoadAll();

    $scope.vm = vm;

    $scope.deleteItem = function (index, attendance_lock_id) {
        var modalInstance = openDialog({
            messages: ['确认要删除吗？']
        });

        modalInstance.result.then(function () {
            attendanceLockService.deleteById(attendance_lock_id).then(function (attendanceLockCycle) {
                var status = attendanceLockCycle.data.status
                if (null != status && status != undefined && (status == "AttendanceIsLockException" || status == "AttendanceLockCycleInException")) {
                    openDialog({
                        messages: [attendanceLockCycle.data.errorMessage],
                        noCancelButton: true
                    });
                } else {
                    vm.attendanceLocks.splice(index, 1);
                }
            });
        })
    };

    $scope.deleteInserted = function (attendanceLockCycle) {
        if (!attendanceLockCycle.isNew) return;
        vm.attendanceLocks = _.filter(vm.attendanceLocks, function (d) {
            return d.attendance_lock_id !== attendanceLockCycle.attendance_lock_id;
        });
    };

    $scope.addItem = function () {
        vm.inserted = {
            isNew: true,
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            startDatePicker: {opened: false},
            endDatePicker: {opened: false}
        };

        vm.inserted.attendance_lock_id = generateId();
        vm.attendanceLocks.push(vm.inserted);
    };

    $scope.saveItem = function (data, attendanceLockCycle) {
        var errors = [];
        var d = $q.defer();
        if (!data.name) {
            errors.push('定案周期名不能为空。');
        }

        if (!data.startDate) {
            errors.push('定案周期起始日期不能为空。');
        }
        if (!data.endDate) {
            errors.push('定案周期结束日期不能为空。');
        }
        if (data.endDate < data.startDate) {
            errors.push('定案周期结束日期不能小于起始日期。');
        }
        if (errors.length > 0) {
            var dialog = openDialog({
                messages: errors,
                noCancelButton: true
            });
            dialog.result.then(function () {
                d.reject();
            });
            return d.promise;
        }

        var params = angular.extend({}, attendanceLockCycle, data);
        params.startDate = $filter("date")(data.startDate, "yyyy-MM-dd");
        params.endDate = $filter("date")(data.endDate, "yyyy-MM-dd");
        if (attendanceLockCycle.isNew) {
            attendanceLockService.create(params).then(function (result) {
                var status = result.data.status
                if (result.data.errorCode == "10002") {
                    openDialog({
                        messages: ['定案周期周末天数小于值班天数，请检查设置'],
                        noCancelButton: true
                    });
                } else if (null != status && status != undefined && (status == "AttendanceIsLockException" || status == "AttendanceLockCycleInException")) {
                    openDialog({
                        messages: [result.data.errorMessage],
                        noCancelButton: true
                    });
                } else {
                    params.attendance_lock_id = result.data;
                    params.isNew = false;
                    openDialog({
                        messages: ['新建成功!'],
                        noCancelButton: true
                    });
                }
                fnLoadAll();
                d.resolve();
            }, function () {
                openDialog({
                    messages: ['新建失败!'],
                    noCancelButton: true
                });
                d.reject();
            });
            return d.promise;
        }

        attendanceLockService.modify(params).then(function (result) {
            var status = result.data.status
            if (result.data.errorCode == "10002") {
                openDialog({
                    messages: ['定案周期周末天数小于值班天数，请检查设置'],
                    noCancelButton: true
                });
                fnLoadAll();
            } else if (null != status && status != undefined && (status == "AttendanceIsLockException" || status == "AttendanceLockCycleInException")) {
                openDialog({
                    messages: [result.data.errorMessage],
                    noCancelButton: true
                });
                fnLoadAll();
            } else {
                openDialog({
                    messages: ['保存成功!'],
                    noCancelButton: true
                });
            }
            d.resolve();
        })
        return d.promise
    };


    $scope.openDatePicker = function (data) {
        $timeout(function () {
            data.opened = true;
        });
    };
}]).controller('AttendanceLockDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    $scope.data = data;
    $scope.data.type = $scope.data.type || 'warning';
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);
