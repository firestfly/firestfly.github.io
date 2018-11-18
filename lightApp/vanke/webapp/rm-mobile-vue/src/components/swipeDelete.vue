<template>
  <div class="swipe-delete">
    <div class="swipe-del" @click="deleteItem">{{ buttonText }}</div>
    <div :class="swipeLeft ? 'swipe-content moved' : 'swipe-content'" @touchstart="touchStart($event)"
         @touchmove="touchMove($event)">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'delete',
  data () {
    return {
      dontDel: this.dontdel,
      swipeLeft: false,
      touchStart (e) {
        this.startX = e.changedTouches[0].pageX
        this.startY = e.changedTouches[0].pageY
      },
      touchMove (e) {
        if (this.dontDel) return
        // 获取滑动屏幕时的X,Y
        let endX = e.changedTouches[0].pageX
        let endY = e.changedTouches[0].pageY
        // 获取滑动距离
        let distanceX = endX - this.startX
        let distanceY = endY - this.startY
        // 判断滑动方向
        if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {
          this.swipeLeft = false
        } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) {
          this.swipeLeft = true
        }
      }
    }
  },
  props: {
    buttonText: {
      type: String,
      default: '删除'
    },
    dontdel: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleteItem () {
      this.$emit('delete-item')
      this.swipeLeft = false
    }
  }
}

</script>

<style lang="scss">
  $del-btn-width: 60px;
  .swipe-delete {
    flex: 1;
    position: relative
  }

  .swipe-delete .swipe-content {
    background: white;
    transition: .2s linear;
    z-index: 2;
    position: relative;
  }

  .swipe-delete .swipe-content.moved {
    transform: translateX(-$del-btn-width);
  }

  .swipe-del {
    background: #f00;
    color: #fff;
    position: absolute;
    right: 1px;
    top: 1px;
    bottom: 1px;
    width: $del-btn-width;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
