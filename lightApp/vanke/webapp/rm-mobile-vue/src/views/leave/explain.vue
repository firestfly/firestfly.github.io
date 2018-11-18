<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <textarea v-model="vacationExplain" @keyup="countText" class="model-textarea" placeholder="请输入休假理由"></textarea>
          <div class="count">{{ count }}/120</div>
        </div> 
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: '提交'
          },
          title: '休假理由'
        },
        networkError: false,
        vacationExplain: '',
        count: 0
      }
    },
    components: {
      HeaderBar
    },
    created () {
      this.vacationExplain = this.$route.params.vacationExplain
    },
    methods: {
      leftBtnClick () {
        let params = this.$route.params
        this.passParams(params)
      },
      rightBtnClick () {
        if (this.vacationExplain.length > 120) {
          this.$toast('字数不能大于120字')
          return
        }
        let oldParams = this.$route.params
        let params = Object.assign(oldParams, {vacationExplain: this.vacationExplain})
        this.passParams(params)
      },
      passParams (params) {
        this.$router.push({
          name: 'leaveOneOff',
          params: params
        })
      },
      countText () {
        this.count = this.vacationExplain.length
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables';

  .model-textarea {
    font-family: 'Microsoft Yahei';
    display: block;
    width: 100%;
    height: 5rem;
    border: 0;
    resize: 0;
    outline: 0;
    border-bottom: 1px solid $border-color;
    padding: .3rem;
    background: #fff;
  }
  .model-textarea::placeholder {
    color: #ccc;
  }
  .count {
    color: $gray;
    text-align: right;
    padding-right: .3rem;
    transform: translateY(-120%)
  }
</style>
