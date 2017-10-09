<template>
    <transition name="slide">
        <music-list v-if="songList.length" :title="title" :bgImage="bgImage" :songs="songList"></music-list>
    </transition>
</template>
<script>
import musicList from 'components/music-list/music-list';
import { mapGetters } from 'vuex';
import { getSongMenu } from 'api/recommend';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';


export default {
    data() {
        return {
            songList: [],
        }
    },
    components: {
        musicList
    },
    computed: {
        ...mapGetters([
            'desc'
        ]),
        title() {
            return this.desc.dissname
        },
        bgImage() {
            return this.desc.imgurl
        }
    },
    created() {
        this._getSongMenu(this.desc.dissid);
    },
    methods: {
        _getSongMenu(id) {
            if (!id) {
                this.$router.push({
                    path: '/recommend'
                })
            }
            getSongMenu(id).then((res) => {
                if (res.code === ERR_OK) {
                    this.songList = this.normalizeSong(res.cdlist[0].songlist);
                    // console.log(this.songList)
                }
            }, (req) => {
                console.log('axios failed')
            })
        },
        normalizeSong(list) {
            let ret = [];
            list.forEach((item, index, self) => {
                if (item.albumid && item.songid) {
                    ret.push(createSong(item));
                }
            });
            return ret;
        }
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
