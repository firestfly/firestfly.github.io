'use strict';
(function () {
    angular
        .module('vkrmsApp')
        .service('WealthLockService', WealthLockService);

    WealthLockService.$inject = ['$rootScope', '$http', '$q', 'CommonService', 'DataTableService'];

    function WealthLockService($rootScope, $http, $q, commonService, dataTableService) {
        var service = {
            getProject: getProject
        };
        return service;

        function getProject(params) {
            console.log(1);
            var deferred = $q.defer();
            $http
                .get('internal/api/wealth-lock-collect', {
                    params: params
                })
                .success(function (response) {
                    deferred.resolve(response)
                })
                .error(function (response) {
                    deferred.reject(response)
                });

            return deferred.promise;
        }
    }
})();
