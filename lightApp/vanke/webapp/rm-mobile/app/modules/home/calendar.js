(function (window) {

    'use strict';

    angular.module('rmMobile.home')
        .controller('CalendarCtrl', CalendarCtrl);

    CalendarCtrl.$inject = ['$rootScope', '$scope', '$routeParams', '$location',
        '$timeout', 'CommonService', 'AttendanceService', '$filter'];

    function CalendarCtrl($rootScope, $scope, $routeParams, $location,
                          $timeout, commonService, attendanceService, $filter) {
        var target = $routeParams.target,
            day = new Date(),
            today = $filter('date')(day, 'yyyy-MM-dd'),
            todayFormat = $filter('date')(day, 'yyyy/MM/dd'),
            lastBeginDate = new Date(new Date(todayFormat).getTime() - (4 * 7 - 1 + day.getDay()) * 24 * 60 * 60 * 1000),
            month18Date;
        if (day.getMonth() - 7 > 0) {
            month18Date = new Date(day.getFullYear(), day.getMonth() - 8, day.getDate() + 1);
        } else {
            month18Date = new Date(day.getFullYear() - 1, day.getMonth() + 4, day.getDate() + 1);
        }
        if (target == "attendance") {
            $scope.minEndDate = lastBeginDate;
            $scope.maxEndDate = day;
            $scope.minBeginDate = lastBeginDate;
            $scope.maxBeginDate = day;
        }
        if (target == "wealthDetail") {
            $scope.minEndDate = month18Date;
            $scope.maxEndDate = day;
            $scope.minBeginDate = month18Date;
            $scope.maxBeginDate = day;
        }
        init();
        $scope.$watch('beginDate', function () {
            var beginDate = $scope.beginDate;
            if (beginDate) {
                beginDate = new Date(beginDate);
                if (target == "attendance") {
                    $scope.minEndDate = new Date(Math.max(beginDate, lastBeginDate) - 24 * 60 * 60 * 1000);
                    $scope.maxEndDate = new Date(Math.max(day, beginDate));
                } else if (target === "point") {
                    var flagMax = beginDate.getFullYear() + '-' + parseInt(beginDate.getMonth() + 2) + '-' + beginDate.getDate();
                    flagMax = new Date(flagMax.replace(/-/g, "/")).getTime() > day.getTime() ? today : flagMax;
                    $scope.minEndDate = beginDate;
                    $scope.maxEndDate = flagMax;
                } else if (target == "wealthDetail") {
                    $scope.minEndDate = new Date(Math.max(beginDate, month18Date) - 24 * 60 * 60 * 1000);
                    $scope.maxEndDate = new Date(Math.max(day, beginDate));
                }
            }
        });

        $scope.$watch('endDate', function () {
            var endDate = $scope.endDate;
            if (endDate) {
                endDate = new Date(endDate);
                if (target === "point") {
                    var flagMin = endDate.getFullYear() + '-' + endDate.getMonth() + '-' + endDate.getDate();
                    $scope.minBeginDate = flagMin;
                    $scope.maxBeginDate = endDate;
                } else if (target === "attendance") {
                    $scope.minBeginDate = new Date(Math.min(endDate, lastBeginDate));
                    $scope.maxBeginDate = new Date(Math.min(day, endDate));
                } else if (target == "wealthDetail") {
                    $scope.minBeginDate = new Date(Math.min(endDate, month18Date));
                    $scope.maxBeginDate = new Date(Math.min(day, endDate));
                }
            }
        });
        $scope.query = query;

        $scope.closeAlert = closeAlert;

        function init() {
            $scope.beginDateStatus = {opened: false};
            $scope.endDateStatus = {opened: false};
            $scope.showAlert = false;

            $scope.today = function () {
                $scope.maxBeginDate = today;
                $scope.maxEndDate = today;
            };
            $scope.today();

            $scope.dateOptions = {
                showWeeks: false,
                formatYear: 'yy',
                startingDay: 1
            };

            $rootScope.$broadcast('refreshNav', {
                title: '日期查询',
                showBack: true,
                showClose: false,
                showCalendar: false,
                backPage: 'back'
            });
        }

        function query() {
            $scope.showAlert = false;
            var fromDate = $filter('date')($scope.beginDate, 'M/d/yyyy'),
                toDate = $filter('date')($scope.endDate, 'M/d/yyyy')

            if (!fromDate && !toDate) {
                showAlertMsg('查询日期不能为空');
                return;
            } else if (!fromDate || !toDate) {
                var flagTrue = fromDate ? '结束日期' : '开始日期';
                showAlertMsg(flagTrue + '不能为空');
                return;
            }

            var rmUser = JSON.parse(utils.getCookie('rmUser'));
            var queryObj = {
                beginDate: fromDate,
                endDate: toDate,
                loginMobile: rmUser.loginMobile
            };

            /*if (target == 'point') {

                pointService.getPointByDate(queryObj)
                    .then(
                    function (pointResult) {
                        var taskList = {},
                            tasks = [],
                            totalPoints = 0;

                        taskList.beginDate = fromDate;
                        taskList.endDate = toDate;

                        if (pointResult.code == 200) {
                            tasks = pointResult.result;
                            taskList.tasks = tasks;

                            for (var index in tasks) {
                                tasks[index].totalPoint = tasks[index].totalPoint ? tasks[index].totalPoint : 0;
                                totalPoints += parseInt(tasks[index].totalPoint);
                            }

                            taskList.totalPoints = totalPoints;
                            commonService.setTaskList(taskList);

                            $location.path("/point");
                        }
                    },
                    function (error) {
                        commonService.alert('网络异常，请稍后再试');
                    }
                );
             } else */
            if (target == 'attendance') {
                attendanceService.getScheduleByDate(queryObj).then(function (attendanceResult) {
                        var attendanceList = {},
                            attendance = {};

                        attendanceList.beginDate = queryObj.beginDate;
                        attendanceList.endDate = queryObj.endDate;

                    if (attendanceResult.code == 200) {
                        attendance = attendanceResult;
                        attendanceList.attendance = attendance;
                        commonService.setAttendanceList(attendanceList);

                        $location.path("/attendance");
                    } else {
                        commonService.alert('获取考勤数据失败，请稍后再试');
                    }
                }, function (error) {
                    commonService.alert('网络异常，请稍后再试');
                });
            } else if (target == 'wealthDetail') {
                $rootScope.calendarQueryObj = queryObj;
                //$location.path("/wealth/details");
                history.back();
            }
        }

        function closeAlert() {
            $scope.showAlert = false;
        }

        function showAlertMsg(msg) {
            $scope.showAlert = true;
            $scope.msg = msg;
            $timeout(function () {
                $scope.showAlert = false;
            }, 3000, true);
        }
    }

})(window);