<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList" :listenScroll="true">
      <div>
        <div v-if="recommends.length" class="recomend-wrapper">
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a class="needsclick" :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h2 class="list-title">热门歌单推荐</h2>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="(item,index) in discList" :key="index">
              <div class="icon">
                <img v-lazy="item.imgurl" height="60" width="60">
              </div>
              <div class="text">
                <h2 class="name" v-text="item.creator.name"></h2>
                <p class="desc" v-text="item.dissname"></p>
              </div>
            </li>
          </ul>
          <div class="loading-wrapper" v-show="!discList.length">
            <loading :title="'歌单正在努力加载中...'"></loading>
          </div>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend } from 'api/recommend'  // 引入getremonmend方法 获取推荐页数据
import { ERR_OK } from 'api/config'  // 引入常规常量参数
import slider from 'base/slider/slider' // 引入slider基础轮播组件
import { getDiscList } from 'api/recommend'
import scroll from 'base/scroll/scroll' //引入 scroll 组件
import loading from 'base/loading/loading' //引入加载gif组件
import { myMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [
    myMixin
  ],
  data() {
    return {
      recommends: [],
      discList: [],
    }
  },
  components: {
    slider,
    scroll,
    loading,
  },
  methods: {
    ...mapMutations({
      SET_DESC: 'SET_DESC', ////映射 this.SET_DESC() 为 this.$store.commit('SET_DESC') 
    }),
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.SET_DESC(item);
    },
    handlePlayList(playList) {
      const bottomOffset = playList.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottomOffset;
      this.$refs.scroll.refresh();
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list); //接受代理请求到的数据
          this.discList = res.data.list
        }
      })
    },
    loadImage() { //图片加载出一次即可撑开高度
      if (!this.checkImage) {
        this.$refs.scroll.refresh();
      }
    }
  },
  created() {
    this._getRecommend();
    setTimeout(() => {
      this._getDiscList();
    }, 200);
  },
  computed: {

  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>