import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import(/* webpackChunkName: "timeLine" */ './components/timeLine.vue')
    },
    {
      path: '/lottery',
      name: 'lottery',
      meta: {
        title: '抽奖组件'
      },
      component: () => import(
        /* webpackChunkName: "lottery" */
        '@/components/lottery/index.vue'
      )
    },
    {
      path: '/uploader',
      name: 'uploader',
      meta: {
        title: '图片上传组件'
      },
      component: () => import(
        /* webpackChunkName: "uploader" */
        '@/views/uploader/index.vue'
      )
    },
    {
      path: '/countdown',
      name: 'countdown',
      meta: {
        title: '倒计时'
      },
      component: () => import(
        /* webpackChunkName: "countdown" */
        '@/views/countdown/index.vue'
      )
    },
    {
      path: '/spike',
      name: 'spike',
      meta: {
        title: '秒杀活动'
      },
      component: () => import(
        /* webpackChunkName: "spike" */
        '@/views/spike/index.vue'
      )
    }
  ]
})
