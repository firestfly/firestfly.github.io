(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('WealthLockController', WealthLockController);

    WealthLockController.$inject = ['$scope', 'WealthLockService', '$q', '$http', 'CommonService'];

    function WealthLockController($scope, WealthLockService, $q, $http, commonService) {
        $scope.$parent.title = "万科资源管理信息系统 - 财富值定案";
        $scope.projects = {};
        $scope.selectedProject = [];

        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                $("#input-search-field").attr("placeholder", "请输入定案名称搜索");
            }, 20);
        });

        $scope.search = function () {
            WealthLockService
                .getProject(getSearchParams())
                .then(function (response) {
                    $scope.projects = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                }, function (response) {

                });
        };

        $('#wealth-lock-collect-table').on('change', 'input', function () {
            var project = JSON.parse($(this).attr('data-project'));
            var data = {
                id: project.id,
                wealthLockId: project.wealthLockId,
                wealthLockName: project.wealthLockName,
                departmentId: project.departmentId,
                lockStatus: project.lockStatus
            }
            if ($(this).is(":checked")) {
                $scope.selectedProject.push(data);
            } else {
                $scope.selectedProject = _.reject($scope.selectedProject, function (el) {
                    return el.id == project.id && el.wealthLockId == project.wealthLockId && el.wealthLockName == project.wealthLockName && el.departmentId == project.departmentId
                });
            }
        });

        $scope.lock = function () {
            var selectedProject = $scope.selectedProject;
            if (selectedProject.length == 0) {
                commonService.alert({
                    content: '请先选择项目',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
            commonService.confirm({
                content: '是否确定要定案？',
                callback: setLock
            });

            function setLock() {
                for (var i = 0; i < selectedProject.length; i++) {
                    if (selectedProject[i].lockStatus == "已定案") {
                        commonService.alert({
                            content: '只能对未定案项目进行定案',
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                        return;
                    }
                }
                var deferred = $q.defer();
                $http
                    .post('internal/api/wealth-set-lock', selectedProject)
                    .success(function (response) {
                        deferred.resolve(response);
                        WealthLockService.getProject(getSearchParams())
                            .then(function (response) {
                                $scope.projects = response.data;
                                $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                            });
                        $scope.selectedProject = [];
                    })
                    .error(function (response) {
                        deferred.reject(response);
                        commonService.alert({
                            content: errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    });

                return deferred.promise;
            }

        }
        $scope.unlock = function () {
            var selectedProject = $scope.selectedProject;
            if (selectedProject.length == 0) {
                commonService.alert({
                    content: '请先选择项目',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
            commonService.confirm({
                content: '是否确定要解定案？',
                callback: unLock
            });

            function unLock() {
                for (var i = 0; i < selectedProject.length; i++) {
                    if (selectedProject[i].lockStatus == "未定案") {
                        commonService.alert({
                            content: '只能对已定案项目进行定案',
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                        return;
                    }
                }
                //WealthLockService.unLock(selectedProject);
                var deferred = $q.defer();
                $http
                    .post('internal/api/wealth-set-unlock', selectedProject)
                    .success(function (response) {
                        deferred.resolve(response);
                        WealthLockService.getProject(getSearchParams())
                            .then(function (response) {
                                $scope.projects = response.data;
                                $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                            });
                        $scope.selectedProject = [];
                    })
                    .error(function (response) {
                        deferred.reject(response);
                        commonService.alert({
                            content: errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    });

                return deferred.promise;
            }
        }

        function getSearchParams() {
            commonService.storageSearchStatus($scope, {
                selectedCompanies: $scope.selectedCompanies,
                selectedDepartments: $scope.selectedDepartments,
                departments: $scope.departments,
                selectedStatus: $scope.selectedLockStatus,
                wealthLockName: $scope.keywords
            });

            return {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                "search[value]": {
                    departments: _.pluck($scope.selectedDepartments, 'department_id'),
                    lockStatus: $scope.selectedLockStatus,
                    wealthLockName: $scope.keywords
                }
            }
        }

    };

})();