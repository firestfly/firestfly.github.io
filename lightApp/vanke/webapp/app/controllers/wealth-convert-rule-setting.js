(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('WealthConvertRuleSettingController', WealthConvertRuleSettingController);

    WealthConvertRuleSettingController.$inject = ['$scope', 'WealthConvertRuleSettingService', 'CommonService'];

    function WealthConvertRuleSettingController($scope, WealthConvertRuleSettingService, CommonService) {
        var wcrsc = this;

        $scope.search = search;
        wcrsc.save = save;
        wcrsc.editRules = editRules;
        wcrsc.millionCheckdata = millionCheckdata;
        wcrsc.hundredCheckdata = hundredCheckdata;
        wcrsc.editFlg = false;
        wcrsc.master = false;
        wcrsc.reg = {
            millionReg: new RegExp("^(([0-9]{1,7})|([0-9]{1,7}[.]{1}[0-9]{1,2}))$"),
            hundredReg: new RegExp("^(([0-9]{1,3})|([0-9]{1,3}[.]{1}[0-9]{1,2}))$")
        };

        $scope.$watch('wcrsc.rules', function (newValue, oldValue) {
            var count = 0;
            angular.forEach(newValue, function (rule) {
                if (rule && rule.checked) {
                    count++;
                }
            });
            if (count > 0) {
                wcrsc.editFlg = true;
            } else {
                wcrsc.editFlg = false;
            }
        }, true);

        $scope.$watch('wcrsc.master', function () {
            if (wcrsc.master) {
                angular.forEach(wcrsc.rules, function (rule) {
                    rule.checked = true;
                });
            } else {
                angular.forEach(wcrsc.rules, function (rule) {
                    rule.checked = false;
                });
            }
        });

        function millionCheckdata(data) {
            if (!checkdata(data, wcrsc.reg.millionReg)) {
                return ' '
            }
        }

        function hundredCheckdata(data) {
            if (!checkdata(data, wcrsc.reg.hundredReg)) {
                return ' '
            }
        }

        function checkdata(data, reg) {
            if (data === null) {
                CommonService.alert({
                    icon: 'fa-exclamation-circle',
                    content: "请输入必填字段"
                });
                return false
            } else {
                if (!reg.test(data)) {
                    CommonService.alert({
                        icon: 'fa-exclamation-circle',
                        content: "输入有误，请重新输入。"
                    });
                    return false
                }
            }
            return true;
        }

        function search() {
            WealthConvertRuleSettingService
                .getRule(getSearchParams())
                .then(function (response) {
                    wcrsc.rules = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                }, function (response) {

                });
        }

        function save(data, rule) {
            var params = [];
            params.push(angular.extend(data, {
                id: rule.id,
                departmentId: rule.departmentId,
                workJobId: rule.workJobId
            }));
            return WealthConvertRuleSettingService
                .saveRule(params)
                .then(function (response) {
                    if (response.status == 'fail') {
                        CommonService.alert({
                            icon: 'fa-exclamation-circle',
                            content: response.errorMessage
                        });
                        return ' ';
                    }
                }, function (response) {

                });
        }

        function getSearchParams() {
            return {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                "search[value]": {
                    departments: _.pluck($scope.selectedDepartments, 'department_id'),
                    standardWorkJobs: _.pluck($scope.selectedStandardWorkJobs, 'workJobId')
                }
            }
        }

        function editRules(obj) {
            var modalInstance = CommonService.createModal({
                'templateUrl': 'wealthConvertRuleEdit.html',
                'controller': 'WealthConvertRuleEditController',
                'size': 'lg',
                'resolve': {
                    'reg': function () {
                        return wcrsc.reg
                    }
                }
            });

            modalInstance.result.then(function (data) {
                var params = [];
                var rules = angular.copy(wcrsc.rules);
                angular.forEach(rules, function (rule) {
                    if (rule.checked || wcrsc.master) {
                        rule = angular.extend(rule, data);
                        params.push(rule);
                    }
                });
                WealthConvertRuleSettingService
                    .saveRule(params)
                    .then(function (response) {
                        if (response.status == 'fail') {
                            CommonService.alert({
                                icon: 'fa-exclamation-circle',
                                content: response.errorMessage
                            });
                            return ' ';
                        }
                        search();
                        //angular.forEach(wcrsc.rules, function (rule) {
                        //    if (rule.checked || wcrsc.master) {
                        //        angular.extend(rule, data);
                        //    }
                        //});
                    }, function (response) {

                    });
            });
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('WealthConvertRuleEditController', WealthConvertRuleEditController);

    WealthConvertRuleEditController.$inject = ['$scope', '$modalInstance', 'reg', 'CommonService'];

    function WealthConvertRuleEditController($scope, $modalInstance, reg, CommonService) {
        $scope.cancle = cancle;
        $scope.ok = ok;
        $scope.reg = reg;

        function cancle() {
            $modalInstance.dismiss('cancle');
        }

        function ok() {
            if ($scope.wealthConvertFrom.$error.required) {
                CommonService.alert({
                    icon: 'fa-exclamation-circle',
                    content: "请填写所有必填项"
                });
                return;
            }

            if (!$scope.wealthConvertFrom.$valid) {
                CommonService.alert({
                    icon: 'fa-exclamation-circle',
                    content: "输入有误，请重新输入。"
                });
                return;
            }

            $modalInstance.close({
                baseWealth: $scope.baseWealth,
                wealthConvertCoefficient: $scope.wealthConvertCoefficient,
                firstUpperLimit: $scope.firstUpperLimit,
                firstConvertCoefficient: $scope.firstConvertCoefficient,
                secondUpperLimit: $scope.secondUpperLimit,
                secondConvertCoefficient: $scope.secondConvertCoefficient,
                thirdConvertCoefficient: $scope.thirdConvertCoefficient,
                wholeFloatCoefficient: $scope.wholeFloatCoefficient
            });
        }
    }
})();