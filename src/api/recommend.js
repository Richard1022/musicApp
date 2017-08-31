import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config.js' 
// 引入 jsonp 几常规参数

//向外输出getRecommend方法   
export function getRecommend(){
      const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'  // 推荐页轮播图 jsonp跨域地址
      const data=Object.assign({},commonParams,{
        platform:'h5',
        uin:0,
        needNewCode: 1
      });       // 推荐页请求参数 公共参数assign 独立参数
      return jsonp(url,data,options);
}
