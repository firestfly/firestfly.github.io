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
    <div class="content"
         v-show="pageLoading">
      <ul class="list m-t-0">
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
      <ul class="list">
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner f16">
            <datetime class="rm-datetime" v-model="beginDate" @on-clear="setToday" :placeholder="'请选择'" :min-year=2017
                      :end-date=endDate :max-year='maxYear' format="YYYY-MM-DD" @on-change="change" :title="'开始时间'"
                      year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点"
                      minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
          </div>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner f16">
            <datetime class="rm-datetime" v-model="endDate" @on-clear="setToday" :placeholder="'请选择'" :min-year=2017
                      :start-date=beginDate :max-year='maxYear' format="YYYY-MM-DD" @on-change="change" :title="'结束时间'"
                      year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点"
                      minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
          </div>
        </li>
        <li class="list-item list-item-touch-active f16">
          <div class="list-item-inner f16">
            <popup-picker class="rm-datetime" :title="'每日工作时间'" :data="daytimeList" v-model="daytime"
                          :placeholder="'请选择'"></popup-picker>
          </div>
        </li>
      </ul>
      <div class="pl15 pr15">
        <div class="ev-btn ev-btn--primary ev-btn-small" @click="employeeDone">确定</div>
      </div>
    </div>
    <v-department :show="innerPageShow" :employees="employeeId" @get-one-department="getDepartment"
                  :slots="emlpoyeeCache.departments"></v-department>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getEmployees"></add-person>
  </div>
</template>
<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables.scss';

  .weui-cell__ft, .vux-popup-picker-select {
    font-size: 14px !important;
}

  .weui-cell_access .weui-cell__ft {
    padding-left: 0;
    margin-right: rem($inner-width);
}
.vux-popup-picker-select span{
  padding-right: 0 !important;
  color: #999;
}

  .supply.list-item-touch-active {
    padding-top: rem(10px);
    padding-bottom: rem(10px);
}
</style>
<script>
  import HeaderBar from '../../components/header.vue'
  import VDepartment from '../../components/department.vue'
  import addPerson from '../../components/addPerson.vue'
  import { Datetime, Group, PopupPicker } from 'vux'
  import * as utils from '../../utils/util'

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
        pageLoading: true,
        innerPageShow: false,
        addPersonState: false,
        fetchData: null,
        beginDate: '',
        endDate: '',
        employee: {},
        daytime: ['', '', '', '', '', '', ''],
        department: {},
        daytimeList: [],
        stashDepartment: {},
        stashEmployee: {},
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
      redirect () {
        return decodeURIComponent(this.$route.query.redirect)
      },
      No () {
        return this.$route.query.index
      }
    },
    created () {
      if (!utils.isEmpty(this.$store.state.dispatch.overtime)) {
        this.emlpoyeeCache = JSON.parse(JSON.stringify(this.$store.state.dispatch.overtime))
        if (!this.emlpoyeeCache.departments) {
          this.emlpoyeeCache.departments = this.emlpoyeeCache.department
        }
        this.emlpoyeeCache.departments.forEach(item => {
          item.checked = false
        })
        if (this.No !== 'new') {
          this.employee = this.emlpoyeeCache.employees[this.No].employee
          this.department = this.emlpoyeeCache.employees[this.No].department
          this.beginDate = this.emlpoyeeCache.employees[this.No].beginDate
          this.endDate = this.emlpoyeeCache.employees[this.No].endDate
          this.daytime = this.emlpoyeeCache.employees[this.No].daytime
        }
      } else {
        this.$toast('系统出错')
      }
    },
    mounted () {
      let hour = []
      let minute = []
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          i = '0' + i
        }
        hour.push(i)
      }
      for (let i = 0; i < 60; i++) {
        if (i < 10) {
          i = '0' + i
        }
        minute.push(i)
      }
      this.daytimeList.push(hour)
      this.daytimeList.push([':'])
      this.daytimeList.push(minute)
      this.daytimeList.push(['~'])
      this.daytimeList.push(hour)
      this.daytimeList.push([':'])
      this.daytimeList.push(minute)
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
          this.department = this.stashDepartment
        } else if (this.addPersonState) {
          this.headerBar.title = '人员与时间'
          this.headerBar.rightBtn.text = ''
          this.addPersonState = false
          this.employee = this.stashEmployee
        } else {
          this.$router.push({
            name: 'advancedSearch'
          })
        }
      },
      change (value) {
        console.log('change', value)
      },
      dateTimeToInt (str) {
        return parseInt(str.split(':').join())
      },
      employeeDone () {
        if (utils.isEmpty(this.department)) {
          this.$toast('请重新选择项目！')
          return
        }
        if (utils.isEmpty(this.employee)) {
          this.$toast('请重新选择人员！')
          return
        }
        if (utils.isEmpty(this.beginDate)) {
          this.$toast('请重新选择开始日期！')
          return
        }
        if (utils.isEmpty(this.endDate)) {
          this.$toast('请重新选择结束日期！')
          return
        }
        let flagTime = false
        for (let t in this.daytime) {
          if (!this.daytime[t]) {
            flagTime = true
            break
          }
        }
        if (flagTime) {
          this.$toast('请重新选择每日工作时间！')
          return
        }
        if (this.beginDate > this.endDate) {
          this.$toast('结束日期应大于开始日期，请重新选择！')
          return
        }
        let beginTimeInt = parseInt(this.computerTime().beginTime.replace(':', ''))
        let endTimeInt = parseInt(this.computerTime().endTime.replace(':', ''))
        if (beginTimeInt > endTimeInt) {
          this.$toast('每日工作结束时间应大于每日工作开始时间，请重新选择！')
          return
        }
        let computerTime = this.computerTime()
        let msg = ''
        this.emlpoyeeCache.employees.forEach((employee, index) => {
          if (this.No !== index) {
            if (employee.employeeId === this.employee.employeeId) {
              let cacheBeginDate = this.dateTimeToInt(employee.beginDateTime)
              let cacheEndDate = this.dateTimeToInt(employee.endDateTime)
              let paramsBeginDate = this.dateTimeToInt(computerTime.beginTime + ':00')
              let paramsEndDate = this.dateTimeToInt(computerTime.endTime + ':00')
              if (this.beginDate === employee.beginDate || this.endDate === employee.endDate) {
                if (cacheBeginDate > paramsBeginDate) {
                  if (paramsEndDate > cacheBeginDate) {
                    msg = '同一个人时间重复，添加失败！'
                  }
                }
                if (cacheBeginDate < paramsBeginDate) {
                  if (cacheEndDate > paramsBeginDate) {
                    msg = '同一个人时间重复，添加失败！'
                  }
                }
                if (cacheBeginDate === paramsBeginDate || cacheEndDate === paramsEndDate) {
                  msg = '同一个人时间重复，添加失败！'
                }
              }
            }
          }
        })
        if (msg.length > 0) {
          this.$toast(msg)
          return
        }
        let params = {
          department: this.department,
          employeeId: this.employee.employeeId,
          employee: this.employee,
          beginDate: this.beginDate,
          endDate: this.endDate,
          formatBeginDate: computerTime.beginDate,
          formatEndDate: computerTime.endDate,
          daytime: this.daytime,
          computerTime: '',
          beginDateTime: computerTime.beginTime + ':00',
          endDateTime: computerTime.endTime + ':00'
        }
        console.log(params)
        if (this.No === 'new') {
          this.emlpoyeeCache.employees.push(params)
        } else {
          this.emlpoyeeCache.employees[this.No] = params
        }
        this.$store.dispatch('DISPATCH_OVERTIME', this.emlpoyeeCache)
        this.$router.push({
          path: this.redirect
        })
      },
      openDepartment () {
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
        this.stashDepartment = data
      },
      getEmployees (msg) {
        this.stashEmployee = msg
      },
      addApprovalPerson () {
        if (!this.validDepartment()) return
        this.addPersonState = true
        this.headerBar.title = '员工选择'
        this.headerBar.rightBtn.text = '确定'
        let parmas = {
          departments: [this.department.id],
          type: 0
        }
        let q = []
        Object.keys(parmas).forEach((v) => q.push(`${v}=${parmas[v]}`))
        this.fetchData = [this.$appConfig.api.searchEmployee, q.join('&')].join('?')
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
      validDepartment () {
        if (utils.isEmpty(this.department)) {
          this.$toast('请先选择项目！')
          return false
        }
        return true
      },
      computerTime () {
        let beginDate = new Date(this.beginDate)
        let beginMonth = beginDate.getMonth() + 1
        let beginDay = beginDate.getDate()
        let beginTime = this.daytime[0] + ':' + this.daytime[2]
        let endDate = new Date(this.endDate)
        let endMonth = endDate.getMonth() + 1
        let endDay = endDate.getDate()
        let endTime = this.daytime[4] + ':' + this.daytime[6]
        return {
          beginTime: beginTime,
          endTime: endTime,
          beginDate: beginMonth + '月' + beginDay + '日 ' + beginTime,
          endDate: endMonth + '月' + endDay + '日 ' + endTime
        }
      }
    }
  }
</script>
