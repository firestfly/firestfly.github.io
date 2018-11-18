/**
 * Created by ushio on 2017/5/3.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('LeaveApproveListController', LeaveApproveListController);

    LeaveApproveListController.$inject = ['$rootScope', '$scope', '$routeParams', 'LeaveRecordsListService', 'CommonService', '$timeout', '$filter'];

    function LeaveApproveListController($rootScope, $scope, $routeParams, LeaveRecordsListService, CommonService, $timeout, $filter) {
        var lal = this;
        $scope.search = search;

        $scope.approvalStatus = {
            '1': '审批中',
            '2': '审批通过',
            '3': '审批不通过',
            '5': '系统退回',
            '6': '已撤销'
        };
        $scope.selectedVacationOrderStatue = {
            id: 1, value: '休假单'
        }
        function search() {
            LeaveRecordsListService
                .getApproveList(getParams())
                .then(function (res) {
                    console.log(res)
                    $scope.listData = res.data;
                    lal.list = [];
                    angular.forEach($scope.listData, function (item, key) {
                        item.orderLength = item.leaveTypeGroup.length;
                        angular.forEach(item.leaveTypeGroup, function (data, key) {
                            var cache = angular.copy(item);
                            delete cache.leaveTypeGroup;
                            data.key = key;
                            angular.extend(cache, data);
                            lal.list.push(cache);
                        })
                    })
                    $scope.totalPage = Math.ceil(res.recordsTotal / $scope.page);
                })
            CommonService.storageSearchStatus($scope);
        }

        function getParams() {
            return {
                'search[value]': {
                    departments: _.pluck($scope.selectedDepartments, "department_id"),
                    leaveType: _.pluck($scope.selectedLieuQuota, 'code'),
                    status: $scope.selectedApprovalStatus ? parseInt($scope.selectedApprovalStatus) : null,
                    keywords: $scope.keywords,
                    beginDate: $filter('date')($("#scheduledatepicker input[name=start]").datepicker("getDate"), 'M/d/yyyy'),
                    endDate: $filter('date')($("#scheduledatepicker input[name=end]").datepicker("getDate"), 'M/d/yyyy'),
                    applyType: $scope.selectedVacationOrderStatue.id
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }
    }
})();