<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hideAdd">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @queryEvent="doSearch"  :placeholder="'搜索歌曲'"></search-box>
      </div>
      <div class="shortcut" v-show="!selectTxt">
        <switches :switches="switchArr" @switch="switchChange" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper" >
            <scroll ref="zeroScroll" class="list-scroll" :data="getPlayHistory" v-show="currentIndex==0">
               <div class="list-inner">
              <song-list @select="playHistorytSong" :songs="getPlayHistory"></song-list>
               </div>
            </scroll>
        <scroll ref="oneScroll" :data="getSearchHistory" class="list-scroll" v-show="currentIndex==1">
        <div class="list-inner">
            <search-list @slelectSearch="addSelectTxt" :searches="getSearchHistory"></search-list>
         </div>
        </scroll>
         </div>
      </div>
      <div class="search-result" v-show="selectTxt">
        <suggest :queryTxt="selectTxt" :showSinger="showSinger" @saveEvent="saveHistory" ></suggest>
      </div>
      <tips ref="tips">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </tips>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import searchBox from "base/searchBox/searchBox";
import suggest from "components/suggest/suggest";
import { mapActions, mapGetters } from "vuex";
import { searchMixin } from "common/js/mixin";
import switches from "base/switches/switches";
import scroll from "base/scroll/scroll";
import songList from "base/song-list/song-list";
import Song from "common/js/song";
import searchList from "base/searchList/searchList";
import tips from "base/tips/tips";

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      // selectTxt: "", //搜索关键字  mixin
      showSinger: false, //搜索歌手flag
      switchArr: [{ name: "最近播放" }, { name: "搜索历史" }],
      currentIndex: 0
    };
  },
  components: {
    searchBox,
    suggest,
    switches,
    scroll,
    songList,
    searchList,
    tips
  },
  computed: {
    ...mapGetters(["getPlayHistory", "getSearchHistory"])
  },
  methods: {
    showAdd() {
      this.showFlag = true;
      if (this.currentIndex == 0) {
        setTimeout(() => {
          this.$refs.zeroScroll.refresh();
        }, 20);
      } else if (this.currentIndex == 1) {
        setTimeout(() => {
          this.$refs.oneScroll.refresh();
        }, 20);
      }
    },
    hideAdd() {
      this.showFlag = false;
    },
    switchChange(index) {
      this.currentIndex = index;
    },
    playHistorytSong(item, index) {
      if (index != 0) {
        this.insertSearchSong(new Song(item));
      }
      this.$refs.tips.show();
    },
    addSelectTxt(item) {
      this.$refs.searchBox.queryTxt = item;
      this.$refs.tips.show();
    },
    ...mapActions(["insertSearchSong"])
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
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
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }

    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>