'use strict';

VkrmsApp.factory('TaskRuleAuthConfig', ['TaskRuleService', 'CommonService', function (taskRuleService, commonService) {
    return {
        saveTaskRuleAuthConfig: function (id, data) {
            if (id && data) {
                taskRuleService.updateTaskRuleAppliedADepartment(id, data).then(
                    function () {
                        commonService.alert({
                            content: "保存成功",
                            icon: "fa-exclamation-circle"
                        });
                    }
                );
            }
        },
        saveJobRuleAuthConfig: function (id, data) {
            if (id && data) {
                taskRuleService.updateJobRuleAppliedADepartment(id, data).then(
                    function () {
                        commonService.alert({
                            content: "保存成功",
                            icon: "fa-check-circle"
                        });
                    }
                );
            }
        }
    }
}]);