(function (window) {

    'use strict';

    angular.module('rmMobile.attendance')
        .factory('AttendanceService', AttendanceService);

    AttendanceService.$inject = ['$rootScope', '$http', '$q'];

    function AttendanceService($rootScope, $http, $q) {
        var factory = {
            getScheduleByDate: getScheduleByDate
        };

        return factory;

        function getScheduleByDate(queryAttendanceObj) {
            var defer = $q.defer();

            $rootScope.loading = true;

            $http.get(baseUrl + '/internal/api/new-attendance-checks-app',
                {params: {"search": JSON.stringify(queryAttendanceObj)}}).success(function (attendanceResult) {
                    defer.resolve(attendanceResult);
                    $rootScope.loading = false;
                }).error(function (error) {
                    defer.reject(error);
                    $rootScope.loading = false;
                });

            return defer.promise;
        }
    }

})(window);