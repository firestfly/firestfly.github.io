/**
 * Created by wangq34 on 2016/11/4.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('ExperienceSummarizingController', ExperienceSummarizingController);

    ExperienceSummarizingController.$inject = ['$scope', 'ExperienceSummarizingService', 'CommonService', '$filter', '$timeout'];

    function ExperienceSummarizingController($scope, ExperienceSummarizingService, CommonService, $filter, $timeout) {
        var esuc = this;

        $scope.search = search;
        $scope.export = exportResult;
        esuc.sort = sort;
        esuc.currentExperienceOrder = null;
        esuc.startPeriodExperienceOrder = null;
        esuc.endPeriodExperienceOrder = null;
        esuc.experienceChangeOrder = null;

        init();

        function init() {
            var n = new Date();

            $timeout(function () {
                $('#scheduledatepicker input[name=end]').datepicker('setDate', $filter('date')(n, "yyyy年MM月dd日"));
                $('#scheduledatepicker input[name=start]').datepicker('setDate', $filter('date')(n.setDate(n.getDate() - 30), "yyyy年MM月dd日"));
                $('#scheduledatepicker input[name=start],#scheduledatepicker input[name=end]').datepicker('refresh');
                $scope.$broadcast('refreshDatepickers');
                $scope.search();
                $scope.$apply();
            }, 500);
        }

        function sort(obj) {
            if (obj == 'currentExperience') {
                esuc.currentExperienceOrder = !esuc.currentExperienceOrder;
                esuc.startPeriodExperienceOrder = null;
                esuc.endPeriodExperienceOrder = null;
                esuc.experienceChangeOrder = null;
            }
            if (obj == 'endPeriodExperience') {
                esuc.currentExperienceOrder = null;
                esuc.startPeriodExperienceOrder = null;
                esuc.endPeriodExperienceOrder = !esuc.endPeriodExperienceOrder;
                esuc.experienceChangeOrder = null;
            }
            if (obj == 'startPeriodExperience') {
                esuc.currentExperienceOrder = null;
                esuc.startPeriodExperienceOrder = !esuc.startPeriodExperienceOrder;
                esuc.endPeriodExperienceOrder = null;
                esuc.experienceChangeOrder = null;
            }
            if (obj == 'experienceChange') {
                esuc.currentExperienceOrder = null;
                esuc.startPeriodExperienceOrder = null;
                esuc.endPeriodExperienceOrder = null;
                esuc.experienceChangeOrder = !esuc.experienceChangeOrder;
            }
            search({
                currentExperienceOrder: esuc.currentExperienceOrder,
                startPeriodExperienceOrder: esuc.startPeriodExperienceOrder,
                endPeriodExperienceOrder: esuc.endPeriodExperienceOrder,
                experienceChangeOrder: esuc.experienceChangeOrder
            });
        }

        function exportResult() {
            var params = getExportParams();
            console.log(params);
            var url = baseUrl + "/file/experience-summarizing/experience-verify-exporting";
            CommonService.downloadFile(url, params);
        }

        function search(extraParams) {
            if (!$('#scheduledatepicker input[name=start]').datepicker('getDate')) {
                return
            }

            var params = getParams();
            if (extraParams) {
                angular.extend(params['search[value]'], extraParams, true);
            } else {
                esuc.currentExperienceOrder = null;
                esuc.startPeriodExperienceOrder = null;
                esuc.endPeriodExperienceOrder = null;
                esuc.experienceChangeOrder = null;
            }

            ExperienceSummarizingService
                .getExperienceSummarizingList(params)
                .then(function (response) {
                    esuc.experienceSummarizingList = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                });
        }

        function getParams() {
            return {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                "search[value]": {
                    departments: _.pluck($scope.selectedDepartments, 'department_id'),
                    standardWorkJobs: _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                    "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
                    "beginDate": utils.formatDate($('#scheduledatepicker input[name=start]').datepicker('getDate')),
                    "endDate": utils.formatDate($('#scheduledatepicker input[name=end]').datepicker('getDate')),
                    "keywords": $scope.keywords
                }
            }
        }

        function getExportParams() {
            return {
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
                departments: _.pluck($scope.selectedDepartments, 'department_id'),
                standardWorkJobs: _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
                "beginDate": utils.formatDate($('#scheduledatepicker input[name=start]').datepicker('getDate')),
                "endDate": utils.formatDate($('#scheduledatepicker input[name=end]').datepicker('getDate')),
                "keywords": $scope.keywords
            }
        }
    }
})();