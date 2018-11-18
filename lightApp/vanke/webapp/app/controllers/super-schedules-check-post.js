/**
 * Created by deepsky on 2016/12/20.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('CheckPostSchedulesController', CheckPostSchedulesController);
    CheckPostSchedulesController.$inject = ['$scope', '$filter', '$timeout', 'CommonService', '$rootScope', '$http'];
    function CheckPostSchedulesController($scope, $filter, $timeout, commonService, $rootScope, $http) {
        var scp = this;
        $scope.shifts = [];
        $scope.search = search;
        $scope.export = scheduleExport;
        $scope.isSearchInfoValid = isSearchInfoValid;
        init();

        function init() {
            $scope.title = "万科资源管理信息系统 - 排班管理";
            $scope.commonSearchBarConfig = {
                isCompanySelectpickerMultiple: false,
                isDepartmentSelectpickerMultipe: false,
                companySelecterLabel: "公司范围",
                departmentSelecterLabel: "部门/项目",
                workgroupSelecterLabel: "岗位专业分类"
            };

            // $scope.paginationConfig = {
            //     pageOptions: [9],
            //     isShowOptions: true
            // };
            $scope.tableTitle = {};
            $scope.tableData = [];
            $scope.needCellAmount = 0;
            $scope.loadedCellAmount = 0;
            $scope.countCell = countCell;
        }

        function isSearchInfoValid() {
            if (!$scope.selectedDepartments || $scope.selectedDepartments.length < 1) {
                commonService.alert({
                    content: "请选择查询部门",
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            if (!$('#scheduledatepicker').find('input[name=start]').datepicker('getDate')) {
                commonService.alert({
                    content: "请选择开始日期",
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            return true;
        }

        function scheduleExport() {

            if (!isSearchInfoValid()) {
                return false;
            }

            var params = getSearchParams().search, url;
            url = baseUrl + "/file/export-schedule-post";
            commonService.downloadFile(url, params);
        }

        function dateInterval(b, e) {
            if (Object.prototype.toString.call(b) === '[object Date]') {
                b = new Date(b);
            }
            if (Object.prototype.toString.call(e) === '[object Date]') {
                e = new Date(e);
            }
            return (e.getTime() - b.getTime()) / 86400000;
        }

        $scope.searchByWeek = searchByWeek;

        function searchByWeek(beginDate, endDate) {
            return $http.get(apiBaseUrl + "/schedule", {
                params: getSearchParams(beginDate, endDate)
            })
                .success(function (response) {
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page) || 1;
                    //scp.currentDate = changeDay(new Date(response.startDate), 1);
                    scp.infoSchedules = response.resultPost;
                });
        }

        function render() {
            //type = null, 前后扩展变蓝
            angular.forEach(scp.infoSchedules, function (infoSchedule) {
                angular.forEach(infoSchedule.postScheduleNewDTO, function (postSchedule) {
                    /** @namespace postSchedule.postNewDTO */

                    angular.forEach(postSchedule.postNewDTO, function (daySchedule) {
                        if (daySchedule.type == null) {
                            var arr = daySchedule.label.split('+');
                            if (arr.length == 1) {
                                //only regular
                                daySchedule.regular = arr[0];
                            } else if (arr.length == 2) {
                                if (isNaN(arr[0])) {
                                    daySchedule.regular = arr[0];
                                    daySchedule.afterOvertime = arr[1];
                                } else {
                                    daySchedule.beforeOvertime = arr[0];
                                    daySchedule.regular = arr[1];
                                }
                            } else if (arr.length == 3) {
                                daySchedule.beforeOvertime = arr[0];
                                daySchedule.regular = arr[1];
                                daySchedule.afterOvertime = arr[2];
                            }
                        } else {
                            daySchedule.regular = daySchedule.label;
                        }
                        if (daySchedule.relateShiftLabel) {
                            daySchedule.regular = daySchedule.label + '+' + daySchedule.relateShiftLabel;
                            for (var i = 0; i < postSchedule.postNewDTO.length; i++) {
                                if (postSchedule.postNewDTO[i].label == daySchedule.relateShiftLabel
                                && postSchedule.postNewDTO[i].employeeId  == daySchedule.employeeId) {
                                    postSchedule.postNewDTO[i].unShow = true;
                                    daySchedule.offDutyTime = postSchedule.postNewDTO[i].offDutyTime
                                    break;
                                }
                            }
                        }
                    })
                })
            });
            buildGridUI(scp.infoSchedules);
        }

        function search() {
            if (!isSearchInfoValid()) {
                return false;
            }
            commonService.storageSearchStatus($scope);


            var week = getWeekInterval(),
                beginDate = week.beginDate,
                endDate = week.endDate;

            $rootScope.loading = true;
            if (dateInterval(beginDate, endDate) > 6) {
                var tmp;
                searchByWeek(undefined, utils.formatDate(new Date(beginDate.setDate(beginDate.getDate() + 6)))).then(function () {
                    render();
                    tmp = scp.infoSchedules;
                    $rootScope.loading = false;
                }).then(function () {
                    return searchByWeek(utils.formatDate(new Date(beginDate.setDate(beginDate.getDate() + 1))), utils.formatDate(endDate))
                }).then(function () {
                    //noinspection JSUnresolvedVariable
                    for (var i = 0; i < scp.infoSchedules.length; i++) {
                        scp.infoSchedules[i].postScheduleNewDTO = tmp[i].postScheduleNewDTO.concat(scp.infoSchedules[i].postScheduleNewDTO);
                    }
                    render();
                    $rootScope.loading = false;
                })
            } else {
                searchByWeek(utils.formatDate(beginDate), utils.formatDate(endDate)).then(function () {
                    render();
                    $rootScope.loading = false;
                })
            }
        }

        function getSearchParams(beginDate, endDate) {
            var week = getWeekInterval();
            //noinspection JSUnresolvedFunction
            var searchInfo = {
                "departments": _.pluck($scope.selectedDepartments, 'department_id'),
                "beginDate": beginDate || utils.formatDate(week.beginDate),
                "endDate": endDate || utils.formatDate(week.endDate),
                "keywords": $scope.keywords
            };
            return {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                search: searchInfo
            };
        }

        function getWeekInterval() {
            var _scheduledatepicker = $("#scheduledatepicker");
            var beginDate = _scheduledatepicker.find('input[name=start]').datepicker('getDate');
            return {
                "beginDate": beginDate,
                "endDate": lessFifteen(beginDate, _scheduledatepicker.find('input[name=end]').datepicker('getDate'))
            };
        }

        function lessFifteen(start, end) {
            var startTime = angular.copy(start);
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
                var aa = angular.copy(date);
                return new Date(aa.setDate(aa.getDate() + increment));
            }
            return null;
        }

        function applyWeek(datetime, endtime) {
            var oneDayParse = 86400000; //  1000*60*60*24;
            var current = Date.parse(datetime.replace(/-/g, "/"));
            var end = Date.parse(endtime.replace(/-/g, "/"));
            var length = (end - current) / oneDayParse;
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

        function switchWeek(beginDate, endDate) {
            $scope.tableTitle.weekdays = applyWeek(utils.formatDate(beginDate), utils.formatDate(endDate));
            $scope.tableTitle.weekdays.forEach(function (week, index) {
                $scope.tableTitle.weekdays[index] = $filter('date')(week.date, 'MM-dd') + $filter('date')(week.date, 'EEE');
            });
        }

        function buildGridUI(data) {
            $scope.tableData = data;

            var week = getWeekInterval(),
                beginDate = week.beginDate,
                endDate = week.endDate;

            switchWeek(beginDate, endDate);

            data && data.forEach(function (ob) {
                $scope.needCellAmount += ob.postScheduleNewDTO.length;
            })

        }

        function initTable() {
            var container = angular.element('#postScheduleTable');
            var fixedTitle = container.find('.fixed-title');
            var title = container.find('.title');
            var column = container.find('.column');
            var main = container.find('.main');
            var titleWidth = container.find('.title li').outerWidth();
            var titleHeight = container.find('.title li').outerHeight();
            var titleList = title.find('ul');
            var rows = main.find('ul');

            var scrollbarWidth = function () {
                var w1, w2, outer, inner;
                outer = document.createElement('div');
                inner = document.createElement('div');
                outer.appendChild(inner);

                outer.style.display = 'block';
                outer.style.position = 'absolute';
                outer.style.zIndex = -2;
                outer.style.width = '50px';
                outer.style.height = '50px';
                outer.style.overflow = 'hidden';

                inner.style.height = '100px';
                inner.style.width = 'auto';

                document.body.appendChild(outer);

                w1 = inner.offsetWidth;
                outer.style.overflow = 'scroll';

                w2 = inner.offsetWidth;

                if (w1 === w2) {
                    w2 = outer.clientWidth;
                }

                document.body.removeChild(outer);
                return w1 - w2;
            }();

            //init
            column.css({
                'width': scrollbarWidth + 100 + 'px',
                'height': container.outerHeight() - titleHeight - scrollbarWidth - 2 + 'px',
                'margin-right': -scrollbarWidth + 'px',
                'transform': 'translateY(-' + scrollbarWidth + 'px)'
            });
            title.css({
                'width': container.outerWidth() - fixedTitle.outerWidth() - scrollbarWidth - 2 + 'px',
                'height': titleHeight + scrollbarWidth + 'px'
            })
            titleList.css({
                'width': titleList.find('li').length * titleWidth + 'px'
            });
            main.css({
                'width': container.outerWidth() - column.outerWidth() + 15 + 'px',
                'height': container.outerHeight() - title.outerHeight() + 15 + 'px',
                'transform': 'translateY(-' + scrollbarWidth + 'px)'
            });
            rows.each(function (index, el) {
                var ul = angular.element(el);
                var items = ul.children('li');
                var heightArr = [], height;
                items.each(function () {
                    heightArr.push(angular.element(this).outerHeight());
                });
                height = Math.max.apply(null, heightArr);
                items.each(function () {
                    angular.element(this).css('height', height + 'px');
                });
                ul.css({
                    'width': items.length * titleWidth + 'px',
                    'height': height + 'px'
                });
                column.children('li').eq(index).css('height', height + 'px');
            });
            title.on('mousewheel', function () {
                return false;
            });
            column.on('mousewheel', function () {
                return false;
            });
            main.on('scroll', function () {
                title.scrollLeft(main.scrollLeft());
                column.scrollTop(main.scrollTop());
            });
        }

        function countCell() {
            $scope.loadedCellAmount++;
            if ($scope.loadedCellAmount === $scope.needCellAmount) {
                $timeout(function () {
                    initTable();
                })
            }
        }
    }
})();