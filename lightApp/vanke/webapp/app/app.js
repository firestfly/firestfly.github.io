'use strict';

(function (w) {

    var vkrmsApp = angular.module('vkrmsApp', ['ngRoute', 'xeditable', 'ui.bootstrap', 'ui.bootstrap', 'ngSanitize', 'angular-drag', 'ui-rangeSlider', 'rzModule', 'scrollable-table', 'ui.grid', 'ui.grid.pinning', 'ui.grid.selection']);
    vkrmsApp
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'partials/common/welcome.html',
                    controller: 'indexPageController',
                    data: {
                        isPageTitleShow: false
                    }
                }).
                when('/employees', {
                    templateUrl: 'partials/employees.html',
                    controller: 'EmployeeController',
                    data: {
                        pageTitle: "人员管理-人员信息管理"
                    }
                }).
                when('/employees-see', {
                    templateUrl: 'partials/employees.html',
                    controller: 'EmployeeController',
                    data: {
                        pageTitle: "人员管理-人员信息查看"
                    }
                }).
                when('/employee-create', {
                    templateUrl: 'partials/employees-create-save.html',
                    controller: 'EmployeeCreateController',
                    data: {
                        pageTitle: "人员管理－新增人员"
                    }
                }).
                when('/employee-edit', {
                    templateUrl: 'partials/employees-create-save.html',
                    controller: 'EmployeeEditController',
                    data: {
                        pageTitle: "人员管理－修改人员"
                    }
            })
                .when('/department-info-view', {
                    templateUrl: 'partials/department-info-view.html',
                    controller: 'DepartmentInfoViewController',
                    data: {
                        pageTitle: "部门管理－部门信息管理"
                    }
                }).
                when('/employee', {
                    templateUrl: 'partials/employees-view.html',
                    controller: 'EmployeeViewController',
                    data: {
                        pageTitle: "人员管理－查看人员"
                    }
                }).
                when('/task-point-rules', {
                    templateUrl: 'partials/task-point-rules.html',
                    controller: 'TaskRuleController',
                    data: {
                        pageTitle: "财富值管理-任务积分规则设置"
                    }
                }).
                when('/task-point-view', {
                    templateUrl: 'partials/task-point-view.html',
                    controller: 'TaskPointViewController',
                    data: {
                        pageTitle: "财富值管理-任务财富值查看"
                    }
                }).
                when('/task-point-view-employee', {
                    templateUrl: 'partials/task-point-view.html',
                    controller: 'TaskPointViewController',
                    data: {
                        pageTitle: "财富值管理-任务财富值查看"
                    }
                }).
                when('/task-point-rules-authority', {
                    templateUrl: 'partials/task-point-rules-authority.html',
                    controller: 'TaskPointRuleAuthorityController',
                    data: {
                        pageTitle: "任务积分规则设置-设置组织范围"
                    }
                }).
                when('/task-point-rules-config', {
                    templateUrl: 'partials/task-point-rules-config.html',
                    controller: 'TaskPointRuleConfigController',
                    data: {
                        pageTitle: "任务积分规则设置 - 设置积分规则"
                    }
                }).
                when('/job-incentive-rules', {
                    templateUrl: 'partials/job-incentive-rules.html',
                    controller: 'TaskRuleController',
                    data: {
                        pageTitle: "财富值管理-积分兑换规则设置"
                    }
                }).
                when('/job-incentive-rules-authority', {
                    templateUrl: 'partials/job-point-rules-authority.html',
                    controller: 'JobPointRuleAuthorityController',
                    data: {
                        pageTitle: "财富值管理-积分兑换规则设置-设置组织范围"
                    }
                }).
                when('/job-incentive-rules-config', {
                    templateUrl: 'partials/job-incentive-rules-config.html',
                    controller: 'JobIncentiveRuleConfigController',
                    data: {
                        pageTitle: "财富值管理-积分兑换规则设置-设置提成规则"
                    }
                }).
                when('/task-report', {
                    templateUrl: 'partials/task-report.html',
                    controller: 'TaskReportController',
                    data: {
                        pageTitle: "财富值管理-单项任务积分查看"
                    }
                }).
                when('/task-incentive-monthly-report', {
                    templateUrl: 'partials/task-incentive-monthly-report.html',
                    controller: 'TaskIncentiveController',
                    data: {
                        pageTitle: "财富值管理-积分兑换信息查看"/*,
                         pageSubTitle: "请选择筛选条件后查询"*/
                    }
                }).
                when('/repair-wealth-rule', {
                    templateUrl: 'partials/repair-wealth-rule.html',
                    controller: 'RepairWealthRuleController',
                    controllerAs: 'rc',
                    data: {
                        pageTitle: "财富值管理-维修财富值规则总设置"
                    }
                }).
                when('/order-coefficient-setting', {
                    templateUrl: 'partials/order-coefficient-setting.html',
                    controller: 'OrderCoefficientSettingController',
                    controllerAs: 'ocsc',
                    data: {
                        pageTitle: "财富值管理-工单任务调节系数"
                    }
                }).
                when('/wealth-convert-rule-setting', {
                    templateUrl: 'partials/wealth-convert-rule-setting.html',
                    controller: 'WealthConvertRuleSettingController',
                    controllerAs: 'wcrsc',
                    data: {
                        pageTitle: "财富值管理-财富值兑换规则设置"
                    }
                }).
                when('/wealth-convert-rule-check', {
                    templateUrl: 'partials/wealth-convert-rule-check.html',
                    controller: 'WealthConvertRuleCheckController',
                    controllerAs: 'wcrcc',
                    data: {
                        pageTitle: "财富值管理-财富值兑换查看"
                    }
                }).
                when('/wealth-convert-rule-detail', {
                    templateUrl: 'partials/wealth-convert-rule-detail.html',
                    controller: 'WealthConvertRuleDetailController',
                    data: {
                        pageTitle: "财富值管理-财富值明细查看"
                    }
                }).
                /*when('/wealth-lock-cycle', {
                 templateUrl: 'partials/wealth-lock-cycle.html',
                 controller: 'WealthLockCycleController',
                 data: {
                 pageTitle: "财富值定案周期设置"
                 }
                 }).*/
                when('/wealth-lock', {
                    templateUrl: 'partials/wealth-lock.html',
                    controller: 'WealthLockController',
                    data: {
                        pageTitle: "财富值管理-财富值定案"
                    }
                }).
                when('/wealth-unlock', {
                    templateUrl: 'partials/wealth-unlock.html',
                    controller: 'WealthLockController',
                    data: {
                        pageTitle: "财富值管理-财富值解定案"
                    }
                }).
                when('/not-task-wealth', {
                    templateUrl: 'partials/not-task-wealth.html',
                    controller: 'NotTaskWealthController',
                    data: {
                        pageTitle: "财富值管理-非任务财富值查看"
                    }
                }).
                when('/not-task-wealth-employee', {
                    templateUrl: 'partials/not-task-wealth.html',
                    controller: 'NotTaskWealthController',
                    data: {
                        pageTitle: "财富值管理-非任务财富值查看"
                    }
                }).
                when('/not-task-wealth/input', {
                    templateUrl: 'partials/not-task-wealth-input.html',
                    controller: 'NotTaskWealthInputController',
                    data: {
                        pageTitle: "财富值管理-非任务财富值录入"
                    }
                }).
                when('/not-task-wealth/setting', {
                    templateUrl: 'partials/not-task-wealth-setting.html',
                    controller: 'NotTaskWealthSettingController',
                    data: {
                        pageTitle: "财富值管理-非任务财富值规则设置"
                    }
                }).
                when('/experience-search', {
                    templateUrl: 'partials/experience-search.html',
                    controller: 'ExperienceSearchController',
                    controllerAs: 'esec',
                    data: {
                        pageTitle: "经验值管理-经验值查询"
                    }
                }).
                when('/experience-verify', {
                    templateUrl: 'partials/experience-verify.html',
                    controller: 'ExperienceVerifyController',
                    controllerAs: 'evc',
                    data: {
                        pageTitle: "经验值管理-经验值审核"
                    }
                }).
                when('/experience-summarizing', {
                    templateUrl: 'partials/experience-summarizing.html',
                    controller: 'ExperienceSummarizingController',
                    controllerAs: 'esuc',
                    data: {
                        pageTitle: "经验值管理-经验值汇总"
                    }
                }).
                when('/experience-enter', {
                    templateUrl: 'partials/experience-enter.html',
                    controller: 'experienceEnterController',
                    controllerAs: 'exp',
                    data: {
                        pageTitle: "经验值管理-经验值录入/查询"
                    }
                }).
                when('/experience-setting', {
                    templateUrl: 'partials/experience-setting.html',
                    controller: 'ExperienceSettingController',
                    data: {
                        pageTitle: "经验值管理-经验值规则设置"
                    }
                }).
                when('/experience-input', {
                    templateUrl: 'partials/experience-input.html',
                    controller: 'ExperienceInputController',
                    controllerAs: 'exi',
                    data: {
                        pageTitle: "经验值管理-经验值录入"
                    }
                }).
                when('/lieu-quota', {
                    templateUrl: 'partials/lieu-quota.html',
                    controller: 'LieuQuotaController',
                    controllerAs: 'lqc',
                    data: {
                        pageTitle: "考勤管理-额度明细查看-月休、调休假明细"
                    }
                }).
                when('/lieu-detail', {
                    templateUrl: 'partials/lieu-detail.html',
                    controller: 'LieuDetailController',
                    controllerAs: 'ldc',
                    data: {
                        pageTitle: '考勤管理-额度明细查看'
                    }
                }).
                when('/lieu-line-setting', {
                    templateUrl: 'partials/lieu-line-setting.html',
                    controller: 'LieuLineController',
                    controllerAs: 'llc',
                    data: {
                        pageTitle: "考勤管理-标准工时制休假规则设置"
                    }
                })
                .when('/other-holiday-balance', {
                    templateUrl: 'partials/other-holiday-balance.html',
                    controller: 'otherHolidayBalanceController',
                    controllerAs: 'ohb',
                    data: {
                        pageTitle: "考勤管理-休假额度设置"
                    }
                })
                .when('/other-holiday-balance-check', {
                    templateUrl: 'partials/other-holiday-balance-check.html',
                    controller: 'otherHolidayBalanceCheckController',
                    controllerAs: 'ohb',
                    data: {
                        pageTitle: "考勤管理-额度明细查看-其它休假明细"
                    }
                })
                .when('/leave-records-list', {
                    templateUrl: 'partials/leave-records-list.html',
                    controller: 'LeaveRecordsListController',
                    controllerAs: 'leaveRecordsList',
                    data: {
                        pageTitle: "考勤管理-休假明细查看"
                    }
                })
                .when('/leave-approve-list', {
                    templateUrl: 'partials/leave-approve-list.html',
                    controller: 'LeaveApproveListController',
                    controllerAs: 'lal',
                    data: {
                        pageTitle: "考勤管理-休假审批概览"
                    }
                })
                .when('/white-list', {
                    templateUrl: 'partials/white-list.html',
                    controller: 'WhiteListController',
                    data: {
                        pageTitle: "考勤管理-白名单录入"
                    }
                })
                .when('/shift-group', {
                    templateUrl: 'partials/shift-group.html',
                    controller: 'ShiftGroupController',
                    data: {
                        pageTitle: "考勤管理-班次组设置"
                    }
                }).
                when('/shift-group-authority/:shiftGroupId', {
                    templateUrl: 'partials/shift-group-authority.html',
                    controller: 'ShiftGroupAuthorityController',
                    data: {
                        pageTitle: "考勤管理-班次组设置-设置组织范围"
                    }
                }).
                when('/shifts-config/:shiftGroupId', {
                    templateUrl: 'partials/shifts-config.html',
                    controller: 'ShiftController',
                    data: {
                        pageTitle: "考勤管理-班次设置"
                    }
                }).
                when('/shift-view', {
                    templateUrl: 'partials/shift-view.html',
                    controller: 'ShiftViewController',
                    data: {
                        pageTitle: "考勤管理-班次查看"
                    }
                }).
                when('/overtime-shifts-config', {
                    templateUrl: 'partials/overtime-shifts-config.html',
                    controller: 'OvertimeShiftController',
                    data: {
                        pageTitle: "考勤管理-班次设置"
                    }
                }).
                when('/view-overtime-shifts-config', {
                    templateUrl: 'partials/view-overtime-shifts-config.html',
                    controller: 'OvertimeShiftController',
                    data: {
                        pageTitle: "考勤管理-班次查看"
                    }
                }).
                when('/switch-shift', {
                    templateUrl: 'partials/switch-shift.html',
                    controller: 'SwitchShiftController',
                    data: {
                        pageTitle: "考勤管理-倒班管理"
                    }
                }).
                when('/public-holiday', {
                    templateUrl: 'partials/public-holiday-list.html',
                    controller: 'PublicHolidayController',
                    data: {
                        pageTitle: "考勤管理-法定假期设置"
                    }
            }).when('/public-holiday-set', {
                templateUrl: 'partials/public-holiday-set.html',
                controller: 'PublicHolidaySetController',
                data: {
                    pageTitle: "考勤管理-法定假期设置"
                    }
                }).
                when('/attendance-abnormality-ruleset', {
                    templateUrl: 'partials/attendance-abnormality-ruleset.html',
                    controller: 'AttendanceAbnormalityRulesetController',
                    data: {
                        pageTitle: "考勤管理-异常出勤规则设置"
                    }
                }).
                when('/duty-fees-setting', {
                    templateUrl: 'partials/duty-fees-setting.html',
                    controller: 'DutyFeesSettingController',
                    controllerAs: 'df',
                    data: {
                        pageTitle: "考勤管理-值班费标准设置"
                    }
                }).
                when('/experience', {
                    templateUrl: 'partials/experience-ruleset.html',
                    controller: 'ExperienceRulesetController',
                    controllerAs: 'er',
                    data: {
                        pageTitle: "考勤管理-上岗要求设置"
                    }
                }).
                when('/fast-schedules', {
                    templateUrl: 'partials/fast-schedules.html',
                    controller: 'FastScheduleCtrl',
                    controllerAs: 'fsc',
                    data: {
                        pageTitle: "考勤管理-快速排班"
                    }
                }).
                when('/super-schedules', {
                    templateUrl: 'partials/super-schedules.html',
                    controller: 'SuperScheduleController',
                    controllerAs: 'sps',
                    data: {
                        pageTitle: "考勤管理-排班管理",
                        pageSubTitle: "请选择筛选条件后查询"
                    }
                }).
                when('/super-schedules-check', {
                    templateUrl: 'partials/super-schedules-check.html',
                controller: 'SuperScheduleCheckController',
                    controllerAs: 'sps',
                    data: {
                        pageTitle: "考勤管理-排班查看",
                        pageSubTitle: "请选择筛选条件后查询"
                    }
                })
                .when('/super-schedules-check-post', {
                    templateUrl: 'partials/super-schedules-check-post.html',
                    controller: 'CheckPostSchedulesController',
                    controllerAs: 'scp',
                    data: {
                        pageTitle: "考勤管理-排班查看",
                        pageSubTitle: "请选择筛选条件后查询"
                    }
                })
                .when('/super-schedules-check-post2', {
                    templateUrl: 'partials/super-schedules-check-post2.html',
                    controller: 'CheckPostSchedulesController',
                    controllerAs: 'scp',
                    data: {
                        pageTitle: "考勤管理-排班查看",
                        pageSubTitle: "请选择筛选条件后查询"
                    }
                }).
                when('/attendance', {
                    templateUrl: 'partials/attendance.html',
                    controller: 'AttendanceController',
                    data: {
                        pageTitle: "考勤管理-签到管理"
                    }
                }).
                when('/new-attendance', {
                    templateUrl: 'partials/attendance.html',
                    controller: 'AttendanceController',
                    data: {
                        pageTitle: "考勤管理-签到管理"
                    }
                }).when('/photo-sign-approval', {
                    templateUrl: 'partials/photo-sign-approval.html',
                    controller: 'PhotoSignApprovalController',
                    data: {
                        pageTitle: "考勤管理-签到管理-拍照打卡审核"
                    }
                }).
                when('/sign-in-check', {
                    templateUrl: 'partials/sign-in-check.html',
                    controller: 'AttendanceController',
                    data: {
                        pageTitle: "考勤管理-签到查看"
                    }
                }).
                when('/attendance-fill', {
                    templateUrl: 'partials/attendance-fill.html',
                    controller: 'AttendanceFillController',
                    data: {
                        pageTitle: "签到管理-手动补签到"
                    }
                }).
                when('/new-attendance-fill', {
                    templateUrl: 'partials/attendance-fill.html',
                    controller: 'AttendanceFillController',
                    data: {
                        pageTitle: "签到管理-手动补签到"
                    }
                }).
                when('/attendance-details/:attendance_id', {
                    templateUrl: 'partials/attendance-details.html',
                    controller: 'AttendanceDetailsController',
                    data: {
                        pageTitle: "考勤管理-出勤详情"
                    }
                }).
                when('/new-attendance-check', {
                    templateUrl: 'partials/new-attendance-check.html',
                    controller: 'NewAttendanceCheckController',
                    data: {
                        pageTitle: "考勤管理-考勤结果"
                    }
                }).
                when('/overtime-attendance-check', {
                    templateUrl: 'partials/overtime-attendance-check.html',
                    controller: 'OvertimeAttendanceCheckController',
                    data: {
                        pageTitle: "考勤管理-考勤汇总"
                    }
                }).
                when('/new-overtime-attendance-check', {
                    templateUrl: 'partials/overtime-attendance-check.html',
                    controller: 'OvertimeAttendanceCheckController',
                    data: {
                        pageTitle: "考勤管理-考勤汇总"
                    }
                }).
                when('/authority/auth-global-list', {
                    templateUrl: 'partials/authority/auth-global-list.html',
                    controller: 'AuthGlobalListController',
                    data: {
                        pageTitle: "考勤管理-权限设置"
                    }
                }).
                when('/authority/auth-organization-config', {
                    templateUrl: 'partials/authority/auth-organization-config.html',
                    controller: 'AuthOrganizationConfigController',
                    data: {
                        pageTitle: "考勤管理-权限设置"
                    }
                }).
                when('/authority/auth-function-config', {
                    templateUrl: 'partials/authority/auth-function-config.html',
                    controller: 'AuthFunctionConfigController',
                    data: {
                        pageTitle: "权限设置"
                    }
                }).
                when('/authority/auth-group-config', {
                    templateUrl: 'partials/authority/auth-group-config.html',
                    controller: 'AuthGroupConfigController',
                    data: {
                        pageTitle: "权限设置"
                    }
                }).
                when('/attendance-lock-cycle', {
                    templateUrl: 'partials/attendance-lock-cycle-list.html',
                    controller: 'AttendanceLockCycleController',
                    data: {
                        pageTitle: "考勤管理-定案周期设置"
                    }
                }).
                when('/attendance-lock-collect', {
                    templateUrl: 'partials/attendance-lock-collect-list.html',
                    controller: 'AttendanceLockCollectController',
                    data: {
                        pageTitle: "考勤管理-考勤解定案"
                    }
                }).
                when('/attendance-lock', {
                    templateUrl: 'partials/attendance-lock-list.html',
                    controller: 'AttendanceLockController',
                    data: {
                        pageTitle: "考勤管理-考勤定案"
                    }
                }).
                when('/attendance-lock-except', {
                    templateUrl: 'partials/attendance-lock-list.html',
                    controller: 'AttendanceLockController',
                    data: {
                        pageTitle: "考勤管理-考勤预定案"
                    }
                }).
                when('/attendance-lock-sap', {
                    templateUrl: 'partials/attendance-lock-list.html',
                    controller: 'AttendanceLockController',
                    data: {
                        pageTitle: "考勤管理-SAP考勤结果"
                    }
                }).
                when('/shifts-config/:shiftGroupId', {
                    templateUrl: 'partials/shifts-config.html',
                    controller: 'ShiftController',
                    data: {
                        pageTitle: "考勤管理-班次设置"
                    }
                }).
                when('/attendance-lock-detail', {
                    templateUrl: 'partials/attendance-lock-detail.html',
                    controller: 'AttendanceLockDetailController',
                    data: {
                        pageTitle: "考勤定案-详情查询"
                    }
                }).
                when('/attendance-lock-data-record', {
                    templateUrl: 'partials/attendance-lock-data-record.html',
                    controller: 'AttendanceLockDataRecordController',
                    controllerAs: 'dr',
                    data: {
                        pageTitle: "数据变化记录"
                    }
                }).
                when('/sign-in-area', {
                    templateUrl: 'partials/sign-in-area.html',
                    controller: 'SignInAreaController',
                    data: {
                        pageTitle: "考勤管理-签到区域设置"
                    }
                }).
                when('/sign-in-area-check', {
                    templateUrl: 'partials/sign-in-area-check.html',
                    controller: 'SignInAreaController',
                    data: {
                        pageTitle: "考勤管理-签到区域查看"
                    }
                }).
                when('/help-task-point-rules', {
                    templateUrl: 'partials/common/help-task-point-rules.html',
                    data: {
                        pageTitle: "帮助信息"
                    }
                }).
                when('/help-job-incentive-rules', {
                    templateUrl: 'partials/common/help-job-incentive-rules.html',
                    data: {
                        pageTitle: "帮助信息"
                    }
                }).
                when('/system-error', {
                    templateUrl: 'partials/common/system-error.html',
                    data: {
                        pageTitle: "系统提示"
                    }
                }).
                when('/system-warning-access-denied', {
                    templateUrl: 'partials/common/system-warning-access-denied.html',
                    data: {
                        pageTitle: "系统提示"
                    }
                }).
                /*when('/post-exp-rule', {
                    templateUrl: 'partials/post-exp-rule.html',
                    controller: "PostExpRuleController",
                    data: {
                        pageTitle: "经验值规则设置"
                    }
                }).
                when('/post-exp-rule-config/:experienceRuleId', {
                    templateUrl: 'partials/post-exp-rule-config.html',
                    controller: "PostExpRuleConfigController",
                    data: {
                        pageTitle: "设置职位经验值规则"
                    }
                }).
                 when('/post-exp-config/:experienceRuleId/:postId/:postExperienceId', {
                 templateUrl: 'partials/post-exp-config.html',
                 controller: 'PostExpController',
                 data: {
                 pageTitle: "经验值设置 － 级别经验值设置"
                 }
                 }).
                 when('/post-exp-rule-authority/:experienceRuleId', {
                 templateUrl: 'partials/post-exp-rule-authority.html',
                 controller: 'PostExpRuleAuthorityController',
                 data: {
                 pageTitle: "经验值设置 － 设置组织范围"
                 }
                 }).*/
                when('/post', {
                    templateUrl: 'partials/post.html',
                    controller: "PostController",
                    data: {
                        pageTitle: "考勤管理-上岗规则设置"
                    }
                }).
                when('/post-check', {
                    templateUrl: 'partials/post-check.html',
                    controller: "PostController",
                    data: {
                        pageTitle: "考勤管理-上岗规则查看"
                    }
                }).
                when('/post-rule', {
                    templateUrl: 'partials/post-rule.html',
                    controller: "PostRuleController",
                    data: {
                        pageTitle: "考勤管理-上岗规则设置"
                    }
                }).
                when('/post-rule-check', {
                    templateUrl: 'partials/post-rule.html',
                    controller: "PostRuleController",
                    data: {
                        pageTitle: "考勤管理-上岗规则查看"
                    }
                }).
                when('/employee-transfer-leave-rule', {
                    templateUrl: 'partials/employee-transfer-leave-rule.html',
                    controller: "EmployeeTransferLeaveRuleController",
                    data: {
                        pageTitle: "人员管理-员工变动"
                    }
                }).when('/employee-transfer-cross-leave-rule', {
                    templateUrl: 'partials/employee-transfer-cross-leave-rule.html',
                    controller: "EmployeeTransferCrossLeaveRuleController",
                    data: {
                        pageTitle: "人员管理-员工变动"
                    }
                }).
                when('/employee-transfer-info-confirm', {
                    templateUrl: 'partials/employee-transfer-info-confirm.html',
                    controller: "EmployeeTransferInfoConfirmController",
                    data: {
                        pageTitle: "考勤管理-人员管理-员工变动"
                    }
                }).when('/employee-transfer-cross-info-confirm', {
                    templateUrl: 'partials/employee-transfer-cross-info-confirm.html',
                    controller: "EmployeeTransferCrossInfoConfirmController",
                    data: {
                        pageTitle: "考勤管理-人员管理-员工变动"
                    }
                }).
                when('/employee-transfer-detail', {
                    templateUrl: 'partials/employee-transfer-detail.html',
                    controller: "EmployeeTransferDetailController",
                    data: {
                        pageTitle: "考勤管理-人员管理-员工变动"
                    }
                })
                .when('/faq/:cateId', {
                    templateUrl: 'partials/faq-category.html',
                    controller: 'FaqCategoryController',
                    data: {
                        pageTitle: "常见问题"
                    }

                })
                .when('/faq/:cateId/:faqId', {
                    templateUrl: 'partials/faq-detail.html',
                    controller: 'FaqDetailController',
                    data: {
                        pageTitle: "常见问题"
                    }

                }).
                when('/holiday-rule-setting', {
                    templateUrl: 'partials/holiday-rule-setting.html',
                    controller: "HolidayRuleSettingController",
                    data: {
                        pageTitle: "考勤管理-标准工时制休假规则设置"
                    }
                }).
                when('/overall-holiday-rule-setting', {
                    templateUrl: 'partials/overall-holiday-rule-setting.html',
                    controller: "OverallHolidayRuleSettingController",
                    data: {
                        pageTitle: "考勤管理-综合工时制休假规则设置"
                    }
            }).when('/outer-payoff-management', {
                templateUrl: 'partials/outer-payoff-management.html',
                controller: "OuterPayoffManagementController",
                data: {
                    pageTitle: "发薪管理-外盘发薪管理"
                }
            }).
                otherwise({
                    redirectTo: '/'
                });

            $httpProvider.interceptors.push('loadingMaker');
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {}
            }
            $httpProvider.defaults.headers.common["X-Requested-WITH"] = 'XMLHttpRequest';
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        }]) //i18n
        .constant('datepickerPopupConfig', {
            dateFormat: 'yyyy-MM-dd',
            currentText: '今天',
            toggleWeeksText: '星期',
            clearText: '清除',
            closeText: '完成',
            closeOnDateSelection: true,
            appendToBody: false,
            showButtonBar: true
        })
        .controller("indexPageController", ['$rootScope', '$scope', '$filter', 'UserService', '$http', 'CommonService', '$location', function ($rootScope, $scope, $filter, userService, $http, commonService, $location) {
            $rootScope.loading = false;
            $rootScope.isPageTitleShow = false;
            var systemAdmin = ['50002244', '50002235', '50042667', '50386055', '50387079', '50388069']
            userService.getUserEmployee().then(function (result) {
                if (systemAdmin.indexOf(result.workJob.workJobId) != -1) {
                    $http.get(apiBaseUrl + '/schedule-exception').then(function (res) {
                        if (res.data.names) {
                            commonService.confirm({
                                content: '员工' + res.data.names.join(',') + '存在调休假超额使用情况，请立即修正排班。',
                                okText: '去设置排班',
                                cancelText: '关闭',
                                callback: function () {
                                    sessionStorage.removeItem("searchState_#/super-schedules");
                                    $rootScope.cacheSearchParams = {
                                        "selectedCompanies": [{
                                            "company_id": $rootScope.loginUserEmployee.company.company_id,
                                            "company_name": $rootScope.loginUserEmployee.company.company_name,
                                            "departments": [$rootScope.loginUserEmployee.department]
                                        }],
                                        "selectedDepartments": [$rootScope.loginUserEmployee.department],
                                        "departments": [$rootScope.loginUserEmployee.department],
                                        "startDate": res.data.startDate,
                                        "endDate": res.data.endDate,
                                        "scheduleStatus": '2'
                                    }
                                    $location.path("/super-schedules");
                                },
                                cancel: function () {
                                    $rootScope.cacheSearchParams = null
                                }
                            });
                        }
                    })
                }
            })


        }])
        .run(['$rootScope', 'UserService', function ($rootScope, userService) {
            $rootScope._ajaxCount = 0;
            changePageTitle();
            getLoginUser();
            function changePageTitle() {
                $rootScope.$on('$routeChangeStart', function (event, next) {
                    $rootScope.isPageTitleShow = true;
                    $rootScope.pageTitle = "";
                    $rootScope.backBtnHref = "";
                    $rootScope.backBtn = "";
                    if (!next.data)
                        return;
                    $rootScope.pageTitle = next.data.pageTitle || "";
                });
            }
            function getLoginUser() {
                userService.getUserEmployee().then(function (result) {
                    sessionStorage["searchState_employeeId"] = result.id;
                    sessionStorage["searchState_loginUser"] = result.workJob.workJobId;
                    sessionStorage["loginUserEmployee"] = JSON.stringify(result);
                    $rootScope.loginUserEmployee = result;
                    showLoginUserName();
                });
            }
            function showLoginUserName() {
                var name = "亲爱的用户";
                if ($rootScope.loginUserEmployee && $rootScope.loginUserEmployee.name) {
                    name = $rootScope.loginUserEmployee.name;
                }
                $(".nav-username").text(name);
            }
        }])
        .run(['editableOptions', function (editableOptions) {
            editableOptions.theme = 'bs3';
        }])
        .factory('loadingMaker', ['$rootScope', '$q', '$location', function ($rootScope, $q, $location) {
            var requestsNum = false;

            var httpInterceptorObj = {
                request: function (request) {
                    var progressBars = document.getElementById('progressBar');
                    if (!progressBars.classList.contains('is-active')) {
                        if (request.url.split('/')[3] != 'view-switch-shift') {
                            showLoading();
                        }
                    }

                    return request;
                },
                requestError: function (rejection) {
                    hideLoading();
                    return $q.reject(rejection);
                },
                response: function (response) {
                    hideLoading();

                    if (isResponseHasException(response)) {
                        return $q.reject(response);
                    }

                    return response;
                },
                responseError: function (rejection) {
                    var responseStatus = rejection.status;

                    hideLoading();
                    handleResponseError(responseStatus);

                    return $q.reject(rejection);
                }
            };

            function showLoading() {
                if (!requestsNum) {
                    $rootScope.loading = true;
                }
                requestsNum = true
            }

            function hideLoading() {
                requestsNum = false;
                if (!requestsNum) {
                    $rootScope.loading = false;
                }
            }

            function isResponseHasException(response) {
                if (response.hasOwnProperty("data")) {
                    var data = response.data;
                    var errorType = data.exceptionType || "";
                    if (errorType === "AccessDeniedException") {
                        $location.path("/system-warning-access-denied").search({});
                        return true;
                    }
                }
                return false;
            }

            function handleResponseError(status) {
                var progressBar = document.getElementById('progressBar');
                if (progressBar.classList.contains('is-active')) {
                    progressBar.classList.remove('is-active')
                    $rootScope._ajaxCount = 0;
                    _ajaxCount = 0;
                }
                if (status === 403) {
                    window.location.href = baseUrl + "/403";
                } else {
                    $location.path("/system-error").search({});
                }
            }

            return httpInterceptorObj;
        }]);

    w.VkrmsApp = vkrmsApp;
})(window);
