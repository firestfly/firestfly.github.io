/**
 * Created by wangq34 on 2016/5/31.
 * experience-ruleset
 */

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .factory('ExperienceRulesetService', ExperienceRulesetService);

    ExperienceRulesetService.$inject = ['$location', '$http', '$q'];

    function ExperienceRulesetService($location, $http, $q) {
        var service;
        service = {
            getFixedPostCollection: getFixedPostCollection,
            updateRulesetToSave: updateRulesetToSave,
            addRulesetToSave: addRulesetToSave,
            deleteRuleset: deleteRuleset
        };

        return service;

        function getFixedPostCollection(id) {
            var deferred = $q.defer();
            $http
                .get(apiBaseUrl + '/department-fixed-post-collect/' + id)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function updateRulesetToSave(fixedPostsAndShiftRule) {
            var deferred = $q.defer();
            /** @namespace fixedPostsAndShiftRule.fixedPostExpId */
            $http
                .put(apiBaseUrl + '/department-fixed-post/' + fixedPostsAndShiftRule.fixedPostExpId, fixedPostsAndShiftRule, {
                    headers: utils.generateHeaders()
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        function addRulesetToSave(fixedPostsAndShiftRule) {
            var deferred = $q.defer();
            $http
                .post(apiBaseUrl + '/department-fixed-post', fixedPostsAndShiftRule, {
                    headers: utils.generateHeaders()
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        function deleteRuleset(fixedPostsAndShiftRule) {
            var deferred = $q.defer();
            $http
                .delete(apiBaseUrl + "/department-fixed-post/" + fixedPostsAndShiftRule.fixedPostExpId, {
                    headers: utils.generateHeaders()
                })
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

    }
})();