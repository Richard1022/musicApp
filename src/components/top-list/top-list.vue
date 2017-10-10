<template>
    <transition name="slide">
        <music-list :rank="rankSign" :title="titleTxt" :bgImage="backgroundImg" :songs="rankSongs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import musicList from 'components/music-list/music-list';
import { mapGetters } from 'vuex';
import { getMusicList } from 'api/rank';
import { createSong } from 'common/js/song';
import { ERR_OK } from 'api/config';

export default {
    components: {
        musicList
    },
    data() {
        return {
            rankSongs: [],
            rankSign:true,
        }
    },
    computed: {
        ...mapGetters([
            'topList'
        ]),
        titleTxt() {
            return this.topList.topTitle;
        },
        backgroundImg() {
            if (this.rankSongs.length) {  //rankSongs列表数据获取完毕时
                return this.rankSongs[0].image;
            } else {
                // return this.topList.picUrl;
                return "";
            }
        }
    },
    created() {
        this._getMusicList()
    },
    methods: {
        _getMusicList() {
            if (!this.topList.id) {  //若在当前页面直接refresh  ,vueX没有data,直接返回上级路由
                this.$router.push('/rank');
                return;
            }
            getMusicList(this.topList.id).then((res) => {
                if (res.code === ERR_OK) {
                    // console.log(res.songlist,'songList')
                    this.rankSongs = this.normalizeRankSong(res.songlist);
                    // console.log( this.rankSongs);
                }
            }, (rej) => {
                console.log('get error')
            })
        },
        normalizeRankSong(list) {
            let ret = [];
            list.forEach((item, index, self) => {
                if (item.data.albumid && item.data.songid) {
                    ret.push(createSong(item.data));
                }
            });

            return ret;
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>