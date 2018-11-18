(function () {

    'use strict';

    angular.module('rmMobile.attendance')
        .controller('AttendanceDetailCtrl', AttendanceDetailCtrl);

    AttendanceDetailCtrl.$inject = ['$rootScope', '$routeParams', 'CommonService', '$scope'];

    function AttendanceDetailCtrl($rootScope, $routeParams, commonService, $scope) {
        var attendanceDetail = this,
            type = $routeParams.type;
        fillData();

        function init() {
            commonService.getAuthority().then(function (result) {
                attendanceDetail.employeeInfo = result;
            });
            $rootScope.$broadcast('refreshNav', {
                title: attendanceDetail.headText + '汇总',
                showBack: true,
                showClose: false,
                showCalendar: false,
                backPage: '/attendance'
            });
        }
        $scope.centers = Array;
        function fillData() {
            var attendanceList = commonService.getAttendanceList(),
                details = attendanceList.attendance[type];

            if (type == 'late') {
                details.headText = "迟到";
                details.unit = "分钟";
                details.fontColor = "red";
            } else if (type == 'early') {
                details.headText = "早退";
                details.unit = "分钟";
                details.fontColor = "red";
            } else if (type == 'missSignIn') {
                details.headText = "漏签到";
                details.unit = "次";
                details.fontColor = "orange";
            } else if (type == 'haveSigned') {
                details.headText = "已补签";
                details.unit = "次";
                details.fontColor = "orange";
            } else if (type == 'lieuLeave') {
                details.headText = "调休";
                details.unit = "小时";
                details.fontColor = "green";
            } else if (type == 'absent') {
                details.headText = "旷工";
                details.unit = "小时";
                details.fontColor = "red";
            } else if (type == 'workDayOvertime') {
                details.headText = "工作日加班";
                details.unit = "小时";
                details.fontColor = "orange";
            } else if (type == 'holidayOverTime') {
                details.headText = "休息日加班";
                details.unit = "小时";
                details.fontColor = "orange";
            } else if (type == 'vacationOverTime') {
                details.headText = "法定节假日加班";
                details.unit = "小时";
                details.fontColor = "orange";
            }
            angular.extend(attendanceDetail, details);
            attendanceDetail.date = attendanceList.beginDate + "-" + attendanceList.endDate;
            init();
        }

        $scope.showSecondDay = commonService.showSecondDay;
    }

})();
