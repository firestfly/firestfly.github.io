/**
 * Created by wangq34 on 2016/11/4.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('ExperienceVerifyController', ExperienceVerifyController);

    ExperienceVerifyController.$inject = ['$scope', 'ExperienceVerifyService', 'CommonService', '$modal'];

    function ExperienceVerifyController($scope, ExperienceVerifyService, CommonService, $modal) {
        var evc = this;

        $scope.search = search;
        evc.open = open;
        evc.openDetail = openDetail;


        function search() {
            ExperienceVerifyService
                .getExperienceVerifyList(getParams())
                .then(function (response) {
                    evc.experienceVerifylist = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                });
        }

        function openDetail(obj) {
            CommonService.createModal({
                'templateUrl': 'experienceDetailModal.html',
                'controller': 'experienceDetailModalController',
                'size': 'sm',
                'resolve': {
                    'response': function () {
                        return obj;
                    }
                }
            });
        }

        function open(id, verifyStatus) {
            var modalInstance = $modal.open({
                templateUrl: 'verifyModal.html',
                controller: 'VerifyModalCtrl',
                size: 'sm',
                resolve: {
                    verifyStatus: function () {
                        return verifyStatus;
                    }
                }
            });

            modalInstance.result.then(function (memo) {
                var params = {
                    id: id,
                    state: verifyStatus,
                    verifyOpinion: memo
                };
                ExperienceVerifyService
                    .verify(params)
                    .then(function (response) {
                        if (response.status == 'fail') {
                            CommonService.alert({
                                icon: 'fa-exclamation-circle',
                                content: response.errorMessage
                            });
                            return
                        }
                        search();
                    }, function () {
                        CommonService.alert({
                            icon: 'fa-exclamation-circle',
                            content: "网络超时，请稍后再试！"
                        });
                    })
            }, function () {

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
                    "keywords": $scope.keywords,
                    state: $scope.selectedVerifyStatus.id
                }
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('experienceDetailModalController', experienceDetailModalController);

    experienceDetailModalController.$inject = ['$scope', 'CommonService', '$modalInstance', 'response'];

    function experienceDetailModalController($scope, CommonService, $modalInstance, response) {
        $scope.cancel = cancel;
        $scope.openImg = openImg;
        $scope.detail = response;
        $scope.verifyStatusArr = CommonService.getExperienceVerifyState();
        $scope.rate = 3.5;
        $scope.max = 5;
        $scope.isReadonly = true;

        function cancel() {
            $modalInstance.dismiss('cancel')
        }

        function openImg(url) {
            if (url) {
                CommonService.createModal({
                    'templateUrl': 'experienceImgModal.html',
                    'controller': 'experienceImgModalController',
                    'windowClass': 'experience-size',
                    'resolve': {
                        url: function () {
                            return url;
                        }
                    }
                });
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('VerifyModalCtrl', VerifyModalCtrl);

    VerifyModalCtrl.$inject = ['$scope', 'ExperienceVerifyService', 'CommonService', '$modalInstance', 'verifyStatus'];

    function VerifyModalCtrl($scope, ExperienceVerifyService, CommonService, $modalInstance, verifyStatus) {
        $scope.verifyStatus = verifyStatus;

        if (verifyStatus == 2) {
            $scope.placeholder = '请填写审核意见';
        } else {
            $scope.placeholder = '请填写拒绝原因，必填';
        }

        $scope.ok = function () {
            if ($scope.verifyStatus == 3 && !$scope.verifyOpinion) {
                CommonService.alert({
                    icon: 'fa-exclamation-circle',
                    content: "请填写拒绝原因!"
                });
                return;
            }
            $modalInstance.close($scope.verifyOpinion);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();