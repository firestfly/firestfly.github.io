'use strict';

VkrmsApp.factory('TaskRuleService', ['$http', '$q', 'CommonService', 'DataTableService', function ($http, $q, commonService, dataTableService) {
    var factory = {
        getConfigurationByType: function (path) {
            var config = {
                    "point": {
                        "title": "积分",
                        "tableName": "task-rules-table",
                        "api": "task-rules",
                        "authorityUrl": "task-point-rules-authority",
                        "configUrl": "task-point-rules-config",
                        "dto": "taskRuleName"
                    },
                    "incentive": {
                        "title": "提成",
                        "tableName": "job-rules-table",
                        "api": "job-rules",
                        "authorityUrl": "job-incentive-rules-authority",
                        "configUrl": "job-incentive-rules-config",
                        "dto": "jobRuleName"
                    }
                },
                type = path.indexOf("point") > 0 ? "point" : "incentive";

            return config[type];
        },
        getTemplate: function (id, authorityUrl, configUrl) {
            var template = '<a href="#/' + authorityUrl + '?id=' + id + '">设置组织范围</a> | ' +
                '<a href="#/' + configUrl + '?id=' + id + '">设置提成规则</a> | ' +
                '<a href="javascript:void(0)" class="text-danger" data=' + id + ' type="delete">删除</a>';
            return template;
        },
        initTable: function (tableName) {
            var custom = {
                "serverSide": false,
                "columnDefs": [
                    {"width": "300px", "targets": -1}
                ]
            };
            dataTableService.initDataTable(tableName, custom);
        },
        bindEvent: function (api, tableName) {
            $('#' + tableName).on('click', 'a[type=delete]', function () {
                var me = $(this),
                    id = me.attr('data');
                factory.openDeleteDialog(api, id, me);
            });
        },
        openAddDialog: function (api, authorityUrl, configUrl, dto) {
            var newTaskRuleModal = commonService.createModal({
                'templateUrl': 'newRuleDialog.html',
                'controller': 'NewRuleController',
                'resolve': {
                    'api': function () {
                        return api;
                    },
                    'dto': function () {
                        return dto;
                    }
                }
            });

            newTaskRuleModal.result.then(function (taskRule) {
                window.dataTable.row.add([taskRule.name, factory.getTemplate(taskRule.id, authorityUrl, configUrl)]).draw(false);
            }, function (dismiss) {
            });
        },
        openDeleteDialog: function (api, id, me) {
            var deleteTaskRuleModal = commonService.createModal({
                'templateUrl': 'deleteRuleDialog.html',
                'controller': 'DeleteRuleController',
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

            deleteTaskRuleModal.result.then(function (result) {
                window.dataTable.row(me.parents('tr')).remove().draw(false);
            }, function (dismiss) {
            });
        },
        getRules: function (api) {
            var data,
                deferred = $q.defer();
            $http.get(apiBaseUrl + '/' + api)
                .success(function (taskRules) {
                    data = taskRules;
                    deferred.resolve(data);
                });
            return deferred.promise;
        },
        deleteRule: function (api, id) {
            var deferred = $q.defer();
            $http.delete(apiBaseUrl + '/' + api + '/' + id)
                .success(function () {
                    deferred.resolve("succeed");
                }).error(function () {
                    deferred.reject("failed");
                });
            return deferred.promise;
        },
        addRule: function (api, data) {
            var deferred = $q.defer();
            $http.post(apiBaseUrl + '/' + api, data)
                .success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        getTaskRule: function (ruleId) {
            if (ruleId) {
                var deferred = $q.defer();

                $http.get(apiBaseUrl + '/task-rules/-').success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        },
        updateTaskRuleAppliedADepartment: function (ruleId, data) {
            if (ruleId) {
                var deferred = $q.defer();

                $http.post(apiBaseUrl + '/task-rules/' + ruleId + '/applied-department', data).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        },
        getJobRule: function (ruleId) {
            if (ruleId) {
                var deferred = $q.defer();

                $http.get(apiBaseUrl + '/job-rules/-').success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        },
        updateJobRuleAppliedADepartment: function (ruleId, data) {
            if (ruleId) {
                var deferred = $q.defer();

                $http.post(apiBaseUrl + '/job-rules/' + ruleId + '/applied-department', data).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        }
    };
    return factory;
}]);
