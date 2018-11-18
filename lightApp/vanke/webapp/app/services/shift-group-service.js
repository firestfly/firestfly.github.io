'use strict';

VkrmsApp.factory('ShiftGroupService', ['$http', '$q', 'CommonService', 'DataTableService', function ($http, $q, commonService, dataTableService) {

    var factory = {
        getConfiguration: getConfiguration,
        getTemplate: getTemplate,
        initTable: initTable,
        bindEvent: bindEvent,
        openAddDialog: openAddDialog,
        openDeleteDialog: openDeleteDialog,
        getShiftGroup: getShiftGroup,
        deleteShiftGroup: deleteShiftGroup,
        addShiftGroup: addShiftGroup
    };
    return factory;

    function getConfiguration() {
        return {
            "title": "经验值ֵ",
            "tableName": "shift-group-table",
            "api": "shift-group",
            "authorityUrl": "shift-group-authority", //
            "configUrl": "shifts-config",//
            "dto": "shiftGroupName"
        };
    }

    function getTemplate(id, authorityUrl, configUrl) {
        var template = '<a href="#/' + authorityUrl + '/' + id + '">设置班次组范围</a> | ' +
            '<a href="#/' + configUrl + '/' + id + '">设置班次组</a> | ' +
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
        var newShiftGroupModal = commonService.createModal({
            'templateUrl': 'newRuleDialog.html',
            'controller': 'NewShiftsGroupController',
            'resolve': {
                'api': function () {
                    return api;
                },
                'dto': function () {
                    return dto;
                }
            }
        });

        newShiftGroupModal.result.then(function (result) {
            if (result.status == 'success') {
                window.dataTable.row.add([result.shiftGroup, factory.getTemplate(result.data, authorityUrl, configUrl)]).draw(false);
            } else {
                commonService.alert({'content': result.errorMessage, 'icon': 'fa-exclamation-circle'});
            }
        }, function (dismiss) {
        });
    }

    function openDeleteDialog(api, id, me) {
        var deleteShiftGroupModal = commonService.createModal({
            'templateUrl': 'deleteRuleDialog.html',
            'controller': 'DeleteShiftsGroupController',
            'size': 'sm',
            'resolve': {
                'api': function () {
                    return api;
                },
                'shiftGroupId': function () {
                    return id;
                }
            }
        });
        deleteShiftGroupModal.result.then(function (result) {
            window.dataTable.row(me.parents('tr')).remove().draw(false);
        }, function (dismiss) {
        });
    }

    function getShiftGroup(api) {
        var data,
            deferred = $q.defer();
        $http.post(apiBaseUrl + '/' + api + "-collect")
            .success(function (shiftGroup) {
                data = shiftGroup;
                deferred.resolve(data);
            });
        return deferred.promise;
    }

    function deleteShiftGroup(api, id) {
        var deferred = $q.defer();
        $http.delete(apiBaseUrl + '/' + api + '/' + id)
            .success(function () {
                deferred.resolve("succeed");
            }).error(function () {
                deferred.reject("failed");
            });
        return deferred.promise;
    }

    function addShiftGroup(api, data) {
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
