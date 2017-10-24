import { mapGetters, mapMutations, mapActions } from 'vuex';
import { shuffleArr } from 'common/js/util' //引入util.js 的洗牌数组
import { PlayerConfig } from 'common/js/config' //引入播放模式配置文件

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
    methods: {
        doSearch(newQuery) {
            this.selectTxt = newQuery;
        },
        saveHistory(item) {
            this.saveSearchHistory(this.selectTxt);
        },
        ...mapActions([
            'saveSearchHistory'
        ]),
    }
}
export const favoriteMixin = {
    computed:{
        ...mapGetters([
            'getMyCollect'
        ])
    },
    methods: {
        ...mapActions(["saveMyCollect", "removeMyCollect"]),
        getFavourCls(song) {
            if (this.isFavorSong(song)) {
                return "icon-favorite";
            } else {
                return "icon-not-favorite";
            }
        },
        isFavorSong(song) {
            let index = this.getMyCollect.findIndex((item) => {
                return item.id === song.id;
            });
            if (index == -1) {
                return false;
            } else {
                return true;
            }
        },
        changeCollect(song) {
            if (this.isFavorSong(song)) {
                this.removeMyCollect(song);
            } else {
                this.saveMyCollect(song)
            }
        },
    }
}