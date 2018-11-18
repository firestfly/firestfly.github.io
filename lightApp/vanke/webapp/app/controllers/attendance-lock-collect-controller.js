'use strict';

VkrmsApp.controller('AttendanceLockCollectController', ['$scope', '$http', '$filter', '$timeout', 'CommonService', 'DataTableService', function ($scope, $http, $filter, $timeout, commonService, dataTableService) {
    $scope.title = "万科资源管理信息系统 - 定案汇总表";

    $scope.keywords = "";
    $scope.organizations = [];
    $scope.departments = [];
    $scope.selectedCompanies = [];
    $scope.selectedDepartments = [];
    $scope.selectedStatus = 1;
    var selectedProject = [];
    commonService.applySearchStatus($scope);
    $scope.exportLockEditeData = exportLockEditeData;
    $scope.showSelectedPop = false;
    $scope.timer = null;

    function exportLockEditeData () {
        if (selectedProject.length == 0) {
            commonService.alert({
                content: '请先选择项目',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return
        }
        for (var i = 0; i < selectedProject.length; i++) {
            if (selectedProject[i].status == '未定案') {
                commonService.alert({
                    content: '项目尚未定案，不可导出SAP考勤汇总结果',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
            if (!selectedProject[i].hasEdite) {
                commonService.alert({
                    content: '没有重新定案的不可选择导出',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
        }
        var url = baseUrl + "/file/attendance-lock-modify-exporting";
        commonService.downloadFile(url, { search: JSON.stringify(selectedProject) });
    }
    $scope.clear = function () {
        $scope.departments = [];
        $scope.selectedCompanies = [];
        $scope.selectedDepartments = [];
        $scope.selectedStatus = 1;
        $scope.keywords = "";
        $scope.$broadcast('clear');
    };

    commonService.getCompanies().then(function (result) {
        $scope.organizations = result;
        $scope.$broadcast('companies-loaded');
    }, function (result) {
    });

    $scope.$on('companies-loaded', function () {
        $timeout(function () {
            $('#select-company').selectpicker('refresh');
            $("#select-department").selectpicker('refresh');
            $("#select-lock-status").selectpicker();
            initSelectCompany($scope);
        }, 0, false);
    });

    $scope.$on('clear', function () {
        $timeout(function () {
            $('#select-company').selectpicker('refresh');
            $("#select-department").selectpicker('refresh');
            $("#select-lock-status").selectpicker('refresh');
        }, 0, false);
    });
    $timeout(function () {
        $('#sandbox-container .input-daterange').datepicker({
            language: "zh-CN",
            autoclose: true
        });
    }, 50);
    function initSelectCompany($scope) {
        $("#select-company").on('change', function () {
            var departments = [],
                departmentsInCompany = [];
            for (var i = 0; i < $scope.selectedCompanies.length; i++) {
                departmentsInCompany = $scope.selectedCompanies[i].departments;
                for (var j = 0; j < departmentsInCompany.length; j++) {
                    departments.push(departmentsInCompany[j]);
                }
            }
            $scope.departments = departments;
            // $scope.selectedDepartments = departments;
            if (_.isEmpty(departments)) {
                $scope.selectedDepartments = []
            }

            $scope.$apply();
            $("#select-department").selectpicker('refresh');
        });

        $("#select-lock-status").on('change', function () {
            console.log('blank');
        });
    }

    function getCycle(onlyLockCycle) {
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var result;
        angular.forEach(onlyLockCycle, function (cycle, index) {
            if (cycle.lockCycleBegintime <= today && today <= cycle.lockCycleEndtime) {
                result = onlyLockCycle.splice(index + 1, 6)
            }
        });
        return result;
    }


    $scope.$on('$viewContentLoaded', function () {
        commonService
            .getLockCycleType({
                params: {
                    type: 2
                }
            })
            .then(function (response) {
                $scope.onlyLockCycle = getCycle(response);
                $scope.selectedOnlyLockCycle = $scope.onlyLockCycle[0];
                $timeout(function () {
                    $('#onlyLockCycle').selectpicker('refresh');
                });

                var config = {
                    //"serverSide": false,
                    "ajax": {
                        "type": "POST",
                        "url": "attendance-lock-collect",
                        "headers": utils.generateHeaders()
                    },
                    "columnDefs": [
                        {
                            "targets": 0,
                            "data": null,
                            "defaultContent": "<input type='checkbox'>"
                        },
                        {
                            "targets": [2, 4, 6],
                            "visible": false
                        }
                    ]
                };
                dataTableService.initDataTable("attendance-lock-collect-table", config, getParams());
            });
    });

    function getParams() {
        return {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "lockStatus": $scope.selectedStatus,
            "attendanceLockName": $scope.selectedOnlyLockCycle == null ? '' : $scope.selectedOnlyLockCycle.lockCycleName,
            "isDockingWage": 1
        };
    }

    $scope.search = function () {
        dataTableService.dataTableSearch("attendance-lock-collect-table", getParams());
        commonService.storageSearchStatus($scope);
    };

    $('#attendance-lock-collect-table').on('change', 'input', function () {
        var data = dataTable.row($(this).parents('tr')).data();
        var objData = {};
        objData.attendanceLockId = data[0];
        objData.departmentId = data[4];
        objData.status = data[13];
        objData.hasEdite = data[12] == "1" && data[13] == "已定案";
        if ($(this).is(":checked")) {
            selectedProject.push(objData);
        } else {
            selectedProject = _.reject(selectedProject, function (el) {
                return el.attendanceLockId == data[0] && el.departmentId == data[4] && el.status == data[13];
            });
        }
        // 显示当前已选
        if ($scope.timer) {
            $timeout.cancel($scope.timer)
        }
        if (selectedProject.length > 0) {
            $scope.selectedNumber = selectedProject.length;
            var offset = $(this).offset();
            $('.attendance-selected-pop').css({
                'top': (offset.top - 7) + 'px',
                'left': (offset.left + 24) + 'px'
            });
            $scope.showSelectedPop = true;
            $scope.$apply();
            $scope.timer = $timeout(function () {
                $scope.showSelectedPop = false;
            }, 2000);
        } else {
            $scope.showSelectedPop = false;
            $scope.$apply();
        }
    });

    $('#attendance-lock-collect-table').on('draw.dt', function () {
        var tableData = dataTable.data(),
            tbody = $(this).children().eq(1),
            trows = tbody.children(),
            rowData, checkbox;
        for (var i = 0; i < tableData.length; i++) {
            rowData = tableData[i];
            if (rowData[13] == "未定案" || rowData[13].indexOf("解定案") > -1) {
                checkbox = trows.eq(i).children().eq(0).children().eq(0);
                checkbox.prop('disabled', true);
            }
        }
    });

    $scope.unlock = function () {
        if (selectedProject.length == 0) {
            commonService.alert({
                content: '请先选择项目',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        for (var i = 0; i < selectedProject.length; i++) {
            if (selectedProject[i].status == "未定案") {
                commonService.alert({
                    content: '只能对已定案项目进行解定案',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
        }

        $http.post(apiBaseUrl + '/attendance-set-unlock', selectedProject, {
            headers: utils.generateHeaders()
        }).success(function (attendanceCheck) {
            selectedProject = [];
            dataTable.draw();
        }).error(function (data, status, headers, config) {
            commonService.alert({
                content: '解定案操作失败，请重试',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
        });
    }
    $scope.export = function () {
        var url, data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "beginDate": $filter('date')($('input[name=start]').datepicker('getDate'), 'MM/dd/yyyy'),
            "endDate": $filter('date')($('input[name=end]').datepicker('getDate'), 'MM/dd/yyyy')
        };
        if (data.departments.length == 0) {
            commonService.alert({
                content: '请选择部门',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return false
        } else if (!data.beginDate) {
            commonService.alert({
                content: '请选择导出开始时间',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return false
        }
        url = baseUrl + "/file/attendance-abnormal-exporting";
        commonService.downloadFile(url, data);
    }

}]);

