'use strict';

VkrmsApp.directive('commonCompanyDepartment', ['$http', '$timeout', 'UserService', 'CommonService', function ($http, $timeout, userService, commonService) {

    return {
        restrict: 'E',
        scope: {
            selcompanies: '=',
            seldepartments: '=',
            organizations: '=',
            departments: "="
        },
        templateUrl: baseUrl + '/partials/common/common-company-department.html',
        link: function ($scope, element, attrs) {
            $scope.organizations = [];
            $scope.departments = [];
            var cacheObj = sessionStorage["searchState_" + location.hash];
            if (cacheObj) {
                try {
                    cacheObj = JSON.parse(cacheObj);
                    angular.extend($scope, cacheObj);
                } catch (e) {
                }
                $timeout(function () {
                    $scope.$broadcast('companies-loaded');
                }, 100)
            }
            $scope.$on('companies-loaded', function () {
                $timeout(function () {
                    $('#select-company').selectpicker('refresh');
                    $("#select-department").selectpicker('refresh');
                    initSelectCompany();
                }, 0, false);
            });

            $scope.clear = function () {
                $scope.selcompanies = [];
                $scope.seldepartments = [];
                $scope.departments = [];
                $timeout(function () {
                    $scope.$broadcast('companies-loaded');
                }, 0, false);
            };

            init();

            function init() {
                $('.selectpicker').selectpicker();
                getLoginUserData();
            }

            function getLoginUserData() {
                var loginUserObj = {};
                userService.getCurrentUser().then(function (result) {
                    loginUserObj = result;
                    applySelecterData(loginUserObj);
                }, function (result) {
                });

            }

            function applySelecterData(data) {
                $scope.organizations = data.authorizedCompanies;
                $scope.$broadcast('companies-loaded');
            }

            function initSelectCompany() {
                $("#select-company").parent().find('ul.dropdown-menu li').on('click', function (index) {

                    var selectedItemIndex = $(this).attr('data-original-index');
                    var selectedOrganization = $scope.organizations[selectedItemIndex];
                    var departmentsInCompany = selectedOrganization.departments;

                    if (!$(this).hasClass("selected")) {
                        angular.forEach(departmentsInCompany, function (dept) {
                            $scope.seldepartments = _.reject($scope.seldepartments, function (department) {
                                return department.department_id == dept.department_id;
                            });

                            $scope.departments = _.reject($scope.departments, function (department) {
                                return department.department_id == dept.department_id;
                            });
                        });

                        $.merge($scope.departments, departmentsInCompany);
                        $.merge($scope.seldepartments, departmentsInCompany);

                        $scope.departments = _.sortBy($scope.departments, function (department) {
                            return department.department_id;
                        });
                        $scope.seldepartments = _.sortBy($scope.seldepartments, function (department) {
                            return department.department_id;
                        });

                    } else {
                        angular.forEach(departmentsInCompany, function (dept) {
                            $scope.seldepartments = _.reject($scope.seldepartments, function (department) {
                                return department.department_id == dept.department_id;
                            });

                            $scope.departments = _.reject($scope.departments, function (department) {
                                return department.department_id == dept.department_id;
                            });
                        });
                    }

                    $scope.$apply();
                    $("#select-department").selectpicker('refresh');
                });

            }
        }
    };

}]);
