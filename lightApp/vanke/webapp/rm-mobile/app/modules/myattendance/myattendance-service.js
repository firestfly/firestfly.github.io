(function (window) {

    'use strict';

    angular.module('rmMobile.MyAttendance')
        .factory('MyAttendanceService', MyAttendanceService);

    MyAttendanceService.$inject = ['$rootScope', '$http', '$q'];

    function MyAttendanceService($rootScope, $http, $q) {
        var factory = {
            getMyAttendanceByDay: getMyAttendanceByDay,
            getLastAttendanceDay: getLastAttendanceDay,
            waitingCalcAttendanceResult: waitingCalcAttendanceResult
        };

        return factory;

        function getLastAttendanceDay(date) {
            var defer = $q.defer();
            $rootScope.loading = true;
            $http.get(baseUrl + '/internal/api/attendance-lock-cycle-include', {
                params: {
                    date: date
                }
            })
                .success(function (attendancesResult) {
                    defer.resolve(attendancesResult);
                    $rootScope.loading = false;
                }).error(function (error) {
                defer.reject(error);
                $rootScope.loading = false;
            });

            return defer.promise;
        }
        function getMyAttendanceByDay(mobile, day) {
            var defer = $q.defer();

            $rootScope.loading = true;

            $http.get(baseUrl + '/internal/api/my-schedule-app-new/login-mobile/' + mobile + '/on-duty-day/' + day)
                .success(function (attendancesResult) {
                    defer.resolve(attendancesResult);
                    $rootScope.loading = false;
                }).error(function (error) {
                    defer.reject(error);
                    $rootScope.loading = false;
                });

            return defer.promise;
        }

        function waitingCalcAttendanceResult(mobile, day) {
            var defer = $q.defer();

            $http.get(baseUrl + '/internal/api/waiting-calc-attendance-result/login-mobile/' + mobile + '/on-duty-day/' + day)
                .success(function (attendancesResult) {
                    defer.resolve(attendancesResult);
                }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }


    }

})(window);