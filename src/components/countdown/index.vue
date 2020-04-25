<template>
  <div id="countdown" class="countdownHolder">
    <div class="position">
      <span class="digit">{{ timeStamps.hourLeft }}</span>
      <span class="digit">{{ timeStamps.hourRight }}</span>
    </div>
    <div class="countDiv"></div>
    <div class="position">
      <span class="digit">{{ timeStamps.minutesLeft }}</span>
      <span class="digit">{{ timeStamps.minutesRight }}</span>
    </div>
    <div class="countDiv"></div>
    <div class="position">
      <span class="digit">{{ timeStamps.secondsLeft }}</span>
      <span class="digit">{{ timeStamps.secondsRight }}</span>
    </div>
    <!-- {{ countTime }} -->
  </div>
</template>

<script>
const RAF = {
  intervalTimer: null,
  timeoutTimer: null,
  setTimeout (cb, interval) { // 实现setTimeout功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.timeoutTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        cb()
        cancelAnimationFrame(this.timeoutTimer)
      }
    }
    this.timeoutTimer = requestAnimationFrame(loop)
    return this.timeoutTimer
  },
  clearTimeout () {
    cancelAnimationFrame(this.timeoutTimer)
  },
  setInterval (cb, interval) { // 实现setInterval功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.intervalTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        stime = now()
        etime = stime
        cb()
      }
    }
    this.intervalTimer = requestAnimationFrame(loop)
    return this.intervalTimer
  },
  clearInterval () {
    cancelAnimationFrame(this.intervalTimer)
  }
}
export default {
  name: 'timeStamps',
  props: {
    timestamp: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: ''
    }
  },

  data () {
    return {
      timeStamps: {
        hourLeft: 0,
        hourRight: 0,
        minutesLeft: 0,
        minutesRight: 0,
        secondsLeft: 0,
        secondsRight: 0
      },
      timer: null,
      firstCount: true,
      remainTimestamp: 0,
      then: 0
    }
  },
  activated () {
    this.timer = RAF.setInterval(this.animation, 1000)
  },
  deactivated () {
    this.then = Date.now()
  },
  methods: {
     // 时间滚动函数
    countDown (timeStamp) {
      var total = Math.ceil(timeStamp / 1000)
      if (total >= 0) {
        var s = (total % 60) < 10 ? ('0' + total % 60) : total % 60
        var h = total / 3600 < 10 ? ('0' + parseInt(total / 3600)) : parseInt(total / 3600)
        var m = (total - h * 3600) / 60 < 10 ? ('0' + parseInt((total - h * 3600) / 60)) : parseInt((total - h * 3600) / 60)
        this.timeStamps.hourLeft = Math.floor(h / 10)
        this.timeStamps.hourRight = h % 10
        this.timeStamps.minutesLeft = Math.floor(m / 10)
        this.timeStamps.minutesRight = m % 10
        this.timeStamps.secondsLeft = Math.floor(s / 10)
        this.timeStamps.secondsRight = s % 10
        total--
        if (total < 0) {
          RAF.clearInterval(this.timer)
        }
      }
    },
    animation (tms = Date.now()) {
      if (this.remainTimestamp > 0 && this.then) {
        this.remainTimestamp -= (tms - this.then) // 减去当前与上一次执行的间隔
        this.then = tms // 记录本次执行的时间
        this.countDown(this.remainTimestamp)
      } else {
        RAF.clearInterval(this.timer)
      }
    }
  },
  watch: {
    timestamp: {
      handler (newVal) {
        console.log(newVal, 'newVal')
        this.remainTimestamp = newVal
        this.then = Date.now()
        this.countDown(newVal)
        this.timer = RAF.setInterval(this.animation, 1000)
      },
      immediate: true
    }
  },

  destored () {
    RAF.clearInterval(this.timer)
  }
}
</script>


<style lang="scss" scoped>
$theme_color: #5373C6;
/*倒计时样式*/
.countdownHolder {
  margin: 0 auto;
  font: 20px/1.5 'Open Sans Condensed', sans-serif;
  text-align: center;
  letter-spacing: -3px;
}

.position {
  display: inline-block;
  overflow: hidden;
  position: relative;
  background-color: $theme_color;
  border-radius: 2px;
  padding: 0 5px;
}

.digit {
  text-align: center;
  color: #fff;
  letter-spacing: -1px;
}

.countDiv {
  display: inline-block;
  width: 16px;
  height: 1.6em;
  position: relative;
}

.countDiv:before,
.countDiv:after {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: $theme_color;
  border-radius: 50%;
  left: 50%;
  margin-left: -3px;
  top: 0.5em;
  content: '';
}

.countDiv:after {
  top: 0.9em;
}
</style>

    