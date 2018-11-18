<template>
  <div class="header">
    <a class="back" href='/native_service?data={"method":"closeWeb"}' v-if="closeWindow">
      关闭
    </a>
    <a @click="leftBtnClick" class="back" v-if="leftBtn.text != ''">
      <i class="iconfont">&#xe60c;</i>{{ leftBtn.text }}
    </a>
    <h3>{{ title }}</h3>
    <a :class="rightBtn.class ? rightBtn.class + ' header-right' : 'header-right'" id="rightBtnClick" @click="rightBtnClick" v-if="rightBtn.text != ''">{{ rightBtn.text }}</a>
  </div>
</template>

<script>
export default {
  props: {
    leftBtn: {
      type: Object,
      default () {
        return {
          url: '',
          text: ''
        }
      }
    },
    rightBtn: {
      type: Object,
      default () {
        return {
          url: '',
          text: '',
          class: ''
        }
      }
    },
    btns: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导航栏'
    },
    closeWindow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    leftBtnClick () {
      this.$emit('leftBtnClick')
    },
    rightBtnClick () {
      this.$emit('rightBtnClick')
    }
  }
}
</script>
