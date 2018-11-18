/**
 * Created by evillive on 2016/12/25
 */
const Home = require('../views/home')
// example demo
const Button = r => require.ensure([], () => r(require('../views/example/button')), 'group-test')
const Model = r => require.ensure([], () => r(require('../views/example/model')), 'group-test')
// Leave
const Leave = r => require.ensure([], () => r(require('../views/leave/index')), 'group-leave')
const LeaveHome = r => require.ensure([], () => r(require('../views/leave/home')), 'group-leave')
const LeaveAction = r => require.ensure([], () => r(require('../views/leave/action')), 'group-leave')
const SearchApprovers = r => require.ensure([], () => r(require('../views/leave/search-approvers')), 'group-leave')
const SearchStaff = r => require.ensure([], () => r(require('../views/leave/search-staff')), 'group-leave')
const LeaveList = r => require.ensure([], () => r(require('../views/leave/list')), 'group-leave')
const LeaveRecord = r => require.ensure([], () => r(require('../views/leave/record')), 'group-leave')
const LeaveBalance = r => require.ensure([], () => r(require('../views/leave/balance')), 'group-leave')
const LeaveBalanceOption = r => require.ensure([], () => r(require('../views/leave/balance-option')), 'group-leave')
const LeaveOneOff = r => require.ensure([], () => r(require('../views/leave/one-off-leave')), 'group-leave')
const LeaveExplain = r => require.ensure([], () => r(require('../views/leave/explain')), 'group-leave')
const LeaveApprove = r => require.ensure([], () => r(require('../views/leave/approve')), 'group-leave')
const LeaveDetail = r => require.ensure([], () => r(require('../views/leave/detail')), 'group-leave')
const LeaveActionListCheck = r => require.ensure([], () => r(require('../views/leave/action-list-check')), 'group-leave')
const LeaveRevoke = r => require.ensure([], () => r(require('../views/leave/revoke')), 'group-leave')
// 员工调度
const Dispatch = r => require.ensure([], () => r(require('../views/dispatch/index')), 'group-dispatch')
const DispatchHome = r => require.ensure([], () => r(require('../views/dispatch/home')), 'group-dispatch')
const ApplySearch = r => require.ensure([], () => r(require('../views/dispatch/apply-search')), 'group-dispatch')
const AdvancedSearch = r => require.ensure([], () => r(require('../views/dispatch/advanced-search')), 'group-dispatch')
const TypeSelect = r => require.ensure([], () => r(require('../views/dispatch/type-select')), 'group-dispatch')
const NameSelect = r => require.ensure([], () => r(require('../views/dispatch/name-select')), 'group-dispatch')
const DispatchApproval = r => require.ensure([], () => r(require('../views/dispatch/approval')), 'group-dispatch')
const DispatchApprovalDetail = r => require.ensure([], () => r(require('../views/dispatch/approval-detail')), 'group-dispatch')
const DispatchOvertime = r => require.ensure([], () => r(require('../views/dispatch/overtime')), 'group-dispatch')
const OvertimeType = r => require.ensure([], () => r(require('../views/dispatch/overtime-type')), 'group-dispatch')
const DispatchEmployee = r => require.ensure([], () => r(require('../views/dispatch/employee')), 'group-dispatch')
const dispatchSearchEmployee = r => require.ensure([], () => r(require('../views/dispatch/search-employee')), 'group-dispatch')
const ArrangeBussiness = r => require.ensure([], () => r(require('../views/dispatch/arrange-bussiness')), 'group-dispatch')
const EmployeeTime = r => require.ensure([], () => r(require('../views/dispatch/employee-time')), 'group-dispatch')
// 按岗查看
const Post = r => require.ensure([], () => r(require('../views/post/index')), 'group-posts')
const PostHome = r => require.ensure([], () => r(require('../views/post/home')), 'group-posts')
const PostDetail = r => require.ensure([], () => r(require('../views/post/detail')), 'group-posts')
// 404
const NotFound = require('../views/notfound')

// 根目录
const rootPath = ''

// 页面路由
const routes = [
  {path: '', redirect: {name: 'home'}},
  {path: '/', component: Home, name: 'home'},
  {path: '/button', component: Button, name: 'button'},
  {path: '/model', component: Model, name: 'model'},
  {
    path: '/leave',
    component: Leave,
    meta: {requiresAuth: true},
    children: [
      {path: '', component: LeaveHome, name: 'leaveHome'},
      {path: 'action', component: LeaveAction, name: 'leaveAction'},
      {path: 'list', component: LeaveList, name: 'leaveList'},
      {path: 'record', component: LeaveRecord, name: 'leaveRecord'},
      {path: 'balance', component: LeaveBalance, name: 'leaveBalance'},
      {path: 'balance-option', component: LeaveBalanceOption, name: 'leaveBalanceOption'},
      {path: 'apply-leave', component: LeaveOneOff, name: 'leaveOneOff'},
      {path: 'explain', component: LeaveExplain, name: 'leaveExplain'},
      {path: 'approve', component: LeaveApprove, name: 'leaveApprove'},
      {path: 'detail', component: LeaveDetail, name: 'leaveDetail'},
      {path: 'action-list-check', component: LeaveActionListCheck, name: 'leaveActionListCheck'},
      {path: 'search-approvers', component: SearchApprovers, name: 'SearchApprovers'},
      {path: 'search-staff', component: SearchStaff, name: 'searchStaff'},
      {path: 'revoke', component: LeaveRevoke, name: 'leaveRevoke'}
    ]
  },
  {
    path: '/dispatch',
    component: Dispatch,
    children: [
      {path: '', component: DispatchHome, name: 'dispatchHome'},
      {path: 'search', component: ApplySearch, name: 'applySearch'},
      {path: 'advanced', component: AdvancedSearch, name: 'advancedSearch'},
      {path: 'type', component: TypeSelect, name: 'typeSelect'},
      {path: 'name', component: NameSelect, name: 'nameSelect'},
      {path: 'approval', component: DispatchApproval, name: 'dispatchApproval'},
      {path: 'approval-detail', component: DispatchApprovalDetail, name: 'dispatchApprovalDetail'},
      {path: 'overtime', component: DispatchOvertime, name: 'dispatchOvertime'},
      {path: 'overtime-type', component: OvertimeType, name: 'overtimeType'},
      {path: 'employee', component: DispatchEmployee, name: 'dispatchEmployee'},
      {path: 'search-employee', component: dispatchSearchEmployee, name: 'dispatchSearchEmployee'},
      {path: 'arrange-bussiness', component: ArrangeBussiness, name: 'arrangeBussiness'},
      {path: 'employee-time', component: EmployeeTime, name: 'employee-time'}
    ]
  }, {
    path: '/post',
    component: Post,
    children: [
      {path: '', component: PostHome, name: 'postHome'},
      {path: 'detail', component: PostDetail, name: 'postDetail'}
    ]
  }
].map(route => {
  route.path = rootPath + route.path
  return route
})

// 404 页
routes.push({path: '*', component: NotFound, name: 'notfound'})

export default routes
