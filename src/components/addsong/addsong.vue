<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @queryEvent="doSearch" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut">
     
        <div class="list-wrapper">
          <!-- <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong">
              </song-list>
            </div>
          </scroll> -->
          <!-- <scroll :refreshDelay="refreshDelay" ref="searchList" v-if="currentIndex===1" class="list-scroll"
                  :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll> -->
        </div>
      </div>
      <div class="search-result" v-show="selectTxt">
        <suggest @saveEvent="saveHistory" :showSinger="showSingerFlag" :queryTxt="selectTxt" ></suggest>
      </div>
      <!-- <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip> -->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import searchBox from "base/searchBox/searchBox";
import suggest from "components/suggest/suggest";
import {searchMixin} from "common/js/mixin";

export default {
  components: {
    searchBox,
    suggest
  },
  mixins:[
      searchMixin,
  ],
  data() {
    return {
      showFlag: false,
      showSingerFlag: false,
    //   selectTxt: "" 转至searchmixin
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },

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