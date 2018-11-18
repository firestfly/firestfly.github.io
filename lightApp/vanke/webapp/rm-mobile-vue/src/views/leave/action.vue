<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick" @rightBtnClick="saveLocal"></header-bar>
    <div class="page-loading" v-show="!pageLoading">
          <span class="m-loading">
          </span>
    </div>
    <div class="content" v-show="pageLoading">
      <ul class="list">
        <li class="list-item list-item-touch-active" v-if="!listData.allWorkingHourAndW">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              调休假
            </div>
            <div class="list-item-right gray">
              <div>剩余 <span class="red">{{ listData.adjustable }}小时</span></div>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              法定年休假
            </div>
            <div class="list-item-right gray">
              剩余 <span class="red">{{ listData.statutoryAnnual }}天</span>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              额外带薪年休假
            </div>
            <div class="list-item-right gray">
              剩余 <span class="red">{{ listData.payAnnual }}天</span>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active" v-if="!listData.allWorkingHourAndW">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              结转年休假
            </div>
            <div class="list-item-right gray">
              <div>剩余 <span class="red">{{ listData.carryOver }}天</span></div>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active" v-if="!listData.allWorkingHourAndW">
          <div class="list-item-inner">
            <div class="list-item-left fb">
              其他带薪假
            </div>
            <div class="list-item-right gray">
              <div>剩余 <span class="red">{{ listData.otherPayBalance }}天</span></div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="openDatetimes()">
            <div class="list-item-left">
              日期<span class="red">*</span>
            </div>
            <div class="list-item-right gray">
              <span>{{listData.beginDate}}—{{listData.endDate}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="bg-white inner-padding mb15 px-tb" v-for="(item, outterIndex) in listData.holidayInfo"
           :key="outterIndex">
        <div class="box-justify" @click="item.isopen = !item.isopen">
          <span class="color-primary">{{ item.date | date('yyyy/MM/dd')}}</span>
          <span class="icon-angle-top mr5"></span>
        </div>
        <!-- 月休-->
        <div class="list list-corner" style="overflow:visible;background-color: #f1f1f1"
             v-if="item.hasAlternateHoliday == 1 && item.isopen">
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                班次
              </div>
              <div class="list-item-right gray">
                月休
              </div>
            </div>
          </div>
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                无需请假
              </div>
            </div>
          </div>
          <div class="red f12 pa" v-if="item.shiftData.length"><i class="iconfont">&#xe606;</i>已安排
            <span v-for="(shift, innerIndex) in item.shiftData" :key="innerIndex">{{shift.onDutyTime | cutMinute}}-{{shift.offDutyTimeForShow | cutMinute}} &nbsp;&nbsp;</span>加班,请联系项目人事修改排班
          </div>
        </div>
        <!-- 做2休1-->
        <div class="list list-corner" style="overflow:visible;background-color: #f1f1f1"
             v-if="item.hasWorkTwoOrOneRestOne == 1 && item.isopen">
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                班次
              </div>
              <div class="list-item-right gray">
                做2休1/做1休1
              </div>
            </div>
          </div>
          <div class="list-item list-item-touch-active">
            <div class="list-item-inner">
              <div class="list-item-left">
                无需请假
              </div>
            </div>
          </div>
          <div class="red f12 pa" v-if="item.shiftData.length"><i class="iconfont">&#xe606;</i>已安排
            <span v-for="(shift, innerIndex) in item.shiftData" :key="innerIndex">{{shift.onDutyTime | cutMinute}}-{{shift.offDutyTimeForShow | cutMinute}} &nbsp;&nbsp;</span>加班,请联系项目人事修改排班
          </div>
        </div>
        <div v-if="item.hasAlternateHoliday != 1 && item.hasWorkTwoOrOneRestOne != 1 && item.isopen"
             v-for="(shift, innerIndex) in item.shiftData" :key="innerIndex">
          <div class="list list-corner" style="overflow:visible;background-color: #f1f1f1">
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openPosts(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  岗位<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  {{ shift.postShortName }}
                  <i class="icon-angle-right" v-if="!shift.hasShift && innerIndex == 0 && !shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active"
                 :class='{"list-angle-right": !shift.hasShift && innerIndex == 0 && !shift.disableFirstShift}'>
              <div class="list-item-inner" @click="openShifts(outterIndex, innerIndex, shift, item.date)"
              >
                <div class="list-item-left">
                  班次<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  <span v-if="shift.shiftForShow">
                    {{shift.shiftForShow}} &nbsp;({{shift.onDutyTime | cutMinute}}-{{shift.offDutyTimeForShow | cutMinute}})
                  </span><br>
                  <span v-if="shift.leaveTimes == '整班次休假' && shift.diningStartDatetime && shift.diningEndDatetime">
                  (休{{shift.diningStartDatetime | cutMinute}}-{{shift.diningEndDatetime | cutMinute}})</span>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openLeaveType(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  休假类型<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  {{ shift.vacationTypeForShow }}<i class="icon-angle-right" v-show="!shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openLeaveTimes(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  休假方式<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  {{shift.leaveTimes}}<i class="icon-angle-right" v-show="!shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
            <div class="list-item list-item-touch-active">
              <div class="list-item-inner" @click="openDatetime(outterIndex, innerIndex, shift)">
                <div class="list-item-left">
                  时间<span class="red">*</span>
                </div>
                <div class="list-item-right gray">
                  <span
                    v-if="shift.beginTime">{{shift.beginTime | cutMinute}}-{{shift.endTimeForShow | cutMinute}}</span>
                  <i class="icon-angle-right" v-if="(shift.leaveTimes == '自定义时间') && !shift.disableFirstShift"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="flexbox bottom-btn">
            <div class="flex pr5">
              <div class="ev-btn ev-btn-small"
                   :class="{'ev-btn--primary': canAddShiftLeave(outterIndex, innerIndex, shift)}"
                   @click="addShiftLeave(outterIndex, innerIndex, shift)">继续添加本班次休假
            </div>
            </div>
            <div class="flex pl5">
              <div class="ev-btn ev-btn--warn ev-btn-small" @click="delShiftLeave(outterIndex, innerIndex)">
              删除
            </div>
          </div>
        </div>
        </div>
      </div>
      <ul class="list">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="openPageTextarea">
            <div class="list-item-left">
              休假原因<span class="red">*</span>
            </div>
            <div class="list-item-right text-overflow w60 gray">
              {{listData.vacationExplain}}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <transition name="fadeUp">
      <div class="picker-model" v-if="pickerState">
        <picker :slots="Slots" @change="onValuesChange" :showToolbar="true" rotate-effect :visible-item-count="5"
                ref="picker">
          <!-- Toolbar items -->
          <div class="picker-bar">
            <button class="fl button" @click="pickerState = !pickerState">取消</button>
            <button class="fr button" @click="ok()">确定</button>
          </div>
        </picker>
      </div>
    </transition>
    <datetime :show="datatimeShow" @pickerdate="getDatetime"></datetime>
    <page-textarea :show="pageTextareaState" @get-textarea="getTextarea"></page-textarea>
    <model :model-data="model" @on-cancel="model.state = false" @on-confirm="onConfirm()"></model>
  </div>
</template>
<script>
import Picker from 'mint-picker'
import Datetime from '../../components/datetime'
import HeaderBar from '../../components/header.vue'
import * as utils from '../../utils/util'
import pageTextarea from '../../components/pageTextarea'
import Model from '../../components/model.vue'
// 休假类型数组 法定年休假、额外带薪年休假、调休假、春节调休假、结转年休假、事假、普通病假或医疗期外、法定病假医疗期、法定工伤医疗期、其他带薪假
const leaveType = [{
  flex: 1,
  values: ['调休假', '法定年休假', '额外带薪年休假', '结转年休假', '事假', '普通病假或医疗期外', '其他带薪假'],
  defaultIndex: 0,
  textAlign: 'center'
}]
var vacationTypeArr = ['整班次休假', '前半班次休假', '后半班次休假', '自定义时间']
// 拼凑班次数组
const leaveTimes = [{
  flex: 1,
  values: vacationTypeArr,
  defaultIndex: 0,
  textAlign: 'center'
}]
// 时间picker，24小时制
const hoursArray = []
for (let i = 0; i < 24; i++) {
  let str = null
  str = i < 10 ? '0' + i : ('' + i)
  hoursArray.push(str)
}
const datetime = [
  {
    flex: 1,
    values: hoursArray,
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: ['00', '30'],
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: ['-'],
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: hoursArray,
    defaultIndex: 0,
    textAlign: 'center'
  }, {
    flex: 1,
    values: ['00', '30'],
    defaultIndex: 0,
    textAlign: 'center'
  }
]
export default {
  data () {
    return {
      pageLoading: false,
      pageTextareaState: false,
      listData: {
      },
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: '保存'
        },
        title: '我要休假'
      },
      shifts: {
        flex: 1,
        values: [],
        defaultIndex: 0,
        textAlign: 'center'
      },
      posts: {
        flex: 1,
        values: [],
        defaultIndex: 0,
        textAlign: 'center'
      },
      innerIndex: 0, // 内层索引值
      outterIndex: 0, // 外层索引
      middleTime: null,
      datatimeShow: false,
      pickerState: false,
      pickerType: null, // picker类型
      pickerValue: null, // picker值
      Slots: [],
      leaveDate: {
        beginDate: '',
        endDate: ''
      },
      cacheVacationExplain: '',
      model: {
        state: false,
        title: '',
        content: ''
      },
      delParams: {}
    }
  },
  created () {
    this.userInfo = this.$store.state.userInfo
    // let cacheData = this.$store.state.leave.cache
    if (this.$route.query.back) {
      // this.$appConfig.sortBy(cacheData.holidayInfo, 'date', true)
      this.listData = this.$store.state.leave.cache
      this.$store.dispatch('UPDATE_CACHE', null)
      this.pageLoading = true
      this.adjustable = this.listData.adjustable || 0
      this.statutoryAnnual = this.listData.statutoryAnnual || 0
      this.payAnnual = this.listData.payAnnual || 0
      this.carryOver = this.listData.carryOver || 0
      this.otherPayBalance = this.listData.otherPayBalance || 0
      this.notFullShiftBalance = this.listData.notFullShiftBalance || 0
    } else {
      // 请求默认日期
      this.$axios.get(this.$appConfig.api.defaultDate, {
        params: {
          loginMobile: this.userInfo.mobile
        }
      }).then(response => {
        this.leaveDate.beginDate = utils.fmtDate(response.defaultDate, 'yyyy/MM/dd')
        this.leaveDate.endDate = utils.fmtDate(response.defaultDate, 'yyyy/MM/dd')
        this.getVacationDetails()
      })
    }
    // 请求班次组数据
    this.$axios.get(this.$appConfig.api.postsGroup, {params: {
      loginMobile: this.userInfo.mobile
    }}).then(response => {
      this.postGroup = response.posts || []
      if (!this.postGroup.length) {
        this.$toast('请设置该项目下的岗位规则')
      }
      this.postGroup.forEach(v => {
        this.posts.values.push(v.postShortName)
      })
    })
  },
  components: {
    Picker,
    Datetime,
    HeaderBar,
    pageTextarea,
    Model
  },
  methods: {
    leftBtnClick () {
      if (this.pageTextareaState) {
        this.headerBar.title = '我要休假'
        this.headerBar.rightBtn.text = '保存'
        this.pageTextareaState = false
        return false
      }
      if (this.datatimeShow) {
        this.datatimeShow = false
        this.headerBar.rightBtn.text = '保存'
        this.headerBar.title = '我要休假'
      } else if (this.$route.query.step) {
        this.$router.push({
          path: 'action-list-check'
        })
      } else {
        this.$store.dispatch('UPDATE_CACHE', null)
        this.$router.push({
          path: '/leave/'
        })
      }
    },
    openPageTextarea () {
      this.pageTextareaState = true
      this.headerBar.title = '填写休假说明'
      this.headerBar.rightBtn.text = '确定'
    },
    getTextarea (msg) {
      this.cacheVacationExplain = msg
      this.headerBar.title = '我要休假'
      this.headerBar.rightBtn.text = '保存'
    },
    // 获取完整班次时长
    getShiftHours (shift) {
      let result = 0
      for (let i = 0, len = this.shiftsGroup.length; i < len; i++) {
        if (this.shiftsGroup[i].label === shift) {
          result = getTimeDiff(this.shiftsGroup[i].onDutyTime, this.shiftsGroup[i].offDutyTimeForShow) - this.shiftsGroup[i].diningDuration
          break
        }
      }
      return result
    },
    dealHolidayInfo (data) {
      let beginDate = new Date(this.leaveDate.beginDate)
      let endDate = new Date(this.leaveDate.endDate)
      let oneDay = 24 * 60 * 60 * 1000
      let len = (endDate - beginDate) / oneDay
      let obj
      let date
      data.holidayInfo = data.holidayInfo || []
      let tempArr = []
      let hasFind
      for (let i = 0; i <= len; i++) {
        date = utils.fmtDate(new Date(+new Date(beginDate) + i * oneDay), 'yyyy-MM-dd')
        obj = {
          date: date,
          isopen: true,
          shiftData: [{
            shiftForShow: '',
            postShortName: '',
            postId: '',
            hasShift: false,
            disableFirstShift: false,
            leaveTimes: '',
            onDutyTime: '',
            offDutyTimeForShow: '',
            vacationTypeForShow: '',
            beginTime: '',
            endTime: '',
            vacationOperationType: null
          }]
        }
        if (data.holidayInfo.length) {
          hasFind = false
          data.holidayInfo.map((outv, outIndex) => {
            if (outv.date === date) {
              hasFind = true
              outv.isopen = true
              outv.shiftData = outv.shiftData || [{
                shift: '',
                postShortName: '',
                postId: '',
                hasShift: false,
                disableFirstShift: false,
                leaveTimes: '',
                onDutyTime: '',
                offDutyTimeForShow: '',
                vacationTypeForShow: '',
                beginTime: '',
                endTime: '',
                vacationOperationType: null
              }]
              outv.shiftData.map((inv, index) => {
                inv.hasShift = !!inv.shift
                inv.disableFirstShift = false
                inv.leaveTimes = ''
                inv.shiftForShow = inv.shift
                inv.offDutyTimeForShow = inv.offDutyTime
                inv.vacationTypeForShow = inv.vacationType
                inv.vacationOperationType = null
                inv.vacationType = inv.vacationType && utils.findId(utils.leaveType(), 'id', 'name', inv.vacationType)
                if (inv.relatedShift) {
                  inv.shiftForShow = inv.shift + '+' + inv.relatedShift.shift
                  inv.offDutyTimeForShow = inv.relatedShift.offDutyTime
                  inv.relatedShift.hasShift = inv.hasShift
                }
              })
              tempArr.push(JSON.parse(JSON.stringify(outv)))
            }
          })
          if (!hasFind) {
            tempArr.push(obj)
          }
        } else {
          obj.date = date
          tempArr.push(obj)
        }
      }
      data.holidayInfo = tempArr
    },
    getParams () {
      return {
        loginMobile: this.userInfo.mobile,
        beginDate: this.leaveDate.beginDate.replace(/\//g, '-'),
        endDate: this.leaveDate.endDate.replace(/\//g, '-')
      }
    },
    getVacationDetails () {
      this.$axios.get(this.$appConfig.api.vacation, {params: this.getParams()}).then(response => {
        if (response.status === 'fail') {
          this.$toast('加载请休假额度失败')
        }
        this.pageLoading = true
        if (response.errorMessage) {
          this.$toast(response.errorMessage)
          this.listData = response
          this.listData.holidayInfo = []
          this.listData.beginDate = this.leaveDate.beginDate
          this.listData.endDate = this.leaveDate.endDate
          return
        }
        if (response.allWorkingHourAndW !== false) {
          leaveType[0].values = ['法定年休假', '额外带薪年休假', '结转年休假', '事假', '普通病假或医疗期外']
        }
        this.dealHolidayInfo(response)
        this.listData = response
        this.adjustable = this.listData.adjustable
        this.notFullShiftBalance = this.listData.notFullShiftBalance
        this.statutoryAnnual = this.listData.statutoryAnnual
        this.payAnnual = this.listData.payAnnual
        this.carryOver = this.listData.carryOver
        this.otherPayBalance = this.listData.otherPayBalance
        this.notFullShiftBalance = this.listData.notFullShiftBalance
        this.listData.beginDate = this.leaveDate.beginDate
        this.listData.endDate = this.leaveDate.endDate
        let cacheData = this.$store.state.leave.cache
        if (cacheData) {
          this.adjustable = this.listData.adjustable - this.getUsedVacation('调休假', cacheData.holidayInfo)
          this.statutoryAnnual = this.listData.statutoryAnnual - this.getUsedVacation('法定年休假', cacheData.holidayInfo)
          this.payAnnual = this.listData.payAnnual - this.getUsedVacation('额外带薪年休假', cacheData.holidayInfo)
          this.notFullShiftBalance = this.listData.notFullShiftBalance - this.getOffQuota(0, cacheData.holidayInfo)
          this.listData.vacationExplain = cacheData.vacationExplain
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    canAddShiftLeave (outer, inner, shift) {
      let shiftData = this.listData.holidayInfo[outer].shiftData[inner]
      if (inner > 0) {
        let lastShiftData = this.listData.holidayInfo[outer].shiftData[inner - 1]
        if (shiftData.shiftForShow === lastShiftData.shiftForShow) {
          return false
        }
      }
      return !shift.disableFirstShift && shiftData.beginTime && shiftData.endTimeForShow && !(shiftData.beginTime === shiftData.onDutyTime && shiftData.endTimeForShow === shiftData.offDutyTimeForShow)
    },
    addShiftLeave (outer, inner, shift) {
      let shiftData = this.listData.holidayInfo[outer].shiftData[inner]
      if (!(this.canAddShiftLeave(outer, inner, shift))) {
        return false
      }
      const newItem = {
        postId: shift.postId,
        postShortName: shift.postShortName,
        shift: shift.shift,
        shiftType: shift.shiftType,
        shiftForShow: shift.shiftForShow,
        onDutyTime: shift.onDutyTime,
        offDutyTimeForShow: shift.offDutyTimeForShow,
        offDutyTime: shift.offDutyTime,
        diningDuration: shift.diningDuration,
        diningStartDatetime: shift.diningStartDatetime,
        diningEndDatetime: shift.diningEndDatetime,
        vacationTypeForShow: '',
        leaveTimes: '',
        beginTime: '',
        endTimeForShow: '',
        relatedShift: shift.relatedShift,
        shiftsGroup: shift.shiftsGroup,
        hasShift: shift.hasShift
      }
      shiftData.disableFirstShift = true
      this.listData.holidayInfo[outer].shiftData.splice(inner + 1, 0, newItem)
    },
    delShiftLeave (outer, inner) {
      this.delParams = {
        outer: outer,
        inner: inner
      }
      this.model = {
        state: true,
        content: '是否确定删除？',
        noTitle: true
      }
    },
    onConfirm () {
      this.model.state = false
      let outer = this.delParams.outer
      let inner = this.delParams.inner
      let shiftData = this.listData.holidayInfo[outer].shiftData
      if (inner > 0) {
        shiftData[inner - 1].disableFirstShift = false
      }
      if (shiftData.length === 1) {
        this.listData.holidayInfo.splice(outer, 1)
        this.listData.isPublicHolidays.splice(outer, 1)
        this.listData.canPrivateAffair.splice(outer, 1)
      } else {
        this.listData.holidayInfo[outer].shiftData.splice(inner, 1)
      }
    },
    openDatetimes () {
      this.datatimeShow = true
      // this.listData.isBack = false
      this.headerBar.rightBtn.text = ''
      this.headerBar.title = '选择日期'
    },
    isInDateRange (rangeBegin, rangeEnd, beginDate, endDate) {
      return new Date(rangeBegin) <= new Date(endDate) && new Date(rangeEnd) >= new Date(beginDate)
    },
    getDatetime (msg) {
      let cache = this.$store.state.leave.cache
      let beginDate = utils.fmtDate(msg[0], 'yyyy/MM/dd')
      let endDate = utils.fmtDate(msg[1], 'yyyy/MM/dd')
      if (cache) {
        let repeatDate = this.getRepeatDate(beginDate, endDate, cache.holidayInfo)
        if (repeatDate.length && !this.$route.query.back) {
          this.$toast('申请日期' + repeatDate.join(',') + '重复，请选择其它日期')
          return false
        }
      }
      this.$axios.get(this.$appConfig.api.lockCycleJudgement, {params: {beginDate: utils.fmtDate(msg[0], 'yyyy-MM-dd'), endDate: utils.fmtDate(msg[1], 'yyyy-MM-dd')}}).then((res) => {
        if (res.state === '0') {
          if (res.date) {
            this.$toast(res.date + '后未设置考勤周期，不能发起休假')
          } else {
            this.$toast('未设置考勤周期，不能发起休假')
          }
          return false
        }
        this.leaveDate.beginDate = beginDate
        this.leaveDate.endDate = endDate
        this.getVacationDetails()
      })
      setTimeout(() => {
        this.datatimeShow = false
        this.headerBar.rightBtn.text = '保存'
        this.headerBar.title = '我要休假'
      }, 300)
    },
    getRepeatDate (rangeBegin, rangeEnd, dateArr1) {
      let flag = []
      dateArr1.map(v => {
        if (this.isInDateRange(rangeBegin, rangeEnd, v.date, v.date)) {
          flag.push(v.date)
        }
      })
      return flag
    },
    isByHours (type) {
      return type === '调休假' || type === '事假' || type === '普通病假或医疗期外'
    },
    saveLocal () {
      if (this.pageTextareaState) {
        this.headerBar.title = '我要休假'
        this.pageTextareaState = false
        this.listData.vacationExplain = this.cacheVacationExplain
        return false
      }
      if (!this.isItemsFinished()) {
        this.$toast('请填写完整休假申请信息')
        return false
      }
      let cacheData = this.$store.state.leave.cache
      if (cacheData) {
        let repeatDate = this.getRepeatDate(this.listData.beginDate, this.listData.endDate, cacheData.holidayInfo)
        if (repeatDate.length && !this.$route.query.back) {
          this.$toast('申请日期' + repeatDate.join(',') + '重复，请选择其它日期')
          return false
        }
        this.listData.holidayInfo = this.listData.holidayInfo.concat(cacheData.holidayInfo)
      }
      let sum1 = 0
      let sum2 = 0
      leaveType[0].values.forEach(v => {
        if (this.isByHours(v)) {
          sum1 += this.getUsedVacation(v, this.listData.holidayInfo)
        } else {
          sum2 += this.getUsedVacation(v, this.listData.holidayInfo)
        }
      })
      sum1 = sum1 ? (sum1 + '小时') : ''
      sum2 = sum2 ? (sum2 + '天') : ''
      this.listData.totalHours = sum2 + sum1
      this.listData.beginDate = this.listData.beginDate.replace(/\//g, '-')
      this.listData.endDate = this.listData.endDate.replace(/\//g, '-')
      this.$store.dispatch('UPDATE_CACHE', this.listData)
      this.$router.push({
        path: 'action-list-check'
      })
    },
    isItemsFinished () {
      let flag = true
      let count = 0
      if (!this.listData.vacationExplain) {
        return false
      }
      this.listData.holidayInfo.forEach(outV => {
        if (+outV.hasAlternateHoliday !== 1 && +outV.hasWorkTwoOrOneRestOne !== 1 && outV.shiftData.length) {
          outV.shiftData.forEach(innerV => {
            if (isEmptyField(innerV.beginTime) || isEmptyField(innerV.endTimeForShow)) {
              flag = false
            }
          })
          count++
        }
      })
      return flag && count > 0
    },
    onValuesChange (picker, values) {
      switch (this.pickerType) {
        case 'timeRange':
          this.pickerValue = values
          break
        default:
          this.pickerValue = values[0]
          break
      }
    },
    openShifts (outter, inner, shift, date) {
      if (shift.hasShift || inner > 0 || shift.disableFirstShift) {
        return false
      }
      if (!shift.hasShift && !shift.postShortName) {
        this.$toast('请先选择岗位')
        return false
      }
      this.pickerType = 'shift'
      // 请求班次组数据
      this.$axios.get(this.$appConfig.api.shiftsGroup, {params: {
        loginMobile: this.userInfo.mobile,
        postId: shift.postId,
        onDutyDay: date
      }}).then(response => {
        this.shiftsGroup = response.shifts || []
        let arr = []
        this.shiftsGroup.forEach(v => {
          if (v.relatedShift) {
            arr.push(v.label + '+' + v.relatedShift.label + '（' + v.onDutyTime.slice(0, -3) + '-' + v.relatedShift.offDutyTime.slice(0, -3) + '）')
            v.labelForShow = v.label + '+' + v.relatedShift.label
            v.offDutyTimeForShow = v.relatedShift.offDutyTime
            v.relatedShift.shift = v.relatedShift.label
            v.relatedShift.postId = shift.postId
            v.hasShift = shift.hasShift
            v.relatedShift.postShortName = shift.postShortName
            if (v.onDutyTime > v.offDutyTime) {
              v.relatedShift.spanAllDay = 1
            } else {
              v.relatedShift.spanAllDay = 0
            }
          } else {
            v.labelForShow = v.label
            v.offDutyTimeForShow = v.offDutyTime
            arr.push(v.label + '（' + v.onDutyTime.slice(0, -3) + '-' + v.offDutyTimeForShow.slice(0, -3) + '）')
          }
        })
        this.shifts.values = arr
        if (!this.shiftsGroup.length) {
          this.$toast('请设置改岗位的上岗规则')
          return false
        }
        let selected = shift.shiftForShow ? this.shifts.values.indexOf(shift.shiftForShow + '（' + shift.onDutyTime.slice(0, -3) + '-' +
          shift.offDutyTimeForShow.slice(0, -3) + '）') : 0
        this.$set(this.shifts, 'defaultIndex', selected)
        this.outterIndex = outter
        this.innerIndex = inner
        this.Slots = []
        this.Slots[0] = this.shifts
        this.pickerState = true
      })
    },
    openPosts (outter, inner, shift) {
      if (shift.hasShift || inner > 0 || shift.disableFirstShift) {
        return false
      }
      this.pickerType = 'post'
      let selected = shift.postShortName ? this.posts.values.indexOf(shift.postShortName) : 0
      this.$set(this.posts, 'defaultIndex', selected)
      this.outterIndex = outter
      this.innerIndex = inner
      this.Slots = []
      this.Slots[0] = this.posts
      this.pickerState = true
    },
    openLeaveType (outter, inner, shift) {
      if (shift.disableFirstShift) {
        return false
      }
      if (!shift.shiftForShow) {
        this.$toast('请先选择班次')
        return false
      }
      if (this.listData.holidayInfo[outter].shiftData[inner].vacationOperationType === null) {
        let params = {
          loginMobile: this.userInfo.mobile,
          onDutyTime: this.listData.holidayInfo[outter].shiftData[inner].onDutyTime,
          offDutyTime: this.listData.holidayInfo[outter].shiftData[inner].offDutyTime,
          date: this.listData.holidayInfo[outter].date,
          isCheckShift: 0
        }
        this.$axios.get(this.$appConfig.api.shiftOverlay, {params: params}).then(response => {
          // if (response.errorMessage) {
          //   this.$toast(response.errorMessage)
          //   return false
          // }
          if (response.vacationOperationType === 1) {
            this.$toast('此班次已经被请满，请选择其他班次')
            return
          }
          this.listData.holidayInfo[outter].shiftData[inner].vacationOperationType = response.vacationOperationType
          this.pickerType = 'vacationType'
          let selected = shift.vacationTypeForShow ? leaveType[0].values.indexOf(shift.vacationTypeForShow) : 0
          this.$set(leaveType[0], 'defaultIndex', selected)
          this.outterIndex = outter
          this.innerIndex = inner
          this.Slots = leaveType
          this.pickerState = true
        })
      } else {
        this.pickerType = 'vacationType'
        let selected = shift.vacationTypeForShow ? leaveType[0].values.indexOf(shift.vacationTypeForShow) : 0
        this.$set(leaveType[0], 'defaultIndex', selected)
        this.outterIndex = outter
        this.innerIndex = inner
        this.Slots = leaveType
        this.pickerState = true
      }
    },
    openLeaveTimes (outter, inner, shift) {
      if (shift.disableFirstShift) {
        return false
      }
      if (!shift.vacationTypeForShow) {
        this.$toast('请先选择休假类型')
        return false
      }
      this.middleTime = middleTimeFunc(shift)
      if (this.isByHours(shift.vacationTypeForShow)) {
        leaveTimes[0].values = vacationTypeArr.concat()
        if (shift.shiftType && shift.shiftType > 2) {
          leaveTimes[0].values = vacationTypeArr.slice(0, -1)
        }
        if (!this.middleTime) {
          leaveTimes[0].values.splice(1, 2)
        }
      } else {
        leaveTimes[0].values = vacationTypeArr.slice(0, -1)
        if (!this.middleTime) {
          leaveTimes[0].values = ['整班次休假']
        }
      }
      this.pickerType = 'leaveTimes'
      let selected = shift.leaveTimes ? leaveTimes[0].values.indexOf(shift.leaveTimes) : 0
      this.$set(leaveTimes[0], 'defaultIndex', selected)
      this.outterIndex = outter
      this.innerIndex = inner
      this.Slots = leaveTimes
      this.pickerState = true
    },
    openDatetime (outter, inner, shift) {
      if (shift.disableFirstShift) {
        return false
      }
      if (!shift.leaveTimes) {
        this.$toast('请先选择休假方式')
        return false
      }
      if (shift.leaveTimes !== '自定义时间') {
        return false
      }
      if (shift.beginTime && shift.endTimeForShow) {
        let beginTimeArr = shift.beginTime.split(':')
        let endTimeArr = shift.endTimeForShow.split(':')
        this.$set(datetime[0], 'defaultIndex', hoursArray.indexOf(beginTimeArr[0]))
        this.$set(datetime[1], 'defaultIndex', ['00', '30'].indexOf(beginTimeArr[1]))
        this.$set(datetime[3], 'defaultIndex', hoursArray.indexOf(endTimeArr[0]))
        this.$set(datetime[4], 'defaultIndex', ['00', '30'].indexOf(endTimeArr[1]))
      } else {
        let onDutyTimeArr = shift.onDutyTime.split(':')
        let offDutyTimeArr = shift.offDutyTimeForShow.split(':')
        this.$set(datetime[0], 'defaultIndex', hoursArray.indexOf(onDutyTimeArr[0]))
        this.$set(datetime[1], 'defaultIndex', ['00', '30'].indexOf(onDutyTimeArr[1]))
        this.$set(datetime[3], 'defaultIndex', hoursArray.indexOf(offDutyTimeArr[0]))
        this.$set(datetime[4], 'defaultIndex', ['00', '30'].indexOf(offDutyTimeArr[1]))
      }
      this.pickerType = 'timeRange'
      this.outterIndex = outter
      this.innerIndex = inner
      this.Slots = datetime
      this.pickerState = true
    },
    isInTimeRange (beginTime, endTime, pickerTimeBegin, pickerTimeEnd) {
      let acrossDay = beginTime > endTime
      if (acrossDay) {
        let endTimeArr = endTime.split(':')
        if (pickerTimeBegin < beginTime) {
          pickerTimeBegin = (+pickerTimeBegin.split(':')[0] + 24) + ':' + pickerTimeBegin.split(':')[1] + ':00'
        }
        if (pickerTimeEnd && pickerTimeEnd < beginTime) {
          pickerTimeEnd = (+pickerTimeEnd.split(':')[0] + 24) + ':' + pickerTimeEnd.split(':')[1] + ':00'
        }
        endTime = (+endTimeArr[0] + 24) + ':' + endTimeArr[1] + ':00'
      }
      if (pickerTimeEnd) {
        return pickerTimeBegin < pickerTimeEnd && pickerTimeEnd <= endTime && pickerTimeBegin >= beginTime
      } else {
        return pickerTimeBegin <= endTime && pickerTimeBegin >= beginTime
      }
    },
    getOffQuota (isFull, holidayInfoArr = this.listData.holidayInfo) {
      let result = 0
      holidayInfoArr.forEach(outV => {
        outV.shiftData.forEach(innerV => {
          if (innerV.vacationTypeForShow === '调休假' && innerV.timeRange) {
            if ((isFull === 1 && innerV.leaveTimes !== '自定义时间') || (isFull === 0 && innerV.leaveTimes === '自定义时间')) {
              result += innerV.timeRange
            }
          }
        })
      })
      return result
    },
    // 获取额外带薪年休假已用额度
    getUsedVacation (type, holidayInfoArr = this.listData.holidayInfo) {
      let result = 0
      if (this.isByHours(type)) {
        holidayInfoArr.forEach(outV => {
          outV.shiftData.forEach(innerV => {
            if (innerV.vacationTypeForShow === type && innerV.timeRange) {
              result += innerV.timeRange
            }
          })
        })
      } else {
        holidayInfoArr.forEach(outV => {
          outV.shiftData.forEach(innerV => {
            if (innerV.vacationTypeForShow === type) {
              if (innerV.leaveTimes === '整班次休假') {
                result += 1
              } else if (innerV.leaveTimes === '前半班次休假' || innerV.leaveTimes === '后半班次休假') {
                result += 0.5
              }
            }
          })
        })
      }
      return result
    },
    adjustEnoughTime (vacationType) {
      if (vacationType === '调休假' && this.notFullShiftBalance < this.getOffQuota(0) && this.listData.isOType === '0') {
        return '剩余“非整班次”调休额度为' + this.notFullShiftBalance + '小时，额度不足。另有整班次调休额度' + (this.adjustable - this.notFullShiftBalance - this.getOffQuota(1)) + '小时'
      }
      if (vacationType === '调休假' && this.adjustable < this.getUsedVacation('调休假')) {
        return '调休假余额仅剩' + this.adjustable + '小时，超过时间请选择法定年休假'
      }
      if (vacationType === '法定年休假' && this.statutoryAnnual < this.getUsedVacation('法定年休假')) {
        return '法定年休假余额仅剩' + this.statutoryAnnual + '天，超过天数请选择额外带薪年休假'
      }
      if (vacationType === '额外带薪年休假' && this.payAnnual < this.getUsedVacation('额外带薪年休假')) {
        return '额外带薪年休假余额不足，请选择其它类型'
      }
      if (vacationType === '结转年休假' && this.carryOver < this.getUsedVacation('结转年休假')) {
        return '结转年休假额度不足，请选择其它类型'
      }
      if (vacationType === '其他带薪假' && this.otherPayBalance < this.getUsedVacation('其他带薪假')) {
        return '其他带薪假额度不足，请选择其它类型'
      }
      return false
    },
    ok () {
      const shiftData = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex]
      let pickerValue = this.pickerValue
      this.middleTime = middleTimeFunc(shiftData)
      switch (this.pickerType) {
        case 'post':
          (() => {
            shiftData.postShortName = pickerValue || this.$refs.picker.getValues().toString()
            shiftData.postId = utils.findId(this.postGroup, 'postId', 'postShortName', shiftData.postShortName)
            shiftData.beginTime = ''
            shiftData.endTimeForShow = ''
            shiftData.endTime = ''
            shiftData.leaveTimes = ''
            shiftData.shiftForShow = ''
            shiftData.onDutyTime = ''
            shiftData.offDutyTimeForShow = ''
          })()
          break
        case 'shift':
          let pickerValueArr = (pickerValue || this.$refs.picker.getValues().toString()).split('（')
          let onDutyTime = pickerValueArr[1].split('-')[0] + ':00'
          let offDutyTimeForShow = pickerValueArr[1].split('-')[1].slice(0, -1) + ':00'
          let params = {
            loginMobile: this.userInfo.mobile,
            onDutyTime: onDutyTime,
            offDutyTime: offDutyTimeForShow,
            date: this.listData.holidayInfo[this.outterIndex].date,
            isCheckShift: 1
          }
          this.$axios.get(this.$appConfig.api.shiftOverlay, {params: params}).then(response => {
            if (response.errorMessage) {
              this.$toast(response.errorMessage)
              return false
            }
            if (response.vacationOperationType === 1) {
              this.$toast('此班次已经被请满，请选择其他班次')
              return
            }
            shiftData.vacationOperationType = response.vacationOperationType
            shiftData.shiftForShow = pickerValueArr[0]
            shiftData.shift = utils.findId(this.shiftsGroup, 'label', 'labelForShow', pickerValueArr[0])
            shiftData.onDutyTime = onDutyTime
            shiftData.offDutyTimeForShow = offDutyTimeForShow
            shiftData.offDutyTime = utils.findId(this.shiftsGroup, 'offDutyTime', 'labelForShow', pickerValueArr[0])
            shiftData.diningDuration = utils.findId(this.shiftsGroup, 'diningDuration', 'labelForShow', pickerValueArr[0])
            shiftData.diningStartDatetime = utils.findId(this.shiftsGroup, 'diningStartDatetime', 'labelForShow', pickerValueArr[0])
            shiftData.diningEndDatetime = utils.findId(this.shiftsGroup, 'diningEndDatetime', 'labelForShow', pickerValueArr[0])
            shiftData.shiftType = utils.findId(this.shiftsGroup, 'shiftType', 'labelForShow', pickerValueArr[0])
          })
          shiftData.beginTime = ''
          shiftData.endTimeForShow = ''
          shiftData.endTime = ''
          shiftData.leaveTimes = ''
          shiftData.shiftsGroup = JSON.parse(JSON.stringify(this.shiftsGroup))
          break
        case 'vacationType':
          (() => {
            let vacationType = pickerValue || this.$refs.picker.getValues().toString()
            shiftData.beginTime = ''
            shiftData.endTimeForShow = ''
            shiftData.endTime = ''
            shiftData.leaveTimes = ''
            let restadjustEnoughTime = this.adjustEnoughTime(vacationType)
            if (restadjustEnoughTime) {
              this.$toast(restadjustEnoughTime)
              return false
            }
            // let halfShiftHours = (getTimeDiff(shiftData.onDutyTime, shiftData.offDutyTimeForShow) - shiftData.diningDuration || 0) / 2
            // if ((vacationType === '额外带薪年休假' || vacationType === '法定年休假') && this.adjustable > 0 && (this.adjustable - this.getUsedVacation('调休假')) >= halfShiftHours) {
            //   this.$toast('调休假仍有余额，请优先选择调休假')
            //   return false
            // }
            if (vacationType === '额外带薪年休假' && (this.statutoryAnnual - this.getUsedVacation('法定年休假')) >= 0.5) {
              this.$toast('法定年休假仍有余额，请优先选择法定年休假')
              return false
            }
            shiftData.vacationTypeForShow = vacationType
            shiftData.vacationType = utils.findId(utils.leaveType(), 'id', 'name', shiftData.vacationTypeForShow)
            if (this.innerIndex === 0) {
              if (vacationType === '事假' || vacationType === '普通病假或医疗期外') {
                if (shiftData.vacationTypeForShow === '事假' && !this.listData.isPublicHolidays[this.outterIndex] && !this.listData.canPrivateAffair[this.outterIndex]) {
                  return
                }
              }
              shiftData.beginTime = shiftData.onDutyTime
              shiftData.endTimeForShow = shiftData.offDutyTimeForShow
              shiftData.endTime = shiftData.offDutyTime
              shiftData.leaveTimes = '整班次休假'
              shiftData.operationType = 1
              shiftData.timeRange = getTimeDiff(shiftData.beginTime, shiftData.endTimeForShow)
              if (shiftData.diningDuration) {
                shiftData.timeRange -= shiftData.diningDuration
              }
              if (shiftData.relatedShift) {
                shiftData.relatedShift.beginTime = shiftData.relatedShift.onDutyTime
                shiftData.relatedShift.endTime = shiftData.relatedShift.offDutyTime
                shiftData.relatedShift.operationType = shiftData.operationType
                shiftData.relatedShift.vacationType = shiftData.vacationType
                shiftData.relatedShift.hasShift = shiftData.hasShift
              }
              if (shiftData.vacationOperationType === 2) {
                shiftData.leaveTimes = '后半班次休假'
                shiftData.operationType = 3
                if (Array.isArray(this.middleTime)) {
                  shiftData.beginTime = this.middleTime[1]
                  shiftData.beginTimeForShow = this.middleTime[1]
                } else {
                  shiftData.beginTime = this.middleTime
                  shiftData.beginTimeForShow = this.middleTime
                }
              } else if (shiftData.vacationOperationType === 3) {
                shiftData.leaveTimes = '前半班次休假'
                shiftData.operationType = 2
                if (Array.isArray(this.middleTime)) {
                  shiftData.endTimeForShow = this.middleTime[0]
                  shiftData.endTime = this.middleTime[0]
                } else {
                  shiftData.endTimeForShow = this.middleTime
                  shiftData.endTime = this.middleTime
                }
              }
              let notEnough = this.adjustEnoughTime(shiftData.vacationTypeForShow)
              if (notEnough) {
                shiftData.leaveTimes = ''
                shiftData.beginTime = ''
                shiftData.endTimeForShow = ''
                shiftData.endTime = ''
                shiftData.timeRange = 0
                shiftData.relatedShift = null
                return false
              }
            }
          })()
          break
        case 'leaveTimes':
          (() => {
            let leaveTime = pickerValue || this.$refs.picker.getValues().toString()
            let alertTxt = '与之前发起的休假单休假时间有重叠，请另选时间'
            switch (leaveTime) {
              case '整班次休假':
                if (shiftData.vacationOperationType === 2 || shiftData.vacationOperationType === 3) {
                  this.$toast(alertTxt)
                  return false
                }
                break
              case '后半班次休假':
                if (shiftData.vacationOperationType === 3) {
                  this.$toast(alertTxt)
                  return false
                }
                break
              case '前半班次休假':
                if (shiftData.vacationOperationType === 2) {
                  this.$toast(alertTxt)
                  return false
                }
                break
              default:
                break
            }
            if (leaveTime === '自定义时间') {
              shiftData.beginTime = ''
              shiftData.endTimeForShow = ''
              shiftData.endTime = ''
              shiftData.operationType = 0
            }
            shiftData.leaveTimes = leaveTime
            let relatedShift = shiftData.relatedShift || utils.findId(this.shiftsGroup || shiftData.shiftsGroup, 'relatedShift', 'label', shiftData.shift)
            if (relatedShift) {
              shiftData.relatedShift = JSON.parse(JSON.stringify(relatedShift))
            }
            if (leaveTime === '整班次休假') {
              if (shiftData.vacationTypeForShow === '事假' && !this.listData.isPublicHolidays[this.outterIndex] && !this.listData.canPrivateAffair[this.outterIndex]) {
                this.$toast({
                  msg: '考勤周期内的月休额度未用完，不可申请事假，请优先安排月休',
                  time: 5000
                })
                shiftData.leaveTimes = ''
                shiftData.beginTime = ''
                shiftData.endTimeForShow = ''
                shiftData.endTime = ''
                return false
              }
              if (this.innerIndex > 0) {
                let lastShiftData = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex - 1]
                if (shiftData.shiftForShow === lastShiftData.shiftForShow) {
                  this.$toast('请选择其他休假方式')
                  shiftData.beginTime = ''
                  shiftData.endTimeForShow = ''
                  shiftData.endTime = ''
                  shiftData.leaveTimes = ''
                  return false
                }
              }
              shiftData.beginTime = shiftData.onDutyTime
              shiftData.endTimeForShow = shiftData.offDutyTimeForShow
              shiftData.endTime = shiftData.offDutyTime
              shiftData.operationType = 1
              if (shiftData.relatedShift) {
                shiftData.relatedShift.beginTime = shiftData.relatedShift.onDutyTime
                shiftData.relatedShift.endTime = shiftData.relatedShift.offDutyTime
              }
            } else if (leaveTime !== '自定义时间') {
              if (leaveTime === '前半班次休假') {
                shiftData.beginTime = shiftData.onDutyTime
                if (shiftData.diningStartDatetime) {
                  shiftData.endTimeForShow = shiftData.diningStartDatetime
                } else {
                  shiftData.endTimeForShow = this.middleTime
                }
                shiftData.endTime = shiftData.endTimeForShow
                shiftData.operationType = 2
                if (shiftData.relatedShift) {
                  shiftData.relatedShift.beginTime = ''
                  shiftData.relatedShift.endTime = ''
                }
              }
              if (leaveTime === '后半班次休假') {
                shiftData.endTimeForShow = shiftData.offDutyTimeForShow
                if (shiftData.diningEndDatetime) {
                  shiftData.beginTime = shiftData.diningEndDatetime
                } else {
                  shiftData.beginTime = this.middleTime
                }
                shiftData.endTime = shiftData.endTimeForShow
                shiftData.operationType = 3
                if (shiftData.relatedShift) {
                  shiftData.relatedShift.beginTime = shiftData.relatedShift.onDutyTime
                  shiftData.relatedShift.endTime = shiftData.relatedShift.offDutyTime
                  shiftData.endTime = shiftData.relatedShift.onDutyTime
                }
              }
              if (this.innerIndex > 0) {
                let lastShiftData = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex - 1]
                let rangeBegin
                let rangeEnd
                if (lastShiftData.shiftForShow === shiftData.shiftForShow) {
                  if (lastShiftData.endTimeForShow === lastShiftData.offDutyTimeForShow) {
                    rangeBegin = lastShiftData.onDutyTime
                    rangeEnd = lastShiftData.beginTime
                  } else {
                    rangeBegin = lastShiftData.endTimeForShow
                    rangeEnd = lastShiftData.offDutyTimeForShow
                  }
                  if (!this.isInTimeRange(rangeBegin, rangeEnd, shiftData.beginTime, shiftData.endTimeForShow)) {
                    this.$toast('休假区间有误，请选择其他休假类型')
                    shiftData.beginTime = ''
                    shiftData.endTimeForShow = ''
                    shiftData.endTime = ''
                    shiftData.leaveTimes = ''
                    if (shiftData.relatedShift) {
                      shiftData.relatedShift.beginTime = ''
                      shiftData.relatedShift.endTime = ''
                    }
                    return false
                  }
                }
              }
            }
            shiftData.timeRange = getTimeDiff(shiftData.beginTime, shiftData.endTimeForShow)
            if (leaveTime === '整班次休假' && shiftData.diningDuration) {
              shiftData.timeRange -= shiftData.diningDuration
            }
            let notEnough = this.adjustEnoughTime(shiftData.vacationTypeForShow)
            if (notEnough) {
              this.$toast(shiftData.vacationTypeForShow + '额度不足')
              shiftData.leaveTimes = ''
              shiftData.beginTime = ''
              shiftData.endTimeForShow = ''
              shiftData.endTime = ''
              shiftData.timeRange = 0
              shiftData.relatedShift = null
              return false
            }
            if (shiftData.relatedShift) {
              shiftData.relatedShift.operationType = shiftData.operationType
              shiftData.relatedShift.vacationType = shiftData.vacationType
              shiftData.relatedShift.hasShift = shiftData.hasShift
            }
          })()
          break
        case 'timeRange':
          (() => {
            pickerValue = this.$refs.picker.getValues()
            let relatedShift = shiftData.relatedShift || utils.findId(this.shiftsGroup || shiftData.shiftsGroup, 'relatedShift', 'label', shiftData.shift)
            if (relatedShift) {
              shiftData.relatedShift = JSON.parse(JSON.stringify(relatedShift))
            }
            if (pickerValue) {
              let pickBeginTime = pickerValue[0] + ':' + pickerValue[1] + ':00'
              let pickEndTime = pickerValue[3] + ':' + pickerValue[4] + ':00'
              if (this.isInTimeRange(shiftData.onDutyTime, shiftData.offDutyTimeForShow, pickBeginTime, pickEndTime)) {
                if (shiftData.onDutyTime !== pickBeginTime && shiftData.offDutyTimeForShow !== pickEndTime) {
                  this.$toast('休假区间选择有误')
                  shiftData.relatedShift = null
                  return false
                }
                if (Array.isArray(this.middleTime)) {
                  if (pickBeginTime === this.middleTime[1] || pickEndTime === this.middleTime[0]) {
                    this.$toast('自定义时间不能与整班次或半班次时间重合')
                    return false
                  }
                } else if (this.middleTime) {
                  if (pickBeginTime === this.middleTime || pickEndTime === this.middleTime) {
                    this.$toast('自定义时间不能与整班次或半班次时间重合')
                    return false
                  }
                }
                if (this.innerIndex > 0) {
                  let lastShiftData1 = this.listData.holidayInfo[this.outterIndex].shiftData[this.innerIndex - 1]
                  let rangeBegin1
                  let rangeEnd1
                  if (lastShiftData1.shiftForShow === shiftData.shiftForShow) {
                    if (lastShiftData1.endTimeForShow === lastShiftData1.offDutyTimeForShow) {
                      rangeBegin1 = lastShiftData1.onDutyTime
                      rangeEnd1 = lastShiftData1.beginTime
                    } else {
                      rangeBegin1 = lastShiftData1.endTimeForShow
                      rangeEnd1 = lastShiftData1.offDutyTimeForShow
                    }
                    if (!this.isInTimeRange(rangeBegin1, rangeEnd1, pickBeginTime, pickEndTime)) {
                      this.$toast('休假区间有误，请选择其他时间段')
                      shiftData.beginTime = ''
                      shiftData.endTimeForShow = ''
                      shiftData.endTime = ''
                      shiftData.relatedShift = null
                      return false
                    }
                  }
                }
                shiftData.beginTime = pickBeginTime
                shiftData.endTimeForShow = pickEndTime
                shiftData.endTime = pickEndTime
                shiftData.timeRange = getTimeDiff(shiftData.beginTime, shiftData.endTimeForShow)
                if (relatedShift) {
                  if (shiftData.onDutyTime === shiftData.beginTime) {
                    if (this.isInTimeRange(shiftData.offDutyTime, shiftData.relatedShift.offDutyTime, pickEndTime)) {
                      shiftData.endTime = shiftData.offDutyTime
                      shiftData.relatedShift.beginTime = shiftData.offDutyTime
                      shiftData.relatedShift.endTime = pickEndTime
                    } else {
                      shiftData.relatedShift.beginTime = ''
                      shiftData.relatedShift.endTime = ''
                    }
                  } else if (pickEndTime === shiftData.endTime) {
                    if (this.isInTimeRange(shiftData.onDutyTime, shiftData.offDutyTime, pickBeginTime)) {
                      shiftData.endTime = shiftData.offDutyTime
                      shiftData.relatedShift.beginTime = shiftData.relatedShift.onDutyTime
                      shiftData.relatedShift.endTime = shiftData.relatedShift.offDutyTime
                    } else {
                      shiftData.beginTime = ''
                      shiftData.endTime = ''
                      shiftData.relatedShift.beginTime = pickBeginTime
                    }
                  }
                  shiftData.relatedShift.hasShift = shiftData.hasShift
                  shiftData.relatedShift.vacationType = shiftData.vacationType
                }
                let notEnough = this.adjustEnoughTime(shiftData.vacationTypeForShow)
                if (notEnough) {
                  this.$toast(notEnough)
                  shiftData.beginTime = ''
                  shiftData.endTimeForShow = ''
                  shiftData.endTime = ''
                  shiftData.timeRange = 0
                  shiftData.relatedShift = null
                  return false
                }
              } else {
                this.$toast('班次中间时间不可申请休假')
                return false
              }
            }
          })()
          break
      }
      this.pickerValue = null
      this.pickerState = false
    }
  }
}
// 获取班次中间时间段
function middleTimeFunc (shiftData) {
  let middleTime = ''
  if (shiftData.diningStartDatetime && shiftData.diningEndDatetime) {
    middleTime = [shiftData.diningStartDatetime, shiftData.diningEndDatetime]
  } else {
    middleTime = null
  }
  return middleTime
}

function isEmptyField (field) {
  return field === undefined || field === '' || field === null
}
// 获取2个时间的时长差
function getTimeDiff (begin, end) {
  if (!begin || !end) {
    return 0
  }
  let tempStr = (begin + ':' + end).split(':')
  if (begin > end) {
    tempStr[3] = 24 + Number(tempStr[3])
  }
  return Number(tempStr[3] - tempStr[0]) + Number(tempStr[4] - tempStr[1]) / 60
}
</script>

<style lang="scss">
  @import "../../assets/scss/Common/_variables.scss";

  .inner-padding {
    padding: rem(30px);
  }
  .model-textarea {
    background: #ccc;
    border: 0;
    height: 100px;
    padding: 10px;
    border-radius: 4px;
    display: block;
    width: 100%;
  }
</style>
