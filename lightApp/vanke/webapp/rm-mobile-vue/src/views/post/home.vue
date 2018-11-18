<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="leftBtnClick"></header-bar>
    <div class="content">
      <ul class="list">
        <li class="list-item list-item-touch-active">
          <a @click="getData(0)" class="list-item-inner">
            项目名称
            <div class="list-item-right">
              {{ department.name }}
              <i class="icon-angle-right"></i>
            </div>
          </a>
        </li>
        <li class="list-item list-item-touch-active">
          <a @click="getData(1)" class="list-item-inner">
            岗位名称
            <div class="list-item-right">
              {{ post.name }}
              <i class="icon-angle-right"></i>
            </div>
          </a>
        </li>
        <li class="list-item list-item-touch-active">
          <a @click="openDate()" class="list-item-inner">
            日期
            <div class="list-item-right">
              {{ date }}
              <i class="icon-angle-right"></i>
            </div>
          </a>
        </li>
      </ul>
      <div class="pl30 pr30 pt15">
        <button type="button" class="ev-btn ev-btn--primary ev-btn-small" @click="search">查询</button>
      </div>
      <div class="network--error" v-if="networkError">
        <i class="icon-warn"></i>网络错误，点击重新加载！
      </div>
    </div>
    <list :show="addDepartmentState" :fetchData="fetchData" @getEmployees="getDepartments"
          :isIntoSearch="isIntoSearch"></list>
    <transition name="fadeUp">
      <div class="picker-model" v-if="pickerState">
        <picker :slots="Slots" @change="onValuesChange" :showToolbar="true" rotate-effect :visible-item-count="5"
                ref="picker">
          <!-- Toolbar items -->
          <div class="picker-bar">
            <button class="fl button" @click="pickerState = !pickerState">取消</button>
            <button class="fr button" @click="ok()">确定</button>
          </div>
        </picker>
      </div>
    </transition>
  </div>
</template>
<script>
import HeaderBar from '../../components/header.vue'
import List from '../../components/addListData.vue'
import Picker from 'mint-picker'
import * as utils from '../../utils/util'
export default {
  data () {
    return {
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: ''
        },
        title: '按岗查看'
      },
      fetchData: '',
      department: {},
      post: {},
      date: '',
      Slots: [],
      addDepartmentState: false,
      flag: '',
      pickerState: false,
      oldDepartment: {},
      isIntoSearch: false,
      dateArr: [{
        flex: 1,
        values: [],
        defaultIndex: 15,
        textAlign: 'center'
      }]
    }
  },
  computed: {
    networkError () {
      return this.$store.state.network
    }
  },
  components: {
    HeaderBar,
    List,
    Picker
  },
  created () {
    let today = new Date()
    this.date = utils.fmtDate(today, 'yyyy-MM-dd 今天')
    if (this.$route.params.department) {
      let params = this.$route.params
      this.department = params.department
      this.post = params.post
      this.date = params.date
    }
    this.userInfo = this.$store.state.userInfo
    this.dateArr[0].values.push(this.date)
    for (let i = 1; i <= 15; i++) {
      this.dateArr[0].values.push(utils.fmtDate(new Date(+today + 24 * 60 * 60 * 1000 * i), 'yyyy-MM-dd 周T'))
      this.dateArr[0].values.unshift(utils.fmtDate(new Date(+today - 24 * 60 * 60 * 1000 * i), 'yyyy-MM-dd 周T'))
    }
  },
  methods: {
    leftBtnClick () {
      if (this.addDepartmentState) {
        this.addDepartmentState = false
        this.headerBar.title = '按岗查看'
      } else {
        window.location.href = '/home-mobile?loginMobile=' + this.userInfo.mobile
      }
    },
    openDate () {
      let selected = this.date ? this.dateArr[0].values.indexOf(this.date) : 15
      this.$set(this.dateArr[0], 'defaultIndex', selected)
      this.Slots = this.dateArr
      this.pickerState = true
    },
    onValuesChange () {},
    ok () {
      let pickerValue = this.pickerValue || this.$refs.picker.getValues().toString()
      this.date = pickerValue
      this.pickerState = false
    },
    getData (flag) {
      if (flag) {
        if (!this.department.id) {
          this.$toast('请选择项目')
          return
        }
        this.headerBar.title = '选择岗位'
        this.isIntoSearch = true
        let parmas = {
          departmentId: this.department.id
        }
        let q = []
        Object.keys(parmas).forEach((v) => q.push(`${v}=${parmas[v]}`))
        this.fetchData = [this.$appConfig.api.postDepartments, q.join('&')].join('?')
      } else {
        this.isIntoSearch = false
        this.headerBar.title = '选择项目'
        this.fetchData = this.$appConfig.api.departments + '?'
      }
      this.flag = flag
      this.addDepartmentState = true
    },
    search () {
      if (!this.department.id) {
        this.$toast('请选择项目')
        return
      }
      if (!this.post.id) {
        this.$toast('请选择岗位')
        return
      }
      if (!this.date) {
        this.$toast('请选择日期')
        return
      }
      this.$router.push({
        name: 'postDetail',
        params: {
          department: this.department,
          post: this.post,
          date: this.date
        }
      })
    },
    getDepartments (result) {
      if (this.addDepartmentState) {
        this.addDepartmentState = false
        this.headerBar.title = '按岗查看'
      }
      if (!this.flag) {
        this.department = result
        if (this.oldDepartment.id !== this.department.id) {
          this.post = {}
          this.oldDepartment = this.department
        }
      } else {
        this.post = result
      }
    }
  }
}
</script>
