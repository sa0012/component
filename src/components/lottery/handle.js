import TurntAble from './turntable'
import prizeList from './mock/prizeList'
// import lottery from ../data/lottery.json
function lotteryDetails () {
  return {
    // 活动编号
    activityCode: '',
    // 活动名称
    activityName: '',
    // 活动链接
    activityUrl: '',
    // 状态
    status: '',
    // 活动开始时间
    startDate: '',
    // 活动结束时间
    endDate: '',
    // 背景颜色代码
    rgb: '',
    // 活动电话
    activityPhone: '',
    // 活动地址
    activityAddress: '',
    // 活动说明
    activityDesc: '',
    dealerCode: '00000',
    dealerName: '测试数据',
    activitySessionList: [
      // {
      //   endTime: 23:59:59,
      //   sessionCode: ACS2000000068,
      //   sessionName: 抽奖虚拟场次,
      //   startTime: 0:00:00
      // }
    ],
    lotteryProductMOList: [
      {
        // activityCode: AC2000000051,
        // consumptionInventory: 0,
        // needInventory: Y,
        // prizeGetWay: 快递,
        // prizeLevel: 1,
        // prizeName: 苹果手机,
        // prizeNum: 3,
        // prizePrice: 9999,
        // prizeType: 实物,
        // probability: 0.98,
        // probabilityDay: 2,
        // probabilityPeople: 1,
        // productNo: OP2000000040,
        // remainingInventory: 3
      }
    ],
    participateNum: '',
    participateType: ''
  }
}
export default {
  name: 'lottery',
  data () {
    return {
      lotteryDetails: lotteryDetails(),
      activityCode: '',
      remainCount: 0,
      prizeFlag: '',
      prizeList,
      isShowturnt: false,
      timer: null
    }
  },

  methods: {
    submitLottery (runRotateFn) {
      return new Promise((resolve, reject) => {
        if (this.remainCount === 0) {
          return this.$spikeDialog.alert({
            title: '',
            iconType: 'warn',
            message: '您的抽奖机会已用完！',
            confirmFn: () => {
              // 手动隐藏
              this.$spikeDialog.hide()
              reject(new Error())
            }
          })
        }

        console.log(1111111)

        this.timer = setTimeout(() => {
          runRotateFn({
            productNo: 'OP2000000460',
            activityCode: 'AC2000000196',
            prizeLevel: 3,
            prizePrice: null,
            prizeNum: 4,
            prizeGetWay: '',
            probability: 3,
            probabilityPeople: 1,
            probabilityDay: 1,
            needInventory: 'Y',
            remainingInventory: 4,
            consumptionInventory: 0,
            prizeName: '保养工时抵用券',
            fullPrizePicture: require('@/assets/images/spike/icon-1.jpg')
          })
        }, 1000)
      })
    },

    queryActivityRules (desc) {
      this.$spikeDialog.alert({
        title: '活动规则',
        confirmBtnText: '我知道了',
        message: desc,
        confirmFn: () => {
          // 手动隐藏
          this.$spikeDialog.hide()
        }
      })
    }
  },

  created () {
    this.remainCount = 10
  },

  components: {
    TurntAble
  },

  destored () {
    clearTimeout(this.timer)
  }
}
