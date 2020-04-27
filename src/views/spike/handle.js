import CardList from './item'
import BgLoading from './loading'
import CountDown from './details/countDown'
import $, { dateformat  } from '@/utils'
import { sessionStatus, deliveryStatus, calcTimeStamp } from './config'
import bannerUrl from '@/assets//images//spike/spike_banner.png'
import MockData from './data/spikeDetail.json'
export default {
  name: 'spike',
  data () {
    return {
      showPage: false,
      sessionStatus,
      deliveryStatus,
      bannerUrl,
      timer: null,
      currentSelect: 0,
      currentSession: {},
      currentTime: 0,
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
      this.currentSession = this.activitySessionList[index] || {}
    },

    changeStatus (index, status) {
      this.activitySessionList[index].status = status
      this.activitySessionList[index].sessionProductList.forEach((item, sIndex) => {
        this.$set(this.activitySessionList[index].sessionProductList[sIndex], 'status', status)
      })
      console.log(this.activitySessionList[index], 'activitySession')
    },

    currentIndexHandler (index) {
      if (this.activitySessionList[index].status === 'S_102') {
        this.changeStatus(index, 'S_103')
      }
      if (this.activitySessionList[index].status === 'S_101') {
        this.changeTab(index)
        this.changeStatus(index, 'S_102')
        // let currentTime = Date.now()
        // 已经执行过的时间
        let target = this.activitySessionList[index]
        // let lastTime = currentTime - this.currentTimeStamp
        // let remain = target.remain
        this.activitySessionList[index].duration = target.remain
        // console.log(this.activitySessionList, 'activity')
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
      this.currentTime = Date.now()
      let prefix = this.currentTimeStamp(currentTimeMillis)
      let activitySessionList = detail.activitySessionList || []
      let startTime = 0
      let endTime = 0
      if (activitySessionList.length > 0) {
        let firstWillStartIndex = null
        let firstSessionStartTime = calcTimeStamp(prefix, activitySessionList[0].startTime)
        let lastSessionEndTime = calcTimeStamp(prefix, activitySessionList[activitySessionList.length - 1].endTime)
        activitySessionList.forEach((item, index) => {
          endTime = calcTimeStamp(prefix, item.endTime)
          startTime = calcTimeStamp(prefix, item.startTime)
          // 正在抢购中
          if (currentTimeMillis >= startTime && currentTimeMillis <= endTime) {
            this.currentSelect = index
            this.currentSession = this.activitySessionList[index] || {}
            // 距离场次结束时间 = 场次结束时间 - 当前时间
            this.$set(this.activitySessionList[index], 'duration', endTime - currentTimeMillis)
            this.$set(this.activitySessionList[index], 'remain', endTime - startTime)
          }

          // 记录第一个即将开始场次位置
          if (item.status === 'S_101' && !firstWillStartIndex) {
            firstWillStartIndex = index
          }

          // 当前时间小于场次开始时间，说明活动尚未开始
          if (currentTimeMillis < startTime) {
            // 距离场次开始时间 = 场次开始时间 - 当前时间
            this.$set(this.activitySessionList[index], 'duration', startTime - currentTimeMillis)
            // 场次活动时间 = 场次结束时间 - 场次开始时间
            this.$set(this.activitySessionList[index], 'remain', endTime - startTime)
          }
        })

        // 场次未开始，场次一结束时展示首/尾商品分组
        // 当前时间如果大于最后一个场次结束时间，说明今日活动已经结束
        // 直接切换到最后一个场次分组
        if (currentTimeMillis > lastSessionEndTime) {
          this.changeTab(activitySessionList.length - 1)
        }

        // 当前时间小于第一个场次开始时间，说明今日活动尚未开始
        // 切换到第一个场次等待活动开始
        if (currentTimeMillis < firstSessionStartTime) {
          this.changeTab(0)
        }

        // 是否有已经开始的场次
        let isExistStartSession = this.activitySessionList.some(item => item.status === 'S_102')
        // 如果没有已经开始的场次
        // 查询是否有即将开始的场次，并切换到第一个即将开始场次分组
        // 如果没有即将开始的场次，说明所有的活动都已经结束，直接切换到最后一个场次分组即可
        if (!isExistStartSession) {
          if (firstWillStartIndex) {
            this.changeTab(firstWillStartIndex)
          } else {
            this.changeTab(activitySessionList.length - 1)
          }
        }
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
