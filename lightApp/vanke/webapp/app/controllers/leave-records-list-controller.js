/**
 * Created by ushio on 2017/5/3.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('LeaveRecordsListController', LeaveRecordsListController);

    LeaveRecordsListController.$inject = ['$rootScope', '$scope', '$routeParams', 'LeaveRecordsListService', 'CommonService', '$timeout', '$filter'];

    function LeaveRecordsListController($rootScope, $scope, $routeParams, LeaveRecordsListService, CommonService, $timeout, $filter) {

        $scope.search = search;
        $scope.approvalStatus = {
            '1': '审批中',
            '2': '审批通过',
            '3': '审批不通过',
            '5': '系统退回'
        };
        $scope.repeatClick = 0
        $scope.paginationConfig = {
            pageOptions: [10, 30, 50],
            isShowOptions: false
        };
        function search () {
            if ((Date.now() - $scope.repeatClick) < 1000) return
            $scope.repeatClick = Date.now()
            LeaveRecordsListService
                .getList(getParams())
                .then(function (res) {
                    $scope.listData = [];
                    $scope.totalPage = Math.ceil(res.recordsTotal / $scope.page);
                    angular.forEach(res.data, function (item) {
                        item.orderLength = item.leaveTypeGroup.length;
                        angular.forEach(item.leaveTypeGroup, function (data, key) {
                            var cache = angular.copy(item);
                            delete cache.leaveTypeGroup;
                            data.key = key;
                            angular.extend(cache, data);
                            $scope.listData.push(cache);
                        })
                    })
                })
            CommonService.storageSearchStatus($scope);
        }
        function getParams () {
            return {
                'search[value]': {
                    departments: _.pluck($scope.selectedDepartments, "department_id"),
                    leaveType: _.pluck($scope.selectedLieuQuota, 'code'),
                    status: '2',
                    keywords: $scope.keywords,
                    beginDate: $filter('date')($("#scheduledatepicker input[name=start]").datepicker("getDate"), 'M/d/yyyy'),
                    endDate: $filter('date')($("#scheduledatepicker input[name=end]").datepicker("getDate"), 'M/d/yyyy'),
                    applyType: 1
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }
    }
})();