<template>
  <div>
    <head-bar :title="title" :leftBtn="leftBtn" @leftBtnClick="back()"></head-bar>
    <div class="content" v-scroll-record>
      <ul class="tabbar-radius" v-if="!isVacationStatus">
        <router-link tag="li" :to="{path: 'approve', query: {state: 0}}" class="tabbar-item"
                     :class="{'active': state == 0}">待审批
        </router-link>
        <router-link tag="li" :to="{path: 'approve', query: {state: 1}}" class="tabbar-item"
                     :class="{'active': state == 1}">已审批
        </router-link>
      </ul>
      <router-link tag="ul" class="list" v-for="(item, index) in list" :key="index"
                   :to="{name: (isVacationStatus?'leaveRecord' : 'leaveDetail'), query: {id: item.id,state: state}, params: {isVacationStatus: 1}}">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner">
            <div>
              <div class="f16 fb">{{item.name}}的{{item.applyType == 2 ? '撤假' : '休假'}}申请</div>
              <p class="gray mt5">申请{{item.applyType == 2 ? '撤假' : '休假'}}时长 <span class="color-primary">{{item.durationStr}}</span>
              </p>
            </div>
          </div>
        </li>
        <li class="list-item">
          <div class="list-item-inner list-item-inner-small">
            <div class="list-item-left">
              提交时间
            </div>
            <div class="list-item-right gray">
              <p class="gray">{{item.datetime}}</p>
            </div>
          </div>
        </li>
      </router-link>
      <v-loading :complete="complete" :loading="loading" @seeing="seeing"></v-loading>
    </div>
  </div>
</template>

<script>
import headBar from '../../components/header'
import vLoading from '../../components/v-loading.vue'
import pullList from '../../mixins/pull-list'
export default {
  mixins: [pullList],
  data () {
    return {
      leftBar: false,
      title: this.$route.params.title || '审批',
      leftBtn: {
        text: '返回',
        url: '/leave/'
      }
    }
  },
  computed: {
    networkError () {
      return this.$store.state.network
    },
    state () {
      return this.$route.query.state
    }
  },
  components: {
    headBar,
    vLoading
  },
  created () {
    this.isVacationStatus = this.$route.params.isVacationStatus
  },
  methods: {
    _pullList () {
      let params = {
        mobile: this.$store.state.userInfo.mobile,
        state: this.state || 0,
        start: this.list.length,
        length: 10
      }
      return {
        url: this.isVacationStatus ? this.$appConfig.api.vacationStatusApproveList : this.$appConfig.api.approveList,
        data: { params }
      }
    },
    back () {
      this.$router.push({
        path: '/leave/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page__cell__radius {
    padding: 20px;
  }
</style>
