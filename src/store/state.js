import { PlayerConfig } from 'common/js/config' //引入播放器配置JS
import {initialSearchKey,loadPlayHistory,loadCollectToLocal} from 'common/js/cache' //引入初始化vuex searchKey

const state = {
    singer: {
        name: "defaultName"
    },
    playing_state: false,  //播放/暂停
    loop: false,         //循环播放
    fullScreen: false,  //全屏
    sequenceList: [],  //顺序播放列表
    playList: [],        //播放列表
    mode: PlayerConfig.sequence, //播放模式
    currentIndex: -1,  //当前播放索引
    desc: {}, //当前歌单推荐详情
    topList: {}, //排行榜详情页数据
    searchHistory:initialSearchKey(),// 搜索历史
    playHistory:loadPlayHistory(), // 播放历史从localstorage  获取
    myCollect:loadCollectToLocal(), // 我的收藏
};

export default state;