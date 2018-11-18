'use strict';
VkrmsApp.factory('PostExpRuleConfigService', ['$http', '$q', 'CommonService', 'DataTableService', function ($http, $q, commonService, dataTableService) {

    return {
        initTable: initTable,
        getPostExpRuleConfig: getPostExpRuleConfig
    };


    function getPostExpRuleConfig(ruleId) {
        var deferred = $q.defer();
        commonService.getStandardWorkJobs().then(function (postExpRuleConfig) {
            var tbData = postExpRuleConfig;
            commonService.httpPost('post-exp-rule/' + ruleId).then(function (data) {
                mergePostExpRuleConfig(tbData, data);
                deferred.resolve(tbData);
            });
        });
        return deferred.promise;
    }

    function initTable(tableName, config) {
        dataTableService.initDataTable(tableName, config);
    }

    function mergePostExpRuleConfig(dest, src) {
        var _dest, _src;
        for (var i = 0, len = dest.length; i < len; i++) {
            _dest = dest[i];
            for (var j = 0; j < src.length; j++) {
                _src = src[j];
                if (_src.postId != _dest.workJobId) {
                    _dest.postExperienceId = null;
                    _dest.postStatus = 0;
                } else {
                    _dest.postExperienceId = _src.postExperienceId;
                    _dest.postStatus = _src.postStatus;
                    break;
                }
                _dest.postId = _dest.workJobId
            }
        }
    }
}]);