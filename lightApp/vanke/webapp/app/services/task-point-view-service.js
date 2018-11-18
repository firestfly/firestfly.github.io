'use strict';
(function (w) {
    w.VkrmsApp.factory('TaskPointViewService', ['$http', 'CommonService', '$q', function ($http, commonService, $q) {
        return {
            exportTaskPointView: exportTaskPointView,
            markTaskStatus: markTaskStatus
        };
        function exportTaskPointView(params) {
            var url = baseUrl + "/file/export-task-point-view";
            commonService.downloadFile(url, params);
        }

        function markTaskStatus(params) {
            var deferred = $q.defer();

            $http.put(apiBaseUrl + '/task-point-view/mark-task-status', params).success(function (data) {
                deferred.resolve(data)
            }).error(function (data) {
                deferred.reject(data)
            });

            return deferred.promise;
        }
    }]);
})(window);
