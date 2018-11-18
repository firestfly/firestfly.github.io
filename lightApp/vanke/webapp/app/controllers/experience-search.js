/**
 * Created by wangq34 on 2016/11/4.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('ExperienceSearchController', ExperienceSearchController);

    ExperienceSearchController.$inject = ['$scope', 'ExperienceSearchService', 'CommonService'];

    function ExperienceSearchController($scope, ExperienceSearchService, CommonService) {
        var esec = this;

        $scope.search = search;
        $scope.export = exportResult;
        esec.open = open;

        init();

        function init() {
            CommonService
                .getExperienceOrigin()
                .then(function (response) {
                    esec.originJson = response;
                });

            $scope.verifyStatusArr = [{
                id: 0,
                name: "全部"
            }, {
                id: 1,
                name: "待审核"
            }, {
                id: 2,
                name: "审核通过"
            }, {
                id: 3,
                name: "审核不通过"
            }];
        }

        function search() {
            ExperienceSearchService
                .getExperienceSearchList(getParams())
                .then(function (response) {
                    esec.experienceSearchList = response.data;
                    $scope.totalPage = Math.ceil(response.recordsTotal / $scope.page);
                })
        }

        function exportResult() {
            var params = getExportParams();
            var url = baseUrl + "/file/experience-search/experience-verify-exporting";
            CommonService.downloadFile(url, params);
        }

        function open(obj) {
            ExperienceSearchService
                .getDetail({
                    id: obj.id
                })
                .then(function (response) {
                    var size = 'sm';
                    if (response.data[0].origin == '1') {
                        size = 'md'
                    }
                    CommonService.createModal({
                        'templateUrl': 'experienceDetailModal.html',
                        'controller': 'experienceDetailModalController',
                        'size': size,
                        'resolve': {
                            'response': function () {
                                return response.data[0];
                            }
                        }
                    });
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
                    target: $scope.selectedIndicator ? $scope.selectedIndicator.targetNumber : ""
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
                "keywords": $scope.keywords,
                target: $scope.selectedIndicator ? $scope.selectedIndicator.targetNumber : ""
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
        .controller('experienceImgModalController', experienceImgModalController);

    experienceImgModalController.$inject = ['$scope', '$modalInstance', 'url'];

    function experienceImgModalController($scope, $modalInstance, url) {
        $scope.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss('cancel')
        }

        $scope.imgs = url;
        // var img = new Image();
        //
        // img.src = url;
        //
        // img.onload = function () {
        //     console.log(img.width,img.height)
        //     $('.experience-size .modal-dialog').css({
        //         "width": '300px'
        //     });
        //     $('.experience-size .experience-img').css({
        //         "background": "url(" + url + ")"
        //     });
        // }


    }
})();