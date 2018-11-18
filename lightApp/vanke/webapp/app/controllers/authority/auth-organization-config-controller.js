'use strict';

VkrmsApp.controller('AuthOrganizationConfigController', ['$scope', '$rootScope', '$location', '$filter', '$http', 'SelectedEmployee', 'UserService', 'AuthConfig', function ($scope, $rootScope, $location, $filter, $http, selectedEmployee, userService, authConfig) {
    $scope.title = "万科资源管理信息系统 - 权限管理";
    $scope.personalInfo = selectedEmployee.employeeDetail;
    $scope.checkboxType = "organization";
    $scope.organizationsLenLimit = 2;
    var selectedUserId = "";
    var displayOrganizations;
    userService.getCurrentUser().then(function (result) {
        displayOrganizations = extractUserOrganizations(result);
    });
    var authorizedOrganizations = [];
    var savedOrganizations = {};

    $scope.checkboxConfig = {
        isSuperUser: true
    };
    $scope.search = search;
    $scope.topBannerConfig = {
        isSaveDisabled: false,
        isBindLebangAccount: true
    };

    $scope.saveAuthConfig = function () {
        savedOrganizations.authorizedCompanies = angular.copy(displayOrganizations);
        authConfig.updateAuthorizedOrganizations(savedOrganizations.authorizedCompanies);
        authConfig.saveUserAuthConfig(selectedUserId, savedOrganizations);
    };

    initPage();

    function initPage() {
        checkSelectedEmployee();
        getSelectUserOrganizations(selectedEmployee.employeeId);
    }

    function checkSelectedEmployee() {
        if (!selectedEmployee.employeeId) {
            $location.path("/authority/auth-global-list");
        }
    }

    function getSelectUserOrganizations(id) {
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
                    savedOrganizations = angular.copy(result);
                    authorizedOrganizations = extractUserOrganizations(result);
                    $scope.organizations = authConfig.initOrganizationsWithSelectTag(displayOrganizations, authorizedOrganizations);

                    authConfig.switchTab(0);
                }
            );
        }
    }

    function extractUserOrganizations(userInfo) {
        if (userInfo.authorizedCompanies) {
            return userInfo.authorizedCompanies;
        }
    }

    function search() {
        var searchValue = $(".auth-search").val(), organizationsLen = 0;
        var organizations = $filter('filter')(displayOrganizations, {
            company_name: searchValue
        });
        for (var index = 0, len = organizations.length; index < len; index++) {
            organizationsLen += organizations[index].departments.length;
            if (organizationsLen > 80) {
                $scope.organizationsLenLimit = index + 1;
                break;
            }
        }
        if (organizationsLen <= 80) {
            $scope.organizationsLenLimit = organizations.length;
        }
        $scope.organizations = organizations;
    }
}]);
