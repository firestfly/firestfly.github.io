'use strict';
(function (w) {
    w.VkrmsApp.factory('TaskIncentiveService', ['$http', 'CommonService', 'UserService', '$rootScope', function ($http, commonService, userService, $scope) {
        return {
            exportTaskIncentive: function (params) {
                var url = baseUrl + "/file/export-taskSummary";
                commonService.downloadFile(url, params);
            }
        };
    }]);
})(window);
