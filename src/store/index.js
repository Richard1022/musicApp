import Vue from 'vue'; //引入vue,vuex
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
// import state from './state'
// import mutations from './mutations'

Vue.use(Vuex);

// const debug =process.eny.NODE_ENV !=='production';


export default new Vuex.Store({
    state: {
        singer: {
            name:"defaultName"
        }
    },
    mutations:{
        setSinger(state,payload){ //paylaod为commit时第一个参数对象
            // console.log(payload); 
            state.singer=payload;
        }
    },

    // actions ,
    // getters,
    // state,
    // mutations,
    // strict:debug,
    // plugins:debug ? [createLogger()]:[]

});
