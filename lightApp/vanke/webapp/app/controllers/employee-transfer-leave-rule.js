/**
 * Created by wangq34 on 2017/7/18.
 * Modified by ushio on 2017/11/1
 */
(function(){
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('EmployeeTransferLeaveRuleController',EmployeeTransferLeaveRuleController);

    EmployeeTransferLeaveRuleController.$inject = ['$http', '$scope', '$filter', 'CommonService', 'EmployeeTransferService', '$routeParams'];

    function EmployeeTransferLeaveRuleController($http, $scope, $filter, CommonService, EmployeeTransferService, $routeParams) {

        $scope.preTransferHolidayBalanceRules = [{
            value: 1,
            text: '变动前直接结算'
        },{
            value: 2,
            text: '余额转入适用新规则'
        }, {
            value: 3,
            text: '余额转入适用原规则'
        }];
        $scope.save = save;
        $scope.editRow = editRow;
        $scope.search = search;
        $scope.cancel = cancel;
        $scope.confirmModify = confirmModify;
        $scope.changePreTransferHolidayBalanceRule = changePreTransferHolidayBalanceRule;

        init();

        function init(){
            $scope.workSchedules = EmployeeTransferService.getWorkSchedules();
            $scope.isEdit = false;
            $scope.isCrossDepartment = $routeParams.isCrossDepartment;
        }

        function confirmModify(obj, rowform) {
            // 员工从未上线项目变动到已上线项目保存时取消弹框确认
            if (obj.preTransferDepartmentOnline == 0 && obj.postTransferDepartmentOnline == 1) {
                $scope.save(rowform.$data.preTransferHolidayBalanceRule, obj);
                $scope.cancel(rowform)
            } else {
                CommonService.confirm({
                    content: '您本次设置为：' + $scope.preTransferHolidayBalanceRules[rowform.$data.preTransferHolidayBalanceRule - 1].text + '。<br>员工变动前的结余调休假处理规则只能设置一次，是否确认修改？',
                    callback: function () {
                        $scope.save(rowform.$data.preTransferHolidayBalanceRule, obj);
                        $scope.cancel(rowform)
                    }
                });
            }
        }

        function changePreTransferHolidayBalanceRule (data, item) {
            // item.preTransferHolidayBalanceRule = data;
        }

        function cancel(rowform){
            rowform.$cancel();
            $scope.isEdit = false
        }

        function save(data, obj) {
            $scope.isEdit = false;
            $http
                .post(apiBaseUrl + '/employee-transfer/lieu-leave-setting',angular.extend({ 'preTransferHolidayBalanceRule': data},{
                    id: obj.id,
                    preId: obj.preId,
                    stateId: obj.stateId,
                    type: obj.type
                }))
                .then(function(res){
                    if (res.data.status == 'fail' && res.data.data && res.data.data.length > 0) {
                        scheduleConfirm(res.data.data)
                    }
                    search();
                })
        }

        function editRow(obj, form, type) {
            // 员工从未上线项目变动到已上线项目设置时给予弹窗提示
            if (obj.preTransferDepartmentOnline == 0 && obj.postTransferDepartmentOnline == 1) {
                CommonService.alert({
                    'content': '该员工从未上线RM系统的项目调入本项目，如之前有调休假额度需使用，请联系城市对接人导入额度。',
                    'icon': 'fa-exclamation-circle'
                });
            }
            if ($scope.isEdit) {
                CommonService.alert({'content': '请先保存后再修改下一项', 'icon': 'fa-exclamation-circle'});
                return false
            }
            form.$show();
            $scope.preTransferHolidayBalanceRulesStr = preTransferHolidayBalanceRulesFunc($scope.preTransferHolidayBalanceRules, type)
            $scope.isEdit = !$scope.isEdit;
        }
        function preTransferHolidayBalanceRulesFunc(item, type) {
            var result = [];
            angular.forEach(item,function (data, key) {
                if (type) {
                    if (data.value !== 3){
                        result.push(data)
                    }
                } else {
                    if (data.value !== 2){
                        result.push(data)
                    }
                }
            })

            return result
        }
        function search(){
            $scope.isEdit = false;
            var startInput = $("#scheduledatepicker").find("input[name=start]");
            var endInput = $("#scheduledatepicker").find("input[name=end]");
            CommonService.storageSearchStatus($scope);
            if(!startInput.datepicker('getDate') || !endInput.datepicker('getDate')){
                EmployeeTransferService.getDefaultDate().then(function (res) {
                    startInput.datepicker("setDate", res.data.startDate);
                    endInput.datepicker('setDate', res.data.endDate);
                    searchList()
                });
            } else {
                searchList()
            }

        }

        function searchList() {
            var startInput = $("#scheduledatepicker").find("input[name=start]");
            var endInput = $("#scheduledatepicker").find("input[name=end]");
            $http
                .get(apiBaseUrl + '/employee-transfer/lieu-leave-setting',{
                    params: {
                        companies: _.pluck($scope.selectedCompanies, 'company_id'),
                        departments: _.pluck($scope.selectedDepartments, 'department_id'),
                        keywords: $scope.keywords,
                        beginDate: $filter('date')(startInput.datepicker("getDate"), 'yyyy-MM-dd'),
                        endDate: $filter('date')(endInput.datepicker("getDate"), 'yyyy-MM-dd'),
                        type : $scope.selectedEmployeeTransferStatus,
                        transferType: $scope.isCrossDepartment > 2 ? $scope.selectedEmployeeTransferType : null,
                        isCrossDepartment: $routeParams.isCrossDepartment,
                        length: $scope.page,
                        start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
                    }
                })
                .then(function(res){
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
