'use strict';

VkrmsApp.controller('AttendanceLockController', ['$scope', '$http', '$filter', '$timeout', '$location', 'CommonService', 'DataTableService', 'OvertimeAttendanceCheckService', function ($scope, $http, $filter, $timeout, $location, commonService, dataTableService, OvertimeAttendanceCheckService) {
    $scope.$parent.title = "万科资源管理信息系统 - 定案";
    $scope.keywords = "";
    $scope.organizations = [];
    $scope.departments = [];
    $scope.selectedCompanies = [];
    $scope.selectedDepartments = [];
    $scope.selectedStatus = 0;
    $scope.selectedExportStatus = "";
    var selectedProject = [];
    var selectedProject2 = [];
    $scope.exportLockData = exportLockData;
    $scope.exportLockEditeData = exportLockEditeData;
    $scope.isLockSave = location.hash === '#/attendance-lock';
    $scope.isLockExcept = location.hash === '#/attendance-lock-except';
    $scope.isLockSap = location.hash === '#/attendance-lock-sap';
    var isLockSave = $scope.isLockSave;
    var isLockExcept = $scope.isLockExcept;
    $scope.search = search;
    $scope.selectAll = false;
    $scope.showSelectedPop = false;
    $scope.timer = null;
    if (!$scope.isLockExcept) {
        $scope.isDockingWage = 1;
    }
    if($scope.isLockSap){
        $scope.selectedStatus = [1];
        $timeout(function () {
            $('#select-lock-status').attr('multiple', 'multiple');
        });
    }
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
            if (selectedProject[i].hasEdite) {
                commonService.alert({
                    content: '仅重新定案过的项目支持导出数据修改记录，请重新选择',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
            /* if (selectedProject[i].status == '未定案') {
                commonService.alert({
                    content: '项目尚未定案，不可导出数据修改记录',
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
            } */
        }
        var url = baseUrl + "/file/attendance-lock-modify-exporting";
        commonService.downloadFile(url, { search: JSON.stringify(selectedProject) });
    }
    function exportLockData() {
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
                    content: '未定案的项目不可导出SAP考勤结果，请重新选择',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
        }
        var url = baseUrl + "/file/holiday-duration-exporting";
        if (!$scope.isLockSap) {
            url = baseUrl + "/file/new-holiday-duration-exporting";
        }
        if ($scope.isLockSap) {
            selectedProject.forEach(function(item){
                item.exported = 1;
            })
        }
        commonService.downloadFile(url, { search: JSON.stringify(selectedProject) });
    }

    function setPopPosition($checkbox) {
        var offset = $checkbox.offset();
        $('.attendance-selected-pop').css({
            'top': (offset.top - 7) + 'px',
            'left': (offset.left + 24) + 'px'
        });
    }

    $scope.clear = function () {
        $scope.departments = [];
        $scope.selectedCompanies = [];
        $scope.selectedDepartments = [];
        $scope.keywords = "";
        if ($scope.isLockExcept) {
            $scope.isDockingWage = "";
        }
        $scope.selectedExportStatus = "";
        $scope.$broadcast('clear');
        $scope.selectedStatus = "";
        // if($scope.isLockSap){
        //     $scope.selectedStatus = 1;  //默认已定案
        // }else{
        //     $scope.selectedStatus = 0;
        // }
    };
    // commonService.applySearchStatus($scope);
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
            $("#select-export-status").selectpicker('refresh');
            $("#isDockingWage").selectpicker('refresh');
            initSelectCompany($scope);
        }, 0, false);
    });

    $scope.$on('clear', function () {
        $timeout(function () {
            $('#select-company').selectpicker('refresh');
            $("#select-department").selectpicker('refresh');
            $("#select-lock-status").selectpicker('refresh');
            $("#select-export-status").selectpicker('refresh');
            $("#isDockingWage").selectpicker('refresh');
        }, 0, false);
    });
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
    $('#attendance-lock-collect-table').on( 'draw.dt', function () {
        selectedProject = [];
        selectedProject2 = [];
    });

    $scope.$on('$viewContentLoaded', function () {
        commonService
            .getLockCycleType({
                params: {
                    type: $scope.isLockExcept ? 3 : 1
                }
            })
            .then(function (response) {
                $scope.onlyLockCycle = response;
                $scope.selectedOnlyLockCycle = $scope.onlyLockCycle[1];
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
                            "defaultContent": "<input type='checkbox' class='row-select' />"
                        },
                        {
                            "targets": [2, 4, 6],
                            "visible": false
                        },
                        // {
                        //     "targets": 6,
                        //     "visible": $scope.isLockExcept,
                        //     "render": function (data) {
                        //         if (data == 1) {
                        //             return "是";
                        //         } else {
                        //             return "否";
                        //         }
                        //     }
                        // },
                        {
                            "targets": 11,
                            "visible": $scope.isLockSap,
                            "render": function (data) {
                                if (data == 1) {
                                    return "已导出";
                                } else if (data == 2) {
                                    return "未导出";
                                } else {
                                    return "";
                                }
                            }
                        },
                        {
                            "targets": 12,
                            "render": function (data, type, full, meta) {
                                var str = '';
                                if (data == "1" && full[13] == "已定案") {
                                    str = "<button type='button' class='btn btn-primary btn-sap-record'>查看详情</button>"
                                }
                                return str
                            }
                        },
                        {
                            "targets": 13,
                            "data": null,
                            "visible": $scope.isLockSave,
                            "defaultContent": '<button type="button" class="btn btn-primary btn-detail">详情</button>'
                        }
                    ],
                    scrollX: true
                };
                if ($scope.isLockSap) {
                    config.pageLength = 100;
                }
                dataTableService.initDataTable("attendance-lock-collect-table", config, getSearchParams());
            });


    });
    function getSearchParams() {
        var selectedStatus;
        if ($scope.selectedStatus instanceof Array) {
            selectedStatus = $scope.selectedStatus.join(',');
        } else {
            selectedStatus = $scope.selectedStatus;
        }
        var param = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "lockStatus": selectedStatus,
            "attendanceLockName": $scope.selectedOnlyLockCycle == null ? '' : $scope.selectedOnlyLockCycle.lockCycleName,
            "isDockingWage": "1"
        };
        if ($scope.isLockSap) {
            param.exportStatus = $scope.selectedExportStatus;
        }
        return param;
    }

    function search() {
        dataTableService.dataTableSearch("attendance-lock-collect-table", getSearchParams());
        selectedProject = [];
        selectedProject2 = [];
        $('#checkAll').prop('checked', false);
        // commonService.storageSearchStatus($scope);
    };

    $('#attendance-lock-collect-table').on('click', 'button.btn-primary.btn-detail', function () {
        var data = dataTable.row($(this).parents('tr')).data();
        var objData = {};
        objData.attendanceLockId = data[0];
        objData.attendanceLockName = data[1];
        objData.companyName = data[3];
        objData.departmentId = data[4];
        objData.departmentName = data[5];
        objData.lockDate = data[7];
        objData.beginDate = data[8];
        objData.endDate = data[9];
        objData.status = data[13];
        sessionStorage["searchState_attendance-lock-detail"] = JSON.stringify(objData);
        $scope.$apply(function () {
            $location.path('/attendance-lock-detail');
        });
    });

    $('#attendance-lock-collect-table').on('click', 'button.btn-primary.btn-sap-record', function () {
        var data = dataTable.row($(this).parents('tr')).data();
        var objData = {};
        objData.attendanceLockId = data[0];
        objData.attendanceLockName = data[1];
        objData.companyName = data[3];
        objData.departmentId = data[4];
        objData.departmentName = data[5];
        objData.lockDate = data[7];
        objData.beginDate = data[8];
        objData.endDate = data[9];
        objData.status = data[13];
        $scope.objData
        sessionStorage["searchState_attendance-lock-data-record"] = JSON.stringify(objData);
        $scope.$apply(function () {
            $location.path('/attendance-lock-data-record');
        });
    });

    $('#attendance-lock-collect-table .select-all').click(function(){
        var data = dataTable.columns().data()[13];
        if(data.indexOf('未定案') > -1){
            $(this).prop('checked',false);
            commonService.alert({
                content: '列表中包含未定案的部门，不可全选导出。',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return
        }
        var flag = $(this).prop('checked');
        $('#attendance-lock-collect-table .row-select').each(function(){
            $(this).prop('checked',flag).trigger('change');
        })
    });

    $('#attendance-lock-collect-table').on('change', 'input', function () {
        var data = dataTable.row($(this).parents('tr')).data();
        var objData = {};
        var objData2 = {}
        objData.attendanceLockId = data[0];
        objData.companyName = data[3];
        objData.departmentName = data[5];
        objData.departmentId = data[4];
        objData.status = data[13];
        objData.hasEdite = data[10] == "未定案" || data[10] == "一次定案" || data[10] == '一次解定案';
        if ($(this).is(":checked")) {
            selectedProject.push(objData);
            objData2 = JSON.parse(JSON.stringify(objData))
            objData2.beginDate = data[8];
            objData2.endDate = data[9];
            selectedProject2.push(objData2);
        } else {
            selectedProject = _.reject(selectedProject, function (el) {
                return el.attendanceLockId == data[0] && el.departmentId == data[4] && el.status == data[13];
            });
            selectedProject2 = _.reject(selectedProject2, function (el2) {
                return el2.attendanceLockId == data[0] && el2.departmentId == data[4] && el2.status == data[13];
            });
        }
        // 显示当前已选
        if ($scope.timer) {
            $timeout.cancel($scope.timer)
        }
        if (selectedProject.length > 0) {
            $scope.selectedNumber = selectedProject.length;
            setPopPosition($(this));
            $scope.showSelectedPop = true;
            $scope.timer = $timeout(function () {
                $scope.showSelectedPop = false;
            }, 2000);
        } else {
            $scope.showSelectedPop = false;
        }
        $timeout(function(){
            if (_.filter(selectedProject,function(item){return item.status == '已定案'}).length > 0){
                $scope.lockDisabled = true;
            }else{
                $scope.lockDisabled = false;
            }
        });

    });

    $('#attendance-lock-collect-table').on('draw.dt', function () {
        var tableData = dataTable.data(),
            tbody = $(this).children().eq(1),
            trows = tbody.children(),
            rowData, checkbox;
        if (!$scope.isLockSap) {
            return;
        }
        for (var i = 0; i < tableData.length; i++) {
            rowData = tableData[i];
            if ($scope.isLockSap) {
                if (rowData[13] == "未定案") {
                    checkbox = trows.eq(i).children().eq(0).children().eq(0);
                    // checkbox.prop('disabled', true);
                }
            } else {
                if (rowData[13] == "已定案") {
                    checkbox = trows.eq(i).children().eq(0).children().eq(0);
                    // checkbox.prop('disabled', true);
                }
            }
        }
    });

    $scope.lock = function (status) {
        if (selectedProject.length == 0) {
            commonService.alert({
                content: '请先选择项目',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        } else if ($scope.isLockSave && selectedProject.length > 1) {
            commonService.alert({
                content: '不能多选项目操作！',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        } else if (selectedProject.length > 5) {
            commonService.alert({
                content: '选择项目不能多于5个',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        for (var i = 0; i < selectedProject.length; i++) {
            if (selectedProject[i].status == "已定案" && status == "预定案") {
                commonService.alert({
                    content: "已定案的项目不可再预定案，如需查看定案数据，请点击“导出SAP考勤结果”",
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                return;
            }
        }
        var config = {
            "title": "提示",
            "icon": "fa-exclamation-circle",
            "content": "定案后会以此结果计算考勤工资，如需查看考勤结果请点击“导出考勤汇总”后查看汇总数据，是否确认定案？",
            "okText": "确定定案",
            "cancelText": "导出考勤汇总",
            "callback": function () {
                $http.post(apiBaseUrl + '/attendance-set-lock', selectedProject, {
                    headers: utils.generateHeaders()
                }).success(function (attendanceCheck) {
                    if(attendanceCheck.status == 'fail'){
                        if(attendanceCheck.data){
                            commonService.createModal({
                                templateUrl: 'AttendanceLockValidateModal.html',
                                controller: 'AttendanceLockValidateModalController',
                                size: 'lg',
                                resolve: {
                                    data: function() {
                                        return {
                                            isLockSave: isLockSave,
                                            attendanceCheckData: attendanceCheck.data,
                                            selectedProject: selectedProject
                                        }
                                    }
                                }
                            });
                            return
                        }else{
                            commonService.alert({
                                content: attendanceCheck.errorMessage,
                                icon: "fa-exclamation-circle",
                                iconColor: "icon-red"
                            });
                            return;
                        };
                    }
                    selectedProject = [];
                    dataTable.draw();
                }).error(function (data, status, headers, config) {
                    commonService.alert({
                        content: '定案操作失败，请重试',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                });
            },
            "cancel": function () {
                var exportParam = []
                for (var i = 0; i < selectedProject2.length; i++) {
                    exportParam.push({
                        start: 0,
                        length: 10,
                        departments: selectedProject2[i].departmentId,
                        beginDate: $filter('date')(selectedProject2[i].beginDate, 'MM/dd/yyyy'),
                        endDate: $filter('date')(selectedProject2[i].endDate, 'MM/dd/yyyy'),
                        keywords: '',
                        jobStatus: '',
                        staffType: null,
                        lockCycleId: selectedProject2[i].attendanceLockId
                    })
                }
                var ajaxLength = exportParam.length;
                var time = 0
                OvertimeAttendanceCheckService.exportOvertimeAttendanceDetail(exportParam[0])
                var timer = setInterval(function(){
                    time++
                    if(time == ajaxLength){
                        clearInterval(timer);
                        return false
                    }
                    OvertimeAttendanceCheckService.exportOvertimeAttendanceDetail(exportParam[time])
                },2000)
            }
        };

        if (status === '预定案') {
            var url = baseUrl + "/file/ext_holiday-duration-exporting";
            $http.post(apiBaseUrl + '/attendance-pre-lock-check', selectedProject, {
                headers: utils.generateHeaders()
            }).success(function (attendanceCheck) {
                // 第一次校验失败弹出第一个弹窗
                if (attendanceCheck.status == "fail") {
                    if (attendanceCheck.data) {
                        commonService.createModal({
                            templateUrl: 'AttendanceLockValidateModal.html',
                            controller: 'AttendanceLockValidateModalController',
                            size: 'lg',
                            resolve: {
                                data: function() {
                                    return {
                                        isLockExcept: isLockExcept,
                                        attendanceCheckData: attendanceCheck.data,
                                        selectedProject: selectedProject
                                    }
                                }
                            }
                        });
                    } else {
                        commonService.alert({
                            content: attendanceCheck.errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                    }
                    // 第一次校验成功进行第二次校验
                } else {
                    $http.post(apiBaseUrl + '/attendance-set-lock-confirm-check', selectedProject, {
                        headers: utils.generateHeaders()
                    }).success(function (attendanceCheck) {
                        // 第二次校验失败弹出第二个弹框
                        if (attendanceCheck.status == 'fail') {
                            if (attendanceCheck.data) {
                                commonService.createModal({
                                    templateUrl: 'PreAttendanceAbnormalRemindModal.html',
                                    controller: 'PreAttendanceAbnormalRemindModalController',
                                    size: 'lg',
                                    resolve: {
                                        data: function () {
                                            return {
                                                attendanceCheckData: attendanceCheck.data,
                                                selectedProject: selectedProject
                                            }
                                        }
                                    }
                                });
                            } else {
                                commonService.alert({
                                    content: attendanceCheck.errorMessage,
                                    icon: "fa-exclamation-circle",
                                    iconColor: "icon-red"
                                });
                            }
                            // 第二次校验成功导出预定案
                        } else {
                            commonService.downloadFile(url, {search: JSON.stringify(selectedProject)});
                        }
                    });
                }
            });
        } else {
            commonService.confirm(config);
        }
    }

    $scope.viewAttendanceProcess = function () {
        // 预留以后动态获取superset链接
        var iframeSrc = 'http://b.vkowl.com/superset/explore/table/11/?form_data=%7B%22datasource%22%3A%2211__table%22%2C%22viz_type%22%3A%22table%22%2C%22slice_id%22%3A6%2C%22granularity_sqla%22%3Anull%2C%22time_grain_sqla%22%3A%22Time+Column%22%2C%22since%22%3A%22100+years+ago%22%2C%22until%22%3A%22now%22%2C%22groupby%22%3A%5B%22mcode%22%5D%2C%22metrics%22%3A%5B%22%E5%91%98%E5%B7%A5%E4%BA%BA%E6%95%B0%22%2C%2235%E5%B2%81%E4%BB%A5%E4%B8%8A%E5%91%98%E5%B7%A5%E4%BA%BA%E6%95%B0%22%2C%2241%E5%B2%81%E4%BB%A5%E4%B8%8A%E5%91%98%E5%B7%A5%E4%BA%BA%E6%95%B0%22%2C%2246%E5%B2%81%E4%BB%A5%E4%B8%8A%E5%91%98%E5%B7%A5%E4%BA%BA%E6%95%B0%22%2C%2250%E5%B2%81%E4%BB%A5%E4%B8%8A%E5%91%98%E5%B7%A5%E4%BA%BA%E6%95%B0%22%5D%2C%22include_time%22%3Afalse%2C%22all_columns%22%3A%5B%5D%2C%22order_by_cols%22%3A%5B%5D%2C%22table_timestamp_format%22%3A%22%25Y-%25m-%25d+%25H%3A%25M%3A%25S%22%2C%22row_limit%22%3Anull%2C%22page_length%22%3A0%2C%22include_search%22%3Afalse%2C%22table_filter%22%3Afalse%2C%22where%22%3A%22%22%2C%22having%22%3A%22%22%2C%22filters%22%3A%5B%5D%7D&standalone=true&height=350';
        commonService.createModal({
            templateUrl: 'viewAttendanceProcessModal.html',
            controller: 'ViewAttendanceProcessModalController',
            size: 'lg',
            resolve: {
                data: function () {
                    return {
                        iframeSrc: iframeSrc
                    }
                }
            }
        });
    }

    $scope.selectAllAttendance = function ($event) {
        $scope.selectAll = $event.target.checked
        selectedProject = [];
        selectedProject2 = [];
        if ($scope.selectAll) {
            $('.row-select').prop('checked', true).trigger('change');
            setPopPosition($('#checkAll'));
        } else {
            $('.row-select').prop('checked', false);
            // 关闭已选项目弹层
            $scope.showSelectedPop = false;
        }
    }

}]);

VkrmsApp.controller('AttendanceLockValidateModalController',AttendanceLockValidateModalController);
AttendanceLockValidateModalController.$inject = ['$scope', '$http', '$modalInstance', 'data', 'CommonService'];

function AttendanceLockValidateModalController($scope, $http, $modalInstance, data, commonService) {
    var selectedProject = data.selectedProject;
    if (data.isLockSave) {
        $scope.page = '定案'
    }
    if (data.isLockExcept) {
        $scope.page = '预定案'
    }
    $scope.data = data.attendanceCheckData;
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };
}

VkrmsApp.controller('PreAttendanceAbnormalRemindModalController', PreAttendanceAbnormalRemindModalController);
PreAttendanceAbnormalRemindModalController.$inject = ['$scope', '$modalInstance', 'data', 'CommonService'];

function PreAttendanceAbnormalRemindModalController($scope, $modalInstance, data, commonService) {
    var selectedProject = data.selectedProject;
    $scope.data = data.attendanceCheckData;
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.exportPreAttendence = function () {
        $modalInstance.dismiss('cancel');
        var url = baseUrl + "/file/ext_holiday-duration-exporting";
        commonService.downloadFile(url, {search: JSON.stringify(selectedProject)});
    }
}

VkrmsApp.controller('ViewAttendanceProcessModalController', ViewAttendanceProcessModalController);
ViewAttendanceProcessModalController.$inject = ['$scope', '$modalInstance', 'data', '$sce'];
function ViewAttendanceProcessModalController($scope, $modalInstance, data, $sce) {
    $scope.data = data;
    $scope.iframeSrc = $sce.trustAsResourceUrl($scope.data.iframeSrc);
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };
}

