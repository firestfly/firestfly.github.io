<template>
  <div class="para-overflow" :class=" isShowDetails ? 'arrow-up' : 'text-overflow arrow-down'" @click="showDetails()">{{ content }}</div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShowDetails: false,
      showDetails () {
        this.isShowDetails ? this.isShowDetails = false : this.isShowDetails = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/Common/_variables';
  .arrow-up, .arrow-down{
    &::before {
      right: 2px;
      border-top-color: #A6A6A6;
      border-right-color: #A6A6A6;
    }
  }
  .arrow-up::before {
    top: .8em;
  }
  .arrow-down::before {
    top: .5em;
  }
</style>
