<template>
  <div class="inner">
    <div class="inner-panel">
      <h1>ev-model</h1>
      <p>带回调确认功能ev-model,model title可选</p>
    </div>
    <div class="page__demo">
      <span class="ev-btn ev-btn--defualt" @click="open(1)">model 样式一</span>
      <span class="ev-btn ev-btn--primary" @click="open(2)">model 样式二</span>
      <span class="ev-btn ev-btn--warn" @click="open(3)">model 样式三</span>
    </div>
    <model :model-data="model" @on-cancel="model.state = false" @on-confirm="onConfirm()"></model>
    <popup-picker title="时间" :inline-desc="`当前值[${formatDemoValue}]`" v-model="formatDemoValue"
                  :data="[['01','02','03'],['11','12','13']]" :display-format="format"></popup-picker>
  </div>
</template>
<script>
import Model from '../../components/model.vue'
import { PopupPicker } from 'vux'
import * as utils from '../../utils/util'
export default {
  data () {
    return {
      model: {
        state: false,
        title: '',
        content: '',
        textarea: ''
      },
      modelMutils: null,
      datetime: '2017年02月02 02:00:21'
    }
  },
  components: {
    Model,
    PopupPicker
  },
  mounted () {
    console.log(utils.fmtDate('2018-12-09', 'yyyy/MM/dd'))
    console.log(new Date('2018/09/02 00:00:00'))
  },
  methods: {
    open (id) {
      switch (id) {
        case 1:
          console.log('a')
          this.model = {
            state: true,
            content: '这是默认标题文字'
          }
          break
        case 2:
          this.model = {
            state: true,
            content: '同样带回调参数的 model',
            title: '自定义标题',
            textarea: '哈哈哈哈',
            cancel: true,
            max: 300
          }
          break
        case 3:
          this.model = {
            state: true,
            content: '这是没有标题的 model，简洁而大方的 model 供您选择',
            noTitle: true
          }
      }
      this.modelMutils = id
    },
    onConfirm () {
      switch (this.modelMutils) {
        case 1:
          this.$toast('你选择了确认1')
          break
        case 2:
          this.$toast({
            msg: '提交成功',
            type: 'succes',
            time: 2000
          })
          console.log(this.model)
          break
        case 3:
          this.$toast({
            msg: '数据提交中',
            type: 'loading',
            time: 2000
          })
          break
        default:
          break
      }
      this.model.state = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .page__demo {
    .ev-btn {
      margin-bottom: 15px;
    }
  }
</style>
