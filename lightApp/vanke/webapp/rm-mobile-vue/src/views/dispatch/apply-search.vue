<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <div class="bfc">
            <ul class="tabbar-radius">
              <li :class="{'active': tab == 2}" class="tabbar-item" @click="onstateSelect(2)">已通过</li>
              <li :class="{'active': tab == 3}" class="tabbar-item" @click="onstateSelect(3)">未通过</li>
              <li :class="{'active': tab == 1}" class="tabbar-item" @click="onstateSelect(1)">审批中</li>
            </ul>
          </div>
          <div class="apply-list">
            <accordion class="list px-tb" v-for="list in listData">
              <div slot="title">
                <h4 class="f16">{{ switchApplyType(list.type) }}</h4>
                <p class="accordion-subtitle">{{ fmtDate(list.startTime, 'M月d日 hh:mm') }} - {{ fmtDate(list.endTime, 'M月d日 hh:mm') }}</p>
              </div>
              <div slot="detail">
                <div class="details px-b">
                  <h5>申请时间<span>{{ fmtDate(list.applyTime, 'yyyy年M月d日 hh:mm') }}</span></h5>
                  <h5>所在项目<span><span v-for="project in list.projects">{{ project }}&nbsp;&nbsp;</span></span></h5>
                  <h5 v-if="list.specificType">加班类型<span>{{ switchTemporaryType(list.specificType) }}</span></h5>
                  <h5 class="display-flex">加班事由
                    <text-overflow :content="list.reason"></text-overflow>
                  </h5>
                </div>
                <div class="participants person-group">
                  <h4 class="f14">参与人员</h4>
                  <div v-for="person in list.participants" class="person-group-item border-no">
                    <div class="avatar" :style="face(person.image)"></div>
                    <h5>{{ person.name }}
                      <span class="person-job text-overflow">({{ person.job }})</span>
                    </h5>
                  </div>
                </div>
              </div>
            </accordion>
          </div>
        </div>
          <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="spiral">
              <span slot="no-results">
                暂无记录
              </span>
              <span slot="no-more">
                暂无更多
              </span>
          </infinite-loading>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import Accordion from '../../components/accordion.vue'
  import TextOverflow from '../../components/textOverflow.vue'
  import InfiniteLoading from 'vue-infinite-loading'
  import * as util from '../../utils/util.js'
  export default {
    data () {
      return {
        headerBar: {
          leftBtn: {
            text: '返回'
          },
          rightBtn: {
            text: '高级查询',
            class: 'theme-color'
          },
          title: '查询'
        },
        tab: null,
        saveTab: null,
        networkError: false,
        listData: [],
        isShowDetails: false,
        isShowReason: false,
        fmtDate (dateString, format) {
          if (dateString) {
            let newDateString = dateString.replace(/-/g, '/')
            return util.fmtDate(newDateString, format)
          } else {
            return null
          }
        },
        switchState (value) {
          let state
          switch (value) {
            case '审批中':
              state = 1
              break
            case '审批已通过':
              state = 2
              break
            case '审批未通过':
              state = 3
              break
            default:
              break
          }
          return state
        },
        switchApplyType (value) {
          let result = null
          for (let type of util.applyType()) {
            if (type.name === value) {
              return value
            }
            if (type.code === value) {
              result = type.name
              break
            }
          }
          return result
        },
        switchTemporaryType (value) {
          let result = null
          for (let type of util.temporaryType()) {
            if (type.name === value) {
              return value
            }
            if (type.code === value) {
              result = type.name
              break
            }
          }
          return result
        },
        showDetails () {
          this.isShowDetails ? this.isShowDetails = false : this.isShowDetails = true
        },
        onstateSelect (state) {
          this.query.state = state
          this.tab = state
          this.listData = []
          this.onRequest(this.query)
        }
      }
    },
    components: {
      HeaderBar,
      Accordion,
      TextOverflow,
      InfiniteLoading
    },
    created () {
      this.userInfo = this.$store.state.userInfo
      this.pageCount = 10
      this.query = {
        'id': this.$store.state.userInfo.id,
        'start': this.listData.length || 0,
        'length': this.pageCount,
        'startTime': this.$route.params.startTime || '',
        'endTime': this.$route.params.endTime || '',
        'applyTime': this.$route.params.applyTime || '',
        'state': this.$route.params.state || 2,
        'employeeId': this.$route.params.employeeId || '',
        'type': this.$route.params.type || ''
      }
      this.onRequest(this.query)
      this.tab = this.$route.params.state || 2
    },
    methods: {
      leftBtnClick () {
        this.$router.push({
          path: '/dispatch'
        })
      },
      rightBtnClick () {
        this.$router.push({
          name: 'advancedSearch',
          params: {
            'startTime': this.$route.params.startTime || '',
            'endTime': this.$route.params.endTime || '',
            'applyTime': this.$route.params.applyTime || '',
            'state': this.$route.params.state || 0,
            'stateName': this.$route.params.stateName || '',
            'employeeId': this.$route.params.employeeId || '',
            'name': this.$route.params.name || '',
            'type': this.$route.params.type || '',
            'typeName': this.$route.params.typeName || '',
            'searchActive': this.$route.params.searchActive
          }
        })
      },
      onRequest (params) {
        setTimeout(() => {
          this.$axios.get(this.$appConfig.api.applySearch, {
            params: params
          })
          .then((res) => {
            if (this.listData.length < res.recordsTotal) {
              this.listData = this.listData.concat(res.data)
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              if (this.listData.length / 10 === 10) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              }
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          })
        }, 200)
      },
      onInfinite () {
        let params = this.query
        this.onRequest(params)
      },
      face (url) {
        if (url) {
          return 'background-image: url(' + url + ')'
        } else {
          return null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables';

  $light-gray: $gray;
  h3, h4, h5 {
    padding: 0;
    margin: 0;
    font-weight: normal;
  }
  .tabbar {
    width: 80%;
    margin: 1em auto;
    border-color: #2F2E33;
  }
  .display-flex {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .display-flex > * {
    flex: 1;
  }
  .para-overflow {
    flex: 3;
    color: $light-gray;
    vertical-align: middle;
    margin-left: .5em;
  }
  .apply-list {
    .list {
      margin: rem(20px) 0;
    }
    h4 {

    }
    p {
      color: $themes-color;
    }
    span {
      color: $light-gray;
    }
    .details {
      padding: .5em rem($inner-width) .5em 0;
      font-size: $font-size-base;
      line-height: 1.75;
      overflow: hidden;
      h5 {
        font-size: inherit;
        > span {
          font-size: inherit;
          margin-left: .5em;
        }
      }
    }
    .person-group {
      padding-bottom: .8em;
      > h4 {
        margin: .5em 0;
      }
      > .person-group-item {
        clear: both;
        overflow: hidden;
        line-height: 3;
      }
      .avatar {
        float: left;
        width: 3em;
        height: 3em;
        margin-right: .5em;
        background-image: url('../../assets/images/default-head.png');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
      }
      h5 {
        line-height: 3.4
      }
      p {
        color: $light-gray;
        span {
          color: $themes-color;
        }
      }
    }
  }

  .border-no {
    background-image: none;
    border: none;
  }
</style>
