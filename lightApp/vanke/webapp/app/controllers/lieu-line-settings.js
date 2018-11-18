/**
 * Created by deepsky on 2017/3/15.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('LieuLineController', LieuLineController);

    LieuLineController.$inject = ['$rootScope', '$scope', 'LieuLineSettingService', 'CommonService', 'UserService', '$timeout'];

    function LieuLineController($rootScope, $scope, LieuLineSettingService, CommonService, userService, $timeout) {
        var llc = this, lieuLineList, lieuLineNotOList;
        $timeout(function () {
            $('.vk-nowrap').append($("#backss"));
        }, 100);
        $scope.isEdite = false;
        $scope.search = search;
        $scope.tab = tab;
        $scope.validateData = validateData;
        $scope.validateAttendance = validateAttendance;
        $scope.save = save;
        $scope.saveNotO = saveNotO;
        $scope.checkDetail = checkDetail;
        $scope.takeEffectAttendanceList = [];
        $scope.isReduce = false;
        $scope.changeWDays = changeWDays;
        $scope.openLieuLineDetail = openLieuLineDetail;
        $scope.openNotOperationLieuLineDetail = openNotOperationLieuLineDetail;
        getAttendanceList();
        $scope.showEffectAttendance = showEffectAttendance;
        $scope.loadAttendance = loadAttendance;
        $scope.addLieuLineRule = addLieuLineRule;
        $scope.delRule = delRule;
        $scope.addLieuLineNotORules = addLieuLineNotORules;
        $scope.cancelRule = cancelRule;
        $scope.cancelNotORule = cancelNotORule;
        $scope.isCheck = true;
        $scope.isO = 1;
        $scope.editeLieuLineList = editeLieuLineList;
        $scope.changeAttendance = changeAttendance;
        function cancelRule() {
            $scope.isEdite = false;
            $("body").trigger("click");
            llc.lieuLineList = JSON.parse(JSON.stringify(lieuLineList));
        }
        function editeLieuLineList (form) {
            $scope.isEdite = true;
            form.$show();
        }
        function cancelNotORule() {
            $scope.isEdite = false;
            $("body").trigger("click");
            llc.lieuLineNotOList = JSON.parse(JSON.stringify(lieuLineNotOList));
        }
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
        CommonService
            .getCityCompany()
            .then(function (response) {
                $scope.cityCompanies = response;
                $timeout(function () {
                    $("#select-city-company").selectpicker("refresh");
                }, 0);
            });

        function addLieuLineRule(item) {
            if (item.length > 1) {
                if (!$scope.showEffectAttendance(item[1].attendanceLockId)) {
                    item[1].attendanceLockId = 0;
                }
            } else {
                item[0].attendanceLockId = 0;
            }
            if (item && item.length >= 2) {
                return;
            }
            if (item[0].id == null) return;
            item.push({
                "validMonths": "本考勤周期",
                "oaDays": 0,
                "obDays": 0,
                "ocDays": 0,
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

        function addLieuLineNotORules(item) {
            if (item && item.length >= 2) {
                return;
            }
            if (item[0].id == null) return;
            item.push({
                "dutyDays": 0,
                "period": 0,
                "periodText": "本考勤周期",
                "takeEffectAttendanceId": [],
                "takeEffectAttendance": ""
            })
        }

        function delRule(item, index) {
            $("body").trigger("click");
            item.length > 1 && item.splice(index, 1);
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

        function getAttendanceList() {
            CommonService.getOldEffectAttendanceList()
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
        function changeWDays (newValue, oldValue) {
            if (newValue && oldValue && newValue < oldValue) {
                $scope.isReduce = true;
            } else {
                $scope.isReduce = false;
            }
        }
        function checkDetail(detail) {
            if (detail) {
                CommonService.createModal({
                    'templateUrl': 'holidayRuleSettingModal.html',
                    'controller': 'holidayRuleSettingModalController',
                    'windowClass': 'experience-size',
                    'resolve': {
                        detail: function () {
                            return detail
                        }
                    }
                });
            }
        }

        function openLieuLineDetail(regionId,workjobId){
            CommonService.createModal({
                'templateUrl': 'lieuLineDetailModal.html',
                'controller': 'lieuLineDetailController',
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

        function openNotOperationLieuLineDetail(regionId,workjobId){
            CommonService.createModal({
                'templateUrl': 'notOperationLieuLineDetailModal.html',
                'controller': 'notOperationLieuLineDetailController',
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
        function showEffectAttendance(effectAttendanceIds) {
            effectAttendanceIds = [effectAttendanceIds] || [];
            var selected = [];
            angular.forEach($scope.takeEffectAttendanceList, function (s) {
                if (effectAttendanceIds.indexOf(s.attendance_lock_id) >= 0) {
                    selected.push(s.startDate);
                    selected.push(s.endDate);
                }
            });
            return selected.length ? CommonService.cancatEffectAttendance(selected) : effectAttendanceIds.takeEffectAttendance;
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
                    return r1.takeEffectAttendanceId[0] > r2.takeEffectAttendanceId[0]
                });
                list.rules.unshift(temp[0]);
            });
        }
        function search () {
            var windowH = $(window).height() - 320;
            setTimeout(function () {
                if ($scope.isO == 1) {
                    LieuLineSettingService
                        .getLieuLineList(getParams())
                        .then(function (res) {
                            $("#isoTable").height(windowH);
                            llc.lieuLineList = res.data || [];
                            sortList(llc.lieuLineList);
                            lieuLineList = JSON.parse(JSON.stringify(llc.lieuLineList || []));
                            $scope.noData = !llc.lieuLineList.length;
                            $scope.totalPage = Math.ceil(res.recordsTotal / $scope.page);
                            $scope.isEdite = false;
                        })
                } else {
                    LieuLineSettingService
                        .getLieuLineNotOList(getParams())
                        .then(function (res) {
                            $("#isoTable").height(windowH);
                            llc.lieuLineNotOList = res.data || [];
                            sortList(llc.lieuLineNotOList);
                            lieuLineNotOList = JSON.parse(JSON.stringify(llc.lieuLineNotOList || []))
                            $scope.noData = !llc.lieuLineNotOList.length;
                            $scope.totalPage = Math.ceil(res.recordsTotal / $scope.page);
                            $scope.isEdite = false;
                        })
                }
            }, 0);
            CommonService.storageSearchStatus($scope);
        }
        function getParams () {
            var selectedStandardWorkJobs = $scope.selectedStandardWorkJobs || [];

            if (selectedStandardWorkJobs.length == 0) {
                selectedStandardWorkJobs = $scope.standardWorkJobs;
            }
            return {
                "search[value]": {
                    "regionIds": _.pluck($scope.selectedCityCompanies, 'regionId'),
                    "workjobIds": _.pluck(selectedStandardWorkJobs, 'workJobId')
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }

        function validateData(data) {
            var reg = /^([0-9]|10)$/;
            if (!reg.test(data)) {
                return ("请输入0~10之间的整数！");
            }
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
        function tab(id, type) {
            if (type) {
                window.location = '#/holiday-rule-setting?check=1&tab=' + id
            } else {
                window.location = '#/holiday-rule-setting?tab=' + id
            }
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

        function saveNotO(item) {
            var params = {};
            params.rules = item.rules;
            params.regionId = item.regionId;
            params.workjobId = item.workjobId;
            var config = {
                "title": "请确认",
                "icon": "f",
                "content": "原规则生效周期从" + $scope.cacheAttendance + "，现在修改为" + getAttendanceNameById(item.rules[item.rules.length - 1].takeEffectAttendanceId) + ",是否确认？",
                "callback": function () {
                    LieuLineSettingService.saveNotO(params)
                        .then(function (result) {
                            if (result.status != "success" && result.errorCode == "10001") {
                                CommonService.alert({
                                    content: "每月值班天数设置有误，请检查设置",
                                    icon: "fa-exclamation-circle",
                                    iconColor: "icon-red"
                                });
                            }
                            search();
                            $scope.cacheAttendance = "";
                        });
                },
                "cancel": function () {
                    cancelNotORule();
                }
            };
            if (!$scope.cacheAttendance || (item.rules.length == 2 && $scope.cacheAttendance.indexOf(getAttendanceNameById(item.rules[1].takeEffectAttendanceId)) > -1)) {
                LieuLineSettingService.saveNotO(params)
                    .then(function (result) {
                        if (result.status != "success" && result.errorCode == "10001") {
                            CommonService.alert({
                                content: "每月值班天数设置有误，请检查设置",
                                icon: "fa-exclamation-circle",
                                iconColor: "icon-red"
                            });
                        }
                        search();
                        $scope.cacheAttendance = "";
                    });
            } else {
                CommonService.confirm(config);
            }
        }

        function changeAttendance(rule, data) {
            $scope.cacheAttendance = rule.takeEffectAttendance;
            rule.takeEffectAttendanceId = data;
        }

        function save(item, form) {
            var params = {};
            params.rules = item.rules;
            params.regionId = item.regionId;
            params.workjobId = item.workjobId;
            var config = {
                "title": "提示",
                "icon": "fa-exclamation-circle",
                "content": "减少" + item.company + item.workjob + "O序列员工月休额度后，会对生效周期后已多排的月休排班记录进行清除，请通知项目HR进行重新排班。",
                "callback": function () {
                    if (!$scope.cacheAttendance || (item.rules.length == 2 && $scope.cacheAttendance.indexOf(getAttendanceNameById(item.rules[1].takeEffectAttendanceId)) > -1)) {
                        LieuLineSettingService.save(params)
                            .then(function () {
                                search();
                                $scope.cacheAttendance = "";
                                $scope.isReduce = false;
                            });
                    } else {
                        CommonService.confirm(configTip);
                    }
                },
                "cancel": function () {
                    llc.lieuLineList = JSON.parse(JSON.stringify(lieuLineList));
                    $scope.isEdite = false;
                }
            };

            var configTip = {
                "title": "请确认",
                "icon": "f",
                "content": "原规则生效周期从" + $scope.cacheAttendance + "，现在修改为" + getAttendanceNameById(item.rules[item.rules.length - 1].takeEffectAttendanceId) + ",是否确认？",
                "callback": function () {
                    LieuLineSettingService.save(params)
                        .then(function(){
                            search();
                            $scope.cacheAttendance = "";
                            $scope.isReduce = false;
                        });
                },
                "cancel": function () {
                    llc.lieuLineList = JSON.parse(JSON.stringify(lieuLineList));
                    $scope.isEdite = false;
                }
            };
            if ($scope.isReduce) {
                CommonService.confirm(config);
                return;
            }
            if (!$scope.cacheAttendance || (item.rules.length == 2 && $scope.cacheAttendance.indexOf(getAttendanceNameById(item.rules[1].takeEffectAttendanceId)) > -1)) {
                LieuLineSettingService.save(params)
                    .then(function () {
                        search();
                        $scope.cacheAttendance = "";
                        $scope.isReduce = false;
                    });
            } else {
                CommonService.confirm(configTip);
            }
        }


    }
})();

(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('lieuLineDetailController', lieuLineDetailController);

    lieuLineDetailController.$inject = ['$scope', '$modalInstance', 'data', '$http'];

    function lieuLineDetailController($scope, $modalInstance, data, $http) {
        $http
            .get(apiBaseUrl + '/holiday-monthly-rules/history', {
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
VkrmsApp.directive('showSelectpicker', ['$filter', 'safeApply', function ($filter, safeApply) {
    return {
        restrict: "A",
        scope: {
            selectDown: "&selectDown"
        },
        link: link
    };
    function link(scope, element, attrs) {
        $(element).on("show.bs.select", scope.selectDown);
    }
}]);

(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('notOperationLieuLineDetailController', notOperationLieuLineDetailController);

    notOperationLieuLineDetailController.$inject = ['$scope', '$modalInstance', 'data', '$http'];

    function notOperationLieuLineDetailController($scope, $modalInstance, data, $http) {
        $http
            .get(apiBaseUrl + '/holiday-rules/monthly/standard/history', {
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