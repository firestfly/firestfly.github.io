<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start white-bg">
          <div class="fast-option">
            <h4>请选择筛选方式</h4>
            <div class="date-btns">
               <button class="btn btn-date" :class="selectedDuration === 'today' ? 'active': ''" @click="selectDuration('today')">本日</button>
               <button class="btn btn-date" :class="selectedDuration === 'week' ? 'active': ''" @click="selectDuration('week')">近1周</button>
               <button class="btn btn-date" :class="selectedDuration === 'month' ? 'active': ''" @click="selectDuration('month')">近1月</button>
               <button class="btn btn-date" :class="selectedDuration === 'quarter' ? 'active': ''" @click="selectDuration('quarter')">近3月</button>
               <button class="btn btn-date" :class="selectedDuration === 'halfYear' ? 'active': ''" @click="selectDuration('halfYear')">近6月</button>
            </div>
          </div>
          <div class="option-box">
            <h4>开始时间</h4>
            <span>
              <datetime class="picker-btn" :class="selectedDuration ? 'disabled' : ''"
                        :placeholder="defaultData.startDate" v-model="startDate" :title="''"
                        format="YYYY-MM-DD" @on-change="" year-row="{value}"
                        month-row="{value}" day-row="{value}" confirm-text="完成" cancel-text="取消"></datetime>
            </span>
          </div>
          <div class="option-box">
            <h4>截止时间</h4>
            <span>
              <datetime class="picker-btn" :class="selectedDuration ? 'disabled' : ''"
                        :placeholder="defaultData.endDate" v-model="endDate" :title="''"
                        format="YYYY-MM-DD" @on-change="" year-row="{value}"
                        month-row="{value}" day-row="{value}" confirm-text="完成" cancel-text="取消"></datetime>
            </span>
          </div>
        </div>
        <button class="btn btn-submit" @click="onSubmit">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import { Datetime } from 'vux'
  import * as utils from '../../utils/util'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          title: '筛选明细'
        },
        startDate: null,
        endDate: null,
        searchData: {},
        defaultData: {},
        selectedDuration: '',
        pageLoading: false,
        networkError: false
      }
    },
    components: {
      HeaderBar,
      Datetime
    },
    created () {
      this.clearState = false
      this.activeSelect = ['today', 'week', 'month', 'quarter', 'falfYear']
      // 检索条件
      this.createDefaultData()
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          path: '/leave/balance'
        })
      },
      onSubmit () {
        if (!this.startDate) {
          this.startDate = utils.getDate()
        }
        if (!this.endDate) {
          this.endDate = utils.getDate()
        }
        if (this.startDate && this.endDate) {
          let start = new Date(this.startDate).getTime()
          let end = new Date(this.endDate).getTime()
          let duration = end - start
          if (duration < 0) {
            this.$toast('截止时间不能小于开始时间')
            return
          }
        }
        this.$router.push({
          name: 'leaveBalance',
          params: {
            startDate: this.startDate,
            endDate: this.endDate
          }
        })
      },
      selectDuration (duration) {
        if (this.selectedDuration === duration) {
          this.selectedDuration = ''
        } else {
          this.selectedDuration = duration
          if (duration === 'today') {
            this.startDate = utils.getDate()
            this.endDate = utils.getDate()
          }
          if (duration === 'week') {
            this.startDate = utils.getDate(-6)
            this.endDate = utils.getDate()
          }
          if (duration === 'month') {
            this.startDate = utils.getDate(-30)
            this.endDate = utils.getDate()
          }
          if (duration === 'quarter') {
            this.startDate = utils.getDate(-90)
            this.endDate = utils.getDate()
          }
          if (duration === 'halfYear') {
            this.startDate = utils.getDate(-180)
            this.endDate = utils.getDate()
          }
        }
      },
      createDefaultData () {
        this.defaultData.startDate = utils.getDate()
        this.defaultData.endDate = utils.getDate()
      },
      fmtDate (dateString, format) {
        if (dateString) {
          return utils.fmtDate(dateString, format)
        } else {
          return null
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';
  $padding: rem($inner-width);
  h3, h4 {
    padding: 0;
    margin: 0;
  }
  .white-bg {
    background: #fff;
  }
  .tips {
    color: $themes-text-color;
    line-height: 3;
    padding-left: $padding;
  }
  .fast-option {
    h4 {
      font-weight: normal;
      font-size: 16px;
      line-height: 3;
      padding-left: $padding;
      border-bottom: 1px solid $border-color;
    }
    .date-btns {
      display: flex;
      justify-content: center;
      align-item: center;
      padding: $padding;
    }
    .btn-date {
      color: #fff;
      display: inline-block;
      margin: 0 .5em;
      background: $theme-primary;
      border: 1px solid $theme-primary;
    }
    .btn-date.active {
      color: $theme-primary;
      background: #fff;
    }
  }
  .option-box {
    position: relative;
    background: white;
    border-top: $border-color 1px solid;
    padding: .2rem $padding;
    line-height: 3;
    overflow: hidden;
    h4 {
      float: left;
      font-weight: normal;
      font-size: 16px;
    }
    > span {
      float: right;
      color: $theme-gray;
      height: 100%;
      font-size: 16px;
    }
    .weui-cell {
      padding: 0;
    }
  }
  .disabled {
    pointer-events: none;
  }
  .btn-submit {
    width: 90%;
    background: $theme-primary;
    margin: .5rem auto;
  }
</style>
