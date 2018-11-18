'use strict';

(function (w) {
    w.VkrmsApp.factory('PublicHolidayService', ['$http', function ($http) {
        return {
            loadByYear: function (year) {
                return $http.get(apiBaseUrl + "/public-holiday", {
                    params: {year: year}
                });
            },
            deleteById: function (id) {
                return $http.delete(apiBaseUrl + "/public-holiday/" + id);
            },
            create: function (data) {
                return $http.post(apiBaseUrl + "/public-holiday", data);
            },
            modify: function (data) {
                return $http.put(apiBaseUrl + "/public-holiday/" + data.id, data);
            }
        };
    }]);
})(window);
