'use strict';

VkrmsApp.factory('CommonService', ['$rootScope', '$http', '$q', '$modal', 'UserService', 'ngToast', function ($rootScope, $http, $q, $modal, UserService, ngToast) {
    var holidayType18 = [
        {code: 'HOLIDAY_ALTERNATE_HOLIDAY', name: '月休'},
        {code: 'HOLIDAY_ADJUSTABLE', name: '调休假'},
        {code: 'HOLIDAY_STATUTORY_ANNUAL', name: '法定年休假'},
        {code: 'HOLIDAY_PAY_ANNUAL', name: '额外带薪年休假'},
        {code: 'HOLIDAY_SPRING_FESTIVAL', name: '春节调休假'},
        {code: 'HOLIDAY_CARRY_OVER', name: '结转年休假'},
        {code: 'HOLIDAY_MARRIAGE', name: '婚假'},
        {code: 'HOLIDAY_FUNERAL', name: '丧假'},
        {code: 'HOLIDAY_MATERNITY', name: '产假'},
        {code: 'HOLIDAY_NURSING', name: '护理假'},
        {code: 'HOLIDAY_CONTRACEPTION', name: '节育假'},
        {code: 'HOLIDAY_FAMILY_PLANNING', name: '计划生育假'},
        {code: 'HOLIDAY_ORDINARY_SICK', name: '普通病假或医疗期外'},
        {code: 'HOLIDAY_STATUTORY_SICK', name: '法定病假医疗期'},
        {code: 'HOLIDAY_INDUSTRIAL_INJURY', name: '法定工伤医疗期'},
        {code: 'HOLIDAY_PRIVATE_AFFAIR', name: '事假'},
        {code: 'HOLIDAY_OTHER_PAY', name: '其他带薪假'},
        {code: 'HOLIDAY_DAY_RELEASE', name: '脱产学习假'},
        {code: 'HOLIDAY_HOME', name: '探亲假'}
    ];
    var factory = {
        storageSearchStatus: function (scope, customData) {
            if (typeof customData === "undefined") {
                // 不传customData时存储默认字段
                customData = {
                    selectedCompanies: scope.selectedCompanies,
                    selectedDepartments: scope.selectedDepartments,
                    departments: scope.departments,
                    selectedGroups: scope.selectedGroups,
                    beginDate: factory.getSelectedDates().beginDate,
                    endDate: factory.getSelectedDates().endDate,
                    wealthCompleteBeginDate: factory.getWealthCompleteTimeSelectedDates().beginDate,
                    wealthCompleteEndDate: factory.getWealthCompleteTimeSelectedDates().endDate,
                    keywords: scope.keywords,
                    jobStatus: scope.jobStatus,
                    isAdjustJobLevel: scope.isAdjustJobLevel,
                    selectedStatus: scope.selectedStatus,
                    selectedType: scope.selectedType,
                    selectedStandardWorkJobs: scope.selectedStandardWorkJobs,
                    selectedLockStatus: scope.selectedLockStatus,
                    selectedTaskWealthType: scope.selectedTaskWealthType,
                    selectedLockCycle: scope.selectedLockCycle,
                    searchLockName: scope.searchLockName,
                    category: scope.category,
                    isValidArea: scope.isValidArea,
                    attendanceType: scope.attendanceType,
                    selectedAttendanceResult: scope.selectedAttendanceResult,
                    isAttendanceTime: scope.isAttendanceTime,
                    selectedWWorkHourSystem: scope.selectedWWorkHourSystem,
                    selectedApprovalStatus: scope.selectedApprovalStatus,
                    selectedDate: scope.selectedDate,
                    workHourStart: scope.workHourStart,
                    workHourEnd: scope.workHourEnd,
                    wealthStart: scope.wealthStart,
                    wealthEnd: scope.wealthEnd,
                    currentPage: scope.currentPage,
                    selectedLieuQuota: scope.selectedLieuQuota,
                    selectedOnlyLockCycle: scope.selectedOnlyLockCycle,
                    taskStatus: scope.taskStatus,
                    selectedOtherHolidayType: scope.selectedOtherHolidayType,
                    selectedHolidaySixteen: scope.selectedHolidaySixteen,
                    selectedHolidayTwo: scope.selectedHolidayTwo,
                    selectedCityCompanies: scope.selectedCityCompanies,
                    isDockingWage: scope.isDockingWage,
                    isValid: scope.isValid,
                    quotaLockStatus: scope.quotaLockStatus,
                    selectedLeaveType: scope.selectedLeaveType,
                    selectedExportStatus: scope.selectedExportStatus,
                    isOnLineRM: scope.isOnLineRM
                }
            }
            if (typeof customData === "object") {
                sessionStorage["searchState_" + location.hash] = JSON.stringify(customData);
            }
        },
        // applySearchStatus只对不使用common-search-bar的搜索栏使用
        applySearchStatus: function (scope, targetLocation) {
            var cacheObj = sessionStorage["searchState_" + (targetLocation ? targetLocation : location.hash)];
            if (cacheObj) {
                try {
                    cacheObj = JSON.parse(cacheObj);
                } catch (e) {
                    console.error(e);
                }
            }
            if (cacheObj && typeof cacheObj === "object" && cacheObj.constructor === Object) {
                angular.extend(scope, cacheObj);
            }
        },
        getIds: function (data, key) {
            if (data) {
                var arr = [];

                angular.forEach(data, function (item) {
                    if (item[key]) {
                        arr.push(item[key]);
                    }
                });

                return arr;
            }
        },
        updateAuthorizedOrganizations: function (displaylist, authorizedList) {
            var childKey = "department_id";
            var listKey = "departments";
            var authorizedIds = factory.getIds(authorizedList, childKey);

            angular.forEach(displaylist, function (parent) {
                var key = "isSelected";
                var data = parent[listKey];
                var i = data.length;

                while (i--) {
                    var item = data[i];
                    var index = authorizedIds.indexOf(item[childKey]);

                    if (item[key]) {
                        if (index < 0) {
                            authorizedIds.push(item[childKey]);
                        }
                    } else {
                        if (index >= 0) {
                            authorizedIds.slice(i, 1);
                        }
                    }
                }
            });
            return authorizedIds;
        },
        getAppliedIds: function (id, dataArr) {
            var arr = [];
            for (var i = 0, len = dataArr.length; i < len; i++) {
                if (id == dataArr[i].ruleId) {
                    arr = dataArr[i].appliedIds;
                    break;
                }
            }
            return arr;
        },
        getEffectAttendanceList: function () {
            var deferred = $q.defer();
            UserService.getUserEmployee().then(function (result) {
                if (result.loginMobile == 15814339789) {
                    return "/attendance-lock-cycle-all"
                } else {
                    return "/attendance-lock-cycle-later"
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
        },
        getOldEffectAttendanceList: function () {
            var deferred = $q.defer();
            UserService.getUserEmployee().then(function (result) {
                if (result.loginMobile == 15814339789) {
                    return "/attendance-lock-cycle-all"
                } else {
                    return "/attendance-lock-cycle-include-later"
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
        },
        getTempEffectAttendanceList: function () {
            var deferred = $q.defer();
            UserService.getUserEmployee().then(function (result) {
                if (result.loginMobile == 15814339789) {
                    return "/attendance-lock-cycle-all"
                } else {
                    return "/attendance-lock-cycle-include?date=2017-06-21"
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
        },
        isEmpty: function (obj) {
            if (!obj) return true;
            for (var prop  in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return JSON.stringify(obj) === JSON.stringify({});
        },
        cancatEffectAttendance: function (effectAttendance) {
            var temp = [];
            if (effectAttendance && effectAttendance.length) {
                for (var idx = 0, len = effectAttendance.length; idx < len - 1; idx++) {
                    if (+new Date(effectAttendance[idx].replace(/-/g, "/")) + 24 * 60 * 60 * 1000 >= +new Date(effectAttendance[idx + 1].replace(/-/g, "/"))) {
                        idx += 1;
                    } else {
                        temp.push(effectAttendance[idx]);
                    }
                }
                temp.push(effectAttendance.pop());
                var temp2 = [];
                for (var i = 0; i < temp.length - 1; i++) {
                    temp2.push(temp[i].replace(/\//g, "-") + "—" + temp[i + 1].replace(/\//g, "-"));
                    i++;
                }
                return temp2.join("<br>");
            }
        },
        initOrganizationsWithSelectTag: function (displaylist, authorizedList, routeParamsId) {
            angular.forEach(displaylist, function (authorizedCompanies) {
                angular.forEach(authorizedCompanies.departments, function (department) {
                    for (var i = 0; i < authorizedList.length; i++) {
                        if (authorizedList[i].appliedIds.indexOf(department.department_id) >= 0) {
                            if (authorizedList[i].ruleId == routeParamsId) {
                                department.isSelected = true;
                            } else {
                                department.ruleName = authorizedList[i].ruleName;
                                department.isDisabled = true;
                            }
                            break;
                        }
                    }
                })
            });
        },
        httpGet: function (api, callback) {
            var data,
                deferred = $q.defer();
            $http.get(apiBaseUrl + '/' + api)
                .success(function (result) {
                    if (callback) {
                        data = callback(result);
                    } else {
                        data = result;
                    }
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        httpPost: function (api, data) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + '/' + api, data)
                .success(function (result) {
                    deferred.resolve(result);
                });
            return deferred.promise;
        },
        httpPut: function (api, data) {
            var deferred = $q.defer();
            $http({
                url: apiBaseUrl + '/' + api,
                method: "PUT",
                data: data
            }).success(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getIndicator: function (params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/experience-search/experience-indicator", {
                params: params
            })
                .success(function (response) {
                    deferred.resolve(response);
                })
                .error(function (response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        },
        getExperienceStandardWorkJobs: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/standard-post', {cache: true})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getCityCompany: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/region', {cache: true})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getExperienceVerifyState: function () {
            return {
                "2": "通过",
                "3": "不通过"
            }
        },
        getSelectedDates: function () {
            var _scheduledatepicker = $('#scheduledatepicker');
            var selectedDateStart = utils.formatDate(_scheduledatepicker.length && _scheduledatepicker.find('input[name=start]').datepicker('getDate') || null),
                selectedDateEnd = utils.formatDate(_scheduledatepicker.length && _scheduledatepicker.find('input[name=end]').datepicker('getDate') || null);
            return {"beginDate": selectedDateStart, "endDate": selectedDateEnd};
        },
        getWealthCompleteTimeSelectedDates: function () {
            var _wealthCompleteTimeDatepicker = $('#wealthCompleteTimeDatepicker');
            var selectedDateStart = utils.formatDate(_wealthCompleteTimeDatepicker.length && _wealthCompleteTimeDatepicker.find('input[name=start]').datepicker('getDate') || null),
                selectedDateEnd = utils.formatDate(_wealthCompleteTimeDatepicker.length && _wealthCompleteTimeDatepicker.find('input[name=end]').datepicker('getDate') || null);
            return {"beginDate": selectedDateStart, "endDate": selectedDateEnd};
        },
        getlieuTypeList: function () {
            var deferred = $q.defer();

            $http.get(apiBaseUrl + '/dictionaries?code=HOLIDAY')
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getOtherHolidayType: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/dictionaries?code=HOLIDAY_OTHER', {cache: true})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getTaskWealthType: function () {
            var deferred = $q.defer();
            $http.get('dictionary?code=NOT_TASK_WEALTH_TYPE', {cache: true})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getAttendanceResult: function () {
            var deferred = $q.defer();
            $http.get('dictionary?code=ATTENDANCE_RESULT', {cache: true})
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getHolidayWay: function (start, end) {
            return holidayType18.slice(start, end)
        },
        getCompanies: function () {
            var data,
                deferred = $q.defer();
            $http.get(apiBaseUrl + "/users/-", {cache: true})
                .success(function (user) {
                    data = user.authorizedCompanies;
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        getExperienceOrigin: function () {
            var deferred = $q.defer();
            deferred.resolve({
                "0": "人工录入",
                "1": "自动抓取"
            });
            return deferred.promise;
        },
        getTaskTypeOne: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/task-point-type/one", {cache: true})
                .success(function (result) {
                    result && result.unshift({
                        id: 0,
                        name: "全部一级任务类型",
                        childrenIds: null
                    });
                    deferred.resolve(result);
                });
            return deferred.promise;
        },
        getTaskTypeTwo: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/task-point-type/two", {cache: true})
                .success(function (result) {
                    result && result.unshift({
                        id: 0,
                        name: "全部二级任务类型",
                        childrenIds: null
                    });
                    deferred.resolve(result);
                });
            return deferred.promise;
        },
        getDictionarys: function (){
          return {
              //工时制
              workingHours: {
                  'STANDARD_WORKING_HOURS': '标准工时制',
                  'COMPREHENSIVE_WORKING_HOURS': '综合工时制',
                  'UNTIME_WORKING_HOURS': '不定时工时制',
              },
              //工资类别
              salaryType: {
                  '04': '非O序列',
                  '05': 'O序列',
                  'OA': 'OA序列',
                  'OB': 'OB序列',
                  'OC': 'OC序列',
                  'OD': 'OD序列',
                  'OE': 'OE序列',
                  'OF': 'OF序列',
                  'OG': 'OG序列',
              }
          }
        },
        getTaskTypeLast: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/task-point-type/last", {cache: true})
                .success(function (result) {
                    deferred.resolve(result);
                });
            return deferred.promise;
        },
        getAllTaskType: function () {
            var deferred = $q.defer();
            $q.all([factory.getTaskTypeOne(), factory.getTaskTypeTwo(), factory.getTaskTypeLast()]).then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        getLockCycle: function (data) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/lock-cycle",data)
                .success(function (result) {
                    deferred.resolve(result);
                });
            return deferred.promise;
        },
        getLockCycleType: function (data) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/lock-cycle-type", data)
                .success(function (result) {
                    deferred.resolve(result);
                });
            return deferred.promise;
        },
        filterArrayById: function (ids, arr) {
            var result = [];
            angular.forEach(arr, function (item) {
                if (ids && ids.indexOf(item.id) >= 0) {
                    result.push(item);
                }
            });
            return result;
        },
        initTimepicker: function (selector, config) {
            config = angular.extend({
                minuteStep: 1,
                showSeconds: false,
                showMeridian: false,
                defaultTime: 'current'
            }, config || {});
            $(selector).timepicker(config);
        },
        initDatepicker: function (selector) {
            $(selector).datepicker({
                language: 'zh-CN',
                todayHighlight: true,
                clearBtn: true,
                format: "yyyy年mm月dd日"
            });
        },
        getAttendanceFillInfo: function (id) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/attendance-fill-info/" + id)
                .success(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        getEmployeeSap: function (params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + "/search-users", {cache: true, params: params})
                .success(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        getWorkGroups: function () {
            var data,
                deferred = $q.defer();
            $http.get(apiBaseUrl + "/users/-", {cache: true})
                .success(function (user) {
                    data = user.authorizedWorkGroups;
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        getAllDepartments: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/allDepartments', {cache: true}).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getAllWorkGroups: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/workgroups', {cache: true}).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getWorkJobs: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/workJobs', {cache: true}).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getValidWorkJobs: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/validWorkJobs', {cache: true}).success(function (result) {
                angular.forEach(result, function (item) {
                    if (item.workJobShortName) {
                        item.workJobName = item.workJobName + item.workJobShortName
                    }
                })
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getJobLevels: function (postId, departmentId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/jobLevels/' + postId + '/' + departmentId).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getSkills: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/skills', {cache: true}).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getExperienceLevelLogs: function (employeeId) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/employee/experience-level-operation-log/' + employeeId).success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getCityData: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/privinceCityAreas', {cache: true})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getStandardWorkJobs: function () {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/standard-work-jobs', {cache: true})
                .success(function (data) {
                    angular.forEach(data, function (item) {
                        if (item.workJobShortName) {
                            item.workJobName = item.workJobName; //  + item.workJobShortName
                        }
                    })
                    deferred.resolve(data);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getWorkJob: function (params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/work-jobs', {
                cache: true,
                params: params
            }).success(function (data) {
                    angular.forEach(data, function (item) {
                        if (item.workJobShortName) {
                            item.workJobName = item.workJobName;
                        }
                    })
                    deferred.resolve(data);
                }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        getBuypeWorkJob: function (params) {
            var deferred = $q.defer();
            $http.get(apiBaseUrl + '/work-jobs-butype', {
                cache: true,
                params: params
            }).success(function (data) {
                angular.forEach(data, function (item) {
                    if (item.workJobShortName) {
                        item.workJobName = item.workJobName
                    }
                })
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },
        createModal: function (customConfig) {
            var basicConfig = {
                'animation': true,
                'backdrop': 'static'
            };
            var config = angular.extend(basicConfig, customConfig);
            return $modal.open(config);
        },
        confirm: function (config) {
            var defaultConfig = {
                showCloseBtn: true
            }
            config = angular.extend(defaultConfig, config);
            factory.createModal({
                'templateUrl': 'confirmDialog.html',
                'controller': 'confirmModalController',
                'size': 'sm',
                'resolve': {
                    'config': function () {
                        return config;
                    }
                }
            });
        },
        alert: function (customConfig) {
            ngToast.show(customConfig.content, customConfig.type, customConfig.time);
            // $("#commonModal .modal-body p").html(customConfig.content);
            // $("#commonModal .modal-body i").addClass(customConfig.icon);
            //
            // if (customConfig.iconColor == "icon-red") {
            //     $("#commonModal .modal-body i").css("color", "#d5504d");
            // } else {
            //     $("#commonModal .modal-body i").css("color", "#8fc81f");
            //
            // }
            //
            // if (customConfig.size == 'lg') {
            //     $("#commonModal .modal-dialog").css('width', '600px');
            // } else {
            //     $("#commonModal .modal-dialog").css('width', '300px');
            // }
            // $("#commonModal").modal();
        },
        progress: function (type) {
            var progressBar = document.getElementById('progressBar');
            if (type == 'start') {
                _ajaxCount++;
                progressBar.classList.add('is-active')
            } else if (type == 'end') {
                $rootScope._ajaxCount += 1;
                progressBar.addEventListener("animationiteration", function (e) {
                    if ($rootScope._ajaxCount == _ajaxCount) {
                        _ajaxCount = 0;
                        $rootScope._ajaxCount = 0;
                        progressBar.classList.remove('is-active')
                    }
                }, false);

            }
        },
        isArray: function (o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        },
        datePlus: function(date, plus){
          var date = new Date(date);
          date.setDate(date.getDate() + plus);
          return date;
        },
        downloadFile: function (url, commonSearchParams) {
            var form = document.getElementById("downloadFileForm");
            $(form).empty();
            form.action = url;
            for (var key in commonSearchParams) {
                if (!commonSearchParams.hasOwnProperty(key)) {
                    return;
                }
                var attrName = key;
                var attrValue = commonSearchParams[key];
                var hiddenEle;
                if (this.isArray(attrValue)) {
                    for (var i = 0; i < attrValue.length; i++) {
                        hiddenEle = document.createElement("input");
                        hiddenEle.setAttribute("type", "hidden");
                        hiddenEle.setAttribute("name", attrName);
                        hiddenEle.setAttribute("value", attrValue[i]);
                        form.appendChild(hiddenEle);
                    }
                } else {
                    hiddenEle = document.createElement("input");
                    hiddenEle.setAttribute("type", "hidden");
                    hiddenEle.setAttribute("name", attrName);
                    hiddenEle.setAttribute("value", attrValue);
                    form.appendChild(hiddenEle);
                }
            }
            form.submit();
        },
        fmtDate: function (date, fmt) {
            var reg = /^\d{4}(-|[\u4e00-\u9fa5])\d{1,2}(-|[\u4e00-\u9fa5])\d{1,2}/
            if (reg.test(date)) {
                date = new Date(date.replace(/-|[\u4e00-\u9fa5]/g, '/'))
            }
            date = new Date(date)
            var o = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                'S': date.getMilliseconds() // 毫秒
            }
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                }
            }
            return fmt
        }
    };
    return factory;
}]);

VkrmsApp.controller('confirmModalController', ['$scope', '$modalInstance', 'config', function ($scope, $modalInstance, config) {

    $scope.title = config.title ? config.title : '系统提示';
    $scope.icon = config.icon ? config.icon : '';
    $scope.content = config.content ? config.content : '提示内容';

    $scope.showButton = config.showButton ? config.showButton : true;
    $scope.okText = config.okText ? config.okText : '确定';
    $scope.cancelText = config.cancelText ? config.cancelText : '取消';
    $scope.showCloseBtn = config.showCloseBtn;

    $scope.ok = function () {
        config.callback && config.callback();
        $modalInstance.close();
    };

    $scope.cancel = function () {
        config.cancel && config.cancel()
        $modalInstance.dismiss();
    };
    $scope.confirmClose = function () {
        $modalInstance.dismiss();
    }
}]);