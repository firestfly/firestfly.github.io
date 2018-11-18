<template>
  <div id="app">
    <loading :show="isLoading"></loading>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import loading from './components/loading.vue'
export default {
  computed: {
    ...mapGetters({
      isLoading: 'getLoading'
    })
  },
  components: {
    loading
  }
}
</script>
<style lang="scss">
  @import './assets/scss/index.scss';
  @import '../node_modules/mint-picker/lib/index.css';

  #app {
    overflow: hidden;
    margin: 0 auto;
    height: 100%;
  }

  .child-view, .transition {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: 100%;
    transition: all .5s cubic-bezier(.55, 0, .1, 1);
  }
</style>
