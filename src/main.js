// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'  //填补Promise
import fastclick from 'fastclick'  //取消300ms触摸延迟

fastclick.attach(document.body)

Vue.config.productionTip = false

import '@/common/stylus/index.styl'   //引入所有stylus

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
