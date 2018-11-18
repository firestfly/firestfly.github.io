'use strict';

VkrmsApp.controller('TaskPointViewController', ['$scope', '$http', 'DataTableService', 'CommonService', 'TaskPointViewService', '$q', '$timeout', '$rootScope', function ($scope, $http, dataTableService, commonService, taskPointViewService, $q, $timeout, $rootScope) {
    $scope.title = "万科资源管理信息系统 - 考勤结果";

    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        companySelecterLabel: "公司范围",
        departmentSelecterLabel: "部门/项目",
        workgroupSelecterLabel: "岗位专业分类"
    };

    var arr = ["有效", "重复", "无效"];

    $scope.scheduleDatepickerPlaceholderFrom = "计算时间从";
    $scope.scheduleDatepickerPlaceholderTo = "到";
    $scope.taskStatusBtn = "标记为无效";
    //workJobId
    var allowedArr = ['1', '2', '3', '4', '50355972', '50395150', '50400982', '50401291', '50439623'];
    //employeeId 1000000059何瑾、1000056908易若望
    var allowedEmployeeId = ['1000000059', '1000056908'];
    $scope.showRadio = sessionStorage['isSuperUser'] || allowedArr.indexOf(sessionStorage["searchState_loginUser"]) > -1 || allowedEmployeeId.indexOf(sessionStorage["searchState_employeeId"]) > -1;

    $scope.isFromWealth = location.hash.indexOf("task-point-view-employee") >= 0;
    var config = {
        "ajax": {
            "url": "task-point-view",
            "type": "POST",
            "headers": utils.generateHeaders()
        },
        "columns": [
            {},
            {data: "name"},
            {data: "totalWealth"},
            {data: "taskType"},
            {data: "lastLevelTaskType"},
            {data: "taskNumber"},
            {data: "taskStatus"},
            {data: "finishDate"},
            {data: "calculateDate"},
            {data: "rate"},
            {data: "rateRatio"},
            {data: "ratioDate"},
            {data: "isCharge"},
            {data: "chargeNumber"},
            {data: "chargeAmount"},
            {data: "houseName"},
            {data: "shareRatio"},
            {data: "standardHours"},
            {data: "wealthRatio"},
            {data: "chargeRatio"},
            {data: "taskAdjustmentRatio"},
            {data: "description"},
            {data: "company"},
            {data: "department"},
            {data: "workGroup"},
            {data: "standardJob"},
            {data: "sapId"},
            {data: "resourceId"},
            {data: "houseCode"}
        ],
        "columnDefs": [
            {
                "targets": [0],
                "render": function () {
                    return "<div><input type='radio' name='radio'/></div>";
                }

            },
            {
                "targets": [6],
                "render": function (data) {
                    var str;
                    if (data != 0) {
                        str = "<span class='highlight-red'>" + arr[data] + "</span>";
                    } else {
                        str = "<span class=''>" + arr[data] + "</span>";
                    }
                    return str;
                }
            },
            {
                "targets": [9],
                "render": function (data) {
                    data = +data;
                    var str = "";
                    for (var i = 0; i < data; i++) {
                        str += "<img width='16' src='images/star-rate.png'>";
                    }
                    return str;
                }
            }
        ],
        "scrollX": true
    };
    if ($scope.isFromWealth) {
        config.stateSave = false;
        $scope.$parent.backBtnHref = "#/wealth-convert-rule-detail";
    }
    $scope.$on("selectpicker-loaded", function () {
        $rootScope.loading = true;
        dataTableService.initDataTable("taskPointView", config, getSearchParam());
        $('#taskPointView').DataTable().column(0).visible($scope.showRadio);
        window.dataTable.on('xhr', function () {
            $timeout(function () {
                $rootScope.loading = false;
            }, 0);
        });
    });
    setTimeout(function () {
        $("#input-search-field").attr("placeholder", "输入资源编号/SAP编号/姓名/任务 搜索");
    }, 10);
    $scope.export = exportTaskPointView;
    $scope.search = search;
    $scope.open = open;
    $scope.isLock = false;
    $scope.isDisabled = true;

    $('#taskPointView').on('change', 'input', function () {
        var data = dataTable.row($(this).parents('tr')).data();
        $scope.selectedRowData = data;
        $timeout(function () {
            $scope.isLock = data['isConvert'] == 1;
            if ($scope.isLock) {
                $scope.isDisabled = true;
                return;
            }
            if (data['taskStatus'] == 0) {
                //有效
                $scope.taskStatusBtn = "标记为无效";
                $scope.isDeplicate = false;
                $scope.isDisabled = false;
                $scope.isEffect = true;
            } else if (data['taskStatus'] == 2) {
                //无效
                $scope.taskStatusBtn = "标记为有效";
                $scope.isDeplicate = false;
                $scope.isDisabled = false;
                $scope.isEffect = false;
            } else if (data['taskStatus'] == 1) {
                //重复
                $scope.taskStatusBtn = "标记为无效";
                $scope.isDeplicate = true;
                $scope.isDisabled = true;
                $scope.isEffect = false;
            }
        });
    });

    function open() {
        var taskStatusModal = commonService.createModal({
            'templateUrl': 'taskStatusConfirmDialog.html',
            'controller': 'EffectivenessModalController',
            'size': 'sm',
            'resolve': {
                'data': function () {
                    return $scope.selectedRowData;
                }
            }
        });

        taskStatusModal.result.then(function (data) {
            taskPointViewService.markTaskStatus({
                id: data.id,
                taskStatus: data.taskStatus
            }).then(function () {
                $rootScope.loading = true;
                $('#taskPointView').DataTable().ajax.reload();
                $scope.isDisabled = true;
            });

        })


    }

    function getSearchParam() {
        var selectedDates = commonService.getSelectedDates();
        var wealthCompleteTimeDates = commonService.getWealthCompleteTimeSelectedDates();
        //noinspection JSUnresolvedFunction
        return {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "jobStatus": $scope.jobStatus,
            "wealthCompleteBeginDate": wealthCompleteTimeDates.beginDate,
            "wealthCompleteEndDate": wealthCompleteTimeDates.endDate,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
            "firstLevelOrderType": $scope.selectedTaskTypeOne.id || "",
            "secondLevelOrderType": $scope.selectedTaskTypeTwo.id || "",
            "taskStatus": $scope.taskStatus,
            "lastLevelOrderType": _.pluck($scope.selectedTaskTypeLast, 'id')
        };
    }

    function search() {
        $rootScope.loading = true;
        commonService.storageSearchStatus($scope);
        dataTableService.dataTableSearch("taskPointView", getSearchParam());
    }

    function exportTaskPointView() {
        taskPointViewService.exportTaskPointView(getSearchParam());
    }
}]);

(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('EffectivenessModalController', EffectivenessModalController);

    EffectivenessModalController.$inject = ['$scope', 'data', '$modalInstance'];

    function EffectivenessModalController($scope, data, $modalInstance) {
        $scope.ok = ok;
        $scope.cancel = cancel;

        if (data['taskStatus'] == 0) {
            $scope.content = "无效";
        } else {
            $scope.content = "有效";
        }

        function ok() {
            if (data['taskStatus'] == 0) {
                data['taskStatus'] = 2;
            } else {
                data['taskStatus'] = 0;
            }
            $modalInstance.close(data);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

    }
})();