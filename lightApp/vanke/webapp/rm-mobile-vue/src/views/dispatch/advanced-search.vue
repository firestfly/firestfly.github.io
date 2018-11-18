<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <h3>按时间查询<span>查询技巧：尝试组合查询或空值查询</span></h3>
          <div class="search-box border-top">
            <button :class="!searchData.searchActive.startTime ? 'hide': ''" class="btn-clear" @click="clearTime('start')"></button>
            <h4>开始时间</h4>
            <span>
              <datetime :class="searchData.searchActive.startTime ? 'active picker-btn' : 'picker-btn'"
                        :placeholder="defaultData.startTime" v-model="startTime" :min-year=2017 :max-year='maxYear'
                        format="YYYY年MM月DD日" @on-change="startTimeChange" :title="''" year-row="{value}年"
                        month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
            </span>
          </div>
          <div class="search-box">
            <button :class="!searchData.searchActive.endTime ? 'hide': ''" class="btn-clear" @click="clearTime('end')"></button>
            <h4>结束时间</h4>
            <span>
              <datetime :class="searchData.searchActive.endTime ? 'active picker-btn' : 'picker-btn'"
                        :placeholder="defaultData.endTime" v-model="endTime" :min-year=2017 :max-year='maxYear'
                        :start-date=searchData.startTime
                        format="YYYY年MM月DD日" @on-change="endTimeChange" :title="''" year-row="{value}年"
                        month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
            </span>
          </div>
          <div class="search-box">
            <button :class="!searchData.searchActive.applyTime ? 'hide': ''" class="btn-clear" @click="clearTime('apply')"></button>
            <h4>申请时间</h4>
            <span>
              <datetime :class="searchData.searchActive.applyTime ? 'active picker-btn' : 'picker-btn'"
                        :placeholder="defaultData.applyTime" v-model="applyTime" :min-year=2017 :max-year='maxYear'
                        format="YYYY年MM月DD日" @on-change="applyTimeChange" :title="''" year-row="{value}年"
                        month-row="{value}月" day-row="{value}日" confirm-text="完成" cancel-text="取消"></datetime>
            </span>
          </div>
          <h3>按审批状态查询</h3>
          <div class="search-box arrow-down" @click="openStatePicker()">
            <h4>{{ searchData.stateName || '审批已通过' }}</h4>
            <span></span>
          </div>
          <h3>按姓名查询</h3>
          <router-link tag="div" :to="{name: 'nameSelect', params: searchData}">
            <div class="search-box arrow-right">
              <h4>{{ searchData.name || '请输入姓名' }}</h4>
            </div>
          </router-link>
          <h3>按类型查询</h3>
          <router-link tag="div" :to="{name: 'typeSelect', params: searchData}">
            <div class="search-box arrow-right">
              <h4>{{ searchData.typeName || '请选择类型' }}</h4>
              <span></span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <transition name="fadeUp">
      <div class="picker-model" v-if="pickerState">
        <picker :slots="slots" @change="onValuesChange" :showToolbar="true" rotate-effect :visible-item-count="3" ref="picker">
          <!-- Toolbar items -->
          <div class="picker-bar">
            <button class="fl button" @click="pickerState = !pickerState">取消</button>
            <button class="fr button" @click="pickerSelected()">确定</button>
          </div>
        </picker>
      </div>
    </transition>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import Picker from 'mint-picker'
  import { Datetime } from 'vux'
  import * as util from '../../utils/util.js'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: '确定',
            class: 'theme-color'
          },
          title: '高级查询'
        },
        searchData: {},
        pageLoading: false,
        networkError: false,
        pickerState: false,
        pickerType: null,
        pickerValue: null,
        startTime: null,
        endTime: null,
        applyTime: null,
        slots: [],
        defaultData: {
          startTime: '',
          endTime: '',
          applyTime: ''
        },
        searchActive: {
          startTime: false,
          endTime: false,
          applyTime: false
        },
        fmtDate (dateString, format) {
          if (dateString) {
            return util.fmtDate(new Date(dateString), format)
          } else {
            return null
          }
        },
        maxYear: new Date().getFullYear() + 1
      }
    },
    components: {
      HeaderBar,
      Picker,
      Datetime
    },
    created () {
      this.clearState = false
      // 检索条件
      this.searchData = {
        'startTime': this.$route.params.startTime || '',
        'endTime': this.$route.params.endTime || '',
        'applyTime': this.$route.params.applyTime || '',
        'state': this.$route.params.state,
        'stateName': this.$route.params.stateName || '请选择审批状态',
        'employeeId': this.$route.params.employeeId || 0,
        'name': this.$route.params.name || '',
        'type': this.$route.params.type || '',
        'typeName': this.$route.params.typeName || '',
        'searchActive': this.$route.params.searchActive || this.searchActive
      }
      this.createDefaultData()
    },
    methods: {
      maxYears () {
        let day = new Date()
        return day.getFullYear + 4
      },
      leftBtnClick () {
        this.$router.push({
          path: '/dispatch/search'
        })
      },
      rightBtnClick () {
        this.onSearch()
      },
      onSearch () {
        if (!this.searchData.state) {
          this.$toast('请选择审批状态')
          return
        }
        this.$router.push({
          name: 'applySearch',
          params: this.searchData
        })
      },
      openStatePicker () {
        this.pickerType = 'state'
        this.slots = [
          {
            flex: 1,
            values: ['审批已通过', '审批未通过', '审批中']
          }
        ]
        this.pickerState = true
      },
      onValuesChange (picker, values) {
        this.pickerValue = values
      },
      pickerSelected () {
        this.onStateSelected()
        this.pickerState = false
        this.pickerType = null
        this.pickerValue = null
      },
      startTimeChange (value) {
        if (this.clearState) {
          this.clearState = false
          return
        }
        console.log(this.searchData.startTime, this.searchData.endTime)
        this.searchData.searchActive.startTime = true
        this.searchData.startTime = value.slice(0, -1).replace(/[\u4e00-\u9fa5]/g, '-')
        if (this.searchData.endTime && new Date(this.searchData.startTime) > new Date(this.searchData.endTime)) {
          this.searchData.endTime = this.searchData.startTime
          this.defaultData.endTime = this.searchData.startTime
          this.endTime = value
        }
      },
      endTimeChange (value) {
        if (this.clearState) {
          this.clearState = false
          return
        }
        this.searchData.searchActive.endTime = true
        this.searchData.endTime = value.slice(0, -1).replace(/[\u4e00-\u9fa5]/g, '-')
      },
      applyTimeChange (value) {
        if (this.clearState) {
          this.clearState = false
          return
        }
        this.searchData.searchActive.applyTime = true
        this.searchData.applyTime = value.slice(0, -1).replace(/[\u4e00-\u9fa5]/g, '-')
      },
      clearTime (key) {
        this.clearState = true
        this.searchData.searchActive[key + 'Time'] = false
        this[key + 'Time'] = ''
        this.searchData[key + 'Time'] = ''
      },
      onStateSelected () {
        if (!this.pickerValue) {
          this.searchData.state = 2
          this.searchData.stateName = '审批已通过'
        } else {
          this.searchData.state = this.switchState(this.pickerValue[0])
          this.searchData.stateName = this.pickerValue[0]
        }
      },
      switchState (value) {
        let state
        switch (value) {
          case '审批中':
            state = 1
            break
          case '审批已通过':
            state = 2
            break
          case '审批未通过':
            state = 3
            break
          default:
            break
        }
        return state
      },
      getDefaultData () {
        let now = new Date()
        let defaultDate = ''
        defaultDate += now.getFullYear() + '年'
        defaultDate += (now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '月'
        defaultDate += (now.getDate() < 10 ? '0' + now.getDate() : now.getDate()) + '日'
        return defaultDate
      },
      createDefaultData () {
        this.defaultData.startTime = this.$route.params.startTime ? util.fmtDate(this.$route.params.startTime, 'yyyy年MM月dd日') : this.getDefaultData()
        this.defaultData.endTime = this.$route.params.endTime ? util.fmtDate(this.$route.params.endTime, 'yyyy年MM月dd日') : this.getDefaultData()
        this.defaultData.applyTime = this.$route.params.applyTime ? util.fmtDate(this.$route.params.applyTime, 'yyyy年MM月dd日') : this.getDefaultData()
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';
  $padding: 4%;
  h3, h4 {
    padding: 0;
    margin: 0;
  }
  .flex-start {
    h3 {
      padding: 0 $padding;
      font-size: 100%;
      line-height: 2;
      margin-top: .5em;
      color: $themes-color;
      font-weight: normal;
      span {
        float: right;
        color: $color-gray;
      }
    }
  }
  .search-box {
    position: relative;
    background: white;
    border-bottom: $border-color 1px solid;
    padding: 0 3em 0 $padding;
    line-height: 3;
    overflow: hidden;
    &.border-top {
      border-top: $border-color 1px solid;
    }
    &.arrow-right::before,
    &.arrow-down::before {
      right: $padding;
      border-top-color: #A6A6A6;
      border-right-color: #A6A6A6;
    }
    .btn-clear {
      display: inline-block;
      position: absolute;
      top: 50%;
      right: .8em;
      width: rem(40px);
      height: rem(40px);
      margin-top: -.8em;
      border-radius: 50%;
      border: 0;
      background: url(../../assets/images/icon-close.png) no-repeat center center / 100%;
      cursor: pointer;
      &.hide {
        display: none;
      }
    }
    h4 {
      float: left;
      font-weight: normal;
      font-size: 110%;
    }
    > span {
      float: right;
      color: $theme-gray;
      height: 100%;
      font-size: 110%;
      .picker-btn {
        display: inline-block;
        height: 2.2em;
        line-height: 2.2em;
        border-radius: .3em;
        border: 1px solid $border-color;
        padding: 0 .5em;
        &.weui-cell_access .weui-cell__ft {
          padding-right: 0 !important;
        }
        &.weui-cell_access .weui-cell__ft:after {
          opacity: 0;
        }
      }
      .picker-btn.active {
        color: $themes-color;
        border-color: $themes-color;
        .vux-datetime-value {
          color: inherit;
        }
      }
    }
  }
</style>
