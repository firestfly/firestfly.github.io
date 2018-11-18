'use strict';
VkrmsApp.controller('OverallHolidayRuleSettingController', ['$rootScope', '$scope', '$routeParams', '$timeout', 'OverallHolidayRuleSettingsService', 'CommonService', 'UserService', function ($rootScope, $scope, $routeParams, $timeout, ohrss, commonService, userService) {
    $scope.title = "万科资源管理信息系统 - 综合工时制休假规则设置";
    $scope.paginationConfig = {}
    $scope.paginationConfig.autoSearch = false;
    $scope.editeHolidayRuleSetting = editeHolidayRuleSetting;
    $scope.saveHolidayRuleSetting = saveHolidayRuleSetting;
    $scope.search = search;
    $scope.bindSelect = bindSelect;
    $scope.wWorkHoursRules = ohrss.getWWorkHoursRules();
    $scope.wHolidayValiditys = ohrss.getWHolidayValiditys();
    $scope.yHolidayValiditys = ohrss.getYHolidayValiditys();
    $scope.changeWWorkHoursRule = changeWWorkHoursRule;
    $scope.checkWWorkHoursRule = checkWWorkHoursRule;
    $scope.removeTempRule = removeTempRule;
    $scope.removeWorkDayTempRule = removeWorkDayTempRule;
    $scope.tab = 0;
    $scope.isO = 1;
    $scope.tab = $routeParams.tab == '1' ? 1 : 0;
    $scope.tab1 = tab1;
    $scope.tab2 = tab2;
    $scope.checkDetail = checkDetail;
    $scope.getIds = ["否", "是"];
    $scope.checkData = checkData;
    $scope.isEdite = false;
    $scope.editeWisOverTimeAllowRest = editeWisOverTimeAllowRest;
    $scope.saveWisOverTimeAllowRest = saveWisOverTimeAllowRest;
    $scope.saveNotOHolidayRuleSetting = saveNotOHolidayRuleSetting;
    $scope.openOverallHolidayRuleDetail = openOverallHolidayRuleDetail;
    $scope.openNotOperationOverallHolidayMonthlyRuleDetail = openNotOperationOverallHolidayMonthlyRuleDetail;
    $scope.openOverallHolidayMonthlyRuleDetail = openOverallHolidayMonthlyRuleDetail;
    $scope.isCheck = $routeParams.check == '1' ? true : false;
    $rootScope.pageTitle = $scope.isCheck ? '调休假规则查看' : '考勤管理-综合工时制休假规则设置';
    $scope.takeEffectAttendanceList = [];
    $scope.showEffectAttendance = showEffectAttendance;
    $scope.loadAttendance = loadAttendance;
    $scope.addHolidayRule = addHolidayRule;
    $scope.changeAttendance = changeAttendance;
    getAttendanceList();
    $scope.changeWisOverTimeAllowRest = changeWisOverTimeAllowRest;
    $scope.validateAttendance = validateAttendance;
    $scope.addNotORule = addNotORule;
    $scope.delRule = delRule;
    $scope.removeNotORule = removeNotORule;
    $scope.addWorkDayHolidayRules = addWorkDayHolidayRules;
    $scope.takeTempEffectAttendanceList = [];
    $scope.getAttendanceLockName = getAttendanceLockName;
    $scope.checkDate = checkDate;
    getTempAttendanceList();
    var holidayRuleSetting, workDayHolidayRules, notOHolidayRuleSetting;
    function changeAttendance(rule, data) {
        $scope.cacheAttendance = rule.takeEffectAttendance;
        rule.takeEffectAttendanceId = data;
    }
    function getAttendanceLockName(id) {
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
    function getTempAttendanceList() {
        commonService.getOldEffectAttendanceList()
            .then(function (res) {
                var data = res.data;
                if (data) {
                    data = data.slice(1, 4);
                    angular.forEach(data, function (item) {
                        item.name = item.name + '（' + item.startDate + '起）'
                    });
                    data.unshift({
                        name: "请选择",
                        attendance_lock_id: 0
                    });
                    $scope.takeTempEffectAttendanceList = data;
                }
            });
    }
    function delRule(item, index) {
        $("body").trigger("click");
        item.length > 1 && item.splice(index, 1);
    }
    function validateAttendance(data, item, k) {
        var selected = 0;
        data && angular.forEach($scope.takeEffectAttendanceList, function (s) {
            if (data == s.attendance_lock_id) {
                selected++;
            }
        });
        if (selected === 0) {
            return ("请选择开始生效周期！");
        } else if (item && item.rules) {
            var ruleArr = [];
            angular.forEach(item.rules, function (rule, index) {
                if (index != k && rule.takeEffectAttendanceId && rule.takeEffectAttendanceId.length) {
                    ruleArr = ruleArr.concat(rule.takeEffectAttendanceId)
                }
            });
            for (var i = 0; i < item.rules[k].takeEffectAttendanceId.length; i++) {
                if (ruleArr.indexOf(item.rules[k].takeEffectAttendanceId[i]) >= 0) {
                    return "生效周期重复";
                }
            }
        }
    }

    function loadAttendance() {
        var config = {
            selectedTextFormat: "count > 1",
            // dropupAuto: false,
            noneSelectedText: "请选择",
            liveSearch: true,
            actionsBox: true,
            width: "100%",
            container: "body"
        };
        $(".grid-row select").selectpicker(config);
        setTimeout(function () {
            $(".grid-row select").selectpicker("refresh");
        }, 100);
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

    function openOverallHolidayRuleDetail(regionId){
        commonService.createModal({
            'templateUrl': 'overallHolidayRuleDetailModal.html',
            'controller': 'overallHolidayRuleDetailController',
            'size': 'lg',
            'resolve': {
                regionId: function () {
                    return regionId
                }
            }
        })
    }

    function openOverallHolidayMonthlyRuleDetail(regionId,workjobId){
        commonService.createModal({
            'templateUrl': 'overallHolidayMonthlyRuleDetailModal.html',
            'controller': 'overallHolidayMonthlyRuleDetailController',
            'size': 'lg',
            'resolve': {
                data: function () {
                    return {
                        regionId: regionId,
                        workjobsId: workjobId
                    }
                }
            }
        })
    }

    function openNotOperationOverallHolidayMonthlyRuleDetail(regionId,workjobId){
        commonService.createModal({
            'templateUrl': 'notOperationOverallHolidayMonthlyRuleDetailModal.html',
            'controller': 'notOperationOverallHolidayMonthlyRuleDetailController',
            'size': 'lg',
            'resolve': {
                data: function () {
                    return {
                        regionId: regionId,
                        workjobsId: workjobId
                    }
                }
            }
        })
    }

    function changeWisOverTimeAllowRest(data, item) {
        if (data == 0) {
            item.holidayValidity = -1
        } else {
            item.holidayValidity = 0
        }
    }
    $scope.isCheck = true;
    userService.getUserEmployee().then(function (res) {
        if (!_.isEmpty(res.authorizedPage)) {
            res.authorizedPage.forEach(function (item) {
                if (item.indexOf('holiday-rule-setting') != -1) {
                    $scope.isCheck = false
                }
            })
        } else {
            $scope.isCheck = true
        }
    });
    function checkDate(data) {
        if (!data || $scope.takeTempEffectAttendanceList.map(function (item) {
                return item.attendance_lock_id
            }).indexOf(data) == -1) {
            return '必选项';
        }
    }
    function saveWisOverTimeAllowRest(data) {
        var params = {};
        setTimeout(function () {
            $scope.isEdite = false;
            params.regionId = data.regionId;
            angular.forEach(data.rules, function (v) {
                v.isOvertimeAllowRest = v.isOvertimeAllowRest == 1;
            });
            params.rules = data.rules;
            ohrss.saveWorkdayHolidayRule(params).then(function (result) {
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

    function saveNotOHolidayRuleSetting(item) {
        var params = {};
        setTimeout(function () {
            $scope.isEdite = false;
            params.regionId = item.regionId;
            params.rules = item.rules;
            params.workjobId = item.workjobId;
            var configTip = {
                "title": "请确认",
                "icon": "f",
                "content": "原规则生效周期从" + $scope.cacheAttendance + "，现在修改为" + getAttendanceNameById(item.rules[item.rules.length - 1].takeEffectAttendanceId) + ",是否确认？",
                "callback": function () {
                    ohrss.saveNotOHolidayRule(params).then(function (result) {
                        if (result.status != "success" && result.errorCode == "10001") {
                            commonService.alert({
                                content: "每月值班天数设置有误，请检查设置",
                                icon: "fa-exclamation-circle",
                                iconColor: "icon-red"
                            });
                        }
                        search();
                    })
                },
                "cancel": function () {
                    removeNotORule();
                }
            };

            if (!$scope.cacheAttendance || (item.rules.length == 2 && $scope.cacheAttendance.indexOf(getAttendanceNameById(item.rules[1].takeEffectAttendanceId)) > -1)) {
                ohrss.saveNotOHolidayRule(params).then(function (result) {
                    if (result.status != "success" && result.errorCode == "10001") {
                        commonService.alert({
                            content: "每月值班天数设置有误，请检查设置",
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                    search();
                })
            } else {
                commonService.confirm(configTip);
            }

        }, 0);
    }

    function showEffectAttendance(effectAttendanceIds) {
        effectAttendanceIds = [effectAttendanceIds] || [];
        var selected = [];
        angular.forEach($scope.takeEffectAttendanceList, function (s) {
            if (effectAttendanceIds.indexOf(s.attendance_lock_id) >= 0) {
                selected.push(s.startDate);
                selected.push(s.endDate);
            }
        });
        return selected.length ? commonService.cancatEffectAttendance(selected) : effectAttendanceIds.takeEffectAttendance;
    }

    function editeWisOverTimeAllowRest(form, item) {
        if (!$scope.isEdite) {
            form.$show();
            $scope.isEdite = true;
            if (item && item.length >= 2) {
                return;
            }
            if (item[0].ruleId == null) return;
            item.push({
                "attendanceLockId": 0,
                "isOvertimeAllowRest": "0",
                "holidayValidity": "0"
            })
        }
    }

    function getAttendanceList() {
        commonService.getOldEffectAttendanceList()
                .then(function (res) {
                    var data = res.data.slice(1, 4);
                    if (data) {
                        angular.forEach(data, function (item) {
                            // item.name = item.startDate + "—" + item.endDate;
                            item.name = item.name + '(' + item.startDate + '起)'
                        });
                        data.unshift({
                            name: "请选择",
                            attendance_lock_id: 0
                        });
                        $scope.takeEffectAttendanceList = data;
                    }
                });
    }

    setTimeout(function () {
        tab1();
    }, 110);
    function tab1() {
        $("body").trigger("click");
        $scope.showStandardWorkJobsOne = "false";
        $scope.tab = 0;
        $scope.showButype = false;
        getWorkJob();
        search();
    }

    function getWorkJob() {
        commonService.getValidWorkJobs().then(function (standardWorkJobs) {
            $("#selected-standardWorkJobs-one").off("shown.bs.select");
            $scope.standardWorkJobs = standardWorkJobs;
            $scope.selectedStandardWorkJobs = [];
            setTimeout(function () {
                $('#selected-standardWorkJobs-one').selectpicker("refresh");
            }, 0);
        });
    }

    function getBuWorkJob() {
        var params = {
            jobShortName: $scope.selectedButype || ""
        };
        commonService.getBuypeWorkJob(params).then(function (standardWorkJobs) {
            $scope.standardWorkJobs = standardWorkJobs;
            $scope.selectedStandardWorkJobs = [];
            setTimeout(function () {
                $('#selected-standardWorkJobs-one').selectpicker("refresh");
            }, 0);
        });
    }
    function tab2() {
        $("body").trigger("click");
        $scope.tab = 1;
        $scope.showStandardWorkJobsOne = true;
        $scope.showButype = true;
        getBuWorkJob();
        $("#butype").on("change.bs.select", getBuWorkJob);
        search();
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
        var selectedStandardWorkJobs = $scope.selectedStandardWorkJobs;
        if ($scope.tab == 1) {
            if ($scope.selectedStandardWorkJobs.length == 0) {
                selectedStandardWorkJobs = $scope.standardWorkJobs;
            }
        } else {
            selectedStandardWorkJobs = void(0);
        }
        var params = {
            length: $scope.page || 10,
            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                regionIds: _.pluck($scope.selectedCityCompanies, 'regionId'),
                workjobIds: selectedStandardWorkJobs && _.pluck(selectedStandardWorkJobs, 'workJobId')
            },

        };
        return params;
    }

    function changeWWorkHoursRule(data, item) {
        item.wWorkHoursRule = data;
        if (data == 2) {
            item.wHolidayValidity = -1;
        } else {
            item.wHolidayValidity = 1;
        }
        $timeout(function () {
            //$("#holiday-setting-table").find("select").selectpicker("refresh");
        }, 0);
    }
    function getHolidayRule() {
        var windowH = $(window).height() - 300;
        ohrss.getHolidayRule(getSearchParams()).then(function (result) {
            $("#citycompany-table").height(windowH);
            $scope.holidayRuleSetting = result.data || [];
            sortList($scope.holidayRuleSetting);
            holidayRuleSetting = JSON.parse(JSON.stringify($scope.holidayRuleSetting));
            $scope.noData = !holidayRuleSetting.length;
            $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
        });
    }

    function addNotORule(item) {
        if (item && item.length >= 2) {
            return;
        }
        if (item[0].id == null) return;
        item.push({
            "dutyDays": 0,
            "period": 0,
            "periodText": "本考勤周期",
            "takeEffectAttendanceId": 0,
            "takeEffectAttendance": ""
        })
    }
    function addHolidayRule(item) {
        if (item && item.length >= 2) {
            return;
        }
        if (item[0].id == null) return;
        item.push({
            "validMonths": "本考勤周期",
            "oaDays": 0,
            "obDays": 0,
            "odDays": 0,
            "oeDays": 0,
            "ofDays": 0,
            "ogDays": 0,
            "ohDays": 0,
            "oiDays": 0,
            "takeEffectAttendanceId": 0,
            "takeEffectAttendance": ""
        })
    }
    function sortList(lists) {
        angular.forEach(lists, function (list) {
            for (var index = 0; index < list.rules.length; index++) {
                if (!list.rules[index].takeEffectAttendanceId) {
                    break;
                }
            }
            if (list.rules.length <= index) {
                return;
            }
            var temp = list.rules.splice(index, 1);
            list.rules.sort(function (r1, r2) {
                return r1.takeEffectAttendanceId[0] > r2.takeEffectAttendanceId[0];
            });
            list.rules.unshift(temp[0]);
        });
    }
    function getNotOHolidayRule() {
        var windowH = $(window).height() - 300;
        ohrss.getNotOHolidayRule(getSearchParams()).then(function (result) {
            $("#citycompany-table").height(windowH);
            $scope.notOHolidayRuleSetting = result.data || [];
            sortList($scope.notOHolidayRuleSetting);
            notOHolidayRuleSetting = JSON.parse(JSON.stringify($scope.notOHolidayRuleSetting));
            $scope.noData = !notOHolidayRuleSetting.length;
            $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
        });
    }
    function getWorkdayHolidayRule() {
        ohrss.getWorkdayHolidayRule(getSearchParams()).then(function (result) {
            $scope.workDayHolidayRules = result.data || [];
            angular.forEach($scope.workDayHolidayRules, function (v) {
                if (v.rules && v.rules.length) {
                    angular.forEach(v.rules, function (item) {
                        item.isOvertimeAllowRest = (+item.isOvertimeAllowRest) + "";
                        item.holidayValidity = (+item.holidayValidity) + "";
                    })
                } else {
                    v.rules = [{
                        "holidayValidity": -1,
                        "isOvertimeAllowRest": "0",
                        "attendanceLockId": 0
                    }];
                }
                v.isOvertimeAllowRest = 0 + v.isOvertimeAllowRest + "";
            });
            workDayHolidayRules = JSON.parse(JSON.stringify($scope.workDayHolidayRules));
            $scope.workDayNoData = !$scope.workDayHolidayRules.length;
            $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
        })
    }
    function search() {
        $scope.isEdite = false;
        if ($scope.tab) {
            setTimeout(function () {
                if ($scope.isO == 1) {
                    getHolidayRule();
                } else {
                    getNotOHolidayRule();
                }
            }, 0);
        } else {
            getWorkdayHolidayRule();
        }
        commonService.storageSearchStatus($scope);
    }

    function editeHolidayRuleSetting(rowform) {
        if (!$scope.isEdite) {
            rowform.$show();
            $scope.isEdite = true;
        }
    }

    function saveHolidayRuleSetting(item) {
        var params = {};
        $timeout(function () {
            params.regionId = +item.regionId;
            params.workjobId = item.workjobId;
            params.validMonths = 0;
            params.rules = item.rules;
            var configTip = {
                "title": "请确认",
                "icon": "f",
                "content": "原规则生效周期从" + $scope.cacheAttendance + "，现在修改为" + getAttendanceNameById(item.rules[item.rules.length - 1].takeEffectAttendanceId) + ",是否确认？",
                "callback": function () {
                    ohrss.saveHolidayRuleSetting(params).then(function (result) {
                        if (result.status != "success") {
                            commonService.alert({
                                content: '保存失败！',
                                icon: "fa-exclamation-circle",
                                iconColor: "icon-red"
                            });
                        }
                        search();
                        $scope.cacheAttendance = "";
                    });
                },
                "cancel": function () {
                    removeTempRule();
                }
            };

            if (!$scope.cacheAttendance || (item.rules.length == 2 && $scope.cacheAttendance.indexOf(getAttendanceNameById(item.rules[1].takeEffectAttendanceId)) > -1)) {
                ohrss.saveHolidayRuleSetting(params).then(function (result) {
                    if (result.status != "success") {
                        commonService.alert({
                            content: '保存失败！',
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                    search();
                    $scope.cacheAttendance = "";
                });
            } else {
                commonService.confirm(configTip);
            }
        }, 100);
    }

    function getAttendanceNameById(id) {
        var result = "";
        angular.forEach($scope.takeEffectAttendanceList, function (s) {
            if (id == s.attendance_lock_id) {
                result = s.name
            }
        });
        return result;
    }

    function checkData(data) {
        if (data != 0 && !data) {
            return "必选项";
        }
    }
    function removeTempRule() {
        $("body").trigger("click");
        $scope.isEdite = false;
        $scope.holidayRuleSetting = JSON.parse(JSON.stringify(holidayRuleSetting));
    }

    function addWorkDayHolidayRules(item) {
        if (item && item.length >= 12) {
            return;
        }
        item.push({
            "attendanceLockId": [],
            "holidayValidity": 0,
            "isOvertimeAllowRest": "0"
        })
    }
    function removeWorkDayTempRule() {
        $("body").trigger("click");
        $scope.isEdite = false;
        $scope.workDayHolidayRules = JSON.parse(JSON.stringify(workDayHolidayRules));
    }

    function removeNotORule() {
        $("body").trigger("click");
        $scope.isEdite = false;
        $scope.notOHolidayRuleSetting = JSON.parse(JSON.stringify(notOHolidayRuleSetting));
    }
    function checkWWorkHoursRule(data) {
        if (data != 0 && !data) {
            return "不能为空!";
        }
    }
}]);

(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('overallHolidayRuleDetailController', overallHolidayRuleDetailController);

    overallHolidayRuleDetailController.$inject = ['$scope', '$modalInstance', 'regionId', '$http'];

    function overallHolidayRuleDetailController($scope, $modalInstance, regionId, $http) {
        $http
            .get(apiBaseUrl + '/integrate-holiday-rule-setting/region-ids/history', {
                params: {
                    regionId: regionId
                }
            })
            .then(function (result) {
                console.log(result);
                $scope.items = result.data.data;
            },errorHandle);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function errorHandle(){

        }
    }
})();

(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('overallHolidayMonthlyRuleDetailController', overallHolidayMonthlyRuleDetailController);

    overallHolidayMonthlyRuleDetailController.$inject = ['$scope', '$modalInstance', 'data', '$http'];

    function overallHolidayMonthlyRuleDetailController($scope, $modalInstance, data, $http) {
        $http
            .get(apiBaseUrl + '/integrate-holiday-monthly-rules/history', {
                params: data
            })
            .then(function (result) {
                console.log(result);
                $scope.items = result.data.data;
            },errorHandle);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function errorHandle(){

        }
    }
})();

(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('notOperationOverallHolidayMonthlyRuleDetailController', notOperationOverallHolidayMonthlyRuleDetailController);

    notOperationOverallHolidayMonthlyRuleDetailController.$inject = ['$scope', '$modalInstance', 'data', '$http'];

    function notOperationOverallHolidayMonthlyRuleDetailController($scope, $modalInstance, data, $http) {
        $http
            .get(apiBaseUrl + '/holiday-rules/monthly/comprehensive/history', {
                params: data
            })
            .then(function (result) {
                console.log(result);
                $scope.items = result.data.data;
            },errorHandle);

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function errorHandle(){

        }
    }
})();