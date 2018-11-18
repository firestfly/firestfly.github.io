'use strict';

VkrmsApp.controller('NotTaskWealthController', ['$scope', '$filter', 'DataTableService', 'CommonService', 'NotTaskWealthService', function ($scope, $filter, dataTableService, commonService, notTaskWealthService) {
    $scope.title = "万科资源管理信息系统 - 非任务财富值查看";
    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false
    };

    $scope.search = search;
    $scope.extend = extend;
    $scope.isFromWealth = location.hash.indexOf("not-task-wealth-employee") >= 0;
    if (location.hash.indexOf("not-task-wealth-employee") >= 0) {
        $scope.extendButton = 'false|录入|vk-btn-default';
    } else {
        $scope.extendButton = 'true|录入|vk-btn-default';
    }
    $scope.$on('selectpicker-loaded', function () {
        commonService.getTaskWealthType().then(function (notTaskWealthType) {
            var config = {
                "ajax": {
                    "url": "not-task-wealth",
                    "type": "POST",
                    "headers": utils.generateHeaders()
                },
                "columns": [
                    {data: "id"},
                    {data: "name"},
                    {data: "job"},
                    {data: "wealthValue"},
                    {data: "beginDateTime"},
                    {data: "endDateTime"},
                    {data: "duration"},
                    {data: "notTaskWealthType"},
                    {data: "standardWealthValue"},
                    {data: "employeeId"},
                    {data: "sapId"},
                    {data: "company"},
                    {data: "department"},
                    {data: "jobStatus"},
                    {data: "isConvert"}
                ],
                "columnDefs": [
                    {
                        "targets": 0,
                        "visible": false
                    },
                    {
                        "targets": 7,
                        "render": function (data) {
                            return (data && notTaskWealthType[data]) || "-";
                        }
                    },
                    {
                        "targets": -1,
                        "render": function (data, type, row) {
                            if (data == 1) {
                                return '<a class="link isCovered">删除</a>';
                            } else {
                                return '<button class="link covered" data-id="' + row["id"] + '" data-name="' + row["name"] + '" data-wealth-value="' + row["wealthValue"] + '">删除</button>';
                            }
                        }
                    }
                ],
                scrollX: true
            };
            if ($scope.isFromWealth) {
                config.stateSave = false;
                $scope.$parent.backBtnHref = "#/wealth-convert-rule-detail";
            }
            dataTableService.initDataTable("notTaskWealth", config, getSearchParams());
        });
        delNotTaskWealth();
    });

    function delNotTaskWealth() {
        $("#notTaskWealth").on("click", ".isCovered", function () {
            var id = $(this).data("id");
            var name = $(this).data("name");
            var wealthValue = $(this).data("wealthValue");
            var content = "该数据已定案，不能删除";
            var config = {
                "title": "删除提示",
                "icon": "fa-exclamation-circle",
                "content": content
            };
            commonService.alert(config);
        })
        $("#notTaskWealth").on("click", ".covered", function () {
            var id = $(this).data("id");
            var name = $(this).data("name");
            var wealthValue = $(this).data("wealthValue");
            var content = "确定删除" + name + "的财富值数据?";
            var config = {
                "title": "删除提示",
                "icon": "fa-exclamation-circle",
                "content": content,
                "callback": function () {
                    notTaskWealthService.delNotTaskWealth(id).then(function () {
                        search();
                    });
                }
            };
            commonService.confirm(config);
        });
    }

    function getSearchParams() {
        var selectedDates = commonService.getSelectedDates();
        if (!selectedDates.beginDate || !selectedDates.endDate) {
            return false;
        }
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId')
        };
        if ($scope.isFromWealth) {
            data["flag"] = "intersection";
        }
        return data;
    }

    function search() {
        var selectedDates = commonService.getSelectedDates();
        if (!selectedDates.beginDate || !selectedDates.endDate) {
            commonService.alert({
                content: "请选择开始时间和结束时间",
                icon: "fa-exclamation-circle"
            });
            return false;
        }
        dataTableService.dataTableSearch("notTaskWealth", getSearchParams());
        commonService.storageSearchStatus($scope);
    }

    function extend() {
        location.href = '#/not-task-wealth/input';
    }
}]);