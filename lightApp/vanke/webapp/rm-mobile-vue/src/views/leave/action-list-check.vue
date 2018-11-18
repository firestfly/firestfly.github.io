<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <div class="page-loading" v-show="!pageLoading">
        <span class="m-loading">
        </span>
      </div>
      <div v-show="pageLoading">
        <ul class="list">
          <li class="list-item list-item-touch-active">
            <a @click="continueApply" class="list-item-inner">
              继续添加休假申请
              <div class="list-item-right icon-angle-right">
              </div>
            </a>
          </li>
        </ul>
        <div class="pt5 pb15 tc gray">
          申请休假时长共计 <span class="color-primary">{{listData.totalHours}}</span>
        </div>
        <div class="bg-white p15 px-tb mb15" v-for="(item,index) in listData.holidayInfo" :key="index">
          <div class="box-justify">
            <span class="color-primary">{{item.date}}</span>
          </div>
          <ul class="list list-corner" v-if="item.hasAlternateHoliday == 1">
            <li class="list-item list-item-touch-active">
              <div class="list-item-inner">
                <div class="list-item-left">
                  班次
                </div>
                <div class="list-item-right">
                  月休
                </div>
              </div>
            </li>
            <li class="list-item list-item-touch-active">
              <div class="list-item-inner">
                <div class="list-item-left">
                  无需请假
                </div>
              </div>
            </li>
          </ul>
          <ul class="list list-corner" v-for="(shiftObj, index) in item.shiftData" :key="index"
              v-if="item.hasAlternateHoliday != 1">
            <li class="list-item list-item-touch-active">
              <div class="list-item-inner">
                <div class="list-item-left">
                  岗位
                </div>
                <div class="list-item-right">
                  {{ shiftObj.postShortName }}
                </div>
              </div>
            </li>
            <li class="list-item list-item-touch-active">
              <div class="list-item-inner">
                <div class="list-item-left">
                  班次
                </div>
                <div class="list-item-right">
                  {{shiftObj.shiftForShow}}（{{shiftObj.onDutyTime | cutMinute}}-{{shiftObj.offDutyTimeForShow |
                  cutMinute}}）
                </div>
              </div>
            </li>
            <li class="list-item list-item-touch-active">
              <div class="list-item-inner">
                <div class="list-item-left">
                  休假类型
                </div>
                <div class="list-item-right">
                  {{ shiftObj.vacationTypeForShow }}
                </div>
              </div>
            </li>
            <li class="list-item list-item-touch-active">
              <div class="list-item-inner">
                <div class="list-item-left">
                  时间
                </div>
                <div class="list-item-right">
                  {{shiftObj.beginTime | cutMinute}}-{{shiftObj.endTimeForShow | cutMinute}}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="p15 bg-white mt15 px-tb">
          <div class="f16">休假说明</div>
          <div class="gray mt5">{{listData.vacationExplain}}</div>
        </div>
        <!-- 审批人 -->
        <div class="employee-group px-tb">
          <div class="employee-title px-b">审批人</div>
          <div class="approval-box clearfix">
            <draggable v-model="employeeGroup.approval" class="" :options="{handle:'.allowed-mod'}">
              <div class="add-approval" :class="{'allowed-mod': !item.default}" v-for="(item, index) in employeeGroup.approval" :key="index">
                <h5 class="color-gray">{{ item.workJob || '&nbsp;' }}</h5>
                <span class="employee-author" :class="getEmployeeClass(item)" :style="face(item.avatar)"
                      @click="addEmploye('Approval', item, index)"></span>
                <h4>{{ item.name}}</h4>
              </div>
            </draggable>
            <div class="add-approval" v-show="employeeGroup.approval.length < 8">
              <h5 class="color-gray">
                <span>&nbsp;</span>
              </h5>
              <span class="employee-author add"
                    @click="addEmploye('Approval')"></span>
              <h4>&nbsp;</h4>
            </div>
          </div>
        </div>
        <div class="gray" v-if="showWarnningText" style="padding-left: 20px">长按可调整自添加人员顺序</div>
        <!-- 抄送人 -->
        <div class="employee-group px-tb">
          <div class="employee-title px-b">抄送人</div>
          <div class="approval-box clearfix">
            <draggable v-model="employeeGroup.ccMan" class="" :options="{handle:'.allowed-mod'}">
              <div class="add-approval" :class="{'allowed-mod': !cc.default}" v-for="(cc, index) in employeeGroup.ccMan" :key="index">
                <h5 class="color-gray"> {{ cc.workJob || '&nbsp;' }} </h5>
                <span class="employee-author" :class="getEmployeeClass(cc)" @click="addEmploye('ccMan', cc, index)"
                      :style="face(cc.avatar)"></span>
                <h4>{{ cc.name}}</h4>
              </div>
            </draggable>
            <div class="add-approval" v-show="employeeGroup.ccMan.length < 4">
              <h5 class="color-gray">
                <span>&nbsp;</span>
              </h5>
              <span class="employee-author add"
                    @click="addEmploye('ccMan')"></span>
              <h4>&nbsp;</h4>
            </div>
          </div>
        </div>
        <div class="gray" v-if="employeeGroup.ccMan.length > 1" style="padding-left: 20px">长按可调整自添加人员顺序</div>
        <div class="inner-padding">
          <button type="button" class="ev-btn ev-btn--primary ev-btn-small" @click="action">提交</button>
        </div>
      </div>
    </div>
    <model :model-data="model" @on-cancel="model.state = false" @on-confirm="onConfirm()"></model>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getApprovalPersons"></add-person>
  </div>
</template>
<script>
import HeaderBar from '../../components/header.vue'
import addPerson from '../../components/addPerson.vue'
import Model from '../../components/model.vue'
import draggable from 'vuedraggable'
import * as util from '../../utils/util'
export default {
  data () {
    return {
      pageLoading: false,
      listData: JSON.parse(JSON.stringify(this.$store.state.leave.cache)),
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: ''
        },
        title: '我要休假'
      },
      employeeGroup: {
        approval: [],
        ccMan: []
      },
      addPersonState: false,
      fetchData: null,
      cacheEmploye: null,
      addApprovalIndex: null,
      employeType: null,
      approvalJob: [],
      ccManJob: '',
      model: {
        state: false,
        title: '',
        content: ''
      },
      saveParams: null,
      addApprovalObj: {},
      showWarnningText: false
    }
  },
  created () {
    this.userInfo = this.$store.state.userInfo
    let paramType = null
    let quotaDay = this.listData.holidayInfo.length
    if (this.userInfo.jobState === 'out') {
      paramType = 0
      this.ccManJob = ''
    } else {
      if (this.userInfo.jobName && this.userInfo.jobName.indexOf('系统负责人') === -1) {
        paramType = quotaDay < 15 ? 1 : 2
        this.ccManJob = '人力资源专员'
        this.approvalJob = quotaDay < 15 ? ['直属上级', '人力资源专员', '对接合伙人'] : ['直属上级', '人力资源专员', '对接合伙人', '管理中心总经理', '人力资源部负责人']
      } else {
        paramType = quotaDay < 15 ? 3 : 4
        this.ccManJob = '管理中心HRBP'
        this.approvalJob = quotaDay < 15 ? ['人力资源专员', 'HRBP', '对接合伙人'] : ['人力资源专员', '对接合伙人', '管理中心总经理', '人力资源部负责人']
      }
    }
    let params = {
      departments: this.userInfo.departmentId,
      loginMobile: this.userInfo.mobile,
      type: paramType
    }
    this.$axios.get(this.$appConfig.api.searchHolidayApprovalAndCCMan, {params: params})
    .then(res => {
      this.pageLoading = true
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
      this.employeeGroup = res
    })
  },
  components: {
    HeaderBar,
    addPerson,
    Model,
    draggable
  },
  methods: {
    leftBtnClick () {
      if (this.addPersonState) {
        this.addPersonState = false
      } else {
        this.$router.push({
          path: 'action',
          query: {
            back: true
          }
        })
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
    addCCMan (id, type, item) {
      if (item && item.department) {
        this.$toast('默认人员不可修改')
        return false
      }
      this.employeType = type
      this.addApprovalIndex = id
      this.addPersonState = true
      this.headerBar.rightBtn.text = '确定'
      this.fetchData = this.$appConfig.api.searchLeaders + '?departmentId=' + this.userInfo.departmentId
    },
    addEmploye (type, item, id) {
      if (item && item.department) {
        this.$toast('默认人员不可修改')
        return false
      }
      if (item && !item.default) {
        if (type === 'ccMan') {
          this.employeeGroup.ccMan.splice(id, 1)
        } else {
          this.employeeGroup.approval.splice(id, 1)
          this.checkApprovalCustomLength()
        }
        return false
      }
      this.addPersonState = true
      this.addApprovalObj = {
        id: item ? id : this.employeeGroup.approval.length,
        type: type
      }
      if (type === 'ccApproval' && !item) {
        this.addApprovalObj.id = this.employeeGroup.ccMan.length
      }
      this.fetchData = this.$appConfig.api.searchLeaders + '?departmentId=' + this.userInfo.departmentId
    },
    getApprovalPersons (data) {
      this.cacheEmploye = data
      if (!util.isEmpty(data)) {
        this.addPersonState = false
        let newData = {
          avatar: data.avatarUrl,
          employeeId: data.employeeId,
          name: data.name,
          workJob: data.jobName
        }
        if (this.addApprovalObj.type === 'Approval') {
          if (this.employeeGroup.approval[this.addApprovalObj.id]) {
            this.employeeGroup.approval[this.addApprovalObj.id].avatar = data.avatarUrl
            this.employeeGroup.approval[this.addApprovalObj.id].employeeId = data.employeeId
            this.employeeGroup.approval[this.addApprovalObj.id].name = data.name
            if (!this.employeeGroup.approval[this.addApprovalObj.id].default) {
              this.employeeGroup.approval[this.addApprovalObj.id].workJob = data.jobName
            }
          } else {
            this.employeeGroup.approval.push(newData)
            this.checkApprovalCustomLength()
          }
        } else {
          if (this.checkRepeatCCman(data.employeeId)) {
            this.$toast('选择抄送人员已重复！')
            return false
          }
          if (this.employeeGroup.ccMan[this.addApprovalObj.id]) {
            this.employeeGroup.ccMan[this.addApprovalObj.id].avatar = data.avatarUrl
            this.employeeGroup.ccMan[this.addApprovalObj.id].employeeId = data.employeeId
            this.employeeGroup.ccMan[this.addApprovalObj.id].name = data.name
            if (!this.employeeGroup.ccMan[this.addApprovalObj.id].default) {
              this.employeeGroup.ccMan[this.addApprovalObj.id].workJob = data.jobName
            }
          } else {
            this.employeeGroup.ccMan.push(newData)
          }
        }
      }
    },
    checkRepeatCCman (id) {
      let result = false
      for (let k in this.employeeGroup.ccMan) {
        if (this.employeeGroup.ccMan[k].employeeId === id) {
          result = true
          break
        }
      }
      return result
    },
    checkApprovalCustomLength () {
      let showWarnningTextLength = 0
      this.employeeGroup.approval.forEach(function (item) {
        if (!item.default) {
          showWarnningTextLength++
        }
      })
      this.showWarnningText = showWarnningTextLength > 0
    },
    continueApply () {
      this.$router.push({
        path: 'action',
        query: {
          step: 1
        }
      })
    },
    action () {
      let dateArr = []
      for (let i = 0, arr = this.listData.holidayInfo, len = arr.length; i < len; i++) {
        if (arr[i].hasTrip) {
          dateArr.push(arr[i].date)
        }
      }
      if (this.checkApprovalIsEmpty()) {
        this.$toast('请选择审批人员')
        return false
      }
      if (!this.employeeGroup.ccMan[0].employeeId) {
        this.$toast('请选择抄送人')
        return
      }
      let str = '本次申请休假总时长为' + this.listData.totalHours + ','
      if (dateArr.length) {
        str += dateArr.join(',') + '中安排了外勤/出差,'
      }
      str += '是否确定提交申请？'
      this.model = {
        state: true,
        content: str,
        noTitle: true
      }
    },
    save (params) {
      this.$toast({
        msg: '提交中..',
        type: 'loading',
        time: 7000
      })
      this.$axios.post(this.$appConfig.api.vacation, params).then(response => {
        if (response.errorMessage) {
          this.$toast(response.errorMessage)
          return
        }
        this.$parent.transformData = {}
        this.$store.dispatch('UPDATE_CACHE', null)
        this.$toast({
          msg: '提交成功',
          type: 'succes',
          time: 2000
        })
        setTimeout(() => {
          this.$router.push({
            path: '/leave/'
          })
        }, 500)
      })
    },
    onConfirm () {
      this.model.state = false
      if (this.saveParams) {
        this.save(this.saveParams)
        return false
      }
      let ccApprovalIds = []
      let approvalIds = []
      this.employeeGroup.approval.forEach((v) => {
        v.employeeId && approvalIds.push(v.employeeId)
      })
      this.employeeGroup.ccMan.forEach((v) => {
        v.employeeId && ccApprovalIds.push(v.employeeId)
      })
      let params = {
        vacationExplain: this.listData.vacationExplain,
        employeeId: this.userInfo.id,
        beginDate: this.listData.beginDate,
        endDate: this.listData.endDate,
        approvalIds: approvalIds,
        ccApprovalIds: ccApprovalIds
      }
      let cycle = []
      params.holidayInfo = JSON.parse(JSON.stringify(this.listData.holidayInfo))
      params.holidayInfo = params.holidayInfo.filter((item) => {
        cycle.push(item.date)
        return +item.hasAlternateHoliday !== 1 && +item.hasWorkTwoOrOneRestOne !== 1
      })
      this.$axios.get(this.$appConfig.api.isCrossAttendanceCycle + '?dates=' + cycle.join()).then(response => {
        if (response > 1) {
          this.model = {
            state: true,
            noTitle: true,
            content: '该休假申请跨考勤周期，审核成功后将会分成' + response + '个休假单'
          }
          this.saveParams = params
        } else {
          this.saveParams = null
          this.save(params)
        }
      }).catch(function (response) {
        console.log(response)
      })
    },
    checkApprovalIsEmpty () {
      let flag = false
      this.employeeGroup.approval.forEach(function (item) {
        if (!item.employeeId) {
          flag = true
        }
      })
      return flag
    },
    dash (data) {
      return data ? data.replace(/-/g, '/') : null
    }
  }
}
</script>
<style lang="scss" scoped>
  .list.list-corner {
    background-color: #f1f1f1;
  }

  .inner-padding {
    padding: .4rem
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
