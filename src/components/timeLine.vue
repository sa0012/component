<template>
  <div class="timeline">
    <ul class="timeline-list">
      <li class="timeline-item" :class="[ !item.status ? 'is-grey' : '' ]" v-for="(item, index) in timeStatus" :key="index">
        <div class="item-left">
          <div class="item-status-circle-outer" :class="[ !item.status ? 'is-grey' : '' ]">
            <div class="item-status-circle-inner">
              <i v-if="item.status" class="iconfont icon-chenggong circle-icon is-select"></i>
            </div>
          </div>
          <div class="item-status-line" :class="{
            'is-select': item.status,
            'is-grey': !item.status,
            'is-last': index === timeStatus.length - 1
          }"></div>
        </div>
        <div class="item-right" :class="[ item.status ? 'is-select' : '' ]">
          <div class="item-right-order-status">{{ item.title }}</div>
          <div class="item-right-order-time" v-if="item.status">{{ item.time }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeStatus: [],
      originTime: [
        {
          title: '订单已受理',
          time: '2019-11-19 11:23',
          status: true
        },
        {
          title: '订单审核通过',
          time: '2019-11-19 11:23',
          status: true
        },
        {
          title: '服务商已接单',
          time: '2019-11-19 11:23',
          status: false
        },
        {
          title: '客户已取车',
          time: '2019-11-19 11:23',
          status: false
        },
        {
          title: '订单已完成',
          time: '2019-11-19 11:23',
          status: false
        }
      ],
      timer: null
    }
  },
  methods: {
    handleStatus () {
      let timeStatus = [
        {
          title: '订单已受理',
          time: '2019-11-19 11:23',
          status: true
        },
        {
          title: '订单审核通过',
          time: '2019-11-19 11:23',
          status: true
        },
        {
          title: '服务商已接单',
          time: '2019-11-19 11:23',
          status: true
        },
        {
          title: '客户已取车',
          time: '2019-11-19 11:23',
          status: false
        },
        {
          title: '订单已完成',
          time: '2019-11-19 11:23',
          status: false
        }
      ]
      let count = 0
      for (let i = 0; i < timeStatus.length; i++) {
        if (timeStatus[i].status) {
          count++
          if (i === 0) {
            this.timeStatus.push(timeStatus[0])
          } else {
            this.$nextTick(() => {
              // if (this.timer) clearTimeout(this.timer)
              this.timer = setTimeout(() => {
                this.timeStatus.push(timeStatus[i])
              }, (i * 3500))
            })
          }
        }
      }

      this.$nextTick(() => {
        // if (this.timer) clearTimeout(this.timer)
        let restArr = timeStatus.slice(count)
        this.timer = setTimeout(() => {
          restArr.forEach(item => {
            this.timeStatus.push(item)
          })
        }, (count * 3500))
      })
    }
  },
  mounted () {
    this.handleStatus()
  },
  destroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.timeline {
  text-align: center;
  background: #fff;
  padding: 22px 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  &-item {
    display: flex;
    &.is-grey {
      opacity: 0;
      animation: show 1s ease-in-out forwards;
    }
  }

  .item {
    &-left {
      width: 16px;
      flex: 0 0 1px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    &-right {
      flex: 1;
    }
  }

  .circle-icon {
    font-size: 16px;
    color: skyblue;
    &.is-select {
      opacity: 0;
      animation: blink 1s ease forwards;
    }
  }

  .item-status {
    &-circle-outer {
      width: 16px;
      height: 16px;
      border-radius: 16px;
      position: relative;
      &.is-grey {
        background: #999;
      }
    }

    &-circle-inner {
      width: 14px;
      height: 14px;
      border-radius: 14px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      z-index: 33;
    }
    &-line {
      margin: 8px 0;
      width: 1px;
      height: 60px;
      background-color: skyblue;
      &.is-select {
        height: 0;
        opacity: 0;
        animation: line 1s 2s ease-in-out forwards;
      }
      &.is-last {
        height: 0;
      }
      &.is-grey {
        background-color: #999;
      }
    }
  }

  .item-right {
    text-align: left;
    &.is-select {
      opacity: 0;
      animation: translateWidth 0.5s 1s ease-in-out forwards;
    }
    &-order-status {
      color: #000;
      font-size: 16px;
      &.is-grey {
        color: #999;
      }
    }

    &-order-time {
      color: #999;
      margin-top: 10px;
    }
  }
}

@keyframes blink {
 0%{
   opacity: 0;
 }
 100% {
   opacity: 1;
 }
}

@keyframes line {
  0% {
    opacity: 0;
    height: 0;
  }
  100% {
    opacity: 1;
    height: 60px;
  }
}

@keyframes translateWidth {
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
