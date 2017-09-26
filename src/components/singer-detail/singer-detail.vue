<template>
    <transition name="singerSlide">
        <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>
<script>
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song'; //引入歌单列表初始化方法
import musicList from 'components/music-list/music-list' //引入musiclist组件

export default {
    computed: {
        title() {
            return this.singerObj.name;
        },
        bgImage() {
            return this.singerObj.avatar;
        },

    },
    created() {
        this.singerObj = this.$store.state.singer
        if (!this.singerObj.id) {
            this.$router.push('/singer');//如果直接在当前歌手向前页面刷新,vuex state没有数据,则无法获取id,直接跳转singer路由
            return
        } else {
            getSingerDetail(this.singerObj.id).then((res) => {
                if (res.code === ERR_OK) {
                    this.songs = this.normalize(res.data.list);
                    // console.log(this.songs);
                }
            })
        }
    },
    methods: {
        normalize(list) {
            let ret = [];
            list.forEach((item, index) => {
                let { musicData } = item; //解构赋值 声明musicdata
                if (musicData.albumid && musicData.songid) {
                    ret.push(createSong(musicData));
                };
            });
            return ret;
        }
    },
    data() {
        return {
            songs: []
        }
    },
    components: {
        musicList
    }
}
</script>
<style lang="stylus">
@import "~common/stylus/variable"

        
.singerSlide-enter-active,singerSlider-leave-active
    transition all .3s
.singerSlide-enter,.singerSlide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

