/**
 * Created by wangq34 on 2016/5/31.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('ExperienceRulesetController', ExperienceRulesetController)
        .filter('dateStringFormatToMMhh', dateStringFormatToMMhh);

    ExperienceRulesetController.$inject = ['$scope', 'CommonService', 'ExperienceRulesetService'];

    function ExperienceRulesetController($scope, commonService, experienceRulesetService) {
        var er = this;

        er.title = "万科资源管理信息系统 - 排班要求设置";
        er.searchRules = searchRules;
        er.addRule = addRule;
        er.saveRule = saveRule;
        er.removeRule = removeRule;
        er.removeTempRule = removeTempRule;

        er.shiftLabelValueChange = shiftLabelValueChange;
        er.checkExperience = checkExperience;
        er.isEditing = isEditing;
        $scope.commonSearchBarConfig = {
            isCompanySelectpickerMultiple: false,
            isDepartmentSelectpickerMultipe: false
        };

        $scope.search = search;

        init();

        function getDepartId() {
            var dpid = _.pluck($scope.selectedDepartments, 'department_id');
            if (!dpid.length) {
                return false;
            } else {
                return dpid[0]
            }
        }

        function search() {
            var dpid = getDepartId();
            if (dpid === false) {
                return;
            }
            er.isEditingState = false;
            er.inserted = null;
            var promise = experienceRulesetService.getFixedPostCollection(dpid);
            promise.then(function (response) {
                er.shifts = response.shifts;
                er.shiftOptions = response.shifts;
                er.fixedPostOptions = response.fixedPosts;
                er.fixedPostsAndShiftRules = response.fixedPostsAndShift;
            });
            commonService.storageSearchStatus($scope, {
                selectedCompanies: $scope.selectedCompanies,
                selectedDepartments: $scope.selectedDepartments,
                departments: $scope.departments
            });
        }

        function init() {
            $scope.$on('selectpicker-loaded', search);
            er.isEditingState = false;
        }

        function isEditing() {
            er.isEditingState = true;
        }

        function shiftLabelValueChange(selectedObj, fixedPostsAndShiftRule) {
            angular.forEach(er.shiftOptions, function (shiftOption) {
                if (shiftOption.id == selectedObj.$data) {
                    fixedPostsAndShiftRule.onDutyTime = shiftOption.onDutyTime;
                    fixedPostsAndShiftRule.offDutyTime = shiftOption.offDutyTime;
                }
            });

        }

        function checkOverlapping(inputObj, fixedPostExpId) {
            var reuslt = false;
            angular.forEach(er.fixedPostsAndShiftRules, function (fixedPostsAndShiftRule) {
                if (fixedPostExpId != fixedPostsAndShiftRule.fixedPostExpId) {
                    if (fixedPostsAndShiftRule.shiftId == inputObj.shiftId && fixedPostsAndShiftRule.fixedPostId == inputObj.fixedPostId) {
                        commonService.alert({
                            'content': '职位，班次重复，请重新输入',
                            'icon': 'fa-exclamation-circle'
                        });
                        reuslt = true;
                    }
                }
            });
            return reuslt;
        }

        function checkExperience(data) {
            var reg = new RegExp(/^(-)?[\d]{0,8}(\.?[\d]{1,2})?$/);
            if (!reg.test(data)) {
                return "经验值输入有误";
            }

        }

        function addRule() {
            if (er.inserted) {
                return;
            }

            er.inserted = {
                fixedPostId: null,
                shiftId: '0',
                experience: null
            };
            er.fixedPostsAndShiftRules.push(er.inserted);

        }

        function searchRules() {
            var dpid = getDepartId();
            if (dpid === false) {
                return;
            }
            var keywords = er.keywords != undefined ? er.keywords : "";
            var promise = experienceRulesetService.getFixedPostCollection(dpid);
            promise.then(function (response) {
                if (response.fixedPostsAndShift) {
                    er.fixedPostsAndShiftRules = $.grep(response.fixedPostsAndShift, function (fixedPostsAndShiftRule) {
                        return fixedPostsAndShiftRule.fixedPostName.indexOf(keywords.trim()) > -1;
                    });
                }
            });

        }

        function saveRule(activeForm, fixedPostsAndShiftRule, formData) {
            if (checkOverlapping(formData, fixedPostsAndShiftRule.fixedPostExpId)) {
                return "error";
            }
            var dpid = getDepartId();
            if (dpid === false) {
                return;
            }
            if (er.inserted) {
                //新增
                angular.extend(fixedPostsAndShiftRule, {
                    departmentId: dpid,
                    fixedPostName: null,
                    shiftLabel: null
                });
                experienceRulesetService.addRulesetToSave(fixedPostsAndShiftRule)
                    .then(function (response) {
                        if (response.status == "fail") {
                            commonService.alert({
                                'content': response.errorMessage,
                                'icon': 'fa-exclamation-circle',
                                'iconColor': "icon-red"
                            });
                            activeForm.rowform.$show();
                            return "保存失败";
                        }
                        er.inserted = null;
                        searchRules();
                    })
                    .then(null, function () {
                        commonService.alert({
                            'content': '保存失败，请重新刷新页面.',
                            'icon': 'fa-exclamation-circle'
                        });
                    });
            } else {
                angular.extend(fixedPostsAndShiftRule, {
                    fixedPostName: null,
                    shiftLabel: null
                });
                //修改
                experienceRulesetService.updateRulesetToSave(fixedPostsAndShiftRule)
                    .then(function (response) {
                        if (response.status == "fail") {
                            commonService.alert({
                                'content': response.errorMessage,
                                'icon': 'fa-exclamation-circle',
                                'iconColor': "icon-red"
                            });
                            activeForm.rowform.$show();
                            return "保存失败";
                        }
                    });
                er.isEditingState = false;
            }

        }

        function removeRule(index, fixedPostsAndShiftRule) {
            var config = {
                "title": "删除提示",
                "icon": "fa-exclamation-circle",
                "content": "您确认删除此条排班要求吗？",
                "callback": function () {
                    er.fixedPostsAndShiftRules.splice(index, 1);
                    experienceRulesetService.deleteRuleset(fixedPostsAndShiftRule);
                    er.isEditingState = false;
                }
            };
            commonService.confirm(config);
        }

        function removeTempRule() {
            if (er.inserted) {
                er.fixedPostsAndShiftRules.pop();
                er.inserted = null;
            }

            er.isEditingState = false;
        }
    }

    //"HH:mm:ss" TO "HH:mm"
    function dateStringFormatToMMhh() {
        return function (input) {
            var out = "";
            if (input) {
                var arr = input.split(':');
                out = arr[0] + ":" + arr[1];
            }
            return out;
        }
    }
})();

