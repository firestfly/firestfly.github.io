'use strict';

VkrmsApp.controller('ExperienceSettingController', ['$scope', '$timeout', 'ExperienceSettingsService', 'CommonService', function ($scope, $timeout, ess, commonService) {
    $scope.title = "万科资源管理信息系统 - 经验值设置";
    $(".selectpicker").selectpicker();

    $scope.editeExperienceSetting = editeExperienceSetting;
    $scope.saveExperienceSetting = saveExperienceSetting;
    $scope.search = search;
    $scope.symbols = [{text: "+", value: "+"}, {text: "-", value: "-"}];

    initSelectpicker();

    function initSelectpicker() {
        ess.getPost().then(function (result) {
            result && result.sort(function (a, b) {
                return a.workJobName.localeCompare(b.workJobName);
            });
            $scope.standardPost = result || [];
            refreshSelect("#select-standard-post");
            $scope.$broadcast("selectpicker-loaded");
        });
        $("#select-standard-post").on("hidden.bs.select", function () {
            var params = {
                standardWorkJobs: _.pluck($scope.selectedStandardPost, "workJobId")
            };
            if (params.standardWorkJobs.length) {
                ess.getTargetName(params).then(function (result) {
                    $scope.targets = result;

                    $scope.selectedSituation = null;
                    $scope.situation = [];
                    refreshSelect("#select-situation, #select-target");
                });
            } else {
                $timeout(function () {
                    $scope.targets = [];
                    $scope.selectedTarget = null;
                    $scope.selectedSituation = null;
                    $scope.situation = [];
                    refreshSelect("#select-situation, #select-target");
                }, 0);
            }
        });
        $("#select-target").on("hidden.bs.select", function () {
            var params = {
                targetNumber: _.pluck($scope.selectedTarget, "targetNumber")
            };
            if (params.targetNumber.length) {
                ess.getSituation(params).then(function (result) {
                    $scope.situation = result;
                    $scope.selectedSituation = null;
                    refreshSelect("#select-situation");
                });
            } else {
                $timeout(function () {
                    $scope.situation = [];
                    $scope.selectedSituation = null;
                    refreshSelect("#select-situation");
                }, 0);
            }
        });
    }

    function getSearchParams() {
        return {
            length: $scope.page,
            start: ($scope.currentPage - 1) * $scope.page > 0 ? ($scope.currentPage - 1) * $scope.page : 0,
            "search[value]": {
                situationIds: _.pluck($scope.selectedSituation, 'situationId')
            }
        }
    }

    function search(isFromBtn) {
        $scope.isEdite = false;
        if ($scope.selectedSituation && $scope.selectedSituation.length) {
            commonService.getExperienceOrigin().then(function (result) {
                $scope.experienceOrigin = result;
                ess.getExperienceSetting(getSearchParams()).then(function (result) {
                    $scope.experienceSetting = result.data;
                    $scope.totalPage = Math.ceil(result.recordsTotal / $scope.page);
                    $scope.noData = !result.data.length;
                });
            });
        } else {
            $scope.experienceSetting = null;
            isFromBtn && commonService.alert({
                content: "请选择情况后查询！"
            })
        }

    }

    function refreshSelect(selector) {
        $timeout(function () {
            $(selector).selectpicker("refresh");
        }, 0);
    }

    function editeExperienceSetting(rowform) {
        if (!$scope.isEdite) {
            rowform.$show();
        }
        $scope.isEdite = true;
    }

    function saveExperienceSetting(data, id) {
        $timeout(function () {
            var params = {
                id: id,
                symbol: data.symbol,
                expValue: data.expValue
            };
            ess.saveExperienceSetting(params).then(function () {
                $scope.isEdite = false;
                search();
            });
        }, 100);
    }

    $scope.removeTempRule = function () {
        $scope.isEdite = false;
    };
    $scope.checkSymbol = function (data) {
        if (!data) {
            return "符号不能为空!";
        }
    };
    $scope.checkExpValue = function (data) {
        if (data != 0 && (!data || isNaN(+data))) {
            return "经验值输入有误!";
        } else {
            if (data > 10000) {
                return "经验值不能大于10000!";
            }
            var lastStr = data.toString().split(".")[1];
            if (lastStr && lastStr.length > 2) {
                return "经验值只保留小数点后2位!";
            }
        }
    };

}]);
