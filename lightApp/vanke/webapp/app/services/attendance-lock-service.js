'use strict';
(function (w) {
    w.VkrmsApp.factory('AttendanceLockService', ['$http', function ($http) {
        return {
            /*getAll: function () {
                return $http.get(apiBaseUrl + "/attendance-lock", {
                    params: {}
                });
            },
            deleteById: function (id) {
                return $http.delete(apiBaseUrl + "/attendance-lock/" + id);
            },
            create: function (data) {
                return $http.post(apiBaseUrl + "/attendance-lock", data);
            },
            modify: function (data) {
                return $http.put(apiBaseUrl + "/attendance-lock/" + data.id, data);
            }*/
        };
    }]);
})(window);
