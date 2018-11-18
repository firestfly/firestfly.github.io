/**
 * Created by wangq34 on 2016/11/4.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .service('ExperienceSummarizingService', ExperienceSummarizingService);

    ExperienceSummarizingService.$inject = ['$http', '$q'];

    function ExperienceSummarizingService($http, $q) {
        var service = {
            getExperienceSummarizingList: getExperienceSummarizingList
        };

        return service;

        function getExperienceSummarizingList(params) {
            var deferred = $q.defer();
            $http
                //.get('data/experience-summarizing.json')
                .get(apiBaseUrl + "/experience-summarizing/search", {
                    params: params
                })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

    }
})();