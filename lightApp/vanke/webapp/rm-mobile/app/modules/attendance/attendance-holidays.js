(function () {

    'use strict';

    angular.module('rmMobile.attendance')
        .controller('AttendanceHolidaysCtrl', AttendanceHolidaysCtrl);

    AttendanceHolidaysCtrl.$inject = ['$rootScope', 'CommonService'];

    function AttendanceHolidaysCtrl($rootScope, commonService) {
        var attendanceHolidays = this,
            attendanceList = commonService.getAttendanceList(),
            lieuLeaveDetail = attendanceList.attendance["lieuLeave"].details || [],
            types = {
                HOLIDAY_PAY_ANNUAL: "额外带薪年休假",
                HOLIDAY_STATUTORY_ANNUAL: "法定年休假",
                HOLIDAY_ADJUSTABLE: "调休假",
                HOLIDAY_SPRING_FESTIVAL: "春节调休假",
                HOLIDAY_CARRY_OVER: "结转年休假",
                HOLIDAY_MARRIAGE: "婚假",
                HOLIDAY_FUNERAL: "丧假",
                HOLIDAY_MATERNITY: "产假",
                HOLIDAY_NURSING: "护理假",
                HOLIDAY_CONTRACEPTION: "节育假",
                HOLIDAY_FAMILY_PLANNING: "计划生育假",
                HOLIDAY_ORDINARY_SICK: "普通病假或医疗期外",
                HOLIDAY_STATUTORY_SICK: "法定病假医疗期",
                HOLIDAY_INDUSTRIAL_INJURY: "法定工伤医疗期",
                HOLIDAY_PRIVATE_AFFAIR: "事假",
                HOLIDAY_OTHER_PAY: "其他带薪假",
                HOLIDAY_DAY_RELEASE: "脱产学习假",
                HOLIDAY_HOME: "探亲假"
            };

        attendanceHolidays.totalDuration = attendanceList.attendance["lieuLeave"].totalDuration;
        attendanceHolidays.title = "休假汇总";

        init();
        var holidaysList = produceHolidaysData();
        commonService.setHolidaysList(holidaysList);
        attendanceHolidays.attendanceHolidaysList = holidaysList;

        function produceHolidaysData() {
            var holidaysList = [];
            for (var type in types) {
                var item = {};
                item.details = [];
                item.count = 0;
                item.holidayName = types[type];
                item.link = "#/attendance/holidays";
                angular.forEach(lieuLeaveDetail, function (v, i) {
                    if (type === v.type) {
                        item.details.push(v);
                        item.count++;
                        item.link = "#/attendance/holidays/" + holidaysList.length;
                    }
                });
                holidaysList.push(item);
            }
            return holidaysList;
        }

        function init() {
            commonService.getAuthority().then(function (result) {
                attendanceHolidays.employeeInfo = result;
            });
            $rootScope.$broadcast('refreshNav', {
                title: '休假汇总',
                showBack: true,
                showClose: false,
                backPage: '/attendance'
            });
        }
    }

})();
