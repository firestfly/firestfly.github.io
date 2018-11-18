<template>
  <transition name="fade-left">
    <div v-show="show" class="model-fade-left">
      saaa
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}

</script>
<style lang="scss" scoped>
  @import '../assets/scss/Common/_variables.scss';

  .model-fade-left {
    transition: .2s ease-in-out all;
    position: absolute;
    left: 0;
    top: 1.26rem;
    width: 100%;
    bottom: 0;
    background: #efeff4;
    overflow: auto;
    z-index: 6;
  }
</style>
