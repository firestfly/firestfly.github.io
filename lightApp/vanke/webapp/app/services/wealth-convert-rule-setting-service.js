(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('WealthConvertRuleSettingService', WealthConvertRuleSettingService);

    WealthConvertRuleSettingService.$inject = ['$http', '$q'];

    function WealthConvertRuleSettingService($http, $q) {
        var service = {
            getRule: getRule,
            saveRule: saveRule
        };

        return service;

        function getRule(params) {
            var deferred = $q.defer();

            $http
                //.get('data/wealth-convert.json')
                .get('internal/api/wealth-convert/wealth-convert-rule-setting', {
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

        function saveRule(params) {
            var deferred = $q.defer();

            //console.log(params);

            $http
                .post('internal/api/wealth-convert/wealth-convert-rule-setting', params)
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