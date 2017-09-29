<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" height="100%" width="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" :class="rotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScroll" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper ">
              <div v-if="currentLyric ">
                <p ref="lyricLine " class="text " :class="{ 'current': currentLineNum===index} " v-for="(line,index) in currentLyric.lines ">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom ">
          <div class="progress-wrapper ">
            <span class="time time-l ">{{formatSeconds(currentTime)}}</span>
            <div class="progress-bar-wrapper ">
              <progress-bar @percentChange="changePlayProgress " :percent="percentVal "></progress-bar>
            </div>
            <span class="time time-r ">{{formatSeconds(currentSong.duration)}}</span>
          </div>
          <div class="operators ">
            <div class="icon i-left ">
              <i :class="playMode " @click="changePlayMode "></i>
            </div>
            <div class="icon i-left " :class="disable ">
              <i class="icon-prev " @click="prevSong "></i>
            </div>
            <div class="icon i-center " :class="disable ">
              <i :class="playIcon " @click="togglePlay "></i>
            </div>
            <div class="icon i-right " :class="disable ">
              <i class="icon-next " @click="nextSong "></i>
            </div>
            <div class="icon i-right ">
              <i class="icon icon-not-favorite "></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini ">
      <div class="mini-player " v-show="!fullScreen " @click="open ">
        <div class="icon ">
          <img :class="rotate " :src="currentSong.image " width="40 " height="40 ">
        </div>
        <div class="text ">
          <h2 class="name " v-html="currentSong.name "></h2>
          <p class="desc " v-html="currentSong.singer "></p>
        </div>
        <div class="control ">
          <circle-progress :radius="SVGsize " :percent="percentVal ">
            <i class="icon-mini " :class="miniIcon " @click.stop.prevent="togglePlay "></i>
          </circle-progress>
        </div>
        <div class="control ">
          <i class="icon-playlist "></i>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url " @ended="end " @play="ready " @timeupdate="updateTime "></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import progressBar from 'base/progressBar/progressBar'
import circleProgress from 'base/circleProgress/circleProgress'
import { PlayerConfig } from 'common/js/config' //引入播放模式配置文件
import { shuffleArr } from 'common/js/util' //引入util.js 的洗牌数组
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

export default {
  data() {
    return {
      songReady: false,// 音乐准备完毕标识符
      currentTime: 0,//当前歌曲播放时间
      SVGsize: 32,
      currentLyric: null, //默认歌词为null
      currentLineNum: 0, //当前歌词行数
    }
  },
  components: {
    progressBar,
    circleProgress,
    Scroll,
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing_state',
      'currentIndex',
      'mode',
      'sequenceList',
    ]),
    disable() {
      return this.songReady ? '' : 'disable'
    },
    rotate() {
      return this.playing_state ? 'play' : 'play pause'
    },
    playIcon() {
      return this.playing_state ? 'icon-pause' : 'icon-play';
    },
    miniIcon() {
      return this.playing_state ? 'icon-pause-mini' : 'icon-play-mini';
    },
    percentVal() { //播放进度百分比
      return this.currentTime / this.currentSong.duration;
    },
    playMode() {
      return this.mode === PlayerConfig.sequence ? 'icon-sequence' : this.mode == PlayerConfig.loop ? 'icon-loop' : 'icon-random';
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENTINDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST',
    }),
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        if (this.playing_state) {
          this.currentLyric.play();
        }
        console.log(this.currentLyric);
      })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineElement = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricScroll.scrollToElement(lineElement, 1000);
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000);
      }
    },
    end() {
      if (this.mode === PlayerConfig.loop) {
        this.loop();
      } else {
        this.nextSong();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
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
    changePlayProgress(percent) {
      this.$refs.audio.currentTime = percent * this.currentSong.duration;
      if (!this.playing_state) {
        this.togglePlay();
      }
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true)
    },
    togglePlay() {
      this.setPlayingState(!this.playing_state);//通過getters获得状态管理模式的播放状态在通过mutations取反
    },
    nextSong() {
      if (!this.songReady) {  //监听play事件 当媒介已就绪可以开始播放时运行的脚本。
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {  //边界判断
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing_state) {   //同步commit vuex播放状态mutations
        this.togglePlay();
      }
      this.songReady = false;  //标识符还原
    },
    prevSong() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing_state) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      console.log('ready error')
      this.songReady = true;
    },
    updateTime(event) {  //timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
      this.currentTime = event.target.currentTime;  //获取当前播放时间进度
    },
    paddingZero(str, num) {
      let len = str.toString().length;
      while (len < num) {
        str = "0" + str;
        len++;
      }
      return str;
    },
    formatSeconds(value) { //声明播放时间过滤器
      if (!value) {
        return "0";
      }
      let val = value | 0; //或0 相当于 调用Math.floor()下行取整
      let minutes = val / 60 | 0;
      let seconds = val % 60;
      seconds = this.paddingZero(seconds, 2);
      return `${minutes}:${seconds}`;
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (newVal.id === oldVal.id) {
        return  //切换模式时 当前播放歌曲的id 没有变化 则保持之前播放状态 
      };
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.getLyric();
      })
    },
    playing_state(newVal) {
      this.$nextTick(() => {
        let audio = this.$refs.audio;
        newVal ? audio.play() : audio.pause();
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom.top, .bottom  .top, .bottom.top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>

