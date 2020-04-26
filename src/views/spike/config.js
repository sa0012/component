// 活动状态：NOT_START未开始ONGOING进行中SUSPEND暂停END已结束)
export const statusMsg = {
  NOT_START: '未开始',
  ONGOING: '进行中',
  SUSPEND: '暂停',
  END: '已结束'
}

export const activityStatus = {
  'NOT_START': '未开始',
  'ONGOING': '进行中',
  'SUSPEND': '暂停',
  'END': '已结束'
}
// 场次状态：S_101即将开始S_102抢购中S_103已结束)
// 产品状态：S_101即将开始S_102抢购中S_103已结束)
export const sessionStatus = {
  'S_101': '即将开始',
  'S_102': '抢购中',
  'S_103': '已结束'
}

export const deliveryStatus = {
  PICK_UP_STORE: '到店领取',
  POST: '邮寄',
  NOT_DELIVERY: '无需配送'
}

export const loginError = (e, router) => {
  let error = e.errorMessges[0]
  if (error) {
    if (error.code === '981') {
      setTimeout(() => {
        router.replace({
          path: '/spikeLogin'
        })
      }, 1000)
    }
  }
}

export const calcTimeStamp = (prefix, date) => {
  if (!(prefix && date)) return
  let dateChar = prefix + ' ' + date
  let timeStamp = +new Date(dateChar)
  return timeStamp
}
