<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content pb0">
    <div class="box-white px-b mt0" v-if="!isOntoOff">
      <h3 class="remark-title">撤销的休假</h3>
      <ul class="box-gray list-box mt0">
        <li>休假类型<span> <em v-for="(item,index) in holidayType" :key="index">&nbsp;&nbsp;&nbsp;&nbsp;{{item | filterLeaveType}}</em></span>
        </li>
        <li>休假日期<span>{{startTime}} 至 {{endTime}}</span></li>
        <li>休假时长<span>{{durationStr}}</span></li>
      </ul>
    </div>
     <div class="box-white px-b mt0" v-if="isOntoOff">
      <h3 class="remark-title">撤销的休假</h3>
      <ul class="box-gray list-box mt0">
        <li>休假类型<span>{{holidayType | filterLeaveType}}</span></li>
        <li class="flexbox">
          <em class="fw-normal">撤假时间</em>
          <span class="flex">
            <div class="revoke-timeline flexbox">
              <div class="flex">
                <datetime v-model="startTime" class="aa" :start-date="minStartDate" :end-date="maxEndDate"
                          format="YYYY-MM-DD" @on-change="startTimeChange" :title="''" year-row="{value}年"
                          month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
              </div>
              <div class="">—</div>
              <div class="flex">
                <datetime :disabled="disabledEndDate" v-model="endTime" class="aa" :start-date="minStartDate"
                          :end-date="maxEndDate"
                          format="YYYY-MM-DD" @on-change="endTimeChange" :title="''" year-row="{value}年"
                          month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
              </div>
            </div>
          </span>
        </li>
      </ul>
    </div>
    <div class="employee-group px-tb">
      <div class="employee-title">撤销理由</div>
      <v-textarea v-model="cvalue" class="revoke-remark px-tb" :max="120" :height="200" placeholder="请填写完整的撤假理由" @on-blur="onEvent(cvalue)"></v-textarea>
    </div>
    <!-- 审批人 -->
        <!-- 审批人 -->
      <div class="employee-group px-tb">
        <div class="employee-title px-b">审批人</div>
        <div class="page-loading" v-show="!pageLoading">
          <span class="m-loading">
          </span>
        </div>
        <div class="approval-box clearfix" v-show="pageLoading">
          <draggable v-model="ApprovalEmployees.approval" class="" :options="{handle:'.allowed-mod'}">
            <div class="add-approval" :class="{'allowed-mod': !item.default}"  v-for="(item, index) in ApprovalEmployees.approval" :key="index">
              <h5 class="color-gray">{{ item.workJob || '&nbsp;' }}</h5>
              <span class="employee-author" :class="getEmployeeClass(item)" :style="face(item.avatar)"
                    @click="addEmploye('approval', item, index)"></span>
              <h4>{{ item.name}}</h4>
            </div>
          </draggable>
          <div class="add-approval"
               v-show="ApprovalEmployees.approval.length < 8">
            <h5 class="color-gray">
              <span>&nbsp;</span>
            </h5>
            <span class="employee-author add"
                  @click="addEmploye('approval')"></span>
            <h4>&nbsp;</h4>
          </div>
        </div>
      </div>
      <div class="gray" v-if="showWarnningText" style="padding-left: 20px">长按可调整自添加人员顺序</div>
      <!-- 抄送人 -->
      <div class="employee-group px-tb">
        <div class="employee-title px-b">抄送人</div>
        <div class="page-loading" v-show="!pageLoading">
          <span class="m-loading">
          </span>
        </div>
        <div class="approval-box clearfix" v-show="pageLoading">
          <draggable v-model="ApprovalEmployees.ccMan" class="" :options="{handle:'.allowed-mod'}">
            <div class="add-approval" :class="{'allowed-mod': !item.default}" v-for="(item, index) in ApprovalEmployees.ccMan" :key="index">
              <h5 class="color-gray">{{ item.workJob || '&nbsp;' }}</h5>
              <span class="employee-author" :class="getEmployeeClass(item)" :style="face(item.avatar)"
                    @click="addEmploye('ccApproval', item, index)"></span>
              <h4>{{ item.name}}</h4>
            </div>
          </draggable>
          <div class="add-approval" v-show="ApprovalEmployees.ccMan.length < 4">
            <h5 class="color-gray">
              <span>&nbsp;</span>
            </h5>
            <span class="employee-author add"
                  @click="addEmploye('ccApproval')"></span>
            <h4>&nbsp;</h4>
          </div>
        </div>
      </div>
      <div class="gray" v-if="ApprovalEmployees.ccMan.length > 1" style="padding-left: 20px">长按可调整自添加人员顺序</div>
      <div class="p20">
        <button type="button" class="ev-btn ev-btn--primary ev-btn-small" @click="active">提交</button>
      </div>
  </div>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getApprovalPersons"></add-person>
    <model class="revoke-model" :model-data="model" @on-cancel="onCancel()" @on-confirm="onConfirm()"></model>
  </div>
</template>

<script>
import HeaderBar from '../../components/header.vue'
import VTextarea from '../../components/v-textarea.vue'
import addPerson from '../../components/addPerson.vue'
import Model from '../../components/model.vue'
import * as util from '../../utils/util'
import { Datetime } from 'vux'
import draggable from 'vuedraggable'
export default {
  data () {
    return {
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        title: '我要撤假'
      },
      model: {
        state: false,
        title: '',
        content: ''
      },
      cvalue: '',
      pageLoading: false,
      startTime: '',
      endTime: '',
      userInfo: null,
      isOntoOff: null,
      holidayType: null,
      minStartDate: null,
      maxEndDate: null,
      addPersonState: false,
      ApprovalEmployees: {
        approval: [],
        ccMan: []
      },
      maskState: false,
      approvalJob: [],
      ccManJob: null,
      fetchData: null,
      durationStr: null,
      checkDateAlert: '',
      routeParams: {},
      modelCache: {},
      disabledEndDate: false,
      paramType: null,
      addApprovalObj: {},
      showWarnningText: false
    }
  },
  created () {
    this.userInfo = this.$store.state.userInfo
    if (typeof this.$route.query.ontoff === 'undefined') {
      this.$toast('找不到该休假类型！')
      setTimeout(() => {
        this.leftBtnClick()
      }, 100)
      // name: 'leaveRecord', query: {id: item.id}, params: {holidayTypeCode: holidayTypeCode}
    } else {
      this.isOntoOff = this.$route.query.ontoff
      this.holidayType = this.$route.params.holidayTypeCode
      this.routeParams = this.$route.params
      if (this.isOntoOff) {
        this.minStartDate = this.$route.params.beginDateTime
        this.maxEndDate = this.$route.params.endDateTime
        this.endTime = this.$route.params.endDateTime
        this.startTime = this.$route.params.beginDateTime
        this.disabledEndDate = this.$route.params.lockMaxDate || false
      } else {
        this.durationStr = this.$route.params.durationStr
        this.endTime = util.fmtDate(this.$route.params.endDateTime, 'yyyy-MM-dd')
        this.startTime = util.fmtDate(this.$route.params.beginDateTime, 'yyyy-MM-dd')
      }
      this.getDefaultApprovalAndCCMan()
    }
  },
  methods: {
    leftBtnClick () {
      if (this.addPersonState) {
        this.addPersonState = false
        return
      }
      this.$router.push({
        name: 'leaveRecord',
        query: {id: this.$route.query.id},
        params: {holidayTypeCode: this.$route.params.holidayTypeCode}
      })
    },
    onEvent (msg) {
      console.log(msg)
    },
    startTimeChange (msg) {
      this.checkDate(msg, this.endTime)
    },
    endTimeChange (msg) {
      this.checkDate(this.startTime, msg)
    },
    checkDate (a, b) {
      if (a !== this.minStartDate && b !== this.maxEndDate) {
        this.checkDateAlert = '一次性休假不支持撤销原休假的中间时段。'
      } else {
        this.checkDateAlert = ''
      }
    },
    face (url) {
      if (url) {
        return 'background-image: url(' + url + ')'
      } else {
        return null
      }
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
    typeChange (item) {
      let result = ''
      for (let k = 0; k < item.length; k++) {
        result += util.changeType(item[k]) + '&nbsp&nbsp'
      }
      return result
    },
    durationDay (start, end) {
      let s = util.fmtDate(start + ' 00:00:00', 'yyyy/MM/dd hh:mm:ss')
      let e = util.fmtDate(end + ' 00:00:00', 'yyyy/MM/dd hh:mm:ss')
      let oneDay = 86400000
      let duration = new Date(e) - new Date(s)
      return (duration / oneDay) + 1
    },
    active () {
      if (this.checkDateAlert) {
        this.model = {
          state: true,
          content: this.checkDateAlert,
          noTitle: true,
          cancel: true
        }
        return
      }
      if (!this.cvalue) {
        this.$toast('请填写撤假理由')
        return
      }
      if (this.checkApprovalIsEmpty()) {
        this.$toast('请选择审批人员')
        return
      }
      if (!this.ApprovalEmployees.ccMan[0].employeeId) {
        this.$toast('请选择抄送人员')
        return
      }
      if (this.isOntoOff) {
        let type = util.changeType(this.holidayType)
        let day = this.durationDay(this.startTime, this.endTime)
        let str = `撤假类型：${type}<br>撤假日期：${this.startTime}至${this.endTime}
        <br>撤假时长：${day}天`
        if (this.startTime === this.minStartDate && this.endTime === this.maxEndDate) {
          // 整假撤销
          this.model = {
            state: true,
            content: str,
            title: '是否提交以下撤假申请？'
          }
        } else {
          // 非整假撤销
          this.model = {
            state: true,
            content: util.changeType(this.holidayType) + '属于一次性休假，撤销成功后余额会清零。',
            noTitle: true,
            cancel: true
          }
          this.modelCache = {
            str: str,
            type: type
          }
        }
      } else {
        let type = this.typeChange(this.holidayType)
        let str = `撤假类型：${type}<br>撤假日期：${this.startTime}至${this.endTime}
        <br>撤假时长：${this.durationStr}`
        this.model = {
          state: true,
          content: str,
          title: '确定撤销以下休假申请？'
        }
      }
    },
    onCancel () {
      this.model.state = false
      if (!util.isEmpty(this.modelCache)) {
        this.model = {
          state: true,
          content: '(撤销后不会还原额度) <br/>' + this.modelCache.str,
          title: '是否提交以下撤假申请？'
        }
        this.modelCache = {}
      }
    },
    onConfirm () {
      console.log('in')
      this.model.state = false
      this.$toast({
        msg: '提交中..',
        type: 'loading',
        time: 7000
      })
      let ccApprovalIds = []
      let approvalIds = []
      this.ApprovalEmployees.ccMan.forEach((v) => {
        v.employeeId && ccApprovalIds.push(v.employeeId)
      })
      this.ApprovalEmployees.approval.forEach((v) => {
        v.employeeId && approvalIds.push(v.employeeId)
      })
      let params = {
        employeeId: this.userInfo.id,
        id: this.$route.query.id,
        remark: this.cvalue,
        // firstApprovalId: this.ApprovalEmployees.approval[0].employeeId,
        // secondApprovalId: this.ApprovalEmployees.approval[1].employeeId,
        ccApprovalIds: ccApprovalIds,
        approvalIds: approvalIds,
        beginDate: this.isOntoOff ? this.startTime + ' 00:00' : null,
        endDate: this.isOntoOff ? this.endTime + ' 23:59' : null
      }
      console.log(params)
      this.$axios.post(this.$appConfig.api.revokeHoliday, params)
      .then((res) => {
        if (res.status === 'fail') {
          this.$toast(res.errorMessage || res.exceptionType)
          return
        }
        this.$toast({
          msg: '提交成功',
          type: 'succes',
          time: 2000
        })
        this.$router.push({
          name: 'leaveList',
          params: {freshen: true}
        })
      })
    },
    checkApprovalIsEmpty () {
      let flag = false
      this.ApprovalEmployees.approval.forEach(function (item) {
        if (!item.employeeId) {
          flag = true
        }
      })
      return flag
    },
    checkApprovalCustomLength () {
      let showWarnningTextLength = 0
      this.ApprovalEmployees.approval.forEach(function (item) {
        if (!item.default) {
          showWarnningTextLength++
        }
      })
      this.showWarnningText = showWarnningTextLength > 0
    },
    addEmploye (type, item, id) {
      if (item && item.department) {
        this.$toast('默认人员不可修改')
        return false
      }
      if (item && !item.default) {
        if (type === 'ccApproval') {
          this.ApprovalEmployees.ccMan.splice(id, 1)
        } else {
          this.ApprovalEmployees.approval.splice(id, 1)
          this.checkApprovalCustomLength()
        }
        return false
      }
      this.addPersonState = true
      this.addApprovalObj = {
        id: item ? id : this.ApprovalEmployees.approval.length,
        type: type
      }
      if (type === 'ccApproval' && !item) {
        this.addApprovalObj.id = this.ApprovalEmployees.ccMan.length
      }
      this.fetchData = this.$appConfig.api.searchLeaders + '?departmentId=' + this.userInfo.departmentId
    },
    getApprovalPersons (data) {
      if (!util.isEmpty(data)) {
        this.addPersonState = false
        let selectedEmploye = {
          avatar: data.avatarUrl,
          employeeId: data.employeeId,
          workJob: data.jobName,
          name: data.name
        }
        if (this.addApprovalObj.type === 'ccApproval') {
          if (this.checkRepeatCCman(data.employeeId)) {
            this.$toast('选择抄送人员已重复！')
            return false
          }
          if (this.ApprovalEmployees.ccMan[this.addApprovalObj.id]) {
            this.ApprovalEmployees.ccMan[this.addApprovalObj.id].avatar = data.avatarUrl
            this.ApprovalEmployees.ccMan[this.addApprovalObj.id].employeeId = data.employeeId
            this.ApprovalEmployees.ccMan[this.addApprovalObj.id].name = data.name
            if (!this.ApprovalEmployees.ccMan[this.addApprovalObj.id].default) {
              this.ApprovalEmployees.ccMan[this.addApprovalObj.id].workJob = data.jobName
            }
          } else {
            this.ApprovalEmployees.ccMan.push(selectedEmploye)
          }
        } else {
          if (this.ApprovalEmployees.approval[this.addApprovalObj.id]) {
            this.ApprovalEmployees.approval[this.addApprovalObj.id].avatar = data.avatarUrl
            this.ApprovalEmployees.approval[this.addApprovalObj.id].employeeId = data.employeeId
            this.ApprovalEmployees.approval[this.addApprovalObj.id].name = data.name
            if (!this.ApprovalEmployees.approval[this.addApprovalObj.id].default) {
              this.ApprovalEmployees.approval[this.addApprovalObj.id].workJob = data.jobName
            }
          } else {
            this.ApprovalEmployees.approval.push(selectedEmploye)
          }
        }
      }
    },
    checkRepeatCCman (id) {
      let result = false
      for (let k in this.ApprovalEmployees.ccMan) {
        if (this.ApprovalEmployees.ccMan[k].employeeId === id) {
          result = true
          break
        }
      }
      return result
    },
    getDefaultApprovalAndCCMan () {
      let paramType = null
      let revokeDay = this.ontoff ? this.routeParams.duration : this.computeDuration()
      if (this.userInfo.jobState === 'out') {
        paramType = 0
        this.ccManJob = ''
      } else {
        if (this.userInfo.jobName.indexOf('系统负责人') === -1) {
          paramType = revokeDay < 15 ? 1 : 2
          this.ccManJob = '人力资源专员'
          this.approvalJob = revokeDay < 15 ? ['直属上级', '人力资源专员', '对接合伙人'] : ['直属上级', '人力资源专员', '对接合伙人', '管理中心总经理', '人力资源部负责人']
        } else {
          paramType = revokeDay < 15 ? 3 : 4
          this.ccManJob = '管理中心HRBP'
          this.approvalJob = revokeDay < 15 ? ['人力资源专员', 'HRBP', '对接合伙人'] : ['人力资源专员', '对接合伙人', '管理中心总经理', '人力资源部负责人']
        }
      }
      this.paramType = paramType
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
          this.ApprovalEmployees = res
          this.pageLoading = true
        })
      }, 200)
    },
    computeDuration () {
      let result = null
      if (this.isOntoOff) {
        result = this.routeParams.duration
      } else {
        result = this.durationComputedDay(this.routeParams.beginDateTime, this.routeParams.endDateTime)
      }
      return result
    },
    durationComputedDay (start, end) {
      let s = new Date(this.dash(start))
      let e = new Date(this.dash(end))
      let interval = 86400000
      return (e - s) / interval
    },
    dash (data) {
      return data ? data.replace(/-/g, '/') : null
    }
  },
  components: {
    HeaderBar,
    VTextarea,
    Model,
    Datetime,
    addPerson,
    draggable
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/Common/_variables';
.revoke-remark {
  textarea {
    vertical-align: middle;
  }
}
.revoke-timeline {
  padding-left: 5px;
}
.revoke-timeline {
  .weui-cell {
    padding: 0px 5px;
    background-color: #fff;
    border-radius: 2px;
    height: rem(58px);
    margin: rem(10px) 3px 0;
    &[disabled="disabled"] {
      pointer-events: none;
      background-color: #ece8e8;
    }
  }
  .weui-cell_access .weui-cell__ft {
    padding-right: 0;
    text-align: center;
  }
  .weui-cell_access .weui-cell__ft:after {
    display: none;
  }
}

.disabled-datetime {
  padding: 0px 5px;
  background-color: #ece8e8;
  border-radius: 2px;
  height: rem(58px);
  line-height: rem(58px);
  margin: rem(10px) 3px 0;
  text-align: center;
}
// model
.revoke-model .ev-model-box .ev-model-content {
  text-align: left;
}
.pb0 {
  padding-bottom: 0;
}

.approval-box {
  clear: both;
  margin-top: .3rem;
  h5 {
    height: 30px;
    line-height: 15px;
    font-size: 12px;
    padding: 0 5px;
    font-weight: 400;
  }
  h4 {
    height: 23px;
    font-weight: 400;
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
</style>
