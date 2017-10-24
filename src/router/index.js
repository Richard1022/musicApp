import Vue from 'vue'
import Router from 'vue-router'
import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import search from 'components/search/search'
import singer from 'components/singer/singer'
// 以上为首页 四大板块组件
import singerDetail from 'components/singer-detail/singer-detail' //引入子路由歌手详情组件
import desc from 'components/desc/desc' //引入子路由 推荐歌单详情组件
import topList from 'components/top-list/top-list'
import userCenter from 'components/userCenter/userCenter'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'   // 初始路径 重定向
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: topList
        }
      ]
    },
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: desc
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: ':id',
          component: singerDetail
        },
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        },
      ]
    },{
      path:'/user',
      component:userCenter
    }
  ]
})
