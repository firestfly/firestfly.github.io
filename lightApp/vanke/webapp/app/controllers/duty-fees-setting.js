/**
 * Modified by ushio on 2017/6/12.
 */
(function () {
    angular
        .module('vkrmsApp')
        .controller('DutyFeesSettingController', DutyFeesSettingController);

    DutyFeesSettingController.$inject = ['$scope', '$http', 'CommonService', 'UserService'];

    function DutyFeesSettingController($scope, $http, commonService, userService) {
        var df = this;

        $scope.search = search;
        df.getEffectPeriodName = getEffectPeriodName;
        df.getLegalHoliday = getLegalHoliday;
        df.checkEffectAttendance = checkEffectAttendance;
        df.checkRequire = checkRequire;
        df.save = save;
        df.updateAllowanceType = updateAllowanceType;
        df.openDetail = openDetail;
        df.editeStatus = false;
        init();
        userService.getUserEmployee().then(function (res) {
            if (!_.isEmpty(res.authorizedPage)) {
                res.authorizedPage.forEach(function (item) {
                    if (item.indexOf('duty-fees-setting:edit') != -1) {
                        df.isEdit = true
                    }
                })
            } else {
                df.isEdit = false;
            }
        });
        $scope.editeDutyFees = function (form, item) {
            if (!df.editeStatus) {
                form.$show();
            }
            var copyData = JSON.parse(JSON.stringify(item[0]));
            if (item.length > 1) {
                if (!df.getEffectPeriodName(item[1].takeEffectAttendanceId)) {
                    item[1].takeEffectAttendanceId = 0;
                }
            } else {
                copyData.takeEffectAttendanceId = 0;
            }
            df.editeStatus = true;
            if (item && item.length >= 2) {
                return;
            }
            if (item[0].ruleId == null) return;
            item.push(copyData)
        }
        function init() {
            getLegalHolidayList();
            getEffectPeriodList();
        }

        function checkEffectAttendance(data) {
            if (!data || df.effectPeriodList.map(function (item) {
                    return item.attendance_lock_id
                }).indexOf(data) == -1) {
                return '请选择开始生效周期';
            }
        }

        function getLegalHolidayList() {
            $http
                .get(apiBaseUrl + '/dictionaries', {
                    params: {
                        code: 'DUTY_FEE_MODE'
                    }
                })
                .then(function (res) {
                    df.legalHolidayList = res.data.data;
                }, errorHandle)
        }

        function getEffectPeriodList() {
            commonService.getOldEffectAttendanceList()
                .then(function (res) {
                    var data = res.data.slice(1, 4);
                    df.effectPeriodList = data;
                    df.effectPeriodList.forEach(function (item) {
                        item.name = item.name + '(' + item.startDate + '起)'
                    })
                    data.unshift({
                        name: "请选择",
                        attendance_lock_id: 0
                    });
                }, errorHandle)
        }

        function getLegalHoliday(code) {
            return _.find(df.legalHolidayList, function (item) {
                return item.code == code;
            })
        }

        function getEffectPeriodName(id) {
            return _.find(df.effectPeriodList, function (item) {
                return item.attendance_lock_id == id;
            })
        }

        function checkRequire(data) {
            if (data && data < 0) {
                return ' ';
            }
        }

        function updateAllowanceType(data, shift) {
            if (data == '3_TIMES_HOURLY_PAY') {
                shift.amount = 0
            }
            shift.allowanceTypeFlag = data == 'ALLOWANCE_VALUE'
        }

        function search() {
            $http
                .get(apiBaseUrl + '/duty-paid', {
                    params: getParams()
                })
                .then(function (res) {
                    df.items = res.data.data;
                    $scope.totalPage = Math.ceil(res.data.recordsTotal / $scope.page);
                }, errorHandle)
        }

        function save(data, item) {
            var params = {
                id: item.id || null,
                regionId: item.regionId,
                rules: item.rules
            };
            $http
                .put(apiBaseUrl + '/duty-paid', params)
                .then(function (res) {
                    item.id = res.data.id;
                    search();
                }, errorHandle)
            df.editeStatus = false;
        }

        function getParams() {
            return {
                'search[value]': {
                    'regionIds': _.pluck($scope.selectedCityCompanies, 'regionId')
                },
                start: ($scope.currentPage - 1) * $scope.page,
                length: $scope.page
            }
        }

        function openDetail(regionId) {
            commonService.createModal({
                'templateUrl': 'dutyFeesHistory.html',
                'controller': 'dutyFeesHistoryController',
                'size': 'lg',
                'resolve': {
                    'regionId': function () {
                        return regionId
                    }
                }
            })
        }

        function errorHandle() {

        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('dutyFeesHistoryController', dutyFeesHistoryController);

    dutyFeesHistoryController.$inject = ['$scope', '$modalInstance', 'regionId', 'CommonService', '$http', '$rootScope'];

    function dutyFeesHistoryController($scope, $modalInstance, regionId, CommonService, $http, $rootScope) {
        $scope.ok = ok;
        $rootScope.loading = true;
        $http
            .get(apiBaseUrl + '/duty-paid/' + regionId + '/history')
            .then(function (res) {
                $scope.items = res.data.data;
                $rootScope.loading = false;
            });

        function ok() {
            $modalInstance.close();
        }
    }
})();