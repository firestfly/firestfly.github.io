<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content" v-scroll-record>
      <ul class="list list-full mt0">
        <router-link tag="li" v-for="(item, index) in list" :key="index"
                     class="list-item list-item-touch-active list-angle-right"
                     :to="{name: 'leaveRecord',
                     query: {id: item.id}, params: {holidayTypeCode: holidayTypeCode, approveTypeCode: approveTypeCode}}">
          <span class="list-item-badge" v-if="item.applyType === 2"></span>
          <div class="list-item-inner ">
            <div class="flex">
              <div class="f16" v-for="(vacationType, index) in removeRepetition(item.appHolidayDateTimeDTOs)"
                   :key="index">
                {{ vacationType | filterLeaveType }}
              </div>
              <p class="gray mt5 f14">{{ fmtDate(item.beginDate, 'yyyy/MM/dd') }}-{{ fmtDate(item.endDate, 'yyyy/MM/dd')
            }}</p>
            </div>
            <div style="padding-right: 30px">
              <span :class="{'red': item.state == '3' || item.state == '6'}">{{ switchState(item.state) }}</span>
            </div>
          </div>
        </router-link>
      </ul>
      <v-loading :complete="complete" :loading="loading" @seeing="seeing"></v-loading>
    </div>
    <transition name="fade-in">
      <div class="model-mask" v-show="showCheckBox">
        <div class="model-mask-close" @click="showCheckBox = !showCheckBox"></div>
        <div class="page-checkbox">
          <div class="page-checkbox--content">
            <div class="mt5 p10">
              <h3 class="gray fw-normal">申请状态</h3>
              <div class="">
                <ul class="page-checkbox--state clearfix">
                  <li v-for="(ap, index) in approve" :key="index">
                    <input type="checkbox" :value="ap.id" name="approveType" :id="'approve_' + index"
                           v-model="approveTypeCode">
                    <label :for="'approve_' + index">{{ ap.name }}</label>
                  </li>
                </ul>
              </div>
            </div>
            <div class="px-t p10">
              <h3 class="gray fw-normal">休假类型</h3>
              <div>
                <ul class="page-checkbox--state clearfix">
                  <li v-for="(item, index) in leaveType" :key="index">
                    <input type="checkbox" :value="item.id" name="leavetType" :id="'type_' + index"
                           v-model="holidayTypeCode">
                    <label :for="'type_' + index">{{ item.name }}</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="page-checkbox--bar flexbox tc">
            <div class="flex" @click="reset">
              重置
            </div>
            <div class="flex" @click="seachDone()">
              完成
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import * as utils from '../../utils/util'
  import vLoading from '../../components/v-loading.vue'
  import pullList from '../../mixins/pull-list'
  const approve = [
    {name: '审批中', id: 1},
    {name: '审批通过', id: 2},
    {name: '审批不通过', id: 3},
    {name: '已撤回', id: 4},
    {name: '系统退回', id: 5},
    {name: '已撤销', id: 6}
  ]
  export default {
    mixins: [pullList],
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: '筛选',
            class: 'icon-filter'
          },
          title: '我的休假'
        },
        approve: approve,
        listData: [],
        leaveType: utils.leaveType(),
        queryData: {},
        showMore: false,
        showCheckBox: false,
        holidayTypeCode: [],
        approveTypeCode: [],
        fmtDate (dateString, format) {
          return utils.fmtDate(dateString, format)
        },
        switchState (state) {
          let stateName = ''
          switch (state) {
            case 1: stateName = '审批中'
              break
            case 2: stateName = '审批通过'
              break
            case 3: stateName = '审批不通过'
              break
            case 4: stateName = '已撤回'
              break
            case 5: stateName = '系统退回'
              break
            case 6: stateName = '已撤销'
              break
            default:
              break
          }
          return stateName
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
    },
    components: {
      HeaderBar,
      vLoading
    },
    created () {
      this.userInfo = this.$store.state.userInfo
      this.pageCount = 10
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          path: '/leave/'
        })
      },
      rightBtnClick () {
        // this.showCheckBox()
        this.showCheckBox = !this.showCheckBox
      },
      _pullList () {
        let params = {
          'mobile': this.$store.state.userInfo.mobile,
          'start': this.list.length,
          'length': 10,
          'holidayTypeCode': this.holidayTypeCode.join(),
          'approveTypeCode': this.approveTypeCode.join()
        }
        return {
          url: this.$appConfig.api.getLeaveList,
          data: { params }
        }
      },
      reset () {
        this.holidayTypeCode = []
        this.approveTypeCode = []
      },
      seachDone () {
        this.showCheckBox = false
        this.list = []
        this.$router.replace({
          path: '/_empty'
        })
        // 重刷当前页面
        this.$router.push({
          name: 'leaveList',
          params: {
            freshen: true
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';
  .list-item-badge {
    position: absolute;
    width: 40px;
    height: 40px;
    top: -1px;
    left: -1px;
    background: url(../../assets/images/icon-revoke.png) no-repeat left top;
    background-size: cover;
  }
</style>
