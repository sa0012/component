<template>
  <div class="countdown">
    <count-down :timestamp="timestamp" />
    <timer-count :timestamp="timestamp" />
    <button @click="startTime">点击倒计时开始</button>
  </div>
</template>

<script>
import CountDown from '@/components/countdown'
import TimerCount from '@/components/countdown/timer'
export default {
  name: 'countdown',
  data () {
    return {
      timestamp: 0
    }
  },

  methods: {
    startTime () {
      this.timestamp = 10000
    }
  },

  components: {
    CountDown,
    TimerCount
  }
}
</script>

<style lang="scss" scoped>
.countdown {
  button {
    padding: 5px;
    outline: none;
    -webkit-appearance: none;
    border: none;
    background: green;
    color: #fff;
    text-align: center;
    line-height: 1;
  }
}
</style>