'use strict';

VkrmsApp.controller('AttendanceCheckController', ['$scope', '$http', 'DataTableService', 'CommonService', 'UserService', 'AttendanceTaskService', 'SignInAreaTaskservice', function ($scope, $http, dataTableFactory, commonService, userService, attendanceTaskService, signInAreaTaskservice) {
    $scope.title = "万科资源管理信息系统 - 考勤结果";
    $scope.selectedStatus = "0";
    $scope.selectedType = "0";

    var me, cell, col, row, index, newVal, oldVal,
        tdSelectdActualOnDutyTime = false,
        tdSelectdActualOffDutyTime = false,
        tdSelectdActualOnDutyDatetimeExtra = false,
        tdSelectdActualOffDutyDatetimeExtra = false,
        tdValueActualOnDutyTime,
        tdValueActualOffDutyTime,
        tdValueActualOnDutyDatetimeExtra,
        tdValueActualOffDutyDatetimeExtra,
        tdValueOnDutyTime,
        tdValueOffDutyTime,
        fragmentBeginDatetime,
        fragmentEndDatetime,
        isValid,
        enterSubmit;

    $scope.commonSearchBarConfig = {
        isCompanySelectpickerMultiple: false,
        companySelecterLabel: "公司范围",
        departmentSelecterLabel: "部门/项目",
        workgroupSelecterLabel: "员工子组"
    };

    var tableName = "attendance-check-table",
        tableColumns = {
            "id": 0,
            "onDutyTime": 4,                  //排班-开始时间
            "offDutyTime": 5,                 //排班-结束时间
            "actualOnDutyTime": 6,            //出勤-上班时间
            "actualOffDutyTime": 7,           //出勤-下班时间
            "fragmentBeginDatetime": 8,       //零星加班-开始时间
            "fragmentEndDatetime": 9,         //零星加班-结束时间
            "actualOnDutyDatetimeExtra": 10,  //零星加班-上班时间
            "actualOffDutyDatetimeExtra": 11, //零星加班-下班时间
            "overtimeOnWorkingDay": 12,       //加班-工作日
            "overtimeOnOffDay": 13,           //加班-休息日
            "overtimeOnHoliday": 14,          //加班-法定节假日
            "lateDuration": 15,               //迟到
            "earlierLeaveDuration": 16,       //早退
            "absentDuration": 17,                //旷工
            "workingDuration": 18,             //在岗
            "lieuLeaveDuration": 19,          //调休时长
            "lieuLeaveBeginDate": 20,         //调休开始时间
            "lieuLeaveEndDate": 21         //调休结束时间
        };

    $scope.$on('$viewContentLoaded', function () {
        var initData = null;
        var loginUserObj = {};
        userService.getCurrentUser().then(function (result) {
            loginUserObj = result;
            applySelecterData(loginUserObj);
        });

        function applySelecterData(datas) {
            // 初始化搜索参数
            var today = new Date();
            var month = today.getMonth() + 1;
            var year = today.getFullYear();
            var btime = today.getMonth() + '/21/' + year;
            var etime = month + '/20/' + year;

            initData = {
                "departments": datas.authorizedCompanies[0].departments[0].department_id.split(","),
                "workingGroups": datas.authorizedWorkGroups[0].work_group_id.split(","),
                "beginDate": btime,
                "endDate": etime,
                "keywords": $scope.keywords,
                "attendanceStatus": $scope.selectedStatus,
                "abnormalAttendanceType": $scope.selectedType
            };
            $scope.commonSearchBarConfig = {
                companySelecterLabel: datas.authorizedCompanies[0].company_name,
                departmentSelecterLabel: datas.authorizedCompanies[0].departments[0].department_name,
                workgroupSelecterLabel: datas.authorizedWorkGroups[0].work_group_name
            };
            //dataTableFactory.initDataTable(tableName,initData);
        }

        var config = {
            "ajax": {
                "url": "attendance-results",
                "type": "POST",
                "headers": utils.generateHeaders()
            },
            "columnDefs": [
                {
                    "targets": tableColumns.id,
                    "visible": false
                },
                {
                    "targets": [tableColumns.actualOnDutyDatetimeExtra, tableColumns.actualOffDutyDatetimeExtra, tableColumns.actualOnDutyTime, tableColumns.actualOffDutyTime],
                    "render": function (data) {
                        if (data && data != '-') {
                            return '<input type="text" style="width:70px" class="input-time" value="' + data + '"/>';
                        }
                        return data;

                    }
                },
                {
                    "targets": [-1],
                    "render": function (data) {
                        return ["-", "在职", "离职", "在入职"][+data]
                    }
                }
            ],
            "scrollX": true
        };

        dataTableFactory.initDataTable(tableName, config);

        $('#' + tableName + ' tbody').on('click', 'td', function () {
            cell = dataTable.cell(this);
            me = $(this);
            index = me.index();
            if (index != "5" && index != "6" && index != "9" && index != "10") { //除上下班时间外禁止点击
                return;
            }
            if ($(this).html() != "-" && $(this).html() != "") {
                return;
            }

            if (cell.length == 0) {
                return;
            }
            if (cell.data() == "-") {
                $(this).css("min-width", "70px").html('<input type="text" style="width:70px" class="input-time" value=""/>');
                $(this).find("input").focus();
            }

        });

        $('#' + tableName + ' tbody').on('blur', 'td', function () {
            // 回车提交后会重复触发blur事件，加一个flag来避免报错
            if (enterSubmit) {
                enterSubmit = false;
            } else {
                isValid = true;
                cell = dataTable.cell(this);
                me = $(this);
                saveTd(cell, me);
            }
        });

        $('#' + tableName + ' tbody').on('keypress', 'td', function (e) {
            isValid = true;
            cell = dataTable.cell(this);
            me = $(this);
            // 回车键事件
            if (e.which == 13 || e.which == 108) {
                enterSubmit = true;
                saveTd(cell, me);
            }
        });

        function saveTd(cell, me) {
            index = me.index();
            col = cell.index().column - 1;
            row = cell.index().row;
            tdValueActualOnDutyTime = nthTdValue(5);
            tdValueActualOffDutyTime = nthTdValue(6);
            tdValueActualOnDutyDatetimeExtra = nthTdValue(9);
            tdValueActualOffDutyDatetimeExtra = nthTdValue(10);
            tdValueOnDutyTime = nthTdValue(3);
            tdValueOffDutyTime = nthTdValue(4);
            fragmentBeginDatetime = nthTdValue(7);
            fragmentEndDatetime = nthTdValue(8);
            tdSelectdActualOnDutyTime = false;
            tdSelectdActualOffDutyTime = false;
            tdSelectdActualOnDutyDatetimeExtra = false;
            tdSelectdActualOffDutyDatetimeExtra = false;
            switch (col) {
                case 5:
                    tdSelectdActualOnDutyTime = true;
                    break;
                case 6:
                    tdSelectdActualOffDutyTime = true;
                    break;
                case 9:
                    tdSelectdActualOnDutyDatetimeExtra = true;
                    break;
                case 10:
                    tdSelectdActualOffDutyDatetimeExtra = true;
                    break;
            }

            if (!tdSelectdActualOnDutyTime && !tdSelectdActualOffDutyTime && !tdSelectdActualOnDutyDatetimeExtra && !tdSelectdActualOffDutyDatetimeExtra) {
                return;
            }

            if (cell.length == 0 || getData(row, 3) == "调休") {
                return;
            }

            if ($('#timepicker-' + row + '-' + col).length == 0) {
                oldVal = cell.data();
            }
            timeFormatChecker(me, oldVal);
        }
    });

    function updateTdValueFormat(newVal) {
        newVal = attendanceTaskService.updateTdValueFormat(newVal);
        return newVal;
    }

    function timeValidChecker(newVal, me) {
        if (newVal == "-") {
            return true;
        }

        newVal = timeShift(updateTdValueFormat(newVal));

        if (((tdSelectdActualOnDutyTime || tdSelectdActualOnDutyDatetimeExtra) && newVal > "3600") ||
            ((tdSelectdActualOnDutyTime || tdSelectdActualOnDutyDatetimeExtra) && newVal < "2400" && newVal > nextVal()) ||
            ((tdSelectdActualOffDutyTime || tdSelectdActualOffDutyDatetimeExtra) && newVal < prevVal()) ||
            ((tdSelectdActualOnDutyTime || tdSelectdActualOffDutyTime) && tdValueActualOnDutyTime == "-" && tdValueActualOffDutyTime == "-") ||
            ((tdSelectdActualOnDutyDatetimeExtra || tdSelectdActualOffDutyDatetimeExtra) && tdValueActualOnDutyDatetimeExtra == "-" && tdValueActualOffDutyDatetimeExtra == "-")
        ) {
            commonService.alert({
                content: "输入的时间无效，请重新输入",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            isValid = false;
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            return false;
        } else {
            isOverlapNormalAndExtra(); //常规班次和零星加班是否重合
            //isInTwoHours(); //是否在排班时间2小时内
            return true;
        }
    }

    function timeFormatChecker(me, oldVal) {
        var val = me.find("input") ? me.find("input").val() : "";
        newVal = val == "" ? "-" : val;
        oldVal = oldVal == "" ? "-" : oldVal;

        if (newVal == "-" && oldVal == "-") {
            newVal = "-";
            cell.data(newVal);
            isValid = false;
            return false;
        } else if (newVal == "-" && oldVal != "-") {
            newVal = "-";
        } else if (newVal != "-" && newVal == oldVal) {
            isValid = false;
            return false;
        } else if (newVal != "-") {
            newVal = updateTdValueFormat(newVal);
            isTimeInRange(tdSelectdActualOnDutyTime, tdSelectdActualOnDutyDatetimeExtra, 36);  //开始时间是否小于24小时
            isTimeInRange(tdSelectdActualOffDutyTime, tdSelectdActualOffDutyDatetimeExtra, 36);  //结束时间是否小于36小时
        }

        if (isValid) {
            isHasSchedule(); //是否有排班
        }

        if (isValid && !timeValidChecker(newVal, me)) {  //时间是否有效
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            isValid = false;
            return;
        }

        if (isValid && newVal) {
            newVal = newVal != "-" ? updateTdValueFormat(newVal) : "-";  //时间格式化
            if (newVal != "-" && newVal != oldVal) {
                cell.data(newVal);
                var updateDutyDatetime = newVal;
                syncData(updateDutyDatetime);
            } else if (newVal == "-" && oldVal && oldVal != "-") {
                cell.data(newVal);
                var updateDutyDatetime = oldVal;
                syncData(updateDutyDatetime);
            } else {
                cell.data(oldVal);
            }
        }
        refreshTable();
    }

    function isOverlapNormalAndExtra() {
        if (isOverlapExtraToNormal()) {
            commonService.alert({
                content: "零星加班出勤不能和正常排班出勤重合",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            isValid = false;
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            return false;
        }
        else if (isOverlapNormalToExtra()) {
            commonService.alert({
                content: "正常排班出勤不能和零星加班出勤重合",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            isValid = false;
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            return false;
        }
    }

    function isInTwoHours() {
        if (!isInTwoHoursJudge()) {
            commonService.alert({
                content: "出勤时间必须在排班时间2小时范围内",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            isValid = false;
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            return false;
        } else {
            return true;
        }
        return true;
    }

    function isInTwoHoursJudge() {
        if ((tdSelectdActualOnDutyTime && tdValueActualOnDutyTime > inTwoHoursMin(tdValueOnDutyTime) && tdValueActualOnDutyTime < inTwoHoursMax(tdValueOnDutyTime)) ||
            (tdSelectdActualOnDutyDatetimeExtra && tdValueActualOnDutyDatetimeExtra > inTwoHoursMin(fragmentBeginDatetime) && tdValueActualOnDutyDatetimeExtra < inTwoHoursMax(fragmentBeginDatetime)) ||
            (tdSelectdActualOffDutyTime && tdValueActualOnDutyTime > inTwoHoursMin(tdValueOffDutyTime) && tdValueActualOnDutyTime < inTwoHoursMax(tdValueOffDutyTime)) ||
            (tdSelectdActualOffDutyDatetimeExtra && tdValueActualOnDutyDatetimeExtra > inTwoHoursMin(fragmentEndDatetime) && tdValueActualOnDutyDatetimeExtra < inTwoHoursMax(fragmentEndDatetime))) {
            return true;
        } else {
            return false;
        }
    }

    function isOverlapExtraToNormal() {
        if (((tdSelectdActualOnDutyDatetimeExtra && tdValueActualOnDutyTime <= tdValueActualOnDutyDatetimeExtra && tdValueActualOnDutyDatetimeExtra < tdValueActualOffDutyTime) ||
            (tdSelectdActualOnDutyDatetimeExtra &&
                ((tdValueActualOnDutyTime < tdValueActualOffDutyDatetimeExtra && tdValueActualOffDutyDatetimeExtra < tdValueActualOffDutyTime) ||
                (tdValueActualOnDutyTime < tdValueActualOnDutyDatetimeExtra && tdValueActualOnDutyDatetimeExtra < tdValueActualOffDutyTime) ||
                (tdValueActualOnDutyDatetimeExtra < tdValueActualOnDutyTime && tdValueActualOffDutyTime < tdValueActualOffDutyDatetimeExtra))
            )) ||
            ((tdSelectdActualOffDutyDatetimeExtra && tdValueActualOnDutyTime < tdValueActualOffDutyDatetimeExtra && tdValueActualOffDutyDatetimeExtra <= tdValueActualOffDutyTime) ||
                (tdSelectdActualOffDutyDatetimeExtra &&
                    ((tdValueActualOnDutyTime < tdValueActualOnDutyDatetimeExtra && tdValueActualOnDutyDatetimeExtra < tdValueActualOffDutyTime) ||
                    (tdValueActualOnDutyTime < tdValueActualOffDutyDatetimeExtra && tdValueActualOffDutyDatetimeExtra < tdValueActualOffDutyTime) ||
                    (tdValueActualOnDutyDatetimeExtra < tdValueActualOnDutyTime && tdValueActualOffDutyTime < tdValueActualOffDutyDatetimeExtra))
                )
            )) {
            return true;
        } else {
            return false;
        }
    }

    function isOverlapNormalToExtra() {
        if (((tdSelectdActualOnDutyTime && tdValueActualOnDutyDatetimeExtra <= tdValueActualOnDutyTime && tdValueActualOnDutyTime < tdValueActualOffDutyDatetimeExtra) ||
            (tdSelectdActualOnDutyTime &&
                ((tdValueActualOnDutyDatetimeExtra < tdValueActualOffDutyTime && tdValueActualOffDutyTime < tdValueActualOffDutyDatetimeExtra) ||
                (tdValueActualOnDutyDatetimeExtra < tdValueActualOnDutyTime && tdValueActualOnDutyTime < tdValueActualOffDutyDatetimeExtra) ||
                (tdValueActualOnDutyTime < tdValueActualOnDutyDatetimeExtra && tdValueActualOffDutyDatetimeExtra < tdValueActualOffDutyTime))
            )) ||
            ((tdSelectdActualOffDutyTime && tdValueActualOnDutyDatetimeExtra < tdValueActualOffDutyTime && tdValueActualOffDutyTime <= tdValueActualOffDutyDatetimeExtra) ||
                (tdSelectdActualOffDutyTime &&
                    ((tdValueActualOnDutyDatetimeExtra < tdValueActualOnDutyTime && tdValueActualOnDutyTime < tdValueActualOffDutyDatetimeExtra) ||
                    (tdValueActualOnDutyDatetimeExtra < tdValueActualOffDutyTime && tdValueActualOffDutyTime < tdValueActualOffDutyDatetimeExtra) ||
                    (tdValueActualOnDutyTime < tdValueActualOnDutyDatetimeExtra && tdValueActualOffDutyDatetimeExtra < tdValueActualOffDutyTime))
                )
            )) {
            return true;
        } else {
            return false;
        }
    }

    function isTimeInRange(OnOrOffDutyTime, OnOrOffDutyDatetimeExtra, timeLength) {
        if ((OnOrOffDutyTime || OnOrOffDutyDatetimeExtra) && ((newVal.indexOf(":") >= 0 && newVal.split(":")[0] > timeLength) || (newVal.indexOf(":") < 0 && newVal.substring(0, 2) > timeLength))) {
            commonService.alert({
                content: "请重新输入小于" + timeLength + "小时的时间范围",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            isValid = false;
            return;
        }
    }

    function updateTdValueFormat(newVal) {
        if (newVal.indexOf(":") >= 0 && newVal.split(":")[0].length <= 2 && newVal.split(":")[1].length <= 2) {
            var time1 = newVal.split(":")[0].length == 1 ? "0" + newVal.split(":")[0] : newVal.split(":")[0];
            var time2 = newVal.split(":")[1].length == 1 ? "0" + newVal.split(":")[1] : newVal.split(":")[1];
            newVal = time1 + ":" + time2;
        } else if (newVal.indexOf(":") < 0 && newVal.length == 1) {
            newVal = "0" + newVal + ":00";
        } else if (newVal.indexOf(":") < 0 && newVal.length == 2) {
            newVal = newVal + ":00";
        } else if (newVal.indexOf(":") < 0 && newVal.length == 3) {
            newVal = "0" + newVal.substring(0, 1) + ":" + newVal.substring(1, 3);
        } else if (newVal.indexOf(":") < 0 && newVal.length == 4) {
            newVal = newVal.substring(0, 2) + ":" + newVal.substring(2, 4);
        } else if (((newVal.indexOf(":") < 0 && newVal.length > 4) || (newVal.indexOf(":") >= 0 && (newVal.split(":")[0].length > 2 || newVal.split(":")[1].length > 2)))) {
            commonService.alert({
                content: "输入的时间格式无效，请重新输入",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            isValid = false;
            return;
        }
        return newVal;
    }

    function isHasSchedule() {
        if (((tdSelectdActualOnDutyTime || tdSelectdActualOffDutyTime) && tdValueOnDutyTime == "-" && tdValueOffDutyTime == "-") ||
            ((tdSelectdActualOnDutyDatetimeExtra || tdSelectdActualOffDutyDatetimeExtra) && fragmentBeginDatetime == "-" && fragmentEndDatetime == "-")) {
            newVal = "-";
            cell.data(newVal);
            commonService.alert({
                content: "没有排班时，无法编辑出勤",
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            newVal = oldVal != "-" ? oldVal : "-";
            cell.data(newVal);
            return false;
        }
    }

    function refreshTable() {
        dataTable.columns.adjust();
    }

    function syncData(updateDutyDatetime) {
        var scheduleId = getData(row, tableColumns.id);
        var data = {
            "actualOnDutyDatetimeExtra": getData(row, tableColumns.actualOnDutyDatetimeExtra),
            "actualOffDutyDatetimeExtra": getData(row, tableColumns.actualOffDutyDatetimeExtra),
            "actualOnDutyTime": getData(row, tableColumns.actualOnDutyTime),
            "actualOffDutyTime": getData(row, tableColumns.actualOffDutyTime),
            "updateDutyDatetime": updateDutyDatetime
        };
        $http.post(apiBaseUrl + "/attendance-results/" + scheduleId, data, {headers: utils.generateHeaders()})
            .success(function (attendanceCheck, status) {
                if (status == 200) {
                    setData(row, tableColumns.actualOnDutyDatetimeExtra, formatData(attendanceCheck.actualOnDutyDatetimeExtra));
                    setData(row, tableColumns.actualOffDutyDatetimeExtra, formatData(attendanceCheck.actualOffDutyDatetimeExtra));
                    setData(row, tableColumns.actualOnDutyTime, formatData(attendanceCheck.actualOnDutyTime));
                    setData(row, tableColumns.actualOffDutyTime, formatData(attendanceCheck.actualOffDutyTime));
                    setData(row, tableColumns.overtimeOnWorkingDay, formatData(attendanceCheck.overtime.durationOnWorkingDay));
                    setData(row, tableColumns.overtimeOnOffDay, formatData(attendanceCheck.overtime.durationOnOffDay));
                    setData(row, tableColumns.overtimeOnHoliday, formatData(attendanceCheck.overtime.durationOnHoliday));
                    setData(row, tableColumns.lateDuration, formatData(attendanceCheck.lateDuration));
                    setData(row, tableColumns.earlierLeaveDuration, formatData(attendanceCheck.earlierLeaveDuration));
                    setData(row, tableColumns.absentDuration, formatData(attendanceCheck.absentDuration));
                    setData(row, tableColumns.workingDuration, formatData(attendanceCheck.workingDuration));
                    setData(row, tableColumns.lieuLeaveDuration, formatData(attendanceCheck.lieuLeaveDuration));
                    setData(row, tableColumns.lieuLeaveBeginDate, formatData(attendanceCheck.lieuLeaveBeginDate));
                    setData(row, tableColumns.lieuLeaveEndDate, formatData(attendanceCheck.lieuLeaveEndDate));
                } else {
                    commonService.alert({
                        content: attendanceCheck.errorMessage,
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                }
            }).error(function (data, status, headers, config) {
                commonService.alert({
                    'content': '保存失败，请重试',
                    'icon': 'fa-exclamation-circle',
                    'iconColor': 'icon-red'
                });
            });
    }

    function inTwoHoursMin(time) {
        var tmp;
        if (time < 200) {
            tmp = 0;
        } else {
            tmp = time - 200;
        }
        return tmp;
    }

    function inTwoHoursMax(time) {
        return time + 200;
    }

    function getData(row, col) {
        var data = dataTable.cell(row, col).data();
        return data == "-" ? "" : data;
    }

    function setData(row, col, data) {
        dataTable.cell(row, col).data(data);
    }

    function formatData(data) {
        return data ? data : "-";
    }

    function nextVal() {
        var value = me.next().find("input") ? me.next().find("input").val() : "-";
        return timeShift(value);
    }

    function prevVal() {
        var value = me.prev().find("input") ? me.prev().find("input").val() : "-";
        return timeShift(value);
    }

    function nthTdValue(index) {
        var value = me.parent().children().eq(index).find("input").length > 0 ?
            me.parent().children().eq(index).find("input").val() :
            me.parent().children().eq(index)[0].innerHTML;
        value = value != "-" ? timeShift(updateTdValueFormat(value)) : "-";
        return value;
    }

    function timeShift(time) {
        time = (time != "" && time != "-" && time != undefined) ? time.split(":").join("") : "-";
        time = Number(time);
        return time;
    }

    $scope.search = function () {
        var selectedDates = commonService.getSelectedDates();
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "attendanceStatus": $scope.selectedStatus,
            "abnormalAttendanceType": $scope.selectedType,
            "jobStatus": $scope.jobStatus,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId'),
        };
        dataTableFactory.dataTableSearch(tableName, data);
        commonService.storageSearchStatus($scope, {
            selectedCompanies: $scope.selectedCompanies,
            selectedDepartments: $scope.selectedDepartments,
            departments: $scope.departments,
            selectedGroups: $scope.selectedGroups,
            beginDate: selectedDates.beginDate,
            endDate: selectedDates.endDate,
            keywords: $scope.keywords,
            jobStatus: $scope.jobStatus,
            selectedStandardWorkJobs: $scope.selectedStandardWorkJobs
        });
    };

    $scope.export = exportAttendanceCheck;

    function exportAttendanceCheck() {
        var selectedDates = commonService.getSelectedDates();
        if (null == selectedDates.beginDate || null == selectedDates.endDate || undefined == selectedDates.beginDate || undefined == selectedDates.endDate) {
            commonService.alert({
                content: '请选择开始时间和结束时间',
                icon: "fa-exclamation-circle",
                iconColor: "icon-red"
            });
            return;
        }
        var data = {
            "departments": _.pluck($scope.selectedDepartments, 'department_id'),
            "workingGroups": _.pluck($scope.selectedGroups, 'work_group_id'),
            "beginDate": selectedDates.beginDate,
            "endDate": selectedDates.endDate,
            "keywords": $scope.keywords,
            "attendanceStatus": $scope.selectedStatus,
            "abnormalAttendanceType": $scope.selectedType,
            "jobStatus": $scope.jobStatus,
            "standardWorkJobs": _.pluck($scope.selectedStandardWorkJobs, 'workJobId')
        };
        attendanceTaskService.exportAttendanceCheck(data);
    }

    /*
        commonService.createModal({
            'templateUrl': 'exportAttendance.html',
            'controller': 'ExportAttendanceController',
            'resolve': {
                'params': function () {
                    return data;
                }
            }
        });
     */
}]);


/*VkrmsApp.controller('ExportAttendanceController', ['$scope', '$modalInstance', 'AttendanceTaskService', 'params', function ($scope, $modalInstance, attendanceTaskService, params) {

    $scope.exportDetail = function () {
        attendanceTaskService.exportAttendanceDetail(params);
        $modalInstance.close();
    };

    $scope.exportAbnormalSummary = function () {
        attendanceTaskService.exportAbnormalAttendanceSummary(params);
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

 }]);*/
