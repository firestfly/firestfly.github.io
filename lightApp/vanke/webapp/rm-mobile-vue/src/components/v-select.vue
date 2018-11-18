<template>
  <transition name="fade-up">
    <div v-show="show" class="model-fade-up">
      <div class="ev-mask"></div>
      <div class="ev-model-btn flexbox ev__jc">
        <div class="flex model-btn-cancel" @click="close()">取消</div>
        <div class="flex model-btn-ok color-primary" @click="$emit('confirm-select')">确定</div>
      </div>
      <div class="action-content">
        <ul class="">
          <li :class="{'on': item.checked}" v-for="(item, index) in slots" @click="vselect(item, index)"><span class="">{{item.name}}</span><span
            class="action-checked"></span></li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    slots: Array,
    isMulti: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isMultiple: this.isMulti,
      currentIndex: null
    }
  },
  methods: {
    close () {
      this.show = false
    },
    vselect (item, index) {
      if (this.isMultiple) {
        if (item.checked) {
          this.$set(item, 'checked', false)
        } else {
          this.$set(item, 'checked', true)
        }
      } else {
        if (!item.checked) {
          if (this.currentIndex === null) {
            this.currentIndex = index
            this.$set(item, 'checked', true)
          } else {
            this.$set(this.slots[this.currentIndex], 'checked', false)
            this.$set(item, 'checked', true)
            this.currentIndex = index
          }
        }
      }
    }
  }
}
</script>
