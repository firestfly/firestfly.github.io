<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content pb0">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="page-loading" v-show="!pageLoading">
            <span class="m-loading">
            </span>
        </div>
        <div class="flex-start" v-show="pageLoading">
          <div class="item-box">
            <h4>开始时间</h4>
            <span>
              <datetime :placeholder="detail.startDate" v-model="detail.startDate" format="YYYY-MM-DD"
                        @on-change="onStartDateChange" :title="''" year-row="{value}" month-row="{value}"
                        day-row="{value}" day-hour="{value}" day-minute="{value}" confirm-text="确定" cancel-text="取消"
                        :start-date="minStartDate" :end-date="maxEndDate" :limit-minute="true"></datetime>
            </span>
          </div>
          <div class="item-box">
            <h4>结束时间</h4>
            <span>
              <datetime :placeholder="detail.endDate" v-model="detail.endDate" format="YYYY-MM-DD"
                        @on-change="onEndDateChange"
                        :title="''" year-row="{value}" month-row="{value}" day-row="{value}" day-hour="{value}"
                        day-minute="{value}" confirm-text="确定" cancel-text="取消" :start-date="detail.startDate"
                        :end-date="maxEndDate" :limit-minute="true" @on-hide="confirm"></datetime>
            </span>
          </div>
          <div class="item-box">
            <h4>休假类型</h4>
            <span class="disabled">{{ detail.holidayType }}</span>
          </div>
          <div class="item-box margin-top arrow-right" @click="openPageTextarea">
            <h4>休假理由</h4>
            <span class="explain">{{ detail.vacationExplain }}</span>
          </div>
          <div class="item-box margin-top">
            <h4>休假时长</h4>
            <span class="disabled">{{ quotaDay }} {{ detail.quotaType }}</span>
          </div>
          <div class="item-box">
            <h4>休假额度</h4>
            <span class="disabled">{{ detail.leftQuota }} {{ detail.quotaType }}</span>
          </div>
          <div class="item-box margin-top no-flex">
            <h4>审批人</h4>
            <div class="approval-box clearfix">
              <draggable v-model="approval" class="" :options="{handle:'.allowed-mod'}">
                <div class="add-approval" :class="{'allowed-mod': !item.default}" v-for="(item, index) in approval" :key="index">
                  <h5 class="color-gray">{{ item.workJob || '&nbsp;' }}</h5>
                  <span class="employee-author" :class="getEmployeeClass(item)" :style="face(item.avatar)"
                        @click="searchApproval('Approval', item, index)"></span>
                  <h4>{{ item.name}}</h4>
                </div>
              </draggable>
              <div class="add-approval" v-show="approval.length < 8">
                <h5 class="color-gray">
                  <span>&nbsp;</span>
                </h5>
                <span class="employee-author add"
                      @click="searchApproval('Approval')"></span>
                <h4>&nbsp;</h4>
              </div>
            </div>
          </div>
          <div class="gray" v-if="showWarnningText" style="padding-left: 20px">长按可调整自添加人员顺序</div>
          <div class="item-box margin-top no-flex">
            <h4>抄送人</h4>
            <div class="approval-box clearfix">
              <draggable v-model="ccApproval" class="" :options="{handle:'.allowed-mod'}">
                <div class="add-approval" :class="{'allowed-mod': !cc.default}" v-for="(cc, index) in ccApproval" :key="index">
                  <h5 class="color-gray">{{ cc.workJob || '&nbsp;' }}</h5>
                  <span class="employee-author" :class="getEmployeeClass(cc)"
                        @click="searchApproval('ccApproval', cc, index)" :style="face(cc.avatar)"></span>
                  <h4>{{ cc.name}}</h4>
                </div>
              </draggable>
              <div class="add-approval" v-show="ccApproval.length < 4">
                <h5 class="color-gray">
                  <span>&nbsp;</span>
                </h5>
                <span class="employee-author add"
                      @click="searchApproval('ccApproval')"></span>
                <h4>&nbsp;</h4>
              </div>
            </div>
          </div>
          <div class="gray" v-if="ccApproval.length > 1" style="padding-left: 20px">长按可调整自添加人员顺序</div>
          <div class="inner-padding">
            <button type="button" class="ev-btn ev-btn--primary ev-btn-small" :class="{'disabled' : loadingState}"
                    @click="submitApply">提交
            </button>
          </div>
        </div>
      </div>
    </div>
    <page-textarea :show="pageTextareaState" @get-textarea="getTextarea"></page-textarea>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getApprovalPersons"></add-person>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import pageTextarea from '../../components/pageTextarea'
  import addPerson from '../../components/addPerson.vue'
  import draggable from 'vuedraggable'
  import { Datetime } from 'vux'
  import * as util from '../../utils/util.js'
  export default {
    data () {
      return {
        pageLoading: false,
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          title: '我要休假'
        },
        detail: {},
        pageTextareaState: false,
        leaveInfo: '',
        networkError: false,
        minStartDate: '',
        maxEndDate: '',
        approval: [],
        ccApproval: [],
        ccManJob: '',
        minutes: ['00', '30'],
        fetchData: null,
        addPersonState: false,
        quotaDay: null,
        approvalJob: [],
        addApprovalObj: {},
        showWarnningText: false
      }
    },
    components: {
      HeaderBar,
      Datetime,
      pageTextarea,
      addPerson,
      draggable
    },
    created () {
      console.log(this.$route)
      this.userInfo = this.$store.state.userInfo
      this.leaveInfo = this.$route.params
      this.minStartDate = this.leaveInfo.effectiveDate
      this.maxEndDate = this.leaveInfo.expiryDate
      this.detail.startDate = this.leaveInfo.effectiveDate
      this.detail.duration = this.leaveInfo.leftQuota
      this.detail.endDate = this.changeDate(this.$route.params.leftQuota - 1, this.detail.startDate, this.maxEndDate)
      this.detail.holidayType = this.leaveInfo.holidayType
      this.detail.holidayTypeId = this.leaveInfo.holidayTypeId
      this.detail.quotaType = this.leaveInfo.quotaType
      this.detail.leftQuota = this.leaveInfo.leftQuota
      this.getDefaultApprovalAndCCMan()
    },
    computed: {
      loadingState () {
        return this.$store.state.axios
      }
    },
    mounted () {
      if (util.isEmpty(this.$route.params)) {
        setTimeout(() => {
          this.$router.push({
            name: 'leaveBalance'
          })
        }, 200)
      }
    },
    methods: {
      openPageTextarea () {
        this.pageTextareaState = true
        this.headerBar.title = '填写休假理由'
      },
      getTextarea (msg) {
        this.detail.vacationExplain = msg
        this.headerBar.title = '我要休假'
      },
      dash (data) {
        return data ? data.replace(/-/g, '/') : null
      },
      getEmployeeClass (item) {
        let str = null
        if (item.name === null && item.default) {
          str = 'add'
        }
        if (item.name && !item.default) {
          str = 'author-del'
        }
        return str
      },
      leftBtnClick () {
        if (this.addPersonState) {
          this.addPersonState = false
          return false
        }
        if (this.pageTextareaState) {
          this.headerBar.title = '我要休假'
          this.pageTextareaState = false
          return false
        }
        this.$router.push({
          path: '/leave/balance'
        })
      },
      getDefaultApprovalAndCCMan () {
        let paramType = null
        if (this.userInfo.jobState === 'out') {
          paramType = 0
          this.ccManJob = ''
        } else {
          if (this.userInfo.jobName.indexOf('系统负责人') === -1) {
            paramType = this.quotaDay < 15 ? 1 : 2
            this.ccManJob = '人力资源专员'
            this.approvalJob = this.quotaDay < 15 ? ['直属上级', '人力资源专员', '对接合伙人'] : ['直属上级', '人力资源专员', '对接合伙人', '管理中心总经理', '人力资源部负责人']
          } else {
            paramType = this.quotaDay < 15 ? 3 : 4
            this.ccManJob = '管理中心HRBP'
            this.approvalJob = this.quotaDay < 15 ? ['人力资源专员', 'HRBP', '对接合伙人'] : ['人力资源专员', '对接合伙人', '管理中心总经理', '人力资源部负责人']
          }
        }
        setTimeout(() => {
          this.$axios.get(this.$appConfig.api.searchHolidayApprovalAndCCMan, {
            params: {
              departments: this.userInfo.departmentId,
              loginMobile: this.userInfo.mobile,
              type: paramType
            }
          })
          .then((res) => {
            res.approval.forEach((item, index) => {
              item.default = true
              item.workJob = this.approvalJob[index]
            })
            res.ccMan.forEach((items, index) => {
              items.default = true
              if (index === 0) {
                items.workJob = this.ccManJob
              }
            })
            this.approval = res.approval
            this.ccApproval = res.ccMan
            this.pageLoading = true
          })
        }, 200)
      },
      submitApply () {
        let ccApprovalIds = []
        let approvalIds = []
        if (!this.detail.vacationExplain) {
          this.$toast('请输入休假理由！')
          return
        }
        if (this.quotaDay > this.detail.leftQuota) {
          this.$toast('请假时长范围超出已有额度！')
          return
        }
        if (this.checkApprovalIsEmpty()) {
          this.$toast('审批人不能为空')
          return
        }
        if (!this.ccApproval[0].employeeId) {
          this.$toast('请选择抄送人')
          return
        }
        if (this.quotaDay < 1) {
          this.$toast('结束时间不能小于开始时间')
          return
        }
        this.approval.forEach((v) => {
          v.employeeId && approvalIds.push(v.employeeId)
        })
        this.ccApproval.forEach((v) => {
          v.employeeId && ccApprovalIds.push(v.employeeId)
        })
        let params = {
          employeeId: this.userInfo.id,
          beginDate: this.detail.startDate,
          endDate: this.detail.endDate,
          ccApprovalIds: ccApprovalIds,
          approvalIds: approvalIds,
          vacationExplain: this.detail.vacationExplain,
          oneOffVacation: {
            startDate: this.detail.startDate + ' 00:00',
            endDate: this.detail.endDate + ' 23:59',
            holidayType: this.detail.holidayTypeId,
            duration: this.detail.leftQuota
          }
        }
        this.$toast({
          msg: '提交中...',
          type: 'loading',
          time: 7000
        })
        this.$axios.post(this.$appConfig.api.vacation, params)
        .then((res) => {
          if (res.status === 'success') {
            this.$toast({
              msg: '提交成功',
              type: 'succes'
            })
            setTimeout(() => {
              this.$router.push({
                name: 'leaveBalance'
              })
            }, 500)
          } else {
            this.$toast(res.errorMessage || res.exceptionType)
          }
        })
      },
      searchApproval (state, item, id) {
        if (item && item.department) {
          this.$toast('默认人员不可修改')
          return false
        }
        if (item && !item.default) {
          if (state === 'ccApproval') {
            this.ccApproval.splice(id, 1)
          } else {
            this.approval.splice(id, 1)
            this.checkApprovalCustomLength()
          }
          return false
        }
        this.addApprovalObj = {
          id: item ? id : this.approval.length,
          type: state
        }
        if (state === 'ccApproval' && !item) {
          this.addApprovalObj.id = this.ccApproval.length
        }
        this.addPersonState = true
        this.fetchData = this.$appConfig.api.searchLeaders + '?departmentId=' + this.userInfo.departmentId
      },
      getApprovalPersons (data) {
        if (!util.isEmpty(data)) {
          this.addPersonState = false
          let newData = {
            avatar: data.avatarUrl,
            employeeId: data.employeeId,
            name: data.name,
            workJob: data.jobName
          }
          if (this.addApprovalObj.type === 'Approval') {
            if (this.approval[this.addApprovalObj.id]) {
              this.approval[this.addApprovalObj.id].avatar = data.avatarUrl
              this.approval[this.addApprovalObj.id].employeeId = data.employeeId
              this.approval[this.addApprovalObj.id].name = data.name
              if (!this.approval[this.addApprovalObj.id].default) {
                this.approval[this.addApprovalObj.id].workJob = data.jobName
              }
            } else {
              this.approval.push(newData)
              this.checkApprovalCustomLength()
            }
          } else {
            if (this.checkRepeatCCman(data.employeeId)) {
              this.$toast('选择抄送人员已重复！')
              return false
            }
            if (this.ccApproval[this.addApprovalObj.id]) {
              this.ccApproval[this.addApprovalObj.id].avatar = data.avatarUrl
              this.ccApproval[this.addApprovalObj.id].employeeId = data.employeeId
              this.ccApproval[this.addApprovalObj.id].name = data.name
              if (!this.ccApproval[this.addApprovalObj.id].default) {
                this.ccApproval[this.addApprovalObj.id].workJob = data.jobName
              }
            } else {
              this.ccApproval.push(newData)
            }
          }
        }
      },
      checkRepeatCCman (id) {
        let result = false
        for (let k in this.ccApproval) {
          if (this.ccApproval[k].employeeId === id) {
            result = true
            break
          }
        }
        return result
      },
      checkApprovalCustomLength () {
        let showWarnningTextLength = 0
        this.approval.forEach(function (item) {
          if (!item.default) {
            showWarnningTextLength++
          }
        })
        this.showWarnningText = showWarnningTextLength > 0
      },
      checkApprovalIsEmpty () {
        let flag = false
        this.approval.forEach(function (item) {
          if (!item.employeeId) {
            flag = true
          }
        })
        return flag
      },
      confirm (evt) {
        console.log(evt)
      },
      onStartDateChange (value) {
        this.validateDate()
      },
      onEndDateChange (value) {
        this.validateDate()
      },
      validateDate () {
        if (this.detail.startDate && this.detail.endDate) {
          let start = new Date(this.dash(this.detail.startDate)).getTime()
          let end = new Date(this.dash(this.detail.endDate)).getTime()
          let step = end - start
          if (step < 0) {
            this.quotaDay = this.durationDay(this.detail.startDate, this.detail.endDate)
            this.$toast('结束时间不能小于开始时间')
            return
          }
          if (this.leaveInfo.quotaType === '天') {
            let left = this.leaveInfo.leftQuota
            step = Math.ceil(step / (24 * 60 * 60 * 1000)) + 1
            if (step > left) {
              this.quotaDay = this.durationDay(this.detail.startDate, this.detail.endDate) + 1
              this.$toast('所选择的休假时长大于额度时长，请重新选择时间')
              return
            } else {
              let cacheDay = this.durationDay(this.detail.startDate, this.detail.endDate) + 1
              if ((this.quotaDay > 14 && cacheDay < 14) || (this.quotaDay < 15 && cacheDay > 14)) {
                console.log('重置审批人')
                this.quotaDay = this.durationDay(this.detail.startDate, this.detail.endDate) + 1
                this.getDefaultApprovalAndCCMan()
              }
              this.quotaDay = this.durationDay(this.detail.startDate, this.detail.endDate) + 1
            }
          }
        }
      },
      face (url) {
        if (url) {
          return 'background-image: url(' + url + ')'
        } else {
          return null
        }
      },
      textOverflow (string) {
        if (string.length > 5) {
          return string.slice(0, 5) + '...'
        }
      },
      changeDate (duration, start, end) {
        let day = new Date(this.dash(start) + ' 00:00:00')
        let newDateString = ''
        let interval = duration * 24 * 60 * 60 * 1000
        let newDate = new Date(day.getTime() + interval)
        if (newDate > new Date(this.dash(end) + ' 00:00:00')) {
          newDateString = end
        } else {
          newDateString = util.fmtDate(newDate, 'yyyy-MM-dd')
        }
        console.log(newDateString)
        this.quotaDay = this.durationDay(start, newDateString) + 1
        return newDateString
      },
      durationDay (start, end) {
        let s = new Date(this.dash(start) + ' 00:00:00')
        let e = new Date(this.dash(end) + ' 00:00:00')
        let interval = 86400000
        return (e - s) / interval
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables';
  $padding: rem($inner-width);
  h3, h4, h5 {
    padding: 0;
    margin: 0;
    font-weight: normal;
  }
  .flex-start {
    .item-box {
      display: flex;
      justify-content: center;
      align-item: center;
      background: white;
      padding: .4rem $padding;
      border-bottom: 1px solid $border-color;
      &.no-flex {
        display: block;
      }
      h4 {
        flex: 1.5;
      }
      span {
        flex: 5;
        text-align: right;
      }
      .explain {
        flex: 5;
        color: $gray;
        text-align: left;
        padding-right: 10px;
        height: 1.2em;
        overflow: hidden;
        text-align: right;
      }
      .weui-cell {
        padding: 0;
      }
    }
    .approval-box {
      clear: both;
      border-top: 1px solid $border-color;
      margin-top: .3rem;
      position: relative;
      h5 {
        height: 30px;
        line-height: 15px;
        font-size: 12px;
        padding: 0 5px;
      }
    }
    .add-approval {
      text-align: center;
      margin-top: .2rem;
      float: left;
      width: 25%;
      height: 115px;
    }
    .add-approval.sortable-chosen .employee-author {
      box-shadow: 0 0 5px red;
    }
    .arrow-right:before {
      right: $padding;
    }
    .margin-top {
      margin-top: .3rem;
    }
    .disabled {
      color: #999;
    }
    .color-gray {
      color: #bbb;
      font-size: 14px;
    }
    .tips {
      padding-top: .1rem;
      padding-left: $padding;
    }
  }

  .inner-padding {
    padding: $padding;
  }
</style>
