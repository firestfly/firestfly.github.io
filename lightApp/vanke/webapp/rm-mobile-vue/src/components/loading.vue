<template>
  <div class="weui_loading_toast" v-show="show">
    <div class="weui_toast">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean
  }
}
</script>
<style lang="scss" scoped>
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
