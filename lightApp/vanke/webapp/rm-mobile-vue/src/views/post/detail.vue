<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :title="headerBar.title" @leftBtnClick="back()">
    </header-bar>
    <div class="title-datetime">
      <div class="left-triangle-arrow">
        <span class="iconfont">&#xe612;</span>
      </div>
      <div class="lastday" @click="setLastDay">
        前一天
      </div>
      <div class="datetime">
        <datetime v-model="date" :title="('Birthday')" :show="showDatetime" format="YYYY-MM-DD"
                  class="text-center" confirm-text="确定" cancel-text="取消">
          {{dateForShow}}
        </datetime>
      </div>
      <div class="nextday" @click="setNextDay">
        后一天
      </div>
      <div class="right-triangle-arrow">
        <span class="iconfont iconfont-arrow-right">&#xe612;</span>
      </div>
    </div>
    <div class="page-loading" v-show="!pageLoading">
      <span class="m-loading"></span>
    </div>
    <div class="content" v-show="pageLoading">
      <ul class="list">
        <li class="list-item" v-for="item in postEmployee.employees">
          <a class="list-item-inner">
            <div class="list-item-left">{{ item.beginTime }}-{{ item.endTime }}</div>
            <div class="list-item-body">
              {{ item.employeeName }}
            </div>
            <div class="list-item-right">
              <a :href="'tel:' + item.mobile" v-if="+item.mobile">
                <img width="24" src="../../assets/images/icons8-phone-48.png" alt="">
              </a>
            </div>
          </a>
        </li>
      </ul>
      <div class="p30 gray tc" v-if="postEmployee.employees.length == 0">
        当天无数据
      </div>
      <div class="show-more" @click="showMore()" v-show="isMore">
        <div class="icon"><span class="iconfont iconfont-arrow-down">&#xe612;</span></div>
        显示更多
      </div>
    </div>
    <div v-show="pageLoading" class="footer">
      <ul class="list">
        <li class="list-item">
          <div class="list-item-inner">
            <div class="list-item-body tc">
              {{postEmployee.company}}—{{ params.department.name}}
            </div>
          </div>
        </li>
        <li class="list-item">
          <div class="list-item-inner">
            <div class="list-item-body tc">
              {{ params.post.name}}
            </div>
          </div>
        </li>
        <li class="list-item">
          <div class="list-item-inner">
            <div class="list-item-body tc">
              项目合伙人：{{ postEmployee.partner }}
              <a v-if="postEmployee.partnerMobile" :href="'tel:' + postEmployee.partnerMobile" class="ml10">
                <img width="24" src="../../assets/images/icons8-phone-48.png" alt="">
              </a>
            </div>
          </div>
        </li>
        <li class="list-item">
          <div class="list-item-inner">
            <div class="list-item-body tc">
              管理中心总经理：{{ postEmployee.manager }}
              <a v-if="postEmployee.managerMobile" :href="'tel:' + postEmployee.managerMobile" class="ml10">
                <img width="24" src="../../assets/images/icons8-phone-48.png" alt="">
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import '../../assets/scss/Common/_variables.scss';

  .weui-cell {
    padding-left: 0;
    padding-right: 0;
  }
  .footer .list {
    margin: 0;
  }

  .iconfont-arrow-right {
    transform: rotate(180deg);
  }

  .show-more {
    background: white;
    padding: 5px;
    color: $themes-color;
    text-align: center;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-item: center;
  }

  .show-more .icon {
    display: flex;
    padding-right: 10px;
    justify-content: center;
    align-item: center;
  }

  .title-datetime {
    display: flex;
    background-color: white;
  }

  .flex {
    flex: 1
  }

  .text-right {
    text-align: right;
  }

  .left-triangle-arrow {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lastday {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .datetime {
    flex: 4;
    text-align: center;
    color: $themes-color;
  }

  .text-center {
    text-align: center;
    display: inline-block;
  }

  .nextday {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right-triangle-arrow {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<script>
import HeaderBar from '../../components/header.vue'
import { Datetime } from 'vux'
import * as util from '../../utils/util'
export default {
  data () {
    return {
      headerBar: {
        title: '按岗查看',
        leftBtn: {
          text: ' '
        }
      },
      date: null,
      showDatetime: false,
      // minDate: '2015-01-01',
      // maxDate: maxDate,
      isMore: false,
      params: {
        post: {},
        department: {}
      },
      postEmployee: {
        employees: []
      },
      pageLoading: false,
      dateForShow: ''
    }
  },
  components: {
    HeaderBar,
    Datetime
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //   })
  // },
  created () {
    if (!this.$route.params.post) {
      this.$router.push({
        name: 'postHome'
      })
    } else {
      this.params = this.$route.params
      this.date = this.$route.params.date.split(' ')[0] || util.fmtDate(this.datePlus(new Date(), -1), 'yyyy-MM-dd')
      // this.getList()
    }
  },
  watch: {
    date (v) {
      this.pageLoading = false
      this.dateForShow = util.fmtDate(this.date, 'yyyy-MM-dd 周T')
      this.getList()
    }
  },
  methods: {
    back () {
      this.$router.push({
        name: 'postHome',
        params: this.params
      })
    },
    getList () {
      this.$axios.get(this.$appConfig.api.postsEmployee, {
        params: {
          departmentId: this.params.department.id,
          postId: this.params.post.id,
          date: this.date
        }
      }).then(res => {
        if (res.status === 'fail') {
          this.$toast('网络请求异常，请重试')
        } else {
          this.postEmployee = res
          // if (util.isEmpty(res)) {
          //   this.postEmployee.employees = []
          // }
        }
        this.pageLoading = true
      })
    },
    setLastDay () {
      this.date = util.fmtDate(this.datePlus(this.date.split(' ')[0], -1), 'yyyy-MM-dd')
    },
    setNextDay () {
      this.date = util.fmtDate(this.datePlus(this.date.split(' ')[0], 1), 'yyyy-MM-dd')
    },
    datePlus (date, plus) {
      let dateN = new Date(date)
      dateN.setDate(dateN.getDate() + plus)
      return dateN
    }
  }
}
</script>

