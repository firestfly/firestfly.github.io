'use strict';
(function (w) {
    w.VkrmsApp.factory('OvertimeAttendanceCheckService', ['$http', 'CommonService', 'UserService', '$rootScope', '$q', function ($http, commonService, userService, $scope, $q) {
        return {
            recalculate: function (params) {
                var deferred = $q.defer();
                $http.post(apiBaseUrl + '/attendance-results-recalculate', params).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            searchOvertimeAttendanceCheck: function (params, isNew) {
                var url = apiBaseUrl + "/" + (isNew ? "new-" : "") + "attendance-checks";
                return $http.get(url, {params: params});
            },
            exportOvertimeAttendanceDetail: function (params) {
                var url = baseUrl + "/file/attendanceCheckExport";
                commonService.downloadFile(url, params);
            },
            exportOvertimeAttendanceSummary: function (params) {
                var url = baseUrl + "/file/export-overTimeAttendanceCheck";
                commonService.downloadFile(url, params);
            },
            exportOverTimeAttendanceCheck: function (params) {
                var url = baseUrl + "/file/attendanceCheckExport";
                commonService.downloadFile(url, params);
                /*var workingGroupsParam = null == params.workingGroups ? "" : "&workingGroups=" + params.workingGroups;
                 var departmentsParam = null == params.departments ? "" : "&departments=" + params.departments;
                 var url = baseUrl + "/file/export-overTimeAttendanceCheck" + "?beginDate=" + params.beginDate +
                 "&endDate=" + params.endDate + "&keywords=" + params.keywords + "&length=" + params.length +
                 "&start=" + params.start + workingGroupsParam + departmentsParam;
                 location.href = url;*/
            }
        };
    }]);
})(window);
