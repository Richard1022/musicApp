//getters 相当于 store 的计算属性
export const singer = state => state.singer

export const playing_state = state => state.playing_state

export const loop = state => state.loop;

export const fullScreen = state => state.fullScreen;

export const sequenceList = state => state.sequenceList;

export const playList = state => state.playList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}; //返回vueX播放列表的currentindex
}

export const desc = state => state.desc;

export const topList = state => state.topList;

export const getSearchHistory = state => state.searchHistory;

export const getPlayHistory = state => state.playHistory;