/**
 * Created by deepsky on 2017/5/2.
 */
;
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('otherHolidayBalanceCheckController', otherHolidayBalanceCheckController);

    otherHolidayBalanceCheckController.$inject = ['$filter', '$rootScope', '$routeParams', '$scope', '$http', 'CommonService', 'OtherHolidayBalanceService'];

    function otherHolidayBalanceCheckController($filter, $rootScope, $routeParams, $scope, $http, commonService, otherHolidayBalanceService) {
        var ohb = this;

        init();
        $scope.search = search;

        function init() {
            $scope.title = "万科资源管理信息系统 - 其他休假明细";
            $scope.commonSearchBarConfig = {
                isCompanySelectpickerMultiple: true,
                companySelecterLabel: "公司范围",
                departmentSelecterLabel: "部门/项目",
                workgroupSelecterLabel: "岗位专业分类"
            };
            $scope.paginationConfig = {
                pageOptions: [10],
                isShowOptions: true
            };
        }

        function search() {

            otherHolidayBalanceService.getOtherHolidayBalanceList(getParams())
                .then(function (res) {
                    ohb.lists = res.data;
                    $scope.totalPage = Math.ceil(res.recordsTotal / $scope.page) || 1
                    if (_.isEmpty(res.data)) {
                        $scope.noData = true
                    } else {
                        $scope.noData = false
                    }
                })
            commonService.storageSearchStatus($scope);
        }

        function getParams() {
            var type = _.pluck($scope.selectedHolidaySixteen, 'code');
            if (_.isEmpty(type)) {
                type = ["HOLIDAY_STATUTORY_ANNUAL", "HOLIDAY_PAY_ANNUAL", "HOLIDAY_SPRING_FESTIVAL", "HOLIDAY_CARRY_OVER", "HOLIDAY_MARRIAGE", "HOLIDAY_FUNERAL", "HOLIDAY_MATERNITY", "HOLIDAY_NURSING", "HOLIDAY_CONTRACEPTION", "HOLIDAY_FAMILY_PLANNING", "HOLIDAY_ORDINARY_SICK", "HOLIDAY_STATUTORY_SICK", "HOLIDAY_INDUSTRIAL_INJURY", "HOLIDAY_PRIVATE_AFFAIR", "HOLIDAY_OTHER_PAY", "HOLIDAY_DAY_RELEASE", "HOLIDAY_HOME"];
            }
            return {
                "search[value]": {
                    "departments": _.pluck($scope.selectedDepartments, 'department_id'),
                    "keywords": $scope.keywords,
                    "beginDate": commonService.getSelectedDates().beginDate,
                    "endDate": commonService.getSelectedDates().endDate,
                    "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                    "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
                    "holidayTypeId": type
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }

    }
})();