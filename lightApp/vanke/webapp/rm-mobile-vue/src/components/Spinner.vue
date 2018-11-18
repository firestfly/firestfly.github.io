<template>
  <transition>
    <div class="loading-svg" v-show="show">
      <!-- <svg id="load" x="0px" y="0px" viewBox="0 0 150 150">
        <circle id="loading-inner" cx="75" cy="75" r="60"/>
      </svg> -->
      <svg class="spinner" :class="{ show: show }" v-show="show" width="28px" height="28px" viewBox="0 0 44 44">
        <circle class="path" fill="none" stroke-width="3" stroke-linecap="round" cx="22" cy="22" r="20"></circle>
      </svg>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['show']
}
</script>

<style lang="scss">
  .loading-svg {
    text-align: center;
    padding: 10px 0;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: 58px;
  }

  $offset: 126;
  $duration: 1.4s;
  .spinner {
    transition: opacity .15s ease;
    animation: rotator $duration linear infinite;
    animation-play-state: paused;
    margin: 0 auto;
    &.show {
      animation-play-state: running
    }

    &.v-enter, &.v-leave-active {
      opacity: 0;
    }

    &.v-enter-active, &.v-leave {
      opacity: 1;
    }
  }

  @keyframes rotator {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  .spinner .path {
    stroke: #777;
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: dash $duration ease-in-out infinite;
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: $offset;
    }
    50% {
      stroke-dashoffset: ($offset/2) transform rotate(135deg);
    }
    100% {
      stroke-dashoffset: $offset transform rotate(450deg);
    }
  }
</style>
