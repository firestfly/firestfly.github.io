'use strict';

VkrmsApp.factory('PostExpRuleAuthorityService', ['$http', '$q', 'CommonService', function ($http, $q, commonService) {
    var initSelectedDepartment = [];
    return {
        getPostExpRuleDepartments: getPostExpRuleDepartments,
        updatePostExpRuleDepartments: updatePostExpRuleDepartments,
        initSelectedDpt: initSelectedDpt
    }

    function initSelectedDpt() {
        return initSelectedDepartment;
    }

    function getPostExpRuleDepartments(experienceRuleId) {
        if (experienceRuleId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/department-post-exp-rules/-').success(function (result) {
                initSelectedDepartment = commonService.getAppliedIds(experienceRuleId, result);
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }

    function updatePostExpRuleDepartments(experienceRuleId, data) {
        var newData = {
            update: utils.compareUpdateDepartment(data, initSelectedDepartment),
            del: utils.compareDelDepartment(data, initSelectedDepartment)
        }
        if (experienceRuleId) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + '/department-post-exp-rule/' + experienceRuleId, newData).success(function (result) {
                deferred.resolve(result);
                initSelectedDepartment = data;
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
}]);