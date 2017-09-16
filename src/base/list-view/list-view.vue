<template>
  <scroll class="listview" :data="data" ref="listView" :listenScroll="listenScroll" :probeType="probeType" @scroll="scrollParent">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut" @touchstart.stop.prevent="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <li class="item" v-for="(item,index) in shortcutList" :data-index="index">{{item}}</li>
    </ul>
    <div class="loading-container" v-show="!data.length">
      <loading :title="'歌手正在赶来的路上'"></loading>
    </div>
  </scroll>
</template>
<script>
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading' //引入懒加载gif组件
import { getData } from 'common/js/dom' //引入获取/设置自定义attribute

const ANCHOR_HEIGHT = 18;//常亮 anchor高度
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  created() {
    //创造钩子时,创建不需要双向数据绑定的数据
    this.touch = {};
    this.listenScroll = true;
    this.probeType = 3;
    this.scrollY = -1; //事实Y轴滚动距离
    this.listHeight = []; //listGroup高度数组
  },
  components: {
    scroll,
    loading
  },
  computed: {
    shortcutList() { //计算出 列表的首字母集合
      let arr = [];
      this.data.map((currentVal, index, self) => {
        arr.push(currentVal.title.substring(0, 1));
      });
      return arr;
    },
  },
  methods: {
    onShortCutTouchStart(event) {
      let anchor = getData(event.target, "index"); //获取触摸事件源的index
      this.touch.y1 = event.touches[0].pageY; //获取触摸事件首次触摸式的pageY的值
      this.touch.anchor = anchor;  //首次触摸时的的索引
      this._scrollTo(anchor);
    },
    onShortCutTouchMove(event) {
      this.touch.y2 = event.touches[0].pageY;//或许滑动时的实时pageY
      //滑动时的pageY-滑动start的pageY / const 滑块的高度 return 滑块个数
      let differentVal = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT;  //当前 滑动结束时anchor个数
      let anchorIndex = parseInt(differentVal) + parseInt(this.touch.anchor);
      this._scrollTo(anchorIndex);
    },
    scrollParent(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0);
    },
    caculateHeight() { //计算高度方法
      this.listHeight = [];
      let lists = this.$refs.listGroup;//获取所有的listGroups
      let height = 0; //初始高度为0,第一个元素的顶部Y为0
      this.listHeight.push(height);
      for (let i = 0; i < lists.length; i++) {
        let item = lists[i];
        height += item.clientHeight;
        this.listHeight.push(height);//将每个listgroup的高度推入数组
      }
    }
  },
  watch:{
    data(){
      setTimeout(()=>{
        this.caculateHeight();
        console.log(this.listHeight);
      }, 20);
    }
  }
}
</script>
<style lang="stylus">
 @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

