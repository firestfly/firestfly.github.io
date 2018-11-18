'use strict';

VkrmsApp.controller('ShiftGroupAuthorityController', ['$scope', '$routeParams', '$filter', '$http', 'UserService', 'TaskRuleAuthConfig', 'CommonService', 'ShiftGroupAuthorityService', function ($scope, $routeParams, $filter, $http, userService, taskRuleAuthConfig, commonService, shiftGroupAuthorityService) {

    var shiftGroupId = $routeParams.shiftGroupId;
    var displayOrganizations = [];
    var authorizedOrganizations = [];
    var savedDepartmentsIds = [];
    var isUpdateUserInfo = false;

    $scope.saveAuthConfig = saveAuthConfig;
    $scope.search = search;
    $scope.organizationsLenLimit = 2;
    init();

    function init() {
        $scope.title = "万科资源管理信息系统 -班次组设置";
        $scope.checkboxType = "organization";

        userService.getCurrentUser().then(
            function (result) {
                displayOrganizations = result["authorizedCompanies"];

            }
        );
        getSelectItemOrganizations(shiftGroupId);
    }

    function saveAuthConfig() {
        savedDepartmentsIds = commonService.updateAuthorizedOrganizations(displayOrganizations, authorizedOrganizations);
        shiftGroupAuthorityService.updateShiftGroupDepartments(shiftGroupId, savedDepartmentsIds).then(function (result) {
            isUpdateUserInfo = true;
            commonService.alert({
                content: "保存成功",
                icon: "fa-exclamation-circle"
            });
        });
    }

    function getSelectItemOrganizations(shiftGroupId) {
        if (shiftGroupId) {
            shiftGroupAuthorityService.getShiftGroupDepartments(shiftGroupId).then(
                function (result) {
                    authorizedOrganizations = shiftGroupAuthorityService.initSelectedDpt();
                    commonService.initOrganizationsWithSelectTag(displayOrganizations, result, shiftGroupId);
                    $scope.organizations = displayOrganizations;
                }
            );
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
