<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content" v-scroll-record>
      <ul class="tabbar-radius">
        <router-link tag="li" :to="{path: 'approval', query: {state: 0}}" class="tabbar-item"
                     :class="{'active': state == 0}">待审批
        </router-link>
        <router-link tag="li" :to="{path: 'approval', query: {state: 1}}" class="tabbar-item"
                     :class="{'active': state == 1}">
          审批通过
        </router-link>
        <router-link tag="li" :to="{path: 'approval', query: {state: 2}}" class="tabbar-item"
                     :class="{'active': state == 2}">
          审批不通过
        </router-link>
      </ul>
      <router-link tag="ul" v-for="(item, index) in list" class="list"
                   :to="{ name: 'dispatchApprovalDetail', query: {id: item.id, state: state }}">
        <li class="list-item list-angle-right">
          <div class="list-item-inner flexbox">
            <div class="">
              <h3 class="styled f16">{{ changeType(item.dispatchType) }}</h3>
              <span class="gray f12">{{ item.datetime }}</span>
            </div>
          </div>
        </li>
        <li class="list-item-desc">
          <div class="list-item-inner">
            <div class="text-overflow f16">
              <span v-for="(sub, innerIndex) in item.employees">{{sub.name}}({{sub.workJob}}) <em
                v-if="innerIndex !== '0'">{{ '&nbsp;&nbsp;' }}</em></span>
            </div>
          </div>
        </li>
      </router-link>
      <v-loading :complete="complete" :loading="loading" @seeing="seeing"></v-loading>
    </div>
  </div>
</template>
<script>
import HeaderBar from '../../components/header.vue'
import vLoading from '../../components/v-loading.vue'
import pullList from '../../mixins/pull-list'
export default {
  mixins: [pullList],
  data () {
    return {
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: ''
        },
        title: '审批'
      }
    }
  },
  computed: {
    state () {
      return this.$route.query.state
    }
  },
  components: {
    HeaderBar,
    vLoading
  },
  created () {
    this.$store.dispatch('DISPATCH_OVERTIME', null)
  },
  methods: {
    _pullList () {
      let params = {
        employeeId: this.$store.state.userInfo.id,
        state: this.state || 0,
        start: this.list.length,
        length: 10
      }
      return {
        url: this.$appConfig.api.dispatchApprovalList,
        data: { params }
      }
    },
    enterDetail (id) {
      this.$router.push({
        path: 'approval-detail',
        query: {
          state: this.state,
          id: id
        }
      })
    },
    changeType (type) {
      let result = null
      switch (type) {
        case 'TEMPORARY_WORK_OVERTIME':
          result = '安排加班'
          break
        case 'BUSINESS_TRIP':
          result = '安排出差'
          break
      }
      return result
    },
    leftBtnClick () {
      this.$router.push({
        path: '/dispatch'
      })
    }
  }
}
</script>
<style lang="scss">
  @import '../../assets/scss/Common/_variables.scss';

  .mt0 {
    margin-top: 0 !important;
  }

  .inner-right {
    padding-right: rem(30px) !important;
  }

  .styled {
    margin: 0;
    font-weight: 500;
  }

  .list-item-desc {
    padding: 0 rem(30px);
  }
</style>
