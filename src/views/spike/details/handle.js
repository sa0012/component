
import $ from '@/utils'
import { loginError, calcTimeStamp, deliveryStatus } from '../config'
import { sessionGet } from '@/storage'
import CountDown from './countDown'
// import MockData from '../data/spikeDetail.json'
export default {
  name: 'spikeDetail',
  data () {
    return {
      deliveryStatus,
      number: 1,
      maxNum: 0,
      total: 0,
      productNo: '',
      activityCode: '',
      sessionCode: '',
      productIndex: 0,
      timer: null,
      countTime: 0,
      isDisabled: false
    }
  },
  components: {
    CountDown
  },

  computed: {
    prodList () {
      return this.$store.state.spike.details || {}
      // let data = MockData.result
      // data.currentTimeMillis = +new Date()
      // return data
    },
    currentTimeStamp () {
      let timeStamp = this.prodList.currentTimeMillis
      if (!timeStamp) return null
      return $.dateformat(new Date(timeStamp), 'yyyy/MM/dd')
    },
    prodDetails () {
      let list = this.prodList.activitySessionList || []
      console.log(list, 'list')
      let sessionProductList = (list[this.productIndex] || {}).sessionProductList || []
      if (!(list && sessionProductList)) return []
      let details = sessionProductList.filter(item => {
        return (item.productNo === this.productNo && item.status === 'S_102')
      })[0] || {}

      if (details.status === 'S_102') {
        let currentPrd = list[this.productIndex] || {}
        this.maxNum = details.remainingInventory || 1
        this.total = (details.seckillPrice * this.number).toFixed(2)
        let endTimeChar = currentPrd.endTime || ''
        this.sessionCode = currentPrd.sessionCode || ''
        let endTime = calcTimeStamp(this.currentTimeStamp, endTimeChar)
        this.countTime = endTime - this.prodList.currentTimeMillis
        console.log(this.countTime, endTimeChar, 'countTime')
      }
      return details
    }
  },

  methods: {
    handleReduce () {
      if (this.number > 1) {
        this.number--
        this.total = (this.price * this.number).toFixed(2)
      }
    },
    handleAdd () {
      if (this.number < this.maxNum) {
        this.number++
        this.total = (this.price * this.number).toFixed(2)
      }
    },
    queryActivityDetails () {
      this.$toast.loading('请求中...', -1)
      $.post(`/h5-api/activity/seckill/queryActivityDetail/${this.activityCode}`)
        .then(res => {
          if (res.status === '100') {
            console.log(res, 'res')
            let result = res.result || {}
            if (result.status !== 'ONGOING') {
              this.$router.push({
                path: '/spike/status',
                query: {
                  type: result.status
                }
              })
            }
            this.$store.dispatch('update_details', result)
          } else {
            console.log(res.status, 'status')
          }
        })
        .catch(e => {
          loginError(e, this.$router)
        })
    },

    validateSubmit (config) {
      if (!config.activityCode) {
        return this.$toast.text('活动代码不能为空！')
      } else if (!config.sessionCode) {
        return this.$toast.text('场次代码不能为空！')
      } else if (!config.productNo) {
        return this.$toast.text('商品代码不能为空！')
      } else if (!config.openid) {
        return this.$toast.text('用户 openId 不能为空！')
      }

      return true
    },

    submit () {
      const config = {
        // 活动代码
        activityCode: this.activityCode,
        // 场次代码
        sessionCode: this.sessionCode,
        // 商品代码
        productNo: this.productNo,
        openid: sessionGet('openId')
      }

      if (!this.validateSubmit(config)) return
      this.$toast.loading('请求中...', -1)
      this.isDisabled = true
      $.post('/h5-api/activity/seckill/createOrder', config)
        .then(res => {
          if (res.status === '100') {
            this.$spikeDialog.alert({
              iconType: 'success',
              title: '恭喜您',
              message: '秒杀下单成功',
              confirmFn: () => {
                this.isDisabled = false
                this.$router.push({
                  path: '/spike/home'
                })
                // 手动隐藏
                this.$spikeDialog.hide()
              }
            })
          }
        })
        .catch(e => {
          this.isDisabled = false
          let errorMessges = e.errorMessges || []
          // 本次活动该商品已秒杀完毕
          if (errorMessges.length > 0 && errorMessges[0].includes('本次活动该商品已秒杀完毕')) {
            return this.$router.push({
              path: '/spike/status',
              query: {
                type: 'END'
              }
            })
          }
          loginError(e, this.$router)
        })
    }
  },

  created () {
    let query = this.$route.query || {}
    this.productNo = query.productNo
    this.productIndex = query.productIndex
    this.activityCode = $.getQueryString('activityCode')
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.isDisabled = false
    })
  },

  mounted () {
    this.queryActivityDetails()
  },

  destory () {
    clearTimeout(this.timer)
  }
}
