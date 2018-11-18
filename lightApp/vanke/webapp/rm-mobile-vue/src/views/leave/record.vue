<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <div class="page-loading" v-if="!pageLoading">
            <span class="m-loading"></span>
          </div>
          <transition name="fadeUp">
            <div v-if="pageLoading">
              <div>
                <div v-if="detail.applyType === 1">
                  <div class="box-white px-tb">
                    <ul class="box-gray list-box">
                      <li class="px-b">申请休假时长<span>{{detail.durationStr}}</span></li>
                      <li>提交时间<span>{{ detail.datetime.replace(/-/g,'/') }}</span></li>
                      <li>请假单号<span>{{detail.applyNumber}}</span></li>
                    </ul>
                    <div :class="detail.state == 3 ||  detail.state == 6 ? 'state fail' : 'state'">
                      <i :class="detail.state == 1 ? 'iconfont icon-approvaled' : ''"></i>
                      <i :class="detail.state == 2 ? 'iconfont icon-passed' : ''"></i>
                      <i :class="detail.state == 3 ? 'iconfont icon-failed' : ''"></i>
                      <i :class="detail.state == 4 ? 'iconfont icon-revoked' : ''"></i>
                      <i :class="detail.state == 5 ? 'iconfont icon-tuihui' : ''"></i>
                      {{ switchState(detail.state, 1) }}
                    </div>
                  </div>
                  <div class="box-white px-tb" v-if="detail.beginDateTime && detail.endDateTime">
                    <div>
                      <span class="f14">休假类型</span>
                      <p class="gray fr">{{ detail.approvals[0].vacationType | filterLeaveType }}</p>
                    </div>
                    <div class="gray mt5">{{ detail.beginDateTime | cutMinute}} 至 {{ detail.endDateTime | cutMinute }}
                    </div>
                  </div>
                  <div class="box-white px-tb" v-for="(day, index) in days" :key="index"
                       v-if="!detail.beginDateTime && !detail.endDateTime">
                    <h3 class="time-title">{{ fmtDate(day, 'yyyy/MM/dd') }}</h3>
                    <ul class="box-gray list-box" v-for="(approval, index) in detail.approvals" :key="index"
                        v-if="approval.onDutyDay == day">
                      <li class="px-b" v-if="approval.regularBeginTime">岗位<span>{{ approval.postShortName }}</span>
                      </li>
                      <li class="px-b" v-if="approval.regularBeginTime">班次<span>{{ approval.shift }} {{ fmtDate(approval.regularBeginTime, 'hh:mm') }}-{{ fmtDate(approval.regularEndTime, 'hh:mm') }}</span>
                      </li>
                      <li class="px-b">休假类型<span>{{ approval.vacationType | filterLeaveType }}</span></li>
                      <li>
                        时间<span>{{ fmtDate(approval.beginTime, 'hh:mm') }} - {{ fmtDate(approval.endTime, 'hh:mm') }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="box-white px-b mt0" v-if="detail.applyType === 2">
                  <h3 class="remark-title">撤销的休假</h3>
                  <ul class="box-gray list-box mt0">
                    <li>撤销类型<span> {{detail.vacationType | filterLeaveType}}</span></li>
                    <li v-if="!detail.durationStr">{{detail.beginDateTime}} - {{detail.endDateTime}}</li>
                    <li v-if="detail.durationStr">申请撤销时长<span>{{detail.durationStr}}</span></li>
                    <li>提交时间<span>{{detail.datetime}}</span></li>
                  </ul>
                </div>
                <div class="box-white px-tb">
                  <h3 class="remark-title px-b">{{detail.applyType == 2 ? '撤假说明' : '休假说明'}}</h3>
                  <p class="gray">{{ detail.remark }}</p>
                </div>

                <div class="box-white px-tb">
                  <ul class="process-list">
                    <li v-if="detail.state == 4" class="nostate">
                      <h3>{{ detail.name }}&nbsp;&nbsp;* {{ detail.job }}</h3>
                      <p class="process-state">{{ detail.updateTime }}
                        <span>撤回审批</span>
                      </p>
                    </li>
                    <li class="" v-if="detail.state == 6 && detail.applyType == 1">
                      <h3>撤销申请已经通过</h3>
                    </li>
                    <li v-for="(process, index) in detail.process" :key="index"
                        :class="process.state == 1 && detail.state != 4 ? '' : 'nostate'"
                        v-if="!(process.state == 1 && detail.state == 4)">
                      <h3 v-if="detail.state == 5">系统</h3>
                      <h3 v-if="detail.state != 5">{{ process.name }}&nbsp;&nbsp;* {{ process.job }}</h3>
                      <p class="process-state">{{ process.date }}
                        <span v-if="detail.state != 5">
                          <i :class="process.state == 1 ? 'iconfont icon-approvaled' : ''"></i>
                          <i :class="process.state == 2 ? 'iconfont icon-passed' : ''"></i>
                          <i :class="process.state == 3 ? 'iconfont icon-failed' : ''"></i>
                          <i :class="process.state == 4 ? 'iconfont icon-revoked' : ''"></i>
                          <i :class="process.state == 5 ? 'iconfont icon-tuihui' : ''"></i>
                          {{ switchState(process.state) }}
                        </span>
                        <span v-if="detail.state == 5">
                          <i class="iconfont icon-tuihui"></i>
                          系统退回
                        </span>
                      </p>
                      <p v-if="process.remark" class="process-remark px-t">{{ process.remark }}</p>
                    </li>
                    <li :class="detail.process.length == 0 ? '' : 'nostate'">
                      <h3>{{ detail.name }}&nbsp;&nbsp;* {{ detail.job }}</h3>
                      <p class="process-state">{{ detail.datetime }}
                        <span>发起审批</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="detail.state == 1 && detail.applyType === 1">
                <div class="box-white repeal-btn px-tb" @click="open()">撤回申请</div>
              </div>
              <div class="pl20" v-if="detail.state == 2 && detail.applyType === 1 && !isVacationStatus">
                <h3 class="gray fw-normal" @click="revoke">撤销该休假></h3>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <model :model-data="model" @on-cancel="model.state = false" @on-confirm="onConfirm()"></model>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import Model from '../../components/model.vue'
  import * as utils from '../../utils/util'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          title: '休假详情'
        },
        detail: {},
        days: [],
        pageLoading: false,
        networkError: false,
        model: {
          state: false,
          title: '',
          content: ''
        },
        isRevokeOrder: false,
        modelMutils: null,
        cache: {},
        fmtDate (dateString, format) {
          if (dateString) {
            return utils.fmtDate(dateString, format)
          } else {
            return null
          }
        },
        switchState (state, type) {
          let stateName = ''
          switch (state) {
            case 1:
            case '1': stateName = '审批中'
              break
            case 2:
            case '2':
              stateName = type ? '审批通过' : '同意'
              break
            case 3:
            case '3':
              stateName = type ? '审批不通过' : '不同意'
              break
            case 4:
            case '4': stateName = '已撤回'
              break
            case '5': stateName = '系统退回'
              break
            case '6': stateName = '已撤销'
              break
            default:
              break
          }
          return stateName
        }
      }
    },
    components: {
      HeaderBar,
      Model
    },
    created () {
      this.isVacationStatus = this.$route.params.isVacationStatus
      this.$axios.get(this.$appConfig.api.getLeaveRecord, {
        params: {
          'mobile': this.$store.state.userInfo.mobile,
          'id': this.$route.query.id
        }
      }).then((res) => {
        this.pageLoading = true
        if (res.status === 'fail') {
          this.networkError = true
          this.$toast(res.errorMessage)
        } else {
          this.detail = res
          this.detail.process.reverse()
          this.headerBar.title = this.detail.applyType === 2 ? '撤假详情' : '休假详情'
          let dayLen = this.detail.approvals.length
          for (let i = 0; i < dayLen; i++) {
            if (this.detail.approvals[i].relatedShift) {
              this.detail.approvals[i].shift += '+' + this.detail.approvals[i].relatedShift.shift
              this.detail.approvals[i].regularEndTime = this.detail.approvals[i].relatedShift.regularEndTime || this.detail.approvals[i].regularEndTime
              this.detail.approvals[i].beginTime = this.detail.approvals[i].beginTime || this.detail.approvals[i].relatedShift.beginTime
              this.detail.approvals[i].endTime = this.detail.approvals[i].relatedShift.endTime || this.detail.approvals[i].endTime
            }
            let day = this.detail.approvals[i].onDutyDay
            if (this.days.length !== 0) {
              let hasDay = this.days.some(function (item, index, arr) {
                if (item === day) return true
              })
              if (!hasDay) this.days.push(day)
            } else {
              this.days.push(day)
            }
          }
        }
      })
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          name: this.isVacationStatus ? 'leaveApprove' : 'leaveList',
          params: {
            refresh: false,
            holidayTypeCode: this.$route.params.holidayTypeCode,
            approveTypeCode: this.$route.params.approveTypeCode,
            isVacationStatus: 1,
            title: '员工休假情况'
          }
        })
      },
      repealLeave () {
        this.$toast({
          msg: '提交中..',
          type: 'loading',
          time: 7000
        })
        this.$axios.post(this.$appConfig.api.repealLeave, {
          id: this.$route.query.id
        }).then((res) => {
          if (res.status === 'success') {
            this.$toast({
              msg: '撤回成功',
              type: 'succes',
              time: 2000
            })
            setTimeout(() => {
              this.$router.push({
                name: 'leaveList',
                params: {
                  freshen: true
                }
              })
            }, 2000)
          }
        })
      },
      open (id) {
        this.model = {
          state: true,
          content: '是否确定撤回该休假申请？',
          noTitle: true
        }
        this.modelMutils = id
      },
      onConfirm () {
        this.model.state = false
        if (this.detail.state === '2' && this.detail.checkWarnType === 2 && this.detail.lockMaxDate) {
          this.link(this.cache.params, this.cache.type)
        } else if (this.detail.state === '2' && this.detail.checkWarnType === 1 && this.detail.lockMaxDate) {
          this.link(this.cache.params, this.cache.type)
        } else {
          this.repealLeave()
        }
      },
      revoke () {
        let onts = utils.leaveType().find(ont => ont.id === this.detail.vacationType)
        let ontoff = onts ? onts.ontOff : undefined
        let params
        if (ontoff) {
          let beginDateTime = this.detail.lockMaxDate ? this.detail.lockMaxDate : utils.fmtDate(this.detail.beginDateTime, 'yyyy-MM-dd')
          params = {
            holidayTypeCode: this.detail.vacationType,
            beginDateTime: beginDateTime,
            endDateTime: utils.fmtDate(this.detail.endDateTime, 'yyyy-MM-dd'),
            data: this.detail.approvals,
            lockMaxDate: this.detail.lockMaxDate ? this.detail.lockMaxDate : null,
            duration: this.detail.duration
          }
        } else {
          params = {
            holidayTypeCode: this.removeRepetition(this.detail.approvals),
            durationStr: this.detail.durationStr,
            beginDateTime: this.detail.approvals[0].beginTime,
            endDateTime: this.detail.approvals[this.detail.approvals.length - 1].endTime
          }
        }
        if (this.detail.checkWarnType === 1) {
          if (!ontoff || (ontoff && utils.fmtDate(this.detail.endDateTime, 'yyyy-MM-dd') === this.detail.lockMaxDate)) {
            let str = '该休假数据已经定案,不能撤销。'
            this.model = {
              state: true,
              content: str,
              cancel: true,
              noTitle: true
            }
            return
          }
          let str = '部分休假数据已定案，只能撤销' + this.detail.lockMaxDate + '之后的休假日期'
          this.model = {
            state: true,
            content: str,
            noTitle: true
          }
          params.beginDateTime = this.resetDay(params.beginDateTime, 1)
          this.cache = {
            params: params,
            type: ontoff
          }
          return
        }
        if (this.detail.checkWarnType === 2 && this.detail.lockMaxDate) {
          let txt = '不能撤销在之前项目的休假数据'
          if (ontoff) {
            let duration = this.resetDay(this.detail.lockMaxDate, -1)
            txt = '部分休假数据属于员工变动之前的数据，只能撤销' + duration + '之后的休假日期'
          }
          this.model = {
            state: true,
            content: txt,
            noTitle: true
          }
          this.cache = {
            params: params,
            type: ontoff
          }
          return
        }
        this.$router.push({
          name: 'leaveRevoke',
          query: {id: this.detail.id, ontoff: ontoff},
          params: params
        })
      },
      resetDay (data, id) {
        let e = new Date(utils.fmtDate(data + ' 00:00:00', 'yyyy/MM/dd hh:mm:ss'))
        let Day = 86400000 * id
        let c = e.getTime() + Day
        let duration = utils.fmtDate(c, 'yyyy-MM-dd')
        return duration
      },
      link (params, type) {
        this.$router.push({
          name: 'leaveRevoke',
          query: {id: this.detail.id, ontoff: type},
          params: params
        })
      },
      removeRepetition (dtos) {
        let leaves = []
        let newLeaves = []
        dtos.forEach(function (leave) {
          leaves.push(leave.vacationType)
        })
        for (let i = 0; i < leaves.length; i++) {
          if (newLeaves.indexOf(leaves[i]) < 0) {
            newLeaves.push(leaves[i])
          }
        }
        return newLeaves
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';

  .flex-start {
    .state {
      text-align: right;
      margin: .5em 0 -.5em;
      color: $primaryBg;
      &.fail {
        color: $warnBg;
      }
    }
    .repeal-btn {
      color: $primaryBg;
      font-size: 120%;
      text-align: center;
      cursor: pointer;
    }
  }

  .sec-detail {
    width: 100%;
    height: 100%;
  }

  .box-white {
    background-color: white;
    padding: rem($inner-width) rem($inner-width);
    margin: rem(20px) 0;
  }

  .box-gray {
    background: #ddd;
    border-radius: .3em;
    margin-top: 1em;
    &:first-child {
      margin-top: 0;
    }
  }

  .time-title,
  .remark-title {
    font-size: 110%;
    font-weight: normal;
    margin: 0;
  }

  .time-title {
    color: $primaryBg;
    margin-bottom: .5em;
  }

  .remark-title {
    padding-bottom: .5em;
  }

  .remark-title + p {
    padding-top: .5em;
  }

  .list-box {
    box-sizing: border-box;
    padding: .2em .8em;
    li {
      line-height: 2.8;
      span {
        float: right;
        color: #999;
      }
    }
  }

  .process-list {
    border-left: 1px solid $border-color;
    margin-left: 1em;
    li {
      margin-top: 2em;
      h3 {
        line-height: 1.2;
        font-weight: normal;
        margin: 0;
        &::before {
          display: inline-block;
          content: '';
          width: 1.3em;
          height: 1.3em;
          border-radius: 50%;
          background: $primaryBg;
          background-image: radial-gradient(circle, transparent, transparent 35%, hsla(0, 0%, 100%, .82) 0);
          transform: translateX(-50%) translateY(-10%);
          vertical-align: middle;
        }
      }
      p {
        font-size: 90%;
        margin-left: 1.5em;
      }
      .process-state {
        line-height: 2.4;
        height: 30px;
        color: $primaryBg;
        span {
          float: right;
        }
      }
      .process-remark {
        padding-top: .5em;
      }
      &:first-child {
        margin-top: .2em;
      }
      &.nostate {
        color: #BCBCBC;
        h3::before {
          color: inherit;
          background: currentColor;
          background-image: radial-gradient(circle, transparent, transparent 35%, hsla(0, 0%, 100%, .82) 0);
        }
        .process-state {
          color: inherit;
        }
      }
    }
  }
</style>
