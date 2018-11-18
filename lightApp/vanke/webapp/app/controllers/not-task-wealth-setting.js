'use strict';

VkrmsApp.controller('NotTaskWealthSettingController', ['$scope', '$filter', '$routeParams', '$http', '$timeout', 'CommonService', 'NotTaskWealthService', function ($scope, $filter, $routeParams, $http, $timeout, commonService, notTaskWealthService) {
    $scope.title = "万科资源管理信息系统 - 非任务财富值设置";
    $scope.editeMultiple = editeMultiple;
    $scope.search = search;
    $scope.action = action;
    $scope.savePost = savePost;
    $scope.chk = chk;
    $scope.all = all;

    $scope.paginationConfig = {
        pageOptions: [10, 20, 30]
    };

    function getSearchParams() {
        var searchInfo = {
            departments: _.pluck($scope.selectedDepartments, 'department_id'),
            notTaskWealthType: $scope.selectedTaskWealthType
        };
        return {
            length: $scope.page,
            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            'search[value]': searchInfo
        }
    }

    function search() {
        commonService.getTaskWealthType().then(function (result) {
            $scope.notTaskWealthTypeChange = result;
        })
        notTaskWealthService.getNotTaskWealthSetting(getSearchParams()).then(function (result) {
            $scope.master = false;
            $scope.selected = false;
            $scope.isReg = false;

            $scope.notTaskWealthSetting = result.data;
            $scope.selectedArray = $scope.notTaskWealthSetting;
            $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page) || 1;
        });
    }


    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false
    };
    function action() {
        var params = []
        angular.forEach($scope.selectedArray, function (obj) {
            if (obj.isFlag == true) {
                obj.standardWealthValue = $scope.modeWealthValue;
                params.push(obj);
            }
        });
        savePost(params)
        $('#myModal').modal('hide');
    }

    function savePost(value, index) {
        if (arguments.length == 2) {
            var data = [];
            var params = $scope.selectedArray[index]
            angular.extend(params, value)
            data.push(params)
        } else {
            var data = value;
        }

        $http.post(apiBaseUrl + '/not-task-wealth/settings', data, {
            headers: utils.generateHeaders()
        }).success(function (result) {
            if (result.status == 'fail') {
                commonService.alert({'content': result.errorMessage, 'icon': 'fa-exclamation-circle'});
            } else {
                search()
            }
        }).error(function (data, status, headers, config) {
            commonService.alert({'content': '保存失败，请重新刷新页面.', 'icon': 'fa-exclamation-circle'});

        });
    }

    function all(state, item) {
        if (state) {
            $scope.selected = false;
            angular.forEach($scope.selectedArray, function (obj) {
                obj.isFlag = false;
            });
        } else {
            $scope.selected = true;
            angular.forEach($scope.selectedArray, function (obj) {
                obj.isFlag = true;
            });
        }
    }

    function chk(index, state) {
        $scope.selectedArray[index].isFlag = state.target.checked;
    }

    function editeMultiple() {
        var flag = false;
        angular.forEach($scope.selectedArray, function (obj) {
            if (obj.isFlag == true) {
                flag = true;
            }
        });
        if (!flag) {
            commonService.alert({
                content: '请选择项目修改!',
                icon: 'fa-exclamation-circle'
            });
            return false;
        }
        $scope.modeWealthValue = null;
        $('#myModal').modal();
    }

    $scope.checkName = function (data) {
        var reg = /^\d+(\.\d{1,2})?$/;
        if (!reg.test(data)) {
            return "最多支持2位小数点!";
        } else {
            if (data > 1000) {
                return "最大数值不能大于1000!";
            }
        }
    }

    $scope.validateWealth = function (item) {
        var reg = /^\d+(\.\d{1,2})?$/;
        if (!reg.test(item)) {
            $scope.isReg = false;
        } else {
            if (item > 1000) {
                $scope.isReg = false;
            } else {
                $scope.isReg = true;
            }
        }
    }

}]);