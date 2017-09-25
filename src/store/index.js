import Vue from 'vue'; //引入vue,vuex
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
    // state: {
    //     singer: {
    //         name:"defaultName"
    //     },
    //     playing:false,  //播放/暂停
    //     loop:false,         //循环播放
    //     fullScreen:false,  //全屏
    //     sequenceList:[],  //顺序播放列表
    //     playList:[],        //播放列表
    //     mode:PlayerConfig.sequence, //播放模式
    //     currentIndex:-1  //当前播放索引
    // },
    // mutations:{
    //     setSinger(state,payload){ //paylaod为commit时第一个参数对象
    //         // console.log(payload); 
    //         state.singer=payload;
    //     }
    // },
    actions ,
    getters,
    state,
    mutations,
    strict:debug,
    plugins:debug ? [createLogger()]:[]

});
