import * as type from './mutations-type'

const mutations = {
  [type.LOADING] (state, data) {
    state.loading = data
  },
  [type.AXIOS] (state, data) {
    state.axios = data
  },
  [type.NETWORK] (state, data) {
    state.network = data
  },
  [type.USERINFO] (state, data) {
    state.userInfo = data
  }
}
export default mutations
