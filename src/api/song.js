import { commonParams, options } from './config.js'
// 引入 jsonp 和常规参数
import axios from 'axios'

export function getLyric(mid) {
    const url = 'api/getLyric'; //node接口
    const data = Object.assign({}, commonParams, { //请求参数
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    })
}