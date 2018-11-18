import * as types from './mutations-type'
const state = {
  cacheList: {
    data: [],
    scroll: 0
  },
  cache: null
}

const actions = {
  UPDATE_CACHELIST_DATA ({commit}, object) {
    commit(types.UPDATA_CACHELIST_DATA, object)
  },
  UPDATE_CACHELIST_SCROLL ({commit}, object) {
    commit(types.UPDATA_CACHELIST_SCROLL, object)
  },
  CLEAN_CACHELIST ({commit}) {
    commit(types.CLEAN_CACHELIST)
  },
  UPDATE_CACHE ({commit}, data) {
    data && data.holidayInfo && data.holidayInfo.sort((a, b) => {
      return a['date'] > b['date'] ? 1 : -1
    })
    commit(types.CACHE, data)
  }
}

const mutations = {
  [types.UPDATA_CACHELIST_DATA] (state, object) {
    state.cacheList.data = state.cacheList.data.concat(object)
  },
  [types.UPDATA_CACHELIST_SCROLL] (state, data) {
    state.cacheList.scroll = data
  },
  [types.CLEAN_CACHELIST] (state) {
    state.cacheList.data = []
    state.cacheList.scroll = 0
  },
  [types.CACHE] (state, data) {
    state.cache = data
  }
}

export default {
  state,
  mutations,
  actions
}
