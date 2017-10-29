import Vue from 'vue'
import Router from 'vue-router'
// import rank from 'components/rank/rank'
// import recommend from ''
// import search from 'components/search/search'
// import singer from 'components/singer/singer'
// // 以上为首页 四大板块组件
// import singerDetail from 'components/singer-detail/singer-detail' //引入子路由歌手详情组件
// import desc from 'components/desc/desc' //引入子路由 推荐歌单详情组件
// import topList from 'components/top-list/top-list'
// import userCenter from 'components/userCenter/userCenter'
Vue.use(Router)

//路由按需加载  
//const Foo = () => Promise.resolve({ /* 组件定义对象 */ })
//import('./Foo.vue') // 返回 Promise
const recommend = (resolve) => {
  import('components/recommend/recommend').then((recommend) => {
    resolve(recommend);
  })
}
const rank = (resolve) => {
  import('components/rank/rank').then((rank) => {
    resolve(rank);
  })
}
const search = (resolve)=> {
  import('components/search/search').then((search)=>{
    resolve(search);
  })
}
const singer = (resolve) => {
  import('components/singer/singer').then((singer) => {
    resolve(singer);
  })
}
const singerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((singerDetail) => {
    resolve(singerDetail);
  })
}
const desc = (resolve) => {
  import('components/desc/desc').then((desc) => {
    resolve(desc);
  })
}
const topList = (resolve) => {
  import('components/top-list/top-List').then((topList) => {
    resolve(topList);
  })
}
const userCenter = (resolve) => {
  import('components/userCenter/userCenter').then((userCenter) => {
    resolve(userCenter);
  })
}

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
    }, {
      path: '/user',
      component: userCenter
    }
  ]
})
