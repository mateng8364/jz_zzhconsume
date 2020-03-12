import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './config/vant.config'
import Vconsole from 'vconsole'
import { didReceiveUserInfoFromIos1 } from './tool/tools'
window.didReceiveUserInfoFromIos1 = didReceiveUserInfoFromIos1

if (process.env.NODE_ENV === 'development') {
  void new Vconsole()
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
