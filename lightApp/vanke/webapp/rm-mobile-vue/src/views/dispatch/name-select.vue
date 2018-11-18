<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>数据请求异常，请重试！
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="!networkError">
        <div class="flex-start">
          <div class="search"><input type="text" placeholder="按员工姓名搜索" v-model="name" @keyup="searchName()" /></div>
          <div class="staff-list person-group">
            <div v-for="(staff, index) in staffs" class="person-group-item">
              <div class="avatar" :style="face(staff.image)">
              </div>
              <div class="info">
                <h5>{{ staff.name }}<br></h5>
                <span class="f12 gray">{{ staff.job }}</span>
              </div>
              <input :id="'name' + index" type="radio" :value="{ employeeId: staff.employeeId, name: staff.name, avatar: staff.image, job: staff.job }" v-model="selectedStaff" name="staff">
              <label :for="'name' + index"></label>
            </div>
          </div>
          <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="spiral">
              <span slot="no-results">
                未搜索到员工记录
              </span>
              <span slot="no-more">
                暂无更多
              </span>
          </infinite-loading>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderBar from '../../components/header.vue'
  import InfiniteLoading from 'vue-infinite-loading'
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
          title: '员工选择'
        },
        networkError: false,
        staffs: [],
        name: '',
        timer: null,
        selectedStaff: {},
        searchName () {
          clearTimeout(this.timer)
          this.staffs.length = 0
          this.timer = setTimeout(() => {
            this.onInfinite()
          }, 300)
        }
      }
    },
    components: {
      HeaderBar,
      InfiniteLoading
    },
    created () {
      this.pageCount = 15
    },
    methods: {
      face (url) {
        if (url) {
          return 'background-image: url(' + url + ')'
        } else {
          return null
        }
      },
      leftBtnClick () {
        let params = this.$route.params
        this.passParams(params)
      },
      rightBtnClick () {
        let oldParams = this.$route.params
        let params = Object.assign(oldParams, this.selectedStaff)
        this.passParams(params)
      },
      passParams (params) {
        if (!params.page) {
          this.$router.push({
            name: 'advancedSearch',
            params: params
          })
        } else {
          this.$router.push({
            name: params.page,
            params: params
          })
        }
      },
      onInfinite () {
        this.params = {
          'id': this.$store.state.userInfo.id,
          'start': this.staffs.length || 0,
          'length': this.pageCount,
          'name': this.name || ''
        }
        setTimeout(() => {
          this.$axios.get(this.$appConfig.api.staffSearch, {
            params: this.params
          })
          .then((res) => {
            if (this.staffs.length < res.recordsTotal) {
              this.staffs = this.staffs.concat(res.data)
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              if (this.staffs.length / 20 === 20) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              }
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          })
        }, 200)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables';

  .staff-list label {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
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
</style>
