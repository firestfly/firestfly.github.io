'use strict';

(function (w) {
    w.VkrmsApp.factory('AttendanceFillService', ['$http', '$q', '$timeout', 'CommonService', function ($http, $q, $timeout, commonService) {
        return {
            saveAttendanceFillInfo: saveAttendanceFillInfo,
            getOnlineRmTime: getOnlineRmTime
        };
        function getOnlineRmTime(departmentId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/department-online-date/" + departmentId)
                .success(function (result) {
                    if (result && result.onLineRMDate && result.isValid == 1) {
                        deferred.resolve(result.onLineRMDate);
                    } else {
                        deferred.resolve(null);
                    }
                });
            return deferred.promise;
        }
        function saveAttendanceFillInfo(param, isNewAttendanceFill) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + "/" + (isNewAttendanceFill ? "new-" : "") + "attendance-fill-save", param)
                .success(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

    }]);
})(window);