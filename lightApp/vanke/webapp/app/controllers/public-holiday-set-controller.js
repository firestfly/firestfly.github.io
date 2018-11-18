'use strict';

(function (w) {
    w.VkrmsApp.controller('PublicHolidaySetController', ['$scope', '$modal', '$timeout', '$q', '$filter', 'PublicHolidayService', 'CommonService', function ($scope, $modal, $timeout, $q, $filter, publicHolidayService, commonService) {
        $scope.$parent.title = "万科资源管理信息系统 - 法定假期设置";
        $scope.specialHoliday = [
            {text: '否', value: 0},
            {text: '是', value: 1}
        ];
        $scope.periods = [
            {id: 0, name: '工作日'},
            {id: 1, name: '休息日'}
        ];
        var day = JSON.parse(sessionStorage.getItem('holidayRule'));
        $scope.day = day || {
            isNew: true,
            name: '',
            year: '',
            startDate: '',
            endDate: '',
            startDatePicker: {opened: false},
            endDatePicker: {opened: false},
            specialHoliday: 0,
            applyDepartments: [],
            periods: []
        };
        $scope.showApplyDepartments = !!$scope.day.specialHoliday;
        $scope.checkboxType = 'organization';
        $scope.allOrganizations = [];
        $scope.organizationsLenLimit = 2;

        var savedDepartmentsIds = [];

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
        var backToList = function () {
            location.href = '#/public-holiday';
        }

        var initSelectedDepartments = function (allOrganizations, applyDepartments) {
            var displayApplyDepartment;
            if (allOrganizations.length > 0 && applyDepartments && applyDepartments.length > 0) {
                allOrganizations.forEach(function (company, index, arr) {
                    company.departments.forEach(function (department, index, arr) {
                        for (var i = 0; i < applyDepartments.length; i++) {
                            if (applyDepartments[i].departmentId == department.department_id) {
                                department.isSelected = true;
                            }
                        }
                    })
                })
            }
            displayApplyDepartment = allOrganizations
            return displayApplyDepartment
        }

        var getSelectedDepartments = function (day) {
            var selectedDepartments = [];
            $scope.organizations.forEach(function (company) {
                company.departments.forEach(function (department) {
                    if (department.isSelected) {
                        selectedDepartments.push({
                            'departmentId': department.department_id
                        })
                    }
                })
            })

            return selectedDepartments
        }

        setTimeout(function () {
            commonService.getCompanies().then(function (res) {
                $scope.allOrganizations = initSelectedDepartments(res, $scope.day.applyDepartments);
                $scope.organizations = $scope.allOrganizations;
            });
        }, 0)
        // 更新数据
        $scope.updateName = function (data, day) {
            day.name = data;
        }
        $scope.updateDate = function (data, period, key) {
            period[key] = new Date(data).getTime();
        }
        $scope.updateType = function (data, period) {
            period.type = data;
        }
        $scope.isSpecialHoliday = function (data, day) {
            day.specialHoliday = data
            if (day.specialHoliday) {
                $scope.showApplyDepartments = true
            } else {
                $scope.showApplyDepartments = false
            }
        }

        $scope.search = function () {
            var searchValue = $(".auth-search").val(), organizationsLen = 0;
            var organizations = $filter('filter')($scope.allOrganizations, {
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
        $scope.openDatePicker = function (data) {
            $timeout(function () {
                data.opened = true;
            });
        };
        $scope.addHolidayRule = function (day) {
            var insertedRule = {
                isNew: true,
                type: 0,
                startDate: '',
                endDate: '',
                startDatePicker: {opened: false},
                endDatePicker: {opened: false}
            }
            day.periods.push(insertedRule);
        };

        $scope.deletePrevRule = function (day) {
            if (!day.deletedPeriods) {
                day.deletedPeriods = [];
            }
            if (day.periods.length > 0) {
                var deleteRule = day.periods.pop();
                if (!deleteRule.isNew) {
                    day.deletedPeriods.push(deleteRule.id);
                }
            }
        };

        $scope.saveItem = function (day) {
            var errors = [];
            var hasEmptyStartDate, hasEmptyEndDate, isValidDate, hasConflictDate, hasRepeatedDate;
            var d = $q.defer();

            day.applyDepartments = getSelectedDepartments(day);
            if (!day.name) {
                errors.push('假期名一栏不能为空，请修改。');
            }
            if (!day.startDate || !day.endDate) {
                errors.push('假期日期一栏不能有空选项，请修改。');
            }
            if (day.startDate - day.endDate > 0) {
                errors.push('假期结束日期不能小于起始日期。');
            }
            if (day.specialHoliday && day.applyDepartments.length == 0) {
                errors.push('你还未勾选相应项目，请修改。');
            }

            hasEmptyStartDate = _.some(day.periods, function (period) {
                return !period.startDate
            });
            hasEmptyEndDate = _.some(day.periods, function (period) {
                return !period.endDate
            });
            isValidDate = _.some(day.periods, function (period) {
                return period.endDate < period.startDate
            });
            hasConflictDate = _.some(day.periods, function (period) {
                return (period.startDate >= day.startDate && period.startDate <= day.endDate) || (period.endDate >= day.startDate && period.startDate <= day.endDate)
            });
            day.periods.forEach(function (period, index) {
                var periods = day.periods;
                for (var i = 0, len = periods.length; i < len; i++) {
                    if (period.id === periods[i].id) {
                        break
                    }
                    if ((period.startDate >= periods[i].startDate && period.startDate <= periods[i].endDate) || (period.endDate >= periods[i].startDate && period.startDate <= periods[i].endDate)) {
                        hasRepeatedDate = true
                    }
                }
            })

            if (hasEmptyStartDate || hasEmptyEndDate) {
                errors.push('调班规则日期不能为空。');
            }
            if (isValidDate) {
                errors.push('调班规则结束日期不能小于起始日期。');
            }
            if (hasConflictDate || hasRepeatedDate) {
                errors.push('所设置日期与此节假日其他设置日期相冲突，请检查');
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

            if (!day.year) {
                day.year = new Date(day.startDate).getFullYear();
            }
            _.each(day.periods, function (period) {
                delete period.isNew
            });
            if (day.isNew) {
                delete day.isNew
                publicHolidayService.create(day).then(function (result) {
                    openDialog({
                        messages: ['新建成功!'],
                        noCancelButton: true,
                        backToList: backToList
                    });
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
            publicHolidayService.modify(day).then(function () {
                openDialog({
                    messages: ['保存成功!'],
                    noCancelButton: true,
                    backToList: backToList
                });
                d.resolve();
            })
            return d.promise
        };

    }]).controller('PublicHolidayDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
        $scope.data = data;
        $scope.data.type = $scope.data.type || 'warning';
        $scope.ok = function () {
            $modalInstance.close();
            if (typeof $scope.data.backToList == 'function') {
                $scope.data.backToList();
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }]);
})(window);
