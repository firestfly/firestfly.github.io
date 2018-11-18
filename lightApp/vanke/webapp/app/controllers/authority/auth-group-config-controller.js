'use strict';

VkrmsApp.controller('AuthGroupConfigController', ['$scope', '$location', '$filter', '$http', 'SelectedEmployee', 'UserService', 'AuthConfig', function ($scope, $location, $filter, $http, selectedEmployee, userService, authConfig) {
    $scope.title = "万科资源管理信息系统 - 权限管理 - 设置子组权限";
    $scope.personalInfo = selectedEmployee.employeeDetail;
    $scope.checkboxType = "workgroup";
    $scope.checkboxGroupTitle = "全部选择";

    var selectedUserId = "";
    var displayWorkgroups;
    userService.getCurrentUser().then(function (result) {
        displayWorkgroups = extractUserWorkgroups(result);
    });
    var authorizedWorkgroups = [];
    var savedWorkgroups = {};

    $scope.checkboxConfig = {
        isSuperUser: false
    };

    $scope.topBannerConfig = {
        isSaveDisabled: false,
        isBindLebangAccount: true
    };
    $scope.search = search;
    $scope.saveAuthConfig = function () {
        savedWorkgroups.authorizedWorkGroups = angular.copy(displayWorkgroups);
        authConfig.updateAuthorizedWorkgroups(savedWorkgroups.authorizedWorkGroups);
        authConfig.saveUserAuthConfig(selectedUserId, savedWorkgroups);
    };

    initPage();
    function search() {
        var searchValue = $(".auth-search").val();
        var workgroups = $filter('filter')(displayWorkgroups, {
            work_group_name: searchValue
        });
        $scope.workgroups = workgroups;
    }

    function initPage() {
        checkSelectedEmployee();
        getSelectUserWorkgroup(selectedEmployee.employeeId);
    }

    function checkSelectedEmployee() {
        if (!selectedEmployee.employeeId) {
            $location.path("/authority/auth-global-list");
        }
    }

    function getSelectUserWorkgroup(id) {
        if (id) {
            userService.getSelectedUser(id).then(
                function (result) {
                    if (result.hasOwnProperty("bindLebangAccount")) {
                        $scope.topBannerConfig.isBindLebangAccount = result.bindLebangAccount;
                    }

                    var isSuperUser = result["superUser"];
                    $scope.checkboxConfig.isSuperUser = isSuperUser;
                    $scope.topBannerConfig.isSaveDisabled = isSuperUser;

                    selectedUserId = result.id;
                    savedWorkgroups = angular.copy(result);
                    authorizedWorkgroups = extractUserWorkgroups(result);
                    $scope.workgroups = authConfig.initWorkgroupsWithSelectTag(displayWorkgroups, authorizedWorkgroups);

                    authConfig.switchTab(2);
                }
            );
        }
    }

    function extractUserWorkgroups(userInfo) {
        if (userInfo.authorizedWorkGroups) {
            return userInfo.authorizedWorkGroups;
        }
    }

}]);
