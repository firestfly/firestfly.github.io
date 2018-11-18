(function () {

    'use strict';

    angular.module('rmMobile.attendance')
        .controller('AttendanceRestCtrl', AttendanceRestCtrl);

    AttendanceRestCtrl.$inject = ['$rootScope', '$routeParams', 'CommonService', '$scope'];

    function AttendanceRestCtrl($rootScope, $routeParams, commonService, $scope) {
        var attendanceRest = this, backPage, restType, attendanceList,
            type = $routeParams.type;
        commonService.getAuthority().then(function (result) {
            attendanceRest.employeeInfo = result;
        });
        if (type == "goOut") {
            $scope.title = "外出汇总";
            attendanceList = commonService.getAttendanceList();
            restType = attendanceList.attendance[type];
            backPage = "/attendance"
        } else if (type == "alterNate") {
            $scope.title = "月休汇总";
            attendanceList = commonService.getAttendanceList();
            restType = attendanceList.attendance[type];
            backPage = "/attendance"
        } else if (type == "workTwoOrOneRestOne") {
            $scope.title = "做2休1/做1休1";
            attendanceList = commonService.getAttendanceList();
            restType = attendanceList.attendance[type];
            backPage = "/attendance"
        } else {
            $scope.title = "休假详情";
            attendanceList = commonService.getHolidaysList();
            restType = attendanceList[type];
            backPage = "/attendance/holidays"
        }
        attendanceRest.totalDuration = restType.details ? restType.details.length : 0;

        init();
        $scope.showSecondDay = commonService.showSecondDay;
        attendanceRest.details = restType.details || [];
        function init() {
            $rootScope.$broadcast('refreshNav', {
                title: $scope.title,
                showBack: true,
                showClose: false,
                showCalendar: false,
                backPage: backPage
            });
        }

        commonService.setAttendanceType($scope.TypeTotals);
    }

})();
