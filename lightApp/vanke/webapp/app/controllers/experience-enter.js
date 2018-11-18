/**
 * Created by deepsky on 2016/11/7.
 */

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('experienceEnterController', experienceEnterController);
    experienceEnterController.$inject = ['$scope', '$http', 'CommonService'];
    function experienceEnterController($scope, $http, commonService) {
        var exp = this;

        $scope.search = search;

        exp.open = open;
        exp.verifyStatus = ['全部', '待审核', '审核通过', '审核不通过'];

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
                    "keywords": $scope.keywords,
                    "state": $scope.selectedVerifyStatus.id
                }
            }
        }

        function search() {
            $http
                .get(apiBaseUrl + "/experience-view", {params: getParams()})
                .success(function (response) {
                    exp.experiences = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                })
                .error(function (response) {

                });

        }

        function open(event, item) {
            commonService.createModal({
                'templateUrl': 'expDetailModal.html',
                'controller': 'expDetailModalController',
                'size': 'sm',
                'resolve': {
                    'detail': function () {
                        return item
                    }
                }
            });
        }

    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('expDetailModalController', expDetailModalController);

    expDetailModalController.$inject = ['$scope', 'CommonService', '$modalInstance', 'detail'];

    function expDetailModalController($scope, CommonService, $modalInstance, detail) {
        $scope.cancel = cancel;
        $scope.openImg = openImg;
        $scope.detail = detail;
        function cancel() {
            $modalInstance.dismiss('cancel')
        }

        $scope.verifyStatus = ['全部', '待审核', '审核通过', '审核不通过'];
        function openImg(urls) {
            if (urls) {
                CommonService.createModal({
                    'templateUrl': 'experienceImgModal.html',
                    'controller': 'experienceImgModalController',
                    'windowClass': 'experience-size',
                    'resolve': {
                        url: function () {
                            return urls;
                        }
                    }
                });
            }
        }
    }
})();