// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'  //填补Promise
import fastclick from 'fastclick'  //取消300ms触摸延迟
import lazyLoad from 'vue-lazyload' //引入vue懒加载组件

fastclick.attach(document.body)
Vue.use(lazyLoad,{
  loading: require('common/image/default.png')
})  //首页图片懒加载 v-lazy="图片source"
Vue.config.productionTip = false

import '@/common/stylus/index.styl'   //引入所有stylus

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
