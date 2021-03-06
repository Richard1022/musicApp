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
        <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
          <div class="middle-l" ref="middleLeft">
            <div class="cd-wrapper">
              <div class="cd" :class="rotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{currentPlayingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScroll" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper ">
              <div v-if="currentLyric ">
                <p ref="lyricLine" class="text " :class="{ 'current': currentLineNum===index} " v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom ">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
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
          <i class="icon-playlist " @click.stop="showControl"></i>
        </div>
      </div>
    </transition>
    <play-control ref="playControl"></play-control>
    <audio ref="audio" :src="currentSong.url " @ended="end " @play="ready " @timeupdate="updateTime "></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from "vuex";
import progressBar from "base/progressBar/progressBar";
import circleProgress from "base/circleProgress/circleProgress";
import { PlayerConfig } from "common/js/config"; //引入播放模式配置文件
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
import playControl from "components/playControl/playControl";
import { playModeMixin } from "common/js/mixin"; //引入全局混合

export default {
  mixins: [playModeMixin],
  data() {
    return {
      songReady: false, // 音乐准备完毕标识符
      currentTime: 0, //当前歌曲播放时间
      SVGsize: 32,
      currentLyric: null, //默认歌词为null
      currentLineNum: 0, //当前歌词行数
      currentShow: "cd", //当前显示
      currentPlayingLyric: "" //当前lyric
    };
  },
  created() {
    this.touch = {}; //created 生命周期 创建touch对象存储数据,无需getter,setter
  },
  components: {
    progressBar,
    circleProgress,
    Scroll,
    playControl
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      // 'playList',
      // 'currentSong',
      "playing_state",
      "currentIndex"
      // 'mode',
      // 'sequenceList',
    ]),
    disable() {
      return this.songReady ? "" : "disable";
    },
    rotate() {
      return this.playing_state ? "play" : "play pause";
    },
    playIcon() {
      return this.playing_state ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing_state ? "icon-pause-mini" : "icon-play-mini";
    },
    percentVal() {
      //播放进度百分比
      return this.currentTime / this.currentSong.duration;
    }
    // playMode() {
    //   return this.mode === PlayerConfig.sequence ? 'icon-sequence' : this.mode == PlayerConfig.loop ? 'icon-loop' : 'icon-random';
    // }
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULLSCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENTINDEX"
      // setMode: 'SET_MODE',
      // setPlayList: 'SET_PLAY_LIST',
    }),
    getLyric() {
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        if (this.playing_state) {
          this.currentLyric.play();
        }
        // console.log(this.currentLyric);
      });
    },
    handleLyric({ lineNum, txt }) {
      //lineNum 当前歌词行 ,当前歌词文本
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineElement = this.$refs.lyricLine[this.currentLineNum - 5];
        this.$refs.lyricScroll.scrollToElement(lineElement, 1000);
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000);
      }
      this.currentPlayingLyric = txt;
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
      if (this.currentLyric) {
        //loop循环 歌词回到顶部
        this.currentLyric.seek(0);
      }
    },
    // changePlayMode() { //commit setMode mutations
    //   let mode = (this.mode + 1) % 3; //播放模式
    //   let list = null; //reset list
    //   this.setMode(mode);
    //   if (mode == PlayerConfig.random) {  //随机打乱当前播放数组
    //     list = shuffleArr(this.playList);
    //   } else {
    //     list = this.sequenceList;
    //   };
    //   this.resetCurrentIndex(list);
    //   this.setPlayList(list);
    // },
    // resetCurrentIndex(list) {
    //   let index = list.findIndex((item) => {
    //     return item.id === this.currentSong.id;
    //   })
    //   this.setCurrentIndex(index);
    // },
    changePlayProgress(percent) {
      //滑动进度条
      const playCurrentTime = percent * this.currentSong.duration;
      this.$refs.audio.currentTime = playCurrentTime;
      if (!this.playing_state) {
        this.togglePlay();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(playCurrentTime * 1000);
      }
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlay() {
      if (!this.songReady) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.togglePlay(); //若暂停时currentlyric 同步暂停
      }
      this.setPlayingState(!this.playing_state); //通過getters获得状态管理模式的播放状态在通过mutations取反
    },
    nextSong() {
      if (!this.songReady) {
        //监听play事件 当媒介已就绪可以开始播放时运行的脚本。
        return;
      }
      if (this.playList.length == 1) {
        //边界处理  如果当前播放列表长度为1,调用nextsong,当前索引值不变,导致songID不变后续逻辑将不执行
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          //边界判断
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing_state) {
          //同步commit vuex播放状态mutations
          this.togglePlay();
        }
        this.songReady = false; //标识符还原
      }
    },
    prevSong() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length == 1) {
        //边界处理  如果当前播放列表长度为1,调用nextsong,当前索引值不变,导致songID不变后续逻辑将不执行
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing_state) {
          this.togglePlay();
        }
        this.songReady = false;
      }
    },
    ready() {
      this.songReady = true;
    },
    error() {
      console.log("ready error");
      this.songReady = true;
    },
    updateTime(event) {
      //timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
      this.currentTime = event.target.currentTime; //获取当前播放时间进度
    },
    paddingZero(str, num) {
      let len = str.toString().length;
      while (len < num) {
        str = "0" + str;
        len++;
      }
      return str;
    },
    formatSeconds(value) {
      //声明播放时间过滤器
      if (!value) {
        return "0";
      }
      let val = value | 0; //或0 相当于 调用Math.floor()下行取整
      let minutes = (val / 60) | 0;
      let seconds = val % 60;
      seconds = this.paddingZero(seconds, 2);
      return `${minutes}:${seconds}`;
    },
    middleTouchStart(e) {
      this.touch.initiated = true; //滑动开始标识符
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return; //标识符false return
      }
      const touch = e.touches[0];
      let offsetX = touch.pageX - this.touch.startX; //X轴滑动偏移量
      let offsetY = touch.pageY - this.touch.startY; //Y轴滑动偏移量
      if (Math.abs(offsetY) > Math.abs(offsetX)) {
        return; //纵向滑动 return
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth; //当前显示的middle左边距
      //width is lyric translate3D X `s value. 边界设定 min 0  max 375   cd status 左滑为0
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + offsetX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth); //偏移percent
      this.$refs.middleLeft.style.opacity = 1 - this.touch.percent; // 设置偏移透明度
      this.$refs.lyricScroll.$el.style.transitionDuration = "0ms"; //偏移动画过渡时间
      this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
    },
    middleTouchEnd(e) {
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          // cd status touchRight >10%
          offsetWidth = -window.innerWidth;
          this.currentShow = "lyric";
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        //当前状态为lyric  右滑为0
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      // console.log('endMove',offsetWidth,'percent',this.touch.percent);
      const transtionTime = 300;
      this.$refs.middleLeft.style.transtionDuration = `${transtionTime}ms`;
      this.$refs.middleLeft.style.opacity = opacity; // 设置偏移透明度
      this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricScroll.$el.style.transitionDuration = `${transtionTime}ms`;
    },
    showControl() {
      this.$refs.playControl.show();
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      //删除完播放列表时newVal为undefined,做边界判断
      if (!newVal.id) {
        return;
      }
      if (newVal.id === oldVal.id) {
        return; //切换模式时 当前播放歌曲的id 没有变化 则保持之前播放状态
      }
      if (this.currentLyric) {
        this.currentLyric.stop(); //如果之前有歌词 调用stop();
      }
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.getLyric();
      });
    },
    playing_state(newVal) {
      this.$nextTick(() => {
        let audio = this.$refs.audio;
        newVal ? audio.play() : audio.pause();
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom.top, .bottom .top, .bottom.top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

