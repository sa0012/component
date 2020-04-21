import '@/requestAnimationFrame'
let count = 0
export default {
  name: 'turntable',
  props: {
    prizeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 转动方式， 默认轮盘转动(roulette)， 可选择指针转动(pointer)
    rotateType: {
      type: String,
      default: 'roulette'
    },

    // 抽奖
    lotteryFn: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      start: 0,
      deg: 0,
      timer: null,
      dialogTimer: null,
      prizeCount: 0,
      turnNum: 0,
      disabled: false
    }
  },

  computed: {
    px2Rem () {
      let baseFontSize = 14
      let clientWidth = document.documentElement.clientWidth
      let oneRem = baseFontSize * (clientWidth / 375)
      let rate = (oneRem / baseFontSize).toFixed(3)
      return rate
    }
  },

  watch: {
    prizeList: {
      handler (newVal) {
        if (newVal.length > 0) {
          this.$nextTick(() => {
            this.prizeCount = newVal.length
            this.turnNum = 1 / this.prizeCount
            this.init()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    selfInterval (callback = () => {}) {
      let count = 0
      callback && callback()
      let loop = () => {
        this.timer = window.requestAnimationFrame(() => {
          if (count < 60) {
            count++
          } else {
            callback && callback()
            window.cancelAnimationFrame(this.timer)
            count = 0
          }

          loop()
        })
      }

      loop()
    },
    loop (res) {
      let {
        ctx,
        r
      } = res
      if (count >= 60) {
        count = 0
        this.light(ctx, r)
      } else {
        count++
      }

      window.requestAnimationFrame(() => {
        this.loop(res)
      })
    },
    init () {
      this.drawLottery()
      this.drawOuterCircle()
        .then(res => {
          this.loop(res)
        })
    },
    /**
     * @name 绘制外圆
     */
    drawOuterCircle () {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        let outer = document.querySelector('#lottery-outer')
        let ctx = outer.getContext('2d')
        ctx.imageSmoothingEnabled = true
        let width = ctx.canvas.width
        let height = ctx.canvas.height
        let r = width / 2 // 圆的半径为宽度的一半

        // 保存当前绘制状态
        ctx.save()
        ctx.beginPath()
        // 移动到圆心位置
        ctx.translate(width / 2, height / 2)
        ctx.lineWidth = 24 * this.px2Rem

        // 渐变色
        let grd = ctx.createLinearGradient(0, 0, 0, r)
        grd.addColorStop('0', '#FFAB17')
        grd.addColorStop('0.3', '#FF9E21')
        grd.addColorStop('0.5', '#FF7A3D')
        grd.addColorStop('0.8', '#FF8F2F')
        grd.addColorStop(1, '#FF7A3D')
        ctx.strokeStyle = grd
        // 以0，0为原点，r为半径，0为起始角，2*Math.PI为结束角，顺时针画圆
        ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 2 * Math.PI, false)
        // 填充扇形
        ctx.stroke()

        // 绘制跑马灯
        this.light(ctx, r)
        // 恢复前一个状态
        resolve({
          ctx,
          r,
          width,
          height
        })
      })
    },

    /**
     * @name 绘制扇形区域
     */
    drawLottery () {
      let lottery = document.querySelector('#lottery')
      // 获取绘图上下文
      let ctx = lottery.getContext('2d')
      ctx.imageSmoothingEnabled = true
      // 扇形回转角度
      let rotateDeg = 360 / this.prizeCount / 2 + 90
      var width = ctx.canvas.width
      var height = ctx.canvas.height
      var r = width / 2 // 圆的半径为宽度的一半
      // var rem = width / 200
      ctx.translate(width / 2, height / 2)
      for (let i = 0; i < this.prizeCount; i++) {
        // 保存当前绘制状态
        ctx.save()
        // 开始新的绘制路线
        ctx.beginPath()
        // 移动到圆心位置
        // 从(0, 0)坐标开始定义一条新的子路径
        ctx.moveTo(0, 0)
        // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
        ctx.rotate((360 / this.prizeCount * i - rotateDeg) * Math.PI / 180)
        // 绘制圆弧
        ctx.arc(0, 0, r - 28 * this.px2Rem, 0, 2 * Math.PI / this.prizeCount, false)

        // 颜色间隔
        if (i % 2 === 0) {
          ctx.fillStyle = '#fff'
        } else {
          ctx.fillStyle = '#FFE459'
        }

        // 填充扇形
        ctx.fill()
        // 移动
        // 恢复前一个状态
        ctx.restore()
      }

      // 绘制实心圆
      ctx.beginPath()
      ctx.arc(0, 0, 40 * this.px2Rem, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#fff'
      ctx.fill()
      ctx.stroke()
    },

    /**
     * @name 绘制跑马灯
     * @param {*} ctx // canvas上下文
     * @param {*} r // 半径
     */
    light (ctx, r) {
      this.start++
      if (this.start >= 2) {
        this.start = 0
      }
      for (var j = 0; j < 24; j++) {
        var rad = 2 * Math.PI / 24 * j
        var x = Math.cos(rad) * (r - 12 * this.px2Rem)
        var y = Math.sin(rad) * (r - 12 * this.px2Rem)
        ctx.beginPath()
        if (j % 2 === 0) { // 整点的圆圈是黑色的，非整点的部分是灰色的
          if (this.start === 0) {
            ctx.fillStyle = '#fff'
          } else {
            ctx.fillStyle = '#FBD700'
          }
          // ctx.arc(x, y, 5 * this.px2Rem, 0, 2 * Math.PI, false)
        } else {
          if (this.start === 0) {
            ctx.fillStyle = '#FBD700'
          } else {
            ctx.fillStyle = '#fff'
          }
        }
        ctx.arc(x, y, 5 * this.px2Rem, 0, 2 * Math.PI, false)
        ctx.fill()
      }
    },

    /**
     * @name 转轮运动
     * @param {*} deg // 转动角度
     */
    runRotateFn (deg, data) {
      let container = this.$refs[this.rotateType]
      let transformOptions = `rotate(${deg}deg)`
      if (this.rotateType === 'pointer') {
        transformOptions = `translate(-50%, -50%) rotate(${deg}deg)`
      }
      container.style['transform'] = transformOptions
      container.style['transition'] = 'all 6s ease'
      this.dialogTimer = setTimeout(() => {
        let prize = data.prizeName || ''
        this.$spikeDialog.alert({
          iconType: 'success',
          title: '恭喜您',
          message: `获得${prize}`,
          confirmFn: () => {
            // 手动隐藏
            this.$spikeDialog.hide()
            this.disabled = false
          }
        })
      }, 6100)
    },

    /**
     * @name 转动圈数
     */
    handleLottery (data) {
      let targetIndex = this.prizeList.findIndex(item => item.productNo === data.productNo)
      this.deg = this.deg + (360 - this.deg % 360) + (360 * 10 - targetIndex * (360 / this.prizeCount))
      this.runRotateFn(this.deg, data)
    },

    startLoottery () {
      this.disabled = true
      if (this.lotteryFn && typeof this.lotteryFn === 'function') {
        this.lotteryFn(this.handleLottery)
          .catch(e => {
            console.log(e)
            this.disabled = false
          })
      }
    }
  },

  destroyed () {
    window.cancelAnimationFrame(this.timer)
  }
}
