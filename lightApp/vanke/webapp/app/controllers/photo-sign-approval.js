/**
 * Created by ushio on 2017/11/9.
 */
'use strict';

VkrmsApp.controller('PhotoSignApprovalController', ['$scope', '$rootScope', '$filter', '$modal', '$compile', 'CommonService', 'PhotoSignApprovalService', function ($scope, $rootScope, $filter, $modal, $compile, commonService, photoSignApprovalService) {
    $scope.title = "万科资源管理信息系统 - 外盘发薪管理";

    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        isDepartmentSelectpickerMultipe: false
    };
    var isInit = false;
    var init = function () {
        var cacheObj = JSON.parse(sessionStorage['searchState_#/new-attendance'])
        $('input[name=start]').datepicker('setDate', commonService.fmtDate(cacheObj.beginDate, 'yyyy年MM月dd日'));
        $('input[name=end]').datepicker('setDate', commonService.fmtDate(cacheObj.endDate, 'yyyy年MM月dd日'));
        isInit = true;
    }

    var getSearchParams = function () {
        return {
            "length": $scope.page || 10,
            "start": ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                departments: _.pluck($scope.selectedDepartments, 'department_id'),
                workingGroups: _.pluck($scope.selectedGroups, 'work_group_id'),
                standardWorkJobs: _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
                beginDate: commonService.getSelectedDates().beginDate,
                endDate: commonService.getSelectedDates().endDate,
                keywords: $scope.keywords,
            }
        }
    }

    $scope.search = function () {
        if (!isInit) {
            init()
        }
        var params = getSearchParams();
        if (params['search[value]'].beginDate == null || params['search[value]'].endDate == null) {
            commonService.alert({
                content: "日期不能为空",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        photoSignApprovalService.search(params)
            .then(function (result) {
                $scope.listData = result.data;
                $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
            })
    }

    $scope.approval = function (item, status) {
        var content = '确定' + (status ? '通过 ' : '驳回') + item.name + ' 于' + item.signDatetime + '的拍照打卡吗？';
        commonService.confirm({
            content: content,
            size: 'sm',
            icon: "fa-exclamation-circle icon-red",
            callback: function () {
                photoSignApprovalService.approve({
                    employeeId: parseInt(sessionStorage['searchState_employeeId']),
                    id: item.id,
                    status: status
                }).then(function (res) {
                    if (res.status == 'success') {
                        $scope.search();
                    } else {
                        commonService.alert({
                            content: res.errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        })
                    }
                })
            }
        });
    }

    $scope.openImagesModal = function (index, photos) {
        commonService.createModal({
            'templateUrl': 'view-images-modal.html',
            'controller': 'viewImagesModalController',
            'size': 'lg',
            'resolve': {
                'data': function () {
                    return {
                        currentImageIndex: index,
                        photos: photos
                    }
                }
            }
        })
    }
}]).controller('viewImagesModalController', ['$scope', '$http', '$modalInstance', 'CommonService', 'data', function ($scope, $http, $modalInstance, commonService, data) {
    var container = $('#gallery'),
        photos = data.photos,
        current = data.currentImageIndex,
        len = photos.length,
        prev = container.find('.prev'),
        next = container.find('.next');

    $scope.currentImageIndex = current;
    $scope.photos = photos;

    $scope.prev = function () {
        if (current > 0) {
            current--
            $scope.currentImageIndex = current;
            $('.gallery-preview-item').removeClass('active').eq(current).addClass('active');
        }
    },
        $scope.next = function () {
            if (current < len - 1) {
                current++;
                $scope.currentImageIndex = current;
                $('.gallery-preview-item').removeClass('active').eq(current).addClass('active');
            }
        }
    $scope.ok = function () {
        $modalInstance.dismiss();
    };
}]);