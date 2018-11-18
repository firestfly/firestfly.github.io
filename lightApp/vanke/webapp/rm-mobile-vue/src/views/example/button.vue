<template>
  <div class="inner-panel">
    <button class="ev-btn ev-btn--defualt">
      btn-defualt
    </button>
    <a href="javascript:;" class="ev-btn ev-btn--defualt disabled">btn-defualt disabled</a>
    <button class="ev-btn ev-btn--warn">
      ev-btn--warn
    </button>
    <a href="javascript:;" class="ev-btn ev-btn--warn disabled">ev-btn--warn disabled</a>
    <div class="flexbox">
      <div class="flex">
        <div class="inner">
          <span class="ev-btn ev-btn--primary">确认</span>
        </div>
      </div>
      <div class="flex">
        <div class="inner">
          <span class="ev-btn ev-btn--primary disabled">取消</span>
        </div>
      </div>
    </div>
    <button class="ev-btn ev-btn--primary ev-btn-small">
      btn-defualt
    </button>
    <a href="javascript:;" class="ev-btn ev-btn--warn ev-btn-small disabled">btn-defualt disabled</a>

    <button class="ev-btn ev-btn--primary">
      ev-btn--primary
    </button>
    <a href="javascript:;" class="ev-btn ev-btn-plain--warn">ev-btn-plain--warn</a>
    <a href="javascript:;" class="ev-btn ev-btn-plain--primary">ev-btn-plain--primary</a>
    <popup-picker class="rm-datetime" :title="'每日工作时间'" @on-shadow-change="kkk"  @on-change="onChange" :data="daytimeList" v-model="daytime"
                  :placeholder="'请选择'"></popup-picker>
    <div class="picker-model" v-if="pickerState">              
      <picker :slots="slots" @change="onValuesChange" showToolbar="true" rotate-effect :visible-item-count="7">
        <!-- Toolbar items -->
        <button>确定</button>
        <button>取消</button>
      </picker>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .inner-panel .ev-btn {
    margin-bottom: 15px;
  }
</style>
<script>
import Picker from 'mint-picker'
import { Datetime, Group, PopupPicker } from 'vux'
let today = new Date()
let years = [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1]
let month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
let day = []
for (let i = 1; i < 32; i++) {
  day.push(i)
}
let defaultIndex = {
  year: 1,
  month: today.getMonth(),
  day: today.getDate()
}
export default {
  data () {
    return {
      daytime: ['', '', '', '', '', '', ''],
      daytimeList: [],
      pickerState: false,
      slots: [
        {
          flex: 3,
          values: years,
          defaultIndex: defaultIndex.year,
          className: 'slot',
          textAlign: 'right'
        }, {
          flex: 2,
          values: month,
          defaultIndex: defaultIndex.month,
          className: 'slot2',
          textAlign: 'right'
        }, {
          flex: 2,
          values: day,
          defaultIndex: defaultIndex.day,
          className: 'slot3',
          textAlign: 'right'
        }, {
          divider: true,
          content: '——',
          className: 'slot4'
        }, {
          flex: 3,
          values: years,
          defaultIndex: defaultIndex.year,
          className: 'slot5',
          textAlign: 'right'
        }, {
          flex: 2,
          values: month,
          defaultIndex: defaultIndex.month,
          className: 'slot6',
          textAlign: 'right'
        }, {
          flex: 2,
          values: day,
          defaultIndex: defaultIndex.day,
          className: 'slot7',
          textAlign: 'right'
        }
      ]
    }
  },
  components: {
    Datetime,
    Group,
    PopupPicker,
    Picker
  },
  methods: {
    getSlot (c) {
      console.log(c)
    },
    onChange (v) {
      console.log(v)
    },
    kkk (c, index, k) {
      console.log(c, index, k)
    },
    onValuesChange (picker, values) {
      console.log(picker.getSlotValue())
      // if (values[0] > values[1]) {
      //   picker.setSlotValue(1, values[0])
      // }
    }
  },
  mounted () {
    let hour = []
    let minute = []
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        i = '0' + i
      }
      hour.push(i)
    }
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        i = '0' + i
      }
      minute.push(i)
    }
    this.daytimeList.push(['2013', '2014'])
    this.daytimeList.push(hour)
    this.daytimeList.push(minute)
    this.daytimeList.push(['----'])
    this.daytimeList.push(['2013', '2014'])
    this.daytimeList.push(hour)
    this.daytimeList.push(minute)
  }
}
</script>
