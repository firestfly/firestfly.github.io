'use strict';

VkrmsApp.directive('commonSearchBar', ['$timeout', '$rootScope', 'UserService', '$filter', 'CommonService', '$location', function ($timeout, $rootScope, userService, $filter, commonService, $location) {

    return {
        restrict: 'A',
        replace: 'true',
        templateUrl: baseUrl + '/partials/common-search-bar.html',
        link: function (scope, element, attrs) {
            var taskTypeOne, taskTypeTwo, taskTypeLast, taskTypeLastFilt, _ajaxFinishedCount = 0;
            var cacheObj = sessionStorage["searchState_" + location.hash];
            try {
                if (cacheObj) {
                    cacheObj = JSON.parse(cacheObj);
                }
            } catch (e) {
                console.error(e);
            }
            scope.ajaxFinishedCount = 0;
            scope.organizations = [];
            scope.departments = [];
            scope.groups = [];
            scope.keywords = "";
            scope.jobStatus = "";
            scope.taskStatus = "";
            scope.selectedCompanies = [];
            scope.selectedDepartments = [];
            scope.selectedGroups = [];
            scope.showAttendanceType = attrs.showAttendanceType;
            scope.showAttendanceStatus = attrs.showAttendanceStatus;
            scope.showScheduleStatus = attrs.showScheduleStatus;
            scope.showAttendanceResult = attrs.showAttendanceResult;
            scope.showJobStatus = attrs.showJobStatus;
            scope.showStaffType = attrs.showStaffType;
            scope.showApprovalStatus = attrs.showApprovalStatus;
            scope.showVacationOrderStatue = attrs.showVacationOrderStatue;
            scope.showLieuLeaveRule = attrs.showLieuLeaveRule;
            scope.isAdjustJobLevel = attrs.isAdjustJobLevel;
            scope.showOneLockStatus = attrs.showOneLockStatus;
            scope.showWorkTwoOne = attrs.showWorkTwoOne;
            scope.isValidArea = "";
            scope.lieuLineType = [];
            scope.attendanceType = "";
            scope.isAttendanceTime = "";
            scope.switchTableOrMapValue = 0;
            scope.hideDepartment = attrs.hideDepartment;
            scope.hideDateRange = attrs.hideDateRange;
            scope.hideGroups = attrs.hideGroups;
            scope.showLieuLineType = attrs.showLieuLineType;
            scope.showWorkJobs = attrs.showWorkJobs;
            scope.showStandardWorkJobs = attrs.showStandardWorkJobs;
            scope.showStandardWorkJobsOne = attrs.showStandardWorkJobsOne;
            scope.isFirstRow = attrs.isFirstRowOptBtn;
            scope.showSearchInputRowOne = attrs.showSearchInputRowOne;
            scope.showDepartmentSearchInputRowOne = attrs.showDepartmentSearchInputRowOne;
            scope.hideSearchInput = attrs.hideSearchInput;
            scope.showOneLockStatus = attrs.showOneLockStatus;
            scope.hideExportBtn = attrs.hideExportBtn;
            scope.extendButtons = attrs.extendButtons;
            scope.weekRange = attrs.weekRange;
            scope.operationButtons = attrs.operationButtons;
            scope.operationDiv = attrs.operationDiv;
            scope.showTaskType = attrs.showTaskType;
            scope.isCompanySelectpickerMultipe = true;
            scope.isDepartmentSelectpickerMultipe = true;
            scope.showAdjustJobLevel = attrs.showAdjustJobLevel;
            scope.showSwitchTableOrMap = attrs.showSwitchTableOrMap;
            scope.showEmployeeSap = attrs.showEmployeeSap;
            scope.hideOptBtn = attrs.hideOptBtn;
            scope.showLockCycle = attrs.showLockCycle;
            scope.showTaskWealthType = attrs.showTaskWealthType;
            scope.showIndicator = attrs.showIndicator;
            scope.showVerifyStatus = attrs.showVerifyStatus;
            scope.showRowTwoLieuQuota = attrs.showRowTwoLieuQuota;
            scope.showLockStatus = attrs.showLockStatus;
            scope.showLockBtn = attrs.showLockBtn;
            scope.showUnlockBtn = attrs.showUnlockBtn;
            scope.showWWorkHourSystem = attrs.showWWorkHourSystem;
            scope.showOnlyLockCycle = attrs.showOnlyLockCycle;
            scope.showLieuQuota = attrs.showLieuQuota;
            scope.showHolidayTwo = attrs.showHolidayTwo;
            scope.showHolidaySixteen = attrs.showHolidaySixteen;
            scope.showOtherHolidayType = attrs.showOtherHolidayType;
            scope.showExperienceStandardWorkJobs = attrs.showExperienceStandardWorkJobs;
            scope.showOnlyOneDay = attrs.showOnlyOneDay;
            scope.showWealthSection = attrs.showWealthSection;
            scope.showTaskStatus = attrs.showTaskStatus;
            scope.showWealthCompleteTimeDateRange = attrs.showWealthCompleteTimeDateRange;
            scope.showExportTemplateBtn = attrs.showExportTemplateBtn;
            scope.showImportTemplateBtn = attrs.showImportTemplateBtn;
            scope.showImportBtn = attrs.showImportBtn;
            scope.showCityCompany = attrs.showCityCompany;
            scope.hideCompany = attrs.hideCompany;
            scope.showIsValid = attrs.showIsValid;
            scope.showIsDockingWage = attrs.showIsDockingWage;
            scope.showEmployeeTransferType = attrs.showEmployeeTransferType;
            scope.showIsonlinerm = attrs.showIsonlinerm;
            scope.showBackBtn = attrs.showBackBtn;
            scope.backUrl = attrs.backUrl;
            scope.autoCheckDepartment = attrs.autoCheckDepartment == undefined;
            scope.showButype = attrs.showButype;
            if (scope.extendButtons) {
                scope.extendButton = scope.extendButtons.split('|')[0];
                scope.extendButtonText = scope.extendButtons.split('|')[1];
                scope.extendButtonClass = scope.extendButtons.split('|')[2] || null;
            }
            scope.vacationOrderStatue = [
                {id: 1, value: '休假单'},
                {id: 2, value: '撤假单'}
            ];
            scope.clear = function () {
                scope.departments = [];
                scope.selectedCompanies = [];
                scope.selectedDepartments = [];
                scope.selectedOnlyLockCycle = [];
                scope.selectedGroups = [];
                scope.selectedStandardWorkJobs = [];
                scope.keywords = "";
                scope.jobStatus = "";
                scope.isAdjustJobLevel = "";
                scope.isValidArea = "";
                scope.attendanceType = "";
                scope.isAttendanceTime = "";
                scope.switchTableOrMapValue = "0";
                scope.selectedHolidayTwo = '';
                scope.selectedHolidaySixteen = '';
                scope.selectedOtherHolidayType = {};
                scope.selectedCityCompanies = [];
                scope.selectedLieuQuota = [];
                scope.selectedLeaveType = [];
                scope.isOnLineRM = "";
                scope.isValid = "";
                scope.showButype = "";
                scope.isDockingWage = "";
                if (scope.showTaskType) {
                    scope.selectedTaskTypeOne = taskTypeOne[0];
                    scope.selectedTaskTypeTwo = taskTypeTwo[0];
                    scope.selectedTaskTypeLast = null;
                }
                if (scope.showEmployeeSap) {
                    scope.selectedEmployeeSap = null;
                    scope.employeeSap = [];
                }
                if (scope.showWWorkHourSystem) {
                    scope.selectedWWorkHourSystem = "";
                }
                if (scope.showTaskWealthType) {
                    scope.selectedTaskWealthType = null;
                }
                if (scope.showWealthSection) {
                    scope.wealthStart = null;
                    scope.wealthEnd = null;
                    scope.workHourStart = null;
                    scope.workHourEnd = null;
                }
                if (scope.showLieuLineType) {
                    scope.selectedLieuLineType = scope.lieuLineType[0];
                }
                if (scope.showApprovalStatus) {
                    scope.selectedApprovalStatus = [];
                }
                if (scope.showVacationOrderStatue) {
                    scope.selectedVacationOrderStatue = null
                }
                if (scope.showLieuLeaveRule) {
                    scope.selectedEmployeeTransferStatus = [];
                }
                if (scope.showEmployeeTransferType) {
                    scope.selectedEmployeeTransferType = [];
                }
                $timeout(function () {
                    $('#select-company').selectpicker('val', '');
                    scope.$broadcast('clear');
                    scope.$broadcast('companies-loaded');
                    scope.$broadcast('work-groups-loaded');
                    scope.$broadcast('standard-work-groups-loaded');
                }, 20)
            };
            scope.back = function () {
                if (scope.showBackBtn) {
                    location.href = scope.backUrl;
                }
            }

            if (attrs.afterRender) {
                $timeout(function () {
                    scope.$eval(attrs.afterRender);
                }, 0);
            }

            scope.searchFromEnterKey = function (e) {
                if (e.keyCode === 13) {
                    scope.search();
                }
            };
            scope.$on('companies-loaded', function () {
                $timeout(function () {
                    $('#select-company').selectpicker('refresh');
                    $("#select-department").selectpicker('refresh');
                    initSelectCompany(scope);
                }, 0, false);
            });
            scope.$on('work-groups-loaded', function () {
                $timeout(function () {
                    $('#select-group').selectpicker('refresh');
                }, 0, false);
            });
            scope.$on('standard-work-groups-loaded', function () {
                $timeout(function () {
                    $('#selected-workJobs,#selected-standardWorkJobs,#selected-standardWorkJobs-one').selectpicker('refresh');
                }, 0, false);
            });
            scope.$on('task-type-change', function () {
                $timeout(function () {
                    $("#taskTypeOne, #taskTypeTwo, #taskTypeLast").selectpicker("refresh");
                }, 30);
            });
            scope.$on('clear', function () {
                $timeout(function () {
                    $('.selectpicker', element).selectpicker('refresh');
                    /*
                     // 清除按钮点击后改为 不去除定案周期
                     $('#scheduledatepicker input,#localCycleDatepicker input').each(function () {
                     $(this).datepicker("clearDates");
                     });
                     */
                }, 0, false);
            });
            scope.$on('initData', function () {
                $('#select-company').selectpicker('refresh');
            });
            initCommonSearchBar();

            function initCommonSearchBar() {
                initCustomSelectPicker();
                $('.selectpicker', element).selectpicker();
                getLoginUserData();
                initWealthDatePicker("wealthCompleteTimeDatepicker");
                initDatePicker("scheduledatepicker", scope.weekRange);
                initLockCycleComponent("localCycleDatepicker");
                initOnlyLockCycle();
                initVerifyStatus();
                initIndicator();
                initLieuQuota();
                initHolidayTwo();
                initHolidaySixteen();
                initOtherHolidayType();
                initLieuLineType();
                addOperationButtons();
                addOperationDiv();
                watchAjaxFinished();
                initExperienceStandardWorkJobs();
                if (scope.showEmployeeSap) {
                    watchEmployeeSap();
                }
                if (scope.showTaskType) {
                    watchTaskType();
                }
                if (scope.showTaskWealthType) {
                    getTaskWealthType();
                }
                if (scope.showAttendanceResult) {
                    getAttendanceResult();
                }
                if (scope.showCityCompany) {
                    getCityCompany();
                }
            }

            function getCityCompany() {
                commonService
                    .getCityCompany()
                    .then(function (response) {
                        scope.cityCompanies = response
                    });
            }

            function initExperienceStandardWorkJobs() {
                commonService
                    .getExperienceStandardWorkJobs()
                    .then(function (response) {
                        scope.experienceStandardWorkJobs = response
                    });
            }

            function initLieuQuota() {
                if (!scope.showLieuQuota) {
                    return;
                }

                commonService
                    .getlieuTypeList()
                    .then(function (response) {
                        // 去掉月休跟历史休假
                        var flag = angular.copy(response.data)
                        scope.lieuQuotaList = filterHolidayType(flag);
                        if (scope.showWorkTwoOne) {
                            var arr = [];
                            angular.forEach(scope.lieuQuotaList, function (item) {
                                if (item.code != 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE') {
                                    arr.push(item)
                                }
                            })
                            scope.lieuQuotaList = arr;
                        }
                        scope.selectedLieuQuota = scope.selectedLieuQuota || [scope.lieuQuotaList[0]];
                        $timeout(function () {
                            $('#lieuQuota').selectpicker('refresh');
                        });
                    });
            }

            function filterHolidayType(item) {
                var result = []
                item.forEach(function (obj) {
                    if (obj.value != '月休' && obj.value != '历史休假') {
                        result.push(obj)
                    }
                })
                return result
            }

            function initHolidayTwo() {
                if (!scope.showHolidayTwo) {
                    return;
                }
                scope.holidayTwoList = commonService.getHolidayWay(0, 2);
                scope.selectedHolidayTwo = scope.selectedHolidayTwo || [scope.holidayTwoList[0]];
                $timeout(function () {
                    $('#HolidayTwo').selectpicker('refresh');
                });
            }

            function initHolidaySixteen() {
                if (!scope.showHolidaySixteen) {
                    return;
                }
                scope.holidaySixteenList = commonService.getHolidayWay(2);
                scope.selectedHolidaySixteen = scope.selectedHolidaySixteen || [scope.holidaySixteenList[0]];
                $timeout(function () {
                    $('#HolidaySixteen').selectpicker('refresh');
                });
            }

            function initOtherHolidayType() {
                if (!scope.showOtherHolidayType) {
                    return;
                }

                commonService
                    .getOtherHolidayType()
                    .then(function (response) {
                        scope.otherHolidayType = response.data;
                        // scope.selectedOtherHolidayType = scope.selectedOtherHolidayType || [scope.otherHolidayType[0]];
                        $timeout(function () {
                            $('#otherHolidayType').selectpicker('refresh');
                        });
                    });
            }

            function initLieuLineType() {
                if (!scope.showLieuLineType) {
                    return;
                }
                commonService
                    .getlieuTypeList()
                    .then(function (response) {
                        scope.lieuLineType = response;
                        scope.selectedLieuLineType = scope.selectedLieuLineType || scope.lieuLineType[0];
                        $timeout(function () {
                            $('#selected-showLieuLineType').selectpicker('refresh');
                        });
                    });
            }

            function initOnlyLockCycle() {
                if (!scope.showOnlyLockCycle) {
                    return;
                }
                var type;
                if ($location.$$path == '/lieu-quota') {
                    type = 2;  //从过去的第12个考勤周期到未来的第3个考勤周期，倒序
                } else {
                    type = 1;  //本个考勤周期往前数共六个考勤周期，倒序
                }

                commonService
                    .getLockCycleType({
                        params: {
                            type: type
                        }
                    })
                    .then(function (response) {
                        scope.onlyLockCycle = response;
                        scope.selectedOnlyLockCycle = scope.selectedOnlyLockCycle || [getNearestLockCycle(scope.onlyLockCycle)[0] || scope.onlyLockCycle[0]];
                        $timeout(function () {
                            $('#onlyLockCycle').selectpicker('refresh');
                        });
                    });

            }

            //过滤201703之前的周期
            function filterCycle(obj) {
                var result = [];
                angular.forEach(obj, function (item) {
                    if (item.lockCycleName >= '201703') {
                        result.push(item)
                    }
                });
                return result;
            }

            function initIndicator() {
                if (!scope.showIndicator) {
                    return;
                }

                scope.$watch('selectedStandardWorkJobs', function () {

                    var params = {
                        standardWorkJobs: _.pluck(scope.selectedStandardWorkJobs, 'workJobId')
                    };

                    commonService
                        .getIndicator(params)
                        .then(function (response) {
                            response.unshift({
                                targetNumber: " ", targetName: "全部指标"
                            });
                            scope.indicators = response;
                            scope.selectedIndicator = response[0];
                            $timeout(function () {
                                $('#selected-indicator').selectpicker('refresh');
                            });

                        });
                }, true);

            }

            function initVerifyStatus() {
                if (!scope.showVerifyStatus) {
                    return;
                }

                scope.verifyStatusArr = [{
                    id: 0,
                    name: "全部"
                }, {
                    id: 1,
                    name: "待审核"
                }, {
                    id: 2,
                    name: "审核通过"
                }, {
                    id: 3,
                    name: "审核不通过"
                }];

                scope.selectedVerifyStatus = {
                    id: 0,
                    name: "全部"
                };
            }

            function initLockCycleComponent(name) {
                if (!scope.showLockCycle) {
                    return;
                }
                var config = {
                    language: 'zh-CN',
                    todayHighlight: true,
                    clearBtn: true,
                    autoclose: true,
                    format: "yyyy年mm月dd日",
                    daysOfWeekDisabled: []
                };

                var startInput = $('#' + name + ' input[name=start]'),
                    endInput = $('#' + name + ' input[name=end]');
                $('#' + name).datepicker(config);

                commonService
                    .getLockCycleType({
                        params: {
                            type: 1
                        }
                    })
                    .then(function (response) {
                        var arr, start, end;

                        scope.lockCycle = response;

                        if (cacheObj && cacheObj.selectedLockCycle && cacheObj.selectedLockCycle.lockCycleName == "自定义周期") {
                            //cache 值
                            start = cacheObj.selectedLockCycle.lockCycleBegintime;
                            end = cacheObj.selectedLockCycle.lockCycleEndtime;
                        } else {
                            //默认值
                            start = getLocalDate().start;
                            end = getLocalDate().end;
                        }

                        arr = {
                            lockCycleName: '自定义周期',
                            lockCycleId: 0,
                            lockCycleBegintime: start,
                            lockCycleEndtime: end
                        };
                        scope.lockCycle.unshift(arr);

                        if (!scope.selectedLockCycle) {
                            scope.selectedLockCycle = scope.lockCycle[2];
                            // scope.selectedLockCycle = getNearestLockCycle(scope.lockCycle)[0] || scope.lockCycle[1];
                        }


                        // $timeout(function () {
                        //     $('#lockCycle').selectpicker('refresh');
                        // }, 0);

                    });

                scope.$watch('selectedLockCycle', function (v) {
                    if (!v) {
                        return;
                    }
                    if (v.lockCycleName == "自定义周期") {
                        startInput.removeAttr('disabled');
                        endInput.removeAttr('disabled');
                    } else {
                        startInput.attr('disabled', 'disabled');
                        endInput.attr('disabled', 'disabled');
                    }
                    startInput.datepicker('setDate', $filter('date')(new Date(v.lockCycleBegintime), "yyyy年MM月dd日"));
                    endInput.datepicker('setDate', $filter('date')(new Date(v.lockCycleEndtime), "yyyy年MM月dd日"));
                });
            }

            function getNearestLockCycle(lockCycle) {
                var result = [];
                angular.forEach(lockCycle, function (l) {
                    l.start = new Date(l.lockCycleBegintime).getTime();
                    l.end = new Date(l.lockCycleEndtime).getTime();
                    var now = new Date().getTime();
                    if (l.start <= now && l.end >= now) {
                        result.push(l);
                    }
                });

                return result;
            }

            function getLocalDate() {
                var today = new Date();
                var date = today.getDate();
                var result;
                if (date > 20) {
                    result = {
                        start: new Date(today.getFullYear(), today.getMonth(), 21),
                        end: new Date(today.getFullYear(), today.getMonth() + 1, 20)
                    }
                } else {
                    result = {
                        start: new Date(today.getFullYear(), today.getMonth() - 1, 21),
                        end: new Date(today.getFullYear(), today.getMonth(), 20)
                    }
                }
                return result;
            }

            function watchAjaxFinished() {
                scope.$watch("ajaxFinishedCount", function (v) {
                    if (v === _ajaxFinishedCount) {
                        _ajaxFinishedCount = 0;
                        $timeout(function () {
                            scope.$broadcast('selectpicker-loaded');
                        }, 50);
                    }
                });
            }

            function getTaskWealthType() {
                commonService.getTaskWealthType().then(function (data) {
                    scope.taskWealthType = data;
                    scope.ajaxFinishedCount++;
                });
                _ajaxFinishedCount++;
            }

            function getAttendanceResult() {
                commonService.getAttendanceResult().then(function (data) {
                    scope.attendanceResult = data;
                    $timeout(function () {
                        $("#attendance-result").selectpicker("refresh");
                    }, 20);
                    scope.ajaxFinishedCount++;
                });
                _ajaxFinishedCount++;
            }

            function getEmployeeSap() {
                var params = {
                    "departments": _.pluck(scope.selectedDepartments, 'department_id'),
                    "workingGroups": _.pluck(scope.selectedGroups, 'work_group_id'),
                    "standardWorkJobs": _.pluck(scope.selectedStandardWorkJobs, 'workJobId')
                };
                if (!params.departments || !params.departments.length) {
                    return;
                }
                params = {
                    "search[value]": JSON.stringify(params)
                };
                commonService.getEmployeeSap(params).then(function (result) {
                    scope.employeeSap = result;
                    scope.selectedEmployeeSap = scope.employeeSap.slice(0, 1);
                    $timeout(function () {
                        $("#employee-sap").selectpicker("refresh");
                    }, 20);
                })
            }

            function watchEmployeeSap() {
                $("#select-group, #selected-standardWorkJobs-one").on("hidden.bs.select", function () {
                    getEmployeeSap();
                });
                scope.$watch("selectedDepartments", function () {
                    getEmployeeSap();
                }, true);
            }

            function getTaskType() {
                commonService.getAllTaskType().then(function (datas) {
                    taskTypeOne = datas[0] || [];
                    scope.taskTypeOne = taskTypeOne;
                    scope.selectedTaskTypeOne = taskTypeOne[0];

                    taskTypeTwo = datas[1] || [];
                    scope.taskTypeTwo = taskTypeTwo;
                    scope.selectedTaskTypeTwo = taskTypeTwo[0];

                    taskTypeLast = datas[2] || [];
                    scope.taskTypeLast = taskTypeLast;
                    scope.selectedTaskTypeLast = null;

                    scope.$broadcast("task-type-change");
                    scope.ajaxFinishedCount++;
                });
            }

            function watchTaskType() {
                _ajaxFinishedCount++;
                getTaskType();

                $("#taskTypeOne").on("changed.bs.select", function () {
                    var catTwoTemp, taskTwo, selectedTaskTypeOne = scope.selectedTaskTypeOne, taskTypeLastFiltIds;
                    if (!selectedTaskTypeOne || selectedTaskTypeOne.id == 0) {
                        scope.taskTypeTwo = taskTypeTwo;
                        scope.taskTypeLast = taskTypeLast;
                    } else {
                        taskTwo = JSON.parse(JSON.stringify(taskTypeTwo));
                        catTwoTemp = taskTwo.shift();
                        scope.taskTypeTwo = commonService.filterArrayById(selectedTaskTypeOne.childrenIds, taskTwo);

                        taskTypeLastFiltIds = [];
                        angular.forEach(scope.taskTypeTwo, function (v) {
                            taskTypeLastFiltIds = taskTypeLastFiltIds.concat(v && v.childrenIds);
                        });
                        taskTypeLastFilt = commonService.filterArrayById(taskTypeLastFiltIds, taskTypeLast);
                        scope.taskTypeTwo.unshift(catTwoTemp);
                        scope.taskTypeLast = taskTypeLastFilt;
                    }
                    scope.selectedTaskTypeTwo = scope.taskTypeTwo[0];
                    scope.selectedTaskTypeLast = null;
                    scope.$broadcast("task-type-change");
                    scope.$apply();
                });
                $("#taskTypeTwo").on("changed.bs.select", function () {
                    var selectedTaskTypeTwo = scope.selectedTaskTypeTwo;
                    if (!selectedTaskTypeTwo || selectedTaskTypeTwo.id == 0) {
                        scope.taskTypeLast = taskTypeLastFilt || taskTypeLast;
                    } else {
                        scope.taskTypeLast = commonService.filterArrayById(selectedTaskTypeTwo.childrenIds, taskTypeLastFilt || taskTypeLast);
                    }
                    scope.selectedTaskTypeLast = null;
                    scope.$broadcast("task-type-change");
                    scope.$apply();
                });
                $timeout(applySessionStrorage, 0);
            }

            function getBuypeWorkJob() {
                var params = {
                    jobShortName: scope.selectedButype || ""
                };
                commonService.getBuypeWorkJob(params).then(function (standardWorkJobs) {
                    scope.standardWorkJobs = standardWorkJobs;
                    scope.selectedStandardWorkJobs = [];
                    scope.$broadcast('standard-work-groups-loaded');
                });
            }

            function getWorkJob() {
                var departments = _.pluck(scope.selectedDepartments, 'department_id');
                var params = {
                    departments: departments.length ? departments : ""
                };
                commonService.getWorkJob(params).then(function (standardWorkJobs) {
                    scope.standardWorkJobs = standardWorkJobs;
                    scope.selectedStandardWorkJobs = [];
                    scope.$broadcast('standard-work-groups-loaded');
                });
            }
            function getLoginUserData() {
                _ajaxFinishedCount++;
                userService.getCurrentUser().then(function (selectData) {
                    applySelecterData(selectData);
                    /** @namespace selectData.superUser */
                    sessionStorage['isSuperUser'] = selectData.superUser;
                    scope.ajaxFinishedCount++;
                    scope.$broadcast('isSuperUser');
                });
                if (scope.showWorkJobs || scope.showStandardWorkJobs || scope.showStandardWorkJobsOne || scope.showEmployeeSap) {
                    if (scope.showButype) {
                        setTimeout(function () {
                            $("#selected-standardWorkJobs-one").on("shown.bs.select", getBuypeWorkJob).trigger("shown.bs.select");
                            $("#butype").on("change.bs.select", getBuypeWorkJob);
                        }, 0);
                    } else if (scope.showCityCompany) {
                        commonService.getValidWorkJobs().then(function (standardWorkJobs) {
                            scope.standardWorkJobs = standardWorkJobs;
                            scope.selectedStandardWorkJobs = [];
                            scope.$broadcast('standard-work-groups-loaded');
                        });
                    } else {
                        setTimeout(function () {
                            $("#selected-standardWorkJobs").on("shown.bs.select", getWorkJob).trigger("shown.bs.select");
                            $("#select-department").on("change.bs.select", getWorkJob);
                        }, 0);
                    }
                }
            }

            function applySessionStrorage() {
                var cacheObj = sessionStorage["searchState_" + location.hash];
                if (location.hash === '#/photo-sign-approval') {
                    cacheObj = sessionStorage['searchState_#/new-attendance']
                }
                if (cacheObj) {
                    try {
                        cacheObj = JSON.parse(cacheObj);
                        angular.extend(scope, cacheObj);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }

            function applySelecterData(data) {
                scope.organizations = data.authorizedCompanies;
                scope.groups = data.authorizedWorkGroups;
                setDefaultsSelect(data);
                applySessionStrorage();
                $timeout(function () {
                    $(".selectpicker", element).selectpicker("refresh");
                    scope.$broadcast('companies-loaded');
                    scope.$broadcast('work-groups-loaded');
                }, 50);
            }

            function setDefaultsSelect(result) {
                var cacheObj = sessionStorage["searchState_" + location.hash];
                var startDay, endDay, firstCompanies, defaultSetting, timeStamp = new Date();
                firstCompanies = result.authorizedCompanies[0];
                defaultSetting = {
                    selectedCompanies: [firstCompanies],
                    selectedDepartments: firstCompanies.departments.slice(0, 1),
                    departments: firstCompanies.departments,
                    keywords: ""
                };
                var dm = null;
                if (location.hash == '#/super-schedules' && $rootScope.cacheSearchParams) {
                    for (var k in result.authorizedCompanies) {
                        if (result.authorizedCompanies[k].company_id == $rootScope.loginUserEmployee.company.company_id) {
                            dm = result.authorizedCompanies[k].departments
                            break;
                        }
                    }
                    defaultSetting.selectedCompanies = [{
                        "company_id": $rootScope.loginUserEmployee.company.company_id,
                        "company_name": $rootScope.loginUserEmployee.company.company_name,
                        "departments": dm
                    }];
                    defaultSetting.selectedDepartments = [$rootScope.loginUserEmployee.department];
                    defaultSetting.departments = dm
                }
                if (!cacheObj) {
                    switch (location.hash) {
                        case "#/schedules":
                        case "#/new-schedules":
                        case "#/super-schedules":
                        case "#/super-schedules-check":
                        case "#/super-schedules-check-post":
                        case "#/super-schedules-check-post2":
                        case "#/other-holiday-balance":
                        case "#/lieu-quota":
                        case "#/other-holiday-balance-check":
                            schedules();
                            break;
                        case "#/task-incentive-monthly-report":
                            taskIncentive();
                            break;
                        case "#/attendance-check":
                        case "#/new-attendance-check":
                            attendanceCheck();
                            break;
                        case "#/overtime-attendance-check":
                        case "#/new-overtime-attendance-check":
                            overtimeAttendance();
                            break;
                        case "#/switch-shift":
                        case "#/experience":
                        case "#/sign-in-area":
                        case "#/shift-view":
                        case "#/sign-in-area-check":
                        case "#/post":
                        case "#/post-check":
                            viewShifts();
                            break;
                        case "#/attendance":
                        case "#/new-attendance":
                        case "#/sign-in-check":
                        case "#/photo-sign-approval":
                            attendance();
                            break;
                        case "#/department-info-view":
                            departmentInfoView();
                            break;
                        case '#/leave-records-list':
                        case '#/leave-approve-list':
                        case '#/not-task-wealth':
                            setBelongs();
                        default :
                            break;
                    }
                }
                function departmentInfoView() {
                    sessionStorage["searchState_" + location.hash] = JSON.stringify({
                        isValid: "1"
                    });
                }

                function schedules() {
                    startDay = new Date(timeStamp - (timeStamp.getDay() - 1) * 24 * 60 * 60 * 1000);
                    var curr = (7 - timeStamp.getDay()) * 24 * 60 * 60 * 1000;

                    endDay = new Date(timeStamp.getTime() + curr);
                    if (location.hash == '#/super-schedules' && $rootScope.cacheSearchParams) {
                        defaultSetting.beginDate = $filter('date')($rootScope.cacheSearchParams.startDate, "M/dd/yyyy");
                        defaultSetting.endDate = $filter('date')($rootScope.cacheSearchParams.endDate, "M/dd/yyyy");
                        defaultSetting.scheduleStatus = '2';
                        $timeout(function () {
                            $('input[name=start]').datepicker('setDate', $filter('date')($rootScope.cacheSearchParams.startDate, "yyyy年MM月dd日"));
                            $('input[name=end]').datepicker('setDate', $filter('date')($rootScope.cacheSearchParams.endDate, "yyyy年MM月dd日"));
                        }, 50)
                    } else {
                        $rootScope.cacheSearchParams = null
                        defaultSetting.beginDate = utils.formatDate(startDay);
                        defaultSetting.endDate = utils.formatDate(endDay);
                        defaultSetting.scheduleStatus = '0';
                        $timeout(function () {
                            $('input[name=start]').datepicker('setDate', $filter('date')(startDay, "yyyy年MM月dd日"));
                            $('input[name=end]').datepicker('setDate', $filter('date')(endDay, "yyyy年MM月dd日"));
                        }, 50)
                    }
                    defaultSetting.jobStatus = '01';
                    sessionStorage["searchState_" + location.hash] = JSON.stringify(defaultSetting);
                }

                function attendance() {
                    startDay = timeStamp;
                    endDay = timeStamp;
                    defaultSetting.beginDate = utils.formatDate(startDay);
                    defaultSetting.endDate = utils.formatDate(endDay);
                    sessionStorage["searchState_" + location.hash] = JSON.stringify(defaultSetting);
                    $timeout(function () {
                        $('input[name=start]').datepicker('setDate', $filter('date')(startDay, "yyyy年MM月dd日"));
                    }, 50);
                }

                function overtimeAttendance() {
                    startDay = new Date(timeStamp.getFullYear(), timeStamp.getMonth() - 1, 21);
                    endDay = new Date(timeStamp.getFullYear(), timeStamp.getMonth(), 20);
                    defaultSetting.beginDate = utils.formatDate(startDay);
                    defaultSetting.endDate = utils.formatDate(endDay);
                    sessionStorage["searchState_" + location.hash] = JSON.stringify(defaultSetting);
                    $timeout(function () {
                        $('input[name=start]').datepicker('setDate', $filter('date')(startDay, "yyyy年MM月dd日"));
                        $('input[name=end]').datepicker('setDate', $filter('date')(endDay, "yyyy年MM月dd日"));
                    }, 50);
                }

                function attendanceCheck() {
                    startDay = new Date(timeStamp.getFullYear(), timeStamp.getMonth() - 1, 21);
                    endDay = new Date(timeStamp.getFullYear(), timeStamp.getMonth(), 20);
                    defaultSetting.beginDate = utils.formatDate(startDay);
                    defaultSetting.endDate = utils.formatDate(endDay);
                    sessionStorage["searchState_" + location.hash] = JSON.stringify(defaultSetting);
                    $timeout(function () {
                        $('input[name=start]').datepicker('setDate', $filter('date')(startDay, "yyyy年MM月dd日"));
                        $('input[name=end]').datepicker('setDate', $filter('date')(endDay, "yyyy年MM月dd日"));
                    }, 50);
                }

                function taskIncentive() {
                    startDay = new Date(timeStamp.getFullYear(), timeStamp.getMonth(), 1);
                    endDay = new Date();
                    defaultSetting.beginDate = utils.formatDate(startDay);
                    defaultSetting.endDate = utils.formatDate(endDay);
                    sessionStorage["searchState_" + location.hash] = JSON.stringify(defaultSetting);
                    $timeout(function () {
                        $('input[name=start]').datepicker('setDate', $filter('date')(startDay, "yyyy年MM月dd日"));
                        $('input[name=end]').datepicker('setDate', $filter('date')(endDay, "yyyy年MM月dd日"));
                    }, 50);
                }

                function viewShifts() {
                    var defaultSetting = {
                        selectedCompanies: [firstCompanies],
                        selectedDepartments: firstCompanies.departments.slice(0, 1),
                        departments: firstCompanies.departments
                    };
                    sessionStorage["searchState_" + location.hash] = JSON.stringify(defaultSetting);
                }

                function setBelongs() {
                    var userInfo = JSON.parse(sessionStorage["loginUserEmployee"]);
                    var belongCompany = null;
                    scope.organizations.forEach(function (item, index, arr) {
                        if (item.company_id === userInfo.companyId) {
                            belongCompany = item;
                        }
                    });
                    if (!belongCompany) {
                        return;
                    }
                    var defaultSetting = {
                        selectedCompanies: [userInfo.company],
                        selectedDepartments: [userInfo.department],
                        departments: belongCompany.departments
                    };
                    sessionStorage["searchState_" + location.hash] = JSON.stringify(defaultSetting);
                }

            }

            function initCustomSelectPicker() {
                var firstOption;
                if (null != scope.commonSearchBarConfig) {
                    if (false === scope.commonSearchBarConfig.isCompanySelectpickerMultiple) {
                        firstOption = '<option value="公司范围" style="display: none;"></option>';
                        $("#select-company").prepend(firstOption).removeAttr("multiple");
                        scope.isCompanySelectpickerMultipe = false;
                    }
                    if (false === scope.commonSearchBarConfig.isDepartmentSelectpickerMultipe) {
                        firstOption = '<option value="部门/项目" style="display: none;"></option>';
                        $("#select-department").prepend(firstOption).removeAttr("multiple");
                        scope.isDepartmentSelectpickerMultipe = false;
                    }
                    if (false === scope.commonSearchBarConfig.isEmployeeSapSelectpickerMultipe) {
                        firstOption = '<option value="所有人员" style="display: none;"></option>';
                        $("#employee-sap").prepend(firstOption).removeAttr("multiple");
                        scope.isEmployeeSapSelectpickerMultipe = false;
                    }
                    if (false === scope.commonSearchBarConfig.isStandardWorkJobsOneMultipe) {
                        firstOption = '<option value="全部标准职位" style="display: none;"></option>';
                        $("#selected-standardWorkJobs-one").prepend(firstOption).removeAttr("multiple");
                        scope.isStandardWorkJobsOneMultipe = false;
                    }
                    if (scope.commonSearchBarConfig.companySelecterLabel) {
                        $("#select-company").attr("data-none-selected-text", scope.commonSearchBarConfig.companySelecterLabel);
                    }
                    if (scope.commonSearchBarConfig.departmentSelecterLabel) {
                        $("#select-department").attr("data-none-selected-text", scope.commonSearchBarConfig.departmentSelecterLabel);
                    }
                    if (scope.commonSearchBarConfig.workgroupSelecterLabel) {
                        $("#select-group").attr("data-none-selected-text", scope.commonSearchBarConfig.workgroupSelecterLabel);
                    }
                    if (scope.commonSearchBarConfig.workJobsLabel) {
                        $("#select-workJobs").attr("data-none-selected-text", scope.commonSearchBarConfig.workJobsLabel);
                    }
                }
            }

            function addOperationButtons() {
                if (scope.operationButtons) {
                    $("." + scope.operationButtons).appendTo(".operation-tool-bar");
                }
            }

            function addOperationDiv() {
                if (scope.operationDiv) {
                    $("." + scope.operationDiv).appendTo(".top-bar-right");
                }
            }
        }
    };

    function initWealthDatePicker(name, weekMode) {
        initDate(name, weekMode);
        var startInput = $('#' + name + ' input[name=start]'),
            endInput = $('#' + name + ' input[name=end]');
        var hash = location.hash;
        var cacheObj = sessionStorage["searchState_" + hash];
        if (cacheObj) {
            cacheObj = JSON.parse(cacheObj);
            if (cacheObj.wealthCompleteBeginDate) {
                startInput.datepicker('setDate', $filter('date')(new Date(cacheObj.wealthCompleteBeginDate), "yyyy年MM月dd日"));
            }
            if (cacheObj.wealthCompleteEndDate && !weekMode) {
                endInput.datepicker('setDate', $filter('date')(new Date(cacheObj.wealthCompleteEndDate), "yyyy年MM月dd日"));
            }
        }
    }

    function initDatePicker(name, weekMode) {
        initDate(name, weekMode);
        var startInput = $('#' + name + ' input[name=start]'),
            endInput = $('#' + name + ' input[name=end]');
        var hash = location.hash;
        var cacheObj = sessionStorage["searchState_" + hash];
        if (cacheObj) {
            cacheObj = JSON.parse(cacheObj);
            if (cacheObj.beginDate) {
                startInput.datepicker('setDate', $filter('date')(new Date(cacheObj.beginDate), "yyyy年MM月dd日"));
            }
            if (cacheObj.endDate && !weekMode) {
                endInput.datepicker('setDate', $filter('date')(new Date(cacheObj.endDate), "yyyy年MM月dd日"));
            }
        }
    }

    function initDate(name, weekMode) {
        var config = {
            language: 'zh-CN',
            todayHighlight: weekMode ? false : true,
            clearBtn: true,
            autoclose: true,
            format: "yyyy年mm月dd日",
            daysOfWeekDisabled: weekMode ? [0, 2, 3, 4, 5, 6] : []
        };
        var startInput = $('#' + name + ' input[name=start]'),
            endInput = $('#' + name + ' input[name=end]');
        if (weekMode) {
            endInput.attr("disabled", "disabled");
            startInput.datepicker(config).on('changeDate', function (e) {
                if (e && e.date) {
                    var endDate = new Date(new Date(e.date).setDate(e.date.getDate() + 6));
                    endInput.val(endDate.getFullYear() + '年' + (endDate.getMonth() + 1) + '月' + endDate.getDate() + '日');
                } else {
                    endInput.val("");
                }
            }).on('show', function () {
                $('div.datepicker.datepicker-dropdown').addClass('weekpicker');
            });
        } else {
            $('#' + name).datepicker(config);
        }
    }

    function initSelectCompany($scope) {
        $("#select-company").parent().find('ul.dropdown-menu li').on('click', function () {
            var selectedItemIndex = $(this).attr('data-original-index'), selectedDepartments;

            if ($scope.isCompanySelectpickerMultipe === false) {
                selectedItemIndex = Math.floor(selectedItemIndex) - 1;
            }

            var selectedOrganization = $scope.organizations[selectedItemIndex];

            if (!$(this).hasClass("selected")) {

                if ($scope.isCompanySelectpickerMultipe === false) {
                    $scope.departments = [];
                    $scope.selectedDepartments = [];
                }
                var departmentsInCompany;
                if ($scope.isDepartmentSelectpickerMultipe === false) {
                    departmentsInCompany = selectedOrganization.departments;
                    $.merge($scope.departments, departmentsInCompany);
                    $scope.departments = _.sortBy($scope.departments, function (department) {
                        return department.department_id;
                    });
                    if ($scope.departments.length && $scope.autoCheckDepartment) {
                        $scope.selectedDepartments = [$scope.departments[0]];
                    }
                    $scope.$apply();
                    $("#select-department").selectpicker('refresh');
                } else {
                    departmentsInCompany = selectedOrganization.departments;
                    $.merge($scope.departments, departmentsInCompany);
                    if ($scope.autoCheckDepartment) {
                        $.merge($scope.selectedDepartments, departmentsInCompany);
                    }

                    $scope.departments = _.sortBy($scope.departments, function (department) {
                        return department.department_id;
                    });
                    if ($scope.autoCheckDepartment) {
                        $scope.selectedDepartments = _.sortBy($scope.selectedDepartments, function (department) {
                            return department.department_id;
                        });
                    }
                    $scope.$apply();
                    $("#select-department").selectpicker('refresh');
                }
            } else {
                if ($scope.isCompanySelectpickerMultipe === false) {
                    return;
                }
                selectedDepartments = commonService.getIds(selectedOrganization.departments, "department_id");
                $scope.departments = _.reject($scope.departments, function (department) {
                    return selectedDepartments.indexOf(department.department_id) >= 0;
                });
                if ($scope.autoCheckDepartment) {
                    $scope.selectedDepartments = _.reject($scope.selectedDepartments, function (department) {
                        return selectedDepartments.indexOf(department.department_id) >= 0
                    });
                }
                if (_.isEmpty($scope.departments)) {
                    $scope.selectedDepartments = []
                }
                $scope.$apply();
                $("#select-department").selectpicker('refresh');
            }
        });
        $("#select-company").on('change', function () {
            var departments = [],
                departmentsInCompany = [];
            for (var i = 0; i < $scope.selectedCompanies.length; i++) {
                departmentsInCompany = $scope.selectedCompanies[i].departments;
                for (var j = 0; j < departmentsInCompany.length; j++) {
                    departments.push(departmentsInCompany[j]);
                }
            }
            $scope.departments = departments;
            if ($scope.autoCheckDepartment) {
                $scope.selectedDepartments = departments;
            }
            if (_.isEmpty($scope.departments)) {
                $scope.selectedDepartments = []
            }
            $scope.$apply();
            $("#select-department").selectpicker('refresh');
        });
    }
}]);
