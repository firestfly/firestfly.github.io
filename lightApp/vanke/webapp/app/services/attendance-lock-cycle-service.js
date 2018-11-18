'use strict';
(function (w) {
    w.VkrmsApp.factory('AttendanceLockCycleService', ['$http', function ($http) {
        return {
            searchPage: function (params) {
                var url = apiBaseUrl + "/attendance-lock-cycle";
                return $http.get(url, {params: params});
            },
            deleteById: function (id) {
                return $http.delete(apiBaseUrl + "/attendance-lock-cycle/" + id);
            },
            create: function (data) {
                return $http.post(apiBaseUrl + "/attendance-lock-cycle", data);
            },
            modify: function (data) {
                return $http.put(apiBaseUrl + "/attendance-lock-cycle/" + data.attendance_lock_id, data);
            }
        };
    }]);
})(window);
