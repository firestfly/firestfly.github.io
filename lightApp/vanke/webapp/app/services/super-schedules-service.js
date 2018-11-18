/**
 * Created by wangq34 on 2016/5/12.
 */

(function () {

    'use strict';

    angular
        .module('vkrmsApp')
        .factory('SuperScheduleService', SuperScheduleService);

    SuperScheduleService.$inject = ['$q', '$http', '$filter', 'CommonService'];

    function SuperScheduleService($q, $http, $filter, commonService) {

        var service = {
            regularType: regularType,
            getSchedules: getSchedules,
            getShiftsFromServer: getShiftsFromServer,
            getPostOptionsFromServer: getPostOptionsFromServer,
            getShiftsFromPost: getShiftsFromPost,
            getLieuLeaveBalance: getLieuLeaveBalance,
            getHolidayMonthly: getHolidayMonthly,
            getDateStr: getDateStr,
            copyPreviousFail: copyPreviousFail,
            getEmptySchedule: getEmptySchedule,
            holidayTypes: holidayTypes,
            getEmptyCopySchedule: getEmptyCopySchedule,
            getTimeDuration: getTimeDuration,
            regularTypeToOvertime: regularTypeToOvertime,
            timelineOptions: timelineOptions,
            extendTime: extendTime,
            filterOvertimeSchedules: filterOvertimeSchedules,
            holidayTypeList: holidayTypeList,
            autoFillRegularType: autoFillRegularType,
            autoFillOvertimeType: autoFillOvertimeType,
            getCacheExtend: getCacheExtend,
            buildOvertimeSchedules: buildOvertimeSchedules,
            getDayCheck: getDayCheck,
            isCrossDay: isCrossDay,
            jobDuration: jobDuration,
            exportScheduleFromPost: exportScheduleFromPost,
            exportScheduleFromEmployee: exportScheduleFromEmployee,
            isShowAdjustTime: isShowAdjustTime,
            setCurrentLine: setCurrentLine,
            oneOffHolidayUnitDays: oneOffHolidayUnitDays
        };

        return service;

        function exportScheduleFromPost(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/file/export-schedule-post", {
                    params: {search: params}
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function exportScheduleFromEmployee(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/file/export-schedule-employee", {
                    params: {search: params}
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }


        function getLieuLeaveBalance(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/get-lieu-leave-balance", {
                    params: params
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getHolidayMonthly(obj) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/vacation-balance/monthly/" + obj.employeeId + '?onDutyDay=' + obj.onDutyDay)
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function regularType(id) {
            var str = null;
            switch (id) {
                case 0:
                    str = ['REGULAR_ONE', 'REGULAR_TWO', 'REGULAR_THREE', 'REGULAR_FOUR', 'REGULAR_FIVE'];
                    break;
                case 2:
                    str = ['DUTY_MANAGER_DUTY_ONE', 'DUTY_MANAGER_DUTY_TWO', 'DUTY_MANAGER_DUTY_THREE'];
                    break;
                case 3:
                    str = ['DUTY_REPAIR_NIGHT_ONE', 'DUTY_REPAIR_NIGHT_TWO', 'DUTY_REPAIR_NIGHT_THREE'];
                    break;
                case 4:
                    str = ['DUTY_OTHER_NIGHT_ONE', 'DUTY_OTHER_NIGHT_TWO', 'DUTY_OTHER_NIGHT_THREE'];
                    break;
                case 5:
                    str = ['DUTY_REPAIR_GENERAL_ONE', 'DUTY_REPAIR_GENERAL_TWO', 'DUTY_REPAIR_GENERAL_THREE'];
                default:
                    break;
            }
            return str;
        }

        function overtimeRegular() {
            var str = [
                'OVERTIME_FRAGMENT_ONE',
                'OVERTIME_FRAGMENT_TWO',
                'OVERTIME_FRAGMENT_THREE',
                'OVERTIME_FRAGMENT_FOUR',
                'OVERTIME_FRAGMENT_FIVE',
                'OVERTIME_FIXED_OVERTIME_ONE',
                'OVERTIME_FIXED_OVERTIME_TWO',
                'OVERTIME_FIXED_OVERTIME_THREE',
                'OVERTIME_FIXED_OVERTIME_FOUR',
                'OVERTIME_FIXED_OVERTIME_FIVE'];
            return str;
        }

        function regularTypeToOvertime(obj, extend) {
            if (extend == 'before') {
                return 'OVERTIME_' + obj + '_BEFORESHIFT';
            } else if (extend == 'after') {
                return 'OVERTIME_' + obj + '_AFTERSHIFT';
            }
        }

        function getSchedules(params) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + "/new-schedule-sheet", {
                    params: params
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        function getPostOptionsFromServer(departmentId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/new-department-post-collect/" + departmentId)
                .success(function (fixedPosts) {
                    deferred.resolve(fixedPosts);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getShiftsFromPost(Did, JobId, pId, date) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/post-to-shifts/" + Did + '/' + JobId + '/' + pId + '/' + date)
                .success(function (shifts) {
                    deferred.resolve(shifts);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getShiftsFromServer(departmentId) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + "/view-switch-shift", departmentId)
                .success(function (shifts) {
                    deferred.resolve(shifts);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function holidayTypes() {
            return [
                {code: 'HOLIDAY_PAY_ANNUAL', name: '额外带薪年休假', oneOff: false},
                {code: 'HOLIDAY_STATUTORY_ANNUAL', name: '法定年休假', oneOff: false},
                {code: 'HOLIDAY_ADJUSTABLE', name: '调休假', oneOff: false},
                {code: 'HOLIDAY_SPRING_FESTIVAL', name: '春节调休假', oneOff: false},
                {code: 'HOLIDAY_CARRY_OVER', name: '结转年休假', oneOff: false},
                {code: 'HOLIDAY_MARRIAGE', name: '婚假', oneOff: true},
                {code: 'HOLIDAY_FUNERAL', name: '丧假', oneOff: true},
                {code: 'HOLIDAY_MATERNITY', name: '产假', oneOff: true},
                {code: 'HOLIDAY_NURSING', name: '护理假', oneOff: true},
                {code: 'HOLIDAY_CONTRACEPTION', name: '节育假', oneOff: true},
                {code: 'HOLIDAY_FAMILY_PLANNING', name: '计划生育假', oneOff: true},
                {code: 'HOLIDAY_ORDINARY_SICK', name: '普通病假或医疗期外', oneOff: true},
                {code: 'HOLIDAY_STATUTORY_SICK', name: '法定病假医疗期', oneOff: true},
                {code: 'HOLIDAY_INDUSTRIAL_INJURY', name: '法定工伤医疗期', oneOff: true},
                {code: 'HOLIDAY_PRIVATE_AFFAIR', name: '事假', oneOff: false},
                {code: 'HOLIDAY_OTHER_PAY', name: '其他带薪假', oneOff: true},
                {code: 'HOLIDAY_DAY_RELEASE', name: '脱产学习假', oneOff: false},
                {code: 'HOLIDAY_HOME', name: '探亲假', oneOff: false},
                {code: 'HOLIDAY_REST', name: '历史休假', oneOff: false},
                {code: 'HOLIDAY_ALTERNATE_HOLIDAY', name: '月休'},
                {code: 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE', name: '做2休1/做1休1'},
                {code: 'GOOUT_TRIP', name: '外勤'},
                {code: 'GOOUT_EVENCTION', name: '出差'}
            ]
        }

        // 一次性取假，且以天为单位的休假类型
        function oneOffHolidayUnitDays() {
            return [
                {code: 'HOLIDAY_MARRIAGE', name: '婚假'},
                {code: 'HOLIDAY_FUNERAL', name: '丧假'},
                {code: 'HOLIDAY_MATERNITY', name: '产假'},
                {code: 'HOLIDAY_NURSING', name: '护理假'},
                {code: 'HOLIDAY_CONTRACEPTION', name: '节育假'}
            ]
        }

        function holidayTypeList(type) {
            var str = holidayTypes();
            var result = null;
            switch (type) {
                case 'goOut':
                    result = str.slice(21);
                    break;
                case 'rest':
                    result = str.slice(19, 21);
                    break;
                case 'oneOff':
                    result = [];
                    angular.forEach(str, function (item) {
                        if (item.oneOff) {
                            result.push(item)
                        }
                    });
                    break;
                default:
                    result = filierHoliday(str.slice(0, 18));
                    break;
            }
            return result;
        }

        function filierHoliday(data) {
            var result = []
            angular.forEach(data, function (item) {
                // 去掉计划生育假
                if (item.code !== 'HOLIDAY_FAMILY_PLANNING') {
                    result.push(item);
                }
            })
            return result;
        }

        //day---基准天    addDayCount---与基准天相差的天数，例如：-1前一天，1后一天
        function getDateStr(day, addDayCount) {
            var result;
            var dateArr = new Date(day.replace(/-/g, "/"));
            result = $filter('date')(dateArr.setDate(dateArr.getDate() + addDayCount), 'yyyy-MM-dd');
            return result;
        }

        function getEmptySchedule(object, day) {
            var emptyShift = {
                "id": null,
                "employeeId": object.employeeId || null,
                "departmentId": object.departmentId || null,
                "sapId": object.sapId || null,
                "name": object.name || null,
                "onDutyDay": $filter('date')(day.date, 'yyyy-MM-dd'),
                "regularSchedules": null,
                "overtimeSchedules": null,
                "holidaySchedules": null,
                "goOutSchedules": null
            }
            return emptyShift;
        }

        function getEmptyCopySchedule(object, day) {
            var emptyShift = {
                "id": object.id || null,
                "employeeId": object.employeeId || null,
                "departmentId": object.departmentId || null,
                "sapId": object.sapId || null,
                "name": object.name || null,
                "onDutyDay": day,
                "regularSchedules": delCopyShift(object.regularSchedules, 'regular') || null,
                "overtimeSchedules": delCopyShift(object.overtimeSchedules) || null,
                "holidaySchedules": delCopyShift(object.holidaySchedules) || null,
                "goOutSchedules": delCopyShift(object.goOutSchedules) || null
            }
            return emptyShift;
        }

        function delCopyShift(data, type) {
            var result = [];
            var typeDel = null;
            angular.forEach(data, function (item) {
                if (item.id) {
                    if (type && item.relatedShiftLabel && item.relatedShift) {
                        // 组合班次特殊处理
                        typeDel = item.relatedShift;
                        typeDel.operationState = 'delete';
                        result.push(typeDel)
                        item.relatedShift = null;
                    }
                    if (item.status == 1) {
                        item.operationState = 'delete';
                    }
                    result.push(item);
                }
            })
            if (_.isEmpty(result)) {
                result = null;
            }
            return result;
        }

        function autoFillRegularType(obj, type, index) {
            var str = [];
            var typeArray = regularType(type);
            var keys = 0;
            angular.forEach(obj, function (item, key) {
                if (index >= 0) {
                    if (key != index) {
                        str.push(item.type);
                    }
                } else {
                    str.push(item.type);
                }
            });
            for (var i = 0; i < typeArray.length; i++) {
                var isFind = false;
                for (var k = 0; k < str.length; k++) {
                    if (typeArray[i] == str[k]) {
                        isFind = true;
                        break
                    }
                }
                if (!isFind) {
                    keys = i;
                    break;
                }
            }
            return typeArray[keys];
        }

        function autoFillOvertimeType(obj, label) {
            if (!obj) {
                return label ? 'OVERTIME_FIXED_OVERTIME_ONE' : 'OVERTIME_FRAGMENT_ONE';
            }
            var str = overtimeRegular();
            var NewStr = label ? str.slice(5) : str.slice(0, 5);
            var keys = 0;
            for (var k = 0; k < NewStr.length; k++) {
                var isFind = false;
                for (var i = 0; i < obj.length; i++) {
                    if (NewStr[k] == obj[i].type) {
                        isFind = true;
                        break
                    }
                }
                if (!isFind) {
                    keys = k;
                    break;
                }
            }
            return NewStr[keys];
        }

        function copyPreviousFail() {
            commonService.alert({
                content: '网络异常，请重新连接网络',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }

        function getTimeDuration(datetime, time, type) {
            var result = null;
            var timeDuration = timelineOptions();
            var num = timeDuration.indexOf(datetime);
            if (type == 'before') {
                result = num - (time * 2)
            } else if (type == 'after') {
                result = num + (time * 2)
            } else {
                result = datetime;
            }
            return timeDuration[result];
        }

        // 时间轴数组
        function timelineOptions() {
            var hour = 0, result = [];
            var m = ['30', '00'];
            for (var i = 0; i < 72; i++) {
                var k = i % 2;
                hour += k;
                if (hour < 10) {
                    var h = '0' + hour
                } else {
                    h = hour
                }
                result.push(h + ':' + m[k] + ':00')
            }
            result.splice(0, 0, '00:00:00')
            return result;
        }

        // 前后扩展班时间轴
        function extendTime() {
            var initTime = [];
            for (var i = 0; i < 8.1; i += 0.5) {
                if (i != 0) {
                    initTime.push(i);
                }
            }
            return initTime;
        }

        function filterOvertimeSchedules(obj) {
            var result = [];
            angular.forEach(obj, function (item) {
                if (item.type.indexOf('OVERTIME_FRAGMENT') != -1) {
                    result.push(item);
                }
            })
            return result;
        }

        function getCacheExtend(obj, type, txt) {

            var beforeKey = 'OVERTIME_' + type + '_BEFORESHIFT';
            var afterKey = 'OVERTIME_' + type + '_AFTERSHIFT';
            var index = null;
            angular.forEach(obj, function (item, key) {
                if (txt == 'before') {
                    if (item.type == beforeKey) {
                        index = key;
                    }
                }
                if (txt == 'after') {
                    if (item.type == afterKey) {
                        index = key;
                    }
                }
            })
            if (index == null) {
                return {};

            } else {
                return obj[index];
            }
        }

        function buildOvertimeSchedules(obj) {
            if (obj == null) {
                return null;
            } else {
                angular.forEach(obj, function (item) {
                    if (item.type.indexOf('OVERTIME_FRAGMENT') != -1) {
                        item.flag = 'fragment';
                    } else if (item.type.indexOf('OVERTIME_FIXED') != -1) {
                        item.flag = 'fixed';
                    } else if (item.type.indexOf('OVERTIME_TEMPORARY_APPLY') != -1) {
                        item.flag = 'temp_overtime';
                    } else {
                        item.flag = 'extend';
                    }
                });
                return obj;
            }
        }

        function getDayCheck(prevDay, nextDay) {
            var lastDayArray = [], nextDayArray = [];
            var timeLine = timelineOptions();
            angular.forEach(prevDay.regularSchedules, function (item) {
                var s = timeLine.indexOf(item.onDutyTime);
                var e = timeLine.indexOf(item.offDutyTime);
                if (s > e) {
                    e += 48;
                }
                lastDayArray.push(s, e)
            })
            angular.forEach(prevDay.overtimeSchedules, function (item) {
                var s2 = timeLine.indexOf(item.overtimeBeginTime);
                var e2 = timeLine.indexOf(item.overtimeEndTime);
                if (s2 > e2) {
                    e2 += 48;
                }
                lastDayArray.push(s2, e2);
            })
            angular.forEach(nextDay.regularSchedules, function (item) {
                var a = timeLine.indexOf(item.onDutyTime);
                var b = timeLine.indexOf(item.offDutyTime);
                if (a > b) {
                    b += 48;
                }
                nextDayArray.push(a, b);
            })
            angular.forEach(nextDay.overtimeSchedules, function (item) {
                nextDayArray.push(timeLine.indexOf(item.overtimeBeginTime));
                nextDayArray.push(timeLine.indexOf(item.overtimeEndTime));
            })
            lastDayArray.sort(function (a, b) {
                return a - b;
            });
            nextDayArray.sort(function (a, b) {
                return a - b;
            });
            var last = null;
            if (lastDayArray.length > 0) {
                var length = lastDayArray.length;
                last = lastDayArray[length - 1];
                last = last > 48 ? last - 48 : null;
            }
            return {
                prev: last,
                next: nextDayArray[0] || null
            }
        }

        function isCrossDay(obj) {
            var timeline = timelineOptions()
            var start = timeline.indexOf(obj.onDutyTime);
            var end = timeline.indexOf(obj.offDutyTime);
            if (start > end) {
                end += 48;
            }
            return timeline[end];
        }

        function jobDuration(obj, type) {
            var a = 0, b = 0, c = 0;
            var day = obj.onDutyDay;
            if (type == 'label') {
                angular.forEach(obj.regularSchedules, function (item) {
                    a += computeWorkingHours(item, day);
                })
                return a;
            } else if (type == 'overtime') {
                angular.forEach(obj.overtimeSchedules, function (item) {
                    b += computeOvertimeHours(item, day);
                })
                return b;
            } else if (type == 'lieuLeave') {
                angular.forEach(obj.holidaySchedules, function (item) {
                    if (item.type == 'HOLIDAY_ADJUSTABLE') {
                        c += computeHolidayHours(item, day);
                    }
                })
                return c;
            }
        }

        function computeWorkingHours(item, day) {
            var start = day.replace(/-/g, "/") + ' ' + item.onDutyTime, end = day.replace(/-/g, "/") + ' ' + item.offDutyTime;
            var result;
            var dayTime = 1000 * 60 * 60 * 24;
            var hourTime = 1000 * 60 * 60;
            if (new Date(start).getTime() > new Date(end).getTime()) {
                result = (new Date(end).getTime() + dayTime) - new Date(start).getTime();
            } else {
                result = new Date(end).getTime() - new Date(start).getTime();
            }

            return (result / hourTime) - item.diningDuration;
        }

        function computeOvertimeHours(item) {
            var timeDuration = timelineOptions();
            var start = timeDuration.indexOf(item.overtimeBeginTime),
                end = timeDuration.indexOf(item.overtimeEndTime);
            return (end - start) / 2;
        }

        function computeHolidayHours(item) {
            var timeDuration = timelineOptions();
            var start = timeDuration.indexOf(item.holidayBeginTime),
                end = timeDuration.indexOf(item.holidayEndTime);
            return (end - start) / 2;
        }

        function isShowAdjustTime(item) {
            var txt = '';
            if (item.diningDuration > 0 && item.diningEndDatetime && item.diningStartDatetime) {
                txt = item.diningStartDatetime.slice(0, 5) + '-' + item.diningEndDatetime.slice(0, 5)
            }
            if (item.relatedShift) {
                if (item.relatedShift.diningDuration > 0 && item.relatedShift.diningEndDatetime && item.relatedShift.diningStartDatetime) {
                    txt += ',' + item.relatedShift.diningStartDatetime.slice(0, 5) + '-' + item.relatedShift.diningEndDatetime.slice(0, 5)
                }
            }
            if (txt) {
                return '(休：' + txt + ')'
            } else {
                return null
            }

        }

        function setCurrentLine(obj) {
            return obj.length - 1;
        }

    }

    String.prototype.trim = function () {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
})();
VkrmsApp.controller('scheduleCopyModalController', ['$http', '$scope', '$rootScope', '$modalInstance', 'CommonService', 'copyDatetimeLength', 'copyStem', 'copyDatetime', 'employees', 'onLineRmDate', 'getSearchParams', '$timeout', '$filter', 'SuperScheduleService',
    function ($http, $scope, $rootScope, $modalInstance, commonService, copyDatetimeLength, copyStem, copyDatetime, employees, onLineRmDate, getSearchParams, $timeout, $filter, SuperScheduleService) {
        $scope.copyDatetimeLength = copyDatetimeLength;
        $scope.copyStem = copyStem;
        $scope.copyDatetime = copyDatetime;
        $scope.pasteStart = null;
        $scope.pasteEnd = null;
        $scope.actionGo = true;
        $scope.onLineRmDate = onLineRmDate;
        $scope.getSearchParams = getSearchParams;
        $scope.pasteTimes = null;
        $scope.systemAdmin = ['50002235', '50042667', '50386055', '50387079', '50388069'];
        var defaultTimeDuration = SuperScheduleService.timelineOptions();
        var isHR = null;
        var user = sessionStorage.getItem('loginUserEmployee')
        if ($scope.systemAdmin.indexOf(user.postId) == -1) {
            isHR = ''
        } else {
            isHR = $filter('date')(new Date(), 'yyyy-MM-dd');
        }
        $timeout(function () {
            $('.modal-dialog').width(520);
            $('#sandbox-container .input-daterange').datepicker({
                language: "zh-CN",
                autoclose: true,
                startDate: isHR
            });
        }, 50);
        if ($scope.copyDatetime.length == 1) {
            $scope.copyTitleInfo = '所选员工在以下时间的每天都将被粘贴成与' + $scope.copyDatetime + '一样的排班!';
        } else {
            $scope.copyTitleInfo = '所选员工在以下时间将被粘贴成与' + $scope.copyDatetime[0] + '到' + $scope.copyDatetime[$scope.copyDatetime.length - 1] + '对应的排班!';
        }
        $('#endtimes').attr('disabled', 'disabled');
        $scope.getPasteStartTime = function () {
            $scope.pasteStart = $('#datepicker input[name=start]').datepicker('getDate');
            $scope.pasteStarts = $filter('date')($('#datepicker input[name=start]').datepicker('getDate'), 'yyyy-MM-dd');
            $scope.alertTime = infoTime($scope.pasteStart, $scope.copyDatetimeLength);
            $('#endtimes').attr('disabled', false);
            $('#endtimes').val('')
            $scope.pasteEnd = $scope.pasteStart;
            $scope.actionGo = true;

        }
        $scope.getPasteEndTime = function () {
            $scope.pasteEnd = $('#datepicker input[name=end]').datepicker('getDate');
            $scope.pasteEnds = $filter('date')($('#datepicker input[name=end]').datepicker('getDate'), 'yyyy-MM-dd');
            checkIsActionGo()
        }

        function checkIsActionGo() {
            if (($scope.pasteStart != $scope.pasteEnd) && $scope.copyDatetimeLength > 1) {
                if ($scope.alertTime.indexOf($filter('date')($scope.pasteEnd, 'yyyy-MM-dd')) != -1) {
                    $scope.actionGo = false;
                    $scope.pasteTimes = $scope.alertTime.indexOf($filter('date')($scope.pasteEnd, 'yyyy-MM-dd'));
                } else {
                    $scope.actionGo = true;
                }
            } else if ($scope.copyDatetimeLength == 1) {
                var time = ($scope.pasteEnd.getTime() - $scope.pasteStart.getTime()) / 86400000;
                if (time > 14) {
                    $scope.actionGo = true;
                    $scope.errorMsg = '粘贴天数必须小于15天'
                } else {
                    $scope.actionGo = false;
                    $scope.errorMsg = null;
                    $scope.pasteTimes = time;
                }
            }
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
        $scope.actionCopy = function () {
            var date = $filter('date')($scope.pasteStart, 'yyyy-MM-dd')
            $http.get(apiBaseUrl + '/lock-cycle-judgement-app', {
                params: {
                    beginDate: date,
                    endDate: date
                }
            }).then(function (res) {
                if (res.data.state == "0") {
                    commonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: '该日期还未设置对应的考勤周期'
                    });
                    return false;
                }
                if (new Date($scope.onLineRmDate.replace(/-/g, "/")) > new Date(date.replace(/-/g, "/"))) {
                    commonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: '该项目' + $scope.onLineRmDate + '上线RM，之前日期无法操作排班管理，请重新选择排班日期'
                    });
                    return false;
                }
                var newSchedule = buildCopySchedule($scope.copyStem, $scope.copyDatetime, $scope.pasteTimes);
                var chcekSchedulePaste = {
                    employeeIds: filterCopyStem($scope.copyStem),
                    beginDate: $filter('date')($scope.pasteStart, 'MM/dd/yyyy'),
                    endDate: $filter('date')($scope.pasteEnd, 'MM/dd/yyyy')
                };
                var chcekParams = {
                    search: chcekSchedulePaste
                };
                var params = {
                    deleteStartDate: $filter('date')($scope.pasteStart, 'yyyy-MM-dd'),
                    deleteEndDate: $filter('date')($scope.pasteEnd, 'yyyy-MM-dd'),
                    startDate: $filter('date')($scope.pasteStart, 'yyyy-MM-dd'),
                    endDate: $filter('date')($scope.pasteEnd, 'yyyy-MM-dd'),
                    employees: employees,
                    deleteEmployees: $scope.copyStem,
                    schedules: newSchedule,
                    isScheduleCopy: true
                };
                $http.get(apiBaseUrl + "/schedule-paste-is-empty", {
                    params: chcekParams
                }).success(function (response) {
                    if (response == 'true') {
                        commonService.confirm({
                            content: '粘贴时间范围内已有排班，是否清空并覆盖？',
                            callback: function () {
                                pasteSchedule(params);
                            }
                        });
                    } else {
                        pasteSchedule(params);
                    }
                })
            });

        };

        function pasteSchedule(params) {
            $http.put(apiBaseUrl + '/new-schedule-sheet', params, {headers: utils.generateHeaders()})
                .then(function (result) {
                    var dataStatus = result.data.status;
                    if (result.data.errorMessage) {
                        commonService.alert({
                            content: result.data.errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                    if (result.data.errorInfo) {
                        commonService.alert({
                            content: result.data.errorInfo,
                            icon: "fa-exclamation-circle"
                        });
                    }
                    $modalInstance.dismiss('cancel');
                    $rootScope.reloadSchedule = true;
                }, function () {
                    $modalInstance.dismiss('cancel');
                    commonService.alert({'content': '保存失败，请重新刷新页面.', 'icon': 'fa-exclamation-circle'});
                });
        }

        function infoTime(date, increment) {
            var oneDay = 1000 * 60 * 60 * 24;
            var startDay = date.getTime() - oneDay;
            var dat = parseInt(15 / increment);
            var result = [];
            for (var i = 1; i <= dat; i++) {
                var str = startDay + oneDay * increment * i;
                result.push($filter('date')(str, 'yyyy-MM-dd'));
            }
            return result;
        }

        function buildCopySchedule(item, datetime, times) {
            var newSchedules = [];
            var newItem = JSON.parse(JSON.stringify(item));
            angular.forEach(newItem, function (obj) {
                angular.forEach(obj.schedules, function (schedule) {
                    var indexDate = datetime.indexOf(schedule.onDutyDay);
                    if (indexDate != -1) {
                        if ($scope.copyDatetimeLength == 1) {
                            // 单天复制
                            for (var i = 0; i <= times; i++) {
                                schedule.onDutyDay = angular.copy(buildOnDutyDay(i));
                                newSchedules.push(copyDaySchedule(schedule));
                            }
                        } else {
                            for (var i = 0; i <= times; i++) {
                                schedule.onDutyDay = angular.copy(buildMultipleOnDutyDay(indexDate, i));
                                newSchedules.push(copyDaySchedule(schedule))
                            }
                        }
                    }
                })
            })
            return newSchedules;
        }

        function copyDaySchedule(schedule) {
            var obj = JSON.parse(JSON.stringify(schedule));
            obj.id = null;
            angular.forEach(obj.regularSchedules, function (regular) {
                regular.id = null;
            });
            angular.forEach(obj.overtimeSchedules, function (overtime) {
                overtime.id = null;
            });
            angular.forEach(obj.holidaySchedules, function (holiday) {
                holiday.id = null;
            });
            angular.forEach(obj.goOutSchedules, function (goOut) {
                goOut.id = null;
            });
            if (!_.isEmpty(obj.regularSchedules)) {
                for (var c = 0; c < obj.regularSchedules.length;c++) {
                    if (obj.regularSchedules[c].relatedShiftLabel && obj.regularSchedules[c].relatedShift) {
                        obj.regularSchedules[c].relatedShift.id = null;
                        obj.regularSchedules.push(obj.regularSchedules[c].relatedShift)
                        break;
                    }
                }
            }
            var zbItem = null;
            var delKey = null;
            angular.forEach(obj.holidaySchedules, function(item, key){
                if (item.isGroupShift) {
                    var end = defaultTimeDuration.indexOf(item.holidayEndTime);
                    var start = defaultTimeDuration.indexOf(item.holidayBeginTime);
                    var regularStart = defaultTimeDuration.indexOf(item.regularOnDutyTime);
                    var regularEnd = defaultTimeDuration.indexOf(item.regularOffDutyTime);
                    regularEnd = regularStart > regularEnd ? regularEnd + 48 : regularEnd;
                    if (end > regularEnd) {
                        zbItem = item.groupShiftData;
                        zbItem.holidayEndTime = item.holidayEndTime;
                        item.holidayEndTime = regularEnd > 48 ? changeTime48(item.regularOffDutyTime) : item.regularOffDutyTime;
                        zbItem.operationState = item.operationState;
                        zbItem.holidayType = item.holidayType;
                        if (zbItem.id) {
                            zbItem.id = null
                        }
                        obj.holidaySchedules.push(zbItem)
                    } else {
                        if (item.groupShiftData && item.groupShiftData.id) {
                            item.groupShiftData.operationState = 'delete';
                            item.groupShiftData.id = null;
                            obj.holidaySchedules.push(item.groupShiftData)
                        }
                    }
                    if (start >= regularEnd) {
                        if (item.id) {
                            item.operationState = 'delete';
                        } else {
                            delKey = key
                        }

                    }

                }
            })
            if (delKey != null && !obj.holidaySchedules[delKey].id) {
                obj.holidaySchedules.splice(delKey, 1);
            }
            return obj;
        }

        function changeTime48(time) {
            var str = defaultTimeDuration.indexOf(time);
            str += 48;
            return SuperScheduleService.getTimeDuration(str);
        }

        function buildOnDutyDay(i) {
            var oneDay = 86400000;
            var days = $scope.pasteStart.getTime();
            var newTime = days + oneDay * i;
            return $filter('date')(newTime, 'yyyy-MM-dd');
        }

        function buildMultipleOnDutyDay(index, i) {
            var oneDay = 86400000;
            var days = $scope.pasteStart.getTime();
            var newTime = (days + oneDay * index) + ($scope.copyDatetimeLength * i * oneDay);
            return $filter('date')(newTime, 'yyyy-MM-dd');
        }

        function filterCopyStem(item) {
            var result = []
            angular.forEach(item, function (obj) {
                result.push(obj.employeeId)
            })
            return result;
        }

    }]);
