'use strict';
VkrmsApp.controller('HolidayRuleSettingController', ['$rootScope', '$scope', '$routeParams', '$timeout', 'HolidayRuleSettingsService', 'CommonService', 'UserService', function ($rootScope, $scope, $routeParams, $timeout, hrss, commonService, userService) {
    $scope.title = "万科资源管理信息系统 - 经验值设置";
    var holidayRuleSetting, workDayHolidayRules;
    $scope.editeHolidayRuleSetting = editeHolidayRuleSetting;
    $scope.saveHolidayRuleSetting = saveHolidayRuleSetting;
    $scope.search = search;
    $scope.bindSelect = bindSelect;
    $scope.wWorkHoursRules = hrss.getWWorkHoursRules();
    $scope.wHolidayValiditys = hrss.getWHolidayValiditys();
    $scope.yHolidayValiditys = hrss.getYHolidayValiditys();
    $scope.checkWWorkHoursRule = checkWWorkHoursRule;
    $scope.removeTempRule = removeTempRule;
    $scope.removeWorkDayTempRule = removeWorkDayTempRule;
    $scope.removeTempPostRule = removeTempPostRule;
    $scope.openWorkdayModal = openWorkdayModal;
    $scope.openHolidayModal = openHolidayModal;
    $scope.tab = $routeParams.tab == '1' ? 1 : 0;
    $scope.tab1 = tab1;
    $scope.tab2 = tab2;
    $scope.checkDetail = checkDetail;
    $scope.tab3 = tab3;
    $scope.getIds = ["否", "是"];
    $scope.checkData = checkData;
    $scope.isEdite = false;
    $scope.editeWisOverTimeAllowRest = editeWisOverTimeAllowRest;
    $scope.saveWisOverTimeAllowRest = saveWisOverTimeAllowRest;
    init();
    if ($routeParams.tab == '1') {
        $scope.tab = 1;
    } else {
        $scope.tab = 0;
    }
    function init() {
        $scope.isCheck = $routeParams.check == '1' ? true : false;
        $rootScope.pageTitle = $scope.isCheck ? '考勤管理-标准工时制休假规则查看' : '考勤管理-标准工时制休假规则设置';
        $scope.takeEffectAttendanceList = [];
        getAttendanceList();
        $scope.$on("selectpicker-loaded", function () {
            if ($routeParams.tab == '1') {
                $scope.tab = 1;
            } else {
                $scope.tab = 0;
            }
        });
        userService.getUserEmployee().then(function (res) {
            if (!_.isEmpty(res.authorizedPage)) {
                res.authorizedPage.forEach(function (item) {
                    if (item.indexOf('holiday-rule-setting:edit') != -1) {
                        $scope.isCheck = false
                    }
                })
            } else {
                $scope.isCheck = true
            }
        });
    }

    $scope.changeWisOverTimeAllowRest = changeWisOverTimeAllowRest;
    $scope.checkDate = checkDate;
    $scope.getAttendanceLockName = function (id) {
        if (id == 0) {
            return "";
        }
        var selected = [];
        angular.forEach($scope.takeEffectAttendanceList, function (s) {
            if (id == s.attendance_lock_id) {
                selected.push(s.name);
            }
        });
        return selected.length ? selected.join(', ') : '';
    }
    function checkDetail(item) {
        if (item.detail) {
            commonService.createModal({
                'templateUrl': 'holidayRuleSettingModal.html',
                'controller': 'holidayRuleSettingModalController',
                'windowClass': 'experience-size',
                'resolve': {
                    detail: function () {
                        return item.detail
                    }
                }
            });
        }
    }

    function openWorkdayModal(regionId) {
        commonService.createModal({
            'templateUrl': 'workdayDetailModal.html',
            'controller': 'workdayDetailController',
            'size': 'lg',
            'resolve': {
                'companyId': function () {
                    return regionId
                }
            }
        })
    }

    function openHolidayModal(regionId) {
        commonService.createModal({
            'templateUrl': 'holidayDetailModal.html',
            'controller': 'holidayDetailController',
            'size': 'lg',
            'resolve': {
                'regionId': function () {
                    return regionId
                }
            }
        })
    }

    function changeWisOverTimeAllowRest(data, item) {
        if (data == 0) {
            item.wholidayValidity = '-'
        } else {
            item.wholidayValidity = '本考勤周期'
        }
    }

    function saveWisOverTimeAllowRest(data) {
        var params = {};
        setTimeout(function () {
            $scope.isEdite = false;
            params.regionId = data.regionId;
            params.rules = data.rules;
            var arr = [];
            arr.push(params);
            hrss.saveWorkdayHolidayRule({
                workDayRestRulesDTOList: arr
            }).then(function (result) {
                if (result.status != "success") {
                    commonService.alert({
                        content: '保存失败！',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                }
                search();
            })
        }, 0);
    }

    function editeWisOverTimeAllowRest(form, item) {
        if (!$scope.isEdite) {
            form.$show();
        }
        $scope.isEdite = true;
        if (item.length > 1) {
            if (!$scope.getAttendanceLockName(item[1].attendanceLockId)) {
                item[1].attendanceLockId = 0;
            }
        } else {
            item[0].attendanceLockId = 0;
        }
        if (item && item.length >= 2) {
            return;
        }
        if (item[0].ruleId == null) return;
        item.push({
            "wisOverTimeAllowRest": "1",
            "yholidayValidity": "0",
            "yisOverTimeAllowRest": "0",
            "wholidayValidity": "本考勤周期",
            "attendanceLockId": 0
        });
    }

    function getAttendanceList() {
        userService.getUserEmployee().then(function (result) {
            return result.loginMobile == 15814339789;
        }).then(function (isSuper) {
            commonService.getOldEffectAttendanceList()
                .then(function (res) {
                    var data = res.data;
                    if (data) {
                        data = data.slice(1, 4);
                        angular.forEach(data, function (item) {
                            item.name = item.name + '(' + item.startDate + '起)'
                        });
                        data.unshift({
                            name: "请选择",
                            attendance_lock_id: 0
                        });
                        $scope.takeEffectAttendanceList = data;
                    }
                });
        })
    }

    function tab1() {
        $scope.tab = 0;
        $scope.currentPage = 1;
        window.location = '#/holiday-rule-setting?tab=0';
        // search();
    }

    function tab2() {
        $scope.tab = 1;
        $scope.currentPage = 1;
        window.location = '#/holiday-rule-setting?tab=1';
        commonService
            .getCityCompany()
            .then(function (response) {
                $scope.cityCompanies = response;
                $timeout(function () {
                    $("#select-city-company").selectpicker("refresh");
                }, 0);
            });
        // search();
    }

    function tab3(type) {
        if (type) {
            window.location = "#/lieu-line-setting?check=1"
        } else {
            window.location = "#/lieu-line-setting"
        }
    }

    function bindSelect(item, arr) {
        var selected;
        angular.forEach(arr, function (s) {
            if (item == s.text) {
                selected = s.value;
            }
        });
        return selected;
    }

    function getSearchParams() {
        var params = {
            length: $scope.page,
            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                regionIds: _.pluck($scope.selectedCityCompanies, 'regionId')
            }
        };
        return params;
    }

    function search() {
        $scope.isEdite = false;
        if ($scope.tab) {
            hrss.getHolidayRule(getSearchParams()).then(function (result) {
                $scope.holidayRuleSetting = result.data || [];
                angular.forEach($scope.holidayRuleSetting, function (v) {
                    if (v.rules && v.rules.length) {
                        angular.forEach(v.rules, function (item) {
                            item.yHolidayValidity = (!item.yHolidayValidity || item.yHolidayValidity == null) ? "0" : ("" + item.yHolidayValidity);
                            item.wHolidayValidity = item.wHolidayValidity == null ? "0" : ("" + item.wHolidayValidity);
                        })
                    } else {
                        v.rules = [{
                            "wWorkHoursRule": null,
                            "yHolidayValidity": "0",
                            "wHolidayValidity": "0",
                            "attendanceLockId": 0
                        }];
                    }
                });
                console.log($scope.holidayRuleSetting)
                holidayRuleSetting = JSON.parse(JSON.stringify($scope.holidayRuleSetting));
                $scope.noData = !holidayRuleSetting.length;
                $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
            });
        } else {
            hrss.getWorkdayHolidayRule(getSearchParams()).then(function (result) {
                $scope.workDayHolidayRules = result.data || [];
                angular.forEach($scope.workDayHolidayRules, function (v) {
                    if (v.rules && v.rules.length) {
                        angular.forEach(v.rules, function (item) {
                            item.wisOverTimeAllowRest = item.wisOverTimeAllowRest == null ? "1" : ("" + item.wisOverTimeAllowRest);
                            item.yholidayValidity = item.yholidayValidity == null ? "0" : ("" + item.yholidayValidity);
                            item.wholidayValidity = item.wholidayValidity == null ? "本考勤周期" : ("" + item.wholidayValidity);
                            item.yisOverTimeAllowRest = 1;
                        });
                    } else {
                        v.rules = [{
                            "wisOverTimeAllowRest": "1",
                            "yholidayValidity": "1",
                            "yisOverTimeAllowRest": 1,
                            "wholidayValidity": "本考勤周期",
                            "attendanceLockId": 0
                        }];
                    }
                });
                workDayHolidayRules = JSON.parse(JSON.stringify($scope.workDayHolidayRules));
                $scope.workDayNoData = !$scope.workDayHolidayRules.length;
                $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
            })
        }
        commonService.storageSearchStatus($scope);
    }

    function editeHolidayRuleSetting(rowform, item) {
        if (!$scope.isEdite) {
            rowform.$show();
            $scope.isEdite = true;
            if (item.length > 1) {
                if (!$scope.getAttendanceLockName(item[1].takeEffectAttendanceId)) {
                    item[1].takeEffectAttendanceId = 0;
                }
            } else {
                item[0].takeEffectAttendanceId = 0;
            }
            if (item && item.length >= 2) {
                return;
            }
            if (item[0].ruleId == null) return;
            item.push({
                "attendanceLockId": 0,
                "wHolidayValidity": "0",
                "yHolidayValidity": "0",
                "wWorkHoursRule": "0"
            })
        }
    }

    function saveHolidayRuleSetting(item) {
        var params = {};
        $timeout(function () {
            params.regionId = +item.regionId;
            params.rules = item.rules;
            console.log(params)
            hrss.saveHolidayRuleSetting(params).then(function () {
                search();
            });
        }, 100);
    }

    function checkData(data) {
        if (data != 0 && !data) {
            return "必选项";
        }
    }

    function checkDate(data) {
        if (!data || $scope.takeEffectAttendanceList.map(function (item) {
                return item.attendance_lock_id
            }).indexOf(data) == -1) {
            return '必选项';
        }
    }

    function removeTempRule() {
        $scope.isEdite = false;
        $scope.holidayRuleSetting = JSON.parse(JSON.stringify(holidayRuleSetting));
    }

    function removeTempPostRule(rowform) {
        rowform.$cancel();
        $scope.isEdite = false;
    }

    function removeWorkDayTempRule() {
        $scope.isEdite = false;
        $scope.workDayHolidayRules = JSON.parse(JSON.stringify(workDayHolidayRules));
    }

    function checkWWorkHoursRule(data) {
        if (data != 0 && !data) {
            return "不能为空!";
        }
    }
}]);
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('holidayRuleSettingModalController', holidayRuleSettingModalController);
    holidayRuleSettingModalController.$inject = ['$scope', '$modalInstance', 'detail'];
    function holidayRuleSettingModalController($scope, $modalInstance, detail) {
        $scope.detail = detail;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('workdayDetailController', workdayDetailController);

    workdayDetailController.$inject = ['$scope', '$modalInstance', 'companyId', '$http', 'HolidayRuleSettingsService', 'CommonService'];

    function workdayDetailController($scope, $modalInstance, regionId, $http, hrss, commonService) {
        commonService.progress('start');
        $http
            .get(apiBaseUrl + '/workday/holiday-rule-setting/history', {
                params: {
                    regionId: regionId
                }
            })
            .then(function (result) {
                commonService.progress('end');
                $scope.items = result.data.data;
            }, errorHandle);

        $scope.bindSelect = bindSelect;
        $scope.wHolidayValiditys = hrss.getWHolidayValiditys();
        $scope.yHolidayValiditys = hrss.getYHolidayValiditys();

        function bindSelect(item, arr) {
            var selected;
            angular.forEach(arr, function (s) {
                if (item == s.text) {
                    selected = s.value;
                }
            });
            return selected;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function errorHandle() {
            commonService.progress('emd');
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('holidayDetailController', holidayDetailController);

    holidayDetailController.$inject = ['$scope', '$modalInstance', 'regionId', '$http', 'HolidayRuleSettingsService'];

    function holidayDetailController($scope, $modalInstance, regionId, $http, hrss) {
        $http
            .get(apiBaseUrl + '/holiday-rule-setting/region-ids/history', {
                params: {
                    regionId: regionId
                }
            })
            .then(function (result) {
                console.log(result);
                $scope.items = result.data.data;
            }, errorHandle);

        $scope.bindSelect = bindSelect;
        $scope.wHolidayValiditys = hrss.getWHolidayValiditys();
        $scope.yHolidayValiditys = hrss.getYHolidayValiditys();

        function bindSelect(item, arr) {
            console.log(item, arr)
            var selected;
            angular.forEach(arr, function (s) {
                if (item == s.text) {
                    selected = s.value;
                }
            });
            return selected;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function errorHandle() {

        }
    }
})();