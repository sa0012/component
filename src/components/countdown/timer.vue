<template>
  <div id="countdown" class="countdownHolder">
    <!-- <div class="position">
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
    </div> -->
    {{ countTime }}
  </div>
</template>

<script>
import Worker from './timer.worker.js'
export default {
  name: 'countdown',
  props: {
    timestamp: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      remainTimestamp: 0,
      countTime: 0
    };
  },
  beforeDestroy () {
    this.worker = null
  },
  methods: {
    setTimer(val) {
      this.worker = new Worker()
      this.worker.postMessage({
        value: val
      })
      const that = this
      this.worker.onmessage = function(e) {
        that.remainTimestamp = e.data.value
        that.countTime = Math.floor(e.data.value / 1000)
      }
    }
  },
  watch: {
    timestamp(val) {
      this.worker = null
      this.setTimer(val)
    }
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

    