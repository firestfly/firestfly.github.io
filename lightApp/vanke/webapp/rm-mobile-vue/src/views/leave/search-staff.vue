<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick" @rightBtnClick="rightBtnClick"></header-bar>
    <div class="content">
      <div class="page-loading" v-show="!pageLoading">
            <span class="m-loading">
            </span>
      </div>
      <div class="flexbox ev__space__between sec-detail" v-if="pageLoading">
        <div class="flex-start">
          <div class="input-search">
            <input type="search" placeholder="按员工姓名搜索" class="form-control" v-model.lazy="search" />
            <span class="search-concel">搜索</span>
          </div>
          <div class="staff-list person-group"  v-if="staffs">
            <div v-for="(staff, index) in staffs" :key="index" class="person-group-item">
              <div class="avatar" :style="face(staff.avatarUrl)">
              </div>
              <div class="info">
                <h5>{{ staff.name }}<br></h5>
                <span class="f12 gray">{{staff.department}}  {{ staff.jobName }}</span>
              </div>
              <input :id="'name' + index" type="radio" :value="{ employeeId: staff.employeeId, name: staff.name, avatar: staff.avatarUrl, workJob: staff.jobName }" v-model="selectedStaff" name="staff">
              <label :for="'name' + index"></label>
            </div>
          </div>
          <div class="p10 tc" v-show="noData">未搜索到人员</div>
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
          title: '员工选择'
        },
        staffs: [],
        search: '',
        selectedStaff: {},
        noData: false,
        pageLoading: true
      }
    },
    components: {
      HeaderBar
    },
    created () {
    },
    watch: {
      'search' (v) {
        if (v.length >= 2) {
          this.pageLoading = false
          this.$axios.get(this.$appConfig.api.searchLeaders, {
            params: {
              name: v,
              departmentId: this.$store.state.userInfo.departmentId
            }
          }).then(response => {
            this.pageLoading = true
            this.staffs = response
            if (!response || response.length === 0) {
              this.noData = true
            } else {
              this.noData = false
            }
          })
        }
      }
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
        if (!this.selectedStaff.employeeId) {
          this.$toast('未选择员工')
          return
        }
        let params = this.$route.params
        let staffs = this.$route.params[params['selected']]
        if (Array.isArray(staffs)) {
          if (staffs.length > 0) {
            if (staffs[0].employeeId) {
              let isUnique = true
              staffs.forEach((v) => {
                if (v.employeeId === this.selectedStaff.employeeId) {
                  isUnique = false
                }
              })
              if (isUnique) {
                staffs.push(this.selectedStaff)
              } else {
                this.$toast('抄送人重复，请重新选择')
                return
              }
            } else {
              staffs[0] = this.selectedStaff
            }
          }
        } else {
          params[params['selected']] = this.selectedStaff
        }
        this.passParams(params)
      },
      passParams (params) {
        this.$router.push({
          name: params.page,
          params: params
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables';

  .form-control + .search-concel {
    display: none;
    color: $themes-color;
    flex: 1;
    transition: width ease-in .3s;
    min-width: 50px;
    padding-left: 10px;
    cursor: pointer;
  }

  .form-control:focus + .search-concel {
    display: inline-block;
  }

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
