'use strict';

VkrmsApp.directive('authCommonCheckboxGroup', ['$timeout', 'CommonService', function ($timeout, commonService) {

    return {
        restrict: 'A',
        scope: {
            checkboxGroupData: "=",
            checkboxGroupTitle: "=",
            checkboxType: "=",
            checkboxConfig: "="
        },
        templateUrl: baseUrl + '/partials/authority/auth-common-checkbox-group.html',
        link: function ($scope) {
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

            function updateMasterCheckboxStatus () {
                var items = $scope.checkboxGroupData;
                var totleLen = items.length,
                    culLen = 0,
                    item,
                    index;
                if (items && totleLen > 0) {
                    index = totleLen - 1;
                    while (index >= 0) {
                        item = items[index];
                        if (item.isDisabled || item.isSelected) {
                            culLen++;
                        }
                        index--;
                    }
                    $scope.isAllChecked = (culLen >= totleLen);
                }
            }

            $timeout(updateMasterCheckboxStatus, 100);
        }
    };

}]);
