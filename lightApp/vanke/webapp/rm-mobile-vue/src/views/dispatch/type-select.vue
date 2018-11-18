<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <ul class="type-list">
            <li v-for="(item, index) in types">
              <input :id="'type' + index" type="radio" :value="{ type: item.type, typeName: item.typeName }" v-model="selectedType" name="type">
              <label :for="'type' + index">{{ item.typeName }}</label>
            </li>
          </ul>
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
            text: '确定',
            class: 'theme-color'
          },
          title: '类型选择'
        },
        networkError: false,
        types: [],
        selectedType: {}
      }
    },
    components: {
      HeaderBar
    },
    created () {
      this.$axios.get(this.$appConfig.api.typeSearch)
      .then((res) => {
        this.types = res
      })
    },
    methods: {
      leftBtnClick () {
        this.passParams()
      },
      rightBtnClick () {
        if (!this.selectedType.type) {
          this.$toast('请选择类型')
          return
        }
        this.passParams()
      },
      passParams () {
        this.$router.push({
          name: 'advancedSearch',
          params: {
            'startTime': this.$route.params.startTime,
            'endTime': this.$route.params.endTime,
            'applyTime': this.$route.params.applyTime,
            'state': this.$route.params.state,
            'stateName': this.$route.params.stateName,
            'employeeId': this.$route.params.employeeId,
            'name': this.$route.params.name,
            'type': this.selectedType.type,
            'typeName': this.selectedType.typeName,
            'searchActive': this.$route.params.searchActive
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/Common/_variables';
  .type-list {
    padding: 0 4%;
    background: white;
    li {
      position: relative;
      border-top: 1px solid $border-color;
      font-size: 110%;
      line-height: 3;
      overflow: hidden;
      input {
        position: absolute;
        opacity: 0;
        clip: rect(0, 0, 0, 0);
      }
      label {
        display: block;
      }
      input[type="radio"] + label::before{
        float: right;
        content: '\a0';
        display: inline-block;
        width: 1.4em;
        height: 1.4em;
        margin-top: .8em;
        padding: .2em;
        background-clip: content-box;
        border-radius: 50%;
        border: 1px solid $color-gray;
      }
      input[type="radio"].checked + label::before,
      input[type="radio"]:checked + label::before {
        background: $themes-color;
        background-clip: content-box;
        border-color: $themes-color;
      }
    }
  }
</style>