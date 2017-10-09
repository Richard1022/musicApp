<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" class="list" ref="srcollFix">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading :title="'正在获取歌单列表...'"></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import songList from 'base/song-list/song-list';//引入songlist base组件
import scroll from 'base/scroll/scroll' //引入scroll组件
import loading from 'base/loading/loading'
import { mapActions } from 'vuex'
import { myMixin } from 'common/js/mixin' //引入全局混合

export default {
  mixins: [
    myMixin
  ],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  methods: {
    handlePlayList(playList) {
      // console.log('mixin');
      const bottomOffset = playList.length > 0 ? '60px' : 0;
      this.$refs.srcollFix.$el.style.bottom = bottomOffset;
       this.$refs.srcollFix.refresh();
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) { //监听songlist歌曲单击事件,调用vueX actions 批量提交mutations
      this.selectPlay({ list: this.songs, index });
    },
    random() {
      this.randomPlay({ list: this.songs });
    },
    ...mapActions([
      'selectPlay',
      'randomPlay',
    ])
  },
  components: {
    songList,
    scroll,
    loading
  },
  mounted() {  //挂在之后的hook 设置滚动区域的上边距为背景头像的高度
    this.$refs.srcollFix.$el.style.top = `${this.$refs.bgImage.clientHeight}px`;
  }
}
</script>
<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      overflow hidden
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>


