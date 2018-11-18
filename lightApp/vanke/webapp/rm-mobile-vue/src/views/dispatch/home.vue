<template>
  <div>
    <header-bar :title="headerBar.title" :closeWindow="headerBar.closeWindow"></header-bar>
    <div class="content">
      <ul class="list mt0">
        <router-link tag="li" to="/dispatch/arrange-bussiness" v-if="itemShow"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            安排出差
          </div>
        </router-link>
        <router-link tag="li" to="/dispatch/overtime" v-if="itemShow"
                     class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            安排临时加班
          </div>
        </router-link>
      </ul>
      <ul class="list">
        <router-link tag="li" to="/dispatch/approval?state=0" v-if="itemShow"
                     class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            审批
          </div>
        </router-link>
      </ul>
      <ul class="list">
        <router-link tag="li" to="/dispatch/search"
                     class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            查询
          </div>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
import headerBar from '../../components/header.vue'
const workJobs = ['合伙人', '系统负责人', '人力资源专员', '项目HR']
export default {
  data () {
    return {
      itemShow: false,
      headerBar: {
        title: '员工调度',
        closeWindow: true
      }
    }
  },
  created () {
    let jobName = this.$store.state.userInfo.jobName
    for (let keys of workJobs) {
      if (jobName.indexOf(keys) !== -1) {
        this.itemShow = true
        return
      }
    }
  },
  components: {
    headerBar
  }
}

</script>
