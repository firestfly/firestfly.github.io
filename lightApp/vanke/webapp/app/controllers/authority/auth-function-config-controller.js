'use strict';

VkrmsApp.controller('AuthFunctionConfigController', ['$scope', '$location', '$filter', '$http', 'SelectedEmployee', 'UserService', 'AuthConfig', function ($scope, $location, $filter, $http, selectedEmployee, UserService, authConfig) {
    $scope.title = "万科资源管理信息系统 - 权限管理 - 功能权限设置";
    $scope.personalInfo = selectedEmployee.employeeDetail;
    $scope.checkboxType = "functions";

    var displayRoleGroups = [];
    var authorizedRoleGroups = [];
    var savedRoleGroups = {};

    $scope.checkboxConfig = {
        isSuperUser: false
    };
    $scope.search = search;
    $scope.topBannerConfig = {
        isSaveDisabled: false,
        isBindLebangAccount: true
    };

    $scope.saveAuthConfig = function () {
        savedRoleGroups = angular.copy(displayRoleGroups);
        authConfig.updateAuthorizedRoleGroups(savedRoleGroups);
        authConfig.saveUserAuthRoleGroups(selectedEmployee.employeeId, savedRoleGroups);
    };

    initPage();

    function initPage() {
        checkSelectedEmployee();
        UserService.getCurrentUserRoleGroups().then(
            function (result) {
                displayRoleGroups = result;
                getSelectUserRoleGroups(selectedEmployee.employeeId);
            }
        );
    }

    function search() {
        var searchValue = $(".auth-search").val();
        var organizations = $filter('filter')(displayRoleGroups, {
            name: searchValue
        });
        $scope.roleGroups = organizations;
    }

    function checkSelectedEmployee() {
        if (!selectedEmployee.employeeId) {
            $location.path("/authority/auth-global-list");
        }
    }

    function getSelectUserRoleGroups(id) {
        if (id) {
            UserService.getSelectedUserRoleGroups(id).then(
                function (result) {
                    if (result.hasOwnProperty("bindLebangAccount")) {
                        $scope.topBannerConfig.isBindLebangAccount = result.bindLebangAccount;
                    }

                    var isSuperUser = result["superUser"];
                    $scope.checkboxConfig.isSuperUser = isSuperUser;
                    $scope.topBannerConfig.isSaveDisabled = isSuperUser;

                    authorizedRoleGroups = extractUserRoleGroups(result);
                    $scope.roleGroups = authConfig.initRoleGroupsWithSelectTag(displayRoleGroups, authorizedRoleGroups);

                    authConfig.switchTab(1);
                }
            );
        }
    }

    function extractUserRoleGroups(userInfo) {
        if (userInfo.authorizedRoleGroups) {
            return userInfo.authorizedRoleGroups;
        }
    }

}]);
