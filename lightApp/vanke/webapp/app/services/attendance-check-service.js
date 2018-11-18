'use strict';
(function (w) {
    w.VkrmsApp.factory('AttendanceTaskService', ['$http', 'CommonService', 'UserService', '$rootScope', function ($http, commonService, userService, $scope) {
        return {
            exportAttendanceCheck: function (params) {
                var url = baseUrl + "/file/attendanceResultExport";
                commonService.downloadFile(url, params);
            }
        };
    }]);
})(window);
