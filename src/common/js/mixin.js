import { mapGetters, mapActions, mapMutations } from 'vuex';
import { shuffleArr } from 'common/js/util' //引入util.js 的洗牌数组
import { PlayerConfig } from 'common/js/config' //引入播放模式配置文件
import { searchKey } from 'common/js/cache';

export const myMixin = {
    computed: {
        ...mapGetters([
            'playList',
        ])
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(this.playList);
        }
    },
    mounted() {
        this.handlePlayList(this.playList);
    },
    activated() {
        this.handlePlayList(this.playList);
    },
    methods: {
        handlePlayList() {
            throw new Error('component must have handlePlayList');
        }
    }
}

export const playModeMixin = {
    computed: {
        playMode() {
            return this.mode === PlayerConfig.sequence ? 'icon-sequence' : this.mode == PlayerConfig.loop ? 'icon-loop' : 'icon-random';
        },
        ...mapGetters([
            'mode',
            'sequenceList',
            'playList',
            'currentSong'
        ])
    },
    methods: {
        changePlayMode() { //commit setMode mutations
            let mode = (this.mode + 1) % 3; //播放模式
            let list = null; //reset list
            this.setMode(mode);
            if (mode == PlayerConfig.random) {  //随机打乱当前播放数组
                list = shuffleArr(this.playList);
            } else {
                list = this.sequenceList;
            };
            this.resetCurrentIndex(list);
            this.setPlayList(list);
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id;
            })
            this.setCurrentIndex(index);
        },
        ...mapMutations({
            setFullScreen: 'SET_FULLSCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENTINDEX',
            setMode: 'SET_MODE',
            setPlayList: 'SET_PLAY_LIST',
        }),
    }
}

export const searchMixin = {
    data() {
        return {
            selectTxt: '',
        }
    },
    computed: {

    },
    methods: {
        doSearch(newQuery) {
            this.selectTxt = newQuery;
        },
        saveHistory(item) {
            //转至 searchmixin
            this.saveSearchHistory(this.selectTxt);
        },
        ...mapMutations({
            setHistory: 'SET_HISTORY'
        }),
        ...mapActions([
            'saveSearchHistory'
        ]),
        deleteList(paraItem) {
            let storageSearchList = JSON.parse(localStorage.getItem(searchKey));
            let deleteIndex = storageSearchList.findIndex((item) => {
                return item === paraItem
            });
            storageSearchList.splice(deleteIndex, 1);
            this.setHistory(storageSearchList);
            //重新存储localstorage需要序列化
            storageSearchList = JSON.stringify(storageSearchList);
            localStorage.setItem(searchKey, storageSearchList);
        },
    }
}