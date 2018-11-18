<template>
  <div class="accordion">
    <div class="accordion-title px-b" :class="isShowDetails ? 'arrow-up' : 'arrow-down'" @click="showDetails()">
      <slot name="title"></slot>
    </div>
    <div class="accordion-detail" v-if="isShowDetails">
      <slot name="detail"></slot>
    </div>
  </div>
</template>

<script>
export default {
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

<style lang="scss">
  @import '../assets/scss/Common/_variables';
  .accordion {
    background-color: white;
  }
  .accordion-title {
    margin-left: rem($inner-width);
    padding: rem(18px) rem($inner-width) rem(18px) 0;
    &::before {
      right: rem(34px);
      border-top-color: #A6A6A6;
      border-right-color: #A6A6A6;
    }
  }
  .accordion-detail {
    margin-left: 4%;
  }
</style>
