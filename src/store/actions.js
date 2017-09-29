import * as types from './mutations-types'
import { PlayerConfig } from 'common/js/config'
import { shuffleArr } from 'common/js/util'

function findSong(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}
export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list); //actions 顺序列表
    if (state.mode === PlayerConfig.random) { //选歌播放时mode===random? 
        let randomList = shuffleArr(list);   //洗牌顺序列表并且 commit
        commit(types.SET_PLAY_LIST, randomList); 
        index =findSong(randomList,list[index]);  //获取打乱后列表中单击歌曲的index
    }else{
        commit(types.SET_PLAY_LIST,list); 
    }
    commit(types.SET_CURRENTINDEX, index); //commit当前播放索引
    commit(types.SET_FULLSCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

export const randomPlay = function ({ commit }, { list }) {
    commit(types.SET_MODE, PlayerConfig.random);
    commit(types.SET_SEQUENCE_LIST, list);
    let shuffList = shuffleArr(list);
    commit(types.SET_PLAY_LIST, shuffList);
    commit(types.SET_CURRENTINDEX, 0);
    commit(types.SET_FULLSCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}