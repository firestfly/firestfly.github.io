(function (window) {

    'use strict';

    angular.module('rmMobile.signIn')
        .factory('SignInService', SignInService);

    SignInService.$inject = ['$rootScope', '$http', '$q'];

    function SignInService($rootScope, $http, $q) {
        var factory = {
            getSignInByDate: getSignInByDate,
            getSignInRecord: getSignInRecord
        };

        return factory;

        function getSignInByDate(querySignInObj) {
            var defer = $q.defer();

            $rootScope.loading = true;

            $http.get(baseUrl + '/internal/api/attendances-app/login-mobile/' + querySignInObj.loginMobile +
                '/attendance-date/' + querySignInObj.attendanceDate)
                .success(function (attendancesResult) {
                    defer.resolve(attendancesResult);
                    $rootScope.loading = false;
                }).error(function (error) {
                    defer.reject(error);
                    $rootScope.loading = false;
                });

            return defer.promise;
        }

        function getSignInRecord(attendanceDetailId) {
            var defer = $q.defer();

            $rootScope.loading = true;

            $http.get(baseUrl + '/internal/api/attendances-app/' + attendanceDetailId)
                .success(function (attendanceResult) {
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