<template>
  <div class="">
    <head-bar :title="title" :leftBtn="leftBtn" @leftBtnClick="back()"></head-bar>
    <div class="content pb0">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div v-if="!networkError">
        <div class="fixed">
            <div class="page-loading" v-if="!pageLoading">
            <span class="m-loading">
            </span>
            </div>
            <div v-if="pageLoading">
              <div class="box-white px-b mt0" v-if="detail.applyType === 2">
                <h3 class="remark-title">撤销的休假</h3>
                <ul class="box-gray list-box mt0">
                  <li>休假类型<span> {{detail.vacationType | filterLeaveType}}</span></li>
                  <li v-if="!detail.durationStr">{{detail.beginDateTime}} - {{detail.endDateTime}}</li>
                  <li v-if="detail.durationStr">申请休假时长<span>{{detail.durationStr}}</span></li>
                  <li>提交时间<span>{{detail.datetime}}</span></li>
                </ul>
              </div>
              <div v-if="detail.applyType === 1">
                <div class="bg-white pb10 pl15 pr15 pt5 mt15">

                  <ul class="list list-corner bg">
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">姓名：</div>
                        <div class="list-item-right">{{detail.name}}</div>
                      </div>
                    </li>
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">项目：</div>
                        <div class="list-item-right">{{detail.departmentName}}</div>
                      </div>
                    </li>
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">职位：</div>
                        <div class="list-item-right">{{detail.job}}</div>
                      </div>
                    </li>
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">联系方式：</div>
                        <div class="list-item-right">{{detail.tel || '-'}}</div>
                      </div>
                    </li>
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">请假单号：</div>
                        <div class="list-item-right">{{detail.applyNumber}}</div>
                      </div>
                    </li>
                  </ul>
                  <div class="tr gray">提交时间:{{detail.datetime}}</div>
                </div>
                <div class="box-white px-tb" v-if="detail.beginDateTime && detail.endDateTime">
                  <div>
                    <span class="f14">休假类型</span>
                    <p class="gray fr">{{ detail.approvals[0].vacationType | filterLeaveType }}</p>
                  </div>
                  <div class="green f12 mt5">{{ detail.beginDateTime | cutMinute}} 至 {{ detail.endDateTime | cutMinute}}</div>
                </div>
                <div class="bg-white p15 pb5 mt15 px-tb" v-for="(item, outIndex) in approvals" :key="outIndex"
                     v-if="!detail.beginDateTime && !detail.endDateTime">
                  <div class="green"> {{ item.onDutyDay }}</div>
                  <ul class="list list-corner" v-for="(shift, index) in item.shiftData" :key="index">
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">岗位：</div>
                        <div class="list-item-right">{{shift.postShortName}}</div>
                      </div>
                    </li>
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">班次：</div>
                        <div class="list-item-right">{{shift.shift}} {{ fmtDate(shift.regularBeginTime, 'hh:mm') }}-{{ fmtDate(shift.regularEndTime, 'hh:mm') }}</div>
                      </div>
                    </li>
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">休假类型：</div>
                        <div class="list-item-right">{{shift.vacationType | filterLeaveType}}</div>
                      </div>
                    </li>
                    <li class="list-item">
                      <div class="list-item-inner">
                        <div class="list-item-left">时间：</div>
                        <div class="list-item-right">{{shift.beginTime | date('hh:mm')}}-{{shift.endTime |
                          date('hh:mm')}}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="pt15 bg-white px-tb mt15">
                <div class="pb15 pl15 pr15" @click="showRemark = !showRemark">{{detail.applyType == 2 ? '撤销理由' :
                  '休假说明'}}<i class="icon-angle-top fr"
                             :class="{'icon-angle-bottom': showRemark, 'icon-angle-top': !showRemark}"></i>
                </div>
                <div class="p15 px-t" v-show="showRemark">{{detail.remark}}</div>
              </div>
              <div class="list px-tb">
                <div class="progress">
                  <div class="progress-content" v-if="detail.state == '4'">
                    <div class="progress-name">{{detail.name}} <span class="fr gray">{{detail.updateTime}}</span></div>
                    <div class="color-primary red">
                      撤销审批
                    </div>
                  </div>
                  <div class="progress-content" v-if="detail.state == '2' && detail.applyType == 2">
                    <div class="progress-name">撤销申请已通过</div>
                  </div>
                  <div class="progress-content" v-for="(item, index) in detail.process" :key="index"
                       v-if="!(detail.state == '4' && item.state == '1')">
                    <div class="progress-name">{{item.name}} <span class="fr gray">{{item.date}}</span></div>
                    <div class="color-primary" :class="{'red': item.state == '3', 'orange': item.state == '1',}">
                      {{stateFilter(item.state)}}
                    </div>
                    <div class="gray">{{item.remark}}</div>
                  </div>
                  <div class="progress-content">
                    <div class="progress-name">{{detail.name}} <span class="fr gray">{{detail.datetime}}</span></div>
                    <div class="color-primary ">发起申请</div>
                    <div class="gray"></div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <!-- <div class="pt15 bg-white px-tb" v-if="isDone == 0 && pageLoading">
          <p class="pl15 pr15 px-b pb15">审批意见</p>
          <textarea name="" id="" cols="30" rows="10" placeholder="输入审批意见"></textarea>
        </div> -->
      </div>
    </div>
    <div class="flexbox bottom-btn p15" v-if="isDone == 0 && pageLoading">
      <div class="flex mr10 m">
        <div class="btn btn-success" :class="{'disabled': disabled}" @click="action(1)">同意</div>
      </div>
      <div class="flex ml10">
        <div class="btn btn-danger" @click="action(0)">不同意</div>
      </div>
    </div>
    <transition name="model-fade">
      <div class="ev-model" v-show="model.state">
        <div class="ev-mask"></div>
        <div class="ev-model-box">
          <div class="ev-model-title" v-text="model.title || '提示信息'"></div>
          <div class="ev-model-content">
            <div class="border">
              <v-textarea v-model="model.textarea" :placeholder="model.placeholder" :max="model.max" :height="100"
                          @on-blur="onEvent(model.textarea)"></v-textarea>
            </div>
          </div>
          <div class="ev-model-btn flexbox ev__jc">
            <div class="flex model-btn-cancel" @click="model.state = !model.state">取消</div>
            <div class="flex model-btn-ok color-primary" @click="onConfirm">确定</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import headBar from '../../components/header'
import VTextarea from '../../components/v-textarea.vue'
import * as utils from '../../utils/util'
export default {
  data () {
    return {
      model: {
        state: false
      },
      remark: null,
      detail: {},
      disabled: false,
      level: 1,
      leftBar: false,
      networkError: false,
      title: '休假审批',
      leftBtn: {
        text: '返回'
      },
      showRemark: false,
      pageLoading: false,
      fmtDate (dateString, format) {
        if (dateString) {
          return utils.fmtDate(dateString, format)
        } else {
          return null
        }
      },
      approvals: []
    }
  },
  components: {
    headBar,
    VTextarea
  },
  created () {
    this.$parent.isClose = false
    this.$parent.title = '休假审批'
  },
  computed: {
    isDone () {
      return encodeURIComponent(this.$route.query.state)
    },
    mobile () {
      return this.$store.state.userInfo.mobile
    }
  },
  mounted () {
    this.getDetail(this.mobile, this.$route.query.id)
  },
  methods: {
    onConfirm () {
      this.model.state = false
      let id = this.model.data
      if (id === 0 && !this.model.textarea) {
        this.$toast({
          msg: '请输入审批意见',
          time: 2000
        })
        return false
      }
      this.$toast({
        type: 'loading',
        msg: '提交中...',
        time: 7000
      })
      if (this.$store.state.axios) {
        return false
      }
      this.$axios.post(this.$appConfig.api.approveAction, {
        mobile: this.mobile,
        level: this.level,
        id: this.$route.query.id,
        agree: id,
        remark: this.model.textarea
      })
      .then((res) => {
        if (res.status === 'fail') {
          this.$toast(res.errorMessage)
        } else {
          this.$toast('审核成功')
        }
        setTimeout(() => {
          this.disabled = false
          this.$router.push({
            name: 'leaveApprove',
            query: {
              state: this.isDone
            },
            params: {
              freshen: true
            }
          })
        }, 100)
      })
    },
    onEvent (event) {
      this.model.textarea = event
    },
    itemSort (item) {
      if (item) {
        return item.reverse()
      } else {
        return null
      }
    },
    stateFilter (id) {
      let result = null
      switch (id) {
        case '1':
          result = '待审批'
          break
        case '2':
          result = '同意'
          break
        case '3':
          result = '不同意'
          break
        case '5':
          result = '系统退回'
          break
      }
      return result
    },
    action (id) {
      this.model = {
        state: true,
        title: '输入审批意见',
        textarea: '',
        placeholder: (id === 0 ? '请输入审批意见' : '可不填'),
        max: 300,
        data: id
      }
    },
    getDetail (tel, id) {
      this.$axios.get(this.$appConfig.api.getLeaveRecord, {
        params: {
          'mobile': tel,
          'id': id
        }
      })
      .then(res => {
        if (res.status === 'fail') {
          this.networkError = true
          this.$toast(res.errorMessage)
        } else {
          this.pageLoading = true
          this.title = res.applyType === 2 ? '撤假审批' : '休假审批'
          let detail = []
          let dateArr = []
          res.approvals.forEach(item => {
            var obj = {
              shiftData: []
            }
            if (item.relatedShift) {
              item.shift += '+' + item.relatedShift.shift
              item.beginTime = item.beginTime || item.relatedShift.beginTime
              item.endTime = item.relatedShift.endTime || item.endTime
            }
            if (dateArr.indexOf(item.onDutyDay) < 0) {
              dateArr.push(item.onDutyDay)
              obj.onDutyDay = item.onDutyDay.replace(/-/g, '/')
              obj.shiftData = res.approvals.filter((i) => {
                return item.onDutyDay === i.onDutyDay
              })
              detail.push(obj)
            }
          })
          this.detail = res
          this.approvals = detail
          this.detail.process = this.itemSort(this.detail.process)
          this.level = res.process.length
        }
      })
    },
    back () {
      this.$router.push({
        path: 'approve',
        query: {
          state: this.isDone
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .list.list-corner {
    background-color: #f1f1f1
  }

  textarea {
    width: 100%;
    height: rem(60px);
    border: none;
    padding: 15px;
    font-family: inherit;
    color: #999;
    &:focus {
      outline: 0;
    }
  }
</style>
<style lang="scss">
  @import "../../assets/scss/Common/_variables.scss";

  .bfc {
    overflow: hidden;
  }
  .progress {
    padding: 20px;
  }

  .progress-name {
    color: #666;
  }

  .progress-content {
    padding: 10px 0 10px 20px;
    position: relative;
    color: $themes-color;
    &:before {
      position: absolute;
      content: '';
      width: 1px;
      height: 100%;
      left: 0;
      top: 0;
      background-color: #ddd;
    }
    &:after {
      position: absolute;
      content: '';
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background-color: currentColor;
      border: 4px solid rgba(255, 255, 255, .7);
      left: -8px;
      top: 10px;
    }
  }

  .page-loading {
    text-align: center;
    padding-top: 20px;
  }
  @keyframes oval {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(359deg)
    }
  }
  .box-white {
    background-color: white;
    padding: rem($inner-width) rem($inner-width);
    margin: rem(20px) 0;
  }
  .fw-n {
    font-weight: normal;
  }
</style>
