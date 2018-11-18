<template>
  <div id="arrange-bussiness">
    <header-bar :leftBtn="headerBar.leftBtn"
                :rightBtn="headerBar.rightBtn"
                :title="headerBar.title"
                @leftBtnClick="leftBtnClick"
                @rightBtnClick="rightBtnClick"></header-bar>
    <div class="page-loading"
         v-show="!pageLoading">
      <span class="m-loading">
            </span>
    </div>
    <div class="content" v-show="pageLoading">
      <ul class="list mt0">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner"  @click="openDepartment">
            <div class="list-item-left f16 half">
              项目
            </div>
            <div class="list-item-right gray">
              <div>
                <div v-for="department in cache.departments" class="text-overflow align-item">{{department.name}}</div>
                <div class="text-overflow align-item" v-if="cache.departments.length == 0">请选择</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list m-b-0">
        <li class="list-item list-item-touch-active list-angle-right"
            v-for="(item, index) in cache.businessAddress">
          <swipe-delete @delete-item="deleteItem(index)">
            <div slot="content" @click="openAddress(item, index)">
              <div class="list-item-inner">
                <div class="list-item-left f16">
                  出差地址{{index + 1}}
                </div>
                <div class="list-item-right gray">
                  {{item.value || '请选择'}}
                </div>
          </div>
            </div>
          </swipe-delete>
        </li>
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner tc" @click="openAddress()">
            <div class="list-item-body tc gray f16">
              <span class="icon-plus-img"></span>添加出差地址
            </div>
          </div>
        </li>
      </ul>
      <div class="list-inner gray f12" v-if="cache.businessAddress.length > 0">左划可以删除</div>
      <ul class="list" @click="openPageTextarea">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner no-background f16">
              出差事由
          </div>
        </li>
        <li class="list-item list-item-touch-active" v-if="cache.subject">
          <div class="list-item-inner p-t-0">
            <div class="list-item-left ellipsis gray">
              {{cache.subject}}
            </div>
            <div class="list-item-right gray">
           </div>
          </div>
        </li>
      </ul>
      <ul class="list m-b-0">
        <li class="list-item list-item-touch-active">
          <div class="list-item-inner">
            <div class="list-item-left f16">
              人员与时间
            </div>
            <div class="list-item-right gray">
           </div>
          </div>
        </li>
        <li class="list-item"
            v-for="(item, index) in cache.employees">
          <swipe-delete @delete-item="delEmployeeTime(item,index)">
            <div slot="content" @click="modifyEmployeeTime(item, index)" class="list-item">
              <div class="list-item-media">
                <span class="employee-author" :style="face(item.employee.avatar)"></span>
              </div>
              <div class="list-item-swipe">
                <div class="list-item-body pl10">
                  <div class="f16"><span>{{ item.employee.name }}</span><span
                    class="gray">（{{ item.employee.workJob }}）</span>
                  </div>
                  <div>
                    <span class="gray f12">{{ item.formatBeginDate }}-{{ item.formatEndDate }} </span>
                  </div>
                </div>
              </div>
            </div>
          </swipe-delete>
        </li>
        <li class="list-item list-item-touch-active" @click="addEmployeeTime">
          <div class="list-item-inner ">
            <div class="list-item-body tc gray f16">
              <span class="icon-plus-img"></span>添加人员与时间
            </div>
          </div>
        </li>
      </ul>
      <div class="list-inner gray f12" v-if="cache.employees.length > 0">左划可以删除</div>
      <div class="employee-group px-tb">
        <div class="employee-title px-b">审批人</div>
        <ul class="employee-list step-arrow">
          <li class="" v-for="(item,index) in cache.approvalPerson" @click="addApprovalPerson(item,index)">
            <div class="text-overflow gray pr5">{{ item.workJob || '&nbsp;' }}</div>
            <span class="employee-author" :style="face(item.avatar)"></span>{{item.name || '&nbsp;'}}
            <!--<span class="delete"><img src="../../assets/images/icon-close.png"></span>-->
          </li>
          <li class="step-arrow-add" v-if="cache.approvalPerson.length == 0">
            <span>&nbsp;</span>
            <span class="employee-author add"></span>
            <span>&nbsp;</span>
          </li>
          <!--<li class="step-arrow-add" @click="addApprovalPerson('new')"><span>&nbsp;</span><span class="employee-author add"></span>添加</li>-->
        </ul>
      </div>
      <div class="list-inner gray f12">点击人员头像可以修改</div>
      <div class="employee-group px-tb">
        <div class="employee-title px-b">抄送</div>
        <ul class="employee-list">
          <li class="" v-for="(item,index) in cache.CCPerson" @click="deleteCCPerson(index)">
            <div class="text-overflow gray pr5">{{ item.workJob || '&nbsp;' }}</div>
            <span class="employee-author" :style="face(item.avatar)"></span>{{item.name || '&nbsp;'}}
          </li>
          <li class="step-arrow-add" @click="addCCPerson('new')">
            <span>&nbsp;</span>
            <span class="employee-author add"></span>
            <span>&nbsp;</span>
          </li>
        </ul>
      </div>
      <div class="list-inner gray f12">点击人员头像可以删除(只有添加的人员可以删除)</div>
    </div>
    <popup-picker :title="'地址'" :fixed-columns="2" :data="areaList" :columns="2" v-model="address"
                  :show="showArea" @on-hide="addAddress"
                  class="p-r-default address" ref="pickerCity"></popup-picker>
    <v-department :fetch-data="fetchDataDepartment" :multi="true" :employees="employeeId" :show="innerPageShow"
                  @get-departments="getDepartments"></v-department>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getApprovalPersons"></add-person>
    <page-textarea :show="pageTextareaState" @get-textarea="getTextarea"></page-textarea>
  </div>
</template>
<style lang="scss">
.no-background{
  background: none;
}
.p-t-0{
  padding-top: 0;
}
.employee-left{
  flex-grow: 1;
  display: flex;
}
.employee-right{
  flex: 0 20px !important;
}
.row-head{
  flex: 0 42px 0;
}
.row-body{
  flex: 1 1 1;
  padding-left: 0.25rem;
}
.m-t-0{
  margin-top: 0;

}
.m-b-0{
  margin-bottom: 0 !important;
}
.p-r-default > div.weui-cell{
  padding-right: 0.55556rem !important;
}
.address .weui-cell__ft::after{
  border: none !important;
}
.ellipsis{
  width: 300px !important;
  overflow: hidden;
  padding-right: 25px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vux-cell-box.p-r-default.address {
  display: none;
}

.delete{
  width: 0.6rem;
  height: 0.6rem;
  color: #fff;
  /* margin-top: -10px; */
  display: inline-block;
  // background-color: green;
  border-radius: 100%;
  position: relative;
  left: 0.4rem;
  top: -0.4rem;
}
.delete img{
  width: 0.6rem;
  height: 0.6rem;
}
</style>
<script>
import HeaderBar from '../../components/header.vue'
import VDepartment from '../../components/department.vue'
import addPerson from '../../components/addPerson.vue'
import pageTextarea from '../../components/pageTextarea.vue'
import swipeDelete from '../../components/swipeDelete.vue'
import * as util from '../../utils/util'

import { Group, PopupPicker } from 'vux'
export default {
  data () {
    return {
      cache: {
        departments: [],
        employees: [],
        businessAddress: [],
        subject: '',
        approvalPerson: [],
        approvalePersonLength: 0,
        CCPersonLength: 0,
        CCPerson: []
      },
      departments: [],
      approvalePerson: null,
      CCPerson: null,
      pageLoading: true,
      innerPageShow: false,
      addCCPersonState: false,
      addPersonState: false,
      pageTextareaState: false,
      fetchData: null,
      fetchDataDepartment: null,
      isNewApprovalPerson: null,
      isNewCCPerson: null,
      areaList: [],
      address: ['440000', '440300'],
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: '提交'
        },
        title: '安排出差'
      },
      vTextarea: {
        placeholder: '出差事由'
      },
      detail: {},
      showArea: false,
      addressIndex: null
    }
  },
  components: {
    HeaderBar,
    PopupPicker,
    Group,
    VDepartment,
    addPerson,
    pageTextarea,
    swipeDelete
  },
  computed: {
    employeeId () {
      return this.$store.state.userInfo.id
    },
    redirect () {
      return encodeURIComponent(this.$route.fullPath)
    }
  },
  created () {
    this.getAara()
    if (!util.isEmpty(this.$store.state.dispatch.overtime)) {
      this.cache = JSON.parse(JSON.stringify(this.$store.state.dispatch.overtime))
    }
    let flag = true
    // 同一个人重叠时间验证
    if (this.$route.params.index === 'new') {
      this.cache.employees.forEach(item => {
        if (item.employeeId === this.$route.params.employeeId) {
          let cacheBeginDate = Date.parse(new Date(item.beginDate + ' ' + item.beginDateTime))
          let cacheEndDate = Date.parse(new Date(item.endDate + ' ' + item.endDateTime))
          let paramsBeginDate = Date.parse(new Date(this.$route.params.beginDate + ' ' + this.$route.params.beginDateTime))
          let paramsEndDate = Date.parse(new Date(this.$route.params.endDate + ' ' + this.$route.params.endDateTime))
          if (cacheBeginDate > paramsBeginDate) {
            if (paramsEndDate > cacheBeginDate) {
              this.$toast('同一个人时间重复，添加失败！')
              flag = false
            }
          }
          if (cacheBeginDate < paramsBeginDate) {
            if (cacheEndDate > paramsBeginDate) {
              this.$toast('同一个人时间重复，添加失败！')
              flag = false
            }
          }
          if (cacheBeginDate === paramsBeginDate || cacheEndDate === paramsEndDate) {
            this.$toast('同一个人时间重复，添加失败！')
            flag = false
          }
        }
      })
    }
    if (flag) {
      // 添加人员
      if (this.$route.params.index === 'new') {
        this.cache.employees.push(this.$route.params)
        this.cache.employees[this.cache.employees.length - 1].index = this.cache.employees.length - 1
      } else {
        this.cache.employees[this.$route.params.index] = this.$route.params
      }
      // 添加默认抄送人
      this.cache.employees.forEach(employeeItem => {
        let count = 0
        this.cache.CCPerson.forEach(CCItem => {
          if (CCItem.employeeId !== employeeItem.employeeId) {
            count++
          }
        })
        if (count === this.cache.CCPerson.length) {
          this.cache.CCPerson.unshift(employeeItem.employee)
          this.cache.CCPersonLength++
          console.log(this.cache.CCPersonLength)
        }
      })
    }
  },
  methods: {
    delEmployeeTime (employee, index) {
      let length = this.cache.employees.length
      this.cache.employees.splice(index, 1)
      let employeeIds = this.cache.employees.map(item => item.employeeId)
      if (employeeIds.indexOf(employee.employeeId) === -1) {
        this.cache.CCPerson.splice(length - index - 1, 1)
      }
    },
    face (url) {
      if (url) {
        return 'background-image: url(' + url + ')'
      } else {
        return null
      }
    },
    getAara () {
      this.$axios.get(this.$appConfig.api.getCity).then(res => {
        this.areaList = res
      })
    },
    leftBtnClick () {
      if (this.innerPageShow) {
        this.innerPageShow = false
        this.headerBar.title = '安排出差'
        this.headerBar.rightBtn.text = '提交'
        // this.$set(this.detail, 'departments', this.cacheDepartment)
      } else if (this.addPersonState) {
        this.addPersonState = false
        this.headerBar.title = '安排出差'
        this.headerBar.rightBtn.text = '提交'
      } else if (this.pageTextareaState) {
        this.pageTextareaState = false
        this.headerBar.title = '安排出差'
        this.headerBar.rightBtn.text = '提交'
      } else {
        this.$store.dispatch('DISPATCH_OVERTIME', null)
        this.$router.push({
          path: '/dispatch'
        })
      }
    },
    rightBtnClick () {
      if (this.innerPageShow) {
        this.innerPageShow = false
        this.headerBar.title = '安排出差'
        this.headerBar.rightBtn.text = '提交'
        this.cache.departments = this.departments
        // this.cache.departments.forEach(item => { item.checked = false })
        this.cache.approvalPerson = []
        this.cache.CCPerson = []
        var arr = this.cache.departments.map(item => item.id)
        this.$axios.get(this.$appConfig.api.searchDefaultApprovalAndCCMan, {
          params: {
            departments: arr.join(','),
            loginMobile: this.$store.state.userInfo.mobile
          }
        }).then((res) => {
          this.cache.approvalPerson = res.approval
          this.cache.approvalePersonLength = res.approval.length
          this.cache.CCPerson = res.ccMan
          this.cache.CCPersonLength = res.ccMan.length
          // 删除不是本项目的人员与时间
          let indexArr = []
          this.cache.employees.forEach((employeeItem, index) => {
            let flag = false
            this.cache.departments.forEach(departmentItem => {
              if (employeeItem.department.id === departmentItem.id) {
                flag = true
              }
            })
            if (!flag) {
              indexArr.push(index)
            }
            let count = 0
            this.cache.CCPerson.forEach(CCItem => {
              if (CCItem.employeeId !== employeeItem.employeeId) {
                count++
              }
            })
            if (count === this.cache.CCPerson.length) {
              this.cache.CCPerson.unshift(employeeItem.employee)
            }
          })

          indexArr.reverse().forEach(item => {
            this.cache.employees.splice(item, 1)
          })
        })
        // 业务事件
      } else if (this.pageTextareaState) {
        this.pageTextareaState = false
        this.headerBar.title = '安排出差'
        this.headerBar.rightBtn.text = '提交'
      } else if (this.addPersonState) {
        if (util.isEmpty(this.approvalePerson)) {
          this.$toast('请选择人员')
          return
        }
        if (this.headerBar.title === '添加审批人') {
          if (this.isNewApprovalPerson === 'new') {
            this.cache.approvalPerson.push(this.approvalePerson)
          } else {
            this.approvalePerson.jobIds = this.cache.approvalPerson[this.isNewApprovalPerson].jobIds
            this.cache.approvalPerson[this.isNewApprovalPerson] = this.approvalePerson
          }
        } else if (this.headerBar.title === '添加抄送人') {
          let flag = true
          this.cache.CCPerson.forEach(item => {
            if (item.employeeId === this.approvalePerson.employeeId) {
              this.$toast('添加抄送人重复，添加失败！')
              flag = false
            }
          })
          if (flag) {
            if (this.isNewCCPerson === 'new') {
              this.cache.CCPerson.push(this.approvalePerson)
            } else {
              this.cache.CCPerson[this.isNewCCPerson] = this.approvalePerson
            }
          }
        }
        this.addPersonState = false
        this.headerBar.title = '安排出差'
        this.headerBar.rightBtn.text = '提交'
      } else {
        this.submit()
      }
    },
    openPageTextarea () {
      this.pageTextareaState = true
      this.headerBar.title = '填写出差事由'
      this.headerBar.rightBtn.text = '确定'
    },
    getTextarea (msg) {
      this.cache.subject = msg
    },
    openDepartment () {
      this.innerPageShow = true
      this.headerBar.title = '选择项目'
      this.headerBar.rightBtn.text = '确定'
    },
    getDepartments (msg) {
      let data = []
      msg.map(item => {
        if (item.checked) {
          data.push(item)
        }
      })
      this.departments = data
    },
    addApprovalPerson (obj, index) {
      this.isNewApprovalPerson = index
      if (!this.validDepartment()) return
      this.addPersonState = true
      this.headerBar.title = '添加审批人'
      this.headerBar.rightBtn.text = '确定'
      let parmas = {
        departments: this.getId(this.cache.departments),
        type: 0,
        jobIds: obj.jobIds
      }
      let q = []
      Object.keys(parmas).forEach((v) => q.push(`${v}=${parmas[v]}`))
      this.fetchData = [this.$appConfig.api.searchEmployee, q.join('&')].join('?')
    },
    addCCPerson (index) {
      this.isNewCCPerson = index
      if (!this.validDepartment()) return
      this.addPersonState = true
      this.headerBar.title = '添加抄送人'
      this.headerBar.rightBtn.text = '确定'
      let parmas = {
        departments: this.getId(this.cache.departments),
        type: 0
      }
      let q = []
      Object.keys(parmas).forEach((v) => q.push(`${v}=${parmas[v]}`))
      this.fetchData = [this.$appConfig.api.searchEmployee, q.join('&')].join('?')
    },
    getId (msg) {
      let data = []
      msg.map(item => {
        data.push(item.id)
      })
      return data
    },
    searchDefaultApprovalAndCCMan () {
      var arr = this.cache.departments.map(item => item.id)
      this.$axios.get(this.$appConfig.api.searchDefaultApprovalAndCCMan, {
        params: {
          departments: arr.join(','),
          loginMobile: this.$store.state.userInfo.mobile
        }
      }).then((res) => {
        console.log(res)
        res.approval.forEach((item, index) => {
          this.cache.approvalPerson[index] = item
        })
        res.ccMan.forEach((item, index) => {
          this.cache.CCPerson[index] = item
        })
      })
    },
    getApprovalPersons (msg) {
      this.approvalePerson = msg
     // this.cache.approvalPerson.push(msg)
    },
    getCCPersons (msg) {
      this.CCPerson = msg
    },
    deletePerson (index) {
      if ((index + 1) > this.cache.approvalePersonLength) {
        this.cache.approvalPerson.splice(index, 1)
      }
    },
    deleteCCPerson (index) {
      console.log(index)
      console.log(this.cache.CCPersonLength)
      if ((index + 1) > this.cache.CCPersonLength) {
        this.cache.CCPerson.splice(index, 1)
      }
    },
    modifyEmployeeTime (item, index) {
      this.$router.push({
        path: '/dispatch/employee-time',
        query: {
          redirect: this.redirect,
          index: index
        }
      })
      this.$store.dispatch('DISPATCH_OVERTIME', this.cache)
    },
    addEmployeeTime () {
      if (!this.validDepartment()) return
      this.$router.push({
        path: '/dispatch/employee-time',
        query: {
          redirect: this.redirect,
          index: 'new'
        }
      })
      this.$store.dispatch('DISPATCH_OVERTIME', this.cache)
    },
    openAddress (item, type) {
      this.showArea = true
      this.address = []
      if (item) {
        this.address.push(item.parentId)
        this.address.push(item.id)
      } else {
        this.address = ['440000', '440400']
      }
      if (arguments.length === 2) {
        this.addressIndex = type
      } else {
        this.addressIndex = null
      }
    },
    addAddress (closeType) {
      this.showArea = false
      let flag = false
      if (!closeType || util.isEmpty(this.address)) return
      this.cache.businessAddress.map(address => {
        if (address.id === this.address[1] && address.parentId === this.address[0]) {
          flag = true
        }
      })
      if (flag) {
        this.address = []
        return
      }
      if (this.addressIndex === null) {
        this.cache.businessAddress.push({
          value: this.$refs.pickerCity.getNameValues(),
          id: this.address[1],
          parentId: this.address[0]
        })
      } else {
        this.cache.businessAddress[this.addressIndex] = {
          value: this.$refs.pickerCity.getNameValues(),
          id: this.address[1],
          parentId: this.address[0]
        }
      }
      this.address = []
    },
    deleteItem (id) {
      this.cache.businessAddress.splice(id, 1)
    },
    getParams () {
      if (this.cache.departments.length < 1) {
        this.$toast('请先选择项目！')
        return false
      }
      if (this.cache.businessAddress.length < 1) {
        this.$toast('请先选择出差地址！')
        return false
      }
      if (this.cache.subject.length < 1) {
        this.$toast('请先选择出差事由！')
        return false
      }
      if (this.cache.employees.length < 1) {
        this.$toast('请先选择人员！')
        return false
      }
      // if (this.cache.approvalPerson.length < 1) {
      //   this.$toast('请先选择审批人！')
      //   return false
      // }
      if (this.cache.CCPerson.length < 1) {
        this.$toast('请先选择抄送人！')
        return false
      }
      let approvalPerson = []
      let approvalPersonEmpty = false
      this.cache.approvalPerson.forEach((p, index) => {
        if (!util.isEmpty(p.employeeId)) {
          approvalPerson.push({
            employeeId: p.employeeId,
            name: p.name,
            level: index + 1
          })
        } else {
          approvalPersonEmpty = true
        }
      })
      if (approvalPersonEmpty) {
        this.$toast('请先选择审批人！')
        return false
      }
      let ccMan = []
      this.cache.CCPerson.forEach((p, index) => {
        if (!util.isEmpty(p.employeeId)) {
          ccMan.push({
            employeeId: p.employeeId,
            name: p.name
          })
        }
      })
      let employees = []
      this.cache.employees.forEach((p, index) => {
        employees.push({
          beginDate: p.beginDate + ' 00:00:00',
          endDate: p.endDate + ' 00:00:00',
          employeeId: p.employeeId,
          beginDateTime: p.beginDateTime,
          endDateTime: p.endDateTime
        })
      })
      let businessAddress = []
      this.cache.businessAddress.forEach((p, index) => {
        businessAddress.push({
          value: p.id
        })
      })
      return {
        department: this.cache.departments,
        businessAddress: businessAddress,
        businessReason: this.cache.subject,
        employees: employees,
        approvalPerson: approvalPerson,
        ccMan: ccMan,
        loginMobile: this.$store.state.userInfo.mobile
      }
    },
    validDepartment () {
      console.log('11')
      if (this.cache.departments.length < 1) {
        this.$toast('请先选择项目！')
        return false
      }
      return true
    },
    submit () {
      let params = this.getParams()
      if (!params) return
      this.$toast({
        msg: '提交中...',
        type: 'loading',
        time: 10000
      })
      this.$axios.post(this.$appConfig.api.businessArrange, params)
        .then((res) => {
          if (res.status === 'fail') {
            this.$toast(res.errorMessage)
          } else {
            this.$toast({
              msg: '提交成功',
              type: 'succes'
            })
            this.cache = {}
            this.$router.push({
              path: '/dispatch'
            })
            this.$store.dispatch('DISPATCH_OVERTIME', null)
          }
        })
    }
  }
}
</script>

