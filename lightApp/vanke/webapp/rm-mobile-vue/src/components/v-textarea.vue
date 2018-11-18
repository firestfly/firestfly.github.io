<template>
  <div class="v-textarea">
    <textarea
      class=""
      :autocomplete="autocomplete"
      :autocapitalize="autocapitalize"
      :autocorrect="autocorrect"
      :placeholder="placeholder"
      :readonly="readonly"
      v-model="currentValue"
      @blur="$emit('on-blur')"
      :style="textareaStyle"
      :maxlength="max"
      ref="textarea">
    </textarea>
    <div class="v-textarea-counter" v-show="max"><span>{{count}}</span>/{{max}}</div>
  </div>
</template>
<script>
export default {
  props: {
    max: Number,
    value: {
      type: String,
      default: ''
    },
    placeholder: String,
    readonly: {
      type: Boolean,
      default: false
    },
    height: Number,
    autocomplete: {
      type: String,
      default: 'off'
    },
    autocapitalize: {
      type: String,
      default: 'off'
    },
    autocorrect: {
      type: String,
      default: 'off'
    }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  created () {
    this.currentValue = this.value
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (newVal) {
      if (this.max && newVal > this.max) {
        this.currentValue = newVal.slice(0, this.max)
      }
      this.$emit('input', this.currentValue)
    }
  },
  computed: {
    count () {
      let len = 0
      if (this.currentValue) {
        len = this.currentValue.replace(/\n/g, 'aa').length
      }
      return len > this.max ? this.max : len
    },
    textareaStyle () {
      if (this.height) {
        return {
          height: `${this.height}px`
        }
      }
    }
  }
}

</script>
<style lang="scss" scoped>
  .v-textarea {
    width: 100%;
    position: relative;
    textarea {
      width: 100%;
      padding: 5px;
      appearance: none;
      border: 1px solid #eee;
      border-radius: 0;
      background-color: #f9f9f9;
      &:focus {
        outline: none;
      }
    }
    .v-textarea-counter {
      position: absolute;
      width: 100%;
      bottom: 5px;
      left: 0;
      text-align: right;
      padding-right: 5px;
      color: #999;
      font-size: 12px;
    }
  }
</style>
