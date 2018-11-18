<template>
  <div class="">
    <!-- 审批人 -->
    <div class="employee-group px-tb">
      <div class="employee-title px-b">审批人</div>
      <ul class="employee-list">
        <li v-for="(item, index) in ApprovalEmployees.approval" :key="index"  @click="addEmploye(index, item, 'approval')">
          <div class="text-overflow gray pr5">{{approvalJob[index]}}</div>
          <span class="employee-author" :class="{'add': item.name == null}" :style="face(item.avatar)"></span>{{item.name || '&nbsp;'}}
        </li>
      </ul>
    </div>
    <!-- 抄送人 -->
    <div class="employee-group px-tb">
      <div class="employee-title px-b">抄送人</div>
      <ul class="employee-list">
        <li v-for="(item, index) in ApprovalEmployees.ccMan" :key="index" @click="addEmploye(index, item, 'ccMan')">
          <div class="text-overflow gray pr5">{{ccManJob || '&nbsp;'}}</div>
          <span class="employee-author" :class="{'add': item.name == null}" :style="face(item.avatar)"></span>{{item.name || '&nbsp;'}}
        </li>
      </ul>
    </div>
    <add-person :fetch-data="fetchData" :show="addPersonState" @getEmployees="getApprovalPersons"></add-person>
  </div>
</template>

<script>
import addPerson from './addPerson.vue'
import * as util from '../utils/util'
export default {
  props: {
    openMask: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addPersonState: false,
      addApprovalIndex: null,
      addApprovalEmployeeType: null,
      userInfo: null,
      ApprovalEmployees: {},
      approvalJob: [],
      ccManJob: null,
      fetchData: null
    }
  },
  computed: {
    addPersonState () {
      if (this.openMask) {
        return this.openMask
      }
    }
  },
  created () {
    this.userInfo = this.$store.state.userInfo
    if (this.userInfo.jobName && this.userInfo.jobName.indexOf('系统负责人') > -1) {
      this.approvalJob = ['合伙人', '管理中心总经理']
      this.ccManJob = '管理中心HRBP'
    } else {
      this.approvalJob = ['直属上级', '合伙人']
      this.ccManJob = '人力资源专员'
    }
    this.getDefaultApprovalAndCCMan()
  },
  components: {
    addPerson
  },
  methods: {
    face (url) {
      if (url) {
        return 'background-image: url(' + url + ')'
      } else {
        return null
      }
    },
    getDefaultApprovalAndCCMan () {
      setTimeout(() => {
        this.$axios.get(this.$appConfig.api.searchHolidayApprovalAndCCMan, {
          params: {
            departments: this.userInfo.departmentId,
            loginMobile: this.userInfo.mobile
          }
        })
        .then((res) => {
          this.ApprovalEmployees = res
        })
      }, 200)
    },
    getApprovalPersons (data) {
      if (!util.isEmpty(data)) {
        this.addPersonState = false
        let selectedEmploye = {
          avatar: data.avatarUrl,
          employeeId: data.employeeId,
          workJob: data.jobName,
          name: data.name
        }
        this.$emit('openAddApprovalPage', false)
        if (this.addApprovalEmployeeType === 'ccMan') {
          this.ApprovalEmployees.ccMan[this.addApprovalIndex] = selectedEmploye
        } else {
          this.ApprovalEmployees.approval[this.addApprovalIndex] = selectedEmploye
        }
      }
      // this.addPersonState = false
    },
    addEmploye (id, item, type) {
      if (item.department) {
        this.$toast('默认人员不可修改')
        return false
      }
      this.$emit('openAddApprovalPage', true)
      this.addPersonState = true
      this.addApprovalIndex = id
      this.addApprovalEmployeeType = type
      this.fetchData = this.$appConfig.api.searchLeaders + '?departmentId=' + this.userInfo.departmentId
    }
  }
}
</script>