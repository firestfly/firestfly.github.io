/**
 * Created by evillive on 2016/12/25
 */

export default {
  install (Vue) {
    let baseUrl = '/internal'
    Vue.prototype.$appConfig = {
      api: {
        authority: baseUrl + '/api/authority/',
        approveList: baseUrl + '/api/leave-approval-app',
        approveDetail: baseUrl + '/api/vacation-approval-detail-app',
        approveAction: baseUrl + '/api/leave-approval-action-app',
        defaultDate: baseUrl + '/api/default-date-vacation-app',
        vacation: baseUrl + '/api/vacation-app',
        shiftsGroup: baseUrl + '/api/shifts-app',
        postsGroup: baseUrl + '/api/posts-app',
        shiftOverlay: baseUrl + '/api/shift-overlay-vacation-app',
        leaders: baseUrl + '/api/leaders-approval-vacation-app',
        searchLeaders: baseUrl + '/api/leaders-search-vacation-app',
        getLeaveQuotaList: baseUrl + '/api/vacation-quota-search-app',
        getLeaveList: baseUrl + '/api/leave-check-app',
        getLeaveRecord: baseUrl + '/api/my-vacation-detail-app',
        repealLeave: baseUrl + '/api/leave-repeal-check-app',
        applySearch: baseUrl + '/api/apply-search-app',
        typeSearch: baseUrl + '/api/type-search-app',
        staffSearch: baseUrl + '/api/staff-search-app',
        isCrossAttendanceCycle: baseUrl + '/api/is-cross-attendance-cycle',
        revokeHoliday: baseUrl + '/api/revoke-holiday',
        dispatchApprovalAction: baseUrl + '/api/dispatch-approval-action-app',
        dispatchApprovalList: baseUrl + '/api/dispatch-approval-app',
        dispatchApprovalDetail: baseUrl + '/api/dispatch-approval-detail-app',
        getDepartment: baseUrl + '/api/dispatch-departments-app',
        searchEmployee: baseUrl + '/api/business-employee-app',
        businessArrange: baseUrl + '/api/business-arrange-app',
        overtimeSearchEmployees: baseUrl + '/api/overtime-staff-search-app',
        overtimeApply: baseUrl + '/api/dispatch-overtime-app',
        getCity: baseUrl + '/api/province-city-app',
        getWorkJobs: baseUrl + '/api/standard-work-jobs-app',
        searchDefaultApprovalAndCCMan: baseUrl + '/api/approval-ccman-app', // 员工调度出差加班审批抄送
        searchHolidayApprovalAndCCMan: baseUrl + '/api/approval-ccman-holiday-type-app', // 调休假审批抄送
        vacationStatusApproveList: baseUrl + '/api/leave-cc-app',
        departments: baseUrl + '/api/departments-app',
        postDepartments: baseUrl + '/api/department-posts-app',
        postsEmployee: baseUrl + '/api/posts-employee-app',
        lockCycleJudgement: baseUrl + '/api/lock-cycle-judgement-app'
      }
    }
    Vue.prototype.$toast = (obj) => {
      const oo = {}
      if (typeof obj === 'object') {
        oo.msg = obj.msg || '操作成功'
        oo.timer = obj.time || 3000
        oo.type = obj.type
      } else {
        oo.msg = obj || '操作成功！'
        oo.timer = 3000
      }
      var toast = document.getElementById('toast')
      if (!toast) {
        toast = document.createElement('div')
        toast.setAttribute('id', 'toast')
        toast.className = 'ev-toast'
        document.body.appendChild(toast)
      } else {
        toast.style.display = 'block'
      }
      toast.innerHTML = '<div class="ev-toast-msg"><i class="' + oo.type + '"></i>' + oo.msg + '</div>'
      setTimeout(() => {
        toast.style.display = 'none'
      }, oo.timer)
    }
  }
}
