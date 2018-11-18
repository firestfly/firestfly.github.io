(function () {

    'use strict';

    angular.module('rmMobile.MyAttendance')
        .controller('MyAttendanceCtrl', MyAttendanceCtrl);

    MyAttendanceCtrl.$inject = ['$rootScope', 'CommonService', 'MyAttendanceService', '$scope', '$filter'];

    function MyAttendanceCtrl($rootScope, commonService, myattendanceService, $scope, $filter) {
        var myattendance = this,
            rmUser = commonService.getCurrentUser(),
            todayFormat = $filter('date')(new Date(), 'yyyy/MM/dd'),
            today = new Date(todayFormat),
            currentDay = +today;
        myattendance.maxdate = today;
        var minDate = new Date(todayFormat).getTime() - (4 * 7 - 1 + today.getDay()) * 24 * 60 * 60 * 1000;
        myattendance.mindate = new Date(minDate);
        myattendanceService.getLastAttendanceDay(today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay()).then(function (result) {
            if (result.data) {
                minDate = result.data[0].startDate.replace(/-/g, "/") || today;
                minDate = new Date(minDate);
                myattendance.mindate = minDate;
            }
        }).then(function () {
            commonService.getAuthority().then(function (result) {
                myattendance.employeeInfo = result;
                return result.id;
            }).then(function () {
                myattendanceService.getLastAttendanceDay(today.getFullYear() + "-" + (1 + today.getMonth()) + "-" + today.getDay()).then(function (result) {
                    if (result.data) {
                        if (new Date(result.data[0].startDate.replace(/-/g, "/")) < new Date(myattendance.employeeInfo.entryOrgDate) && new Date(result.data[0].endDate.replace(/-/g, "/")) > new Date(myattendance.employeeInfo.entryOrgDate)) {
                            minDate = new Date(myattendance.employeeInfo.entryOrgDate) || today;
                            myattendance.mindate = minDate;
                        }
                    }
                });
            })
        });
        var isWatch = true;
        init();

        getMyAttendance();
        $scope.$watch('myattendance.date', function () {
            if (myattendance.date && isWatch) {
                currentDay = +new Date(myattendance.date.replace(/-/g, "/"));
                getMyAttendance()
            }
        });
        function init() {

            $rootScope.$broadcast('refreshNav', {
                title: '考勤结果',
                showBack: true,
                showClose: false,
                showCalendar: false
            });
        }

        $scope.showSecondDay = commonService.showSecondDay;
        function getMyAttendance() {
            var mobile;
            if (!rmUser) {
                mobile = window.getQueryString('loginMobile')
            } else {
                mobile = rmUser.loginMobile;
            }
            var day = $filter('date')(currentDay, 'yyyy-MM-dd'),
                day2 = $filter('date')(currentDay, 'yyyy/MM/dd');

            myattendance.currentDate = day;
            myattendance.currentWeek = $filter('date')(currentDay, 'EEE');
            myattendanceService.getMyAttendanceByDay(mobile, day)
                .then(
                function (attendanceResult) {
                    if (attendanceResult.code == 200) {
                        if (day2 == todayFormat) {
                            $scope.todayDisabled = true;

                        } else {
                            $scope.todayDisabled = false;
                        }
                        myattendanceService.waitingCalcAttendanceResult(mobile, day)
                            .then(function (res) {
                                $scope.moduleAlertState = res;
                            });
                        if (minDate > new Date(day2)) {
                            $scope.lastDayDisabled = true;
                            // return;
                        } else {
                            $scope.lastDayDisabled = false;
                        }
                        replaceMyattendance(attendanceResult.result);
                        isWatch = true;
                    } else {
                        commonService.alert('获取考勤数据失败，请稍后再试');
                    }
                },
                function (error) {
                    commonService.alert('网络异常，请稍后再试');
                }
            );


        }

        //
        function replaceMyattendance(data) {
            $scope.fragmentContinu = false;
            var detail = data;
            myattendance.show = !data || data.length == 0;
            myattendance.shiftname = myattendance.show ? '未排班' : '';
            if (myattendance.show) {
                return;
            }
            for (var i in detail) {
                if (detail[i].onDutyTime == null) {
                    // 休息日加班
                    detail[i].shiftDay = true;
                }
                if (detail[i].shift == '月休') {
                    myattendance.show = true;
                    myattendance.shiftname = '月休';
                }
                var flag = null
                for (var k in detail[i].shifts) {
                    if (detail[i].shifts[k].shift == '做2休1/做1休1' || detail[i].shifts[k].shift == '月休') {
                        detail[i].shifts[k].holidayRest = 1
                    }
                    // 合并组合班次
                    if (detail[i].shifts[k].relatedShiftLabel) {
                        for (var t in detail[i].shifts) {
                            if (detail[i].shifts[t].shift == detail[i].shifts[k].relatedShiftLabel) {
                                flag = t
                                break;
                            }
                        }
                        if (flag != null) {
                            detail[i].shifts[k].shift = detail[i].shifts[k].shift + '+' + detail[i].shifts[flag].shift;
                            detail[i].shifts[k].offDutyTime = detail[i].shifts[flag].offDutyTime;
                            detail[i].shifts.splice(flag, 1);
                        }
                        break;
                    }
                }
            }
            myattendance.detail = detail;
        }        // 按日期选择
        $scope.getMyAttendanceByDay = function (type) {
            if (type == "last") {
                $scope.todayDisabled = false;
                if (minDate >= currentDay) {
                    $scope.lastDayDisabled = true;
                    return false;
                }
                currentDay = currentDay - 86400000;
            } else {
                $scope.lastDayDisabled = false;
                if (currentDay >= +today) {
                    // 截止到当前日期；
                    $scope.todayDisabled = true;
                    return false
                }
                currentDay = currentDay + 86400000;
            }

            myattendance.date = $filter('date')(currentDay, 'yyyy-MM-dd');
            isWatch = false;
            getMyAttendance()
        };

        $scope.ok = function () {
            $scope.moduleAlertState = false;
        }
    }

})();
