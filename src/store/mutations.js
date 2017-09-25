import * as types from './mutations-types'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer;
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing_state = flag;
    },
    [types.SET_LOOP](state, flag) {
        state.loop = flag;
    },
    [types.SET_FULLSCREEN](state, flag) {
        state.fullScreen = flag;
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list;
    },
    [types.SET_PLAY_LIST](state, list) {
        state.playList = list;
    },
    [types.SET_MODE](state, mode) {
        state.mode = mode;
    },
    [types.SET_CURRENTINDEX](state, index) {
        state.currentIndex = index;
    }
}
export default mutations;