;
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('LieuDetailController', LieuDetailController);

    LieuDetailController.$inject = ['$scope', 'CommonService', '$timeout', '$location', 'LieuQuotaService', '$rootScope','$http','$routeParams'];

    function LieuDetailController($scope, CommonService, $timeout, $location, LieuQuotaService, $rootScope, $http, $routeParams) {
        CommonService.applySearchStatus($scope);
        $scope.$parent.backBtn = true;
        $scope.$parent.pageTitle = $routeParams.leaveType + '额度明细查看';
        $scope.search = search;
        $scope.searchInfo = searchInfo;
        $scope.action = action;
        $scope.restRule = {};
        $scope.lockCycles = [];
        $scope.isMonthlyHoliday = $routeParams.leaveType == '月休';
        $scope.leaveType = $routeParams.leaveType;
        $scope.leaveTypeDictionary = {
            '月休': '月休',
            '工作日加班调休假': '工作日',
            '休息日加班调休假': '休息日'
        };
        $scope.selectType = [
            {value: '休息日加班', id: 1},
            {value: '休息日调休', id: 2},
            {value: '工作日加班', id: 3},
            {value: '工作日调休', id: 4},
            {value: '到期结算工作日加班', id: 5},
            {value: '到期结算休息日加班', id: 6}
        ];

        $scope.lieuShiftType = {
            '1': '整班次',
            '0': '非整班次'
        };
        $scope.balanceDetailItems = [{
            cycle: "201704"
        },{
            cycle: "201705"
        }];
        var dictionarys = CommonService.getDictionarys();
        $scope.workingHours = dictionarys.workingHours;
        $scope.salaryType = dictionarys.salaryType;

        init();

        function init(){
            searchInfo();
        }

        $timeout(function () {
            // $scope.isMonthlyHoliday
            //     ? $rootScope.pageTitle = $scope.holidayTypeName + '额度明细查看'
            //     : $rootScope.pageTitle = $scope.holidayTypeName + '明细查看'
            // if ($scope.holidayTypeName != '月休') {
            //     getLockCycle();
            // }
            $scope.$broadcast("selectpicker-loaded");
            $('#select-type').selectpicker('refresh');
        }, 0);

        function getLockCycle () {
            CommonService
                .getLockCycle()
                .then(function (response) {
                    $scope.lockCycles = response
                    $scope.lockCycles.forEach(function (item) {
                        if (item.lockCycleName == $scope.lockCycleName) {
                            $scope.lockCycleId = item.lockCycleId
                            getOvertimeRestRule();
                        }
                    })
                })
        }

        function getOvertimeRestRule() {
            LieuQuotaService.getOvertimeRestRule({
                employeeId: parseInt($scope.employeeId),
                attendanceId: parseInt($scope.lockCycleId)
            }).then(function (response) {
                $scope.ruleType = response.ruleType;
                $scope.restRule = response.integrateHolidayRuleDTO;
                $scope.workdayRule = response.workdayRule
                $scope.holidayRule = response.standardHolidayRuleDTO;
            });
        }
        function getParams() {
            var types = [];
            if (typeof $scope.types == 'number') {
                types.push($scope.types)
            } else {
                types = _.pluck($scope.types, 'id')
            }
            if (_.isEmpty(types)) {
                types = [1,2,3,4,5,6];
            }
            return {
                "search[value]": {
                    id: $scope.id,
                    type: types
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }

        function action() {
            $scope.type = _.pluck($scope.type, 'id') || ['0']
            search()
        }

        function search(){
            if(!$scope.isMonthlyHoliday){
                $http
                    .get(apiBaseUrl + '/lieuLeave/quota-detail',{
                        params: {
                            'search[value]': {
                                id: $routeParams.id
                            },
                            length: $scope.page,
                            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
                        }
                    })
                    .then(function(res){
                        $scope.lieuQuotaDetail = res.data.data;
                        $scope.totalPage = Math.ceil(res.data.recordsTotal / $scope.page);
                        $scope.noData = !$scope.lieuQuotaDetail.length;
                    });
            } else {
                $http
                    .get(apiBaseUrl + '/holiday-monthly/' + $routeParams.id + '/detail',{
                        params: {
                            length: $scope.page,
                            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
                        }
                    })
                    .then(function(res){
                        $scope.lieuQuotaDetail = res.data.data;
                        $scope.totalPage = Math.ceil(res.data.recordsTotal / $scope.page);
                        $scope.noData = !$scope.lieuQuotaDetail.length;
                    });
            }
        }

        function searchInfo() {

            $http
                .get(apiBaseUrl + '/lieuLeave/detail',{
                    params: {
                        id: $routeParams.id
                    }
                })
                .then(function(response){
                    $scope.lieuQuotaTable = response.data;
                    $scope.quotaLockStatus = $scope.lieuQuotaTable.lockStatus;
                    $scope.balanceDetailDouble = new Array($scope.lieuQuotaTable.currentBalanceDetail.length * 2);
                    $scope.duration = [];
                    /* if ($scope.isMonthlyHoliday) {
                        $http.get(apiBaseUrl + '/employee/vacation-balance-history', {
                            params: {
                                empId: $scope.lieuQuotaTable.employeeId,
                                attendanceId: $scope.lieuQuotaTable.attendanceId
                            }
                        }).then(function (response) {
                            $scope.isTransfered = response.data.length > 1;
                            $scope.transferDataPrev = response.data[0];
                            $scope.transferDataPost = response.data.slice(1);
                        })
                    } */
                    angular.forEach($scope.lieuQuotaTable.currentBalanceDetail,function(item){
                        $scope.duration.push({
                            value: item.wholeScheduleDuration
                        });
                        $scope.duration.push({
                            value: item.notWholeScheduleDuration
                        });
                    });

                });

            // LieuQuotaService
            //     .getSearchDetail(getParams(), $scope.holidayTypeName)
            //     .then(function (response) {
            //         $scope.lieuQuotaTable = response.data;
            //         $scope.noData = !response.data.length;
            //         $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
            //     });
        }
    }
})();