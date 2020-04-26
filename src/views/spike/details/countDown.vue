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
  </div>
</template>

<script>
import Worker from '@/components/countdown/timer.worker.js'
export default {
  name: 'timeStamps',
  props: {
    currentSelect: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: 0
    },
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
      // 当前时间戳
      remainTimestamp: 0
    }
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
        // 记录本次执行的时间
        total--
        if (total < 0) {
          this.$emit('currentIndex', this.currentSelect)
        }
      }
    },
    // 缓存每次执行的时间
    setTimer (val) {
      this.worker = new Worker()
      this.worker.postMessage({
        value: val
      })
      const that = this
      this.worker.onmessage = function(e) {
        that.remainTimestamp = e.data.value
        that.countTime = Math.floor(e.data.value / 1000)
        that.countDown(e.data.value)
      }
    }
  },
  watch: {
    timestamp: {
      handler (newVal) {
        this.remainTimestamp = newVal
        // this.countDown(newVal)
        this.setTimer(newVal)
      },
      immediate: true
    }
  },

  destored () {
    this.worker = null
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
