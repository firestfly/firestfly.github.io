(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('RepairWealthRuleController', RepairWealthRuleController);

    RepairWealthRuleController.$inject = ['$scope', 'CommonService', '$timeout', 'RepairWealthRuleService'];

    function RepairWealthRuleController($scope, CommonService, $timeout, RepairWealthRuleService) {
        var rc = this;

        $scope.title = "万科资源管理信息系统  排班管理";
        $scope.commonSearchBarConfig = {
            isCompanySelectpickerMultiple: false,
            isDepartmentSelectpickerMultipe: true,
            companySelecterLabel: "公司范围",
            departmentSelecterLabel: "部门/项目",
            workgroupSelecterLabel: "岗位专业分类"
        };

        $scope.search = search;
        $scope.paginationConfig = {
            pageOptions: [10, 20, 30]
        };

        rc.save = save;
        rc.modifyCoefficient = modifyCoefficient;
        rc.checkdata = checkdata;

        function checkdata(data) {
            var reg = new RegExp("^((([0-9]{1})|([1]{1}[0]{1}))|((([0-9]{1}))[.]{1}[0-9]{1,2}))$");
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

        function modifyCoefficient(obj) {
            if (!(rc.data && rc.data.length > 0)) {
                return false;
            }
            CommonService.createModal({
                'templateUrl': 'modifyCofficient.html',
                'controller': 'ModifyCofficientController',
                'size': 'sm',
                'resolve': {
                    'title': function () {
                        return obj;
                    },
                    'data': function () {
                        return rc.data;
                    },
                    'length': function () {
                        return $scope.page
                    },
                    'start': function () {
                        return $scope.currentPage
                    }
                }
            });
        }

        function search() {
            RepairWealthRuleService
                .getRepairWealthRule(getParams())
                .then(function (response) {
                    rc.data = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page) || 1;
                });
        }

        function save(data, id) {
            data = translate(data);
            data = angular.extend(data, {
                departmentId: id
            });
            RepairWealthRuleService
                .saveRepairWealthRule([data])
                .then(function () {

                });
        }

        function getParams() {
            return {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                "search[value]": {
                    departments: _.pluck($scope.selectedDepartments, 'department_id')
                }
            }
        }

        function translate(data) {
            var result = {};
            for (var i in data) {
                if (i.indexOf('.') > -1) {
                    var arr = i.split('.');
                    if (!result[arr[0]]) {
                        result[arr[0]] = {};
                    }
                    result[arr[0]][arr[1]] = data[i];
                } else {
                    result[i] = data[i]
                }
            }
            return result;
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('ModifyCofficientController', ModifyCofficientController);

    ModifyCofficientController.$inject = ['$scope', '$modalInstance', 'CommonService', 'RepairWealthRuleService', 'title', 'data'];

    function ModifyCofficientController($scope, $modalInstance, CommonService, RepairWealthRuleService, title, data) {

        var modalTitle, key;
        if (title) {
            var arr = title.split(':');
            modalTitle = arr[0];
            key = arr[1];
        }

        if (modalTitle && modalTitle.indexOf(',') > -1) {
            var arr = modalTitle.split(',');
            $scope.title = arr[0];
            $scope.subtitle = arr[1];
        } else {
            $scope.title = modalTitle;
        }

        $scope.reg = new RegExp("^((([0-9]{1})|([1]{1}[0]{1}))|((([0-9]{1}))[.]{1}[0-9]{1,2}))$");

        $scope.ok = function () {
            if ($scope.modalform.$invalid) {
                return;
            }
            angular.forEach(data, function (d) {
                if (key.indexOf('.') > -1) {
                    var arr = key.split('.');
                    d[arr[0]][arr[1]] = $scope.val;
                } else {
                    d[key] = $scope.val;
                }
            });
            RepairWealthRuleService
                .saveRepairWealthRule(data)
                .then(function (response) {
                    $modalInstance.close();
                    if (response.status != 'success') {
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
