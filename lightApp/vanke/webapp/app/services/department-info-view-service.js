'use strict';
(function (w) {
    w.VkrmsApp.factory('DepartmentInfoViewService', ['$http', 'CommonService', '$q', 'UserService', function ($http, commonService, $q, UserService) {
        return {
            getDepartmentInfo: getDepartmentInfo,
            saveDepartmentInfo: saveDepartmentInfo,
            getPartner: getPartner,
            getPageLimit: getPageLimit,
            getEffectAttendanceList: getEffectAttendanceList,
            exportSheet: exportSheet,
            checkIsOnLineRM: checkIsOnLineRM,
            getBU: getBU
        };

        function getBU() {
            return {
                "0": "全部",
                "1": "BU1",
                "214": "BU2",
                "216": "BU3",
                "211": "BU4",
                "215": "BU5",
                "213": "BU6",
                "241": "BU2.1",
                "2": "BU2.2",
                "243": "BU2.3",
                "244": "BU3.1",
                "245": "BU3.2",
                "251": "BU4.1",
                "252": "BU4.2",
                "253": "BU4.3",
                "254": "BU4.4",
                "255": "BU4.5",
                "261": "BU5.1",
                "262": "BU5.2",
                "221": "BS",
                "222": "BS",
                "223": "BS",
                "224": "BS",
                "225": "BS",
                "226": "BS",
                "227": "BS",
                "231": "BD",
                "232": "BD",
                "233": "BD",
                "234": "BD",
                "235": "BD"

            };
        }
        function checkIsOnLineRM(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/department-info-check", {params: params})
                .success(function (result) {
                    deferred.resolve(result);
                });
            return deferred.promise;
        }
        function getEffectAttendanceList() {
            var deferred = $q.defer();
            UserService.getUserEmployee().then(function (result) {
                if (result.loginMobile == 15814339789) {
                    return "/attendance-lock-cycle-all"
                } else {
                    return "/attendance-lock-cycle-include-early?name=201704"
                }
            }).then(function (str) {
                $http
                    .get(apiBaseUrl + str, {cache: true})
                    .success(function (response) {
                        deferred.resolve(response);
                    })
                    .error(function (response) {
                        deferred.reject(response);
                    });
            });
            return deferred.promise;
        }
        function getPageLimit(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/page-part-limit", {params: params})
                .success(function (result) {
                    deferred.resolve(1);
                });
            return deferred.promise;
        }

        function exportSheet(params) {
            var url = baseUrl + "/file/file-export-department-info";
            commonService.downloadFile(url, params);
        }

        function saveDepartmentInfo(params) {
            var deferred = $q.defer();
            if (params.departmentInfoDTOList[0].departmentId) {
                $http.put(apiBaseUrl + "/department-info-setting", params)
                    .success(function (data) {
                        deferred.resolve(data);
                    });
            } else {
                $http.post(apiBaseUrl + "/department-info-setting", params)
                    .success(function (data) {
                        deferred.resolve(data);
                    });
            }
            return deferred.promise;
        }

        function getPartner(companyId, buType) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/company-partner/" + companyId + "/" + buType)
                .success(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        function getDepartmentInfo(params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/department-info-setting", {params: params})
                .success(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }
    }]);
})(window);
