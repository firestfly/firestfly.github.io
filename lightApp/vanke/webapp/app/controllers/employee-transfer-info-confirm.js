/**
 * Created by wangq34 on 2017/7/18.
 * Modified by ushio on 2017/11/1
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('EmployeeTransferInfoConfirmController', EmployeeTransferInfoConfirmController);

    EmployeeTransferInfoConfirmController.$inject = ['$http', '$scope', '$filter', 'CommonService', 'EmployeeTransferService', '$routeParams'];

    function EmployeeTransferInfoConfirmController($http, $scope, $filter, CommonService, EmployeeTransferService, $routeParams) {

        $scope.search = search;
        $scope.replaceMark = replaceMark;

        init();

        function init() {
            $scope.paginationConfig = {
                autoSearch: true
            };
            $scope.isCrossDepartment = $routeParams.isCrossDepartment;
        }

        function replaceMark(a) {
            return JSON.stringify(a).replace(/#/g, '');
        }

        function confirmTransfer(obj) {
            // 员工从已上线项目变动到未上线项目设置时弹窗提示文字变更
            var content = '确认后不可以再修改员工变动前的排班等信息，仅可确认一次，是否确认修改？';
            if (obj.preTransferDepartmentOnline == 0 && obj.postTransferDepartmentOnline == 1) {
                content = '由于变动后项目为未上线项目/RM无法查询项目，请和变动后项目沟通设置结余调休假处理。确认后不可以再修改员工变动前的排班等信息，仅可确认一次，是否确认修改？'
            }
            CommonService.confirm({
                content: content,
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
            $http
                .get(apiBaseUrl + '/employee-transfer/info-confirm', {
                    params: {
                        companies: _.pluck($scope.selectedCompanies, 'company_id'),
                        departments: _.pluck($scope.selectedDepartments, 'department_id'),
                        keywords: $scope.keywords,
                        beginDate: $filter('date')(scheduledatepicker.find("input[name=start]").datepicker("getDate"), 'yyyy-MM-dd'),
                        endDate: $filter('date')(scheduledatepicker.find("input[name=end]").datepicker("getDate"), 'yyyy-MM-dd'),
                        transferType: $scope.isCrossDepartment > 2 ? $scope.selectedEmployeeTransferType : null,
                        isCrossDepartment: $routeParams.isCrossDepartment,
                        length: $scope.page || 10,
                        start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
                    }
                })
                .then(function (res) {
                    $scope.items = res.data.data;
                    $scope.totalPage = Math.ceil(res.data.recordsTotal / $scope.page);
                })
        }

    }
})();

