import Vue from 'vue'
import VueRouter from 'vue-router'
import { constant, judgeSystem } from './../tool/tools'

window.initUserInfo = function () {}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/error',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
  },
  {
    path: '/review',
    name: 'review',
    component: () => import(/* webpackChunkName: "review" */ '../views/Review.vue')
  },
  {
    path: '/service',
    name: 'service',
    component: () => import(/* webpackChunkName: "service" */ '../views/Service.vue')
  },
  {
    path: '/decoration',
    name: 'decoration',
    component: () => import(/* webpackChunkName: "decoration" */ '../views/Decoration.vue')
  },
  {
    path: '/buyCar',
    name: 'buyCar',
    component: () => import(/* webpackChunkName: "buyCar" */ '../views/BuyCar.vue')
  },
  {
    path: '/matchResult1',
    name: 'matchResult1',
    component: () => import(/* webpackChunkName: "matchResult1" */ '../views/MatchResult1.vue')
  },
  {
    path: '/matchResult2',
    name: 'matchResult2',
    component: () => import(/* webpackChunkName: "matchResult2" */ '../views/MatchResult2.vue')
  },
  {
    path: '/reservation',
    name: 'reservation',
    component: () => import(/* webpackChunkName: "reservation" */ '../views/Reservation.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/error') {
    next()
  } else {
    try {
      let system = judgeSystem()
      if (system === 'android') {
        window[constant.JS_TO_JZ].getUserInfo()
        next()
      } else if (system === 'ios') {
        let params = {
          'type': 'getUserInfo',
          'data': {
            'method': 'initUserInfo' // 把回传token的js方法名传过去
          }
        }
        let paramsStr = JSON.stringify(params)
        window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(paramsStr)
        next()
      } else {
        process.env.NODE_ENV === 'production' ? next('/error') : next()
      //   next('/error')
      }
    } catch (e) {
      process.env.NODE_ENV === 'production' ? next('/error') : next()
      // next('/error')
    }
  }
})

export default router
