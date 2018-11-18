(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('SuperScheduleController', SuperScheduleController);
    SuperScheduleController.$inject = ['UserService', '$scope', '$http', '$filter', '$timeout', 'CommonService', 'SuperScheduleService', '$rootScope', '$location', 'ngToast'];

    function SuperScheduleController(userService, $scope, $http, $filter, $timeout, commonService, SuperScheduleService, $rootScope, $location, ngToast) {
        var sps = this;

        init();
        $scope.search = search;
        $scope.getOptionShiftValue = getOptionShiftValue;
        $scope.export = scheduleExport;
        sps.setBeforeShiftOvertime = setBeforeShiftOvertime;
        sps.setAfterShiftOvertime = setAfterShiftOvertime;
        sps.getFixedOvertime = getFixedOvertime;
        sps.selectPost = selectPost;
        sps.selectType = selectType;
        sps.selectType2 = selectType2;
        sps.editSchedule = editSchedule;
        sps.saveSchedule = saveSchedule;
        sps.okSchedule = okSchedule;
        sps.closeModel = closeModel;
        sps.cancelEditSchedule = cancelEditSchedule;
        sps.modelTabs = modelTabs;
        $scope.copyPreviousDay = copyPreviousDay;
        sps.editLineSchedule = editLineSchedule;
        sps.editLineOvertime = editLineOvertime;
        sps.editLineHoliday = editLineHoliday;
        sps.editLineGoOut = editLineGoOut;
        sps.delLineShift = delLineShift;
        sps.delLineOvertime = delLineOvertime;
        sps.delLineHoliday = delLineHoliday;
        sps.delLineGoOut = delLineGoOut;
        sps.delExtendShift = delExtendShift;
        sps.setHolidayRest = setHolidayRest;
        sps.linkFastSchedule = linkFastSchedule;
        $scope.selectCopyDate = selectCopyDate;
        sps.scheduleCopy = scheduleCopy;
        sps.setShiftAdjust = setShiftAdjust;
        sps.setShiftGoOut = setShiftGoOut;
        $scope.isOfficialHoliday = isOfficialHoliday;
        $scope.isShowAdjustTime = SuperScheduleService.isShowAdjustTime;
        var defaultTimeDuration = SuperScheduleService.timelineOptions();
        $scope.oneOffHolidaylimitFunc = oneOffHolidaylimitFunc;

        if ($rootScope.cacheSearchParams) {
            $scope.scheduleStatus = 2;
        } else {
            $scope.scheduleStatus = 0;
        }
        function init() {
            $scope.title = "万科资源管理信息系统 - 排班管理";
            $scope.commonSearchBarConfig = {
                isCompanySelectpickerMultiple: false,
                isDepartmentSelectpickerMultipe: false,
                companySelecterLabel: "公司范围",
                departmentSelecterLabel: "部门/项目",
                workgroupSelecterLabel: "岗位专业分类"
            };
            $scope.paginationConfig = {
                pageOptions: [10],
                isShowOptions: true
            };
            $scope.editState = false;
            sps.modelState = false;
            sps.currentShift = {};
            sps.holidayType = SuperScheduleService.holidayTypeList();
            sps.gooutType = SuperScheduleService.holidayTypeList('goOut');
            sps.holidayRest = SuperScheduleService.holidayTypeList('rest');
            initCopyScheduleData();
            $scope.gridOptions = {};
            sps.systemAdmin = ['50002235', '50042667', '50386055', '50387079', '50388069', '50386158', '50082075', '50386124']
            sps.extendTime = SuperScheduleService.extendTime(); // 班前后扩展时间段
            userService.getUserEmployee().then(function(data){
                sps.currentEmployee = data;
            })
            sps.curDayisOneOffHoliday = false;
        }

        var addShift = {
            holidayRest: function (type) {
                sps.cacheHoliday = {
                    id: null,
                    operationState: 'add',
                    type: type,
                    holidayType: 0,
                    holidayBeginTime: '00:00:00',
                    holidayEndTime: '00:00:00'
                }
                sps.modelActiveShift.holidaySchedules.push(sps.cacheHoliday);
                return this
            }
        }

        var del = {
            shift: function (data,id) {
                if (data[id].id && data[id].operationState != 'delete') {
                    data[id].operationState = 'delete'
                    data[id].active = 'off'
                } else {
                    data.splice(id, 1);
                }
            },
            shiftByType: function(item, type) {
                if (!_.isEmpty(item)) {
                    for (var k in item) {
                        if (item[k].type == type && item[k].operationState != 'delete') {
                            this.shift(item, k);
                            return false;
                        }
                    }
                }
            }
        };
        function initCopyScheduleData() {
            sps.selectArray = [];
            sps.selectDateArray = [];
            sps.copyStem = null;
            sps.recordCopyDatetime = [];
        }

        function scheduleExport() {
            if (!isSearchInfoValid()) {
                return;
            }
            var params = getSearchParams().search, url;
            url = baseUrl + "/file/export-schedule-employee";
            commonService.downloadFile(url, params);
        }

        function isOfficialHoliday(day){
            if(!$scope.officialHoliday || !day) return false
            return $scope.officialHoliday.indexOf($filter('date')(day, 'yyyy-MM-dd')) > -1
        }

        function linkFastSchedule() {
            if ($scope.selectedCompanies && $scope.selectedDepartments && $scope.selectedCompanies.length > 0
                && $scope.selectedDepartments.length > 0) {
                sessionStorage['fastSchedule'] = JSON.stringify({
                    company: $scope.selectedCompanies,
                    department: $scope.selectedDepartments,
                    onLineRmDate: sps.onLineRmDate
                });
                $location.path('/fast-schedules');
            } else {
                commonService.alert({
                    content: '请选择项目！',
                    icon: "fa-exclamation-circle"
                });
            }
        }

        $scope.$watch('sps.toast', function () {
            if (sps.toast) {
                sps.toastState = true;
                $timeout(function () {
                    sps.toastState = false;
                    sps.toast = null
                }, 2000)
            }
        });
        function modelTabs(id) {
            if (sps.unfinishedShift) {
                sps.toast = '未选择' + sps.unfinishedShift + '的班次,请确保岗位班次完整性。';
                return false;
            }
            switch (id) {
                case 1:
                case 2:
                    $scope.tab = id;
                    break;
                case 3:
                    if (sps.onHolidayRest == 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE') {
                        sps.toast = '已安排了做2休1/做1休1,不需再安排休假';
                        return false;
                    }
                    if (checkRegularDelete() == 0) {
                        sps.toast = '请先选择常规班次，再选择休假类型';
                        return false;
                    }
                    $scope.tab = id;
                    break;
                case 4:
                    if (checkRegularDelete('goOut') == 0) {
                        sps.toast = '请先选择常规班次、月休、加班,再选择出差外勤';
                        return false;
                    }
                    $scope.tab = id;
                    break;
                default:;
            }
        }

        function search(type) {
            var sdLength = $scope.selectedDepartments.length;
            $scope.selectedDepartments = sdLength > 1 ? [$scope.selectedDepartments[sdLength - 1]] : $scope.selectedDepartments;
            if (!isSearchInfoValid()) {
                return;
            }
            commonService.storageSearchStatus($scope, {
                selectedCompanies: $scope.selectedCompanies,
                selectedDepartments: $scope.selectedDepartments,
                departments: $scope.departments,
                selectedGroups: $scope.selectedGroups,
                beginDate: commonService.getSelectedDates().beginDate,
                endDate: commonService.getSelectedDates().endDate,
                keywords: $scope.keywords,
                selectedStandardWorkJobs: $scope.selectedStandardWorkJobs,
                scheduleStatus: $scope.scheduleStatus
            });
            var weekday = getWeekInterval(type);
            $http.get(apiBaseUrl + '/publicHoliday',{
                params:{
                    beginDate: utils.formatDate(weekday.beginDate),
                    endDate: utils.formatDate(weekday.endDate),
                    department: _.pluck($scope.selectedDepartments, 'department_id') || ''
                }
            }).then(function(res) {
                $scope.officialHoliday = res.data.data;
                return SuperScheduleService.getSchedules(getSearchParams(type))
            },function() {
            }).then(function (response) {
                if (response.employees && response.employees.length > 0) {
                    sps.onLineRmDate = response.employees[0].onLineDate;
                }
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page) || 1
                    sps.scheduleShift = JSON.parse(JSON.stringify(response));
                    $scope.editState = false;
                    sps.lockDates = sps.scheduleShift.lockDates;
                    sps.departmentId = _.pluck($scope.selectedDepartments, 'department_id');
                    $scope.$parent.departmentId = sps.departmentId.length > 0 ? sps.departmentId[0] : "";
                    SuperScheduleService.getPostOptionsFromServer(sps.departmentId)
                        .then(function (result) {
                            $scope.fixedPosts = result.posts;
                        })
                    sps.newTable = {
                        isScheduleCopy: false,
                        employees: response.employees,
                        startDate: $filter('date')(changeDate(new Date(sps.scheduleShift.startDate), 1), 'yyyy-MM-dd'),
                        endDate: $filter('date')(changeDate(new Date(sps.scheduleShift.endDate), -1), 'yyyy-MM-dd'),
                        schedules: []
                    };
                    $scope.isCheckLeaveBalance = true; // 重置休假额度查询状态
                    sps.currentDate = changeDate(new Date(response.startDate), 1);
                    $scope.showDatetimeDuration = applyWeek(response.startDate, response.endDate);
                    if (type == 'copy') {
                        $scope.editState = true
                    }
                    sps.modelState = false;
                    sps.copyState = false;
                    sps.unfinishedShift = null;

                    applyScheduleTable(sps.scheduleShift.employees);
                });
        }

        $scope.$watch('reloadSchedule', function () {
            if ($rootScope.reloadSchedule) {
                $scope.search('copy');
                initCopyScheduleData();
                $rootScope.reloadSchedule = false;
            }
        })
        function editSchedule() {
            if (sps.newTable == null) {
                return false;
            }
            $scope.editState = true
        }

        function cancelEditSchedule() {
            $scope.editState = false;
            sps.copyState = false;
            $scope.search()
        }
        function clearCurrentSchedule (obj) {
            obj.regularSchedules = null;
            obj.overtimeSchedules = null;
            obj.holidaySchedules = null;
            obj.goOutSchedules = null;
            return obj;
        }
        function saveSchedule(type, objs) {
            var params = buildScheduleSave(type);
            if (sps.emptySchedules) {
                switch (type) {
                    case 'modelSave':
                        clearCurrentSchedule(sps.scheduleTable[sps.joinIndexs].scheduleCells[sps.editTableWeek]);
                        buildGridUI(sps.scheduleTable);
                        sps.speciallyHoliday = angular.copy(objs.schedule);
                        sps.loadingDate = false;
                        $timeout(function () {
                            checkDayGroup(objs.item, objs.index, objs.week);
                            buildScheduleModel(objs.item, sps.scheduleTable[objs.index].scheduleCells[objs.week], objs.index, objs.week)
                        }, 300);
                        sps.emptySchedules = false;
                        break;
                    case 'close':
                        sps.modelActiveShift = {};
                        sps.lastCurrentShift = null;
                        sps.modelState = false;
                        clearCurrentSchedule(sps.scheduleTable[sps.joinIndexs].scheduleCells[sps.editTableWeek]);
                        buildGridUI(sps.scheduleTable);
                        sps.emptySchedules = false;
                        break;
                    default:
                        break;
                }
                return false;
            }
            $http.put(apiBaseUrl + "/new-schedule-sheet", params, {headers: utils.generateHeaders()})
                .then(function (result) {
                    sps.unfinishedShift = null;
                    $rootScope.loading = false;
                    var dataStatus = result.data.status;
                    if (dataStatus != null && dataStatus != undefined && (dataStatus == "AttendanceIsLockException" )) {
                        commonService.alert({
                            content: '系统可能有问题，请清除缓存后重试。如果问题仍存在，请联系系统管理员',
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                    if (null != dataStatus && dataStatus != undefined && (dataStatus == "fail" )) {
                        if (result.data.errorMessage.indexOf('Exception') != -1) {
                            commonService.alert({
                                content: '系统可能有问题，请清除缓存后重试。如果问题仍存在，请联系系统管理员',
                                icon: "fa-exclamation-circle",
                                iconColor: "icon-red"
                            });
                        } else {
                            commonService.alert({
                                content: result.data.errorMessage,
                                icon: "fa-exclamation-circle",
                                iconColor: "icon-red"
                            });
                            sps.modelActiveShift = {}
                            sps.lastCurrentShift = null;
                            sps.modelState = false;
                            sps.unfinishedShift = null;
                        }
                    } else {
                        if (type == 'all') {
                            $scope.editState = false;
                            sps.modelState = false;
                            sps.copyState = false;
                            applyScheduleTable(result.data.employees);

                        } else if (type == 'close') {
                            sps.modelState = false;
                            sps.lastCurrentShift = null;
                            sps.modelActiveShift = {};
                            sps.newTable.employees[sps.joinIndexs] = result.data.employees[0];
                            applyScheduleTable(result.data.employees, 'join');
                        } else {
                            initCopyScheduleData();
                            $scope.showDatetimeDuration.forEach(function (item) {
                                item.state = false;
                            });
                            sps.newTable.employees[sps.joinIndexs] = result.data.employees[0];
                            applyScheduleTable(result.data.employees, 'join');
                            if (type == 'modelSave') {
                                sps.speciallyHoliday = angular.copy(objs.schedule);
                                sps.loadingDate = false;
                                $timeout(function () {
                                    checkDayGroup(objs.item, objs.index, objs.week);
                                    buildScheduleModel(objs.item, sps.scheduleTable[objs.index].scheduleCells[objs.week], objs.index, objs.week)
                                }, 300)

                            }
                        }
                        if (result.data.errorInfo) {
                            commonService.alert({
                                content: result.data.errorInfo,
                                icon: "fa-exclamation-circle"
                            });
                        }
                    }
                }, function () {
                    commonService.alert({
                        content: '网络可能有问题，请检查网络连接',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                })

        }

        function okSchedule() {
            if (sps.copyState) {
                commonService.confirm({
                    content: '已复制的班次未做保存，是否保存？',
                    callback: function () {
                        saveSchedule('all');
                        sps.copyState = false;
                        $scope.editState = false;
                    },
                    cancel: function () {
                        cancelEditSchedule()
                    }
                });

            } else {
                $scope.editState = false;
                sps.lastCurrentShift = null;
                sps.modelState = false;
            }
        }

        function selectCopyDate(a, c) {
            $scope.showDatetimeDuration[a].state = !c;
            if (!c) {
                if (sps.selectDateArray.length == 0) {
                    sps.selectDateArray.push(a);
                } else{
                    var sortType = a > sps.selectDateArray[0] ? 1 : -1;
                    var endNum = sortType == 1 ? a + 1 : a - 1;
                    sps.selectDateArray = _.sortBy(_.range(sps.selectDateArray[0], endNum, sortType));
                    for (var k in sps.selectDateArray) {
                        $scope.showDatetimeDuration[sps.selectDateArray[k]].state = true;
                    }
                }

            } else {
                if (sps.selectDateArray[0] == a) {
                    sps.selectDateArray.splice(0, 1);
                } else if (sps.selectDateArray[sps.selectDateArray.length - 1] == a) {
                    sps.selectDateArray.pop();
                } else {
                    sps.selectDateArray = [];
                    angular.forEach($scope.showDatetimeDuration, function (item) {
                        item.state = false;
                    })
                }

            }
        }

        function copyPreviousDay(item, index) {
            var day = $filter('date')(item, 'yyyy-MM-dd');
            if (new Date(sps.onLineRmDate.replace(/-/g, "/")) > new Date(day.replace(/-/g, "/"))) {
                commonService.alert({
                    icon: 'fa-exclamation-circle',
                    content: '该项目' + sps.onLineRmDate + '上线RM，之前日期无法操作排班管理，请重新选择排班日期'
                });
                return false;
            }
            if (validaDatetime(day)) {
                commonService.alert({
                    content: '没有权限，请联系人力资源专员调整之前的排班。',
                    icon: 'fa-exclamation-circle'
                });
                return false;
            }
            $http.get(apiBaseUrl + '/lock-cycle-judgement-app', {
                params: {
                    beginDate: day,
                    endDate: day
                }
            }).then(function (res) {
                if (res.data.state == "0") {
                    commonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: '该日期还未设置对应的考勤周期'
                    });
                    return false;
                }
                var weekIndex = index;
                var copySchedules = JSON.parse(JSON.stringify(sps.scheduleTable));
                var isEmpty = true;
                angular.forEach(copySchedules, function (copySchedule) {
                    if (copySchedule.employeeId == sps.currentEmployee.id && sps.systemAdmin.indexOf(copySchedule.jobId) != -1) {
                        commonService.alert({
                            content: '无权限复制自己班次。',
                            icon: 'fa-exclamation-circle'
                        });
                        return false;
                    }
                    if (!copySchedule.salaryType || !copySchedule.workHours) {
                        commonService.alert({
                            content: '员工' + copySchedule.name + '工资类别或工时制为空，请设置后再排班。',
                            icon: 'fa-exclamation-circle'
                        });
                        return false;
                    }
                    var news = null;
                    if (!_.isEmpty(copySchedule.scheduleCells[weekIndex].regularSchedules) || !_.isEmpty(copySchedule.scheduleCells[weekIndex].overtimeSchedules)) {
                        isEmpty = false;
                    }
                    if (_.isEmpty(copySchedule.scheduleCells[weekIndex - 1].regularSchedules) && _.isEmpty(copySchedule.scheduleCells[weekIndex - 1].overtimeSchedules)
                        && _.isEmpty(copySchedule.scheduleCells[weekIndex - 1].holidaySchedules)) {
                        news = SuperScheduleService.getEmptyCopySchedule(copySchedule.scheduleCells[weekIndex], day);
                    } else {
                        var curday = SuperScheduleService.getEmptyCopySchedule(copySchedule.scheduleCells[weekIndex], day);
                        news = JSON.parse(JSON.stringify(copySchedule.scheduleCells[weekIndex - 1]));
                        news.id = copySchedule.scheduleCells[weekIndex].id || null;
                        news.onDutyDay = day;
                        news = copyArrayIdNull(news, curday, item); //去掉存在Id
                    }
                    angular.extend(copySchedule.scheduleCells[weekIndex], news);
                });
                if (!isEmpty) {
                    commonService.confirm({
                        content: '确定删除当天排班信息，并复制前一天排班信息到当天吗？',
                        callback: function () {
                            sps.scheduleTable = copySchedules;
                            sps.copyState = true;
                            sps.modelState = false;
                            sps.lastCurrentShift = null;
                            recordCopyDate(item);
                            // saveSchedule('all')
                            $scope.gridOptions.data = [];
                            buildGridUI(sps.scheduleTable);
                        }
                    });
                } else {
                    sps.scheduleTable = copySchedules;
                    sps.copyState = true;
                    recordCopyDate(item);
                    // saveSchedule('all')
                    $scope.gridOptions.data = [];
                    buildGridUI(sps.scheduleTable);
                }
            });
        }

        function recordCopyDate(date) {
            var day = $filter('date')(date, 'yyyy-MM-dd');
            if (sps.recordCopyDatetime.length == 0) {
                sps.recordCopyDatetime.push(day);
            } else {
                for (var i = 0; i < sps.recordCopyDatetime.length; i++) {
                    if (sps.recordCopyDatetime[i] != day) {
                        sps.recordCopyDatetime.push(day);
                        break;
                    }
                }
            }
        }

        function copyArrayIdNull(obj, oldObj, date) {
            var isOfficialDay = false;
            var copy = {
                regularSchedules: obj.regularSchedules,
                overtimeSchedules: obj.overtimeSchedules,
                holidaySchedules: obj.holidaySchedules,
                goOutSchedules: obj.goOutSchedules
            }
            for (var k in copy) {
                angular.forEach(copy[k], function (item) {
                    if (k == 'holidaySchedules' && isOfficialHoliday(date)) {
                        isOfficialDay = true
                    }
                    if (item.operationState != 'delete') {
                        item.id = null;
                        item.operationState = 'add';
                        if (oldObj[k] == null) {
                            oldObj[k] = []
                        }
                        if (item.status == 1) {
                            oldObj[k].push(item);
                        }
                    }
                })
            }
            if (isOfficialDay) {
                commonService.alert({
                    content: '法定节假日不可安排月休、做2休1/做1休1、与班次关联的休假，未对此部分排班进行复制。',
                    icon: 'fa-exclamation-circle'
                });
                return null
            }
            return oldObj;
        }

        function getSearchParams(type) {
            var week = getWeekInterval(type);
            var searchInfo = {
                "departments": _.pluck($scope.selectedDepartments, 'department_id'),
                "beginDate": utils.formatDate(week.beginDate),
                "endDate": utils.formatDate(week.endDate),
                "keywords": $scope.keywords,
                "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
                "scheduleStatus": $scope.scheduleStatus,
                "jobStatus": $scope.jobStatus
            };

            return {
                length: $scope.page || 10,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                search: searchInfo
            };
        }

        function isSearchInfoValid() {
            if (!$scope.selectedDepartments || $scope.selectedDepartments.length < 1) {
                commonService.alert({
                    content: "请选择查询部门",
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            if (!$('#scheduledatepicker input[name=start]').datepicker('getDate')) {
                commonService.alert({
                    content: "请选择开始日期",
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            return true;
        }

        function getWeekInterval(type) {
            var beginDate = null;
            switch (type) {
                case "previous":
                    beginDate = changeDate(new Date(sps.currentDate), -7);
                    break;
                case "next":
                    beginDate = changeDate(new Date(sps.currentDate), 7);
                    break;
                default:
                    beginDate = $('#scheduledatepicker input[name=start]').datepicker('getDate');
            }
            return {
                "beginDate": beginDate,
                // "endDate": new Date(changeDay(beginDate, 6))
                "endDate": lessFifteen(beginDate, $('#scheduledatepicker input[name=end]').datepicker('getDate'))
            };
        }

        function lessFifteen(start, end) {
            var startTime = angular.copy(start)
            var endTime = null;
            var bigMore = new Date(changeDate(startTime, 14));
            if (end > bigMore) {
                endTime = bigMore;
            } else {
                endTime = end;
            }
            return endTime;
        }

        function changeDate(date, increment) {
            if (date) {
                var aa = angular.copy(date)
                return new Date(aa.setDate(aa.getDate() + increment));
            }
            return null;
        }

        function applyWeek(datetime, endtime) {
            var oneDayParse = 86400000; //  1000*60*60*24;
            var current = Date.parse(datetime.replace(/-/g, "/"));
            var end = Date.parse(endtime.replace(/-/g, "/"));
            var length = (end - current) / oneDayParse
            var buildWeek = [];
            for (var i = 0; i <= length; i++) {
                var currentDay = current + oneDayParse * i;
                buildWeek.push({
                    date: new Date(currentDay),
                    state: false
                });
            }
            return buildWeek;
        }

        function applyScheduleTable(obj, type) {
            for (var i = 0; i < obj.length; i++) {
                obj[i].workingDuration = 0;
                obj[i].overtimeWorkingDuration = 0;
                obj[i].lieuLeaveDuration = 0;
                var newSchedules = [];
                if (obj[i].schedules) {
                    $scope.showDatetimeDuration.forEach(function (days, key) {
                        var isActive = false;
                        for (var k = 0; k < obj[i].schedules.length; k++) {
                            if ($filter('date')(days.date, 'yyyy-MM-dd') == obj[i].schedules[k].onDutyDay) {
                                isActive = true;
                                var newShecdule = buildExtendRegular(obj[i].schedules[k])
                                newSchedules.push(newShecdule);
                                if (key > 0 && key < $scope.showDatetimeDuration.length - 1) {
                                    obj[i].workingDuration += SuperScheduleService.jobDuration(obj[i].schedules[k], 'label');
                                    obj[i].overtimeWorkingDuration += SuperScheduleService.jobDuration(obj[i].schedules[k], 'overtime');
                                    obj[i].lieuLeaveDuration += SuperScheduleService.jobDuration(obj[i].schedules[k], 'lieuLeave');
                                }
                                break;
                            }
                        }
                        if (!isActive) {
                            var newArray = SuperScheduleService.getEmptySchedule(obj[i], days);
                            newSchedules.push(newArray)
                        }

                    })
                    obj[i].scheduleCells = newSchedules;
                } else {
                    $scope.showDatetimeDuration.forEach(function (days) {
                        var newArray = SuperScheduleService.getEmptySchedule(obj[i], days)
                        newSchedules.push(newArray)
                    })
                    obj[i].scheduleCells = newSchedules;
                }
            }
            if (type == 'join') {
                sps.scheduleTable[sps.joinIndexs] = obj[0];
            } else {
                $scope.gridOptions.data = [];
                sps.scheduleTable = obj;
            }
            buildGridUI(sps.scheduleTable)

        }

        function buildGridUI(data) {
            $scope.gridOptions.enableColumnMenus = false;

            $scope.gridOptions = {
                enableRowSelection: false,
                enableSelectAll: true,
                selectionRowHeaderWidth: 40,
                enableCellSelection: true,
                enableRowHeaderSelection: false,
                enableRowHashing: false,
                headerCellFilter: function (value) {
                    return "";
                }
            }

            $scope.gridOptions.columnDefs = [
                {name: 'name', pinnedLeft: true, width: 60, field: 'name', enableSorting: false, displayName: '姓名'},
                {name: 'jobName', width: 80, field: 'jobName', enableSorting: false, displayName: '职位'},
                {name: 'workGroup', width: 120, field: 'workGroup', enableSorting: false, displayName: '岗位专业分类'},
                {name: 'experience', width: 70, field: 'experience', enableSorting: false, displayName: '经验值'}
            ];

            for (var i = 0; i < $scope.showDatetimeDuration.length; i++) {
                if (i == 0 || i == $scope.showDatetimeDuration.length - 1) {
                    continue;
                }
                $scope.cellIndex = i;
                $scope.gridOptions.columnDefs.push(
                    {
                        name: 'schedules' + i,
                        displayName: $filter('date')($scope.showDatetimeDuration[i].date, 'MM-dd'),
                        // cellTemplate: 'partials/schedules-template.html',
                        cellTemplate: '<div class="vk-schedule-content" ng-class="{\'schedule-list\': grid.appScope.editState}" ng-click="grid.appScope.mouseOverThing(row.entity,row.entity.scheduleCells[' + i + '],rowRenderIndex, ' + i + ')"><div>' +
                        '<div ng-repeat="regular in row.entity.scheduleCells[' + i + '].regularSchedules" ng-if="regular.operationState != \'delete\'">' +
                        '<span class="color-blue">{{regular.before ? regular.before + "+" : "" }}{{regular.relatedShiftLabel ? regular.label + "+" + regular.relatedShiftLabel : regular.label}}{{regular.after ?  "+" + regular.after : "" }}</span>' +
                        '<span class="color-time">{{regular.onDutyTime | limitTo: 5}}-{{regular.relatedOffDutyTime || regular.offDutyTime | limitTo: 5 }}</span>' +
                        '<span class="color-postname">{{regular.postShortName}}</span>' +
                        '</div>' +
                        '<div ng-repeat="overtime in row.entity.scheduleCells[' + i + '].overtimeSchedules" ng-if="overtime.flag != \'extend\' && overtime.operationState != \'delete\'">' +
                        '<span class="color-blue">{{overtime.label || "加班"}}</span>' +
                        '<span class="color-time">{{overtime.overtimeBeginTime | limitTo: 5}}-{{overtime.overtimeEndTime | limitTo: 5}}</span>' +
                        '<span class="color-postname"> {{overtime.postShortName}}</span>' +
                        '</div>' +
                        '<div ng-repeat="holiday in row.entity.scheduleCells[' + i + '].holidaySchedules" ng-if="holiday.operationState != \'delete\'">' +
                        '<span class="color-blue" title="{{holiday.type | holidayTypeFilter}}"> {{holiday.type | holidayTypeFilter}}</span>' +
                        '<span class="color-time" ng-if="holiday.type != \'HOLIDAY_ALTERNATE_HOLIDAY\' && holiday.type != \'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE\'">{{holiday.holidayBeginTime | limitTo: 5}}-{{holiday.holidayEndTime | limitTo: 5}}</span>' +
                        '</div>' +
                        '<div ng-repeat="goOut in row.entity.scheduleCells[' + i + '].goOutSchedules" ng-if="goOut.operationState != \'delete\'">' +
                        '<span class="color-blue">{{goOut.type | holidayTypeFilter}}</span>' +
                        '<span class="color-time">{{goOut.goOutBeginTime | limitTo: 5}}-{{goOut.goOutEndTime | limitTo: 5}}</span>' +
                        '</div>' +
                        '<div ng-if="grid.appScope.isOfficialHoliday(grid.appScope.showDatetimeDuration[' + i + '].date)">法定节假日</div>' +
                        '</div></div>',
                        width: 300,
                        enableSorting: false,
                        headerCellTemplate: '<i ng-init="$index=' + i + '" class="date-checkbox" ng-class="{\'active\': grid.appScope.showDatetimeDuration[' + i + '].state }" ng-show="grid.appScope.editState" ng-click="grid.appScope.selectCopyDate($index,grid.appScope.showDatetimeDuration[' + i + '].state);"></i>（{{grid.appScope.showDatetimeDuration[' + i + '].date | date: "MM-dd"}}{{grid.appScope.showDatetimeDuration[' + i + '].date | date: "EEE"}}）</span></span>' +
                        '<img src="../images/icon-copy.png" ng-show="grid.appScope.editState" class="schedule-icon-mr" ng-click="grid.appScope.copyPreviousDay(grid.appScope.showDatetimeDuration[' + i + '].date,$index)" title="复制前一天">',
                        headerCellClass: 'schedule-header-cell'
                    }
                );

            }

            $scope.gridOptions.columnDefs.push(
                {
                    name: 'workingDuration',
                    field: 'workingDuration',
                    enableSorting: false,
                    width: 110,
                    displayName: '常规出勤时长'
                },
                {
                    name: 'overtimeWorkingDuration',
                    field: 'overtimeWorkingDuration',
                    enableSorting: false,
                    width: 80,
                    displayName: '加班时长'
                },
                {
                    name: 'lieuLeaveDuration',
                    field: 'lieuLeaveDuration',
                    enableSorting: false,
                    width: 80,
                    displayName: '调休时长'
                },
                {name: 'employeeId', field: 'employeeId', enableSorting: false, width: 100, displayName: '资源编号'},
                {name: 'sapId', field: 'sapId', enableSorting: false, width: 100, displayName: 'SAP编号'}
            );


            $scope.gridOptions.data = data;
        }

        // auto-dimension of cells (css) need to force align rows in all containers (left and right pinning)
        var alignContainers = function alignContainers(gridContainer, grid) {
            var rows = angular.element(gridContainer + ' .ui-grid .ui-grid-render-container-body .ui-grid-row');
            var pinnedRowsLeft = angular.element(gridContainer + ' .ui-grid .ui-grid-pinned-container-left .ui-grid-row');
            var gridHasRightContainer = grid.hasRightContainer();
            if (gridHasRightContainer) {
                var pinnedRowsRight = angular.element(gridContainer + ' .ui-grid .ui-grid-pinned-container-right .ui-grid-row');
            }

            var bodyContainer = grid.renderContainers.body;

            // get count columns pinned on left
            var columnsPinnedOnLeft = grid.renderContainers.left.renderedColumns.length;

            for (var r = 0; r < rows.length; r++) {
                // Remove height CSS property to get new height if container resized (slidePanel)
                var elementBody = angular.element(rows[r]).children('div');
                elementBody.css('height', '');
                var elementLeft = angular.element(pinnedRowsLeft[r]).children('div');
                elementLeft.css('height', '');
                if (gridHasRightContainer) {
                    var elementRight = angular.element(pinnedRowsRight[r]).children('div');
                    elementRight.css('height', '');
                }

                // GET Height when set in auto for each container
                // BODY CONTAINER
                var rowHeight = rows[r].offsetHeight;
                // LEFT CONTAINER
                var pinnedRowLeftHeight = 0;
                if (columnsPinnedOnLeft) {
                    pinnedRowLeftHeight = pinnedRowsLeft[r].offsetHeight;
                }
                // RIGHT CONTAINER
                var pinnedRowRightHeight = 0;
                if (gridHasRightContainer) {
                    pinnedRowRightHeight = pinnedRowsRight[r].offsetHeight;
                }
                // LARGEST
                var largest = Math.max(rowHeight, pinnedRowLeftHeight, pinnedRowRightHeight);

                // Apply new row height in each container
                elementBody.css('height', largest);
                elementLeft.css('height', largest);
                if (gridHasRightContainer) {
                    elementRight.css('height', largest);
                }

                // Apply new height in gridRow definition (used by scroll)
                bodyContainer.renderedRows[r].height = largest;
            }
            // NEED TO REFRESH CANVAS
            bodyContainer.canvasHeightShouldUpdate = true;
        };
        // END alignContainers()
        var rowsRenderedTimeout;
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (!sps.copyStem) {
                    sps.copyStem = angular.copy(sps.scheduleShift.employees);
                }
                if (row.isSelected) {
                    if (!row.entity.salaryType || !row.entity.workHours) {
                        commonService.alert({
                            content: "员工" + row.entity.name + "，工资类别或工时制为空，请设置后再排班!",
                            icon: "fa-exclamation-circle"
                        });
                        row.isSelected = false;
                        return false;
                    }
                    getTableRowIndex(row.entity.name, 'add');
                } else {
                    getTableRowIndex(row.entity.name);

                }
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                if (rows.length > 0 && rows[0].isSelected) {
                    if (!sps.copyStem) {
                        sps.copyStem = angular.copy(sps.scheduleShift.employees);
                    }
                    angular.forEach(sps.copyStem, function (item, key) {
                        sps.selectArray.push(key);
                        item.flag = true;
                    });

                } else {
                    sps.selectArray = []
                    angular.forEach(sps.copyStem, function (item, key) {
                        item.flag = false;
                    })
                }
            });
            $scope.gridApi.core.on.rowsRendered($scope, function () {
                if (rowsRenderedTimeout) {
                    $timeout.cancel(rowsRenderedTimeout)
                }
                rowsRenderedTimeout = $timeout(function () {
                    alignContainers('', $scope.gridApi.grid);
                });
            });
            // SCROLL END
            // $scope.gridApi.core.on.scrollEnd($scope, function () {
            //     alignContainers('', $scope.gridApi.grid);
            // });
        };

        function getTableRowIndex(name, type) {
            for (var i = 0; i < sps.copyStem.length; i++) {
                if (sps.copyStem[i].name == name) {
                    if (type) {
                        sps.copyStem[i].flag = true;
                        sps.selectArray.push(i);
                    } else {
                        sps.copyStem[i].flag = false;
                        sps.selectArray.splice(i, 1);
                    }
                    break;
                }

            }
        }

        // 扩展加班时间转为 具体时间段显示
        function buildExtendRegular(object) {
            if (!_.isEmpty(object.overtimeSchedules) && !_.isEmpty(object.regularSchedules)) {
                object.overtimeSchedules.forEach(function (item) {
                    if (item.type.indexOf('AFTERSHIFT') > -1) {
                        item.flag = 'extend';
                        for (var k = 0; k < object.regularSchedules.length; k++) {
                            if (item.type.indexOf(object.regularSchedules[k].type) != -1) {
                                object.regularSchedules[k].after = (defaultTimeDuration.indexOf(item.overtimeEndTime) - defaultTimeDuration.indexOf(item.overtimeBeginTime)) / 2;
                                break;
                            }
                        }
                    } else if (item.type.indexOf('BEFORESHIFT') > -1) {
                        item.flag = 'extend';
                        for (var k = 0; k < object.regularSchedules.length; k++) {
                            if (item.type.indexOf(object.regularSchedules[k].type) != -1) {
                                object.regularSchedules[k].before = (defaultTimeDuration.indexOf(item.overtimeEndTime) - defaultTimeDuration.indexOf(item.overtimeBeginTime)) / 2;
                                break;
                            }
                        }
                    }
                })
            }
            if (!_.isEmpty(object.regularSchedules)) {
                var flagLabelKey = null;
                sps.isGroupShift = false
                object.regularSchedules.forEach(function (obj, key) {
                    if (obj.relatedShiftLabel) {
                        sps.isGroupShift = true
                        for(var k in object.regularSchedules) {
                            if (object.regularSchedules[k].label == obj.relatedShiftLabel) {
                                flagLabelKey = k
                                break;
                            }
                        }
                        if (flagLabelKey != null) {
                            obj.relatedShift = object.regularSchedules[flagLabelKey]
                            obj.relatedOffDutyTime = object.regularSchedules[flagLabelKey].offDutyTime
                        }
                    }
                });
                if (flagLabelKey != null) {
                    object.regularSchedules.splice(flagLabelKey, 1)
                }
            }
            // 处理组合班次休假
            var flagDutyIndex = null;
            angular.forEach(object.holidaySchedules, function (item){
                if (item.relatedShiftType && item.relatedShiftType.indexOf('REGULAR') != -1 && sps.isGroupShift) {
                    item.isGroupShift = true;
                        for(var i = 0; i < object.holidaySchedules.length; i++) {
                            if (object.holidaySchedules[i].relatedShiftType && object.holidaySchedules[i].relatedShiftType.indexOf('DUTY') != -1){
                                flagDutyIndex = i;
                                object.holidaySchedules[i].unShow = true
                                break;
                            }
                        }
                    item.regularOffDutyTime = findShiftByType(object.regularSchedules, item.relatedShiftType).offDutyTime;
                    item.regularOnDutyTime = findShiftByType(object.regularSchedules, item.relatedShiftType).onDutyTime;
                    if (flagDutyIndex != null) {
                        item.holidayEndTime = object.holidaySchedules[flagDutyIndex].holidayEndTime;
                        item.groupShiftData = object.holidaySchedules[flagDutyIndex];
                    }
                }
            })
            if (flagDutyIndex != null) {
                object.holidaySchedules.splice(flagDutyIndex, 1);
            }
            return object;
        }

        $scope.mouseOverThing = function (item, schedule, index, week) {
            if (!$scope.editState) return
            var temp = item.salaryType ? item.salaryType.replace(/(^\s*)|(\s*$)/g, '') : '';
            if (!sps.onLineRmDate) {
                sps.onLineRmDate = item.onLineDate;
            }
            // 未设置考勤周期时，提示不能排班
            $http.get(apiBaseUrl + '/lock-cycle-judgement-app', {
                params: {
                    beginDate: schedule.onDutyDay,
                    endDate: schedule.onDutyDay
                }
            }).then(function (res) {
                if (res.data.state == "0") {
                    commonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: '该日期还未设置对应的考勤周期'
                    });
                    return false;
                }
                if (!sps.onLineRmDate) {
                    commonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: '该项目未上线RM，暂不能排班'
                    });
                    return false;
                }
                if (new Date(sps.onLineRmDate.replace(/-/g, "/")) > new Date(schedule.onDutyDay.replace(/-/g, "/"))) {
                    ngToast.show('该项目' + item.onLineDate + '上线RM，之前日期无法操作排班管理，请重新选择排班日期');
                    return false;
                }
                if ((!temp && temp != '05' && temp != '04') || !item.workHours) {
                    commonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: schedule.name + '的工资类别或工时制未标识，无法进行排班。请设置后再排班'
                    });
                    return false;
                }
                if (sps.unfinishedShift) {
                    commonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: '未选择' + sps.unfinishedShift + '的班次,请确保岗位班次完整性。'
                    });
                    return false;
                }
                if (validaLockDates(schedule)) {
                    commonService.alert({
                        content: '该班次已定案',
                        icon: 'fa-exclamation-circle'
                    });
                    return false;
                }
                if (validaAuthority(sps.currentEmployee.id, item)) {
                    commonService.alert({
                        content: '没有权限，请联系人力资源专员排我的班',
                        icon: 'fa-exclamation-circle'
                    });
                    return false;
                }
                if (validaDatetime(schedule.onDutyDay, item)) {
                    commonService.alert({
                        content: '没有权限，请联系人力资源专员调整之前的排班。',
                        icon: 'fa-exclamation-circle'
                    });
                    return false;
                }
                if (item.transferNotScheduleDates && validaEmployeeTransfer(item, schedule.onDutyDay)) {
                    return false
                }
                if (sps.lastCurrentShift) {
                    sps.nowCurrentShift = angular.copy(sps.modelActiveShift);
                }
                if (sps.lastCurrentShift && sps.nowCurrentShift && (JSON.stringify(sps.lastCurrentShift) != JSON.stringify(sps.nowCurrentShift))) {
                    sps.joinIndexs = sps.joinIndex
                    var scheduleObj = {
                        item: item,
                        schedule: schedule,
                        index: index,
                        week: week
                    }
                    saveSchedule('modelSave', scheduleObj)
                } else {
                    // 校验当天时候含有一次性休假一整天的休假
                    if (chenkOneOffHolidayUnitDay(schedule)) {
                        $scope.oneOffHolidayLimit = true
                        // commonService.alert({
                        //     content: '当天已申请了整天休假，不可再安排其他任何类型班次！',
                        //     icon: 'fa-exclamation-circle'
                        // })
                        // sps.modelActiveShift = {}
                        // sps.lastCurrentShift = null;
                        // sps.modelState = false;
                        // sps.unfinishedShift = null;
                        // return false
                    } else {
                        $scope.oneOffHolidayLimit = false
                    }
                    sps.speciallyHoliday = angular.copy(schedule);
                    sps.loadingDate = false;
                    checkDayGroup(item, index, week);  //获取前一天最末时间，后一天最前时间
                    openModel();
                    buildScheduleModel(item, schedule, index, week)
                }
            });
        };
        function validaAuthority(user, item) {
            if (user == item.employeeId && sps.systemAdmin.indexOf(item.jobId) != -1) {
                return true;
            } else {
                return false;
            }
        }

        function validaDatetime(time, item) {
            var now = $filter('date')(new Date(), 'yyyy/MM/dd'); // 从00：00：00 开始
            var currentTime = new Date(time.replace(/-/g, "/"));
            if (new Date(now) > currentTime && sps.systemAdmin.indexOf(sps.currentEmployee.workJob.workJobId) != -1) {
                return true;
            } else {
                return false
            }
        }
        
        function validaEmployeeTransfer(item, datetime) {
            var result = false;
            var TransferFlagInfo = [
                '之后日期不可以在本项目排班，请知晓',
                '已设置完成“变动确认”，不可以修改排班，请知晓',
                '请确认设置“变动人员之前结余调休假规则设置”，完成之后才可以排班，请知晓',
                '之前日期不可以在本项目排班，请知晓',
                '人员变动确认后，不可以修改变动前的排班'
            ]
            for(var i in item.transferNotScheduleDates) {
                if (item.transferNotScheduleDates[i] == datetime) {
                    result = true;
                    commonService.alert({
                        content: '该员工于' + item.transferDate + '变动，' + TransferFlagInfo[item.transferFlag - 1],
                        icon: 'fa-exclamation-circle'
                    });
                    break;
                }
            }
            return result
        }

        function checkDayGroup(item, index, week) {
            var prevDay = item.scheduleCells[week - 1], today = item.scheduleCells[week], nextDay = item.scheduleCells[week + 1];
            sps.dayCheck = SuperScheduleService.getDayCheck(prevDay, nextDay);
        }

        // 是否定案
        function validaLockDates(item) {
            var result = false
            if (!_.isEmpty(sps.lockDates)) {
                for (var i = 0; i < sps.lockDates.length; i++) {
                    if (item.onDutyDay == sps.lockDates[i]) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }

        function openModel() {
            sps.modelState = true;
            $scope.tab = 1;
        }

        function closeModel() {
            if (sps.unfinishedShift) {
                commonService.confirm({
                    content: '未选择' + sps.unfinishedShift + '的班次,请确保岗位班次完整性。',
                    cancel: function () {
                        sps.modelActiveShift = {}
                        sps.lastCurrentShift = null;
                        sps.modelState = false;
                        sps.unfinishedShift = null;
                    }
                });
                return false;
            }
            if (sps.lastCurrentShift) {
                sps.nowCurrentShift = angular.copy(sps.modelActiveShift);
            }
            if (sps.lastCurrentShift && sps.nowCurrentShift && (JSON.stringify(sps.lastCurrentShift) != JSON.stringify(sps.nowCurrentShift))) {
                commonService.confirm({
                    content: '是否保存修改后的排班',
                    callback: function () {
                        sps.joinIndexs = sps.joinIndex;
                        saveSchedule('close');
                    },
                    cancel: function () {
                        sps.modelActiveShift = {}
                        sps.lastCurrentShift = null;
                        sps.modelState = false;
                    }
                });
            } else {
                sps.modelState = false;
            }
        }

        $scope.$watch('editState', function () {
            if (!$scope.editState) {
                initCopyScheduleData();
                angular.forEach($scope.showDatetimeDuration, function (item, key) {
                    item.state = false;
                })
            }
        });
        $scope.$watch('sps.overtime.minValue', function () {
            if (sps.overtime && sps.currentLineOvertime.postId) {
                if ((sps.overtime.maxValue - sps.overtime.minValue) < 1) {
                    sps.toast = '加班时长需大于0';
                    return false;
                }
                var objs = {
                    overtimeBeginTime: SuperScheduleService.getTimeDuration(sps.overtime.minValue),
                    overtimeEndTime: SuperScheduleService.getTimeDuration(sps.overtime.maxValue)
                }
                checkFixedOvertime(objs)
                sps.currentLineOvertime.overtimeBeginTime = SuperScheduleService.getTimeDuration(sps.overtime.minValue);
                if (sps.currentLineOvertime.overtimeEndTime && sps.currentLineOvertimeNo == null) {
                    sps.modelActiveShift.overtimeSchedules.push(sps.currentLineOvertime);
                    sps.currentLineOvertimeNo = SuperScheduleService.setCurrentLine(sps.modelActiveShift.overtimeSchedules);
                }
            }
        });
        $scope.timelineScrollState = 'over';
        $scope.$on('timeline-focus', function (event, state, data) {
            $scope.timelineScrollState = state;
            $scope.timelineScrollData = data;
            if (state == 'over') {
                if ($scope.tab == 3) {
                    updateWholeShiftStatus(data)
                }
            }
        });

        function updateWholeShiftStatus(data) {
            var modelMin = data.modelMin > 47 ? defaultTimeDuration[data.modelMin - 48] : data.filteredModelMin + ':00';
            var modelMax = data.modelMax > 47 ? defaultTimeDuration[data.modelMax - 48] : data.filteredModelMax + ':00';
            for (var i in sps.modelActiveShift.regularSchedules) {
                var shift = sps.modelActiveShift.regularSchedules[i];
                if (shift.operationState != 'delete' && shift.type == sps.cacheHoliday.relatedShiftType) {
                    if (shift.onDutyTime == modelMin && shift.offDutyTime == modelMax) {
                        $scope.$apply(function () {
                            sps.cacheHoliday.holidayType = 1;
                            sps.cacheHoliday.holidayType = 1
                        });
                    } else if (shift.diningStartDatetime == modelMax && shift.onDutyTime == modelMin) {
                        $scope.$apply(function () {
                            sps.cacheHoliday.holidayType = 2;
                        });
                    } else if (shift.diningEndDatetime == modelMin && shift.offDutyTime == modelMax) {
                        $scope.$apply(function () {
                            sps.cacheHoliday.holidayType = 3;
                        });
                    } else {
                        $scope.$apply(function () {
                            sps.cacheHoliday.holidayType = 0;
                        });
                    }
                    break;
                }
            }
        }

        $scope.$watch('sps.overtime.maxValue', function () {
            if (sps.overtime && sps.currentLineOvertime.postId && $scope.timelineScrollState != 'over') {
                if ((sps.overtime.maxValue - sps.overtime.minValue) < 1) {
                    sps.toast = '加班时长需大于0';
                    return false;
                }
                var objs = {
                    overtimeBeginTime: SuperScheduleService.getTimeDuration(sps.overtime.minValue),
                    overtimeEndTime: SuperScheduleService.getTimeDuration(sps.overtime.maxValue)
                }
                checkFixedOvertime(objs)
                sps.currentLineOvertime.overtimeEndTime = SuperScheduleService.getTimeDuration(sps.overtime.maxValue);
                if (sps.currentLineOvertime.overtimeBeginTime && sps.currentLineOvertimeNo == null) {
                    sps.modelActiveShift.overtimeSchedules.push(sps.currentLineOvertime);
                    sps.currentLineOvertimeNo = SuperScheduleService.setCurrentLine(sps.modelActiveShift.overtimeSchedules);
                }
            }
        });
        $scope.$watch('sps.holidayRange.minValue', function () {
            if (sps.holidayRange && sps.cacheHoliday && $scope.timelineScrollState != 'over') {
                if ((sps.holidayRange.maxValue - sps.holidayRange.minValue ) < 1) {
                    sps.toast = '休假时间不得少于0.5个小时';
                    return false;
                }
                sps.cacheHoliday.holidayBeginTime = SuperScheduleService.getTimeDuration(sps.holidayRange.minValue)
                // if (sps.cacheHoliday.type && sps.currentLineHolidayNo == null) {
                //     sps.modelActiveShift.holidaySchedules.push(sps.cacheHoliday);
                //     sps.currentLineHolidayNo = SuperScheduleService.setCurrentLine(sps.modelActiveShift.holidaySchedules);
                // }
            }
        });

        $scope.$watch('sps.holidayRange.maxValue', function () {
            if (sps.holidayRange && sps.cacheHoliday) {
                if ((sps.holidayRange.maxValue - sps.holidayRange.minValue ) < 1) {
                    sps.toast = '休假时间不得少于0.5个小时';
                    return false;
                }
                sps.cacheHoliday.holidayEndTime = SuperScheduleService.getTimeDuration(sps.holidayRange.maxValue);
            }
        });
        $scope.$watch('sps.goOutRange.minValue', function () {
            if (sps.goOutRange && sps.cacheGoOut) {
                if ((sps.goOutRange.maxValue - sps.goOutRange.minValue ) < 1) {
                    sps.toast = '出差、外勤时间不得少于0.5个小时';
                    return false;
                }
                sps.cacheGoOut.goOutBeginTime = SuperScheduleService.getTimeDuration(sps.goOutRange.minValue)
                if (sps.cacheGoOut.type && sps.currentLineGoOutNo == null) {
                    sps.modelActiveShift.goOutSchedules.push(sps.cacheGoOut);
                    sps.currentLineGoOutNo = SuperScheduleService.setCurrentLine(sps.modelActiveShift.goOutSchedules);
                }
            }
        });

        $scope.$watch('sps.goOutRange.maxValue', function () {
            if (sps.goOutRange && sps.cacheGoOut) {
                if ((sps.goOutRange.maxValue - sps.goOutRange.minValue ) < 1) {
                    sps.toast = '出差、外勤时间不得少于0.5个小时';
                    return false;
                }
                sps.cacheGoOut.goOutEndTime = SuperScheduleService.getTimeDuration(sps.goOutRange.maxValue)
            }
        });

        function buildScheduleModel(item, schedule, index, week) {
            // 校验当天时候含有一次性休一整天的休假
            if (chenkOneOffHolidayUnitDay(schedule)) {
                $scope.oneOffHolidayLimit = true
                // commonService.alert({
                //     content: '当天已经排有整天休假班次，不可再安排其他任何类型班次！',
                //     icon: 'fa-exclamation-circle'
                // });
                // sps.modelActiveShift = {};
                // sps.lastCurrentShift = null;
                // sps.modelState = false;
                // sps.unfinishedShift = null;
                // return false
            } else {
                $scope.oneOffHolidayLimit = false
            }
            sps.saveEmployees = item;
            sps.joinIndex = index;
            sps.editTableIndex = index;
            sps.editTableWeek = week;
            $timeout(function () {
                sps.loadingDate = true;
            }, 200)
            sps.showTable = {
                name: item.name,
                member: item.jobName,
                experience: item.experience,
                datetime: schedule.onDutyDay,
                jobId: item.jobId,
                employeeId: item.employeeId,
                departmentId: item.departmentId,
                isOuter: item.isOuter == '1'
            };
            sps.overtime = {
                range: {
                    min: 0,
                    max: 72
                },
                minValue: 40,
                maxValue: 48,
                disabled: false
            };
            sps.holidayRange = angular.copy(sps.overtime);
            sps.goOutRange = angular.copy(sps.overtime);
            var timer = 0;
            if ($scope.getHolidayMonthlyParams && $scope.getHolidayMonthlyParams.employeeId == sps.showTable.employeeId) {
                // 同一个人
                timer = 2000;
            } else {
                // 不同一个人
                timer = 0;
            }
            $scope.getHolidayMonthlyParams = {
                employeeId: sps.showTable.employeeId,
                onDutyDay: sps.showTable.datetime
            }
            $scope.showHolidayMonthlyLoading = true;
            commonService.progress('start')
            $timeout(function () {
                SuperScheduleService.getHolidayMonthly($scope.getHolidayMonthlyParams)
                    .then(function (res) {
                        commonService.progress('end')
                        $scope.holidayMonthlyBalance = res.balance;
                        $scope.isCheckHolidayMonthly = res.checkable;
                        $scope.salaryType = res.salaryType;
                        $scope.showHolidayMonthlyLoading = false;
                    })
            }, timer);
            resetCurrentShift(schedule);

        }

        function resetCurrentShift(obj) {
            var object = angular.copy(obj);
            sps.currentShift = {
                "id": object.id || null,
                "employeeId": object.employeeId || null,
                "sapId": object.sapId || null,
                "name": object.name || null,
                "onDutyDay": object.onDutyDay
            }
            sps.modelActiveShift = {
                "regularSchedules": object.regularSchedules || [],
                "overtimeSchedules": SuperScheduleService.buildOvertimeSchedules(object.overtimeSchedules) || [],
                "holidaySchedules": object.holidaySchedules || [],
                "goOutSchedules": object.goOutSchedules || []
            }
            angular.extend(sps.currentShift, sps.modelActiveShift);
            sps.lastCurrentShift = angular.copy(sps.modelActiveShift);
            sps.cacheHoliday = {};
            sps.cacheGoOut = {};
            sps.currentLineOvertimeNo = null;
            sps.currentLineShiftNo = null;
            sps.currentLineHolidayNo = null;
            sps.currentLineGoOutNo = null;
            sps.currentLineShift = {};
            sps.currentLineOvertime = {};
            sps.unfinishedShift = null;
            sps.onHolidayRest = null
            $scope.lieuLeaveObj = {}
            isExistAlternateHoliday(sps.modelActiveShift.holidaySchedules)
        }

        function setBeforeShiftOvertime(time) {
            if (sps.currentLineShift.relatedShift) {
                sps.toast = '组合班次不支持前后扩展班';
                return false;
            }
            if (sps.currentLineShift.before == time) {
                // 反选
                // sps.delExtendShift('before');
                sps.currentLineShift.before = null;
                sps.currentLineShiftBefore = {};
                delOptionShiftExtend('before', sps.currentLineShift.type);
                return false;
            }
            var ob = {
                overtimeEndTime: sps.currentLineShift.onDutyTime,
                overtimeBeginTime: SuperScheduleService.getTimeDuration(sps.currentLineShift.onDutyTime, time, 'before')
            }
            if (checkFixedOvertime(ob, 'before', sps.currentLineShift.type)) {
                return false;
            }
            sps.currentLineShiftBefore.overtimeEndTime = sps.currentLineShift.onDutyTime;
            sps.currentLineShiftBefore.overtimeBeginTime = SuperScheduleService.getTimeDuration(sps.currentLineShift.onDutyTime, time, 'before')
            sps.currentLineShiftBefore.flag = 'extend';
            if (sps.currentLineShift.before == null) {
                sps.currentLineShift.before = time;
                sps.currentLineShiftBefore.operationState = 'add';
                sps.currentLineShiftBefore.postId = sps.currentLineShift.postId;
                sps.currentLineShiftBefore.type = SuperScheduleService.regularTypeToOvertime(sps.currentLineShift.type, 'before');
                sps.modelActiveShift.overtimeSchedules.push(sps.currentLineShiftBefore);
            } else {
                sps.currentLineShift.before = time;
            }

        }

        function setAfterShiftOvertime(time) {
            if (sps.currentLineShift.relatedShift) {
                sps.toast = '组合班次不支持前后扩展班';
                return false;
            }
            if (sps.currentLineShift.after == time) {
                sps.currentLineShift.after = 0;
                sps.currentLineShiftAfter = {};
                delOptionShiftExtend('after', sps.currentLineShift.type);
                // sps.delExtendShift('after');
                return false;
            }
            var endTime = SuperScheduleService.isCrossDay(sps.currentLineShift);

            var objss = {
                overtimeEndTime: SuperScheduleService.getTimeDuration(endTime, time, 'after'),
                overtimeBeginTime: endTime
            }
            if (!objss.overtimeEndTime) {
                sps.toast = '超过第二天中午12点的加班请在第二天的排班界面中添加。';
                return false
            }
            if (checkFixedOvertime(objss, 'after', sps.currentLineShift.type)) {
                return false;
            }
            sps.currentLineShiftAfter.overtimeEndTime = SuperScheduleService.getTimeDuration(endTime, time, 'after');
            sps.currentLineShiftAfter.overtimeBeginTime = endTime;
            sps.currentLineShiftAfter.flag = 'extend';
            if (sps.currentLineShift.after == null) {
                sps.currentLineShift.after = time;
                sps.currentLineShiftAfter.operationState = 'add';
                sps.currentLineShiftAfter.postId = sps.currentLineShift.postId;
                sps.currentLineShiftAfter.type = SuperScheduleService.regularTypeToOvertime(sps.currentLineShift.type, 'after');
                sps.modelActiveShift.overtimeSchedules.push(sps.currentLineShiftAfter);
            } else {
                sps.currentLineShift.after = time;
            }
        }

        function getOptionShiftValue(obj) {
            if (sps.currentLineShift.status == 0) return
            if (obj.label == sps.currentLineShift.label) {
                // 班次不做反选
                return false;
            }
            if (checkFixedOvertime(obj, 'label')) {
                return false;
            }
            delRelatedHoliday(sps.currentLineShift.label);
            sps.currentLineShiftBefore = {};
            sps.currentLineShiftAfter = {};
            sps.currentLineShift.label = obj.label;
            sps.currentLineShift.before = null;
            sps.currentLineShift.after = null;
            sps.currentLineShift.onDutyTime = obj.onDutyTime;
            sps.currentLineShift.offDutyTime = obj.offDutyTime;
            sps.currentLineShift.relatedOffDutyTime = obj.relatedOffDutyTime;
            sps.currentLineShift.diningDuration = obj.diningDuration;
            sps.currentLineShift.diningStartDatetime = obj.diningStartDatetime;
            sps.currentLineShift.diningEndDatetime = obj.diningEndDatetime;
            if (obj.relatedShift) {
                sps.currentLineShift.relatedShift = obj.relatedShift;
                sps.currentLineShift.relatedShiftLabel = obj.relatedShift.label;
            } else {
                sps.currentLineShift.relatedShiftLabel = null
            }

            if (sps.unfinishedShift) {
                if (sps.currentLineShift.postShortName == sps.unfinishedShift.split('-')[1]) {
                    sps.unfinishedShift = null;
                }
            }

            if (!sps.currentLineShift.type && sps.currentLineShiftNo == null) {
                sps.currentLineShift.operationState = 'add';
                sps.currentLineShift.type = SuperScheduleService.autoFillRegularType(sps.modelActiveShift.regularSchedules, obj.shiftType);
                sps.modelActiveShift.regularSchedules.push(sps.currentLineShift);
                // sps.modelActiveShift.regularSchedules.push(relatedShift);
                sps.currentLineShiftNo = SuperScheduleService.setCurrentLine(sps.modelActiveShift.regularSchedules);
            } else {
                if (sps.currentLineShift.relatedShift && sps.currentLineShift.relatedShift.id) {
                    sps.currentLineShift.relatedShift.operationState = 'delete'
                    sps.modelActiveShift.regularSchedules.push(sps.currentLineShift.relatedShift);
                    sps.currentLineShift.relatedShift = null
                    // sps.currentLineShift.relatedShift = obj.relatedShift;
                }
                if (!obj.relatedShift){
                    sps.currentLineShift.relatedShift = null
                }
                delOptionShiftExtend('before', sps.currentLineShift.type);
                delOptionShiftExtend('after', sps.currentLineShift.type);
                sps.currentLineShift.type = SuperScheduleService.autoFillRegularType(sps.modelActiveShift.regularSchedules, obj.shiftType, sps.currentLineShiftNo);
            }
        }
        // 是否存在有效常规班
        function isExistShifts(obj) {
            var result = false;
            var str = 0;
            angular.forEach(obj, function(item) {
                if (item.operationState == 'delete') {
                    str += 1;
                }
            });
            if ((obj.length - str) > 0 ) {
                result = true;
            }
            return result;
        }
        // 是否存在月休
        function isExistAlternateHoliday(obj) {
            if (_.isEmpty(obj)) return
            for (var o = 0; o < obj.length; o++) {
                if (obj[o].type == 'HOLIDAY_ALTERNATE_HOLIDAY' && obj[o].operationState != 'delete') {
                    sps.onHolidayRest = 'HOLIDAY_ALTERNATE_HOLIDAY'
                    return
                }
                if (obj[o].type == 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE' && obj[o].operationState != 'delete') {
                    sps.onHolidayRest = 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE'
                    return
                }
            }
        }

        // 是否存在休假 or 做2休1
        function isExistOtherHoliday(obj, id) {
            var keys = []
            if (!_.isEmpty(obj)) {
                angular.forEach(obj, function (item, key) {
                    if (item.operationState == 'delete') {
                        keys.push(key)
                    } else {
                        if (item.type == 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE'
                            || item.type == 'HOLIDAY_ALTERNATE_HOLIDAY') {
                            keys.push(key)
                        }
                    }
                });
            } else {
                return false
            }
            if (id == 0 && (obj.length - keys.length) > 0) {
                var flag = false;
                var str = SuperScheduleService.holidayTypeList('oneOff')
                angular.forEach(obj, function (o) {
                    var b = _.filter(str, function (s) {
                        return s.code == o.type;
                    });
                    if (!_.isEmpty(b)) {
                        flag = true
                    }
                })
                if (flag) {
                    return false;
                }
            }
            return (obj.length - keys.length) > 0 ? true : false
        }

        function setHolidayRest(item, index) {
            // 反选
            if (sps.onHolidayRest == item.code) {
                sps.onHolidayRest = null;
                del.shiftByType(sps.modelActiveShift.holidaySchedules, item.code)
                if (index == 0) {
                    $scope.holidayMonthlyBalance += 1;
                }
                return false;
            } else {
                if (isExistOtherHoliday(sps.modelActiveShift.holidaySchedules, index)) {
                    sps.toast = '已有休假，不需再安排' + item.name;
                    return false;
                }
                var delType = index == 1 ? 'HOLIDAY_ALTERNATE_HOLIDAY' : 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE';
                if (sps.onHolidayRest == 'HOLIDAY_ALTERNATE_HOLIDAY' && $scope.isCheckHolidayMonthly && !sps.showTable.isOuter) {
                    $scope.holidayMonthlyBalance += 1;
                }
                if (index == 0) {
                    if (!sps.showTable.isOuter && $scope.holidayMonthlyBalance == 0 && $scope.isCheckHolidayMonthly) {
                        sps.toast = '月休额度已用完,无法再排月休假'
                        return false
                    }
                    del.shiftByType(sps.modelActiveShift.holidaySchedules, delType)
                    addShift.holidayRest(item.code);
                    sps.onHolidayRest = item.code;
                    // 非正编不计算月休额度
                    if ($scope.holidayMonthlyBalance > 0 && $scope.isCheckHolidayMonthly) {
                        $scope.holidayMonthlyBalance -= 1;
                    }
                    $scope.tab = 1;
                } else {
                    del.shiftByType(sps.modelActiveShift.holidaySchedules, delType)
                    addShift.holidayRest(item.code)
                    sps.onHolidayRest = item.code;
                }
                if ($scope.tab == 3) {
                    $scope.tab = 1;
                }
            }
        }

        function deleteHoliday() {
            var result = [];
            angular.forEach(sps.modelActiveShift.holidaySchedules, function (item) {
                if (item.id && item.type != 'HOLIDAY_ALTERNATE_HOLIDAY' && item.type != 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE') {
                    if (item.status == 0) {
                        result.push(item);
                    } else {
                        item.operationState = 'delete';
                        result.push(item);
                    }
                }
                if (item.type == 'HOLIDAY_ALTERNATE_HOLIDAY' || item.type == 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE') {
                    result.push(item);
                }

            });
            sps.modelActiveShift.holidaySchedules = result;
        }

        function getFixedOvertime(data) {
            if (data.label == sps.currentLineOvertime.label) {
                sps.currentLineOvertime.label = null;
                sps.overtime.disabled = false;
                if (sps.currentLineOvertimeNo || sps.currentLineOvertimeNo == 0) {
                    sps.currentLineOvertime.type = SuperScheduleService.autoFillOvertimeType(sps.modelActiveShift.overtimeSchedules);
                }
                return false;
            }
            if (checkFixedOvertime(data, 'label')) {
                return false;
            }
            sps.overtime.minValue = defaultTimeDuration.indexOf(data.onDutyTime);
            sps.overtime.maxValue = defaultTimeDuration.indexOf(data.offDutyTime);
            var endTime = data.offDutyTime;
            if (sps.overtime.minValue > sps.overtime.maxValue) {
                sps.overtime.maxValue += 48;
                endTime = changeTime48(data.offDutyTime)
            }
            sps.overtime.disabled = true;
            sps.currentLineOvertime.overtimeBeginTime = data.onDutyTime;
            sps.currentLineOvertime.overtimeEndTime = endTime;
            sps.currentLineOvertime.label = data.label;
            sps.currentLineOvertime.type = SuperScheduleService.autoFillOvertimeType(sps.modelActiveShift.overtimeSchedules, sps.currentLineOvertime.label);
        }

        function changeTime48(time) {
            var str = defaultTimeDuration.indexOf(time);
            str += 48;
            return SuperScheduleService.getTimeDuration(str);
        }

        // 选择固定岗位
        function selectPost(post) {
            if ($scope.tab == 1) {
                if (sps.currentLineShift.status == 0) {
                    return
                }
                if (post.postId == sps.currentLineShift.postId) {
                    sps.currentLineShiftNo = null;
                    sps.currentLineShift = {};
                    return false;
                }
                if (sps.currentLineShift.before) {
                    delOptionShiftExtend('before', sps.currentLineShift.type)
                }
                if (sps.currentLineShift.after) {
                    delOptionShiftExtend('after', sps.currentLineShift.type)
                }
                delRelatedHoliday(sps.currentLineShift.label);
                sps.currentLineShift.postId = post.postId;
                sps.currentLineShift.postShortName = post.postShortName;
                sps.currentLineShift.label = null;
                sps.currentLineShift.diningDuration = null;
                sps.currentLineShift.diningStartDatetime = null;
                sps.currentLineShift.diningEndDatetime = null;
                sps.currentLineShift.onDutyTime = null;
                sps.currentLineShift.offDutyTime = null;
                sps.currentLineShift.before = null;
                sps.currentLineShift.after = null;
                if (sps.currentLineShiftNo != null) {
                    sps.unfinishedShift = sps.showTable.name + '-' + post.postShortName;
                }
                commonService.progress('start')
                SuperScheduleService.getShiftsFromPost(sps.departmentId, sps.showTable.jobId, post.postId, sps.showTable.datetime)
                    .then(function (res) {
                        commonService.progress('end')
                         if (res.status == 'fail') {
                             sps.toast = '请求出错!';
                         } else {
                             $scope.defaultShifts = res.shifts;
                             angular.forEach($scope.defaultShifts, function (item) {
                                if (item.relatedShift) {
                                    item.relatedOffDutyTime = item.relatedShift.offDutyTime;
                                    item.relatedShift.id = null
                                    item.groupLabel = item.label + '+' + item.relatedShift.label;
                                }
                             });
                             if (res.shifts == null) {
                                 sps.toast = '请设置该岗位的上岗规则!';
                             }
                         }
                    })
            } else if ($scope.tab == 2) {
                if (sps.currentLineOvertime.postId == post.postId) {
                    sps.currentLineOvertime = {};
                    sps.currentLineOvertimeNo = null;
                    $scope.defaultShifts = [];
                    sps.overtime.disabled = false;
                    return false
                }
                sps.currentLineOvertime.postId = post.postId;
                sps.currentLineOvertime.postShortName = post.postShortName;
                if (!sps.currentLineOvertime.id) {
                    sps.currentLineOvertime.operationState = 'add';
                }
                sps.currentLineOvertime.type = SuperScheduleService.autoFillOvertimeType(sps.modelActiveShift.overtimeSchedules, sps.currentLineOvertime.label);
                SuperScheduleService.getShiftsFromPost(sps.departmentId, sps.showTable.jobId, post.postId, sps.showTable.datetime)
                    .then(function (res) {
                        if (res.status == 'fail') {
                            sps.toast = '请求出错!';
                        }else {
                             $scope.defaultShifts = res.shifts;
                            if (!res.shifts) {
                                sps.overtime.disabled = false;
                                sps.currentLineOvertime.label = null;
                            }
                        }
                    });
            }
        }

        function selectType(item) {
            if (sps.cacheHoliday.type == item) {
                sps.cacheHoliday = {};
                sps.holidayRange.disabled = false;
                sps.currentLineHolidayNo = null;
                return false
            }
            if (!sps.currentShift) {
                sps.toast = '请先排常规班次,在排休假!';
                return false;
            }
            // 法定节假日允许排一次性取假
            if (!sps.showTable.isOuter && isOfficialHoliday(sps.showTable.datetime)) {
                var list = SuperScheduleService.holidayTypes();
                var result = false;
                for (var k in list) {
                    if (!list[k].oneOff && list[k].code == item && item != 'HOLIDAY_PRIVATE_AFFAIR') {
                        sps.toast = '法定节假日期间只允许安排一次性取休假类型或事假';
                        result = true;
                        break;
                    }
                }
                if (result) {
                    return false
                }
            }
            // 记录当前选择班次,默认第一个
            $scope.holidayflag = getHolidayFlag(sps.modelActiveShift.regularSchedules);
            // 组合班次拆休假为两段
            sps.isGroupShift = sps.modelActiveShift.regularSchedules[$scope.holidayflag].relatedShiftLabel ? true : false;
            $scope.isShowHalfShifts = sps.modelActiveShift.regularSchedules[$scope.holidayflag].diningStartDatetime ? true : false;
            if (!sps.showTable.isOuter && item == 'HOLIDAY_ADJUSTABLE') {
                if ($scope.isCheckLeaveBalance) {
                    SuperScheduleService.getLieuLeaveBalance({
                        employeeId: sps.showTable.employeeId,
                        onDutyDay: sps.showTable.datetime
                    }).then(function (res) {
                        $scope.lieuLeaveObj = res;
                        $scope.isCheckLeaveBalance = res.check;
                        if (res.check && res.lieuLeaveBalance == 0) {
                            sps.toast = '剩余调休额度为0,不能再排调休假！';
                            return false
                        } else {
                            // if (sps.currentLineHolidayNo != null && sps.cacheHoliday.id) {
                            //     sps.modelActiveShift.holidaySchedules[sps.currentLineHolidayNo].operationState = 'delete';
                            // }
                            setCacheHoliday(item, 'HOLIDAY_ADJUSTABLE')
                        }
                    });
                }
            } else {
                $scope.lieuLeaveObj.lieuLeaveBalance = 0
                setCacheHoliday(item)
                // 调休假类型与其它假期类型数据存储不一致,需特殊处理; 从调休假改成其它假期时，需要删除调休假
                // if (sps.currentLineHolidayNo != null && sps.cacheHoliday.type == 'HOLIDAY_ADJUSTABLE' && sps.cacheHoliday.id) {
                //     sps.modelActiveShift.holidaySchedules[sps.currentLineHolidayNo].operationState = 'delete';
                //     setCacheHoliday(item);
                //     return false
                // }
                // sps.holidayRange.disabled = false;
                // sps.cacheHoliday.type = item;
                // sps.cacheHoliday.holidayType = 1;
                // setHolidayRangeInitDate(sps.modelActiveShift.regularSchedules[$scope.holidayflag].onDutyTime, sps.modelActiveShift.regularSchedules[$scope.holidayflag].offDutyTime)
                // if (sps.currentLineHolidayNo == null) {
                //     sps.modelActiveShift.holidaySchedules.push(sps.cacheHoliday);
                // }

            }
        }

        function setCacheHoliday(item, type) {
            if (sps.cacheHoliday.active == 'on') {
                if (type && sps.cacheHoliday.id) {
                    sps.cacheHoliday.operationState = 'delete';
                    sps.cacheHoliday.active = 'off';
                    sps.cacheHoliday = {};
                    sps.cacheHoliday.operationState = 'add';
                } else if (!type && sps.cacheHoliday.id && sps.cacheHoliday.type == 'HOLIDAY_ADJUSTABLE') {
                    sps.cacheHoliday.operationState = 'delete';
                    sps.cacheHoliday.active = 'off';
                    sps.cacheHoliday = {};
                    sps.cacheHoliday.operationState = 'add';
                }
            }
            sps.cacheHoliday.type = item;
            sps.cacheHoliday.holidayType = 1;
            setHolidayRangeInitDate(sps.modelActiveShift.regularSchedules[$scope.holidayflag].onDutyTime, sps.modelActiveShift.regularSchedules[$scope.holidayflag].offDutyTime)
            if (!sps.cacheHoliday.active) {
                sps.modelActiveShift.holidaySchedules.push(sps.cacheHoliday);
                sps.cacheHoliday.active = 'on';
            }
        }

        function selectType2(item) {
            if (sps.cacheGoOut.type == item) {
                sps.cacheGoOut = {};
                sps.goOutRange.disabled = false;
                sps.shiftGoOutType = '';
                sps.currentLineGoOutNo = null;
                return false;
            }
            sps.shiftGoOutType = '';
            sps.goOutRange.disabled = false;
            sps.cacheGoOut.type = item;
            sps.cacheGoOut.goOutType = 0;
            if (!isExistShifts(sps.modelActiveShift.regularSchedules)) {
                setGoOutRangeInitDate('09:00:00', '18:00:00');
                sps.isShowGoOut = false;
                return false;
            }
            sps.isShowGoOut = true;
            // $scope.holidayflagGoOut = 0;  // 记录当前选择班次,默认第一个
            $scope.holidayflagGoOut = getHolidayFlag(sps.modelActiveShift.regularSchedules);
            $scope.isShowHalfShiftsGoOut = sps.modelActiveShift.regularSchedules[$scope.holidayflagGoOut].diningStartDatetime ? true : false;
            setGoOutRangeInitDate(sps.modelActiveShift.regularSchedules[$scope.holidayflagGoOut].onDutyTime, sps.modelActiveShift.regularSchedules[$scope.holidayflagGoOut].offDutyTime)
        }

        function buildScheduleSave(type) {
            sps.newTable.schedules = [];
            if (type == 'all') {
                angular.forEach(sps.scheduleTable, function (object) {
                    for (var i = 0; i < object.scheduleCells.length; i++) {
                        var scheduleCell = object.scheduleCells[i];
                        if (scheduleCell.regularSchedules == null
                            && scheduleCell.overtimeSchedules == null
                            && scheduleCell.holidaySchedules == null
                            && scheduleCell.goOutSchedules == null) {
                        } else {
                            angular.forEach(sps.recordCopyDatetime, function (datetime) {
                                if (datetime == scheduleCell.onDutyDay) {
                                    var addArray = null
                                     angular.forEach(scheduleCell.regularSchedules, function(item){
                                        if (item.relatedShift) {
                                            addArray = item.relatedShift
                                            addArray.id = null
                                            item.relatedShift = null
                                        }
                                    })
                                    var zbItem = null
                                    angular.forEach(scheduleCell.holidaySchedules, function(item, key){
                                        if (item.isGroupShift) {
                                            var end = defaultTimeDuration.indexOf(item.holidayEndTime);
                                            var regularStart = defaultTimeDuration.indexOf(item.regularOnDutyTime);
                                            var regularEnd = defaultTimeDuration.indexOf(item.regularOffDutyTime);
                                            regularEnd = regularStart > regularEnd ? regularEnd + 48 : regularEnd;

                                            if (end > regularEnd) {
                                                item.holidayEndTime = regularEnd > 48 ? changeTime48(item.regularOffDutyTime) : item.regularOffDutyTime;
                                                zbItem = item.groupShiftData
                                                zbItem.operationState = item.operationState
                                                zbItem.id = null
                                                scheduleCell.holidaySchedules.push(zbItem)
                                            }

                                        }
                                    })
                                    if (!_.isEmpty(addArray)) {
                                        scheduleCell.regularSchedules.push(addArray)
                                    }
                                    sps.newTable.schedules.push(scheduleCell);
                                }
                            });
                        }
                    }
                })
                return sps.newTable;
            } else {
                var newDatas = angular.copy(sps.newTable);
                newDatas.employees = [];
                newDatas.employees.push(sps.saveEmployees)
                sps.modelActiveShift.regularSchedules.forEach(function (item, key) {
                    if (item.relatedShift) {
                        if (item.id && item.operationState == 'delete') {
                            // 删除组合班次
                            item.relatedShift.operationState = 'delete'
                            sps.modelActiveShift.regularSchedules.push(item.relatedShift)
                        } else {
                            // 新增组合班次
                            item.relatedShift.postId = item.postId;
                            // item.relatedShift.id = null;
                            item.relatedShift.type = item.relatedShift.type || SuperScheduleService.autoFillRegularType(sps.modelActiveShift.regularSchedules, item.relatedShift.shiftType)
                            sps.modelActiveShift.regularSchedules.push(item.relatedShift)
                            item.relatedShiftLabel = item.relatedShift.label
                            if (defaultTimeDuration.indexOf(item.onDutyTime) > defaultTimeDuration.indexOf(item.offDutyTime)) {
                                item.relatedShift.spanAllDay = 1
                            }
                        }

                    }
                });
                var zbItem = null;
                var delKey = null;
                angular.forEach(sps.modelActiveShift.holidaySchedules, function(item, key){
                    if (item.isGroupShift) {
                        var end = defaultTimeDuration.indexOf(item.holidayEndTime);
                        var start = defaultTimeDuration.indexOf(item.holidayBeginTime);
                        var regularStart = defaultTimeDuration.indexOf(item.regularOnDutyTime);
                        var regularEnd = defaultTimeDuration.indexOf(item.regularOffDutyTime);
                        regularEnd = regularStart > regularEnd ? regularEnd + 48 : regularEnd;
                        if (end > regularEnd) {
                            zbItem = item.groupShiftData
                            zbItem.holidayEndTime = item.holidayEndTime;
                            item.holidayEndTime = regularEnd > 48 ? changeTime48(item.regularOffDutyTime) : item.regularOffDutyTime;
                            zbItem.operationState = item.operationState;
                            zbItem.holidayType = item.holidayType;
                            sps.modelActiveShift.holidaySchedules.push(zbItem)
                        } else {
                            if (item.groupShiftData && item.groupShiftData.id) {
                                item.groupShiftData.operationState = 'delete';
                                sps.modelActiveShift.holidaySchedules.push(item.groupShiftData)
                            }
                        }
                        if (start >= regularEnd) {
                            if (item.id) {
                                item.operationState = 'delete';
                            } else {
                                delKey = key
                            }

                        }

                    }
                })
                if (delKey != null && !sps.modelActiveShift.holidaySchedules[delKey].id) {
                    sps.modelActiveShift.holidaySchedules.splice(delKey, 1);
                }
                angular.extend(sps.currentShift, sps.modelActiveShift)
                if (sps.currentShift.regularSchedules.length == 0
                    && sps.currentShift.overtimeSchedules.length == 0
                    && sps.currentShift.holidaySchedules.length == 0
                    && sps.currentShift.goOutSchedules.length == 0) {
                    sps.emptySchedules = true;
                } else {
                    sps.emptySchedules = false;
                }
                newDatas.schedules.push(sps.currentShift)
            }
            return newDatas;
        }

        function editLineSchedule(item, id) {
            if (item.status == 0) {
                if (item.after > 0 || item.before > 0) {
                    sps.toast = '该班次已被移动端休假所占用，只能修改班前班后加班!';
                    sps.currentLineShift = item;
                    sps.currentLineShiftNo = id;
                    sps.currentLineShiftBefore = SuperScheduleService.getCacheExtend(sps.modelActiveShift.overtimeSchedules, item.type, 'before');
                    sps.currentLineShiftAfter = SuperScheduleService.getCacheExtend(sps.modelActiveShift.overtimeSchedules, item.type, 'after');
                } else {
                    sps.toast = '该班次已被移动端休假所占用，不可修改或删除！';
                }
                return false
            }
            if (sps.currentLineShift && sps.currentLineShift.type == item.type) {
                // 反选
                sps.currentLineShift = {};
                sps.currentLineShiftNo = null;
                return false;
            }
            $scope.tab = 1;
            sps.currentLineShift = item;
            sps.currentLineShiftNo = id;
            // $scope.holidayflag = id;
            if (typeof sps.currentLineShift.before == 'undefined') {
                sps.currentLineShift.before = null;
                sps.currentLineShiftBefore = {}
            } else {
                sps.currentLineShiftBefore = SuperScheduleService.getCacheExtend(sps.modelActiveShift.overtimeSchedules, item.type, 'before');
            }
            if (typeof sps.currentLineShift.after == 'undefined') {
                sps.currentLineShift.after = null;
                sps.currentLineShiftAfter = {}
            } else {
                sps.currentLineShiftAfter = SuperScheduleService.getCacheExtend(sps.modelActiveShift.overtimeSchedules, item.type, 'after');
            }
            SuperScheduleService.getShiftsFromPost(sps.departmentId, sps.showTable.jobId, sps.currentLineShift.postId, sps.showTable.datetime)
                .then(function (res) {
                    if (res.status == 'fail') {
                        sps.toast = '请求出错!';
                    }else {
                        $scope.defaultShifts = res.shifts;
                        $scope.defaultShifts.forEach(function(item, index) {
                            if (item.relatedShift) {
                                item.relatedOffDutyTime = item.relatedShift.offDutyTime;
                                item.relatedShift.id = null
                                item.groupLabel = item.label + '+' + item.relatedShift.label;
                            }
                        });
                    }
                })
        }

        function editLineOvertime(item, id) {
            if (item.status == 0) {
                sps.toast = 'app安排临时加班班次不可修改和删除！';
                return false
            }
            if (sps.currentLineOvertime.type == item.type) {
                sps.currentLineOvertime = {};
                sps.currentLineOvertimeNo = null;
                sps.overtime.disabled = false;
                return false;
            }
            $scope.tab = 2;
            sps.currentLineOvertimeNo = id;
            sps.overtime.minValue = defaultTimeDuration.indexOf(item.overtimeBeginTime);
            sps.overtime.maxValue = defaultTimeDuration.indexOf(item.overtimeEndTime);
            sps.currentLineOvertime = sps.modelActiveShift.overtimeSchedules[sps.currentLineOvertimeNo];
            SuperScheduleService.getShiftsFromPost(sps.departmentId, sps.showTable.jobId, item.postId, sps.showTable.datetime)
                .then(function (res) {
                    if (res.status == 'fail') {
                        sps.toast = '请求出错!';
                    }else {
                        $scope.defaultShifts = res.shifts;
                    }
                })
            if (item.label) {
                sps.overtime.disabled = true;
            } else {
                sps.overtime.disabled = false;

            }

        }

        function editLineHoliday(item, id) {
            if (item.type == 'HOLIDAY_ALTERNATE_HOLIDAY' || item.type == 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE') {
                $scope.tab = 1;
                return false;
            }
            if (sps.scheduleShift.onLineDepartment) return;
            if (sps.modelActiveShift.holidaySchedules[id].status == 0) {
                sps.toast = 'app安排休假不可修改和删除！';
                return;
            }
            if (item.active == 'on') {
                item.active = 'off';
                // sps.currentLineHolidayNo = null;
                sps.cacheHoliday = {};
                sps.holidayRange.disabled = false;
                return false;
            }
            $scope.tab = 3;
            // sps.currentLineHolidayNo = id;
            item.active = 'on';
            sps.cacheHoliday = sps.modelActiveShift.holidaySchedules[id];
            sps.holidayRange.minValue = defaultTimeDuration.indexOf(sps.cacheHoliday.holidayBeginTime);
            sps.holidayRange.maxValue = defaultTimeDuration.indexOf(sps.cacheHoliday.holidayEndTime);
            // sps.holidayRange.disabled = item.holidayType != 0 ? true : false;
            $scope.isShowHalfShifts = item.holidayType > 1 ? true : false;
            $scope.holidayflag = getHolidayFlag(sps.modelActiveShift.regularSchedules);
            sps.isGroupShift = sps.modelActiveShift.regularSchedules[$scope.holidayflag].relatedShiftLabel ? true : false;
            if (sps.modelActiveShift.regularSchedules[$scope.holidayflag].diningDuration
                && sps.modelActiveShift.regularSchedules[$scope.holidayflag].diningEndDatetime) {
                $scope.isShowHalfShifts = true
            }
            if (sps.isGroupShift) {
                // setHolidayGroupShift(sps.modelActiveShift.regularSchedules[$scope.holidayflag])
            }
        }

        function editLineGoOut(item, id) {
            if (sps.modelActiveShift.goOutSchedules[id].status == 0) {
                sps.toast = 'app安排出差、外勤不可修改和删除！';
                return;
            }
            if (id == sps.currentLineGoOutNo) {
                sps.currentLineGoOutNo = null;
                sps.cacheGoOut = {};
                return false;
            }
            if (item.relatedShiftType) {
                for (var i in sps.modelActiveShift.regularSchedules) {
                    if (sps.modelActiveShift.regularSchedules[i].type == item.relatedShiftType) {
                        $scope.holidayflagGoOut = i
                        break;
                    }
                }
            } else {
                $scope.holidayflagGoOut = getHolidayFlag(sps.modelActiveShift.regularSchedules);
            }
            $scope.tab = 4;
            sps.currentLineGoOutNo = id;
            sps.cacheGoOut = sps.modelActiveShift.goOutSchedules[id];
            sps.goOutRange.minValue = defaultTimeDuration.indexOf(sps.cacheGoOut.goOutBeginTime);
            sps.goOutRange.maxValue = defaultTimeDuration.indexOf(sps.cacheGoOut.goOutEndTime);

        }

        function delLineShift(data, index) {
            if (data.status == 0) {
                if (data.after > 0 || data.before > 0) {
                    sps.toast = '该班次已被移动端休假所占用，只能修改班前班后加班!';
                } else {
                    sps.toast = '该班次已被移动端休假所占用，不可删除！';
                }
                return false
            }
            delHoliday(sps.modelActiveShift.regularSchedules[index].type);  // 删除已经关联的休假或出差外勤
            del.shift(sps.modelActiveShift.regularSchedules, index);
            delRelatedHoliday(data.label);
            if (checkRegularDelete() == 0) {
                sps.toast = '删除常规班次,关联的休假也将删除！';
                $scope.tab = 1;
                deleteHoliday();
            }
            if (data.after) {
                delOptionShiftExtend('after', data.type)
            }
            if (data.before) {
                delOptionShiftExtend('before', data.type)
            }
            if (sps.currentLineShiftNo == index) {
                sps.currentLineShiftNo = null;
                sps.currentLineShift = {};
                sps.currentLineShiftAfter = {};
                sps.currentLineShiftBefore = {};
                sps.unfinishedShift = null;
            }
            sps.currentLineShift = {};
            sps.currentLineShiftAfter = {};
            sps.currentLineShiftBefore = {};
        }

        function delLineOvertime(index, status) {
            if (status == 0) {
                sps.toast = 'app安排临时加班班次不可修改和删除！'
                return false
            }
            del.shift(sps.modelActiveShift.overtimeSchedules, index)
            if (sps.currentLineOvertimeNo == index) {
                sps.currentLineOvertimeNo = null;
                sps.currentLineOvertime = {};
                sps.overtime.disabled = false;
            }
        }

        function delLineHoliday(index) {
            var holiday = sps.modelActiveShift.holidaySchedules;
            if (holiday[index].status == 0) {
                sps.toast = 'app安排临时加班班次不可修改和删除！'
                return false
            }
            // onLineDepartment app上线调休假申请，pc 端屏蔽调休假
            if (sps.scheduleShift.onLineDepartment) {
                if (holiday[index].type != 'HOLIDAY_ALTERNATE_HOLIDAY'
                    && holiday[index].type != 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE') {
                    return false
                }
            }
            if (holiday[index].type == 'HOLIDAY_ALTERNATE_HOLIDAY' || holiday[index].type == 'HOLIDAY_WORK_TWO_OR_ONE_REST_ONE') {
                sps.onHolidayRest = null
                if (holiday[index].type == 'HOLIDAY_ALTERNATE_HOLIDAY') {
                    $scope.holidayMonthlyBalance += 1;
                }
            }
            if (holiday[index].active == 'on') {
                sps.cacheHoliday = {};
                // sps.currentLineHolidayNo = null
            }
            del.shift(holiday, index)

        }

        function delLineGoOut(index) {
            if (sps.modelActiveShift.goOutSchedules[index].status == 0) {
                sps.toast = 'app安排临时加班班次不可修改和删除！'
                return false
            }
            del.shift(sps.modelActiveShift.goOutSchedules, index);
            sps.cacheGoOut = {};
            if (sps.currentLineGoOutNo == index) {
                sps.currentLineGoOutNo = null
            }
        }

        function delExtendShift(type) {
            switch (type) {
                case 'before':
                    sps.currentLineShift.before = null;
                    sps.currentLineShiftBefore = {};
                    delOptionShiftExtend('before', sps.currentLineShift.type);
                    break;
                case 'after':
                    sps.currentLineShift.after = 0;
                    sps.currentLineShiftAfter = {};
                    delOptionShiftExtend('after', sps.currentLineShift.type);
                    break;
            }
        }

        function delOptionShiftExtend(extend, type) {
            var lastType = extend == 'before' ? '_BEFORESHIFT' : '_AFTERSHIFT';
            var newDelType = 'OVERTIME_' + type + lastType;
            del.shiftByType(sps.modelActiveShift.overtimeSchedules, newDelType)
        }

        function delRelatedHoliday(label) {
            sps.modelActiveShift.goOutSchedules.forEach(function (item) {
                if (item.goOutType != 0) {
                    item.goOutType = 0;
                }
            })
            sps.modelActiveShift.holidaySchedules.forEach(function (item) {
                if (item.holidayType != 0) {
                    item.holidayType = 0;
                }
            })
        }
        
        function delHoliday(type) {
            var holidayFlag = null, goOutFlag = null;
            for (var i in sps.modelActiveShift.holidaySchedules) {
               if (sps.modelActiveShift.holidaySchedules[i].relatedShiftType == type) {
                   holidayFlag = i;
                   break;
               }
            }
            if (holidayFlag != null) {
                if (sps.modelActiveShift.holidaySchedules[holidayFlag].id) {
                    sps.modelActiveShift.holidaySchedules[holidayFlag].operationState = 'delete';
                } else {
                    sps.modelActiveShift.holidaySchedules.splice(holidayFlag, 1);
                }
            }
            for (var i in sps.modelActiveShift.goOutSchedules) {
                if (sps.modelActiveShift.goOutSchedules[i].relatedShiftType == type) {
                    goOutFlag = i;
                    break;
                }
            }
            if (goOutFlag != null) {
                if (sps.modelActiveShift.goOutSchedules[goOutFlag].id) {
                    sps.modelActiveShift.goOutSchedules[goOutFlag].operationState = 'delete';
                } else {
                    sps.modelActiveShift.goOutSchedules.splice(goOutFlag, 1);
                }
            }

        }

        function delHoliday(type) {
            var holidayFlag = null, goOutFlag = null;
            for (var i in sps.modelActiveShift.holidaySchedules) {
               if (sps.modelActiveShift.holidaySchedules[i].relatedShiftType == type) {
                   holidayFlag = i;
                   break;
               }
            }
            if (holidayFlag != null) {
                if (sps.modelActiveShift.holidaySchedules[holidayFlag].id) {
                    sps.modelActiveShift.holidaySchedules[holidayFlag].operationState = 'delete';
                } else {
                    sps.modelActiveShift.holidaySchedules.splice(holidayFlag, 1);
                }
            }
            for (var i in sps.modelActiveShift.goOutSchedules) {
                if (sps.modelActiveShift.goOutSchedules[i].relatedShiftType == type) {
                    goOutFlag = i;
                    break;
                }
            }
            if (goOutFlag != null) {
                if (sps.modelActiveShift.goOutSchedules[goOutFlag].id) {
                    sps.modelActiveShift.goOutSchedules[goOutFlag].operationState = 'delete';
                } else {
                    sps.modelActiveShift.goOutSchedules.splice(goOutFlag, 1);
                }
            }

        }

        function delHoliday(type) {
            var holidayFlag = null, goOutFlag = null;
            for (var i in sps.modelActiveShift.holidaySchedules) {
               if (sps.modelActiveShift.holidaySchedules[i].relatedShiftType == type) {
                   holidayFlag = i;
                   break;
               }
            }
            if (holidayFlag != null) {
                if (sps.modelActiveShift.holidaySchedules[holidayFlag].id) {
                    sps.modelActiveShift.holidaySchedules[holidayFlag].operationState = 'delete';
                } else {
                    sps.modelActiveShift.holidaySchedules.splice(holidayFlag, 1);
                }
            }
            for (var i in sps.modelActiveShift.goOutSchedules) {
                if (sps.modelActiveShift.goOutSchedules[i].relatedShiftType == type) {
                    goOutFlag = i;
                    break;
                }
            }
            if (goOutFlag != null) {
                if (sps.modelActiveShift.goOutSchedules[goOutFlag].id) {
                    sps.modelActiveShift.goOutSchedules[goOutFlag].operationState = 'delete';
                } else {
                    sps.modelActiveShift.goOutSchedules.splice(goOutFlag, 1);
                }
            }

        }

        function checkRegularDelete(type) {
            var result = 0;
            angular.forEach(sps.modelActiveShift.regularSchedules, function (item) {
                if (item.operationState != 'delete') {
                    result++;
                }
            })
            // 出差外勤 需要 常规班或者加班,月休
            if (type == 'goOut') {
                angular.forEach(sps.modelActiveShift.overtimeSchedules, function (item) {
                    if (item.operationState != 'delete') {
                        result++;
                    }
                });
                angular.forEach(sps.modelActiveShift.holidaySchedules, function (item) {
                    if (item.operationState != 'delete') {
                        result++;
                    }
                });
            }
            return result;
        }

        function compareGroupsTimes(small, big, onDutyTime, offDutyTime) {
            if (small > big) {
                big += 48;
            }
            if (onDutyTime <= small && offDutyTime > small) {
                return true;
            } else if (offDutyTime >= big && onDutyTime < big) {
                return true;
            }
        }

        function checkThreeDayTime(star, end, type) {
            if (sps.dayCheck.prev && star < sps.dayCheck.prev) {
                sps.toast = '与上一天最晚班次结束时间重叠！';
                return false
            } else if (sps.dayCheck.next && end > (sps.dayCheck.next + 48)) {
                sps.toast = '与下一天最早班次开始时间重叠！'
                return false
            } else if (star == -1) {
                sps.toast = '当天班次开始时间不得早于00:00'
                return false
            } else if (star > 47 && type != 'after') {
                sps.toast = '当天班次开始时间不得晚于24:00'
                return false
            } else if (!end) {
                sps.toast = '当天班次结束时间不得晚于次日12:00'
                return false
            }
            return true
        }

        function scheduleCopy() {
            if (sps.selectArray.length == 0) {
                commonService.alert({
                    content: '请选择复制的人员！',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return false;
            }
            if (sps.selectDateArray.length == 0) {
                commonService.alert({
                    content: '请选择复制的日期',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return false;
            }
            var selectedCopyDatetime = selectedCopyDatetimeFunc($scope.showDatetimeDuration, sps.selectDateArray);
            var copyStem = copyStemFunc(sps.copyStem, selectedCopyDatetime);
            var scheduleCopyModel = commonService.createModal({
                'templateUrl': 'scheduleCopy.html',
                'controller': 'scheduleCopyModalController',
                'resolve': {
                    'copyDatetimeLength': function () {
                        return sps.selectDateArray.length;
                    },
                    'copyStem': function () {
                        return copyStem;
                    },
                    'employees': function () {
                        return sps.scheduleShift.employees
                    },
                    'copyDatetime': function () {
                        return selectedCopyDatetime;
                    },
                    'getSearchParams': function () {
                        return getSearchParams();
                    },
                    'onLineRmDate': function () {
                        return sps.onLineRmDate;
                    }
                }
            })
        }

        function selectedCopyDatetimeFunc(week, item) {
            var result = [];
            result[0] = $filter('date')(week[sps.selectDateArray[0]].date, 'yyyy-MM-dd')
            if (item.length > 1) {
                for (var i = 1; i < item.length; i++) {
                    result.push($filter('date')(week[sps.selectDateArray[i]].date, 'yyyy-MM-dd'));
                }
            }
            return result;
        }

        function copyStemFunc(a, c) {
            var newArray = [];
            angular.forEach(a, function (item, key) {
                if (item.flag == true) {
                    newArray.push(item);
                }
            })
            return newArray;
        }


        function checkFixedOvertime(obj, type, shift) {
            var alertLabel = null, extendType = null, extendType2 = null;

            if (type == "before" && shift) {
                extendType = 'OVERTIME_' + shift + '_BEFORESHIFT';
            } else if (type == 'after' && shift) {
                extendType = 'OVERTIME_' + shift + '_AFTERSHIFT';
            }
            if (type == 'label') {
                var checkStart = defaultTimeDuration.indexOf(obj.onDutyTime);
                var checkEnd = defaultTimeDuration.indexOf(obj.offDutyTime);
                if (shift) {
                    extendType = 'OVERTIME_' + shift + '_BEFORESHIFT';
                    extendType2 = 'OVERTIME_' + shift + '_AFTERSHIFT';
                }
            } else {
                var checkStart = defaultTimeDuration.indexOf(obj.overtimeBeginTime);
                var checkEnd = defaultTimeDuration.indexOf(obj.overtimeEndTime);
            }
            if (checkStart > checkEnd) {
                checkEnd += 48;
            }
            if (!checkThreeDayTime(checkStart, checkEnd, type)) {
                return true;
            }
            if (sps.modelActiveShift.regularSchedules.length > 0) {
                if (!alertLabel) {
                    angular.forEach(sps.modelActiveShift.regularSchedules, function (item, key) {
                        if (sps.currentLineShiftNo != key && item.operationState != 'delete') {
                            var small = defaultTimeDuration.indexOf(item.onDutyTime);
                            var big = defaultTimeDuration.indexOf(item.offDutyTime);
                            if (item.relatedOffDutyTime) {
                                big = defaultTimeDuration.indexOf(item.relatedOffDutyTime);
                            }
                            if (compareGroupsTimes(small, big, checkStart, checkEnd)) {
                                if (!alertLabel) {
                                    alertLabel = item.label;
                                    sps.toast = '该班次与' + alertLabel + '班次时间重合';
                                }
                            }
                        }
                    })
                    if (alertLabel) {
                        return true;
                    }
                }
            }
            if (sps.modelActiveShift.overtimeSchedules.length > 0) {
                if (!alertLabel) {
                    angular.forEach(sps.modelActiveShift.overtimeSchedules, function (item, key) {
                        if ((key != sps.currentLineOvertimeNo && extendType != item.type && extendType2 != item.type) && item.operationState != 'delete') {
                            var smalls = defaultTimeDuration.indexOf(item.overtimeBeginTime);
                            var bigs = defaultTimeDuration.indexOf(item.overtimeEndTime);
                            if (smalls > bigs) {
                                bigs += 48;
                            }
                            if (compareGroupsTimes(smalls, bigs, checkStart, checkEnd)) {
                                if (!alertLabel) {
                                    alertLabel = 'alert';
                                    sps.toast = '该班次与其它加班班次时间重合';
                                }
                            } else {
                                alertLabel = null;
                            }
                        }
                    })
                    if (alertLabel) {
                        return true;
                    }
                }
            }
        }

        function setShiftAdjust(type) {
            if (type == sps.cacheHoliday.holidayType) {
                sps.holidayRange.disabled = false;
                // sps.cacheHoliday.holidayType = 0;
                return false;
            }
            $scope.holidayflag = getHolidayFlag(sps.modelActiveShift.regularSchedules);
            var flagTime = sps.modelActiveShift.regularSchedules[$scope.holidayflag];

            // Task255
            if (type == '1' && sps.cacheHoliday.type == 'HOLIDAY_PRIVATE_AFFAIR' && !isOfficialHoliday(sps.showTable.datetime)) {
                // 月休优先级高于事假的限制仅限于O序列，非O序列不作此限制
                if ($scope.holidayMonthlyBalance > 0 && $scope.salaryType == '05') {
                    sps.toast = '考勤周期内的月休额度未用完，不可申请整班次事假，请优先安排月休';
                    return false
                } else {
                    sps.isShowAdjustTimeRange = SuperScheduleService.isShowAdjustTime(flagTime);
                    setHolidayRangeInitDate(flagTime.onDutyTime, flagTime.offDutyTime);
                    sps.cacheHoliday.diningDuration = flagTime.diningDuration || 0;
                    sps.cacheHoliday.holidayType = type;
                    // sps.holidayRange.disabled = true;
                    // if (sps.cacheHoliday.type && sps.currentLineHolidayNo == null) {
                    //     sps.modelActiveShift.holidaySchedules.push(sps.cacheHoliday);
                    //     sps.cacheHoliday = {};
                    // }
                }
            } else {
                switch (type) {
                    case 1:
                        if (checkRestBalance(flagTime, 1)) {
                            return false
                        }
                        sps.isShowAdjustTimeRange = SuperScheduleService.isShowAdjustTime(flagTime);
                        if (sps.isGroupShift) {
                            setHolidayRangeInitDate(flagTime.onDutyTime, flagTime.relatedShift.offDutyTime);
                        } else {
                            setHolidayRangeInitDate(flagTime.onDutyTime, flagTime.offDutyTime);
                        }
                        sps.cacheHoliday.diningDuration = flagTime.diningDuration || 0;
                        break;
                    case 2:
                        if (checkRestBalance(flagTime, 2)) {
                            return false
                        }
                        setHolidayRangeInitDate(flagTime.onDutyTime, flagTime.diningStartDatetime);
                        break;
                    case 3:
                        if (checkRestBalance(flagTime, 3)) {
                            return false
                        }
                        if (sps.isGroupShift) {
                            setHolidayRangeInitDate(flagTime.diningEndDatetime, flagTime.relatedShift.offDutyTime, flagTime.onDutyTime);
                        } else {
                            setHolidayRangeInitDate(flagTime.diningEndDatetime, flagTime.offDutyTime, flagTime.onDutyTime);
                        }
                        break;
                    default:
                        break;
                }
                sps.cacheHoliday.holidayType = type;
                // sps.holidayRange.disabled = true;
                // if (sps.cacheHoliday.type && sps.currentLineHolidayNo == null) {
                //     sps.modelActiveShift.holidaySchedules.push(sps.cacheHoliday);
                //     sps.cacheHoliday = {};
                // }
            }
        }

        function setShiftGoOut (type) {
            if (type == sps.shiftGoOutType) {
                sps.shiftGoOutType = '';
                sps.goOutRange.disabled = false;
                sps.cacheGoOut.goOutType = 0;
                return false;
            }
            var flagTimes = sps.modelActiveShift.regularSchedules[$scope.holidayflagGoOut];
            sps.iszbBoss = flagTimes.postShortName.indexOf('值班经理') != -1 ? true : false;
            switch (type) {
                case 'all':
                    if (sps.iszbBoss && sps.cacheGoOut.type == 'GOOUT_TRIP') {
                        sps.toast = '值班经理不可安排整班次外勤，请重新选择外勤时间';
                        return false;
                    }
                    sps.shiftGoOutType = 'all';
                    sps.cacheGoOut.goOutType = 1;
                    setGoOutRangeInitDate(flagTimes.onDutyTime, flagTimes.offDutyTime)
                    sps.goOutRange.disabled = true;
                    break;
                case 'before':
                    sps.shiftGoOutType = 'before';
                    sps.cacheGoOut.goOutType = 2;
                    setGoOutRangeInitDate(flagTimes.onDutyTime, flagTimes.diningStartDatetime);
                    sps.goOutRange.disabled = true;
                    break;
                case 'after':
                    sps.shiftGoOutType = 'after';
                    sps.cacheGoOut.goOutType = 3;
                    setGoOutRangeInitDate(flagTimes.diningEndDatetime, flagTimes.offDutyTime, flagTimes.onDutyTime);
                    sps.goOutRange.disabled = true;
                    break;
            }
            if (sps.cacheGoOut.type && sps.currentLineGoOutNo == null) {
                sps.modelActiveShift.goOutSchedules.push(sps.cacheGoOut);
                sps.cacheGoOut = {};
            }
        }
        
        function setHolidayRangeInitDate(start, end, onTime) {
            sps.cacheHoliday.holidayBeginTime = start;
            sps.holidayRange.minValue = defaultTimeDuration.indexOf(start);
            var maxValue = defaultTimeDuration.indexOf(end);
            if (sps.holidayRange.minValue > maxValue) {
                sps.cacheHoliday.holidayEndTime = changeTime48(end);
                sps.holidayRange.maxValue = maxValue + 48;
            } else {
                sps.cacheHoliday.holidayEndTime = end;
                sps.holidayRange.maxValue = maxValue;
                if (onTime && defaultTimeDuration.indexOf(onTime) > maxValue && sps.holidayRange.maxValue < 48 && sps.holidayRange.minValue < 48) {
                    sps.holidayRange.maxValue += 48;
                    sps.holidayRange.minValue += 48;
                    sps.cacheHoliday.holidayEndTime = changeTime48(sps.cacheHoliday.holidayEndTime);
                    sps.cacheHoliday.holidayBeginTime = changeTime48(sps.cacheHoliday.holidayBeginTime);
                }
            }
            var flag = sps.modelActiveShift.regularSchedules[$scope.holidayflag]
            sps.cacheHoliday.relatedShiftType = flag.type;
            if (sps.isGroupShift && !sps.cacheHoliday.groupShiftData) {
                sps.cacheHoliday.isGroupShift = true;
                sps.cacheHoliday.regularOffDutyTime = flag.offDutyTime;
                sps.cacheHoliday.regularOnDutyTime = flag.onDutyTime;
                sps.cacheHoliday.groupShiftData = {
                    type: sps.cacheHoliday.type,
                    holidayEndTime: sps.cacheHoliday.holidayEndTime,
                    holidayType: sps.cacheHoliday.holidayType,
                    relatedShiftType: flag.relatedShift.type || SuperScheduleService.autoFillRegularType(sps.modelActiveShift.regularSchedules, flag.relatedShift.shiftType)
                };
                if (defaultTimeDuration.indexOf(flag.onDutyTime) > defaultTimeDuration.indexOf(flag.offDutyTime)) {
                    sps.cacheHoliday.groupShiftData.holidayBeginTime = changeTime48(sps.cacheHoliday.regularOffDutyTime)
                } else {
                    sps.cacheHoliday.groupShiftData.holidayBeginTime = sps.cacheHoliday.regularOffDutyTime
                }
            } else if(sps.isGroupShift) {
                sps.cacheHoliday.isGroupShift = true
            } else {
                sps.cacheHoliday.isGroupShift = false
            }
        }
        
        function  setGoOutRangeInitDate(start, end, onTime) {
            sps.cacheGoOut.goOutBeginTime  = start;
            sps.goOutRange.minValue = defaultTimeDuration.indexOf(start);
            var maxValue = defaultTimeDuration.indexOf(end);
            if (!sps.cacheGoOut.relatedShiftType && !_.isEmpty(sps.modelActiveShift.regularSchedules)) {
                sps.cacheGoOut.relatedShiftType = sps.modelActiveShift.regularSchedules[$scope.holidayflagGoOut].type;
            }
            if (sps.goOutRange.minValue > maxValue) {
                sps.cacheGoOut.goOutEndTime = changeTime48(end);
                sps.goOutRange.maxValue = maxValue + 48;
            } else {
                sps.cacheGoOut.goOutEndTime = end;
                sps.goOutRange.maxValue = maxValue;
                if (onTime && defaultTimeDuration.indexOf(onTime) > maxValue
                    && sps.goOutRange.minValue < 48
                    && sps.goOutRange.maxValue < 48) {
                    sps.cacheGoOut.goOutBeginTime = changeTime48(sps.cacheGoOut.goOutBeginTime)
                    sps.cacheGoOut.goOutEndTime = changeTime48(sps.cacheGoOut.goOutEndTime)
                    sps.goOutRange.minValue += 48;
                    sps.goOutRange.maxValue += 48;
                }
            }
        }

        function chenkOneOffHolidayUnitDay(object) {
            var result = false
            if (!_.isEmpty(object.holidaySchedules)) {
                var OneOffHolidayUnitDay = SuperScheduleService.oneOffHolidayUnitDays();
                object.holidaySchedules.forEach(function (item) {
                    if (item.status == 0) {
                        for (var i = 0; i < OneOffHolidayUnitDay.length; i++) {
                            if (OneOffHolidayUnitDay[i].code == item.type) {
                                result = true
                                break;
                            }
                        }
                    }
                })
            }
            return result
        }

        function checkRestBalance(item, id) {
            var result = false;
            if (!sps.showTable.isOuter && sps.cacheHoliday.type == 'HOLIDAY_ADJUSTABLE') {
                var times = getShiftTimeDuration(item, id)
                if (times > $scope.lieuLeaveObj.lieuLeaveBalance) {
                    var txt = id == 1 ? '整班次' : '半班次';
                    sps.toast = txt + '调休时长必须大于额度时长';
                    return true
                } else {
                    return false
                }
            } else {
                return result
            }

        }

        function getShiftTimeDuration(item, id) {
            var end, start, duration;
            switch (id) {
                case 1:
                    end = defaultTimeDuration.indexOf(item.offDutyTime)
                    start = defaultTimeDuration.indexOf(item.onDutyTime)
                    if (start > end) {
                        end += 48
                    }
                    duration = ((end - start) / 2) - (item.diningDuration || 0);
                    break;
                case 2:
                    end = defaultTimeDuration.indexOf(item.diningStartDatetime)
                    start = defaultTimeDuration.indexOf(item.onDutyTime)
                    if (start > end) {
                        end += 48
                    }
                    duration = (end - start) / 2
                    break;
                case 3:
                    end = defaultTimeDuration.indexOf(item.offDutyTime)
                    start = defaultTimeDuration.indexOf(item.diningEndDatetime)
                    if (start > end) {
                        end += 48
                    }
                    duration = (end - start) / 2
                    break;

                default:
                    break;
            }
            return duration
        }
        
        function setHolidayGroupShift(data) {
            var start = defaultTimeDuration.indexOf(data.onDutyTime),
                end = defaultTimeDuration.indexOf(data.offDutyTime);
            sps.cacheHoliday.regularOnDutyTime = data.onDutyTime;
            sps.cacheHoliday.regularOffDutyTime = data.offDutyTime;

            if (start > end) {
                sps.cacheHoliday.groupShiftData = {
                    type: sps.cacheHoliday.type,
                    holidayBeginTime: changeTime48(data.relatedShift.onDutyTime),
                    holidayEndTime: sps.cacheHoliday.holidayEndTime,
                    holidayType: sps.cacheHoliday.holidayType,
                    relatedShiftType: data.relatedShift.type
                };
            } else {
                sps.cacheHoliday.groupShiftData = {
                    type: sps.cacheHoliday.type,
                    holidayBeginTime: data.relatedShift.onDutyTime,
                    holidayEndTime: sps.cacheHoliday.holidayEndTime,
                    holidayType: sps.cacheHoliday.holidayType,
                    relatedShiftType: data.relatedShift.type
                };
            }
        }
        
        function findShiftByType(data, type) {
            var result = null;
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == type) {
                    result = data[i];
                    break;
                }
            }
            return result;
         }

        function getHolidayFlag (data) {
            if (sps.currentLineShiftNo == null ) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].operationState != 'delete') {
                        return i;
                        break;
                    }
                }
            } else {
                return sps.currentLineShiftNo;
            }
        }

        function oneOffHolidaylimitFunc() {
            if ($scope.oneOffHolidayLimit) {
                // $scope.oneOffHolidayLimit = true
                commonService.alert({
                    content: '移动端已申请的一次性休假期间只允许排月休',
                    title: '信息提示'
                })
                return false;
            }
        }

    }
})();
