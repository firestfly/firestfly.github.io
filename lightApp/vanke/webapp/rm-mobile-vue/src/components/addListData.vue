<template>
  <transition name="fade-left">
    <div v-show="show" class="model-inner-page">
      <div class="input-search">
        <input type="search" class="form-control" v-model="search" placeholder="输入搜索内容..."
               @keyup.enter="searchData(search)">
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
          <div v-for="(staff, index) in listDate" :key="index" class="person-group-item">
            <input :id="'name' + index" type="radio" :value="staff" v-model="selectedStaff">
            <label :for="'name' + index">
              <div class="info">
                <div class="f16">{{ staff.name }}</div>
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
    isIntoSearch: {
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
      pageLoading: true,
      timeId: null,
      timeString: 0
    }
  },
  methods: {
    searchData (value) {
      if (!this.isIntoSearch && value.length < 1) return
      this.pageLoading = false
      let timeString = +new Date()
      this.$axios.get(this.fetchData + '&name=' + value).then(res => {
        if (res.status === 'fail') {
          this.$toast('网络请求异常，请重试')
        } else {
          if (timeString < this.timeString) {
            return
          }
          this.selectedStaff = {}
          this.timeString = timeString
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
        this.isEmpty = false
        this.isIntoSearch && this.searchData('')
      }
    },
    'selectedStaff' (v) {
      this.selectedStaff.id && setTimeout(() => {
        this.$emit('getEmployees', this.selectedStaff)
      }, 200)
    },
    'search' (value) {
      clearTimeout(this.timeId)
      this.timeId = setTimeout(() => {
        this.searchData(value)
      }, 500)
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

  .info {
    margin-bottom: 0.4em;
  }

  .staff-list input[type="radio"] + label::before {
    margin-top: 0;
  }

  .person-group .avatar {
    width: 1.11111rem;
    height: 1.11111rem;
  }
</style>
