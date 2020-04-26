import CardList from './item'
import BgLoading from './loading'
import CountDown from './details/countDown'
import $, { dateformat } from '@/utils'
import { sessionStatus, deliveryStatus, calcTimeStamp } from './config'
import MockData from './data/spikeDetail.json'
export default {
  name: 'spike',
  data () {
    return {
      showPage: false,
      sessionStatus,
      deliveryStatus,
      timer: null,
      currentSelect: 0,
      currentSession: {},
      currentIndex: 0,
      toastEnum: {
        'S_101': '距离开始还有',
        'S_102': '距离结束还有',
        'S_103': '本时段抢购已结束'
      },
      timerHeight: 0
    }
  },

  computed: {
    details () {
      // console.log(MockData, 'mock')
      let data = MockData.result
      data.currentTimeMillis = Date.now()
      return data
    },
    currentDate () {
      let date = new Date(this.details.currentTimeMillis) || new Date()
      let currentMonth = $.zeroNum(date.getMonth() + 1)
      let currentDay = $.zeroNum(date.getDate())
      return {
        currentMonth,
        currentDay
      }
    },
    activitySessionList () {
      let activitySessionList = this.details.activitySessionList || []
      return activitySessionList
    }
  },

  methods: {
    splitTime (time) {
      if (!time) return ''
      let timeStr = time.split(':')
      return timeStr[0] + ':' + timeStr[1]
    },

    calcRemainTime (startTime, endTime) {
      let prefix = this.currentTimeStamp(Date.now())
      return calcTimeStamp(prefix, endTime) -
          calcTimeStamp(prefix, startTime)
    },

    changeTab (index) {
      this.currentSelect = index
      this.currentSession = this.activitySessionList[index]
      let duration = this.calcRemainTime(this.currentSession.startTime, this.currentSession.endTime)
      this.currentSession.duration = duration
    },

    changeStatus (session = {}, status) {
      session.status = status
      session.sessionProductList.forEach((item, index) => {
        this.$set(session.sessionProductList[index], 'status', status)
      })
    },

    currentIndexHandler (index) {
      if (this.activitySessionList[index].status === 'S_102') {
        this.changeStatus(this.activitySessionList[index], 'S_103')
      }
      if (this.activitySessionList[index].status === 'S_101') {
        this.changeTab(index)
        this.activitySessionList[index].status = 'S_102'
      }
    },

    currentTimeStamp (currentTimeMillis) {
      let timeStamp = currentTimeMillis
      if (!timeStamp) return null
      return dateformat(new Date(timeStamp), 'yyyy/MM/dd')
    },

    checkCurrentSession (result) {
      let detail = result
      let currentTimeMillis = result.currentTimeMillis
      let prefix = this.currentTimeStamp(currentTimeMillis)
      let activitySessionList = detail.activitySessionList || []
      let startTime = 0
      let endTime = 0
      if (activitySessionList.length > 0) {
        let firstSessionStartTime = calcTimeStamp(activitySessionList[0].startTime)
        let lastSessionEndTime = calcTimeStamp(activitySessionList[activitySessionList.length - 1].endTime)
        activitySessionList.forEach((item, index) => {
          endTime = calcTimeStamp(prefix, item.endTime)
          startTime = calcTimeStamp(prefix, item.startTime)
          if (currentTimeMillis >= startTime && currentTimeMillis <= endTime) {
            console.log(currentTimeMillis >= startTime, currentTimeMillis <= endTime, 'current')
            this.currentSelect = index
            this.currentSession = this.activitySessionList[index] || {}
            this.$set(this.activitySessionList[index], 'duration', endTime - currentTimeMillis)
          } else if (currentTimeMillis < startTime) {
            this.$set(this.activitySessionList[index], 'duration', startTime - currentTimeMillis)
          }
          if (currentTimeMillis > lastSessionEndTime) {
            this.currentSelect = activitySessionList.length - 1
            this.currentSession = this.activitySessionList[this.activitySessionList.length - 1] || {}
          }

          if (currentTimeMillis < firstSessionStartTime) {
            this.currentSelect = 0
            this.currentSession = this.activitySessionList[0] || {}
          }
        })
      }
    }
  },

  created () {
    this.checkCurrentSession(this.details)
  },

  mounted () {
    this.$nextTick(() => {
      if (!this.$refs.timer) return
      this.timerHeight = this.$refs.timer.width + 48
    })
  },

  components: {
    CardList,
    BgLoading,
    CountDown
  },

  destroyed () {
    clearTimeout(this.timer)
  }
}
