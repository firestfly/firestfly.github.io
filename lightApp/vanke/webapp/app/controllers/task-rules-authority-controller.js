'use strict';

VkrmsApp.controller('TaskPointRuleAuthorityController', ['$scope', '$routeParams', '$filter', '$http', 'UserService', 'TaskRuleService', 'TaskRuleAuthConfig', 'CommonService', function ($scope, $routeParams, $filter, $http, userService, taskRuleService, taskRuleAuthConfig, commonService) {
    $scope.title = "万科资源管理信息系统 - 任务积分规则设置";
    $scope.checkboxType = "organization";

    var selectedItemId = $routeParams.id;
    var displayOrganizations = [];
    var authorizedOrganizations = [];
    var savedDepartmentsIds = [];
    var initSelectedDepartment = [];
    $scope.organizationsLenLimit = 2;
    $scope.saveAuthConfig = function () {
        savedDepartmentsIds = commonService.updateAuthorizedOrganizations(displayOrganizations, authorizedOrganizations);
        var newData = {
            update: utils.compareUpdateDepartment(savedDepartmentsIds, initSelectedDepartment),
            del: utils.compareDelDepartment(savedDepartmentsIds, initSelectedDepartment)
        }
        taskRuleAuthConfig.saveTaskRuleAuthConfig(selectedItemId, newData);
        initSelectedDepartment = savedDepartmentsIds;
    };
    userService.getCurrentUser().then(
        function (result) {
            displayOrganizations = result["authorizedCompanies"];
            $scope.organizations = displayOrganizations;
            getSelectItemOrganizations(selectedItemId);
        }
    );
    function getSelectItemOrganizations(id) {
        if (id) {
            taskRuleService.getTaskRule(id).then(
                function (result) {
                    initSelectedDepartment = commonService.getAppliedIds(id, result);
                    commonService.initOrganizationsWithSelectTag(displayOrganizations, result, selectedItemId);
                    authorizedOrganizations = initSelectedDepartment;
                }
            );
        }
    }

    $scope.search = function () {
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
    };

}]);
