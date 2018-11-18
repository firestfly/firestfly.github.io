<template>
  <transition name="fade-left">
    <div v-show="show" class="model-inner-page">
      <div class="input-search">
        <input type="search" class="form-control" v-model.lazy="search" placeholder="输入姓名搜索..." @keyup.enter="searchData(search)">
        <span class="search-btn">搜索</span>
      </div>
      <div class="page-loading" v-if="isEmpty">
        请重新输入查询条件
      </div>
      <div class="page-loading" v-if="!pageLoading">
        <span class="m-loading"></span>
      </div>
      <div class="content">
        <div class="staff-list person-group" v-if="pageLoading">
          <div v-for="(staff, index) in listDate" :key="index" class="person-group-item" >
            <input :id="'name' + index" type="radio" :value="staff" v-model="selectedStaff">
            <label :for="'name' + index">
              <div class="avatar"><span class="employee-author" :style="face(staff)"></span></div>
              <div class="info">
                <div class="f16">{{ staff.name }} <span class="leave" v-if="staff.type == 1">休假</span></div>
                <span class="f14 gray">{{staff.department + '  '}}{{ staff.workJob }}{{ staff.jobName }}</span>
              </div>
              <div class="fr fr-overtimes" v-if="staff.duration">
                <p class="gray">本周期已加班<br>{{staff.duration}}分钟</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import * as util from '../utils/util'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    fetchData: String
  },
  data () {
    return {
      search: '',
      listDate: [],
      selectedStaff: {},
      isEmpty: false,
      pageLoading: true
    }
  },
  methods: {
    face (url) {
      if (url.avatar) {
        return 'background-image: url(' + url.avatar + ')'
      } else if (url.avatarUrl) {
        return 'background-image: url(' + url.avatarUrl + ')'
      } else {
        return null
      }
    },
    searchData (value) {
      if (value.length < 2) return
      this.pageLoading = false
      this.$axios.get(this.fetchData + '&name=' + value).then(res => {
        if (res.status === 'fail') {
          this.$toast('网络请求异常，请重试')
        } else {
          this.listDate = res
          if (util.isEmpty(res)) {
            this.isEmpty = true
          } else {
            this.isEmpty = false
          }
        }
        this.pageLoading = true
      })
    }
  },
  watch: {
    'show' (type) {
      if (type) {
        this.search = ''
        this.listDate = []
        this.selectedStaff = {}
      }
    },
    'selectedStaff' (v) {
      this.$emit('getEmployees', this.selectedStaff)
    },
    'search' (value) {
      this.searchData(value)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../assets/scss/Common/_variables.scss';
  .form-control + .search-btn {
    display: none;
    color: $themes-color;
    flex: 1;
    transition: width ease-in .3s;
    min-width: 50px;
    padding-left: 10px;
    cursor: pointer;
  }

  .form-control:focus + .search-btn {
    display: inline-block;
  }

  .fr-overtimes {
    font-size: 14px;
    text-align: right;
    padding-right: 3px;
  }

  .person-group .avatar {
    width: 1.11111rem;
    height: 1.11111rem;
  }
</style>
