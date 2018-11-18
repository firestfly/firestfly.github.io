(function (window) {

    'use strict';

    angular.module('rmMobile.point')
        .factory('PointService', PointService);

    PointService.$inject = ['$rootScope', '$http', '$q'];

    function PointService($rootScope, $http, $q) {
        var factory = {
            getPointByDate: getPointByDate
        };

        return factory;

        function getPointByDate(queryPointObj) {
            var defer = $q.defer();

            $rootScope.loading = true;

            $http.get(baseUrl + '/internal/api/tasks-app',
                {params: {"search": JSON.stringify(queryPointObj)}}).success(function (pointResult) {
                    defer.resolve(pointResult);
                    $rootScope.loading = false;
                }).error(function (error) {
                    defer.reject(error);
                    $rootScope.loading = false;
                });

            return defer.promise;
        }
    }

})(window);