(function () {

    'use strict';

    angular.module('rmMobile.attendance')
        .controller('AttendanceTypeCtrl', AttendanceTypeCtrl);

    AttendanceTypeCtrl.$inject = ['$rootScope', '$routeParams', 'CommonService', '$scope'];

    function AttendanceTypeCtrl($rootScope, $routeParams, commonService, $scope) {
        var attendanceType = this,
            type = $routeParams.type;
        commonService.getAuthority().then(function (result) {
            attendanceType.employeeInfo = result;
        });
        $rootScope.$broadcast('refreshNav', {
            title: '休假汇总',
            showBack: true,
            showClose: false,
            showCalendar: false,
            backPage: '/attendance-rest'
        });
        var data = commonService.getAttendanceType();
        attendanceType.details = data[type].details || [];
    }
})();
