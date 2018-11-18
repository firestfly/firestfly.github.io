'use strict';
(function (w) {
    w.VkrmsApp.factory('AttendanceLockCollectService', ['$http', function ($http) {
        return {
            getAll: function () {
                return $http.get(apiBaseUrl + "/attendance-lock-collect", {
                    params: {}
                });
            },
            deleteById: function (id) {
                return $http.delete(apiBaseUrl + "/attendance-lock-collect" + id);
            },
            create: function (data) {
                return $http.post(apiBaseUrl + "/attendance-lock-collect", data);
            },
            modify: function (data) {
                return $http.put(apiBaseUrl + "/attendance-lock-collect" + data.id, data);
            }
        };
    }]);
})(window);
