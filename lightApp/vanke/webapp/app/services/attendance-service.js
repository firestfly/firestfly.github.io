'use strict';

(function (w) {
    w.VkrmsApp.factory('AttendanceService', ['$http', '$q', '$timeout', 'CommonService', 'DataTableService', '$rootScope', function ($http, $q, $timeout, commonService, dataTableService, $rootScope) {
        return {
            dataTableConfig: function () {
                return {
                    "ajax": {
                        "beforeSend": function () {
                            $rootScope.loading = true;
                        },
                        "url": 'attendances',
                        "method": 'POST',
                        "headers": utils.generateHeaders(),
                        "callback": function () {
                            $rootScope.loading = false;
                        }
                    },
                    "columns": [
                        {data: 'attendanceDetailId'},
                        {data: 'employeeName'},
                        {data: 'attendanceDateTime'},
                        {data: 'isAttendanceTime'},
                        {data: 'attendanceAddress'},
                        {data: 'isValidArea'},
                        {data: 'attendanceType'},
                        {data: 'employeeId'},
                        {data: 'sapId'},
                        {data: 'company'},
                        {data: 'department'},
                        {data: 'workGroup'},
                        {data: 'edit'}
                    ],
                    "columnDefs": [
                        {
                            "targets": 0,
                            "render": function (data, type, row) {
                                return row[7]
                            },
                            "visible": false
                        }, {
                            "targets": 1,
                            "render": function (data, type, row) {
                                return row[2]
                            }
                        }, {
                            "targets": 2,
                            "render": function (data, type, row) {
                                return row[8].substring(0, row[8].length - 2)
                            }
                        }, {
                            "targets": 3,
                            "render": function (data, type, row) {
                                return row[12] == "1" ? "是" : "否"
                            }
                        }, {
                            "targets": 4,
                            "render": function (data, type, row) {
                                return row[9]
                            }
                        }, {
                            "targets": 5,
                            "render": function (data, type, row) {
                                var attendanceType = "";
                                switch (row[14]) {
                                    case '0':
                                        attendanceType = '助这儿GPS签到';
                                        break;
                                    case '1':
                                        attendanceType = '手动校正';
                                        break;
                                    case '2':
                                        attendanceType = '手动补签';
                                        break;
                                    case '3':
                                        attendanceType = '系统补签到';
                                        break;
                                    case '4':
                                        attendanceType = '助这儿WIFI签到';
                                        break;
                                    case '5':
                                        attendanceType = '拍照打卡';
                                        break;
                                    default :
                                        break;
                                }
                                return attendanceType
                            }
                        }, {
                            "targets": 6,
                            "render": function (data, type, row) {
                                var isValid = "";
                                switch (row[13]) {
                                    case '0':
                                        isValid = '否';
                                        break;
                                    case '1':
                                    case '2':
                                    case '3':
                                    case '4':
                                        isValid = '是';
                                        break;
                                    default:
                                        isValid = '是';
                                        break;
                                }
                                return isValid
                            }
                        }, {
                            "targets": 7,
                            "render": function (data, type, row) {
                                return row[0]
                            }
                        }, {
                            "targets": 8,
                            "render": function (data, type, row) {
                                return row[1]
                            }
                        }, {
                            "targets": 9,
                            "render": function (data, type, row) {
                                return row[3]
                            }
                        }, {
                            "targets": 10,
                            "render": function (data, type, row) {
                                return row[4]
                            }
                        }, {
                            "targets": 11,
                            "render": function (data, type, row) {
                                return row[5]
                            }
                        }, {
                            "targets": 12,
                            "render": function (data, type, row) {
                                // 拍照打卡未审核时显示'--'
                                if (row[14] == "5" && row[15] != "3") {
                                    return '--';
                                }
                                // 拍照进行过审核时显示审核详情
                                if (row[14] == "5" && row[15] == "3") {
                                    return '<a href="javascript:;" class="approvalDetail" data-id="' + row[7] + '">审核详情</a>';
                                }
                                if (row[13] == "1" || row[13] == "3" || row[13] == "4") {
                                    return "--";
                                } else if (row[13] == "2") {
                                    return '<a href="javascript:;" class="openAttendanceFill" data-id="' + row[7] + '" data-name="' + row[2] + '">补签详情</a>';
                                } else {
                                    var edit;
                                    switch (row[15]) {
                                        case "0":
                                            edit = "校正";
                                            break;
                                        case "1":
                                            edit = "取消校正";
                                            break;
                                        case "2":
                                            edit = "校正详情";
                                            break;
                                        default :
                                            break;
                                    }
                                    return '<a href="javascript:;" class="attendanceDetail" data-id="' + row[7] + '"data-date="' + row[8].split(" ")[0] + '">' + edit + '</a>';
                                }
                            }
                        }],
                    "scrollX": true
                }
            },
            initTable: function (tableName, config) {
                dataTableService.initDataTable(tableName, config);
            },
            getConfigurationByType: function () {
                var config = {
                    "title": "出勤查看",
                    "tableName": "attendance-adjust-details-table",
                    "api": "attendance-adjust-details",
                    "authorityUrl": "attendance-adjust-details",
                    "configUrl": "adjust-attendance",
                    "dto": "attendanceAdjustCommon",
                };
                return config;
            },
            openAttendanceFillDialog: function (api, dto) {
                commonService.createModal({
                    'templateUrl': 'attendanceFillView.html',
                    'controller': 'AttendanceFillViewController',
                    'resolve': {
                        'api': function () {
                            return api;
                        },
                        'dto': function () {
                            return dto;
                        }
                    }
                });
            },
            checkAttendanceFillInfo: function (id) {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + "/attendance-fill/" + id)
                    .success(function (data) {
                        deferred.resolve(data);
                    });
                return deferred.promise;
            },
            openAddDialog: function (api, authorityUrl, configUrl, dto, isNewAttendance) {
                var adjustAttendanceModal = commonService.createModal({
                    'templateUrl': 'adjust-attendance.html',
                    'controller': 'AdjustAttendanceController',
                    'resolve': {
                        'api': function () {
                            return api;
                        },
                        'dto': function () {
                            return dto;
                        },
                        'isNewAttendance': function () {
                            return isNewAttendance;
                        }
                    }
                });
                adjustAttendanceModal.result.then(function () {
                    //保存校正理由

                }, function (dismiss) {
                });
            },
            save: function (data) {
                var deferred = $q.defer();
                $http.post(apiBaseUrl + '/employee', data).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getOverlaies: function (data) {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + '/department-area-collect/' + data)
                    .success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
            getDepartmentMarkers: function (data) {
                var deferred = $q.defer();
                $http.post(apiBaseUrl + '/department-markers/' + data)
                    .success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
            getPhotoSignApprovalDetail: function (params) {
                var deferred = $q.defer();
                $http.get(apiBaseUrl + '/picture-sign-detail', {
                    params: params
                })
                    .success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }
    }]);
})(window);