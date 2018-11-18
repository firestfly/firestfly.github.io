/**
 * Created by ushio on 2017/4/13.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('LieuLineController', LieuLineController);

    LieuLineController.$inject = ['$scope', 'LieuLineSettingService', 'CommonService', '$timeout'];

    function LieuLineController($scope, LieuLineSettingService, CommonService, $timeout) {
        var llc = this;
        $scope.commonSearchBarConfig = {
            companySelecterLabel: "管理中心",
            isCompanySelectpickerMultiple: false,
            isDepartmentSelectpickerMultipe: false
        };
        $timeout(function () {
            $('.vk-nowrap').append($("#backss"));
        }, 100)
        $scope.search = search;
        $scope.checkLeaveDuration = checkLeaveDuration;
        $scope.save = save;

        function search () {
            LieuLineSettingService
                .getLieuLineList(getParams())
                .then(function (res) {
                    llc.lieuLineList = res.data;
                    $scope.totalPage = Math.ceil(res.recordsTotal / $scope.page);
                    if (res.recordsTotal) {
                        $scope.currentPage = 1;
                    }
                })
            CommonService.storageSearchStatus($scope);
        }

        function getParams () {
            return {
                "search[value]": {
                    "companyIds": _.pluck($scope.selectedCompanies, 'company_id'),
                    "workjobIds": _.pluck($scope.selectedStandardWorkJobs, 'workJobId') || ''
                },
                length: $scope.page,
                start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0
            }
        }

        function checkLeaveDuration(data) {
            var reg = /^\d{0,2}$/;
            if (!reg.test(data)) {
                return ("请输入0~99之间的整数!");
            }
        }
        function save(id, data) {
            LieuLineSettingService.save(id, data);
        }
    }

})();