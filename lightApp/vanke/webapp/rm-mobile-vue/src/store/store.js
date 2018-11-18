import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import leave from './modules/leave'
import dispatch from './modules/dispatch/index.js'

Vue.use(Vuex)
const state = {
  loading: false,
  axios: false, //  防止 axios 重复请求
  network: false,
  userInfo: null
}
const getters = {
  getLoading (state) {
    return state.loading
  }
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  getters,
  mutations,
  modules: {
    leave,
    dispatch
  }
})
