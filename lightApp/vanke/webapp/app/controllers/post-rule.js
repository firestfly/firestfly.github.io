'use strict';

VkrmsApp.controller('PostRuleController', ['$scope', '$filter', '$http', '$timeout', 'CommonService', 'PostRuleService', function ($scope, $filter, $http, $timeout, commonService, postRuleService) {
    $scope.title = "万科资源管理信息系统 - 岗位设置";
    commonService.applySearchStatus($scope);
    $scope.commonSearchBarConfig = {
        companySelecterLabel: "公司/管理中心",
        departmentSelecterLabel: "部门/服务中心",
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false
    };
    var postId = $scope.postId;
    var datePartern = /^\d{2}-\d{2}$/;
    var daysArr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var shifts = [];
    var shiftsId = [];
    $scope.dateTimeArr = [];

    $scope.addDateTime = addDateTime;
    function addDateTime() {
        var dateTimeModal = commonService.createModal({
            'templateUrl': 'addSuitDateTime.html',
            'controller': 'AddSuitDateTimeController',
            'size': 'sm',
            'resolve': {
                'dateTimeArr': function () {
                    return $scope.dateTimeArr;
                }
            }
        });
        dateTimeModal.result.then(function (result) {
            $scope.dateTimeArr.push(result);
            $timeout(function () {
                $("select").selectpicker("refresh");
            }, 0)
        }, function (dismiss) {
        });
    }
    $scope.loadGroups = function (inBody) {
        var config = {
            selectedTextFormat: "count > 1",
            // dropupAuto: false,
            noneSelectedText: "请选择",
            liveSearch: true,
            actionsBox: true,
            width: "100%"
        };
        if (inBody) {
            config.container = "body";
        }
        $("select").selectpicker(config);
        setTimeout(function () {
            $("select").selectpicker("refresh");
        }, 100);
    };
    $scope.days = postRuleService.getDays();
    var initTimeRules, isEdite;
    getPostRule();
    getShifts();

    function getShifts() {
        postRuleService.getDepartmentShifts($scope.departmentId).then(function (result) {
            var indexs;
            shifts = result.shifts || [];
            indexs = getDeleteIndexs(shifts);
            indexs.forEach(function (item, index, arr) {
                shifts.splice(item, 1);
            });
            $scope.shifts = [];
            shifts.forEach(function (item, index, arr) {
                var labelConcat;
                if (item.relateShift) {
                    labelConcat = item.label + '+' + item.relateShift.label;
                    labelConcat += ' (' + item.onDutyTime.slice(0, -3) + '-' + item.relateShift.offDutyTime.slice(0, -3) + ')';
                } else {
                    labelConcat = item.label;
                    labelConcat += ' (' + item.onDutyTime.slice(0, -3) + '-' + item.offDutyTime.slice(0, -3) + ')';
                }
                $scope.shifts.push({
                    id: item.id,
                    label: labelConcat
                });
            });
            $scope.showLabel = function (postRule) {
                var selected = [];
                angular.forEach(shifts, function (s) {
                    if (postRule.shiftIds[0] == s.id) {
                        var label, duration;
                        if (s.relateShift) {
                            label = s.label + '+' + s.relateShift.label;
                            duration = ' (' + s.onDutyTime.slice(0, -3) + '-' + s.relateShift.offDutyTime.slice(0, -3) + ')';
                        } else {
                            label = s.label;
                            duration = ' (' + s.onDutyTime.slice(0, -3) + '-' + s.offDutyTime.slice(0, -3) + ')';
                        }
                        selected.push(label + duration);
                    }
                });
                return selected.length ? selected.join(', ') : '';
            };

        })
    }

    function getDeleteIndexs(shifts) {
        var indexs = [];
        shifts.forEach(function (item, index, arr) {
            var result = getRelatedShiftIndex(item, index, arr);
            if (result) {
                indexs.push(index);
            }
        });
        return indexs.reverse();
    }
    function getRelatedShiftIndex(shift, index, arr) {
        var result = arr.some(function (item) {
            if (item.relateShift){
                return item.relateShift.id == shift.id
            }
        });
        return result;
    }

    function getPostRule() {
        postRuleService.getRule(postId).then(function (result) {
            initTimeRules = angular.copy(result.timeRules || []);
            $scope.postRules = result.timeRules || [];
            $scope.jobIds = result.jobIds || [];
            $scope.noData = !$scope.postRules.length;
            getStandardJobs();
        }).then(function (result) {
            $scope.postRules.sort(function (obj1, obj2) {
                return obj1.startTime > obj2.startTime ? 1 : -1;
            });
            angular.forEach($scope.postRules, function (v) {
                var text;
                var hasSome = false;
                if (!v.startTime || !v.endTime) {
                    return;
                }
                angular.forEach($scope.dateTimeArr, function (date) {
                    if (date.startTime == v.startTime && date.endTime == v.endTime) {
                        hasSome = true;
                    }
                });
                if (!hasSome) {
                    text = v.startTime.replace(/-/, "月") + "日-" + v.endTime.replace(/-/, "月") + "日";
                    $scope.dateTimeArr.push({
                        startTime: v.startTime,
                        endTime: v.endTime,
                        text: text
                    })
                }
            });
        });
    }

    function getStandardJobs() {
        var params = {
            departments: [$scope.departmentId]
        };
        commonService.getWorkJob(params).then(function (standardJobs) {
            $scope.standardJobs = standardJobs;
            if (!($scope.jobIds && $scope.jobIds.length > 0)) {
                $scope.jobform.$show();
            }
            $scope.showStandardJobs = function () {
                var selected = [];
                angular.forEach($scope.standardJobs, function (s) {
                    if ($scope.jobIds.indexOf(s.workJobId) >= 0) {
                        selected.push(s.workJobName);
                    }
                });
                return selected.length ? selected : [];
            };
        });
    }
    $scope.showSuitDateTime = function (postRule) {
        if (postRule.startTime && postRule.endTime) {
            return postRule.startTime.replace(/-/, "月") + "日-" + postRule.endTime.replace(/-/, "月") + "日";
        } else {
            return "";
        }
    };
    $scope.showDays = function (postRule) {
        var selected = [];
        angular.forEach($scope.days, function (s) {
            if (postRule.timeTypes[0] == s.id) {
                selected.push(s.name);
            }
        });
        return selected.length ? selected.join(', ') : '';
    };

    $scope.saveJobs = function () {
        var param;
        setTimeout(function () {
            param = {
                postId: postId,
                jobIds: $scope.jobIds
            }
            postRuleService.saveJobs(param);
        }, 0);
    };
    function getEndTime(startTime) {
        var result;
        angular.forEach($scope.dateTimeArr, function (v) {
            if (v.startTime == startTime) {
                result = v.endTime;
            }
        })
        return result;
    }
    $scope.savePostRule = function (data, index, form) {
        var postRule = $scope.postRules[index];
        var id = postRule.shiftIds[0];
        setTimeout(function () {
            var item = $scope.postRules[index];
            for (var i = 0, len = $scope.postRules.length; i < len; i++) {
                var j = $scope.postRules[i];
                if (index != i && item.shiftIds[0] == j.shiftIds[0] && item.timeTypes[0] == j.timeTypes[0] && item.startTime == j.startTime) {
                    commonService.alert({
                        content: '上岗规则不能重复！',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                    form.$show();
                    shiftsId = [];
                    return;
                }
            }
            $.extend(data, {
                postId: postId,
                shiftIds: shiftsId,
                timeTypes: postRule.timeTypes,
                startTime: postRule.startTime,
                endTime: getEndTime(postRule.startTime)
            });
            shiftsId = [];
            if (!$scope.inserted) {
                // 修改上岗时间规则
                $.extend(data, { postTimeRuleId: postRule.postTimeRuleId });
                postRuleService.editeRule(data).then(function (result) {
                    if (result.errorMessage) {
                        commonService.alert({
                            content: result.errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                    isEdite = false;
                    getPostRule();
                });
            } else {
                // 增加上岗时间规则
                postRuleService.addRule(data).then(function (result) {
                    if (result.errorMessage) {
                        commonService.alert({
                            content: result.errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                    postRule.postTimeRuleId = result.data;
                    isEdite = false;
                    getPostRule();
                });
                $scope.inserted = null;
            }
        }, 100);
    };

    $scope.editeRule = function (form) {
        if (!isEdite) {
            form.$show();
        } else {
            commonService.alert({
                content: '请先保存后再修改！',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }
        isEdite = true;
    };
    $scope.removePostRule = function (index, postTimeRuleId) {
        var config = {
            "title": "删除提示",
            "icon": "fa-exclamation-circle",
            "content": "您确认删除此条上岗时间规则吗？",
            "callback": function () {
                postRuleService.delRule(postTimeRuleId).then(function () {
                    getPostRule();
                });
            }
        };
        commonService.confirm(config);
    };

    $scope.addPostRule = function () {
        if ($scope.inserted || isEdite) {
            return;
        }
        if (!$scope.shifts.length) {
            commonService.alert({
                content: '请先设置好当前项目组班次！',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        if (!$scope.dateTimeArr.length) {
            commonService.alert({
                content: '请先设置好适用日期！',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        $scope.inserted = {
            shiftIds: [$scope.shifts[0].id],
            postNumber: 1,
            remark: "",
            timeTypes: [0],
            startTime: $scope.dateTimeArr[0].startTime
        };
        $scope.postRules.push($scope.inserted);
        $timeout(function () {
            $scope.shown = $scope.inserted;
            $('.table-bordered tr:last-child').find(".vk-btn-health").trigger('click');
        }, 10);
    };

    $scope.removeTempPostRule = function () {
        // 解决编辑状态点击取消后，下拉框未消失的bug
        $("body").trigger("click");
        isEdite = false;
        if (!$scope.inserted) {
            $scope.postRules = angular.copy(initTimeRules);
            return;
        }
        $scope.inserted = null;
        $scope.postRules.splice($scope.postRules.length - 1, 1);
    };
    $scope.checkLabel = function (data) {
        if (!data || data.length == 0) {
            return "请至少选择一个班次!";
        }
        shiftsId.push(data)
        shifts.some(function (item, index, arr) {
            if (item.relateShift) {
                if (item.id == data) {
                    shiftsId.push(item.relateShift.id);
                    return true;
                }
            }
        });
    };
    $scope.checkDateTime = function (data) {
        if (!data) {
            return "请选择适用日期!";
        }
    };
    $scope.checkStartTime = function (data) {
        if (!data) {
            return "请输入开始时间!";
        }
        if (!datePartern.test(data)) {
            return "日期格式如01-01!";
        }
        var arr = data.split("-");
        var month = Number(arr[0])
        if (month > 12 || month <= 0) {
            return "月份输入有误"
        }
        if (Number(arr[1]) > daysArr[month - 1] || Number(arr[1]) <= 0) {
            return "当月天数范围为01~" + daysArr[month - 1]
        }
    };
    $scope.checkDate = function (data) {
        if (data !== 0 && !data || data.length == 0) {
            return "请至少选择一个适用时间!";
        }
    };
    $scope.checkPostNumber = function (data) {
        if (isNaN(data) || data <= 0) {
            return "在岗人数请输入大于0的数值!";
        }
    };
}]);

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('AddSuitDateTimeController', AddSuitDateTimeController);

    AddSuitDateTimeController.$inject = ['$scope', '$modalInstance', 'CommonService', 'dateTimeArr'];

    function AddSuitDateTimeController($scope, $modalInstance, CommonService, dateTimeArr) {
        var daysArr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (dateTimeArr.length) {

        }
        var validDateTime = function (dateTime) {
            var dateTime = dateTime.split("-");
            if (+dateTime[0] > 12) {
                return "月份填写有误";
            }
            if (+dateTime[1] > daysArr[+dateTime[0] - 1]) {
                return +dateTime[0] + "月份最多有" + daysArr[+dateTime[0] - 1] + "天";
            }
            return false;
        };
        $scope.reg = /^\d{2}-\d{2}$/;
        $scope.ok = function () {
            if ($scope.modalform.$invalid) {
                return;
            }
            if (!$scope.startTime || !$scope.endTime) {
                CommonService.alert({
                    content: '开始时间和结束时间不能为空!',
                    icon: "fa-exclamation-circle"
                });
                return;
            }
            var checkStartTime = validDateTime($scope.startTime);
            var checkEndTime = validDateTime($scope.endTime);
            if (checkStartTime) {
                CommonService.alert({
                    content: '开始时间' + checkStartTime,
                    icon: "fa-exclamation-circle"
                });
                return;
            }
            if (checkEndTime) {
                CommonService.alert({
                    content: '结束时间' + checkEndTime,
                    icon: "fa-exclamation-circle"
                });
                return;
            }
            if ($scope.startTime > $scope.endTime) {
                CommonService.alert({
                    content: '开始时间不能大于结束时间',
                    icon: "fa-exclamation-circle"
                });
                return;
            }
            var hasOverlap;
            for (var i = 0, l = dateTimeArr.length; i < l; i++) {
                if (!($scope.endTime < dateTimeArr[i].startTime || dateTimeArr[i].endTime < $scope.startTime)) {
                    hasOverlap = true;
                    break;
                }
            }
            if (hasOverlap) {
                CommonService.alert({
                    content: '时间段有重叠',
                    icon: "fa-exclamation-circle"
                });
                return;
            }
            $modalInstance.close({
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                text: $scope.startTime.replace(/-/, "月") + "日-" + $scope.endTime.replace(/-/, "月") + "日"
            });
        };

        $scope.cancle = function () {
            $modalInstance.dismiss('cancel');
        };
    }

})();