/**
 * Created by wangq34 on 2016/8/29.
 * Modified by ushio on 2017/6/13.
 */
(function () {
    'use strict';

    angular
        .module('vkrmsApp')
        .controller('FastScheduleCtrl', FastScheduleCtrl);

    FastScheduleCtrl.$inject = ['FastScheduleService', '$timeout', 'CommonService', '$location', '$rootScope', '$filter'];

    function FastScheduleCtrl(FastScheduleService, $timeout, commonService, $location, $rootScope, $filter) {
        var fsc = this;

        $rootScope.loading = false;

        fsc.tableSelect = tableSelect;
        fsc.addSchedule = addSchedule;
        fsc.deleteRule = deleteRule;
        fsc.searchPosts = searchPosts;
        fsc.searchShifts = searchShifts;
        fsc.searchEmployees = searchEmployees;
        fsc.getExtraRules = getExtraRules;
        fsc.save = save;
        fsc.checkDay = checkDay;
        fsc.back = back;
        fsc.searchAll = searchAll;
        init();

        function init() {
            if (sessionStorage['fastSchedule']) {
                fsc.department = JSON.parse(sessionStorage['fastSchedule']).department[0];
                fsc.company = JSON.parse(sessionStorage['fastSchedule']).company[0];
                fsc.onLineRmDate = JSON.parse(sessionStorage['fastSchedule']).onLineRmDate;
            } else {
                $location.path('/super-schedules');
            }

            fsc.rules = [];
            fsc.selectedJob = [];
            fsc.oldBeginDay = '';
            fsc.oldEndDay = '';

            fsc.typeDictionary = {'0': '工作日', '1': '休息日', '2': '法定节假日', '3': '月休'};
            var params = {
                departments: [fsc.department.department_id]
            };
            commonService
                .getWorkJob(params)
                .then(function (standardWorkJobs) {
                    fsc.jobs = standardWorkJobs;
                    $timeout(function () {
                        $('#selectJob').selectpicker();
                    }, 0);
                });

            $('.datepicker').datepicker({
                language: 'zh-CN',
                clearBtn: true,
                autoclose: true,
                format: "yyyy年mm月dd日",
                todayHighlight: true
            });
        }

        function back() {
            $location.path('/super-schedules');
        }

        function getExtraRules () {
            var extraData = {
                startTime: transferDateTo(fsc.beginDay),
                endTime: transferDateTo(fsc.endDay),
                departmentId: fsc.department.department_id
            };
            FastScheduleService
                .getExtraRules(extraData)
                .then(function (response) {
                    if (response && response.length > 0) {
                        var content = '以下岗位的排班时间范围内，包含不同日期的上岗规则，这些岗位将在所选时段内不能使用快速排班。';
                        for (var i = 0; i < response.length; i++) {
                            content += '<br>' + response[i].postShortName;
                        }
                        commonService.confirm({
                            content: content,
                            ok: function () {
                                fsc.posts = [];
                                fsc.shifts = [];
                                fsc.employees = [];
                            },
                            okText: '继续排班',
                            cancelText: '重新选择排班时间范围',
                            cancel: function () {
                                fsc.posts = [];
                                fsc.shifts = [];
                                fsc.employees = [];
                                fsc.beginDay = '';
                                fsc.endDay = '';
                                fsc.oldBeginDay = '';
                                fsc.oldEndDay = '';
                            }
                        });
                    }
                });
        }

        function searchAll() {
            if ((fsc.oldBeginDay || fsc.oldEndDay) && fsc.rules.length > 0) {
                if (!checkDay(true)) {
                    return false
                }
                commonService.confirm({
                    content: '重新选择日期，将清空本次已经添加的排班，是否重新选择？',
                    okText: '是',
                    cancelText: '否',
                    callback: function () {
                        if (!(fsc.beginDay && fsc.endDay)) {
                            return;
                        }
                        searchPosts();
                        searchShifts();
                        searchEmployees();
                        fsc.rules = []
                        fsc.getExtraRules();
                    },
                    cancel: function () {
                        fsc.beginDay = fsc.oldBeginDay
                        fsc.endDay = fsc.oldEndDay
                    }
                });
            } else {
                if (!(fsc.beginDay && fsc.endDay)) {
                    return;
                }
                if (!fsc.oldBeginDay || !fsc.oldEndDay) {
                }
                fsc.oldBeginDay = fsc.beginDay;
                fsc.oldEndDay = fsc.endDay;
                if (!checkDay(true)) {
                    return false
                }
                fsc.getExtraRules();
                searchPosts('clear');
                searchShifts('clear');
                searchEmployees('clear');
            }
        }
        function checkDay(isCheckEmpty) {
            if (isCheckEmpty && !(fsc.beginDay && fsc.endDay)) {
                commonService.alert({
                    content: '请输入排班范围！',
                    icon: "fa-exclamation-circle",
                    size: 'lg'
                });
                return false;
            }
            if ((Date.parse(transferDateTo(fsc.endDay)) - Date.parse(transferDateTo(fsc.beginDay))) / 3600 / 1000 / 24 > 30) {
                commonService.alert({
                    content: '只能排一个月内的排班，请重新输入',
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            if (fsc.beginDay > fsc.endDay) {
                commonService.alert({
                    content: '排班范围输入有误，请重新输入',
                    icon: "fa-exclamation-circle"
                });
                return false;
            }
            return true;
        }

        function transferDateTo(entryDate) {
            if (null != entryDate && "" != entryDate) {
                var dataArr0 = entryDate.split("年"),
                    dataArr1 = dataArr0[1].split("月"),
                    dataArr2 = dataArr1[1].split("日");
                return dataArr0[0] + '-' + dataArr1[0] + "-" + dataArr2[0];
            }
            return entryDate;
        }

        function save(data) {
            if (!checkDay(true)) {
                return false
            }
            if (!data) {
                data = {
                    beginDay: transferDateTo(fsc.beginDay),
                    endDay: transferDateTo(fsc.endDay),
                    isForceSave: false,
                    rules: getFormatRules()
                };
            }
            FastScheduleService
                .saveFastSchedule(data)
                .then(function (response) {
                    if (response.status == 'checkFail') {
                        commonService.confirm({
                            content: response.errorMessage,
                            callback: function () {
                                data.isForceSave = true;
                                save(data);
                            }
                        });
                        return false;
                    }
                    if (response.status == 'fail') {
                        commonService.alert({
                            content: response.errorMessage,
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                        return false;
                    }
                    if (response.status == 'success' || response.status == 'IntersectionWithOutSave' || response.status == 'SchedulingTimeCannotFoundShift') {
                        commonService.alert({
                            content: response.data || "",
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red",
                            size: 'lg'
                        });
                        fsc.rules = [];
                        return false;
                    }
                });
        }

        function getFormatRules() {
            var result = [];
            angular.forEach(fsc.rules, function (rule) {
                result.push({
                    postId: rule.post.postId,
                    shiftId: rule.shift.shiftId,
                    employeeId: rule.employee.id,
                    type: rule.shift.type
                });
                if (rule.shift.relatedShift) {
                    result.push({
                        postId: rule.post.postId,
                        shiftId: rule.shift.relatedShift.shiftId,
                        employeeId: rule.employee.id,
                        type: rule.shift.relatedShift.type
                    })
                }
            });
            return result;
        }

        //arr-查询结果，ele-选中的元素
        function holdSelectedRowState(arr, ele) {
            if (ele) {
                if (ele instanceof Array) {
                    angular.forEach(ele, function (e) {
                        delete e.selected;
                        angular.forEach(arr, function (a) {
                            if (JSON.stringify(a) == JSON.stringify(e)) {
                                a.selected = true;
                            }
                        });
                    })
                } else {
                    delete ele.selected;
                    angular.forEach(arr, function (a) {
                        if (JSON.stringify(a) == JSON.stringify(ele)) {
                            a.selected = true;
                        }
                    });
                }
            }
            return arr;
        }

        function searchPosts(clearParam) {
            if (!checkDay(true)) {
                return false
            }
            var params = getParams();
            if (clearParam == 'clear') {
                params.postId = null;
                params.shiftId = null;
                params.workJobIds = null;
            }
            commonService.progress('start');
            FastScheduleService
                .getPosts(angular.extend(params, {
                    postShortName: fsc.postShortName,
                    beginDay: transferDateTo(fsc.beginDay),
                    endDay: transferDateTo(fsc.endDay)
                }))
                .then(function (response) {
                    commonService.progress('end');
                    fsc.posts = holdSelectedRowState(response, getSelectedPost());
                });
        }

        function searchShifts(clearParam) {
            if (!checkDay(true)) {
                return false
            }
            var params = getParams();
            if (clearParam == 'clear') {
                params.postId = null;
                params.shiftId = null;
                params.workJobIds = null;
            }
            commonService.progress('start');
            FastScheduleService
                .getShifts(angular.extend(params, {
                    label: fsc.label,
                    beginDay: transferDateTo(fsc.beginDay),
                    endDay: transferDateTo(fsc.endDay)
                }))
                .then(function (response) {
                    fsc.shifts = holdSelectedRowState(response, getSelectedShift());
                    commonService.progress('end');
                });
        }

        function searchEmployees(clearParam) {
            if (!checkDay(true)) {
                return false
            }
            var params = getParams();
            if (clearParam == 'clear') {
                params.postId = null;
                params.shiftId = null;
                params.workJobIds = null;
            }
            commonService.progress('start');
            FastScheduleService
                .getEmployees(angular.extend(params, {
                    keyword: fsc.keyword,
                    selectedWorkJobIds: fsc.selectedJob.map(function (obj) {
                        return obj.workJobId
                    }),
                    beginDay: transferDateTo(fsc.beginDay),
                    endDay: transferDateTo(fsc.endDay)
                }))
                .then(function (response) {
                    fsc.employees = holdSelectedRowState(response, getSelectedEmployees());
                    commonService.progress('end');
                });
        }

        function getParams() {
            var post = getSelectedPost();
            var shift = getSelectedShift();
            var employees = getSelectedEmployees();
            return {
                departmentId: fsc.department.department_id,   //fsc.department.department_id,
                postId: post ? post.postId : null,
                shiftId: shift ? shift.shiftId : null,
                workJobIds: employees && employees.length > 0 ? employees.map(function (obj) {
                    return obj.jobId;
                }) : null
            }
        }

        function getSelectedPost() {
            var selectedPost = undefined;
            angular.forEach(fsc.posts, function (post) {
                if (post.selected) {
                    selectedPost = post;
                }
            });
            return selectedPost;
        }

        function getSelectedShift() {
            var selectedShift = undefined;
            angular.forEach(fsc.shifts, function (shift) {
                if (shift.selected) {
                    selectedShift = shift;
                }
            });
            return selectedShift;
        }

        function getSelectedEmployees() {
            var selectedEmployees = [];
            angular.forEach(fsc.employees, function (employee) {
                if (employee.selected) {
                    selectedEmployees.push(employee);
                }
            });
            return selectedEmployees;
        }

        function deleteRule(rule) {
            fsc.rules = fsc.rules.filter(function (value) {
                return value != rule
            });
            //determine whether to remove the warning state when delete;
            checkRules(fsc.rules, rule);
        }

        function checkRules(arr, obj) {
            var tmp = [], result = true;

            //if the delete rule's time is overlap
            if (obj.selected) {

                //if arr exists the same employee's else rule,filter to tmp array.
                angular.forEach(arr, function (a) {
                    if (a.selected && a.employee.id == obj.employee.id) {
                        tmp.push(a);
                    }
                });

                //sort by onDutyTime
                tmp.sort(function (a, b) {
                    if (a.shift.onDutyTime < b.shift.onDutyTime) {
                        return 1;
                    }
                });

                //if the employee's remain rules > 1, to judge whether or not to repeat.
                if (tmp.length > 1) {
                    angular.forEach(tmp, function (t, index) {
                        if (!timeOverlap(t[index], t[index + 1])) {
                            result = false;
                        }
                    });
                } else {
                    tmp[0].selected = false;
                }
            }
            return result;
        }

        //add able to select row function
        function tableSelect(arr, obj, isMultiselect) {
            if (isMultiselect && isMultiselect.toLowerCase() == 'multiselect') {
                obj.selected = !obj.selected;
            } else {
                var originSelected = undefined;
                angular.forEach(arr, function (a) {
                    if (a.selected) {
                        originSelected = a;
                    }
                    a.selected = false;
                });
                //
                if (originSelected != obj) {
                    obj.selected = true;
                }
            }
        }

        function addSchedule() {
            var employees = getSelectedEmployees();
            for(var i=0;i<employees.length;i++){
                if (!employees[i].workHours) {
                    commonService.alert({
                        content: employees[i].employeeName + '的工时制为空，无法进行排班。请在人员信息管理界面对其设置。',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                    return
                }
                if(employees[i].salaryType){
                    var temp = employees[i].salaryType.replace(/(^\s*)|(\s*$)/g, '');
                    if (temp != '04' && temp != '05') {
                        commonService.alert({
                            content: employees[i].employeeName + '的工资类别未标识，无法进行排班。请在人员信息管理界面对其工资类别进行标识。',
                            icon: "fa-exclamation-circle",
                            iconColor: "icon-red"
                        });
                        return
                    }
                }else{
                    commonService.alert({
                        content: employees[i].employeeName + '的工资类别未标识，无法进行排班。请在人员信息管理界面对其工资类别进行标识。',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                    return
                }
            }
            if (!fsc.onLineRmDate) {
                commonService.alert({
                    icon: 'fa-exclamation-circle',
                    content: '该项目未上线RM，暂不能排班'
                });
                return false;
            }
            if (fsc.beginDay && fsc.endDay) {

                var date = transferDateTo(fsc.beginDay);

                if (new Date(date.replace(/-/g, "/")) < new Date(fsc.onLineRmDate.replace(/-/g, "/"))) {
                    commonService.alert({
                        content: '该项目' + fsc.onLineRmDate + '上线RM，之前日期无法操作排班管理，请重新选择排班日期',
                        icon: "fa-exclamation-circle",
                        iconColor: "icon-red"
                    });
                    return
                }
            }
            angular.forEach(fsc.employees, function (employee) {
                var post = getSelectedPost();
                var shift = getSelectedShift();
                if (post && shift) {
                    if (employee.selected) {
                        var insert = {
                            id: post.postId + ',' + shift.shiftId + ',' + employee.id,
                            post: post,
                            shift: shift,
                            employee: employee
                        };
                        var unique = true, isOverlap = false;
                        angular.forEach(fsc.rules, function (rule) {
                            if (rule.id == insert.id && rule.shift.type == insert.shift.type) {
                                unique = false;
                            }
                            if (unique) {
                                if (rule.employee.id == insert.employee.id && rule.shift.type == insert.shift.type) {
                                    if (!timeOverlap(rule, insert)) {
                                        isOverlap = true;
                                    }
                                }
                            }
                        });
                        if (unique && !isOverlap) {
                            fsc.rules.unshift(insert);
                        }
                    }
                }
            });
        }

        function timeOverlap(origin, insert) {
            if (insert.shift.onDutyTime >= origin.shift.onDutyTime && insert.shift.onDutyTime < origin.shift.offDutyTime
                || insert.shift.offDutyTime > origin.shift.onDutyTime && insert.shift.offDutyTime <= origin.shift.offDutyTime) {
                commonService.alert({
                    content: '班次时间有重叠,请确认后重排!',
                    icon: "fa-exclamation-circle",
                    iconColor: "icon-red"
                });
                //origin.selected = true;
                //insert.selected = true;
                return false;
            }
            origin.selected = false;
            insert.selected = false;
            return true;
        }
    }
})();
