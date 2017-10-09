<template>
  <scroll class="listview" :data="data" ref="listView" :listenScroll="listenScroll" :probeType="probeType" @scroll="scrollParent">
    <ul>
      <li class="list-group" v-for="(group,index) in data" ref="listGroup" :key="index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="(item,index) in group.item" :key="index">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut" @touchstart.stop.prevent="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
      <li class="item" v-for="(item,index) in shortcutList" :key="index" :data-index="index" :class="{'current':index===currentIndex}">{{item}}</li>
    </ul>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">
        {{fixedTitle}}
      </div>
    </div>
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
const TITLE_HEIGHT = 30; //fixedtitle高度
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
    this.listHeight = []; //listGroup高度数组
  },
  data() {
    return {
      scrollY: -1, //事实Y轴滚动距离
      currentIndex: 0,
      // listHeight:[],
      diff: -1, //title和fixtitle之间的距离
    }
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
    fixedTitle() {//歌手页固定头部
      if (this.scrollY >= 0) {
        return "";
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
    }
  },
  methods: {
    refresh(){
      this.$refs.listView.refresh();
      // console.log('refresh success!')
    },
    selectItem(item) {
      this.$emit('select', item);//子父组件通信传递item
    },
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
      this.scrollY = -this.listHeight[index];
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
  watch: {
    data() {
      setTimeout(() => {
        this.caculateHeight();
      }, 20);
    },
    scrollY(newVal, oldVal) {
      let listHeight = this.listHeight; //listgroup高度数组
      // console.log(this.listHeight)
      if (newVal > 0) {
        this.currentIndex = 0; //scrollY的值为负数,向下拉动,若大于0 则在顶部 直接返回
        return
      };
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newVal >= height1 && -newVal < height2) {
          this.diff = height2 + newVal; //差值= 下限- Y轴纵向偏移量
          this.currentIndex = i;
          return
        }
      };
      //当滚动滚动到最底部,scrollY大于数组最后一个的值
      // this.currentIndex=listHeight.length-2
    },
    diff(newVal) {
      //检测 固定标题之间的差值 若差值慢慢变小,则3d偏移,否则不做dom操作
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
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
      top: -1px
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

