'use strict';
(function (w) {
    w.VkrmsApp.factory('WealthLockCycleService', ['$http', function ($http) {
        return {
            searchPage: function (params) {
                var url = apiBaseUrl + "/wealth-lock-cycle";
                return $http.get(url, {params: params});
            },
            deleteById: function (id) {
                return $http.delete(apiBaseUrl + "/wealth-lock-cycle/" + id);
            },
            create: function (data) {
                return $http.post(apiBaseUrl + "/wealth-lock-cycle", data);
            },
            modify: function (data) {
                return $http.put(apiBaseUrl + "/wealth-lock-cycle/" + data.wealth_lock_id, data);
            }
        };
    }]);
})(window);
