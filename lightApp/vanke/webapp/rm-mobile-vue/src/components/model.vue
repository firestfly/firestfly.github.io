<template>
  <transition name="model-fade">
    <div class="ev-model" v-show="modelData.state">
      <div class="ev-mask"></div>
      <div class="ev-model-box">
        <div class="ev-model-title" v-if="!modelData.noTitle" v-text="modelData.title || '提示信息'"></div>
        <div class="ev-model-content ">
          <p v-html="modelData.content || '操作成功'" v-if="!modelData.textarea"></p>
          <div class="border" v-else>
            <v-textarea v-model="cvalue" :max="modelData.max" :height="100" @on-blur="onEvent(cvalue)"></v-textarea>
          </div>
        </div>
        <div class="ev-model-btn flexbox ev__jc">
          <div class="flex model-btn-cancel" v-if="!modelData.cancel" @click="close()">取消</div>
          <div class="flex model-btn-ok color-primary" @click="ok()">确定</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import VTextarea from './v-textarea.vue'
export default {
  props: {
    modelData: {
      type: Object,
      default: function () {
        return {
          state: false,
          noTitle: false,
          cancel: false // 是否显示取消按钮
        }
      }
    },
    showText: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cvalue: ''
    }
  },
  created () {
    this.cvalue = this.modelData.textarea
  },
  components: {
    VTextarea
  },
  methods: {
    close () {
      this.$emit('on-cancel')
    },
    ok () {
      if (this.modelData.cancel) {
        this.$emit('on-cancel')
      } else {
        this.$emit('on-confirm')
      }
    },
    onEvent (event) {
      this.modelData.textarea = this.cvalue
    }
  }
}
</script>