<template>
  <transition name="fade-left">
    <div v-show="show" class="model-inner-page">
      <v-textarea v-model="cvalue" :max="200" :height="200" placeholder="请输入事由" @on-blur="onEvent(cvalue)"></v-textarea>
  </div>
  </transition>
</template>
<script>
import VTextarea from './v-textarea.vue'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cvalue: this.value
    }
  },
  components: {
    VTextarea
  },
  methods: {
    onEvent (event) {
      this.$emit('get-textarea', event)
    }
  }
}
</script>
