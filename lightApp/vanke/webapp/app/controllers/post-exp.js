'use strict';

VkrmsApp.controller('PostExpController', ['$scope', 'PostExpService', 'CommonService', '$routeParams', function ($scope, postExpService, commonService, $routeParams) {

    var editStatus = false,
        experienceRuleId = $routeParams.experienceRuleId,
        postId = $routeParams.postId,
        postExperienceId = $routeParams.postExperienceId,
        delLevels = [];

    $scope.addLevel = addLevel;
    $scope.checkLevelName = checkLevelName;
    $scope.checkExperienceValue = checkExperienceValue;
    $scope.submitLevels = submitLevels;
    $scope.editLevel = editLevel;
    $scope.saveLevels = saveLevels;
    $scope.cancel = cancel;

    init();

    getPostExp();

    function init() {
        $scope.title = "万科资源管理信息系统 - 级别经验值设置";
        $scope.levels = [];
        $scope.cycleIncreasement = '';
    }

    function getPostExp() {
        if (postExperienceId != '-1') {
            var requestParam = {
                experienceRuleId: experienceRuleId,
                postId: postId,
                postExperienceId: postExperienceId
            };

            postExpService.getPostExp(requestParam).then(function (result) {
                    $scope.levels = result.levels;
                    $scope.cycleIncreasement = result.cycleIncreasement;
                    sortLevelSequence();
                }
            );
        }
    }

    function addLevel() {
        if ($scope.inserted) {
            return;
        }

        if (editStatus) {
            commonService.alert({
                content: "请先保存修改",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }

        $scope.inserted = {
            levelName: '',
            experienceValueBegin: '',
            experienceValueEnd: ''
        };

        $scope.levels.push($scope.inserted);

        editStatus = true;
    }

    function checkLevelName(data) {
        if (!data) {
            return "级别名不能为空";
        }
        if (data.length > 20) {
            return "级别名长度最多为20"
        }
    }

    function checkExperienceValue(data) {
        if (data === undefined || data === "") {
            return "经验值不能为空";
        }
    }

    function editLevel(rowform) {
        editStatus = true;
        if ($scope.inserted != null) {
            rowform.$cancel();
            commonService.alert({
                content: "请先保存新增级别",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        }
    }

    function saveLevels(index, data) {
        if (data.experienceValueEnd <= data.experienceValueBegin) {
            commonService.alert({
                content: "经验值下限必须大于经验值上限",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return "error";
        } else {
            $scope.levels[index].experienceValueBegin = parseFloat(data.experienceValueBegin).toFixed(2);
            $scope.levels[index].experienceValueEnd = parseFloat(data.experienceValueEnd).toFixed(2);
            editStatus = false;
            $scope.inserted = null;
            //$scope.$apply();
        }

    }

    $scope.removeTempLevel = function () {
        var index = $scope.levels.indexOf($scope.inserted);
        if (index >= 0) {
            $scope.levels.splice(index, 1);
        }
        $scope.inserted = null;
        editStatus = false;
    };


    $scope.removeLevel = function (index, levelId) {
        var config = {
            "title": "删除提示",
            "icon": "fa-exclamation-circle",
            "content": "您确认删除此条级别设置吗？",
            "callback": function () {
                if (levelId != undefined) {
                    delLevels.push($scope.levels.splice(index, 1)[0]);
                } else {
                    $scope.levels.splice(index, 1);
                }
            }
        };
        commonService.confirm(config);
    };

    function submitLevels() {
        var levelsForSubmit = [],
            levels = $scope.levels;

        var requestParam = {
            experienceRuleId: experienceRuleId,
            postExperienceId: postExperienceId,
            postId: postId,
            cycleIncreasement: $scope.cycleIncreasement,
            levels: levelsForSubmit
        };

        if (editStatus) {
            commonService.alert({
                content: "请先保存级别的修改",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }

        if ($scope.cycleIncreasement == '') {
            commonService.alert({
                content: "请输入30天累计值",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }

        if (!checkLevelSequence()) {
            commonService.alert({
                content: "低级别上限值必须等于高一级别的下限值",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }

        if (postExperienceId == '-1') {
            requestParam.postExperienceId = null;
            requestParam.levels = levels;

            postExpService.createPostExp(requestParam).then(function (result) {
                var resultId = result.data.id;
                var resultLevels = result.data.experienceLevelList;

                commonService.alert({
                    'content': '保存成功',
                    'icon': 'fa-exclamation-circle'
                });
                postExperienceId = resultId;
                $scope.levels = [];
                for (var len = resultLevels.length; len--;) {
                    $scope.levels.push({
                        levelId: resultLevels[len].id,
                        levelName: resultLevels[len].levelName,
                        experienceValueBegin: resultLevels[len].experienceValueBegin,
                        experienceValueEnd: resultLevels[len].experienceValueEnd
                    })
                }

                sortLevelSequence();
            });
        } else {
            for (var len = levels.length; len--;) {
                levels[len].deleteFlag = 0;
                levelsForSubmit.push(levels[len]);
            }
            if (delLevels && delLevels.length > 0) {
                for (var len = delLevels.length; len--;) {
                    delLevels[len].deleteFlag = 1;
                    levelsForSubmit.push(delLevels[len]);
                }
            }

            requestParam.levels = levelsForSubmit;

            postExpService.updatePostExp(requestParam).then(function (result) {
                commonService.alert({
                    'content': '保存成功',
                    'icon': 'fa-exclamation-circle'
                });
            });
        }
    }

    function checkLevelSequence() {
        sortLevelSequence();

        var levels = $scope.levels;
        var curEndValue, nextBeginValue;

        for (var index = 0, len = levels.length; index < len; index++) {
            if (len - index >= 2) {
                curEndValue = parseFloat(levels[index].experienceValueEnd);
                nextBeginValue = parseFloat(levels[index + 1].experienceValueBegin);
                if (curEndValue != nextBeginValue) {
                    return false;
                }
            }
        }

        return true;
    }

    function sortLevelSequence() {
        $scope.levels.sort(function (obj1, obj2) {
            return parseFloat(obj1.experienceValueBegin) - parseFloat(obj2.experienceValueBegin);
        });
    }

    function cancel() {
        window.history.back()
    }

}]);
