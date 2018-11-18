'use strict';

VkrmsApp.factory('ShiftGroupAuthorityService', ['$http', '$q', 'CommonService', function ($http, $q, commonService) {
    return {
        getShiftGroupDepartments: getShiftGroupDepartments,
        updateShiftGroupDepartments: updateShiftGroupDepartments,
        initSelectedDpt: initSelectedDpt
    }

    var initSelectedDepartment = [];

    function getShiftGroupDepartments(shiftGroupId) {
        if (shiftGroupId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/shift-groups/-').success(function (result) {
                initSelectedDepartment = commonService.getAppliedIds(shiftGroupId, result);
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }

    function initSelectedDpt() {
        return initSelectedDepartment;
    }

    function getAppliedIds(id, data) {
        var arr = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (id == data[i].ruleId) {
                arr = data[i].appliedIds;
                break;
            }
        }
        return arr;
    }

    function updateShiftGroupDepartments(shiftGroupId, data) {
        var newData = {
            update: utils.compareUpdateDepartment(data, initSelectedDepartment),
            del: utils.compareDelDepartment(data, initSelectedDepartment)
        }
        if (shiftGroupId) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + '/department-shift-group/' + shiftGroupId, newData).success(function (result) {
                deferred.resolve(result);
                initSelectedDepartment = data;
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }
}]);