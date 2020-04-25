<template>
  <div class="countdown">
    <count-down :timestamp="timestamp" />
    <button @click="startTime">点击倒计时开始</button>
  </div>
</template>

<script>
import CountDown from '@/components/countdown'
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
    CountDown
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