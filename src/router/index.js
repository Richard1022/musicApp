import Vue from 'vue'
import Router from 'vue-router'
import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import search from 'components/search/search'
import singer from 'components/singer/singer'
// 以上为首页 四大板块组件
import singerDetail from 'components/singer-detail/singer-detail' //引入子路由歌手详情组件

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/recommend'   // 初始路径 重定向
    },
    {
      path: '/rank',
      component: rank
    },
    {
    	path:'/recommend',
    	component:recommend
    },
    {
    	path:'/search',
    	component:search
    },
    {
    	path:'/singer',
      component:singer,
      children:[
        {
          path:':id',
          component:singerDetail
        },
      ]
    }    
  ]
})
