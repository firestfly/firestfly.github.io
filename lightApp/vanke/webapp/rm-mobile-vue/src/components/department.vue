<template>
  <transition name="fade-left">
    <div v-show="show" class="model-inner-page">
      <div class="content">
        <spinner :show="loading"></spinner>
        <ul class="list mt0" v-show="!loading">
          <li v-for="(item, index) in list" :key="item.id" class="list-item" @click="select(item, index)">
            <div class="list-item-inner">{{item.name}}
              <div class="list-item-right"><span class="label-circle" :class="{'on': item.checked}"></span></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
import * as util from '../utils/util'
import Spinner from './Spinner.vue'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    multi: {
      type: Boolean,
      default: false
    },
    employees: Number,
    slots: Array,
    fetchData: String
  },
  data () {
    return {
      list: {},
      loading: true,
      currentIndex: null,
      cache: null,
      url: null
    }
  },
  components: {
    Spinner
  },
  watch: {
    show (type) {
      if (type && util.isEmpty(this.slots)) {
        this.loading = true
        let url_ = null
        if (this.fetchData) {
          url_ = this.fetchData
        } else {
          url_ = this.$appConfig.api.getDepartment + '?employeeId=' + this.employees
        }
        if (this.url === url_) {
          this.list = this.cache
          this.loading = false
        } else {
          setTimeout(() => {
            this.$axios.get(url_)
            .then(res => {
              this.url = url_
              this.cache = res
              this.list = res
              this.loading = false
            })
          }, 600)
        }
      } else {
        this.list = this.slots
        this.loading = false
      }
    }
  },
  methods: {
    select (item, index) {
      if (this.multi) {
        // 多选
        if (item.checked) {
          this.$set(item, 'checked', false)
        } else {
          this.$set(item, 'checked', true)
        }
        this.$emit('get-departments', this.list)
      } else {
        // 单选择
        if (this.currentIndex === null) {
          this.currentIndex = index
          this.$set(item, 'checked', true)
        } else {
          this.$set(this.list[this.currentIndex], 'checked', false)
          this.$set(item, 'checked', true)
          this.currentIndex = index
        }
        this.$emit('get-one-department', this.list, index)
        this.$emit('get-only-item', item)
      }
    }
  }
}

</script>
<style lang="scss">
  @import '../assets/scss/Common/_variables.scss';

  .label-circle {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #ddd;
    border-radius: 100%;
    &.on {
      border-color: $themes-color;
      position: relative;
      &:after {
        position: absolute;
        content: '';
        left: 3px;
        top: 3px;
        width: 12px;
        height: 12px;
        background-color: $themes-color;
        border-radius: 100%;
      }
    }
  }
</style>
