'use strict';

(function (w) {
    w.VkrmsApp.controller('PublicHolidayController', ['$scope', '$modal', '$timeout', '$q', '$filter', 'PublicHolidayService', 'CommonService', function ($scope, $modal, $timeout, $q, $filter, publicHolidayService, commonService) {
        $scope.title = "万科资源管理信息系统 - 法定假期设置";

        var currentYear = new Date().getFullYear();
        var vm = {};
        var publicHolidays = {};
        vm.years = [];
        vm.selectedYear = currentYear;
        $scope.periods = [
            {id: 0, name: '工作日'},
            {id: 1, name: '休息日'}
        ];
        for (var i = currentYear - 10; i < currentYear + 10; i++) {
            vm.years.push(i);
        }
        setTimeout(function () {
            commonService.getCompanies().then(function (res) {
                $scope.authorizedCompanies = res;
            });
        }, 0)
        var fnLoadByYear = function (year) {
            publicHolidayService.loadByYear(year)
                .then(function (result) {
                    var publicHolidays = result.data;
                    _.each(publicHolidays, function (item, index, arr) {
                        item.startDatePicker = {opened: false};
                        item.endDatePicker = {opened: false};
                        if (!item.periods) {
                            item.periods = [];
                        }
                        _.each(item.periods, function (item, index, arr) {
                            item.startDatePicker = {opened: false};
                            item.endDatePicker = {opened: false};
                        })
                    })
                    vm.publicHolidays = publicHolidays;
                });
        };

        var openDialog = function (data) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'public-holiday-dialog.html',
                controller: 'PublicHolidayDialogController',
                size: 'sm',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
            return modalInstance;
        };

        var getSelectedDepartments = function (applyDepartments) {
            var companies = angular.copy($scope.authorizedCompanies),
                displayApplyDepartment = [];
            if (applyDepartments) {
                companies.forEach(function (company, index, arr) {
                    var departments = []
                    company.departments.forEach(function (department, index, arr) {
                        for (var i = 0; i < applyDepartments.length; i++) {
                            if (applyDepartments[i].departmentId == department.department_id) {
                                departments.push(department)
                            }
                        }
                    })
                    if (departments.length > 0) {
                        company.departments = departments;
                        displayApplyDepartment.push(company)
                    }
                })
            }

            return displayApplyDepartment
        }

        var openDetail = function (data) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'public-holiday-detail.html',
                controller: 'PublicHolidayDetailController',
                size: 'lg',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
            return modalInstance;
        };

        fnLoadByYear(currentYear);

        $scope.vm = vm;

        $scope.viewDetail = function (holiday) {
            var displayApplyDepartments = getSelectedDepartments(holiday.applyDepartments);
            openDetail({
                holiday: holiday,
                displayApplyDepartments: displayApplyDepartments,
                periods: $scope.periods
            })
        }

        $scope.deleteItem = function (index, id) {
            var modalInstance = openDialog({
                messages: ['确认要删除吗？']
            });

            modalInstance.result.then(function () {
                publicHolidayService.deleteById(id).then(function () {
                    vm.publicHolidays.splice(index, 1);
                });
            });
        };
        
        $scope.onSelectYear = function (year) {
            vm.selectedYear = year;
            fnLoadByYear(year);
        };

        $scope.createHolidayRule = function () {
            sessionStorage.removeItem('holidayRule');
            location.href = '#/public-holiday-set';
        }

        $scope.editHolidayRule = function (day) {
            sessionStorage.setItem('holidayRule', JSON.stringify(day));
            location.href = '#/public-holiday-set';
        }

        $scope.search = function () {
            var searchValue = $(".auth-search").val(), organizationsLen = 0;
            var organizations = $filter('filter')(displayOrganizations, {
                company_name: searchValue
            });
            for (var index = 0, len = organizations.length; index < len; index++) {
                organizationsLen += organizations[index].departments.length;
                if (organizationsLen > 80) {
                    $scope.organizationsLenLimit = index + 1;
                    break;
                }
            }
            if (organizationsLen <= 80) {
                $scope.organizationsLenLimit = organizations.length;
            }
            $scope.organizations = organizations;
        }

    }]);
    w.VkrmsApp.controller('PublicHolidayDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
        $scope.data = data;
        $scope.data.type = $scope.data.type || 'warning';
        $scope.ok = function () {
            $modalInstance.close();
            if (typeof $scope.data.fnLoadByYear == 'function') {
                $scope.data.fnLoadByYear($scope.data.year);
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }]);
    w.VkrmsApp.controller('PublicHolidayDetailController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
        $scope.data = data;
        $scope.day = $scope.data.holiday;
        $scope.periods = $scope.data.periods;
        $scope.displayApplyDepartments = $scope.data.displayApplyDepartments
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }]);
})(window);
