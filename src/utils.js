const ua = navigator.userAgent
let utils = {
  version: 0.01,
  isWeChat: () => (/micromessenger/i).test(navigator.userAgent),
  isMobile: phone => /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(phone),
  isEngineNo: code => /^[0-9a-zA-Z]+$/i.test(code),
  isCar: car => /(^(浙|闽|粤|京|津|冀|晋|蒙|辽|吉|黑|沪|苏|皖|赣|鲁|豫|鄂|湘|桂|琼|渝|川|贵|云|藏|陕|甘|青|宁|新){1}[A-Z0-9]{6,7}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(car),
  isIdNo: ID => {
    if (typeof ID !== 'string') return false
    var city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
    var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2))
    var d = new Date(birthday)
    var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate())
    var currentTime = new Date().getTime()
    var time = d.getTime()
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    var sum = 0
    var i
    var residue
    if (!/^\d{17}(\d|x)$/i.test(ID)) return false
    if (city[ID.substr(0, 2)] === undefined) return false
    if (time >= currentTime || birthday !== newBirthday) return false
    for (i = 0; i < 17; i++) {
      sum += ID.substr(i, 1) * arrInt[i]
    }
    residue = arrCh[sum % 11]
    if (residue !== ID.substr(17, 1)) return false
    return true
  },
  isBankCode: num => /^([1-9]{1})(\d{15}|\d{18})$/.test(num),
  isEmail: mail => /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(mail),
  isIOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  isAndroid: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1,
  isiPhone: ua.indexOf('iPhone') > -1,
  formatDate (datetime, fmt) {
    if (!datetime) return
    let date = datetime
    if (typeof datetime === 'string') {
      date = new Date(datetime.replace(/-/g, '/'))
    } else {
      date = new Date(datetime)
    }
    function padLeftZero (str) {
      return ('00' + str).substr(str.length)
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
      }
    }
    return fmt
  },
  get: (url, params = {}, method = 'get') => new Promise((resolve, reject) => {
    let req = method === 'get' ? { params: params } : params
    window.axios[method](url, req).then(res => {
      resolve && res && typeof res.data !== 'undefined' && resolve(res.data)
    }, error => {
      reject && reject(error)
    })
  }),
  post: (url, params) => utils.get(url, params, 'post'),
  getQueryString: (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return decodeURIComponent(r[2])
    }
    return null
  },
  zeroNum: num => {
    let zeroNum = num
    if (zeroNum < 10) {
      zeroNum = '0' + zeroNum
    } else {
      return zeroNum
    }

    return zeroNum
  }
}

// base64转blob
export const dataURLtoBlob = dataurl => {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1]); var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// base64转file对象
export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export const compare = property => {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

export const px2Rem = px => {
  let baseFontSize = 14
  let clientWidth = document.documentElement.clientWidth
  let oneRem = baseFontSize * (clientWidth / 375)
  let rate = (oneRem / baseFontSize).toFixed(3)
  return rate * px
}

export const getDateStr = () => {
  let date = new Date()
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
}

export const RAF = {
  intervalTimer: null,
  timeoutTimer: null,
  setTimeout (cb, interval) { // 实现setTimeout功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.timeoutTimer = window.requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        cb()
        window.cancelAnimationFrame(this.timeoutTimer)
      }
    }
    this.timeoutTimer = window.requestAnimationFrame(loop)
    return this.timeoutTimer
  },
  clearTimeout () {
    window.cancelAnimationFrame(this.timeoutTimer)
  },
  setInterval (cb, interval) { // 实现setInterval功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.intervalTimer = window.requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        stime = now()
        etime = stime
        cb()
      }
    }
    this.intervalTimer = window.requestAnimationFrame(loop)
    return this.intervalTimer
  },
  clearInterval () {
    window.cancelAnimationFrame(this.intervalTimer)
  }
}

export const dateformat = (date, format) => {
  if (!date) return

  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) // eslint-disable-line
    }
  }

  return format
}

export default utils
