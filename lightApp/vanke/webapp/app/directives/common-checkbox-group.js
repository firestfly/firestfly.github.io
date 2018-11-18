'use strict';

VkrmsApp.directive('commonCheckboxGroup', ['$timeout', 'CommonService', function ($timeout, commonService) {

    return {
        restrict: 'A',
        scope: {
            checkboxGroupData: "=",
            checkboxGroupTitle: "=",
            checkboxType: "=",
            checkboxConfig: "="
        },
        templateUrl: baseUrl + '/partials/common/common-checkbox-group.html',
        link: function ($scope) {
            //$scope.ruleIdType = $scope.checkboxConfig.ruleIdType;
            //$scope.ruleNameType = $scope.checkboxConfig.ruleNameType;
            if ($scope.checkboxType === "organization") {
                $scope.displayType = "department_name";
                $scope.sortItems = function (item) {
                    if (item && item.department_id) {
                        return item.department_id;
                    }
                }
            } else if ($scope.checkboxType === "workgroup") {
                $scope.displayType = "work_group_name";
                $scope.sortItems = function (item) {
                    if (item && item.work_group_id) {
                        return item.work_group_id;
                    }
                }
            } else if ($scope.checkboxType === "functions") {
                $scope.displayType = "name";
                $scope.sortItems = function (item) {
                    if (item && item.id) {
                        return item.id;
                    }
                }
            }

            $scope.masterChange = function () {
                var isCheck = $scope.isAllChecked;
                angular.forEach($scope.checkboxGroupData, function (item) {
                    if (!item.isDisabled) {
                        item.isSelected = isCheck;
                    }
                });
            };

            $scope.itemChange = function () {
                updateMasterCheckboxStatus();
            };

            $scope.itemClick = function (item) {
                if (item.isDisabled) {
                    var content = "此部门已经被应用于规则：" + item.ruleName;
                    commonService.alert({
                        content: content,
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                }
            };

            function updateMasterCheckboxStatus() {
                var items = $scope.checkboxGroupData;
                var totleLen = items.length,
                    culLen = 0,
                    item,
                    isAllDisabled = 0,
                    index;
                if (items && totleLen > 0) {
                    index = totleLen - 1;
                    while (index >= 0) {
                        item = items[index];
                        if (item.isDisabled) {
                            culLen++;
                            isAllDisabled++;
                        }
                        if (item.isSelected) {
                            culLen++;
                        }
                        index--;
                    }
                    $scope.isAllDisabled = isAllDisabled == totleLen;
                    $scope.isAllChecked = (culLen >= totleLen) && !$scope.isAllDisabled;
                }
            }

            $timeout(function () {
                updateMasterCheckboxStatus();
            }, 100);
        }
    };

}]);
