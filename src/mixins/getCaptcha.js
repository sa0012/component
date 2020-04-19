let captchaUrl = `/h5-api/basic/captcha`
let calcCaptchaUrl = () => {
  return `${captchaUrl}?v=${new Date().getTime()}`
}

export default {
  data () {
    return {
      graphCaptcha: '',
      captchaUrl: calcCaptchaUrl()
    }
  },

  methods: {
    refreshCaptcha () {
      this.captchaUrl = calcCaptchaUrl()
    }
  }
}
