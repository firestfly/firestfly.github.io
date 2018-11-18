<template>
  <div>
    <header-bar :title="headerBar.title" :closeWindow="headerBar.closeWindow"></header-bar>
    <div class="content">
      <ul class="list mt0" v-if="!networkError">
        <router-link tag="li" :to="{name: 'leaveAction'}" v-if="type"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            我要休假
          </div>
          </router-link>
        <router-link tag="li" :to="{name: 'leaveList',  params: {freshen: true}}" v-if="type"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            我的休假
          </div>
          </router-link>
        <router-link tag="li" :to="{name: 'leaveBalance'}" v-if="type"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            额度查询
          </div>
          </router-link>
        <router-link tag="li" :to="{name: 'leaveApprove', query:{state: 0}, params: {freshen: true}}"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            审批
          </div>
          </router-link>
          <router-link tag="li" :to="{name: 'leaveApprove', query:{state: 1}, params: {freshen: true, isVacationStatus: 1, title: '员工休假情况'}}"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            员工休假情况
          </div>
          </router-link>
      </ul>
      <ul class="list mt0" v-if="networkError">
        <li class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            我要休假
          </div>
        </li>
        <li class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            我的休假
          </div>
        </li>
        <li class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            额度查询
          </div>
        </li>
        <li class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            审批
          </div>
        </li>
      </ul>
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>网络错误，点击重新加载！
      </div>
    </div>
  </div>
</template>
<script>
import HeaderBar from '../../components/header.vue'
export default {
  data () {
    return {
      headerBar: {
        closeWindow: true,
        title: '请休假'
      },
      part2: ['合伙人', '管理中心总经理', 'HRBP'],
      type: true
    }
  },
  computed: {
    networkError () {
      return this.$store.state.network
    }
  },
  components: {
    HeaderBar
  },
  created () {
    let userInfo = this.$store.state.userInfo
    for (let i = 0, len = this.part2.length; i < len; i++) {
      if (userInfo.jobName.indexOf(this.part2[i]) >= 0 || userInfo.sapJobName.indexOf(this.part2[i]) >= 0) {
        if (userInfo.jobName.indexOf('储备合伙人') === -1) {
          this.type = false
        }
        break
      }
    }
  }
}
</script>
