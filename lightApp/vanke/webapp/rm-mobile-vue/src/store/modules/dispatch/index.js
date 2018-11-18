import * as types from './mutations-type'

const state = {
  overtime: {}
}

const actions = {
  DISPATCH_OVERTIME ({commit}, object) {
    commit(types.DISPATCH_OVERTIME, object)
  },
  DISPATCH_OVERTIME_DELETE_EMPLOYEE ({commit}, index) {
    commit(types.DISPATCH_OVERTIME_DELETE_EMPLOYEE, index)
  }
}

const mutations = {
  [types.DISPATCH_OVERTIME] (state, object) {
    state.overtime = object
  },
  [types.DISPATCH_OVERTIME_DELETE_EMPLOYEE] (state, index) {
    state.overtime.employees.splice(index, 1)
  }
}
const getters = {
  getDispatchDetailCache (state) {
    return state.overtime
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
