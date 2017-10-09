import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config.js'
// 引入 jsonp 和常规参数
import axios from 'axios' //



//向外输出getRecommend方法   
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'  // 推荐页轮播图 jsonp跨域地址
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });       // 推荐页请求参数 公共参数assign 独立参数
  return jsonp(url, data, options);
}
//向外输出getDiscList方法
export function getDiscList() {
  const url = '/api/getDiscList';  // node 接口

  const data = Object.assign({}, commonParams, { //代理请求参数
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongMenu(disstid) {
  // const url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg"
  const url = '/api/getSongMenu' //invalid referer  重写node接口

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    disstid,
    hostUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}