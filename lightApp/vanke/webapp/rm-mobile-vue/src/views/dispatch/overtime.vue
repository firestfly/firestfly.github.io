<template>
  <div>
    <header-bar :leftBtn="headerBar.leftBtn" :rightBtn="headerBar.rightBtn" :title="headerBar.title"
                @leftBtnClick="back" @rightBtnClick="submit"></header-bar>
    <div class="content">
      <ul class="list mt0">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="openDepartment">
            <div class="list-item-left f16 half">
              项目
            </div>
            <div class="list-item-right gray">
              <span v-show="sessionData.departments.length == 0">请选择</span>
              <div v-for="department in sessionData.departments" class="text-overflow align-item">{{ department.name }}</div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="list-item list-item-touch-active list-angle-right" @click="openOvertimeType">
          <div class="list-item-inner">
            <div class="list-item-left f16">
              加班类型
            </div>
            <div class="list-item-right gray">
              <span v-show="!sessionData.overtimeType.name">请选择</span>
              <span>{{ sessionData.overtimeType.name }}</span>
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active list-angle-right" @click="openWorkJob">
          <div class="list-item-inner">
            <div class="list-item-left f16 half">
              岗位要求
            </div>
            <div class="list-item-right gray">
              <span v-show="sessionData.jobRequirements.length == 0">请选择</span>
              <div v-for="workJob in sessionData.jobRequirements" class="text-overflow align-item">{{ workJob.name }}</div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="list-item list-item-touch-active list-angle-right">
          <div class="list-item-inner" @click="openPageTextarea">
            <div class="list-item-left f16">
              加班事由
            </div>
          </div>
        </li>
        <li class="list-item list-item-touch-active" v-if="sessionData.reason">
          <div class="list-item-inner p-t-0">
            <div class="list-item-left ellipsis gray">
              {{sessionData.reason}}
            </div>
            <div class="list-item-right gray">
            </div>
          </div>
        </li>
      </ul>
      <div>
        <ul class="list m-b-0">
          <li class="list-item">
            <div class="list-item-inner">
              <div class="list-item-body f16">
                人员与时间
              </div>
            </div>
          </li>
          <li class="list-item"
              v-for="(item, index) in sessionData.employees">
            <swipe-delete @delete-item="delEmployeeTime(item, index)">
              <div slot="content" @click="showEmployeeDetail(item, index)" class="list-item">
                <div class="list-item-media">
                  <span class="employee-author" :style="face(item.employee.avatar)"></span>
                </div>
                <div class="list-item-swipe">
                  <div class="list-item-body pl10">
                    <div class="f16"><span>{{ item.employee.name }}</span><span class="gray">（{{ item.employee.workJob }}）</span>
                    </div>
                    <div>
                      <span class="gray f12">{{ item.formatBeginDate }}-{{ item.formatEndDate }} </span>
                      <span class="color-primary f12">{{ item.totalHours }}分钟</span>
                    </div>
                  </div>
                </div>
              </div>
            </swipe-delete>
          </li>
          <li class="list-item">
            <div class="list-item-inner">
              <div class="list-item-body tc gray f16" @click="addEmployeeTime">
                <span class="icon-plus-img"></span>添加人员与时间
              </div>
            </div>
          </li>
        </ul>
        <div class="list-inner gray f12">左划可以删除</div>
        <div class="employee-group px-tb">
          <div class="employee-title px-b">审批人</div>
          <ul class="employee-list step-arrow">
            <li class="" v-for="(person, index) in sessionData.approvalPerson" @click="changeApprovalPerson(person, index)">
              <div class="gray text-overflow pr5">{{ person.workJob || '&nbsp;' }}</div>
              <span class="employee-author" :style="face(person.avatar)"></span>
              {{ person.name || '&nbsp;' }}
            </li>
            <li class="step-arrow-add" v-if="sessionData.approvalPerson.length == 0">
              <span>&nbsp;</span>
              <span class="employee-author add"></span>
              <span>&nbsp;</span>
            </li>
            <!-- <li class="step-arrow-add" @click="addPerson('添加审批人')">
              <span>&nbsp;</span><span class="employee-author add"></span>添加</li> -->
          </ul>
        </div>
        <div class="list-inner gray f12">点击人员头像可以修改</div>
        <div class="employee-group px-tb">
          <div class="employee-title px-b">抄送</div>
          <ul class="employee-list">
            <li class="" v-for="(person, index) in sessionData.ccMan" @click="delCCMan(person, index)">
              <div class="gray text-overflow pr5">{{ person.workJob || '&nbsp;' }}</div>
               <span class="employee-author" :style="face(person.avatar)"></span></span>
               {{ person.name || '&nbsp;' }}
            </li>
            <li class="step-arrow-add" @click="addPerson('添加抄送人')">
              <span>&nbsp;</span>
              <span class="employee-author add"></span>
              <span>&nbsp;</span>
            </li>
          </ul>
        </div>
        <div class="list-inner gray f12">点击人员头像可以删除(只有添加的人员可以删除)</div>
      </div>
    </div>
    <v-department :fetch-data="fetchData" :slots="slots" :multi="isMulti" :employees="employeeId" :show="innerPageShow"
                  @get-departments="getDepartments" @get-only-item="getOneDepartment"></v-department>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getEmployees"></add-person>
    <page-textarea :show="pageTextareaState" @get-textarea="getTextarea"></page-textarea>
  </div>
</template>
<script>
import HeaderBar from '../../components/header.vue'
import EmployeeTime from './employee.vue'
import VDepartment from '../../components/department.vue'
import addPerson from '../../components/addPerson.vue'
import pageTextarea from '../../components/pageTextarea.vue'
import swipeDelete from '../../components/swipeDelete.vue'
import * as util from '../../utils/util'
export default {
  data () {
    return {
      sessionData: {
        departments: [],
        overtimeType: {},
        jobRequirements: [],
        reason: '',
        approvalPerson: [],
        ccMan: [],
        employees: []
      },
      headerBar: {
        leftBtn: {
          text: '返回'
        },
        rightBtn: {
          text: '提交'
        },
        title: '安排加班'
      },
      isMulti: true,
      innerPageShow: false,
      addPersonState: false,
      pageTextareaState: false,
      fetchData: null,
      slots: [],
      approvalPerson: {},
      departments: [],
      overtimeType: {},
      jobRequirements: [],
      reason: '',
      addPersonIndex: null,
      jobIds: ''
    }
  },
  computed: {
    redirect () {
      return encodeURIComponent(this.$route.fullPath)
    },
    employeeId () {
      return this.$store.state.userInfo.id
    },
    jobIds () {
      return this.sessionData.approvalPerson[this.addPersonIndex || 0].jobIds || ''
    }
  },
  created () {
    if (!util.isEmpty(this.$store.state.dispatch.overtime)) {
      this.sessionData = JSON.parse(JSON.stringify(this.$store.state.dispatch.overtime))
    }
    // 添加默认抄送人
    let cacheCCMan = []
    this.sessionData.employees.forEach(employeeItem => {
      let hasOverlap = false
      this.sessionData.ccMan.forEach(CCItem => {
        if (CCItem.employeeId === employeeItem.employee.employeeId) {
          hasOverlap = true
        }
      })
      if (!hasOverlap) {
        let lap2 = false
        cacheCCMan.forEach(cacheItem => {
          if (cacheItem.employeeId === employeeItem.employee.employeeId) {
            lap2 = true
          }
        })
        if (!lap2) {
          let pushCCMan = {}
          pushCCMan.avatar = employeeItem.employee.avatar
          pushCCMan.department = employeeItem.employee.department
          pushCCMan.employeeId = employeeItem.employee.employeeId
          pushCCMan.name = employeeItem.employee.name
          pushCCMan.workJob = employeeItem.employee.workJob
          pushCCMan.canDel = true
          cacheCCMan.push(pushCCMan)
        }
      }
    })
    if (this.sessionData.ccMan) {
      this.sessionData.ccMan = this.sessionData.ccMan.concat(cacheCCMan)
    }
  },
  components: {
    HeaderBar,
    VDepartment,
    addPerson,
    EmployeeTime,
    pageTextarea,
    swipeDelete
  },
  methods: {
    face (url) {
      if (url) {
        return 'background-image: url(' + url + ')'
      } else {
        return null
      }
    },
    changeApprovalPerson (item, index) {
      this.addPersonIndex = index
      this.addPerson('添加审批人')
    },
    delCCMan (item, index) {
      if (item.canDel) {
        this.sessionData.ccMan.splice(index, 1)
      }
    },
    delEmployeeTime (item, index) {
      let delIndex
      let isDel
      this.sessionData.ccMan.forEach((ccManItem, j) => {
        if (ccManItem.employeeId === item.employee.employeeId) {
          delIndex = j
          isDel = true
        }
      })
      this.sessionData.employees.forEach((employeeItem, i) => {
        if (i !== index && employeeItem.employee.iemployeeIdd === item.employee.employeeId) {
          isDel = false
        }
      })
      if (isDel && delIndex) {
        this.sessionData.ccMan.splice(delIndex, 1)
      }
      this.sessionData.employees.splice(index, 1)
    },
    getEmployees (staff) {
      this.approvalPerson = staff
    },
    addEmployeeTime () {
      if (util.isEmpty(this.sessionData.departments)) {
        this.$toast('请选择项目后再添加人员与时间')
        return
      }
      if (util.isEmpty(this.sessionData.jobRequirements)) {
        this.$toast('请选择岗位要求后再添加人员与时间')
        return
      }
      this.$store.dispatch('DISPATCH_OVERTIME', this.sessionData)
      this.$router.push({
        path: 'employee',
        query: {
          redirect: this.redirect,
          index: 'new'
        }
      })
    },
    showEmployeeDetail (data, index) {
      this.$store.dispatch('DISPATCH_OVERTIME', this.sessionData)
      this.$router.push({
        path: 'employee',
        query: {
          redirect: this.redirect,
          index: index
        }
      })
    },
    back () {
      if (this.addPersonState || this.headerBar.title === '选择项目' || this.headerBar.title === '选择岗位要求' || this.headerBar.title === '选择加班类型') {
        this.innerPageShow = false
        this.headerBar.title = '安排加班'
        this.headerBar.rightBtn.text = '提交'
        this.addPersonIndex = null
        this.addPersonState = false
      } else if (this.pageTextareaState) {
        this.pageTextareaState = false
        this.headerBar.title = '安排加班'
        this.headerBar.rightBtn.text = '提交'
      } else {
        this.$store.dispatch('DISPATCH_OVERTIME', null)
        this.$router.push({
          path: '/dispatch',
          name: 'dispatchHome'
        })
      }
    },
    submit () {
      this.headerBar.rightBtn.text = '提交'
      if (this.headerBar.title === '选择项目') {
        this.sessionData.departments = this.departments
        var arr = this.sessionData.departments.map(item => item.id)
        this.$axios.get(this.$appConfig.api.searchDefaultApprovalAndCCMan, {
          params: {
            departments: arr.join(','),
            loginMobile: this.$store.state.userInfo.mobile
          }
        }).then((res) => {
          this.sessionData.approvalPerson = res.approval
          this.sessionData.ccMan = res.ccMan
          let indexArr = []
          this.sessionData.employees.forEach((employeeItem, index) => {
            let flag = false
            this.sessionData.departments.forEach(departmentItem => {
              if (employeeItem.department.id === departmentItem.id) {
                flag = true
              }
            })
            if (!flag) {
              indexArr.push(index)
            }
            let count = 0
            this.sessionData.ccMan.forEach(CCItem => {
              if (CCItem.employeeId !== employeeItem.employeeId) {
                count++
              }
            })
            if (count === this.sessionData.ccMan.length) {
              this.sessionData.ccMan.unshift(employeeItem.employee)
            }
          })

          indexArr.reverse().forEach(item => {
            this.sessionData.employees.splice(item, 1)
          })
        })
        // 业务事件
      } else if (this.headerBar.title === '选择加班类型') {
        this.sessionData.overtimeType = this.overtimeType
        // 业务事件
      } else if (this.headerBar.title === '选择岗位要求') {
        if (JSON.stringify(this.sessionData.jobRequirements) !== JSON.stringify(this.jobRequirements)) {
          this.sessionData.jobRequirements = this.jobRequirements
          this.sessionData.employees = []
        }
        // 业务事件
      } else if (this.headerBar.title === '安排加班') {
        let flag = false
        for (let item in this.sessionData) {
          if (util.isEmpty(this.sessionData[item])) {
            flag = true
            break
          }
        }
        if (flag) {
          this.$toast('请将加班信息填写完整')
          return
        }
        let result = JSON.parse(JSON.stringify(this.sessionData))
        let checkApprovalPerson = false
        result.approvalPerson.forEach(item => {
          if (!item.employeeId && !item.name) {
            checkApprovalPerson = true
          }
        })
        if (checkApprovalPerson) {
          this.$toast('请选择完对应的审批人')
          return
        }
        result.departments = util.pluck(result.departments, 'id')
        result.overtimeType = result.overtimeType.code
        result.jobRequirements = util.pluck(result.jobRequirements, 'id')
        result.loginMobile = this.$store.state.userInfo.mobile
        result.employees.forEach((v) => {
          v.employeeId = v.employee.employeeId
          v.beginDate += ':00'
          v.endDate += ':00'
        })
        result.approvalPerson.forEach((v, index) => {
          v.level = index + 1
        })
        this.$toast({
          type: 'loading',
          msg: '提交中...',
          time: 10000
        })
        this.$axios.post(this.$appConfig.api.overtimeApply, result).then(res => {
          if (res.status === 'success') {
            this.$toast({
              type: 'succes',
              msg: '提交成功',
              time: 3000
            })
            this.$router.push({
              path: '/dispatch',
              name: 'dispatchHome'
            })
            this.$store.dispatch('DISPATCH_OVERTIME', null)
          } else if (res.errorMessage) {
            this.$toast(res.errorMessage)
          }
        })
      } else if (this.addPersonState) {
        let isEmpty = util.isEmpty(this.approvalPerson)
        if (!isEmpty) {
          if (this.headerBar.title === '添加审批人') {
            this.approvalPerson.jobIds = this.sessionData.approvalPerson[this.addPersonIndex].jobIds
            this.sessionData.approvalPerson[this.addPersonIndex] = this.approvalPerson
          } else if (this.headerBar.title === '添加抄送人') {
            if (this.addPersonIndex !== null) {
              this.approvalPerson.canDel = null
              this.sessionData.ccMan[this.addPersonIndex] = this.approvalPerson
            } else {
              let hasOverlap = this.sessionData.ccMan.find(v => {
                return v.employeeId === this.approvalPerson.employeeId
              })
              if (!hasOverlap) {
                this.approvalPerson.canDel = true
                this.sessionData.ccMan.push(this.approvalPerson)
              } else {
                this.$toast('添加抄送人重复')
              }
            }
          }
          this.addPersonIndex = null
        }
        this.addPersonState = false
        this.headerBar.rightBtn.text = '提交'
        // 业务事件
      } else if (this.pageTextareaState) {
        this.pageTextareaState = false
        this.headerBar.rightBtn.text = '提交'
        this.sessionData.reason = this.reason
      }
      this.innerPageShow = false
      this.headerBar.title = '安排加班'
      this.isMulti = true
    },
    openOvertimeType () {
      this.fetchData = null
      this.slots = util.temporaryType()
      this.innerPageShow = true
      this.headerBar.title = '选择加班类型'
      this.headerBar.rightBtn.text = '确定'
      this.isMulti = false
    },
    openWorkJob () {
      this.slots = []
      this.innerPageShow = true
      this.fetchData = this.$appConfig.api.getWorkJobs
      this.headerBar.title = '选择岗位要求'
      this.headerBar.rightBtn.text = '确定'
    },
    openPageTextarea () {
      this.pageTextareaState = true
      this.headerBar.title = '填写加班事由'
      this.headerBar.rightBtn.text = '确定'
    },
    getTextarea (msg) {
      this.reason = msg
    },
    openDepartment () {
      this.fetchData = null
      this.slots = []
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
      if (this.headerBar.title === '选择加班类型') {
        this.overtimeType = data
      } else if (this.headerBar.title === '选择岗位要求') {
        this.jobRequirements = data
      } else if (this.headerBar.title === '选择项目') {
        this.departments = data
      }
    },
    getOneDepartment (msg) {
      this.overtimeType = msg
    },
    addPerson (title) {
      if (util.isEmpty(this.sessionData.departments)) {
        this.$toast('请先选择项目')
        return
      }
      this.addPersonState = true
      this.headerBar.title = title
      this.headerBar.rightBtn.text = '确定'
      let parmas = {
        departments: util.pluck(this.sessionData.departments, 'id'),
        type: 0,
        jobIds: this.jobIds
      }
      let q = []
      Object.keys(parmas).forEach((v) => q.push(`${v}=${parmas[v]}`))
      this.fetchData = [this.$appConfig.api.searchEmployee, q.join('&')].join('?')
    }
  }
}

</script>
