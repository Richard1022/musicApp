import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config.js'
//引入jsonp及jsonp常规公共参数


//向外输出获取歌手列表方法
export function getSingerList(){
    const url='https://c.y.qq.com/v8/fcg-bin/v8.fcg' ;
    const data=Object.assign({},commonParams,{
        g_tk:"1928093487",
        channel:"singer",
        page:"list",
        key:"all_all_all",
        pagesize:100,
        pagenum:1,
        hostUin:0,
        needNewCode:0,
        platform:"yqq"
    });
    return jsonp(url,data,options);
}
