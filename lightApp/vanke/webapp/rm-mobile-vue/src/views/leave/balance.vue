<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！main
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
       <div class="page-loading" v-if="!pageLoading">
            <span class="m-loading">
            </span>
       </div>
        <div class="center" style="padding-top: 20px" v-if="pageLoading && listData.length == 0">
          暂无休假额度记录
       </div>
        <div class="flex-start" v-if="pageLoading">
          <p class="tips" v-if="listData.length !== 0">点击休假额度可申请休假</p>
          <ul class="list list-full mt0">
            <li v-for="(item, index) in listData" :key="index" class="list-item list-item-touch-active list-angle-right"
                @click="applyLeave(item)">
              <div class="list-item-inner ">
              <div class="flex">
                <h3 class="f16 fb">
                  <span>{{ item.holidayType || '' }}</span>
                </h3>
                <p class="gray mt5" v-if="item.effectiveDate">{{ item.effectiveDate | date('yyyy-MM-dd') }} 至 {{
                  item.expiryDate | date('yyyy-MM-dd') }}</p>
              </div>
                <div style="padding-right: 30px"><span>{{ item.leftQuota }}</span>/{{ item.quota }}{{item.quotaType}}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import * as util from '../../utils/util.js'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: '筛选',
            class: 'theme-color'
          },
          title: '额度查询'
        },
        networkError: false,
        listData: [],
        pageLoading: false
      }
    },
    components: {
      HeaderBar
    },
    created () {
      this.userInfo = this.$store.state.userInfo
      this.getDefaultDate()
      this.query = {
        'employeeId': this.$store.state.userInfo.id,
        'startDate': this.$route.params.startDate || this.startDate,
        'endDate': this.$route.params.endDate || this.endDate
      }
      this.onRequest(this.query)
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          path: '/leave'
        })
      },
      rightBtnClick () {
        this.$router.push({
          name: 'leaveBalanceOption'
        })
      },
      onRequest (params) {
        setTimeout(() => {
          this.$axios.get(this.$appConfig.api.getLeaveQuotaList, {
            params: params
          })
          .then((res) => {
            this.listData = res.data
            this.pageLoading = true
          })
        }, 200)
      },
      applyLeave (item) {
        if (item.leftQuota <= 0) {
          this.$toast(this.switchMessage(item))
          return
        }
        if (this.isOneOffLeave(item.holidayTypeId)) {
          this.$router.push({
            name: 'leaveOneOff',
            params: item
          })
        } else {
          this.$router.push({
            name: 'leaveAction'
          })
        }
      },
      switchMessage (item) {
        let msg = ''
        // switch (item.holidayTypeId) {
        //   case 'HOLIDAY_MARRIAGE':
        //     msg = '请提供结婚证。'
        //     break
        //   case 'HOLIDAY_FUNERAL':
        //     msg = '请提供与逝者的关系证明。'
        //     break
        //   case 'HOLIDAY_MATERNITY':
        //     msg = '请提供预产期证明、准生证明。并于生育后一个月内补交出生证明。'
        //     break
        //   case 'HOLIDAY_NURSING':
        //     msg = '请提供预产期证明。并于生育后一个月内补交出生证明。'
        //     break
        //   case 'HOLIDAY_CONTRACEPTION':
        //     msg = '请提供手术证明、医院建休单。'
        //     break
        //   case 'HOLIDAY_FAMILY_PLANNING':
        //     msg = '请提供出院小结和建休单'
        //     break
        //   case 'HOLIDAY_STATUTORY_SICK':
        //     msg = '请提供医院建休单。'
        //     break
        //   case 'HOLIDAY_INDUSTRIAL_INJURY':
        //     msg = '请提供医院建休单。'
        //     break
        //   case 'HOLIDAY_OTHER_PAY':
        //     msg = '如您需要申请，请联系您所在公司/部门人事设置额度。'
        //     break
        //   default:
        //     msg = '该休假额度已经用完' // item.holidayType + '额度不足，请选择其他休假类型。'
        //     break
        // }
        msg = '该休假额度已经用完'
        return msg
      },
      fmtDate (dateString, format) {
        if (dateString) {
          let newDateString = dateString.replace(/-/g, '/')
          return util.fmtDate(new Date(newDateString), format)
        } else {
          return null
        }
      },
      getDefaultDate () {
        this.startDate = ''
        this.endDate = ''
      },
      isOneOffLeave (leaveTypeId) {
        return util.isOneOffLeave(leaveTypeId)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables';
  h3, h4 {
    padding: 0;
    margin: 0;
  }
  .tips {
    color: $gray;
    line-height: 2;
    padding-left: rem($inner-width);
  }
</style>
