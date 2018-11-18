'use strict';
VkrmsApp.controller('PostExpRuleConfigController', ['$scope', '$http', '$location', 'CommonService', 'DataTableService', 'PostExpRuleConfigService', "$routeParams", function ($scope, $http, $location, commonService, dataTableService, PostExpRuleConfigService, routeParams) {
    var tableName = "post-exp-rule-config-table",
        experienceRuleId = routeParams.experienceRuleId;

    $scope.clear = clear;
    $scope.search = searchPostExpRuleConfigData;
    $scope.searchFromEnterKey = searchFromEnterKey;

    init();
    getPostExpRuleConfigData();

    function init() {
        $scope.title = "万科资源管理信息系统 - 职位经验值规则设置";
        commonService.applySearchStatus($scope);
    }

    function searchFromEnterKey(e) {
        if (e.keyCode === 13) {
            $scope.search();
        }
    }
    function getPostExpRuleConfigData() {
        PostExpRuleConfigService.getPostExpRuleConfig(experienceRuleId).then(function (rules) {
            var config = {
                "serverSide": false,
                "data": rules,
                "columns": [
                    {data: 'workJobName'},
                    {data: 'postStatus'},
                    {data: null}
                ],
                "columnDefs": [{
                    "targets": -1,
                    "data": null,
                    "render": function (data, type, row) {
                        var postId = row.workJobId;
                        var postExperienceId = row.postExperienceId || -1;
                        return '<a href="#/post-exp-config/' + experienceRuleId + '/' + postId + '/' + postExperienceId + '" type="setting">设置</a>';
                    }
                }, {
                    "targets": 1,
                    "render": function (data) {
                        if (data == 1) {
                            return "已设置";
                        } else {
                            return "未设置"
                        }
                    }
                }
                ]
            }
            PostExpRuleConfigService.initTable(tableName, config);
        });
    }

    function clear() {
        $scope.searchInputValue = "";
        dataTableService.dataTableSearchByColumn(tableName, 0, "");
    };
    function searchPostExpRuleConfigData() {
        dataTableService.dataTableSearchByColumn(tableName, 0, $scope.searchInputValue);
        commonService.storageSearchStatus($scope, {
            searchInputValue: $scope.searchInputValue
        })
    };
}]);
/**
 * Created by huangzw02 on 2016/5/27.
 */
