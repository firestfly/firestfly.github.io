<template>
  <transition name="fade-left">
    <div v-show="show" class="model-datetime">
      <div class="model-week">
        <div class="flexbox-mod">
          <span class="flex" v-for="(a, $index) in weeky" :key="$index">{{a}}</span>
        </div>
      </div>
      <div class="datatime-loading">
        <spinner show="true"></spinner>
      </div>

      <div class="datetime-list" ref="datetimeBody">
        <div class="div">
          <div class="data-body" v-for="(item, monthIndex) in datas" :key="monthIndex">
            <div class="data-title">{{buildMonth(item.month)}}</div>
            <div class="flexbox-mod">
                <span :data-pass="dataPass(day)" v-for="(day, index) in item.date" :key="index"
                      :class="{
                      'start': day.status == 'start',
                      'start-active': day.status == 'start-active',
                      'end': day.status == 'end',
                      'start-end': day.status == 'start-end',
                      'active': day.status == 'active',
                    }" @click="picker(monthIndex, index, day)">
                    {{day && day.text}}
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import BScroll from 'better-scroll'
import Spinner from './Spinner'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      weeky: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      datas: [],
      result: [],
      arrayIndex: null,
      initNum: 6,
      reduce: 0,
      scrollY: null,
      repeatClick: 0
    }
  },
  components: {
    Spinner
  },
  watch: {
    'show' (v) {
      if (this.show && this.datas.length === 0) {
        setTimeout(() => {
          this.renderData(this.initNum)
          this.$nextTick(() => {
            this._initScroll() // 初始化scroll
          })
        }, 300)
      }
    }
  },
  methods: {
    _initScroll () {
      this.datetimeBody = new BScroll(this.$refs.datetimeBody, {
        probeType: 3,
        click: true
      })
      // 监控滚动事件
      this.datetimeBody.on('touchend', (pos) => {
        if (pos.y > 60) {
          setTimeout(() => {
            this.reduce--
            if (this.reduce < -6) return
            this.update(this.reduce)
            this.$nextTick(() => {
              this.datetimeBody.refresh()
            })
          }, 300)
        }
      })
    },
    update (num) {
      let arr = []
      let time = this.updateMonth(num)
      let year = time.getFullYear()
      let month = time.getMonth()
      let curFirstDay = time.getDay()
      let lastDay = new Date(year, month + 1, 0).getDate()
      for (let i = curFirstDay; i > 0; i--) {
        arr.push({
          text: '',
          time: null,
          status: ''
        })
      }
      for (let k = 0; k < lastDay; k++) {
        let cName = ''
        if (new Date() > new Date(year, month, k + 1)) {
          cName = 'data-pass'
        }
        arr.push({
          text: k + 1,
          time: new Date(year, month, k + 1),
          status: '',
          pass: cName
        })
      }
      if (num < 0) {
        this.datas.unshift({
          month: time,
          date: arr
        })
      } else {
        this.datas.push({
          month: time,
          date: arr
        })
      }
    },
    updateMonth (id) {
      let year = new Date().getFullYear()
      let month = new Date().getMonth() + id
      return new Date(year, month)
    },
    buildMonth (item) {
      return item.getFullYear() + '年' + (item.getMonth() + 1) + '月'
    },
    renderData (n) {
      for (let i = 0; i <= n; i++) {
        this.update(i)
      }
    },
    dataPass (item) {
      if (item && item.pass && item.pass === 'data-pass') {
        return true
      } else {
        return null
      }
    },
    picker (monthIndex, index, item) {
      if (!item || !item.time) return
      if ((Date.now() - this.repeatClick) < 350) return
      this.repeatClick = Date.now()
      if (this.result.length === 0) {
        this.setStart(monthIndex, index, item)
      } else if (this.result.length === 1) {
        if (item.time === this.result[0]) {
          // 开始结束日期属于同一天
          item.status = 'start-end'
          this.result.push(item.time)
          this.$emit('pickerdate', this.result)
        } else if (this.result[0] > item.time) {
          // 结束日期小于开始日期
          this.datas[this.arrayIndex.month].date[this.arrayIndex.index].status = ''
          this.setStart(monthIndex, index, item)
        } else {
          // 选择多天
          item.status = 'end'
          let flag = false
          for (let i = this.arrayIndex.month; i <= monthIndex; i++) {
            for (let d = 0; d < this.datas[i].date.length; d++) {
              let activeIndex = this.datas[i].date[d]
              if (activeIndex.status === 'start' || activeIndex.status === 'end') {
                if (activeIndex.status === 'start') {
                  activeIndex.status = 'start-active'
                }
                flag = !flag
              }
              if (flag) {
                if (activeIndex.text && activeIndex.status !== 'start' && activeIndex.status !== 'end' && activeIndex.status !== 'start-active') {
                  activeIndex.status = 'active'
                }
              }
            }
          }
          this.result.push(item.time)
          this.$emit('pickerdate', this.result)
        }
      } else {
        this.result = []
        this.result[0] = item.time
        this.datas.forEach(function (object) {
          for (let f = 0; f < object.date.length; f++) {
            object.date[f].status = ''
          }
        })
        this.setStart(monthIndex, index, item)
      }
    },
    setStart (m, index, item) {
      item.status = 'start'
      this.result[0] = item.time
      this.arrayIndex = {
        month: m,
        index: index
      }
    }
  }
}

</script>
<style lang="scss" scoped>
  @import '../assets/scss/Common/_variables.scss';

  .fade-left-enter {
    transform: translate(100%, 0);
    opacity: 0;
  }

  .fade-left-leave-active {
    transform: translate(100%, 0);
    opacity: 0;
  }

  .datatime-loading {
    position: absolute;
    top: rem(80px);
    left: 0;
    width: 100%;
    height: 40px;
  }

  .model-datetime {
    transition: .2s ease-in-out all;
    position: fixed;
    left: 0;
    top: rem($header-height);
    overflow: auto;
    width: 100%;
    bottom: 0;
    background: #fff;
    z-index: 4;
  }

  .model-week {
    line-height: rem(80px);
    height: rem(80px);
    background-color: #f2f2f2;
    margin: 0;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 10;
  }

  .flexbox-mod {
    text-align: center;
    font-size: 14px;
    overflow: hidden;
  }

  // .flexbox-mod span:first-child, .flexbox-mod span:last-child {
  //   color: #f60;
  // }

  .flexbox-mod span {
    float: left;
    width: 14.25%;
    height: 36px;
    display: inline-block;
    margin-bottom: 5px;
    &.start,&.start-active, &.end, &.start-end {
      background-color: $primaryBg;
      color: #fff;
      border-radius: 4px 0 0 4px;
      position: relative;
    }
    &.start:before{
      content: '请选择结束日期';
      position: absolute;
      top: -30px;
      background-color: rgba(0,0,0,.7);
      padding:2px;
      line-height: 20px;
      border-radius: 2px;
      font-size: 12px;
      width: 100px;
      left: 50%;
      margin-left: -50px;
    }
    &.start:after{
      content: "";
      position: absolute;
      top: -6px;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid rgba(0,0,0,.7);
      left: 50%;
      margin-left: -2px;
    }
    &.end {
      border-radius: 0px 4px 4px 0;
    }
    &.start-end {
      border-radius: 4px;
    }
    &.active {
      background-color: #C9EFC8;
    }
    &:nth-child(7n), &:nth-child(7n+1) {
      color: #f60;
    }
    &.cur {
      background-color: $primaryBg;
      color: #fff !important;
    }
    &[data-pass] {
      opacity: .4 !important;
    }
  }

  .flexbox-mod .flex.cur:first-child {
    border-radius: 3px 0 0 3px;
  }

  .data-body .flexbox-mod {
    text-align: center;
    margin: 10px 0;
    line-height: 36px;
  }

  .datetime-list {
    transition: all .2s linear;
    position: absolute;
    // top: rem($header-height);
    top: rem(80px);
    bottom: 0;
    width: 100%;
    left: 0;
    z-index: 2;
    > div {
      background-color: #fff;
      z-index: 3;
      position: relative;
    }
    .data-body {
      .data-title {
        line-height: 30px;
        text-align: center;
        font-size: 16px;
        border-top: 1px solid #ddd;
        font-weight: bold;
      }
      &:first-child .data-title {
        border-top: none;
      }
    }
  }
</style>
