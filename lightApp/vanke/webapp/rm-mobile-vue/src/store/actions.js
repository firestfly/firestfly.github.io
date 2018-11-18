import * as type from './mutations-type'

const actions = {
  UPDATE_USERINFO ({commit}, data) {
    commit(type.USERINFO, data)
  },
  UPDATE_AXIOS ({commit}, data) {
    commit(type.AXIOS, data)
  },
  UPDATE_LOADING ({commit}, data) {
    commit(type.LOADING, data)
  },
  UPDATE_NETWORK ({commit}, data) {
    commit(type.NETWORK, data)
  }
}
export default actions
