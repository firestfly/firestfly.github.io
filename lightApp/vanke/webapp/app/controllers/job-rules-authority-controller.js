'use strict';

VkrmsApp.controller('JobPointRuleAuthorityController', ['$scope', '$routeParams', '$filter', '$http', 'UserService', 'TaskRuleService', 'TaskRuleAuthConfig', 'CommonService', function ($scope, $routeParams, $filter, $http, userService, taskRuleService, taskRuleAuthConfig, commonService) {
    $scope.title = "万科资源管理信息系统 - 积分激励规则设置";
    $scope.checkboxType = "organization";
    $scope.organizationsLenLimit = 2;
    var selectedItemId = $routeParams.id;
    var displayOrganizations = [];
    var authorizedOrganizations = [];
    var savedDepartmentsIds = [];
    var initSelectedDepartment = [];

    $scope.saveAuthConfig = function () {
        savedDepartmentsIds = commonService.updateAuthorizedOrganizations(displayOrganizations, authorizedOrganizations);
        var newData = {
            update: utils.compareUpdateDepartment(savedDepartmentsIds, initSelectedDepartment),
            del: utils.compareDelDepartment(savedDepartmentsIds, initSelectedDepartment)
        };
        taskRuleAuthConfig.saveJobRuleAuthConfig(selectedItemId, newData);
        initSelectedDepartment = savedDepartmentsIds;
    };

    userService.getCurrentUser().then(
        function (result) {
            displayOrganizations = result["authorizedCompanies"];
            getSelectItemOrganizations(selectedItemId);
        }
    );
    function getSelectItemOrganizations(id) {
        if (id) {
            taskRuleService.getJobRule(id).then(
                function (result) {
                    initSelectedDepartment = commonService.getAppliedIds(id, result);
                    commonService.initOrganizationsWithSelectTag(displayOrganizations, result, selectedItemId);
                    $scope.organizations = displayOrganizations;
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
VkrmsApp.directive('organizationsScroll', ['$window', '$document', function ($window, $document) {
    return {
        link: link
    }
    function link($scope) {
        var timeId = null;

        $($window).on("scroll", function () {
            clearTimeout(timeId);
            timeId = setTimeout(function () {
                var _window = $(window);
                if ($scope.organizations && ($scope.organizationsLenLimit < $scope.organizations.length) && (_window.scrollTop() + _window.height() + 70 > $($document).height())) {
                    $scope.organizationsLenLimit++;
                    $scope.$digest();
                }
            }, 100);
        });
    }
}]);