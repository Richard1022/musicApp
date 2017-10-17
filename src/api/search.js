import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config.js'
//引入jsonp及jsonp常规公共参数

export function getHotSearch() { //抓取热门搜索词
    const url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";

    const data = Object.assign({}, commonParams, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    });
    return jsonp(url, data, options);
}

export function searchSong(queryTxt, page, zhida,perpage) {
    const url = "https://szc.y.qq.com/soso/fcgi-bin/search_for_qq_cp";
    const data = Object.assign({}, commonParams, {
        w: queryTxt, //检索关键字
        p: page,    //页数
        perpage,
        n: perpage,
        catZhida: zhida ? 1 : 0,   //检索歌曲直达
        zhidaqu: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        remoteplace: 'txt.mqq.all',
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    });
    return jsonp(url, data, options);
}