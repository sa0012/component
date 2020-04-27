
import $, { dateformat  } from '@/utils'
import { calcTimeStamp, deliveryStatus } from '../config'
import CountDown from './countDown'
import MockData from '../data/spikeDetail.json'
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
      let data = MockData.result
      data.currentTimeMillis = +new Date()
      return data
    },
    currentTimeStamp () {
      let timeStamp = this.prodList.currentTimeMillis
      if (!timeStamp) return null
      return dateformat(new Date(timeStamp), 'yyyy/MM/dd')
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
      console.log('提交订单')
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

  destory () {
    clearTimeout(this.timer)
  }
}
