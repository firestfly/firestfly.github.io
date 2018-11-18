'use strict';

VkrmsApp.controller('CommonSelectDepartmentController', ['$scope', '$http', 'UserService', 'CommonService', '$timeout', '$modalInstance', 'selectedDepartment', function ($scope, $http, userService, commonService, $timeout, $modalInstance, selectedDepartment) {

    $scope.organizations = [];
    $scope.departments = selectedDepartment || [];
    $scope.selectedCompanies = [];
    $scope.selectedDepartments = selectedDepartment || [];

    $scope.$on('companies-loaded', function () {
        $timeout(function () {
            $('#select-company').selectpicker('refresh');
            $("#select-department").selectpicker('refresh');
            initSelectCompany();
        }, 0, false);
    });

    $scope.ok = function () {
        var selectedDepartmentIds = $("#select-department").val();
        $scope.selectedDepartments = _.filter($scope.selectedDepartments, function (department) {
            return _.find(selectedDepartmentIds, function (id) {
                return id === department.department_id;
            });
        });
        $modalInstance.close($scope.selectedDepartments);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    initModal();

    function initModal() {
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
                    $scope.selectedDepartments = _.reject($scope.selectedDepartments, function (department) {
                        return department.department_id == dept.department_id;
                    });

                    $scope.departments = _.reject($scope.departments, function (department) {
                        return department.department_id == dept.department_id;
                    });
                });

                $.merge($scope.departments, departmentsInCompany);
                $.merge($scope.selectedDepartments, departmentsInCompany);

                $scope.departments = _.sortBy($scope.departments, function (department) {
                    return department.department_id;
                });
                $scope.selectedDepartments = _.sortBy($scope.selectedDepartments, function (department) {
                    return department.department_id;
                });

            } else {
                angular.forEach(departmentsInCompany, function (dept) {
                    $scope.selectedDepartments = _.reject($scope.selectedDepartments, function (department) {
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
}]);
