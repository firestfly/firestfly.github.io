(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('OrderCoefficientSettingController', OrderCoefficientSettingController);

    OrderCoefficientSettingController.$inject = ['$scope', 'OrderCoefficientSettingService', 'CommonService'];

    function OrderCoefficientSettingController($scope, OrderCoefficientSettingService, CommonService) {
        var ocsc = this;

        $scope.paginationConfig = {
            pageOptions: [10, 20, 30]
        };

        $scope.search = search;
        ocsc.modifyCoefficient = modifyCoefficient;
        ocsc.save = save;
        ocsc.reg = new RegExp("^((([0-9]{1})|([1]{1}[0]{1}))|((([0-9]{1}))[.]{1}[0-9]{1,2}))$");
        ocsc.checkdata = checkdata;

        function checkdata(data) {
            var reg = ocsc.reg;
            if (data || data === undefined) {
                if (!reg.test(data)) {
                    CommonService.alert({
                        content: '请输入0-10之间的数字，保留2位小数。',
                        icon: 'fa-exclamation-circle',
                        iconColor: 'icon-red'
                    });
                    return ' ';
                }
            }
        }

        function save(data, rule) {
            var params = [];
            var tmp = {};
            tmp.orderCoefficient = data.orderCoefficient;
            tmp.id = rule.id;
            tmp.fullPathTaskTypeId = rule.fullPathTaskTypeId;
            tmp.departmentId = rule.departmentId;
            params.push(tmp);
            OrderCoefficientSettingService
                .saveOrderRule(params)
                .then(function (response) {
                    if (response.status == 'success') {
                        search();
                    } else {
                        CommonService.alert({
                            content: '保存失败!',
                            icon: "fa-exclamation-circle"
                        });
                    }
                });
        }

        function search() {
            OrderCoefficientSettingService
                .getOrderRule(getParams())
                .then(function (response) {
                    ocsc.rules = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                });
        }

        function modifyCoefficient(obj) {
            if (!(ocsc.rules && ocsc.rules.length > 0)) {
                return false;
            }
            var modalInstance = CommonService.createModal({
                'templateUrl': 'orderCoefficientSetting.html',
                'controller': 'ModifyOrderCofficientController',
                'size': 'sm',
                'resolve': {
                    'title': function () {
                        return obj;
                    },
                    'data': function () {
                        return ocsc.rules
                    }
                }
            });

            modalInstance.result.then(function () {
                search();
            });
        }

        function getParams() {
            return {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                "search[value]": {
                    departments: _.pluck($scope.selectedDepartments, 'department_id'),
                    firstLevelOrderType: $scope.selectedTaskTypeOne.id || "",
                    secondLevelOrderType: $scope.selectedTaskTypeTwo.id || "",
                    lastLevelOrderType: _.pluck($scope.selectedTaskTypeLast, 'id')
                }
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('ModifyOrderCofficientController', ModifyOrderCofficientController);

    ModifyOrderCofficientController.$inject = ['$scope', '$modalInstance', 'title', 'OrderCoefficientSettingService', 'data', 'CommonService'];

    function ModifyOrderCofficientController($scope, $modalInstance, title, OrderCoefficientSettingService, data, CommonService) {
        $scope.title = title;

        $scope.reg = new RegExp("^((([0-9]{1})|([1]{1}[0]{1}))|((([0-9]{1}))[.]{1}[0-9]{1,2}))$");

        $scope.ok = function () {
            if ($scope.modalform.$invalid) {
                return;
            }
            var params = [];
            angular.forEach(data, function (d) {
                var tmp = {};
                tmp.orderCoefficient = $scope.val;
                tmp.id = d.id;
                tmp.fullPathTaskTypeId = d.fullPathTaskTypeId;
                tmp.departmentId = d.departmentId;
                params.push(tmp);
            });

            OrderCoefficientSettingService
                .saveOrderRule(params)
                .then(function (response) {
                    if (response.status == 'success') {
                        $modalInstance.close();
                    } else {
                        $modalInstance.close();
                        CommonService.alert({
                            content: '保存失败!',
                            icon: "fa-exclamation-circle"
                        });
                    }
                }, function () {
                    $modalInstance.close();
                    CommonService.alert({
                        content: '保存失败!',
                        icon: "fa-exclamation-circle"
                    });
                });
        };

        $scope.cancle = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();