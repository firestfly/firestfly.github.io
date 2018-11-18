/**
 * Created by wangq34 on 2016/5/12.
 */

(function () {

    'use strict';

    angular
        .module('vkrmsApp')
        .factory('ScheduleService', ScheduleService);

    ScheduleService.$inject = ['$rootScope', '$q', '$http', '$filter', '$timeout', 'CommonService', 'UserService'];

    function ScheduleService($scope, $q, $http, $filter, $timeout, commonService, userService) {

        var service = {
            getImportScheduleResult: getImportScheduleResult,
            initScopeVariable: initScopeVariable,
            getShiftsFromServer: getShiftsFromServer,
            initImportSchedule: initImportSchedule,
            getLoginUserData: getLoginUserData,

            initScheduleTable: initScheduleTable,
            buildScheduleSheet: buildScheduleSheet,
            applyScheduleSheet: applyScheduleSheet,
            applySchedules: applySchedules,
            updateScheduleId: updateScheduleId,

            copyPreviousSuccess: copyPreviousSuccess,
            copyPreviousFail: copyPreviousFail,

            checkKeyPost: checkKeyPost,

            checkOverlappingTime: checkOverlappingTime,
            checkShiftOverStartime: checkShiftOverStartime,
            checkShiftOverEndtime: checkShiftOverEndtime,
            checkStartEndTime: checkStartEndTime,
            checkExperience: checkExperience,
            checkLabelFixedPostNotEmpty: checkLabelFixedPostNotEmpty,
            checkLieuLeaveRule: checkLieuLeaveRule,

            isSearchInfoValid: isSearchInfoValid,

            getWeekInterval: getWeekInterval,
            getShift: getShift,
            getShiftOptions: getShiftOptions,
            getOtherTypeOptions: getOtherTypeOptions,
            getDutyWorkingDurationOptions: getDutyWorkingDurationOptions,
            getFragmentTimeOptions: getFragmentTimeOptions,
            getPostOptionsFromServer: getPostOptionsFromServer,
            getLieuLeaveOptions: getLieuLeaveOptions,

            getValueFromId: getValueFromId,
            getIdFromValue: getIdFromValue,
            getDateStr: getDateStr,
            getDayIndex: getDayIndex,

            extractLabel: extractLabel,
            getEmptyScheduleCell: getEmptyScheduleCell,

            isFixedPostId: isFixedPostId,
            getLockedDayIndex: getLockedDayIndex,

            convertEndTime: convertEndTime

        };

        return service;

        function getLockedDayIndex(lockedDays) {
            if (!lockedDays) return [];

            var lockedDayIndex = [];
            var now = new Date();
            for (var lockedLen = lockedDays.length; lockedLen--;) {
                var lockedDay = lockedDays[lockedLen];
                for (var len = $scope.days.length; len--;) {
                    var day = now.getFullYear() + '-' + $scope.days[len];
                    if (day == lockedDay) {
                        lockedDayIndex.push(len);
                    }
                }
            }
            return lockedDayIndex;
        }

        function checkKeyPost(departmentId, day) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/schedule-sheet/department-id/" + departmentId + "/on-duty-day/" + day)
                .success(function (fixedPostSchedules) {
                    deferred.resolve(fixedPostSchedules);
                })
                .error(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function isFixedPostId(id) {
            return $scope.jobIdArray.indexOf(id) > -1;
        }


        function copyPreviousSuccess(response) {
            var scheduleSheet = response.data;
            var schedules = scheduleSheet.schedules,
                schedule, lastWeekDayStr, lastWeekDay, currentWeekDay;

            if (schedules.length != 0) {
                $scope.scheduleTable = [];
                for (var scheduleIndex = 0; scheduleIndex < schedules.length; scheduleIndex++) {
                    schedule = schedules[scheduleIndex];
                    lastWeekDayStr = schedule.onDutyDay;
                    lastWeekDay = new Date(Date.parse(lastWeekDayStr.replace(/-/g, "/")));
                    currentWeekDay = new Date(lastWeekDay.getTime() + 7 * 24 * 60 * 60 * 1000);
                    schedule.onDutyDay = dateToString(currentWeekDay);

                    schedule.id = null;
                }
                scheduleSheet.startDate = getDateStr(scheduleSheet.startDate, 7);
                scheduleSheet.endDate = getDateStr(scheduleSheet.endDate, 7);
                applyScheduleSheet(scheduleSheet);
            } else {
                commonService.alert({
                    content: '上一周没有可复用的数据',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
            }
        }

        function copyPreviousFail() {
            $scope.transform.$show();
            commonService.alert({
                content: '网络异常，请重新连接网络',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }

        function initScopeVariable() {
            $scope.title = "万科资源管理信息系统 - 排班管理";
            $scope.commonSearchBarConfig = {
                isCompanySelectpickerMultiple: false,
                isDepartmentSelectpickerMultipe: false,
                companySelecterLabel: "公司范围",
                departmentSelecterLabel: "部门/项目",
                workgroupSelecterLabel: "员工子组"
            };
            $scope.scheduleTable = [];
            $scope.employees = [];
            $scope.days = getDays();
            $scope.defaultShifts = [{
                label: "-",
                onDutyTime: null,
                offDutyTime: null,
                diningDuration: null
            }];
            $scope.defaultShiftOptionValue = "-|null|null|null";
            $scope.defaultAdditionShiftOptionValue = "-|null|null|null";
            $scope.weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

            // wq add
            $scope.defaultDutyOverWorkingHours = 8;
            $scope.otherTypes = ['-', '加班', '调休假', '班次', '出差', '外勤', '月休', '额外带薪年休假', '法定年休假',
                '春节调休假', '结转年休假', '婚假', '丧假', '产假', '护理假', '节育假', '计划生育假', '普通病假或医疗期外', '法定病假医疗期', '法定工伤医疗期',
                '事假', '其他带薪假', '脱产学习假', '探亲假'];
            $scope.otherTypesLetter = ['0', '1-加班|OFF_DAY_OVERTIME,REGULAR_WITH_OVERTIME', '2-调休假|ADJUSTABLE', '3-班次|REGULAR', '4-出差|EVENCTION', '5-外勤|TRIP', '6-月休|HOLIDAY', '7-额外带薪年休假|PAY_ANNUAL', '8-法定年休假|STATUTORY_ANNUAL',
                '9-春节调休假|SPRING_FESTIVAL', '10-结转年休假|CARRY_OVER', '11-婚假|MARRIAGE', '12-丧假|FUNERAL', '13-产假|MATERNITY', '14-护理假|NURSING', '15-节育假|CONTRACEPTION', '16-计划生育假|FAMILY_PLANNING', '17-普通病假或医疗期外|ORDINARY_SICK', '18-法定病假医疗期|STATUTORY_SICK', '19-法定工伤医疗期|INDUSTRIAL_INJURY',
                '20-事假|PRIVATE_AFFAIR', '21-其他带薪假|OTHER_PAY', '22-脱产学习假|DAY_RELEASE', '23-探亲假|HOME'];
            $scope.defaultOptions = [{
                id: 0,
                value: '-'
            }];
            $scope.defaultFixedPostOptions = [{
                shiftLabel: '-',
                experience: 0,
                fixedPostId: '0',
                fixedPostName: '-'
            }];
            //配置场所管理人员班次与职位必填的jobId,"50071070"--"车行出入口"、"50385920"--"人行出入口"、"50386158"--"班长（出入口）"
            $scope.jobIdArray = ['50071070', '50385920'];

            $('.selectpicker').selectpicker();
            $('#scheduledatepicker').datepicker({});

            $('.schedule-table').css({
                height: (window.innerHeight - 300) + 'px'
            });

            //optimize schedule
            $scope.fragmentBeginTimeOptions = getFragmentTimeOptions(23, 0);
            $scope.fragmentEndTimeOptions = getFragmentTimeOptions(36, 1);
        }

        function getLoginUserData() {
            var loginUserObj = {};
            userService.getCurrentUser().then(function (result) {
                loginUserObj = result;
                //applySelecterData(loginUserObj);
            }, function (result) {
            });
        }

        function applySelecterData(data) {
            // 初始化搜索参数
            $scope.initSearchInfo = function () {
                var searchInfo = {
                    "departments": data.authorizedCompanies[0].departments[0].department_id.split(","),
                    "workingGroups": ['1001', '1002', '33', '1020', '51'], // 保洁。安全，秩序维护 3个工种
                    "beginDate": null,
                    "endDate": null,
                    "keywords": ''
                };
                return searchInfo;
            };
            $http.get(apiBaseUrl + "/schedule-sheet", {
                params: {search: $scope.initSearchInfo()}
            }).success(function (scheduleSheet) {
                applyScheduleSheet(scheduleSheet);
            });
            $scope.commonSearchBarConfig = {
                isCompanySelectpickerMultiple: false,
                companySelecterLabel: "公司范围",
                departmentSelecterLabel: "部门/项目",
                workgroupSelecterLabel: "员工子组"
            };
        }

        //按label和职位ID获取职位需求经验值
        function getExperienceByLabelAndFixedPost(label, fixedPostId) {
            var result = 0;
            angular.forEach($scope.fixedPostsAndShift, function (fixedPost) {
                if (label == fixedPost.shiftLabel && fixedPostId == fixedPost.fixedPostId) {
                    result = fixedPost.experience;
                }
            });
            return result;
        }

        function getPostOptionsFromServer(departmentId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/department-fixed-post-collect/" + departmentId)
                .success(function (fixedPosts) {
                    deferred.resolve(fixedPosts);
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
            /*$http.get(apiBaseUrl + "/shifts").success(function (shifts) {
             $scope.shifts = $scope.shifts.concat(shifts);
             });*/
        }

        function initImportSchedule() {
            $('#importExcelFile').fileinput({
                language: 'zh',
                allowedFileExtensions: ['xls', 'xlsx']
            });

            $("input[name='beginDate']").val("");
            $timeout(function () {
                $("input[name='start']").change(function () {
                    $("input[name='beginDate']").val(formatDate($(this).val()));
                });
            }, 200, false);
        }

        function getImportScheduleResult() {
            $http.get(apiBaseUrl + "/import-schedule-result").success(function (result) {
                var messageToShow = "", returnMessage;
                if (result) {
                    for (var i = 0; i < result.length; i++) {
                        returnMessage = result[i].resultMessage;
                        messageToShow += returnMessage + "<br/>"
                    }
                    if ($.trim(messageToShow !== '')) {
                        commonService.alert({
                            content: messageToShow,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                }
            });
        }

        //检查当天开始工作时间超过00:00:00；
        function checkShiftOverStartime(scheduleCell) {
            $scope.shiftOverStartime = getDutyShiftOvertimeDurating(scheduleCell).shiftOverStartime;
            if ($scope.shiftOverStartime && $scope.shiftOverStartime.timeToNum() < 0) {
                commonService.alert({
                    content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "排班的当天开始时间超过凌晨零点，请重新输入！",
                    icon: "fa-exclamation-circle"
                });
                scheduleCell.isCorrect = false;
                return false;
            }
            scheduleCell.isCorrect = true;
            return true;
        }

        //检查当天扩展结束时间超过36:00:00
        function checkShiftOverEndtime(scheduleCell) {
            $scope.shiftOverEndtime = getDutyShiftOvertimeDurating(scheduleCell).shiftOverEndtime;
            if ($scope.shiftOverEndtime && $scope.shiftOverEndtime.timeToNum() > 3600) {
                commonService.alert({
                    content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "排班的当天结束时间超过次日12点，请重新输入！",
                    icon: "fa-exclamation-circle"
                });
                scheduleCell.isCorrect = false;
                return false;
            }
            scheduleCell.isCorrect = true;
            return true;
        }

        function checkLabelFixedPostNotEmpty(scheduleCell, id) {
            if (isFixedPostId(id)) {
                if (!$.isEmpty(scheduleCell.label)) {
                    if ($.isEmpty(scheduleCell.labelFixedPostId) || parseInt(scheduleCell.labelFixedPostId) == 0) {
                        commonService.alert({
                            content: "请给场所管理人员（" + getEmployeeById(scheduleCell.employeeId).name + "）排" + scheduleCell.onDutyDay.toPrompt() + "上班的班次和职位！",
                            icon: "fa-exclamation-circle"
                        });
                        scheduleCell.isCorrect = false;
                        return false;
                    }
                    if (scheduleCell.otherType == 3 && !$.isEmpty(scheduleCell.labelAddition)) {
                        if ($.isEmpty(scheduleCell.labelFixedPostAdditionId) || parseInt(scheduleCell.labelFixedPostAdditionId) == 0) {
                            commonService.alert({
                                content: "请给场所管理人员（" + getEmployeeById(scheduleCell.employeeId).name + "）排" + scheduleCell.onDutyDay.toPrompt() + "上班的班次和职位！",
                                icon: "fa-exclamation-circle"
                            });
                            scheduleCell.isCorrect = false;
                            return false;
                        }
                    }
                }
            }
            scheduleCell.isCorrect = true;
            return true;
        }

        function checkLieuLeaveRule(scheduleCell) {
            if (scheduleCell.lieuLeaveBeginTime && scheduleCell.lieuLeaveEndTime) {
                if (scheduleCell.onDutyTime.subTime() != scheduleCell.lieuLeaveBeginTime.subTime() && convertEndTime(scheduleCell.onDutyTime.subTime(), scheduleCell.offDutyTime.subTime()) != scheduleCell.lieuLeaveEndTime.subTime() || (scheduleCell.lieuLeaveEndTime.timeToNum() - scheduleCell.lieuLeaveBeginTime.timeToNum()) < 400) {
                    commonService.alert({
                        content: "" + getEmployeeById(scheduleCell.employeeId).name + "在" + scheduleCell.onDutyDay.toPrompt() + "排的调休时间有误，请重新排班！",
                        icon: "fa-exclamation-circle"
                    });
                    scheduleCell.isCorrect = false;
                    return false;
                }
            }
            scheduleCell.isCorrect = true;
            return true;
        }

        function getAdjacentCell(scheduleCell, oneDaySchedules, type) {
            var result = '';
            angular.forEach(oneDaySchedules, function (oneDaySchedule) {
                if (oneDaySchedule.employeeId == scheduleCell.employeeId && getDateStr(scheduleCell.onDutyDay, type) == oneDaySchedule.onDutyDay) {
                    result = oneDaySchedule;
                }
            });
            return result;
        }

        //experience--人员经验值
        function checkExperience(label, fixedPostId, experience, scheduleCell) {
            var experienceValue = experience ? experience : 0;
            var experienceNeed = getExperienceByLabelAndFixedPost(label, fixedPostId);
            if (!$.isEmpty(label) && experienceValue < experienceNeed) {
                commonService.alert({
                    content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "的排班不满足上岗要求，请重新排班！需要" + experienceNeed + "经验值",
                    icon: "fa-exclamation-circle"
                });
                scheduleCell.isCorrect = false;
                return false;
            }
            scheduleCell.isCorrect = true;
            return true;
        }

        function getEmployeeById(id) {
            var result = "";
            angular.forEach($scope.employees, function (employee) {
                if (id == employee.employeeId) {
                    result = employee;
                }
            });
            return result;
        }


        function checkOverlappingTime(scheduleCell) {
            if (!$.isEmpty(scheduleCell.label)) {
                var shiftOvertime = getDutyShiftOvertimeDurating(scheduleCell);
                $scope.shiftOverStartime = shiftOvertime.shiftOverStartime;
                $scope.shiftOverEndtime = shiftOvertime.shiftOverEndtime;
                //加班时间重叠    允许时间连续
                if (scheduleCell.fragmentBeginTimeId != 0 && scheduleCell.fragmentEndTimeId != 0) {
                    if (!(scheduleCell.fragmentBeginTime.timeToNum() >= $scope.shiftOverEndtime.timeToNum() || scheduleCell.fragmentEndTime.timeToNum() <= $scope.shiftOverStartime.timeToNum())) {
                        commonService.alert({
                            content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "的排班录入时间有重叠，请重新输入！",
                            icon: "fa-exclamation-circle"
                        });
                        scheduleCell.isCorrect = false;
                        return false;
                    }
                }
                //常规班次重叠
                if (scheduleCell.otherType == 3 && scheduleCell.additionShiftOptionValue.split('|').slice(0, 1)[0] != '-') {
                    var offDutyTimeAdditionNum = scheduleCell.offDutyTimeAddition.timeToNum() < scheduleCell.onDutyTimeAddition.timeToNum() ? (scheduleCell.offDutyTimeAddition.timeToNum() + 2400) : scheduleCell.offDutyTimeAddition.timeToNum();
                    if (!(scheduleCell.onDutyTimeAddition.timeToNum() >= $scope.shiftOverEndtime.timeToNum() || offDutyTimeAdditionNum <= $scope.shiftOverStartime.timeToNum())) {
                        commonService.alert({
                            content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "的排班录入时间有重叠，请重新输入！",
                            icon: "fa-exclamation-circle"
                        });
                        scheduleCell.isCorrect = false;
                        return false;
                    }
                }
            }


            //跨天重叠
            //获取当天的开始结束时间
            var dayBETime = getDutyDurating(scheduleCell);
            var todayBeginTime = dayBETime.dayBeginTime;
            var todayEndTime = dayBETime.dayEndTime;
            //获取昨天的开始结束时间
            var employeeIndex = getEmployeeIndex(scheduleCell.employeeId);
            var dayIndex = getDayIndex(scheduleCell.onDutyDay.split('-').slice(1).join('-'));
            var yesterdayScheduleCell, tomorrowScheduleCell;

            if (dayIndex != 0) {
                yesterdayScheduleCell = $scope.scheduleTable[employeeIndex].scheduleCells[dayIndex - 1];
            } else {
                yesterdayScheduleCell = getAdjacentCell(scheduleCell, $scope.firstDaySchedules, -1);
            }

            if (dayIndex != 6) {
                tomorrowScheduleCell = $scope.scheduleTable[employeeIndex].scheduleCells[dayIndex + 1];
            } else {
                tomorrowScheduleCell = getAdjacentCell(scheduleCell, $scope.lastDaySchedules, 1);
            }

            if (yesterdayScheduleCell && todayBeginTime) {
                if (!$.isEmpty(yesterdayScheduleCell.label) || (yesterdayScheduleCell.fragmentBeginTime && yesterdayScheduleCell.fragmentEndTime)) {
                    var yesterdayEndTime = getDutyDurating(yesterdayScheduleCell).dayEndTime;
                    if (!$.isEmpty(yesterdayEndTime)) {
                        //var yesterdayEndTimeNum = yesterdayEndTime.timeToNum() > 2400 ? (yesterdayEndTime.timeToNum() - 2400) : yesterdayEndTime.timeToNum();
                        if ((todayBeginTime.timeToNum() + 2400) < yesterdayEndTime.timeToNum()) {
                            commonService.alert({
                                content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "的排班录入时间与前一天有重叠，请重新输入！",
                                icon: "fa-exclamation-circle"
                            });
                            scheduleCell.isCorrect = false;
                            return false;
                        }
                    }
                }
            }

            if (tomorrowScheduleCell && todayEndTime) {
                if (!$.isEmpty(tomorrowScheduleCell.label) || (tomorrowScheduleCell.fragmentBeginTime && tomorrowScheduleCell.fragmentEndTime)) {
                    var tomorrowBeginTime = getDutyDurating(tomorrowScheduleCell).dayBeginTime;
                    // 调休时 todayEndTime为undefined
                    if (!$.isEmpty(tomorrowBeginTime)) {
                        //var todayEndTimeNum = todayEndTime.timeToNum() > 2400 ? (todayEndTime.timeToNum() - 2400) : todayEndTime.timeToNum();
                        if (todayEndTime.timeToNum() > (tomorrowBeginTime.timeToNum() + 2400)) {
                            commonService.alert({
                                content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "的排班录入时间与后一天有重叠，请重新输入！",
                                icon: "fa-exclamation-circle"
                            });
                            scheduleCell.isCorrect = false;
                            return false;
                        }
                    }
                }
            }
            scheduleCell.isCorrect = true;
            return true;
        }

        //day---基准天    addDayCount---与基准天相差的天数，例如：-1前一天，1后一天
        function getDateStr(day, addDayCount) {
            var result;
            var dateArr = day.split('-');
            if (angular.isArray(dateArr)) {
                result = $filter('date')(new Date(+dateArr[0], +dateArr[1] - 1, +dateArr[2] + addDayCount), 'yyyy-MM-dd');
            }
            return result;
        }

        //获取某人某天一整天上班的开始结束时间
        function getDutyDurating(scheduleCell) {
            var shiftOvertime = getDutyShiftOvertimeDurating(scheduleCell);
            $scope.shiftOverStartime = shiftOvertime.shiftOverStartime;
            $scope.shiftOverEndtime = shiftOvertime.shiftOverEndtime;
            var dayEndTime = $scope.shiftOverEndtime, dayBeginTime = $scope.shiftOverStartime;
            var otherType = (scheduleCell.otherType != 'undefined') ? scheduleCell.otherType : getOtherType(scheduleCell);
            if ($scope.shiftOverStartime && $scope.shiftOverEndtime) {
                //工作日
                if (otherType == 0) {
                    dayEndTime = $scope.shiftOverEndtime;
                    dayBeginTime = $scope.shiftOverStartime;
                }
                if (otherType == 1 && !$.isEmpty(scheduleCell.fragmentBeginTime) && !$.isEmpty(scheduleCell.fragmentEndTime)) {
                    //零星加班
                    if (scheduleCell.fragmentBeginTime.timeToNum() >= $scope.shiftOverEndtime.timeToNum()) {
                        dayEndTime = scheduleCell.fragmentEndTime;
                        dayBeginTime = $scope.shiftOverStartime;
                    }
                    if (scheduleCell.fragmentEndTime.timeToNum() <= $scope.shiftOverStartime.timeToNum()) {
                        dayEndTime = $scope.shiftOverEndtime;
                        dayBeginTime = scheduleCell.fragmentBeginTime;
                    }
                }
                if (otherType == 2) {
                    //调休   当天不会重叠  跨天会重叠
                    dayEndTime = scheduleCell.lieuLeaveEndTime;
                    dayBeginTime = scheduleCell.lieuLeaveBeginTime;
                }
                if (otherType == 3 && !$.isEmpty(scheduleCell.offDutyTimeAddition) && !$.isEmpty(scheduleCell.onDutyTimeAddition)) {
                    //班次
                    var offDutyTimeAdditionNum = scheduleCell.offDutyTimeAddition.timeToNum() < scheduleCell.onDutyTimeAddition.timeToNum() ? (scheduleCell.offDutyTimeAddition.timeToNum() + 2400) : scheduleCell.offDutyTimeAddition.timeToNum();
                    if (scheduleCell.onDutyTimeAddition.timeToNum() >= $scope.shiftOverEndtime.timeToNum()) {
                        dayEndTime = offDutyTimeAdditionNum.toString();
                        dayBeginTime = $scope.shiftOverStartime;
                    } else if (offDutyTimeAdditionNum <= $scope.shiftOverStartime.timeToNum()) {
                        dayEndTime = $scope.shiftOverEndtime;
                        dayBeginTime = scheduleCell.onDutyTimeAddition;
                    } else {
                        dayEndTime = null;
                        dayBeginTime = null;
                    }
                }
            } else {
                //休息日
                if ((scheduleCell.fragmentBeginTimeId != 0 && scheduleCell.fragmentEndTimeId != 0)) {
                    dayEndTime = scheduleCell.fragmentEndTime ? scheduleCell.fragmentEndTime : getValueFromId(scheduleCell.fragmentEndTimeId, $scope.fragmentEndTimeOptions);
                    dayBeginTime = scheduleCell.fragmentBeginTime ? scheduleCell.fragmentBeginTime : getValueFromId(scheduleCell.fragmentBeginTimeId, $scope.fragmentBeginTimeOptions);
                }
            }

            if (dayEndTime && dayBeginTime && (dayEndTime.timeToNum() < dayBeginTime.timeToNum())) {
                var dayEndTimeStr = ( dayEndTime.timeToNum() + 2400 ).toString();
                dayEndTime = dayEndTimeStr.slice(0, 2) + ':' + dayEndTimeStr.slice(2);
            }

            return {
                dayEndTime: dayEndTime,
                dayBeginTime: dayBeginTime
            }

        }

        //获取某人排班第一行的 开始结束时间
        function getDutyShiftOvertimeDurating(scheduleCell) {
            var shiftOverBeginTime, shiftOverEndTime;
            var numS = $.isEmpty(scheduleCell.beforeShiftOvertimeDuration) ? getValueFromId(scheduleCell.beforeShiftOvertimeDurationId, getDutyWorkingDurationOptions()) : scheduleCell.beforeShiftOvertimeDuration;
            var numE = $.isEmpty(scheduleCell.afterShiftOvertimeDuration) ? getValueFromId(scheduleCell.afterShiftOvertimeDurationId, getDutyWorkingDurationOptions()) : scheduleCell.afterShiftOvertimeDuration;
            if (scheduleCell.onDutyTime && scheduleCell.offDutyTime) {
                var offDutyTime;
                if (scheduleCell.offDutyTime.timeToNum() < scheduleCell.onDutyTime.timeToNum()) {
                    var arr = scheduleCell.offDutyTime.split(':');
                    arr[0] = (parseInt(arr[0]) + 24);
                    offDutyTime = arr.join(":");
                } else {
                    offDutyTime = scheduleCell.offDutyTime;
                }
                shiftOverBeginTime = computerTimeAddNumber(scheduleCell.onDutyTime, numS, 0);
                shiftOverEndTime = computerTimeAddNumber(offDutyTime, numE, 1);
            }
            return {
                shiftOverStartime: shiftOverBeginTime,
                shiftOverEndtime: shiftOverEndTime
            }
        }

        //计算常规班次和扩展班次时间的算法
        function computerTimeAddNumber(time, num, type) {
            // type = 1:当日结束时间    type = 0：当日开始时间
            var timeArr, numArr, result;
            if (time) {
                timeArr = time.toString().split(':');
            }
            if (num && num.toString().indexOf('.') != -1) {
                numArr = num.toString().split('.');
            } else if (num != '-' && num.toString().indexOf('.') == -1) {
                numArr = [num, 0]
            } else if (num == '-') {
                numArr = [0, 0]
            }
            if (type == 0) {
                var startHour = parseInt(timeArr[0]) - parseInt(numArr[0]);
                var startMinute = parseInt(timeArr[1]) - parseInt((numArr[1] == 5 ? 30 : 0));
                if (startMinute < 0) {
                    var em = parseInt(timeArr[1] + 60) - parseInt((numArr[1] == 5 ? 30 : 0));
                    result = (startHour - 1) + ":" + em + ":00";
                } else {
                    startMinute = (startMinute.toString().length < 2 ? (startMinute + '0') : startMinute);
                    result = startHour + ":" + startMinute + ":00";
                }
            } else if (type == 1) {
                var endHour = parseInt(timeArr[0]) + parseInt(numArr[0]);
                var endMinute = parseInt(timeArr[1]) + parseInt((numArr[1] == 5 ? 30 : 0));
                if (endMinute >= 60) {
                    var em = ((endMinute - 60).toString().length < 2) ? ('0' + (endMinute - 60)) : (endMinute - 60);
                    result = (endHour + 1) + ":" + em + ":00";
                } else {
                    endMinute = (endMinute.toString().length < 2 ? ('0' + endMinute ) : endMinute);
                    result = endHour + ":" + endMinute + ":00";
                }
            } else {
                result = null;
            }

            return result;
        }

        //检查加班的结束时间不能早于开始时间
        function checkStartEndTime(scheduleCell) {
            var beginTimeId = scheduleCell.fragmentBeginTimeId;
            var endTimeId = scheduleCell.fragmentEndTimeId;
            if (beginTimeId == 0 || endTimeId == 0) {
                scheduleCell.isCorrect = true;
                return true;
            }
            if (beginTimeId >= (endTimeId + 1)) {
                commonService.alert({
                    content: getEmployeeById(scheduleCell.employeeId).name + scheduleCell.onDutyDay.toPrompt() + "排班的加班结束时间不能小于或等于开始时间！",
                    icon: "fa-exclamation-circle"
                });
                scheduleCell.isCorrect = false;
                return false;
            }
            scheduleCell.isCorrect = true;
            return true;
        }

        function computeWorkingHours(startTime, endTime) {
            //S wq add 2016-4-27
            if (!startTime || !endTime || !typeof(startTime) === "number" || !typeof(endTime) === "number") {
                return 0;
            }
            //E wq add 2016-4-27
            var endTimeArray = endTime.split(':'),
                startTimeArray = startTime.split(':'),
                endHours = (+endTimeArray[0]) + (+endTimeArray[1]) / 60,
                startHours = (+startTimeArray[0]) + (+startTimeArray[1]) / 60,
                workingHours = 0;
            if (endHours < startHours) {
                workingHours = endHours + 24 - startHours;
            } else {
                workingHours = endHours - startHours;
            }
            return workingHours;
        }

        function changeDate(date, increment) {
            if (date) {
                return new Date(date.setDate(date.getDate() + increment))
            }
            return null;
        }

        function getWeekInterval(type) {
            var beginDate = null, endDate = null;

            switch (type) {
                case "previous":
                    var dateArr = $scope.currentDate.split('-');
                    if (angular.isArray(dateArr)) {
                        beginDate = new Date(+dateArr[0], +dateArr[1] - 1, +dateArr[2] - 7);
                        endDate = new Date(+dateArr[0], +dateArr[1] - 1, +dateArr[2] - 1);
                    }
                    break;
                case "next":
                    var dateArr = $scope.currentDate.split('-');
                    if (angular.isArray(dateArr)) {
                        beginDate = new Date(+dateArr[0], +dateArr[1] - 1, +dateArr[2] + 7);
                        endDate = new Date(+dateArr[0], +dateArr[1] - 1, +dateArr[2] + 13);
                    }
                    break;
                default:
                    var date = $('#scheduledatepicker input[name=start]').datepicker('getDate');
                    beginDate = changeDate(date, 0);
                    endDate = changeDate(date, 6);
            }

            return {
                "beginDate": beginDate,
                "endDate": endDate
            }
        }

        function dateToString(date) {
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            month <= 9 ? month = "0" + month : null;
            day <= 9 ? day = "0" + day : null;

            return year + "-" + month + "-" + day;
        }

        //通过ondutyday获取schedules，即获取某一天（onDutyDay）的排班信息，缓存验证时间重复
        function getSchedulesByOnDutyDay(schedules, onDutyDay) {
            var arr = [];
            angular.forEach(schedules, function (schedule) {
                if (schedule.onDutyDay == onDutyDay) {
                    arr.push(schedule);
                }
            });
            return arr;
        }

        //获取当前周的排班
        function getWeekSchedules(schedules, firstDay, lastDay) {
            var arr = [];
            angular.forEach(schedules, function (schedule) {
                if (schedule.onDutyDay != firstDay && schedule.onDutyDay != lastDay) {
                    arr.push(schedule);
                }
            });
            return arr;
        }

        function getDateAndWeekdays(days, weekdays) {
            var dateAndWeekdays = [];
            angular.forEach(days, function (day, dayIndex) {
                angular.forEach(weekdays, function (weekday, weekdayIndex) {
                    if (dayIndex == weekdayIndex) {
                        dateAndWeekdays[dayIndex] = day + '（' + weekday + '）';
                    }
                });
            });
            return dateAndWeekdays;
        }

        function applyScheduleSheet(scheduleSheet) {
            //$scope.fixedPostsAndShift = posts.fixedPostsAndShift ;
            //if($scope.fixedPostOptions.length == 1){
            //    $scope.fixedPostOptions = $scope.fixedPostOptions.concat(posts.fixedPosts);
            //}
            if (scheduleSheet.employees.length == 0) {
                $scope.showInfo = false;
            } else {
                $scope.showInfo = true;
            }

            var startDate = getDateStr(scheduleSheet.startDate, 1);
            $scope.scheduleTable = [];
            $scope.employees = scheduleSheet.employees;
            $scope.days = getDays(startDate);
            $scope.dateAndWeekdays = getDateAndWeekdays($scope.days, $scope.weekdays);
            $scope.currentDate = startDate;
            initScheduleTable(scheduleSheet.lockDates);
            $scope.firstDaySchedules = getSchedulesByOnDutyDay(scheduleSheet.schedules, scheduleSheet.startDate);
            $scope.lastDaySchedules = getSchedulesByOnDutyDay(scheduleSheet.schedules, scheduleSheet.endDate);
            applySchedules(getWeekSchedules(scheduleSheet.schedules, scheduleSheet.startDate, scheduleSheet.endDate));
            //pageNation(scheduleSheet.employees.length);
        }

        //注意：employeeId和onDutyDay 没有初始化
        function getEmptyScheduleCell() {
            var otherTypeOptions = getOtherTypeOptions();
            otherTypeOptions.splice(2, 4);
            otherTypeOptions.splice(3, 18);
            var scheduleCell = {
                "id": null,
                "label": "-",
                "onDutyTime": null,
                "offDutyTime": null,
                "diningDuration": null,
                "defaultOptions": $scope.defaultOptions,
                "shiftOptionValue": $scope.defaultShiftOptionValue, // use for binding data
                "additionShiftOptionValue": $scope.defaultAdditionShiftOptionValue,
                "customOvertimeShiftOptionValue": "",
                "shiftOptions": getShiftOptions(),
                "additionShiftOptions": getShiftOptions(),
                "beforeShiftOvertimeDurationOptions": $scope.defaultOptions,
                "afterShiftOvertimeDurationOptions": $scope.defaultOptions,
                "beforeShiftOvertimeDuration": null,
                "beforeShiftOvertimeDurationId": 0,
                "afterShiftOvertimeDurationId": 0,
                "afterShiftOvertimeDuration": null,
                "otherTypeOptions": otherTypeOptions,
                "otherType": 0,
                "fragmentBeginTimeId": 0,
                "fragmentBeginTime": null,
                "fragmentBeginTimeOptions": $scope.fragmentBeginTimeOptions,
                "fragmentEndTime": null,
                "fragmentEndTimeId": 0,
                "fragmentEndTimeOptions": $scope.fragmentEndTimeOptions,
                "lieuLeaveBeginTime": null,
                "lieuLeaveEndTime": null,
                "labelAddition": '-|null|null|null',
                "offDutyTimeAddition": null,
                "onDutyTimeAddition": null,
                "diningDurationAddition": null,
                "labelFixedPostId": '0',
                "labelFixedPostOptions": $scope.fixedPostOptions,
                "labelFixedPostAdditionId": '0',
                "labelFixedPostAdditionOptions": $scope.fixedPostOptions
            };
            return scheduleCell;
        }

        function initScheduleTable(lockedDays) {
            /*$scope.start = start;
             $scope.enPage = $scope.employees.length > (10 * page) ? 10 * page : $scope.employees.length;
             $scope.scheduleTable = [];
             for (var i = start; i < $scope.enPage; i++) {*/
            var lockedDayIndex = getLockedDayIndex(lockedDays);
            for (var i = 0; i < $scope.employees.length; i++) {
                var employee = $scope.employees[i];
                var scheduleRow = {
                    "employee": employee,
                    "scheduleCells": [],
                    "workingHours": 0,
                    "overTimeWorkingHours": 0,
                    "lieuLeaveTotalTime": 0
                };
                var otherTypeOptions = getOtherTypeOptions();
                otherTypeOptions.splice(2, 4);
                otherTypeOptions.splice(3, 18);
                for (var j = 0; j < $scope.days.length; j++) {
                    var scheduleCell = {
                        "id": null,
                        "label": "-",
                        "employeeId": employee.employeeId,
                        "onDutyTime": null,
                        "offDutyTime": null,
                        "onDutyDay": getDateByDay($scope.days[j]),
                        "diningDuration": null,
                        "defaultOptions": $scope.defaultOptions,
                        "shiftOptionValue": $scope.defaultShiftOptionValue, // use for binding data
                        "additionShiftOptionValue": $scope.defaultAdditionShiftOptionValue,
                        "customOvertimeShiftOptionValue": "",
                        "shiftOptions": getShiftOptions(),
                        "additionShiftOptions": getShiftOptions(),
                        "beforeShiftOvertimeDurationOptions": $scope.defaultOptions,
                        "afterShiftOvertimeDurationOptions": $scope.defaultOptions,
                        "beforeShiftOvertimeDuration": null,
                        "beforeShiftOvertimeDurationId": 0,
                        "afterShiftOvertimeDurationId": 0,
                        "afterShiftOvertimeDuration": null,
                        "otherTypeOptions": otherTypeOptions,
                        "otherType": 0,
                        "fragmentBeginTimeId": 0,
                        "fragmentBeginTime": null,
                        "fragmentBeginTimeOptions": $scope.fragmentBeginTimeOptions,
                        "fragmentEndTime": null,
                        "fragmentEndTimeId": 0,
                        "fragmentEndTimeOptions": $scope.fragmentEndTimeOptions,
                        "lieuLeaveBeginTime": null,
                        "lieuLeaveOptions": getLieuLeaveOptions(),
                        "lieuLeaveEndTime": null,
                        "labelAddition": '-|null|null|null',
                        "offDutyTimeAddition": null,
                        "onDutyTimeAddition": null,
                        "diningDurationAddition": null,
                        "labelFixedPostId": '0',
                        "labelFixedPostOptions": $scope.fixedPostOptions,
                        "labelFixedPostAdditionId": '0',
                        "labelFixedPostAdditionOptions": $scope.fixedPostOptions,
                        "locked": false,
                        "isCorrect": true
                    };

                    for (var len = lockedDayIndex.length; len--;) {
                        if (j == lockedDayIndex[len]) {
                            scheduleCell.locked = true;
                        }
                    }

                    scheduleRow.scheduleCells.push(scheduleCell);
                }
                $scope.scheduleTable.push(scheduleRow);
            }
            // $scope.page = page;
        }

        function getOtherType(schedule, type) {
            var result = 0;
            if (!type) {
                for (var i in $scope.otherTypesLetter) {
                    var str = $scope.otherTypesLetter[i].split('|');
                    if (schedule.type == null) {
                        // 复制排班时，加班情况下type值为空
                        if (schedule.fragmentEndTime) {
                            result = 1;
                        } else if (schedule.labelAddition) {
                            result = 3;
                        } else {
                            result = 0;
                        }
                        break;
                    }
                    if (schedule.type == 'OFF_DAY_OVERTIME') {
                        result = 1;
                        break;
                    }
                    if (schedule.type == 'REGULAR_WITH_OVERTIME') {
                        if (schedule.labelAddition) {
                            result = 3;
                        } else {
                            if (schedule.fragmentBeginTime) {
                                result = 1;
                            } else {
                                result = 0;
                            }

                        }
                        break;
                    }
                    if (str.length == 2 && str[1] == schedule.type) {
                        if (str[1] == 'REGULAR' && !schedule.labelAddition) {
                            result = 0;
                        } else {
                            result = i;
                        }
                        break;
                    }
                    if (schedule.type == 'REST') {
                        result = 6;
                        break;
                    }
                }
            }
            return parseInt(result);
            //var result;
            //if ($.isEmpty(schedule.fragmentBeginTime)
            //    && $.isEmpty(schedule.fragmentEndTime)
            //    && $.isEmpty(schedule.lieuLeaveBeginTime)
            //    && $.isEmpty(schedule.lieuLeaveEndTime)
            //    && $.isEmpty((schedule.labelAddition))
            //    && schedule.type != 'REST'
            //    && schedule.type != 'EVENCTION'
            //    && schedule.type != 'TRIP'
            //    && schedule.type != 'HOLIDAY') {
            //    result = 0;
            //} else if (!$.isEmpty(schedule.fragmentBeginTime)
            //    && !$.isEmpty(schedule.fragmentEndTime)
            //    && $.isEmpty(schedule.lieuLeaveBeginTime)
            //    && $.isEmpty(schedule.lieuLeaveEndTime)
            //    && $.isEmpty((schedule.labelAddition))) {
            //    result = 1;
            //} else if (!$.isEmpty(schedule.lieuLeaveBeginTime)
            //    && !$.isEmpty(schedule.lieuLeaveEndTime)
            //    && $.isEmpty(schedule.fragmentBeginTime)
            //    && $.isEmpty(schedule.fragmentEndTime)
            //    && $.isEmpty((schedule.labelAddition))) {
            //    result = 2;
            //} else if (!$.isEmpty((schedule.labelAddition))
            //    && $.isEmpty(schedule.fragmentBeginTime)
            //    && $.isEmpty(schedule.fragmentEndTime)
            //    && $.isEmpty(schedule.lieuLeaveBeginTime)
            //    && $.isEmpty(schedule.lieuLeaveEndTime)) {
            //    result = 3;
            //} else if (schedule.type == 'REST') {
            //    result = 4;
            //} else if (schedule.type == 'EVENCTION') {
            //    result = 5;
            //} else if (schedule.type == 'TRIP') {
            //    result = 6;
            //} else if (schedule.type == 'HOLIDAY') {
            //    result = 7;
            //}
            //return result;
        }

        function applySchedules(schedules, type) {
            for (var i = 0; i < schedules.length; i++) {
                var schedule = schedules[i];
                if (!schedule.onDutyDay) {
                    continue;
                }
                var employeeIndex = getEmployeeIndex(schedule.employeeId);
                var onDutyDayArray = schedule.onDutyDay.split("-");
                var day = onDutyDayArray[1] + "-" + onDutyDayArray[2];
                var dayIndex = getDayIndex(day);
                var scheduleRow = $scope.scheduleTable[employeeIndex];
                var scheduleCell = scheduleRow.scheduleCells[dayIndex];
                schedule.otherType = getOtherType(schedule, type);
                schedule.otherTypeOptions = getOtherTypeOptions();
                if (schedule.otherType == 4 || schedule.otherType == 5 || schedule.otherType == 6 || schedule.otherType == 6) {
                    schedule.otherTypeOptions.splice(2, 2);
                }
                if (schedule.label) {
                    scheduleRow.workingHours = utils.round(+scheduleRow.workingHours + computeWorkingHours(schedule.onDutyTime, schedule.offDutyTime)
                        + computeWorkingHours(schedule.onDutyTimeAddition, schedule.offDutyTimeAddition) - computeWorkingHours(schedule.lieuLeaveBeginTime, schedule.lieuLeaveEndTime), -2);
                }
                if (schedule.beforeShiftOvertimeDuration || schedule.afterShiftOvertimeDuration || schedule.otherType == 1) {
                    //units.round  十进制调整  -2表示超过2位小数 后面的会四舍五入
                    scheduleRow.overTimeWorkingHours = utils.round(+scheduleRow.overTimeWorkingHours +
                        ($.isEmpty(schedule.beforeShiftOvertimeDuration) ? 0 : schedule.beforeShiftOvertimeDuration) + ($.isEmpty(schedule.afterShiftOvertimeDuration) ? 0 : schedule.afterShiftOvertimeDuration) +
                        computeWorkingHours(schedule.fragmentBeginTime, schedule.fragmentEndTime), -2);
                }
                if (schedule.label && schedule.otherType == 2) {
                    scheduleRow.lieuLeaveTotalTime = utils.round(+scheduleRow.lieuLeaveTotalTime + computeWorkingHours(schedule.lieuLeaveBeginTime, schedule.lieuLeaveEndTime), -2);
                }
                schedule.labelAddition = schedule.labelAddition == null ? '-' : schedule.labelAddition;
                if (schedule.label) {
                    schedule.lieuLeaveOptions = getLieuLeaveOptions(schedule.onDutyTime.subTime(), convertEndTime(schedule.onDutyTime.subTime(), schedule.offDutyTime.subTime()));
                    $.extend(scheduleCell, schedule, {
                        "label": schedule.label == null ? '-' : schedule.label,
                        "labelAddition": schedule.labelAddition == null ? '-' : schedule.labelAddition,
                        "shiftOptionValue": buildShiftOptionValueFromSchedule(schedule),
                        "additionShiftOptionValue": buildAdditionShiftOptionValueFromSchedule(schedule),
                        "beforeShiftOvertimeDurationId": getIdFromValue(schedule.beforeShiftOvertimeDuration, getDutyWorkingDurationOptions()),
                        "afterShiftOvertimeDurationId": getIdFromValue(schedule.afterShiftOvertimeDuration, getDutyWorkingDurationOptions()),
                        "fragmentBeginTimeId": getIdFromValue(schedule.fragmentBeginTime, $scope.fragmentBeginTimeOptions),
                        "fragmentEndTimeId": getIdFromValue(schedule.fragmentEndTime, $scope.fragmentEndTimeOptions),
                        "lieuLeaveBeginTime": schedule.lieuLeaveBeginTime ? schedule.lieuLeaveBeginTime.subTime() : schedule.lieuLeaveBeginTime,
                        "lieuLeaveEndTime": schedule.lieuLeaveBeginTime ? schedule.lieuLeaveEndTime.subTime() : schedule.lieuLeaveBeginTime,
                        "lieuLeaveBeginTimeId": getIdFromValue(schedule.lieuLeaveBeginTime, schedule.lieuLeaveOptions),
                        "lieuLeaveEndTimeId": getIdFromValue(schedule.lieuLeaveEndTime, schedule.lieuLeaveOptions),
                        "beforeShiftOvertimeDurationOptions": getDutyWorkingDurationOptions(),
                        "afterShiftOvertimeDurationOptions": getDutyWorkingDurationOptions(),
                        "labelFixedPostAdditionId": schedule.labelFixedPostAdditionId ? schedule.labelFixedPostAdditionId : '0',
                        "labelFixedPostId": schedule.labelFixedPostId ? schedule.labelFixedPostId : '0'
                        //"labelFixedPost": schedule.labelFixedPost || '-',
                        //"labelFixedPostId": schedule.labelFixedPost,
                        //"labelFixedPostAddition": schedule.labelFixedPostAddition || '-',
                        //"labelFixedPostAdditionId": schedule.labelFixedPostAddition
                    });
                } else {
                    $.extend(scheduleCell, schedule, {
                        "fragmentBeginTimeId": getIdFromValue(schedule.fragmentBeginTime, $scope.fragmentBeginTimeOptions),
                        "fragmentEndTimeId": getIdFromValue(schedule.fragmentEndTime, $scope.fragmentEndTimeOptions),
                        "labelFixedPostAdditionId": schedule.labelFixedPostAdditionId ? schedule.labelFixedPostAdditionId : '0',
                        "labelFixedPostId": schedule.labelFixedPostId ? schedule.labelFixedPostId : '0'
                    });
                }

                scheduleCell.additionShiftOptions = scheduleCell.additionShiftOptions.del('value', scheduleCell.shiftOptionValue);

                if (!isExisting(scheduleCell.shiftOptions, scheduleCell.shiftOptionValue)) {
                    scheduleCell.shiftOptions.push({
                        text: extractLabel(scheduleCell.shiftOptionValue),
                        value: scheduleCell.shiftOptionValue
                    });
                }

                if (!isExisting(scheduleCell.additionShiftOptions, scheduleCell.additionShiftOptionValue)) {
                    scheduleCell.additionShiftOptions.push({
                        text: extractLabel(scheduleCell.additionShiftOptionValue),
                        value: scheduleCell.additionShiftOptionValue
                    });
                }

                $scope.scheduleTable[employeeIndex].scheduleCells[dayIndex] = scheduleCell;
            }
        }

        function updateScheduleId(scheduleSheet) {
            var schedules = scheduleSheet.schedules;
            for (var i = 0; i < schedules.length; i++) {
                var schedule = schedules[i];
                if (!schedule.onDutyDay) {
                    continue;
                }
                var employeeIndex = getEmployeeIndex(schedule.employeeId);
                var onDutyDayArray = schedule.onDutyDay.split("-");
                var day = onDutyDayArray[1] + "-" + onDutyDayArray[2];
                var dayIndex = getDayIndex(day);
                var scheduleRow = $scope.scheduleTable[employeeIndex];
                var scheduleCell = scheduleRow.scheduleCells[dayIndex];
                if (scheduleCell) {
                    scheduleCell.id = schedule.id;
                }
            }
        }

        function buildScheduleSheet() {
            var scheduleSheet = {
                employees: $scope.employees,
                startDate: getDateByDay($scope.days[0]),
                endDate: getDateByDay($scope.days[$scope.days.length - 1]),
                schedules: []
            };
            for (var i = 0; i < $scope.scheduleTable.length; i++) {
                var scheduleRow = $scope.scheduleTable[i];
                var scheduleCells = scheduleRow.scheduleCells;
                for (var j = 0; j < scheduleCells.length; j++) {
                    var scheduleCell = scheduleCells[j];
                    if (scheduleCell.shiftOptionValue == $scope.defaultShiftOptionValue
                        && scheduleCell.otherType == 0) {
                        continue;
                    }
                    var employee = scheduleRow.employee;
                    var shift = getShift(scheduleCell);
                    var additionShift = getAdditionShift(scheduleCell);
                    var schedule = {
                        "id": scheduleCell.id,
                        "departmentId": $scope.departmentId,
                        "employeeId": employee.employeeId,
                        "label": shift.label == "-" ? null : shift.label,
                        "onDutyDay": getDateByDay($scope.days[j]),
                        "onDutyTime": shift.onDutyTime || null,
                        "offDutyTime": shift.offDutyTime || null,
                        "diningDuration": shift.diningDuration,
                        "labelAddition": null,
                        "onDutyTimeAddition": null,
                        "offDutyTimeAddition": null,
                        "diningDurationAddition": null,
                        "fragmentBeginTime": null,
                        "fragmentEndTime": null,
                        "lieuLeaveBeginTime": null,
                        "lieuLeaveEndTime": null,
                        "labelFixedPostId": scheduleCell.labelFixedPostId == '0' ? null : scheduleCell.labelFixedPostId,
                        "labelFixedPostAdditionId": scheduleCell.labelFixedPostAdditionId == '0' ? null : scheduleCell.labelFixedPostAdditionId,
                        "beforeShiftOvertimeDuration": scheduleCell.beforeShiftOvertimeDuration == 0 || scheduleCell.beforeShiftOvertimeDuration == '-' ? null : scheduleCell.beforeShiftOvertimeDuration,
                        "afterShiftOvertimeDuration": scheduleCell.afterShiftOvertimeDuration == 0 || scheduleCell.afterShiftOvertimeDuration == '-' ? null : scheduleCell.afterShiftOvertimeDuration
                    };
                    switch (scheduleCell.otherType) {
                        case 0:
                            $.extend(schedule, schedule, {
                                "labelAddition": null,
                                "onDutyTimeAddition": null,
                                "offDutyTimeAddition": null,
                                "diningDurationAddition": null,
                                "fragmentBeginTime": null,
                                "fragmentEndTime": null,
                                "lieuLeaveBeginTime": null,
                                "lieuLeaveEndTime": null,
                                "type": null
                            });
                            break;
                        case 1:
                            $.extend(schedule, schedule, {
                                "labelAddition": null,
                                "onDutyTimeAddition": null,
                                "offDutyTimeAddition": null,
                                "diningDurationAddition": null,
                                "fragmentBeginTime": scheduleCell.fragmentBeginTimeId != 0 ? getValueFromId(scheduleCell.fragmentBeginTimeId, $scope.fragmentBeginTimeOptions) : null,
                                "fragmentEndTime": scheduleCell.fragmentEndTimeId != 0 ? getValueFromId(scheduleCell.fragmentEndTimeId, $scope.fragmentEndTimeOptions) : null,
                                "lieuLeaveBeginTime": null,
                                "lieuLeaveEndTime": null,
                                "type": null
                            });
                            break;
                        case 3:
                            $.extend(schedule, schedule, {
                                "labelAddition": additionShift.labelAddition == "-" ? null : additionShift.labelAddition,
                                "onDutyTimeAddition": additionShift.onDutyTimeAddition == "null" ? null : additionShift.onDutyTimeAddition,
                                "offDutyTimeAddition": additionShift.offDutyTimeAddition == "null" ? null : additionShift.offDutyTimeAddition,
                                "diningDurationAddition": additionShift.diningDurationAddition,
                                "fragmentBeginTime": null,
                                "fragmentEndTime": null,
                                "lieuLeaveBeginTime": null,
                                "lieuLeaveEndTime": null,
                                "type": null
                            });
                            break;
                        case 6:
                            $.extend(schedule, schedule, {
                                "label": null,
                                "onDutyTime": null,
                                "offDutyTime": null,
                                "diningDuration": null,
                                "labelAddition": null,
                                "onDutyTimeAddition": null,
                                "offDutyTimeAddition": null,
                                "diningDurationAddition": null,
                                "fragmentBeginTime": null,
                                "fragmentEndTime": null,
                                "lieuLeaveBeginTime": null,
                                "lieuLeaveEndTime": null,
                                "beforeShiftOvertimeDuration": null,
                                "afterShiftOvertimeDuration": null,
                                "type": 'HOLIDAY'
                            });
                            break;
                        default :
                            $.extend(schedule, schedule, {
                                "labelAddition": null,
                                "onDutyTimeAddition": null,
                                "offDutyTimeAddition": null,
                                "diningDurationAddition": null,
                                "fragmentBeginTime": null,
                                "fragmentEndTime": null,
                                "lieuLeaveBeginTime": scheduleCell.lieuLeaveBeginTime.concatTime(),
                                "lieuLeaveEndTime": scheduleCell.lieuLeaveEndTime.concatTime(),
                                "beforeShiftOvertimeDuration": null,
                                "afterShiftOvertimeDuration": null,
                                "type": switchType(scheduleCell.otherType)
                            });
                            break;
                    }

                    if (!isCanceled(schedule)) {
                        scheduleSheet.schedules.push(schedule);
                    }
                }
            }
            return scheduleSheet;
        }

        function switchType(type) {
            var str = $scope.otherTypesLetter[type].split('|');
            if (str.length == 2) {
                return str[1];
            } else {
                return null;
            }
        }

        function isCanceled(schedule) {
            return schedule.label == null && schedule.fragmentBeginTime == null && schedule.type == null;
        }

        function getShiftOptions() {
            var shiftOptions = [];
            for (var i = 0; i < $scope.shifts.length; i++) {
                var shift = $scope.shifts[i];
                shiftOptions.push({
                    value: buildShiftOptionValueFromShift(shift),
                    text: shift.label
                });
            }
            return shiftOptions;
        }

        function getEmployeeIndex(employeeId) {
            for (var i = 0; i < $scope.scheduleTable.length; i++) {
                if ($scope.scheduleTable[i].employee.employeeId == employeeId) {
                    return i;
                }
            }
            return -1;
        }

        function getDayIndex(day) {
            for (var i = 0; i < $scope.days.length; i++) {
                if ($scope.days[i] == day) {
                    return i;
                }
            }
            return -1;
        }

        function getDays(day) {
            var current;

            if (day) {
                current = new Date(Date.parse(day.replace(/-/g, "/")));
            } else {
                return [];
            }

            var weekday = current.getDay() == 0 ? 7 : current.getDay(),
                weekstart = current.getDate() - weekday + 1,
                week = [];

            for (var i = 0; i < 7; i++) {
                var day = new Date(new Date(current).setDate(weekstart + i)),
                    month = day.getMonth() < 9 ? "0" + (day.getMonth() + 1) : (day.getMonth() + 1),
                    date = day.getDate() < 10 ? "0" + day.getDate() : day.getDate(),
                    newDate = (month + "-" + date);
                week.push(newDate);
            }
            return week;
        }

        function getShift(scheduleCell) {
            for (var i = 0; i < $scope.shifts.length; i++) {
                var shift = $scope.shifts[i];
                if (scheduleCell.shiftOptionValue == buildShiftOptionValueFromShift(shift)) {
                    return shift;
                }
            }
            //兼容历史数据
            var arr = scheduleCell.shiftOptionValue.split('|');
            return {
                label: arr[0],
                onDutyTime: arr[1],
                offDutyTime: arr[2],
                diningDuration: arr[3]
            };
        }

        function getAdditionShift(scheduleCell) {
            for (var i = 0; i < $scope.shifts.length; i++) {
                var shift = $scope.shifts[i];
                if (scheduleCell.additionShiftOptionValue == buildShiftOptionValueFromShift(shift)) {
                    var arr = scheduleCell.additionShiftOptionValue.split('|');
                    return {
                        labelAddition: arr[0],
                        onDutyTimeAddition: arr[1],
                        offDutyTimeAddition: arr[2],
                        diningDurationAddition: parseInt(arr[3])
                    };
                }
            }
            return {
                labelAddition: scheduleCell.labelAddition,
                onDutyTimeAddition: scheduleCell.onDutyTimeAddition,
                offDutyTimeAddition: scheduleCell.offDutyTimeAddition,
                diningDurationAddition: scheduleCell.diningDurationAddition
            };
        }

        function buildShiftOptionValueFromShift(shift) {
            return shift.label + "|" + shift.onDutyTime + "|" + shift.offDutyTime + "|" + shift.diningDuration;
        }

        function buildShiftOptionValueFromSchedule(schedule) {
            return (schedule.label == null ? '-' : schedule.label) + "|" + schedule.onDutyTime + "|" + schedule.offDutyTime + "|" + schedule.diningDuration;
        }

        function buildAdditionShiftOptionValueFromSchedule(schedule) {
            return schedule.labelAddition + "|" + schedule.onDutyTimeAddition + "|" + schedule.offDutyTimeAddition + "|" + schedule.diningDurationAddition;
        }

        function extractLabel(shiftOptionValue) {
            var parts = shiftOptionValue.split("|");
            return parts[0];
        }

        function isExisting(shiftOptions, shiftOptionValue) {
            var shiftOptions = $filter('filter')(shiftOptions, {value: shiftOptionValue}, true);
            return shiftOptions.length > 0;
        }

        function getDateByDay(weekday) {
            return new Date().getFullYear() + "-" + weekday;
        }

        function isSearchInfoValid() {
            var keywords = $scope.keywords;
            if (keywords.length > 0) {
                return true;
            }

            if (!$scope.selectedDepartments || $scope.selectedDepartments.length < 1) {
                commonService.alert({
                    content: "请选择查询部门",
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            if (!$scope.selectedGroups || $scope.selectedGroups.length < 1) {
                commonService.alert({
                    content: "请选择员工子组",
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            return true;
        }

        function formatDate(sourceStr) {
            var targeStr = sourceStr.replace(/年/, '-');
            targeStr = targeStr.replace(/月/, '-');
            targeStr = targeStr.replace(/日/, '');
            return targeStr;
        }

        //转换结束时间（小于开始时间转换） 时间格式HH:mm
        function convertEndTime(beginTime, endTime) {
            if (endTime.timeToNum() < beginTime.timeToNum()) {
                var tempStr = (endTime.timeToNum() + 2400).toString();
                endTime = tempStr.substring(0, 2) + ":" + tempStr.substring(2, 4);
            }
            return endTime;
        }


        function getLieuLeaveOptions(beginTime, endTime) {
            beginTime = beginTime || "00:00";
            endTime = endTime || "36:00";
            var result = getFragmentTimeOptions(36, 0);
            result.pop();
            var beginId = getIdFromValue(beginTime, result);
            var endId = getIdFromValue(endTime, result);
            result = result.slice(beginId, (endId + 1));
            return result;
        }

        //组装36小时下拉列表，num--多少小时，type--0.取00:00、取最后半小时；1.不取00:00、不取最后半小时
        function getFragmentTimeOptions(num, type) {
            var hour = [], minute, hm, result = [{
                id: 0,
                value: '-'
            }], h;
            minute = ['00', '30'];
            for (var i = 0, count = 1; i <= num; i++) {
                hour[i] = i;
                h = hour[i].toString();
                if (h.length < 2) {
                    h = '0' + h;
                }
                for (var j = 0; j < minute.length; j++) {
                    if (i == num && type == 1) {
                        hm = h + ":" + minute[0];
                        result.push({
                            id: count,
                            value: hm
                        });
                        //result += ('<option value="' + hm + '"></option>');
                        break;
                    } else if (i == 0 && type == 1 && j == 0) {
                        continue;
                    } else {
                        hm = h + ":" + minute[j];
                        result.push({
                            id: count,
                            value: hm
                        });
                    }
                    count++;
                }
            }
            return result;
        }

        //扩展加班下拉列表
        function getDutyWorkingDurationOptions() {
            var result = [{
                id: 0,
                value: '-'
            }];
            for (var i = 0.5, j = 1; i <= $scope.defaultDutyOverWorkingHours; i += 0.5, j++) {
                result.push({
                    id: j,
                    value: i
                });
            }
            return result;
        }

        //额外排班下拉列表
        function getOtherTypeOptions() {
            var result = [];
            for (var i = 0; i < $scope.otherTypes.length; i++) {
                result.push({
                    id: i,
                    value: $scope.otherTypes[i]
                });
            }
            return result;
        }

        function getIdFromValue(value, arrs) {
            var result = 0;
            if (value && typeof(value) === 'string') {
                value = value.subTime();
            }
            angular.forEach(arrs, function (arr) {
                if (arr.value == value) {
                    result = arr.id
                }
            });
            return result;
        }

        function getValueFromId(id, arr) {
            var selected = $filter('filter')(arr, {id: id});
            var value;
            if (selected && selected.length) {
                value = selected[0].value;
                if (value && typeof(value) === 'string') {
                    value = value.concatTime();
                }
            } else {
                value = '-';
            }
            return value;
        }
    }

    String.prototype.concatTime = function () {
        var str = this;
        if (str.indexOf(':') != -1 && str.split(':').length < 3) {
            str = str + ':00';
        }
        return str;
    };

    String.prototype.subTime = function () {
        if (this.indexOf(':') == -1) {
            return this;
        }
        var arr = this.split(':'), result;
        if (arr.length > 2) {
            result = arr[0] + ':' + arr[1];
        } else {
            result = this;
        }
        return result;
    };

    String.prototype.toPrompt = function () {
        var arr = this.split('-');
        return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
    };

    String.prototype.timeToNum = function () {
        return this && this.toString().indexOf(':') != -1 ? parseInt(this.subTime().split(':').join('')) : this;
    };

    $.extend({
        isEmpty: function (value, allowEmptyString) {
            return (value == null) || (value == undefined)
                || (!allowEmptyString ? value === '' : false)
                || ($.isArray(value) && value.length === 0)
                || (value === '-')
                || (value === '-|null|null|null')
                || (value == 'null');
        }
    });

    //json数组按值删除一项
    Array.prototype.del = function (key, value) {
        for (var i = 0; i < this.length; i++) {
            if (eval('(' + 'this[' + i + '].' + key + "=='" + value + "')")) {
                this.splice(i, 1);
            }
        }
        return this;
    };

    Array.prototype.hasString = function (str) {
        return (this.toString().indexOf(str) > -1);
    };

    Array.prototype.deleteDuplication = function () {
        var result = [], hash = {}, arr = this;
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }

})();
