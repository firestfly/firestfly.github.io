<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :title="headerBar.title" @leftBtnClick="leftBtnClick"></header-bar>
    <div class="input-search"><input type="search" class="form-control" v-model.lazy="search" placeholder="输入姓名搜索...">
      <span class="search-concel">搜索</span>
    </div>
    <div class="page-loading" v-show="!pageLoading">
          <span class="m-loading">
          </span>
    </div>
    <div class="content" v-show="pageLoading">
      <div class="p10 tc" v-show="noData">未搜索到人员</div>
      <ul class="list">
        <li class="list-item list-item-touch-active" v-for="item in employees" @click="choseItem(item)">
          <div class="list-item-inner">
            <div class="list-item-body">
              <span>{{ item.name }}</span>
              <span class="ml10 fb">{{ item.company }}</span>
              <span class="ml10 fb">{{ item.department }}</span>
            </div>
          </div>
        </li>
      </ul>
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
        title: '我要休假'
      },
      search: '',
      employees: [],
      noData: false,
      pageLoading: true
    }
  },
  created () {
    this.headerBar.title = '选择' + this.$parent.transformData.chooseRelationship
  },
  watch: {
    'search' (v) {
      if (v.length >= 2) {
        this.pageLoading = false
        this.$axios.get(this.$appConfig.api.searchLeaders, {
          params: {
            name: v
          }
        }).then(response => {
          this.pageLoading = true
          this.employees = response
          if (!response || response.length === 0) {
            this.noData = true
          } else {
            this.noData = false
          }
        })
      }
    }
  },
  components: {
    HeaderBar
  },
  methods: {
    leftBtnClick () {
      this.$router.push({
        path: 'action-post'
      })
    },
    choseItem (item) {
      this.$parent.transformData[this.$parent.transformData.field] = item
      setTimeout(() => {
        this.$router.push({
          path: 'action-post'
        })
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
  .form-control + .search-concel {
    display: none;
    color: #4cd964;
    flex: 1;
    transition: width ease-in .3s;
    min-width: 50px;
    padding-left: 10px;
    cursor: pointer;
  }

  .form-control:focus + .search-concel {
    display: inline-block;
  }

  .list {
    margin-top: 0;
  }
</style>
