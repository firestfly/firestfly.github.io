(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('SuperScheduleCheckController', SuperScheduleCheckController);
    SuperScheduleCheckController.$inject = ['$scope', '$http', '$filter', '$timeout', 'CommonService', 'SuperScheduleService', '$rootScope'];
    function SuperScheduleCheckController($scope, $http, $filter, $timeout, commonService, SuperScheduleService, $rootScope) {
        var sps = this;

        init();
        $scope.search = search;
        $scope.departmentFilter = departmentFilter;
        $scope.export = scheduleExport;
        $scope.isOfficialHoliday = isOfficialHoliday;
        var defaultTimeDuration = SuperScheduleService.timelineOptions();
        function init() {
            $scope.commonSearchBarConfig = {
                isCompanySelectpickerMultiple: false,
                isDepartmentSelectpickerMultipe: true,
                companySelecterLabel: "公司范围",
                departmentSelecterLabel: "部门/项目",
                workgroupSelecterLabel: "岗位专业分类"
            };
            $scope.paginationConfig = {
                pageOptions: [10],
                isShowOptions: true
            };
            $scope.gridOptions = {};
        }

        function scheduleExport() {
            if (!isSearchInfoValid()) {
                return;
            }
            var params = getSearchParams().search, url;
            url = baseUrl + "/file/export-schedule-employee";
            commonService.downloadFile(url, params);
        }

        function isOfficialHoliday(day, id) {
            if (!$scope.officialHoliday || _.isEmpty($scope.officialHoliday) || !day) return false
            for (var k in $scope.officialHoliday) {
                if ($scope.officialHoliday[k].departmentId == id) {
                    return $scope.officialHoliday[k].date.indexOf($filter('date')(day, 'yyyy-MM-dd')) > -1
                    break;
                }
            }

        }

        function search(type) {
            var defaultSetting = {
                selectedCompanies: $scope.selectedCompanies,
                departments: $scope.departments,
                selectedDepartments: $scope.selectedDepartments,
                selectedGroups: $scope.selectedGroups,
                beginDate: commonService.getSelectedDates().beginDate,
                endDate: commonService.getSelectedDates().endDate,
                keywords: $scope.keywords,
                selectedStandardWorkJobs: $scope.selectedStandardWorkJobs,
                scheduleStatus: $scope.scheduleStatus
            };

            sessionStorage["searchState_" + '#/super-schedules-check-post'] = JSON.stringify(defaultSetting);

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
            $rootScope.selectedDepartments = $scope.selectedDepartments;
            var weekday = getWeekInterval(type);
            $http.get(apiBaseUrl + '/publicHolidays', {
                params: {
                    beginDate: utils.formatDate(weekday.beginDate),
                    endDate: utils.formatDate(weekday.endDate),
                    departments: _.pluck($scope.selectedDepartments, 'department_id') || ''
                }
            }).then(function (res) {
                $scope.officialHoliday = res.data.data;
                return SuperScheduleService.getSchedules(getSearchParams(type))
            }, function () {
            }).then(function (response) {
                $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page) || 1
                sps.scheduleShift = JSON.parse(JSON.stringify(response));
                sps.departmentId = _.pluck($scope.selectedDepartments, 'department_id');
                $scope.$parent.departmentId = sps.departmentId.length > 0 ? sps.departmentId[0] : "";

                sps.currentDate = changeDate(new Date(response.startDate), 1);
                $scope.showDatetimeDuration = applyWeek(response.startDate, response.endDate);
                applyScheduleTable(sps.scheduleShift.employees);
            });
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
            $scope.gridOptions.data = [];
            sps.scheduleTable = obj;
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
                        cellTemplate: '<div class="vk-schedule-content" ng-class="{\'schedule-list\': grid.appScope.editState}"><div>' +
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
                        '<div ng-if="grid.appScope.isOfficialHoliday(grid.appScope.showDatetimeDuration[' + i + '].date, row.entity.departmentId)">法定节假日</div>' +
                        '</div></div>',
                        width: 300,
                        enableSorting: false,
                        headerCellTemplate: '<i ng-init="$index=' + i + '" class="date-checkbox" ng-class="{\'active\': grid.appScope.showDatetimeDuration[' + i + '].state }" ng-show="grid.appScope.editState"></i>（{{grid.appScope.showDatetimeDuration[' + i + '].date | date: "MM-dd"}}{{grid.appScope.showDatetimeDuration[' + i + '].date | date: "EEE"}}）</span></span>' +
                        '<img src="../images/icon-copy.png" ng-show="grid.appScope.editState" class="schedule-icon-mr">',
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
                {name: 'sapId', field: 'sapId', enableSorting: false, width: 100, displayName: 'SAP编号'},
                {
                    name: 'departmentId', enableSorting: false, width: 120, displayName: '部门',
                    cellTemplate: '<span>{{grid.appScope.departmentFilter(row.entity.departmentId)}}</span>'
                }
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

        function departmentFilter(v) {
            var result = null;
            for (var d in $scope.selectedDepartments) {
                if (v == $scope.selectedDepartments[d].department_id) {
                    result = $scope.selectedDepartments[d].department_name;
                    break;
                }
            }
            return result
        }

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
                        for (var k in object.regularSchedules) {
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
            angular.forEach(object.holidaySchedules, function (item) {
                if (item.relatedShiftType && item.relatedShiftType.indexOf('REGULAR') != -1 && sps.isGroupShift) {
                    item.isGroupShift = true;
                    for (var i = 0; i < object.holidaySchedules.length; i++) {
                        if (object.holidaySchedules[i].relatedShiftType && object.holidaySchedules[i].relatedShiftType.indexOf('DUTY') != -1) {
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

    }
})();
