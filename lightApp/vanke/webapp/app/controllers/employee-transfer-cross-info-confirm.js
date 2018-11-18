/**
 * Created by wangq34 on 2017/7/18.
 * Modified by ushio on 2017/8/14
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('EmployeeTransferCrossInfoConfirmController', EmployeeTransferCrossInfoConfirmController);

    EmployeeTransferCrossInfoConfirmController.$inject = ['$http', '$scope', '$filter', 'CommonService', 'EmployeeTransferService'];

    function EmployeeTransferCrossInfoConfirmController($http, $scope, $filter, CommonService, EmployeeTransferService) {

        $scope.confirmTransfer = confirmTransfer;
        $scope.search = search;

        init();

        function init() {
            $scope.paginationConfig = {
                autoSearch: true
            }
        }

        function confirmTransfer(obj) {

            CommonService.confirm({
                content: '确认后不可以再修改员工变动前的排班等信息，仅可确认一次，是否确认修改？',
                callback: function () {
                    $http
                        .post(apiBaseUrl + '/employee-transfer/info-confirm', {
                            id: obj.id,
                            preId: obj.preId,
                            stateId: obj.stateId,
                            type: obj.type
                        })
                        .then(function (res) {
                            if (res.data.status == 'fail' && res.data.data) {
                                // 以排整班次时间展示
                                scheduleConfirm(res.data.data)
                            } else {
                                search()
                            }
                        })
                }
            });
        }

        function search() {
            CommonService.storageSearchStatus($scope);
            var scheduledatepicker = $("#scheduledatepicker");
            if (!scheduledatepicker.find("input[name=start]").datepicker('getDate') || !scheduledatepicker.find("input[name=end]").datepicker('getDate')) {
                EmployeeTransferService.getDefaultDate().then(function (res) {
                    scheduledatepicker.find("input[name=start]").datepicker("setDate", res.data.startDate);
                    scheduledatepicker.find("input[name=end]").datepicker('setDate', res.data.endDate);
                    getList();
                });
            } else {
                getList();
            }
        }


        function getList() {
            var scheduledatepicker = $("#scheduledatepicker");
            console.log(scheduledatepicker.find("input[name=start]").datepicker("getDate"))
            $http
                .get(apiBaseUrl + '/employee-transfer/info-confirm', {
                    params: {
                        companies: _.pluck($scope.selectedCompanies, 'company_id'),
                        departments: _.pluck($scope.selectedDepartments, 'department_id'),
                        keywords: $scope.keywords,
                        beginDate: $filter('date')(scheduledatepicker.find("input[name=start]").datepicker("getDate"), 'yyyy-MM-dd'),
                        endDate: $filter('date')(scheduledatepicker.find("input[name=end]").datepicker("getDate"), 'yyyy-MM-dd'),
                        transferType: $scope.selectedEmployeeTransferType,
                        length: $scope.page || 10,
                        start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
                    }
                })
                .then(function (res) {
                    $scope.items = res.data.data;
                    $scope.totalPage = Math.ceil(res.data.recordsTotal / $scope.page);
                })
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
