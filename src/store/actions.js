import * as types from './mutations-types'
import { PlayerConfig } from 'common/js/config'
import { shuffleArr } from 'common/js/util'
import { saveSearchCache, savePlayHistory, saveCollectToLocal, removeCollectToLocal } from 'common/js/cache'

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
        index = findSong(randomList, list[index]);  //获取打乱后列表中单击歌曲的index
    } else {
        commit(types.SET_PLAY_LIST, list);
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

export const insertSearchSong = function ({ commit, state }, song) {
    let playList = state.playList.slice(); //创建state.playlist副本，不能在mutation外修改state
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    //当前播放歌曲
    let currentSong = playList[currentIndex];
    // 查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findSong(playList, song)
    // 因为是插入歌曲，所以索引+1
    currentIndex++
    // 插入歌曲直接播放 推到当前索引位.
    playList.splice(currentIndex, 0, song)
    // 如果已经包含了这首歌
    if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号,当前播放位在当前索引位右侧
        if (currentIndex > fpIndex) {  //索引位歌曲删除,当前播放列表长度-1,当前播放索引-1
            playList.splice(fpIndex, 1)
            currentIndex--
        } else {                        //当前播放位在当前索引位左侧
            playList.splice(fpIndex + 1, 1)//当前播放列表,插入歌曲索引位开后面一位
        }
    }

    let currentSIndex = findSong(sequenceList, currentSong) + 1

    let fsIndex = findSong(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }
    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENTINDEX, currentIndex)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({ commit }, queryTxt) {
    commit(types.SET_HISTORY, JSON.parse(saveSearchCache(queryTxt)));
}

export const clearAllHistory = function ({ commit }) {
    commit(types.SET_HISTORY, []);
}

export const deleteSongList = function ({ commit, state }, song) {
    let playList = state.playList.slice(); //创建state.playlist副本，不能在mutation外修改state
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    let deletePIndex = findSong(playList, song);
    playList.splice(deletePIndex, 1);
    let deleteSIndex = findSong(sequenceList, song);
    sequenceList.splice(deleteSIndex, 1);
    //删除完副本中的playlist给currentIndex做边界判断
    if (deletePIndex < currentIndex) {//删除歌曲在当前播放歌曲前面||当前歌曲是最后一个,当前播放-1;
        currentIndex--;
    };
    commit(types.SET_PLAY_LIST, playList);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENTINDEX, currentIndex);
    //如果当前播放列表清空删除
    const playFlag = playList.length > 0;
    commit(types.SET_PLAYING_STATE, playFlag);
}

export const clearPlayList = function ({ commit }) {  // 清空播放列表
    commit(types.SET_PLAY_LIST, []);
    commit(types.SET_SEQUENCE_LIST, []);
    commit(types.SET_CURRENTINDEX, -1);
    commit(types.SET_PLAYING_STATE, false);
}

//存储播放历史
export const savePlayHistoryAction = function ({ commit }, song) {
    commit(types.SET_PLAY_HISTORY, savePlayHistory(song));
}

//存储我的收藏
export const saveMyCollect = function ({ commit }, song) {
    commit(types.SET_COLLECT, saveCollectToLocal(song));
}
export const removeMyCollect = function ({ commit }, song) {
    commit(types.SET_COLLECT, removeCollectToLocal(song));
}
