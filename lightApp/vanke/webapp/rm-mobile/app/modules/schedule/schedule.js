(function () {

    'use strict';
    angular.module('rmMobile.schedule')
        .controller('ScheduleCtrl', ScheduleCtrl);

    ScheduleCtrl.$inject = ['$http','$rootScope', 'CommonService', 'ScheduleService', '$scope', '$filter'];

    function ScheduleCtrl($http,$rootScope, commonService, scheduleService, $scope, $filter) {
        var schedule = this,
            currentFromDate,
            currentToDate,
            noSchedule = false;
        $scope.weekCount = 4;
        init();
        commonService.getAuthority().then(function (result) {
            schedule.employeeInfo = result;
        });
        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: '排班信息',
                showBack: true,
                showClose: false,
                showCalendar: false
            });
        }

        getSchedule();

        function getSchedule() {
            var queryScheduleObj = commonService.getScheduleDefaultDateQuery(),
                fromDate = new Date(queryScheduleObj.beginDate),
                toDate = new Date(queryScheduleObj.endDate);
            currentFromDate = fromDate;
            currentToDate = toDate;

            getScheduleFromServer(queryScheduleObj);
        }

        schedule.lastWeek = lastWeek;
        schedule.nextWeek = nextWeek;
        schedule.isOfficialHoliday = isOfficialHoliday;

        function isOfficialHoliday(day){
            if(!$scope.officialHoliday || !day) return false
            return $scope.officialHoliday.indexOf($filter('date')(day, 'yyyy-MM-dd')) > -1
        }

        function lastWeek() {
            refreshSchedule('last');
        }

        function nextWeek() {
            refreshSchedule('next');
        }
        function getScheduleFromServer(queryScheduleObj) {
            var fromDate = new Date(queryScheduleObj.beginDate),
                toDate = new Date(queryScheduleObj.endDate),
                startFromDate = Date.parse(fromDate); // 当周开始日期flag
            schedule.fromDate = fromDate;
            schedule.toDate = toDate;

            $http.get(baseUrl + '/internal/api/publicHoliday',{
                params:{
                    beginDate: utils.formatDate(schedule.fromDate),
                    endDate: utils.formatDate(schedule.toDate)
                }
            }).then(function(res){
                $scope.officialHoliday = res.data.data;
                return scheduleService.getScheduleByDate(queryScheduleObj)
            },function(){

            }).then(function (response) {
                    if (response.code == 200) {
                        var schedules = response.result.schedules;
                        if($scope.officialHoliday.length > 0) {
                            if(schedules){
                                var scheduleDays = schedules.map(function(schedule){
                                    return schedule.onDutyDay;
                                });
                                angular.forEach($scope.officialHoliday,function(officialHoliday){
                                    if(scheduleDays.indexOf(officialHoliday) < 0){
                                        schedules.push({
                                            onDutyDay: officialHoliday
                                        })
                                    }
                                });
                                schedules = schedules.sort(function(a,b){
                                    return (a.onDutyDay < b.onDutyDay) ? -1 : 1
                                })
                            }else{
                                angular.forEach($scope.officialHoliday,function(officialHoliday){
                                    schedules.push({
                                        onDutyDay: officialHoliday
                                    })
                                })
                            }
                        }
                        angular.forEach(schedules, function (item) {
                            for (var i in item.oneDaySchedule) {
                                var flag = null;
                                if (item.oneDaySchedule[i].relatedShiftLabel) {
                                    for (var k in item.oneDaySchedule) {
                                        if (item.oneDaySchedule[k].label == item.oneDaySchedule[i].relatedShiftLabel) {
                                            flag = k;
                                            break;
                                        }
                                    }
                                    if (flag != null) {
                                        item.oneDaySchedule[i].label = item.oneDaySchedule[i].label + '+' + item.oneDaySchedule[k].label
                                        item.oneDaySchedule[i].offDutyTime = item.oneDaySchedule[k].offDutyTime;
                                        item.oneDaySchedule.splice(k, 1);
                                        break;
                                    }
                                }
                            }
                        })
                        schedule.schedules = schedules;
                        //  按需重绘列表数据

                    } else {
                        commonService.alert('获取排班数据失败，请稍后再试');
                    }
                },
                function () {
                    commonService.alert('获取排班数据失败，请稍后再试');
                }
            );
        }

        // iso 正确时间格式 yyyy/MM/dd
        function iosFormatTime(time) {
            return time.replace(/-/g, "/");
        }

        function refreshSchedule(type) {
            if (type == 'last') {
                if ($scope.weekCount == 0) {
                    return;
                }
                currentFromDate = new Date(currentFromDate.setDate(currentFromDate.getDate() - 7));
                currentToDate = new Date(currentToDate.setDate(currentToDate.getDate() - 7));
                $scope.weekCount--;
            } else if (type == 'next') {
                currentFromDate = new Date(currentFromDate.setDate(currentFromDate.getDate() + 7));
                currentToDate = new Date(currentToDate.setDate(currentToDate.getDate() + 7));
                $scope.weekCount++;
            }

            var queryPointsObj = commonService.getDefaultDateQuery();
            var beginDate = (currentFromDate.getMonth() + 1) + '/' + currentFromDate.getDate() + '/' + currentFromDate.getFullYear(),
                endDate = (currentToDate.getMonth() + 1) + '/' + currentToDate.getDate() + '/' + currentToDate.getFullYear();

            queryPointsObj.beginDate = beginDate;
            queryPointsObj.endDate = endDate;

            getScheduleFromServer(queryPointsObj);
        }
    }

})();