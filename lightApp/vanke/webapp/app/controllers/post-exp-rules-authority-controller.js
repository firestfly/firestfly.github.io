'use strict';
VkrmsApp.controller('PostExpRuleAuthorityController', ['$scope', '$routeParams', '$filter', '$http', 'UserService', 'TaskRuleAuthConfig', 'CommonService', 'PostExpRuleAuthorityService', function ($scope, $routeParams, $filter, $http, userService, taskRuleAuthConfig, commonService, postExpRuleAuthorityService) {

    var experienceRuleId = $routeParams.experienceRuleId;
    var displayOrganizations = [];
    var authorizedOrganizations = [];
    var savedDepartmentsIds = [];
    $scope.organizationsLenLimit = 2;
    $scope.saveAuthConfig = saveAuthConfig;
    $scope.search = search;
    init();

    function init() {
        $scope.title = "万科资源管理信息系统 - 经验值设置";
        $scope.checkboxType = "organization";
        userService.getCurrentUser().then(function (result) {
            displayOrganizations = result["authorizedCompanies"];
            getSelectItemOrganizations(experienceRuleId);
        }, function (result) {
        });
    }

    function saveAuthConfig() {
        savedDepartmentsIds = commonService.updateAuthorizedOrganizations(displayOrganizations, authorizedOrganizations);
        postExpRuleAuthorityService.updatePostExpRuleDepartments(experienceRuleId, savedDepartmentsIds).then(function (result) {
            commonService.alert({
                content: "保存成功",
                icon: "fa-exclamation-circle"
            });
        });
    }

    function getSelectItemOrganizations(experienceRuleId) {
        if (experienceRuleId) {
            postExpRuleAuthorityService.getPostExpRuleDepartments(experienceRuleId).then(function (result) {
                    authorizedOrganizations = postExpRuleAuthorityService.initSelectedDpt();
                    commonService.initOrganizationsWithSelectTag(displayOrganizations, result, experienceRuleId);
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

