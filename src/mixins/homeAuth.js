import $ from '@/utils'

const auth = {
  created () {
    const isAuth = !!window.sessionStorage.HAS_AUTH_YK_PROFILE
    if (
      window.navigator.userAgent.indexOf('WindowsWechat') !== -1 ||
      !$.isWeChat()
    ) {
      if (isAuth) {
        typeof this.pageInitMethods === 'function' && this.pageInitMethods()
      } else {
        // this.$router.push({
        //   path: 'bindingPhone',
        //   query: {
        //     redirect: encodeURIComponent(this.$router.currentRoute.path)
        //   }
        // })
      }
    } else {
      if (isAuth) {
        typeof this.pageInitMethods === 'function' && this.pageInitMethods()
      } else {
        this.mixin_auth()
      }
    }
  },

  methods: {
    // 重新授权
    mixin_authorized () {
      this.$toast.loading('加载中...', -1)
      const channelCode = 'YKWECHAT' // 赢科code 用于后端区分
      $.post(`/h5-api/saicec/auth/getAppId/${channelCode}`)
        .then(response => {
          if (response.result) {
            const firstHostname = window.location.host.split('.')[0]
            const path = 'home'
            window.location.replace(
              `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${response.result
              }&redirect_uri=https%3a%2f%2f${firstHostname}.yingketech.com%2fmyk%2f%23%2f${path
              }&response_type=code&scope=snsapi_userinfo&state=123&connect_redirect=1`
            )
          }
        })
        .catch(error => { console.log(error) })
    },

    mixin_auth () {
      const urlCode = $.getQueryString('code')
      const urlState = $.getQueryString('state')
      if (urlCode && urlState) {
        this.$toast.loading('加载中...', -1)
        $.post('/h5-api/auth/yk-weChat', { code: urlCode, state: urlState })
          .then(response => {
            window.sessionStorage.HAS_AUTH_YK_PROFILE = 'Y'
            typeof this.pageInitMethods === 'function' && this.pageInitMethods()
          }).catch(error => { console.log(error) })
      } else {
        this.mixin_authorized()
      }
    }
  }
}

export default auth
