import axios from 'axios'
import routeData from '../route-data/'
const {location} = window
const getPageKey = () => {
  return location.href
}

export default {
  mixins: [routeData],
  routeData () {
    return {
      complete: false, // 数据是否加载完成
      loading: false, // 是否在请求中
      page: 1, // 当前请求的页数
      list: [] // 列表的数据
    }
  },
  mounted () {
    this.loading = false
  },
  created () {
    if (this.$route.params.freshen) { // 强制刷新
      this.complete = false
      this.loading = false
      this.page = 1
      this.list = []
      this.overload()
    } else {
      if (getPageKey() !== this.list.key) { // 页面前进
        if (this.page === 1) { // 首次访问组件
          this.pullList()
          this.list.key = getPageKey()
        } else {
          this.overload()
        }
      } else {
        this.loading = false // 防止路由切换时，没有执行回调时引发的bug
      }
    }
  },
  watch: {
    $route () {
      if (getPageKey() !== this.list.key) { // 页面前进，则重置数据
        this.overload()
      }
    }
  },
  methods: {
    overload () {
      Object.assign(this.$data, this.$options.routeData())
      this.$nextTick(() => {
        this.list.key = getPageKey()
        this.pullList()
      })
    },
    pullList () {
      if (this.complete || this.loading) return
      this.loading = true
      var {url, data = {}} = this._pullList()
      axios.get(url, data).then(res => {
        if (res.data.length > 0) {
          // this.list = this.list.concat(res.data)
          res.data.forEach((item) => this.list.push(item))
          if (this.list.length === res.recordsTotal) {
            this.complete = true
          }
        } else {
          this.complete = true
        }
        this.page++
        this.loading = false // 请求完成
      })
    },
    seeing () {
      if (this.page === 1) return // 防止偶然性的第一个重复请求的bug
      this.pullList()
    }
  }
}
