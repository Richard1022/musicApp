import * as types from './mutations-types'

export const selectPlay =function({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST,list);
    commit(types.SET_PLAY_LIST,list);
    commit(types.SET_CURRENTINDEX,index);
    commit(types.SET_FULLSCREEN,true);
    commit(types.SET_PLAYING_STATE,true);
}