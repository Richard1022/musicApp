<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="randomPlay">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
            <scroll ref="zeroScroll" class="list-scroll" :data="getMyCollect"  v-show="currentIndex==0">
               <div class="list-inner">
                   <song-list @select="playLikeSong" :songs="getMyCollect"></song-list>
               </div>
            </scroll>
            <scroll ref="twoScroll" class="list-scroll" :data="getPlayHistory"  v-show="currentIndex==1">
               <div class="list-inner">
                 <song-list @select="playLikeSong" :songs="getPlayHistory"></song-list>
               </div>
            </scroll>
      </div>
      <div class="no-result-wrapper">
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import switches from "base/switches/switches";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
//   import NoResult from 'base/no-result/no-result'
import Song from "common/js/song";
import { mapGetters, mapActions } from "vuex";
//   import {playlistMixin} from 'common/js/mixin'

export default {
  data() {
    return {
      switches: [
        {
          name: "我得收藏"
        },
        {
          name: "最近播放"
        }
      ],
      currentIndex: 0,
      moocdata: []
    };
  },
  computed: {
    ...mapGetters(["getPlayHistory", "getMyCollect"])
  },
  methods: {
    back() {
      this.$router.back();
    },
    randomPlay() {
      let list =
        this.currentIndex === 0 ? this.getMyCollect : this.getPlayHistory;
      list = list.map(item => {
        return new Song(item);
      });
      this.randomPlay({ list });
    },
    switchItem(index) {
      this.currentIndex = index;
      if (this.currentIndex == 0) {
        setTimeout(() => {
          this.$refs.zeroScroll.refresh();
        }, 20);
      } else if (this.currentIndex == 1) {
        setTimeout(() => {
          this.$refs.twoScroll.refresh();
        }, 20);
      }
    },
    playLikeSong(item) {
      this.insertSearchSong(new Song(item));
    },
    ...mapActions(["insertSearchSong", "randomPlay"])
  },
  components: {
    switches,
    Scroll,
    SongList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px 0;
  }

  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;

    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }

  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>