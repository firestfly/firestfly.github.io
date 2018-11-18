<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <div class="page-loading" v-if="!pageLoading">
        <span class="m-loading" v-if="!networkError">
        </span>
        <div class="network--error" v-if="networkError">
          <i class="icon-warn"></i>数据请求异常，请重试！
        </div>
      </div>
      <div v-if="pageLoading">
        <ul class="list mt0">
          <li class="list-item">
            <div class="list-item-inner">
              <div class="list-item-left half f16">项目</div>
              <div class="list-item-right gray">
                <div v-for="item in detail.department" class="text-overflow align-item" style="width: auto">
                  {{item.name}}
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="detail.dispatchType == 'TEMPORARY_WORK_OVERTIME'">
          <ul class="list mt0">
            <li class="list-item">
              <div class="list-item-inner">
                <div class="list-item-left normal-length f16">本月与上月临时加班时间比</div>
                <div class="list-item-right gray"><span
                  :class="{'red': detail.monthOvertimes > detail.lastMonthOvertimes}">{{detail.monthOvertimes || 0}}</span>/{{detail.lastMonthOvertimes
                  || 0}}
                </div>
              </div>
            </li>
          </ul>
          <ul class="list">
            <li class="list-item">
              <div class="list-item-inner">
                <div class="list-item-left f16">加班类型</div>
                <div class="list-item-right gray">{{ overtimeTypeChange(detail.overtimeType) }}</div>
              </div>
            </li>
            <li class="list-item">
              <div class="list-item-inner">
                <div class="list-item-left half f16">岗位要求</div>
                <div class="list-item-right gray">
                  <p v-for="post in detail.postRequire" class="text-overflow align-item">{{post.name}}</p>
                </div>
              </div>
            </li>
          </ul>
          <ul class="list">
            <li class="list-item">
              <div class="list-item-inner f16">
                加班事由
              </div>
            </li>
            <li class="list-item">
              <div class="list-item-inner gray">
                <div class="list-item-body">
                  {{detail.overtimeReason}}
                </div>
              </div>
            </li>
          </ul>
          <ul class="list mt0">
            <li class="list-item">
              <div class="list-item-inner">
                <div class="list-item-body f16">
                  人员与时间
                </div>
              </div>
            </li>
            <li class="list-item"
                v-for="(item, index) in detail.employees">
              <swipe-delete @delete-item="deleteItem(index)" :dontdel="isDels(state)">
                <div slot="content" @click="showEmployeeDetail(index)" class="list-item-swipe-left px-b">
                  <div class="list-item-media">
                    <span class="employee-author" :style="face(item.employee.avatar)"></span>
                  </div>
                  <div class="list-item-swipe">
                    <div class="list-item-body pl10">
                      <div class="f16"><span>{{ item.employee.name }}</span><span class="gray">（{{ item.employee.workJob }}）</span>
                      </div>
                      <div>
                        <span class="gray f12">{{ fmtDate(item.beginDate, 'M月d号 hh:mm') }}-{{ fmtDate(item.endDate, 'M月d号 hh:mm')  }} </span>
                        <span class="color-primary f12">{{ totalHours(item) }}分钟</span>
                      </div>
                    </div>
                  </div>
                </div>
              </swipe-delete>
            </li>
            <router-link tag="li" class="list-item"
                         :to="{name: 'dispatchEmployee', query: {redirect: redirect,index: 'new'}}" v-if="state == 0">
              <div class="list-item-inner">
                <div class="list-item-body tc gray f16">
                  <span class="icon-plus-img"></span>添加人员与时间
                </div>
              </div>
            </router-link>
          </ul>
        </div>
        <div v-else-if="detail.dispatchType == 'BUSINESS_TRIP'">
          <ul class="list">
            <li class="list-item" v-for="(address, index) in detail.businessAddress">
              <div class="list-item-inner">
                <div class="list-item-left f16">出差地点{{index + 1}}</div>
                <div class="list-item-right gray">
                  <p>{{address.text}}</p>
                </div>
              </div>
            </li>
          </ul>
          <ul class="list">
            <li class="list-item">
              <div class="list-item-inner f16">
                出差事由
              </div>
            </li>
            <li class="list-item">
              <div class="list-item-inner gray">
                <div class="list-item-body">
                  {{detail.businessReason}}
                </div>

              </div>
            </li>
          </ul>
          <ul class="list mt0">
            <li class="list-item">
              <div class="list-item-inner">
                <div class="list-item-body f16">
                  人员与时间
                </div>
              </div>
            </li>
            <li class="list-item"
                v-for="(item, index) in detail.employees">
              <swipe-delete @delete-item="deleteItem(index)" :dontdel="isDels(state)">
                <div slot="content" @click="showEmployeeDetail(index)" class="list-item-swipe-left px-b">
                  <div class="list-item-media">
                    <span class="employee-author" :style="face(item.employee.avatar)"></span>
                  </div>
                  <div class="list-item-swipe">
                    <div class="list-item-body pl10">
                      <div class="f16"><span>{{ item.employee.name }}</span><span class="gray">（{{ item.employee.workJob }}）</span>
                      </div>
                      <div>
                        <span class="gray f12">{{ fmtDate(item.beginDate, 'M月d号') }}&nbsp;{{ hourMin(item.beginDateTime) }}-{{ fmtDate(item.endDate, 'M月d号')  }}&nbsp;{{ hourMin(item.endDateTime)  }} </span>
                      </div>
                    </div>
                  </div>
                </div>
              </swipe-delete>
            </li>
            <router-link tag="li" class="list-item"
                         :to="{name: 'employee-time', query: {redirect: redirect,index: 'new'}}" v-if="state == 0">
              <div class="list-item-inner">
                <div class="list-item-body tc gray f16">
                  <span class="icon-plus-img"></span>添加人员与时间
                </div>
              </div>
            </router-link>
          </ul>
        </div>
        <!-- <div class="list-inner gray f12"><span class="color-primary">*</span>左滑可以删除</div> -->
        <div class="employee-group px-tb">
          <div class="employee-title px-b">审批人</div>
          <ul class="employee-list step-arrow">
            <li class="" v-for="(person, index) in detail.approvalPerson">
              <div class="gray text-overflow">{{person.workJob || '&nbsp;'}}</div>
              <span class="employee-author" :style="face(person.avatar)"></span>{{person.name}}
            </li>
          </ul>
        </div>
        <!-- <div class="list-inner gray f12"><span class="color-primary">*</span>点一下头像可以调整顺序和删除</div> -->
        <div class="employee-group px-tb">
          <div class="employee-title px-b">抄送</div>
          <ul class="employee-list">
            <li class="" v-for="(person, index) in detail.ccMan">
              <div class="gray text-overflow">{{person.workJob || '&nbsp;'}}</div>
              <span class="employee-author" :style="face(person.avatar)"></span>{{person.name}}
            </li>
          </ul>
        </div>
        <div class="approval-history bg-white px-tb mt10">
          <h3 class="approval-history-title px-b">
            审批记录
          </h3>
          <div class="approval-history-step px-l" v-for="step in detail.approvalPerson" v-if="step.remark">
            <div class="employee-author history-step-avatar" :style="face(step.avatar)"></div>
            <div class="history-step-bfc px-b">
              <div class="history-step-name">{{step.name}}</div>
              <p class="history-step-time f12">{{step.datetime}}</p>
              <div class="history-step-sup"><strong>审批意见：</strong>{{step.remark}}</div>
              <div class="history-step-sup"><strong>修改内容：</strong></div>
              <div class="history-step-content" v-html="step.modifyNotes"></div>
            </div>
          </div>
        </div>
        <div class="flexbox bottom-btn" v-if="state == 0">
          <div class="flex">
            <button class="ev-btn ev-btn--warn ev-btn-small" @click="openModel(0)">
              退回
            </button>
          </div>
          <div class="flex">
            <button class="ev-btn ev-btn--primary ev-btn-small" @click="openModel(1)">
              同意
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- <model :model-data="model" @on-cancel="model.state = false" @on-confirm="onConfirm()"></model> -->
    <transition name="model-fade">
      <div class="ev-model" v-show="model.state">
        <div class="ev-mask"></div>
        <div class="ev-model-box">
          <div class="ev-model-title" v-text="model.title || '提示信息'"></div>
          <div class="ev-model-content">
            <div class="border">
              <v-textarea v-model="model.textarea" placeholder="请输入审批意见" :max="model.max" :height="100"
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
import { mapGetters } from 'vuex'
import HeaderBar from '../../components/header.vue'
import VTextarea from '../../components/v-textarea.vue'
import Spinner from '../../components/Spinner.vue'
import * as util from '../../utils/util'
import swipeDelete from '../../components/swipeDelete.vue'
export default {
  data () {
    return {
      model: {
        state: false
      },
      pageLoading: false,
      networkError: false,
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: ''
        },
        title: '审批'
      },
      agree: null,
      fmtDate (dateString, format) {
        return util.fmtDate(dateString.replace(/-/g, '/'), format)
      }
    }
  },
  computed: {
    ...mapGetters({
      detail: 'getDispatchDetailCache'
    }),
    employeeId () {
      return this.$store.state.userInfo.id
    },
    redirect () {
      return encodeURIComponent(this.$route.fullPath)
    },
    state () {
      return encodeURIComponent(this.$route.query.state)
    }
  },
  created () {
    if (!util.isEmpty(this.detail)) {
      this.pageLoading = true
      return false
    }
    let params = {
      employeeId: this.employeeId,
      id: this.$route.query.id
    }
    this.$axios.get(this.$appConfig.api.dispatchApprovalDetail, {params: params})
    .then(res => {
      if (res.status === 'fail') {
        this.$toast('请求出错！')
        this.networkError = true
      } else {
        this.detail = res
        res.jobRequirements = res.postRequire
        this.rebuildEmployee(res)
        this.$store.dispatch('DISPATCH_OVERTIME', res)
        this.pageLoading = true
      }
    })
  },
  components: {
    HeaderBar,
    VTextarea,
    Spinner,
    swipeDelete
  },
  methods: {
    isDels (id) {
      if (id === '0') {
        return false
      } else {
        return true
      }
    },
    hourMin (item) {
      if (item) {
        return item.substr(0, 5)
      } else {
        return null
      }
    },
    rebuildEmployee (items, merge) {
      items.employees.map(item => {
        item.employee = {
          employeeId: item.employeeId,
          name: item.name,
          avatar: item.avatar,
          workJob: item.workJob
        }
        item.department = {
          id: item.departmentId,
          name: item.departmentName
        }
        if (items.dispatchType === 'BUSINESS_TRIP') {
          item.daytime = []
          item.daytime.push(item.beginDateTime.substr(0, 2))
          item.daytime.push(':')
          item.daytime.push(item.beginDateTime.substr(3, 2))
          item.daytime.push('~')
          item.daytime.push(item.endDateTime.substr(0, 2))
          item.daytime.push(':')
          item.daytime.push(item.endDateTime.substr(3, 2))
          item.beginDate = item.beginDate.substr(0, 10)
          item.endDate = item.endDate.substr(0, 10)
        } else {
          item.beginDate = item.beginDate.substr(0, 16)
          item.endDate = item.endDate.substr(0, 16)
        }
      })
    },
    showEmployeeDetail (index) {
      if (this.state === '0') {
        let path = this.detail.dispatchType === 'BUSINESS_TRIP' ? 'employee-time' : 'employee'
        this.$router.push({
          path: path,
          query: {
            redirect: this.redirect,
            index: index
          }
        })
      }
    },
    deleteItem (index) {
      this.$store.dispatch('DISPATCH_OVERTIME_DELETE_EMPLOYEE', index)
    },
    totalHours (item) {
      if (item.beginDate && item.endDate) {
        return (new Date(item.endDate.replace(/-/g, '/')) - new Date(item.beginDate.replace(/-/g, '/'))) / 1000 / 60
      } else {
        return ''
      }
    },
    overtimeTypeChange (item) {
      let result = null
      for (let type of util.temporaryType()) {
        if (type.code === item) {
          result = type.name
          break
        }
      }
      return result
    },
    face (url) {
      if (url) {
        return 'background-image: url(' + url + ')'
      } else {
        return null
      }
    },
    leftBtnClick () {
      this.$router.push({
        path: 'approval',
        query: {
          state: this.$route.query.state || 0
        }
      })
    },
    openModel (id) {
      switch (id) {
        case 0:
          this.model = {
            state: true,
            title: '确认退回此次审批？',
            textarea: '',
            max: 300
          }
          break
        case 1:
          this.model = {
            state: true,
            title: '同意审批',
            textarea: '',
            max: 300
          }
          break
      }
      this.agree = id
    },
    modEmployee (item) {
      let itemCopy = JSON.parse(JSON.stringify(item))
      itemCopy.map(e => {
        if (this.detail.dispatchType === 'BUSINESS_TRIP') {
          e.beginDate = e.beginDate.length === 10 ? e.beginDate + ' 00:00:00' : e.beginDate
          e.endDate = e.endDate.length === 10 ? e.endDate + ' 00:00:00' : e.endDate
        } else {
          e.beginDate = e.beginDate + ':00'
          e.endDate = e.endDate + ':00'
        }
      })
      return itemCopy
    },
    action (txt) {
      let params = {
        id: this.$route.query.id,
        employeeId: this.employeeId,
        agree: this.agree,
        level: this.detail.level,
        remark: txt,
        dispatchType: this.detail.dispatchType,
        employees: this.modEmployee(this.detail.employees)
      }
      if (util.isEmpty(params.employees)) {
        this.$toast('人员信息不能为空！')
        this.model.state = false
        return false
      }
      this.$toast({
        msg: '提交中...',
        type: 'loading',
        time: 10000
      })
      this.$axios.post(this.$appConfig.api.dispatchApprovalAction, params)
        .then(res => {
          this.model.state = false
          if (res.status === 'success') {
            this.$toast({
              msg: '提交成功',
              type: 'succes'
            })
            setTimeout(() => {
              this.$router.push({
                name: 'dispatchApproval',
                query: {
                  state: 0
                },
                params: {
                  freshen: true
                }
              })
            }, 200)
          } else if (res.errorMessage) {
            this.$toast(res.errorMessage)
          } else if (res.exceptionType) {
            this.$toast('提交失败，请重试！')
          }
        })
    },
    onConfirm () {
      if (!this.model.textarea) {
        this.$toast('请填写审批意见')
        return false
      }
      this.action(this.model.textarea)
    },
    onEvent (event) {
      this.model.textarea = event
    }
  }
}

</script>
<style lang="scss">
  @import '../../assets/scss/Common/_variables.scss';
  .approval-history {
    padding-left: rem(30px);
  }

  .approval-history-title {
    margin: 0;
    line-height: rem(100px);
    font-size: 16px;
    font-weight: normal;
  }

  .bottom-btn {
    margin: rem(40px) rem(30px);
    .flex {
      padding: 0 rem(20px);
    }
  }

  .approval-history-step {
    position: relative;
    margin-left: 15px;
    .history-step-bfc {
      margin-left: 30px;
      padding: 5px 0;
    }
    .history-step-avatar {
      position: absolute;
      left: rem(-42px);
      top: 10px;
    }
    .history-step-name {
      color: #222226;
      font-weight: 500;
    }
    .history-step-time {
      color: #999;
      margin: 5px 0;
    }
    .history-step-sup {
      strong {
        color: #222226;
        font-weight: 500;
      }
      color: #999;
    }
    .history-step-content {
      color: #999;
    }
  }

  .list-item-swipe-left {
    display: flex;
    padding: 5px 0 5px 5px;
  }
  .list-item-swipe {
    display: flex;
  }
</style>
