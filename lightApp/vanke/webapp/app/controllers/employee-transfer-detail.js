/**
 * Created by wangq34 on 2017/7/19.
 * Modified by ushio on 2017/11/8
 */
(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('EmployeeTransferDetailController',EmployeeTransferDetailController);

    EmployeeTransferDetailController.$inject = ['$http', '$routeParams', '$scope', 'EmployeeTransferService', 'CommonService'];

    function EmployeeTransferDetailController($http, $routeParams, $scope, EmployeeTransferService, CommonService) {

        $scope.getMonthlyLeaveBalance = getMonthlyLeaveBalance;
        $scope.getLeaveBalance = getLeaveBalance;
        $scope.getAttendance = getAttendance;
        $scope.getOffDay = getOffDay;
        $scope.exportData = exportData;
        $scope.confirmTransfer = confirmTransfer;
        $scope.transferType = $routeParams.transferType;
        $scope.isCrossDepartment = $routeParams.isCrossDepartment;
        $scope.backUrl = ($routeParams.transferType == 2 ? ('#/employee-transfer-leave-rule?isCrossDepartment=' + $routeParams.isCrossDepartment) : ('#/employee-transfer-info-confirm?isCrossDepartment=' + $routeParams.isCrossDepartment));
        $scope.fromListPage = JSON.parse($routeParams.item);
        $scope.approvalStatus = {
            '1': '审批中',
            '2': '审批通过',
            '3': '审批不通过',
            '5': '系统退回'
        };
        init();
        function init(){
            $scope.index = 1;
            $scope.workSchedules = EmployeeTransferService.getWorkSchedules();
            getPersonalTransferInfo();
            getLeaveBalance();
            getMonthlyLeaveBalance();
            getAttendance();
            getOffDay();
            getApproveFormRetuened();
        }

        function getPersonalTransferInfo(){
            $http
                .get(apiBaseUrl + '/employee-transfer/personal-transfer-info', {
                    params: {
                        id: $scope.fromListPage.id,
                        preId: $scope.fromListPage.preId,
                        stateId: $scope.fromListPage.stateId,
                        type: $scope.fromListPage.type,
                        transferType: $routeParams.transferType,
                    }
                })
                .then(function(res){
                    $scope.personalTransferInfoData = res.data.data;
                });
        }

        function exportData() {
            var url, data = {
                id: $scope.fromListPage.id,
                transferType: $scope.transferType,
                type: $scope.fromListPage.type,
                stateId: $scope.fromListPage.stateId,
                restDayOvertimeBalance: $scope.fromListPage.restDayOvertimeBalance,
                weekDayOvertimeBalance: $scope.fromListPage.weekDayOvertimeBalance,
                oldEmpId: $scope.fromListPage.oldEmpId,
                newEmpId: $scope.fromListPage.newEmpId,
                transferDate: $scope.fromListPage.transferEnableDate,
                state: $scope.fromListPage.state
            };
            url = baseUrl + "/file/employee-transfer-exporting";
            CommonService.downloadFile(url, data);
        }

        function getApproveFormRetuened() {
            $http
                .get(apiBaseUrl + '/approve-form-returned', {
                    params: {
                        oldEmpId: $scope.fromListPage.oldEmpId,
                        transferDate: $scope.fromListPage.transferEnableDate
                    }
                })
                .then(function (res) {
                    $scope.approveFormReturnedList = res.data || [];
                });
        }

        function confirmTransfer() {
            CommonService.confirm({
                content: '确认后不可以再修改员工变动前的排班等信息，仅可确认一次，是否确认修改？',
                callback: function () {
                    $http
                        .post(apiBaseUrl + '/employee-transfer/info-confirm', {
                            id: $scope.fromListPage.id,
                            preId: $scope.fromListPage.preId,
                            stateId: $scope.fromListPage.stateId,
                            type: $scope.fromListPage.type
                        })
                        .then(function (res) {
                            if (res.data.status == 'fail' && res.data.data) {
                                if (res.data.data.length > 0) {
                                    // 以排整班次时间展示
                                    scheduleConfirm(res.data.data)
                                } else {
                                    // 多次变动前次未确认的不能继续确认变动
                                    CommonService.alert({
                                        icon: "fa-exclamation-circle",
                                        content: res.data.errorMessage
                                    })
                                }
                            } else {
                                $scope.fromListPage.state = 1;
                            }
                        })
                }
            });
        }

        function scheduleConfirm(data) {
            var scheduleList = CommonService.createModal({
                'templateUrl': 'scheduleList.html',
                'controller': 'scheduleListController',
                'resolve': {
                    'list': function () {
                        return data
                    }
                }
            })
        }

        function getLeaveBalance(){
            $scope.index = 1;
            if($scope.leaveBalanceData) return;
            $http
                .get(apiBaseUrl + '/employee-transfer/leave-balance',getParams())
                .then(function(res){
                    $scope.leaveBalanceData = res.data.data;
                    $scope.workingDayBalanceDetailDouble = new Array($scope.leaveBalanceData.workingDayLeaveBalance.length * 2);
                    $scope.offDayBalanceDetailDouble = new Array($scope.leaveBalanceData.offDayLeaveBalance.length * 2);
                    $scope.workingDayDuration = [];
                    $scope.offDayDuration = [];
                    angular.forEach($scope.leaveBalanceData.workingDayLeaveBalance,function(item){
                        $scope.workingDayDuration.push({
                            value: item.wholeScheduleDuration
                        });
                        $scope.workingDayDuration.push({
                            value: item.notWholeScheduleDuration
                        });
                    });
                    angular.forEach($scope.leaveBalanceData.offDayLeaveBalance,function(item){
                        $scope.offDayDuration.push({
                            value: item.wholeScheduleDuration
                        });
                        $scope.offDayDuration.push({
                            value: item.notWholeScheduleDuration
                        });
                    });
                });
        }

        function getMonthlyLeaveBalance(){
            $scope.index = 1;
            if($scope.monthlyLeaveBalanceData) return;
            $http
                .get(apiBaseUrl + '/employee-transfer/monthly-leave-balance',getParams())
                .then(function(res){
                    $scope.monthlyLeaveBalanceData = res.data;
                });
        }

        function getAttendance(){
            $scope.index = 2;
            if($scope.lieuLeaveData) return;
            $http
                .get(apiBaseUrl + '/employee-transfer/attendance-detail', {
                    params: {
                        id: $scope.fromListPage.id,
                        stateId: $scope.fromListPage.stateId,
                        type: $scope.fromListPage.type
                    }
                })
                .then(function(res){
                    $scope.lieuLeaveData = res.data.data;
                });
        }

        function getOffDay(){
            $scope.index = 3;
            if($scope.offDayData) return;
            $http
                .get(apiBaseUrl + '/employee-transfer/offDay-detail', {
                    params: {
                        id: $scope.fromListPage.id,
                        stateId: $scope.fromListPage.stateId,
                        type: $scope.fromListPage.type
                    }
                })
                .then(function(res){
                    $scope.offDayData = res.data.data;
                });
        }

        function getParams(){
            return {
                params: {
                    oldEmpId: $scope.fromListPage.oldEmpId,
                    newEmpId: $scope.fromListPage.newEmpId,
                    transferDate: $scope.fromListPage.transferEnableDate,
                    state: $scope.fromListPage.state,
                    type: $scope.fromListPage.type
                }
            }
        }

    }

})();
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('scheduleListController', scheduleListController);

    scheduleListController.$inject = ['$http', '$scope', '$modalInstance', '$filter', 'CommonService', 'list'];

    function scheduleListController($http, $scope, $modalInstance, $filter, CommonService, list) {
        $scope.list = list;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }

})();