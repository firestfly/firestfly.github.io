/**
 * Created by wangq34 on 2018/2/6.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('WhiteListController', WhiteListController);

    WhiteListController.$inject = ['$scope', '$http', 'CommonService'];

    function WhiteListController($scope, $http, commonService) {
        var config = {
            language: 'zh-CN',
            todayHighlight: false,
            clearBtn: true,
            autoclose: true,
            format: "yyyy年mm月dd日",
            daysOfWeekDisabled: []
        };

        $('.input-sm').datepicker(config);

        commonService
            .getLockCycleType({
                params: {
                    type: 1
                }
            })
            .then(function (response) {
                var previousLockCycle = response[1];
                $scope.startDate = previousLockCycle.lockCycleBegintime;
                $scope.endDate = previousLockCycle.lockCycleEndtime;
            });

        $scope.save = save;

        function save() {
            if (!$scope.employeeIds) {
                commonService.alert({
                    content: '请输入资源编号！'
                })
            }
            $http
                .post(apiBaseUrl + '/save/whiteListAttendanceLock', {
                    "whiteListData": {
                        "startDate": $scope.startDate,
                        "endDate": $scope.endDate,
                        "employeeIds": $scope.employeeIds.toString().replace(/\n/g, ",").split(','),
                        "reason": $scope.reason
                    }
                })
                .then(function (res) {
                    if (res.data.status == 'fail') {
                        commonService.alert({
                            content: '资源编号' + res.data.employeeIdList.join('、') + '不存在，请检查。'
                        })
                    }
                    if (res.data.status == 'success') {
                        commonService.alert({
                            content: '保存成功。'
                        })
                    }
                })
        }
    }
})();