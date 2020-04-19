import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Components from '@/components'
import './registerServiceWorker'

Components(Vue)
const VConsole = require('vconsole')
// eslint-disable-next-line
new VConsole()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
