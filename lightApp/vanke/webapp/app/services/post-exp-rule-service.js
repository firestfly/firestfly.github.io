'use strict';

VkrmsApp.factory('PostExpRuleService', ['$http', '$q', 'CommonService', 'DataTableService', function ($http, $q, commonService, dataTableService) {

    var factory = {
        getConfiguration: getConfiguration,
        getTemplate: getTemplate,
        initTable: initTable,
        bindEvent: bindEvent,
        openAddDialog: openAddDialog,
        openDeleteDialog: openDeleteDialog,
        getRules: getRules,
        deleteRule: deleteRule,
        addRule: addRule
    };
    return factory;

    function getConfiguration() {
        return {
            "title": "经验值ֵ",
            "tableName": "post-exp-rule-table",
            "api": "post-exp-rule",
            "authorityUrl": "post-exp-rule-authority", //
            "configUrl": "post-exp-rule-config",//
            "dto": "experienceRuleName"
        };
    }

    function getTemplate(id, authorityUrl, configUrl) {
        var template = '<a href="#/' + authorityUrl + '/' + id + '">设置组织范围</a> | ' +
            '<a href="#/' + configUrl + '/' + id + '">设置经验值规则</a> | ' +
            '<a href="javascript:void(0)" class="text-danger" data=' + id + ' type="delete">删除</a>';
        return template;
    }

    function initTable(tableName) {
        var custom = {
            "serverSide": false,
            "columnDefs": [
                {"width": "300px", "targets": -1}
            ]
        };
        return dataTableService.initDataTable(tableName, custom);
    }

    function bindEvent(api, tableName) {
        $('#' + tableName).on('click', 'a[type=delete]', function () {
            var me = $(this),
                id = me.attr('data');
            factory.openDeleteDialog(api, id, me);
        });
    }

    function openAddDialog(api, authorityUrl, configUrl, dto) {
        var newPostExpRuleModal = commonService.createModal({
            'templateUrl': 'newRuleDialog.html',
            'controller': 'NewPostExpRuleController',
            'resolve': {
                'api': function () {
                    return api;
                },
                'dto': function () {
                    return dto;
                }
            }
        });

        newPostExpRuleModal.result.then(function (result) {
            window.dataTable.row.add([result.postExpRule, factory.getTemplate(result.data, authorityUrl, configUrl)]).draw(false);
        }, function (dismiss) {
        });
    }

    function openDeleteDialog(api, id, me) {
        var deletePostExpRuleModal = commonService.createModal({
            'templateUrl': 'deleteRuleDialog.html',
            'controller': 'DeletePostExpRuleController',
            'size': 'sm',
            'resolve': {
                'api': function () {
                    return api;
                },
                'taskRuleId': function () {
                    return id;
                }
            }
        });
        deletePostExpRuleModal.result.then(function (result) {
            window.dataTable.row(me.parents('tr')).remove().draw(false);
        }, function (dismiss) {
        });
    }

    function getRules(api) {
        var data,
            deferred = $q.defer();
        $http.post(apiBaseUrl + '/' + api + "-collect")
            .success(function (postExpRule) {
                data = postExpRule;
                deferred.resolve(data);
            });
        return deferred.promise;
    }

    function deleteRule(api, id) {
        var deferred = $q.defer();
        $http.delete(apiBaseUrl + '/' + api + '/' + id)
            .success(function () {
                deferred.resolve("succeed");
            }).error(function () {
                deferred.reject("failed");
            });
        return deferred.promise;
    }

    function addRule(api, data) {
        var deferred = $q.defer();
        $http.post(apiBaseUrl + '/' + api, data)
            .success(function (result) {
                deferred.resolve(result);
            }).error(function (error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

}]);
