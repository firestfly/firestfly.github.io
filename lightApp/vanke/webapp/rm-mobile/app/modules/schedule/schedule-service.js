(function (window) {

    'use strict';

    angular.module('rmMobile.schedule')
        .factory('ScheduleService', ScheduleService);

    ScheduleService.$inject = ['$rootScope', '$http', '$q'];

    function ScheduleService($rootScope, $http, $q) {
        var factory = {
            getScheduleByDate: getScheduleByDate
        };

        return factory;

        function getScheduleByDate(queryScheduleObj) {
            var defer = $q.defer();

            $rootScope.loading = true;

            $http.get(baseUrl + '/internal/api/new-schedule-app',
                {params: {"search": JSON.stringify(queryScheduleObj)}}).success(function (scheduleResult) {
                    defer.resolve(scheduleResult);
                    $rootScope.loading = false;
                }).error(function (error) {
                    defer.reject(error);
                    $rootScope.loading = false;
                });

            return defer.promise;
        }
    }

})(window);