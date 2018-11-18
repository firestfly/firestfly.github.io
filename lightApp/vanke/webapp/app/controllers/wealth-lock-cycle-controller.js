'use strict';

VkrmsApp.controller('WealthLockCycleController', ['$scope', '$modal', '$timeout', '$q', 'WealthLockCycleService', function ($scope, $modal, $timeout, $q, wealthLockService) {
    $scope.$parent.title = "万科资源管理信息系统 - 财富值定案周期设置";

    var vm = {};
    var search = function () {
        var params = {
            start: ($scope.currentPage - 1) * $scope.pageSize,
            length: $scope.pageSize
        };
        wealthLockService.searchPage(params)
            .then(function (result) {
                vm.wealthLocks = result.data.wealthLockList;
                _.each(vm.wealthLocks, function (wealthLockCycle) {
                    wealthLockCycle.startDatePicker = {opened: false};
                    wealthLockCycle.endDatePicker = {opened: false};
                    wealthLockCycle.startDate = new Date(wealthLockCycle.startDate);
                    wealthLockCycle.endDate = new Date(wealthLockCycle.endDate);
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
            var isNewIdExisting = _.some(vm.wealthLocks, function (wealthLockCycle) {
                return wealthLockCycle.wealth_lock_id === newId;
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
            templateUrl: 'wealth-lock-dialog.html',
            controller: 'WealthLockDialogController',
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

    $scope.deleteItem = function (index, wealth_lock_id) {
        var modalInstance = openDialog({
            messages: ['确认要删除吗？']
        });

        modalInstance.result.then(function () {
            wealthLockService.deleteById(wealth_lock_id).then(function (wealthLockCycle) {
                var status = wealthLockCycle.data.status
                if (null != status && status != undefined && (status == "WealthIsLockException" || status == "WealthLockCycleInException")) {
                    openDialog({
                        messages: [wealthLockCycle.data.errorMessage],
                        noCancelButton: true
                    });
                } else {
                    vm.wealthLocks.splice(index, 1);
                }
            });
        })
    };

    $scope.deleteInserted = function (wealthLockCycle) {
        if (!wealthLockCycle.isNew) return;
        vm.wealthLocks = _.filter(vm.wealthLocks, function (d) {
            return d.wealth_lock_id !== wealthLockCycle.wealth_lock_id;
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

        vm.inserted.wealth_lock_id = generateId();
        vm.wealthLocks.push(vm.inserted);
    };

    $scope.saveItem = function (data, wealthLockCycle) {
        var errors = [];
        var d = $q.defer();
        if (!data.name) {
            errors.push('定案周期名不能为空。');
        }

        if (!data.startDate) {
            errors.push('定案周期起始日期不能为空。');
        }


        if (!!data.endDate) {
            if (!!data.startDate) {
                data.startDate.setHours(0, 0, 0, 0);
            }

            data.endDate.setHours(0, 0, 0, 0);
            if (data.endDate < data.startDate) {
                errors.push('定案周期结束日期不能小于起始日期。');
            }
        } else {
            data.endDate = data.startDate;
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

        angular.extend(wealthLockCycle, data);
        if (wealthLockCycle.isNew) {
            wealthLockService.create(wealthLockCycle).then(function (result) {
                var status = result.data.status
                if (null != status && status != undefined && (status == "WealthIsLockException" || status == "WealthLockCycleInException")) {
                    openDialog({
                        messages: [result.data.errorMessage],
                        noCancelButton: true
                    });
                    fnLoadAll();

                } else {
                    wealthLockCycle.wealth_lock_id = result.data;
                    wealthLockCycle.isNew = false;
                    openDialog({
                        messages: ['新建成功!'],
                        noCancelButton: true
                    });
                    fnLoadAll();
                }
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

        wealthLockService.modify(wealthLockCycle).then(function (result) {
            var status = result.data.status
            if (null != status && status != undefined && (status == "WealthIsLockException" || status == "WealthLockCycleInException")) {
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
}]).controller('WealthLockDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    $scope.data = data;
    $scope.data.type = $scope.data.type || 'warning';
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);
