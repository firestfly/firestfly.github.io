<template>
  <div class="page">
    <header-bar :title="headerBar.title" :closeWindow="headerBar.closeWindow"></header-bar>
    <div class="content">
      <ul class="list mt0">
        <router-link tag="li" to="/leave" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            我要休假
          </div>
        </router-link>
        <li class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            我要出差
          </div>
        </li>
        <li class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            我要外勤
          </div>
        </li>
        <li class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            申请查询
          </div>
        </li>
      </ul>
      <ul class="list">
        <a href="/home-mobile#/myattendance" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            考勤结果
          </div>
        </a>
        <a href="/home-mobile#/schedule" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            排班信息
          </div>
        </a>
        <a href="/home-mobile#/sign-in" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            签到信息
          </div>
        </a>
        <a href="/home-mobile#/attendance" class="list-item list-item-pl0 list-item-touch-active list-angle-right">
          <div class="list-item-inner f16">
            考勤汇总
          </div>
        </a>
      </ul>
    </div>
  </div>
</template>
<script>
import headerBar from '../components/header.vue'
export default {
  data () {
    return {
      headerBar: {
        title: '时间管理',
        closeWindow: true
      }
    }
  },
  components: {
    headerBar
  }
}

</script>
<style lang="scss" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .weui_toast {
    position: fixed;
    z-index: 50000;
    width: 70px;
    height: 70px;
    top: 50%;
    left: 50%;
    margin-left: -35px;
    margin-top: -35px;
    background: url(../assets/images/loading.gif) no-repeat;
    background-size: cover;
    text-align: center;
  }
</style>
