(function () {

    'use strict';

    angular.module('rmMobile.attendance')
        .controller('AttendanceCtrl', AttendanceCtrl);

    AttendanceCtrl.$inject = ['$rootScope', 'CommonService', 'AttendanceService'];

    function AttendanceCtrl($rootScope, commonService, attendanceService) {
        var attendances = this;
        init();

        getAttendance();
        function init() {
            commonService.setCalendarTarget("attendance");
            commonService.getAuthority().then(function (result) {
                attendances.employeeInfo = result;
            });
            $rootScope.$broadcast('refreshNav', {
                title: '考勤汇总',
                showBack: true,
                showClose: false,
                showCalendar: true,
                backPage: '/'
            });
        }

        function getAttendance() {
            var attendanceList = commonService.getAttendanceList(),
                fromDate, toDate;
            //attendanceList = {}; // 暂定修改，数据重排后出现的问题。
            if (isNullObj(attendanceList)) {
                var queryAttendanceObj = commonService.getDefaultDateQuery();

                fromDate = new Date(queryAttendanceObj.beginDate);
                toDate = new Date(queryAttendanceObj.endDate);

                attendanceService.getScheduleByDate(queryAttendanceObj)
                    .then(
                    function (attendanceResult) {
                        var attendanceList = {},
                            attendance = {};

                        attendanceList.beginDate = queryAttendanceObj.beginDate;
                        attendanceList.endDate = queryAttendanceObj.endDate;

                        if (attendanceResult.code == 200) {
                            attendance = attendanceResult;
                            attendanceList.attendance = attendance;
                            commonService.setAttendanceList(attendanceList);

                            calculateAttendance(attendance);
                        } else {
                            commonService.alert('获取考勤数据失败，请稍后再试');
                        }
                    },
                    function (error) {
                        commonService.alert('网络异常，请稍后再试');
                    }
                );

                attendances.attendanceList = [{
                    spec: '迟到'
                }, {
                    spec: '早退'
                }, {
                    spec: '漏签到'
                }, {
                    spec: '已补签'
                }, {
                    spec: '旷工'
                }, {
                    spec: '工作日加班'
                }, {
                    spec: '休息日加班'
                }, {
                    spec: '法定节假日加班'
                }, {
                    spec: '调休'
                }];
            } else {
                fromDate = new Date(attendanceList.beginDate);
                toDate = new Date(attendanceList.endDate);

                calculateAttendance(attendanceList.attendance);
            }

            fillOverview(fromDate, toDate);
        }

        function isNullObj(obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
        }

        function calculateAttendance(attendance) {
            var lateCount = attendance.late.details ? attendance.late.details.length : 0,
                earlyCount = attendance.early.details ? attendance.early.details.length : 0,
                absentCount = attendance.absent.details ? attendance.absent.details.length : 0,
                workDayOvertimeCount = +attendance.workDayOvertime.totalDuration,
                holidayOverTimeCount = +attendance.holidayOverTime.totalDuration,
                vacationOverTimeCount = +attendance.vacationOverTime.totalDuration,
                missCheckinCount = +attendance.missSignIn.totalDuration,
                workTwoOrOneRestOneCount = +attendance.workTwoOrOneRestOne.totalDuration,
                lieuLeaveCount = attendance.lieuLeave.details ? attendance.lieuLeave.details.length : 0,
                goOutCount = attendance.goOut.details ? attendance.goOut.details.length : 0,
                alterNateCount = attendance.alterNate.details ? attendance.alterNate.details.length : 0,
                haveSignedCount = attendance.haveSigned && attendance.haveSigned.details ? attendance.haveSigned.details.length : 0;

            attendances.attendanceList = [{
                spec: '迟到',
                times: lateCount + '次',
                linkage: lateCount == 0 ? '#/attendance' : '#/attendance-detail/late'
            }, {
                spec: '早退',
                times: earlyCount + '次',
                linkage: earlyCount == 0 ? '#/attendance' : '#/attendance-detail/early'
            }, {
                spec: '漏签到',
                times: missCheckinCount + '次',
                linkage: missCheckinCount == 0 ? '#/attendance' : '#/attendance-detail/missSignIn'
            }, {
                spec: '已补签',
                times: haveSignedCount + '次',
                linkage: haveSignedCount == 0 ? '#/attendance' : '#/attendance-detail/haveSigned'
            }, {
                spec: '旷工',
                times: absentCount + '次',
                linkage: absentCount == 0 ? '#/attendance' : '#/attendance-detail/absent'
            }, {
                spec: '工作日加班',
                times: workDayOvertimeCount + '小时',
                linkage: workDayOvertimeCount == 0 ? '#/attendance' : '#/attendance-detail/workDayOvertime'
            }, {
                spec: '休息日加班',
                times: holidayOverTimeCount + '小时',
                linkage: holidayOverTimeCount == 0 ? '#/attendance' : '#/attendance-detail/holidayOverTime'
            }, {
                spec: '法定节假日加班',
                times: vacationOverTimeCount + '小时',
                linkage: vacationOverTimeCount == 0 ? '#/attendance' : '#/attendance-detail/vacationOverTime'
            }, {
                spec: '休假',
                times: lieuLeaveCount + '次',
                linkage: lieuLeaveCount == 0 ? '#/attendance' : '#/attendance/holidays'
            }, {
                spec: '外出',
                times: goOutCount + '次',
                linkage: goOutCount == 0 ? '#/attendance' : '#/attendance-rest/goOut'
            }, {
                spec: '月休',
                times: alterNateCount + '次',
                linkage: alterNateCount == 0 ? '#/attendance' : '#/attendance-rest/alterNate'
            }, {
                spec: '做2休1/做1休1',
                times: workTwoOrOneRestOneCount + '次',
                linkage: workTwoOrOneRestOneCount == 0 ? '#/attendance' : '#/attendance-rest/workTwoOrOneRestOne'
            }];
        }

        function fillOverview(fromDate, toDate) {
            attendances.month = toDate.getFullYear() + '年' + (toDate.getMonth() + 1) + '月考勤';
            attendances.period = '(' + (fromDate.getMonth() + 1) + '.' + fromDate.getDate() + '-' +
                (toDate.getMonth() + 1) + '.' + toDate.getDate() + ')';
            $rootScope.period = attendances.period.replace('\(', '').replace('\)', '');
        }
    }

})();
