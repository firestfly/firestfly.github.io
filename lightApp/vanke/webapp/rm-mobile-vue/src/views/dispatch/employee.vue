<template>
  <div id="employee-time">
    <header-bar :leftBtn="headerBar.leftBtn"
                :rightBtn="headerBar.rightBtn"
                :title="headerBar.title"
                @leftBtnClick="leftBtnClick"
                @rightBtnClick="rightBtnClick"></header-bar>
    <div class="page-loading"
         v-show="!pageLoading">
      <span class="m-loading">
            </span>
    </div>
    <div class="content" v-show="pageLoading">
      <ul class="list">
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner f16">
            <datetime class="rm-datetime" v-model="beginDate" @on-clear="setToday" :placeholder="'请选择'" :min-year=2017
                      :max-year='maxYear' format="YYYY-MM-DD HH:mm" @on-change="change" :title="'开始时间'"
                      year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点"
                      minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
          </div>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner f16">
            <datetime class="rm-datetime" v-model="endDate" @on-clear="setToday" :start-date=beginDate
                      :placeholder="'请选择'"
                      :min-year=2017 :max-year='maxYear' format="YYYY-MM-DD HH:mm" @on-change="change" :title="'结束时间'"
                      year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点"
                      minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
          </div>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner ">
            <div class="list-item-left f16">总时长</div>
            <div class="list-item-right gray"> {{ totalHours }}分钟</div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="openDepartment">
            <div class="list-item-left f16">
              项目
            </div>
            <div class="list-item-right gray">
              <div>{{department.name || '请选择'}}</div>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="addApprovalPerson">
            <div class="list-item-left f16">
              员工
            </div>
            <div class="list-item-right gray">
              <div>{{employee.name || '请选择'}}</div>
            </div>
          </div>
        </li>
      </ul>
      <div class="pl15 pr15">
        <div class="ev-btn ev-btn--primary ev-btn-small" @click="employeeDone">确定</div>
      </div>
    </div>
    <v-department :show="innerPageShow" @get-one-department="getDepartment" :slots="overtime.departments"></v-department>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getEmployees"></add-person>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import VDepartment from '../../components/department.vue'
  import addPerson from '../../components/addPerson.vue'
  import { Datetime, Group, PopupPicker } from 'vux'
  import * as util from '../../utils/util'
  export default{
    props: {
      show: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        overtime: {
          departments: []
        },
        pageLoading: true,
        innerPageShow: false,
        addPersonState: false,
        fetchData: null,
        beginDate: '',
        endDate: '',
        department: {},
        employee: {},
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: ''
          },
          title: '人员与时间'
        },
        maxYear: new Date().getFullYear() + 1
      }
    },
    components: {
      HeaderBar,
      VDepartment,
      addPerson,
      Datetime,
      Group,
      PopupPicker
    },
    computed: {
      employeeId () {
        return this.$store.state.userInfo.id
      },
      totalHours () {
        if (this.beginDate && this.endDate) {
          return (new Date(this.endDate.replace(/-/g, '/')) - new Date(this.beginDate.replace(/-/g, '/'))) / 1000 / 60
        } else {
          return ''
        }
      },
      redirect () {
        return decodeURIComponent(this.$route.query.redirect)
      },
      No () {
        return this.$route.query.index
      }
    },
    created () {
      if (!util.isEmpty(this.$store.state.dispatch.overtime)) {
        this.overtime = JSON.parse(JSON.stringify(this.$store.state.dispatch.overtime))
        if (!this.overtime.departments) {
          this.overtime.departments = this.overtime.department
        }
        this.overtime.departments.forEach(item => {
          item.checked = false
        })
        if (this.No !== 'new') {
          this.employee = this.overtime.employees[this.No].employee
          this.department = this.overtime.employees[this.No].department
          this.beginDate = this.overtime.employees[this.No].beginDate
          this.endDate = this.overtime.employees[this.No].endDate
        }
      } else {
        this.$toast('系统出错')
      }
    },
    methods: {
      leftBtnClick () {
        if (this.innerPageShow) {
          this.innerPageShow = false
          this.headerBar.title = '人员与时间'
          this.headerBar.rightBtn.text = ''
        } else if (this.addPersonState) {
          this.headerBar.title = '人员与时间'
          this.headerBar.rightBtn.text = ''
          this.addPersonState = false
        } else {
          this.$router.push({
            path: this.redirect
          })
        }
      },
      rightBtnClick () {
        if (this.innerPageShow) {
          this.innerPageShow = false
          this.headerBar.title = '人员与时间'
          this.headerBar.rightBtn.text = ''
        } else if (this.addPersonState) {
          this.headerBar.title = '人员与时间'
          this.headerBar.rightBtn.text = ''
          this.addPersonState = false
        } else {
          this.$router.push({
            name: 'advancedSearch'
          })
        }
      },
      change (value) {
      },
      isDateTimeCover (start, end, startDate, endDate) {
        return start < endDate && end > startDate
      },
      employeeDone () {
        if (!this.employee.name && !this.employee.employeeId) {
          this.$toast('请选择员工！')
          return
        }
        if (this.beginDate >= this.endDate) {
          this.$toast('开始时间须小于结束时间！')
          return
        }
        let flag = false
        this.overtime.employees.forEach(item => {
          if (item.employee.employeeId === this.employee.employeeId) {
            if (this.isDateTimeCover(this.beginDate, this.endDate, item.beginDate, item.endDate)) {
              flag = true
            }
          }
        })
        if (flag && this.No === 'new') {
          this.$toast('该人员的加班时间重叠')
          return
        }
        let params = {
          department: this.department,
          employee: this.employee,
          employeeId: this.employee.employeeId,
          beginDate: this.beginDate,
          endDate: this.endDate,
          totalHours: this.totalHours,
          formatBeginDate: this.computerTime().beginDate,
          formatEndDate: this.computerTime().endDate
        }
        if (this.No === 'new') {
          this.overtime.employees.push(params)
        } else {
          this.overtime.employees[this.No] = params
        }
        this.$store.dispatch('DISPATCH_OVERTIME', this.overtime)
        this.$router.push({
          path: this.redirect
        })
      },
      openDepartment () {
        if (!this.beginDate || !this.endDate) {
          this.$toast('请选择开始日期和结束日期')
          return
        }
        this.innerPageShow = true
        this.headerBar.title = '选择项目'
        this.headerBar.rightBtn.text = '确定'
      },
      getDepartment (msg) {
        let data = {}
        msg.map(item => {
          if (item.checked) {
            data = item
          }
        })
        if (this.department.name !== data.name) {
          this.department = data
          this.employee = {}
        }
      },
      getEmployees (msg) {
        this.employee = msg
      },
      addApprovalPerson () {
        if (!this.department.id) {
          this.$toast('请选择部门')
          return
        }
        this.addPersonState = true
        this.headerBar.title = '员工选择'
        this.headerBar.rightBtn.text = '确定'
        let parmas = {
          departments: [this.department.id],
          beginDate: this.beginDate + ':00',
          endDate: this.endDate + ':00',
          jobRequirements: util.pluck(this.overtime.jobRequirements, 'id'),
          type: 0
        }
        let q = []
        Object.keys(parmas).forEach((v) => q.push(`${v}=${parmas[v]}`))
        this.fetchData = [this.$appConfig.api.overtimeSearchEmployees, q.join('&')].join('?')
      },
      setToday (value) {
        let now = new Date()
        let cmonth = now.getMonth() + 1
        let day = now.getDate()
        if (cmonth < 10) cmonth = '0' + cmonth
        if (day < 10) day = '0' + day
        this.beginDate = now.getFullYear() + '-' + cmonth + '-' + day
        this.endDate = this.beginDate
      },
      computerTime () {
        let beginDate = new Date(this.beginDate.replace(/-/g, '/'))
        let endDate = new Date(this.endDate.replace(/-/g, '/'))
        return {
          beginDate: util.fmtDate(beginDate, 'MM月dd日 hh:mm'),
          endDate: util.fmtDate(endDate, 'MM月dd日 hh:mm')
        }
      }
    }
  }
</script>
