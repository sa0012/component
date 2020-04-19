<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },

  methods: {
    initPx2Rem (doc, win) {
      var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
          var clientWidth = docEl.clientWidth
          if (!clientWidth) return
          docEl.style.fontSize = 14 * (clientWidth / 375) + 'px'
        }
  
      if (!doc.addEventListener) return
      win.addEventListener(resizeEvt, recalc, false)
      doc.addEventListener('DOMContentLoaded', recalc, false)
    }
  },

  mounted () {
    this.initPx2Rem(document, window)
    document.documentElement.style.setProperty('--theme-color', '#f90')
  }
}
</script>

<style lang="scss">
@import '@/assets/style/reset.scss';
@import '@/assets/font/iconfont.scss';
$theme-color: var(--theme-color);
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $theme-color;
}
</style>
