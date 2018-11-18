/**
 * Created by wangq34 on 2016/10/17.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('WealthConvertRuleCheckController', WealthConvertRuleCheckController);

    WealthConvertRuleCheckController.$inject = ['$scope', 'CommonService', 'WealthConvertRuleCheckService'];

    function WealthConvertRuleCheckController($scope, CommonService, WealthConvertRuleCheckService) {
        var wcrcc = this;
        var orderType = 0;
        var orderby = "wealth";
        $scope.export = exportResult;
        $scope.search = search;
        $scope.wealthLineClick = wealthLineClick;
        $scope.paginationConfig = {
            autoSearch: false
        };

        function exportResult() {
            var params = getExportParams();
            var url = baseUrl + "/file/wealth-convert/wealth-convert-rule-exporting";
            CommonService.downloadFile(url, params);
        }

        function search(o) {
            if ($scope.wealthStart != null && $scope.wealthEnd != null && ($scope.wealthEnd < $scope.wealthStart)) {
                CommonService.alert({
                    content: "财富值区间填写有误！",
                    icon: "fa-exclamation-circle"
                });
                return;
            }
            if ($scope.workHourStart != null && $scope.workHourEnd != null && ($scope.workHourEnd < $scope.workHourStart)) {
                CommonService.alert({
                    content: "总工时区间填写有误！",
                    icon: "fa-exclamation-circle"
                });
                return;
            }
            if (o) {
                if (orderby != o) {
                    orderType = 0;
                    orderby = o;
                } else {
                    orderType = orderType ? 0 : 1;
                }
            }
            var params = getParams();
            $scope.selectedLockCycle.lockCycleBegintime = params["search[value]"].beginDate;
            $scope.selectedLockCycle.lockCycleEndtime = params["search[value]"].endDate;
            WealthConvertRuleCheckService
                .getConvertResult(params)
                .then(function (response) {
                    wcrcc.convertResult = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                    CommonService.storageSearchStatus($scope);
                })
        }

        function getParams() {
            return {
                "search[value]": getSearchParams(),
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }

        function getSearchParams() {
            var _localCycleDatepicker = $('#localCycleDatepicker');
            return {
                'departments': _.pluck($scope.selectedDepartments, 'department_id'),
                'workingGroups': _.pluck($scope.selectedGroups, 'work_group_id'),
                'standardWorkJobs': _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                'keywords': $scope.keywords,
                'beginDate': utils.formatDate(_localCycleDatepicker.find('input[name=start]').datepicker('getDate')),
                'endDate': utils.formatDate(_localCycleDatepicker.find("input[name=end]").datepicker('getDate')),
                'jobStatus': $scope.jobStatus,
                'lockCycleId': $scope.selectedLockCycle.lockCycleId,
                'orderby': [{orderby: orderby, orderType: orderType}],
                'wealthStart': $scope.wealthStart || '',
                'wealthEnd': $scope.wealthEnd || '',
                'workhourStart': $scope.workHourStart || '',
                'workhourEnd': $scope.workHourEnd || ''
            }
        }

        function wealthLineClick(lineData, index, type) {
            if (index > 0) {
                sessionStorage["searchState_#/wealth-convert-rule-detail"] = JSON.stringify(lineData);
                window.location.replace("home?type=" + type + "#/wealth-convert-rule-detail");

            }
        }

        function getExportParams() {
            return angular.extend(getSearchParams(), {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            })
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('WealthConvertRuleDetailController', WealthConvertRuleDetailController);

    WealthConvertRuleDetailController.$inject = ['$scope', 'CommonService', 'WealthConvertRuleCheckService', '$timeout', '$location'];

    function WealthConvertRuleDetailController($scope, CommonService, WealthConvertRuleCheckService, $timeout, $location) {
        CommonService.applySearchStatus($scope);
        $scope.flag = window.location.search.substr(1).split("=")[1];
        if (!$scope.employeeId) {
            $location.path("/wealth-convert-rule-check");
            return;
        }
        var orderType = 0, orderby = "wealth";

        $scope.checkNotTaskWealth = checkNotTaskWealth;
        $scope.checkTaskWealth = checkTaskWealth;
        $scope.search = search;
        var storageObj = {
            keywords: $scope.employeeId
        };

        function checkTaskWealth(v, date, type) {
            if (v != 0 && type == $scope.flag) {
                if (type == 'wealth') {
                    storageObj.beginDate = date;
                    storageObj.endDate = date;
                } else if (type == 'workhour') {
                    storageObj.wealthCompleteBeginDate = date;
                    storageObj.wealthCompleteEndDate = date;
                }
                sessionStorage["searchState_#/task-point-view-employee"] = JSON.stringify(storageObj);
                $location.path("/task-point-view-employee");
            }
        }

        function checkNotTaskWealth(v, date, type) {
            if (v != 0 && type == $scope.flag) {
                storageObj.beginDate = date;
                storageObj.endDate = date;
                storageObj.finishDate = date;
                sessionStorage["searchState_#/not-task-wealth-employee"] = JSON.stringify(storageObj);
                $location.path("/not-task-wealth-employee");
            }
        }

        $timeout(function () {
            $scope.$broadcast("selectpicker-loaded");
            //search();
        }, 100);
        function search(o) {
            if (o) {
                if (orderby != o) {
                    orderType = 0;
                    orderby = o;
                } else {
                    orderType = orderType ? 0 : 1;
                }
            }
            WealthConvertRuleCheckService
                .getWealthDetail(getParams())
                .then(function (response) {
                    $scope.wealthDetails = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                });
        }

        function getParams() {
            var beginDate = utils.formatDate(new Date($scope.beginDate));
            var endDate = utils.formatDate(new Date($scope.endDate));
            return {
                "search[value]": {
                    beginDate: beginDate,
                    endDate: endDate,
                    orderby: [{orderType: orderType, orderby: orderby}],
                    flag: $scope.flag,
                    employeeId: $scope.employeeId
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }

    }
})();