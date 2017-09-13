<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span v-for="(item,index) in dots" class="dot" :class="{'active':currentIndex==index}"></span>
        </div>
    </div>
</template>
<script>
import { addClass } from 'common/js/dom' //引入DOM addclass方法
import BScroll from 'better-scroll' //引入betterscroll

export default {
    props: {
        loop: {
            type: Boolean,
            default: true // 默认循环
        },
        interval: {
            type: Number,
            default: 4000 // 默认间隔4秒
        },
        autoPlay: {
            type: Boolean,
            default: true //默认自动播放
        }
    },
    data() {
        return {
            dots: [],
            currentIndex: 0
        }
    },
    mounted() {
        setTimeout(() => {
            this._setSliderWidth(); // 初始化 slidergroup 宽度
            this._initDots();       //初始化 滑块
            this._initSlider();     //初始化 BScroll
            if (this.autoPlay) {
                this._play();
            }
        }, 20);
        window.addEventListener('resize',()=>{  //监听页面大小改变事件,true:重设宽度 重新初始化bscroll
            if(!this.slider)
            {
                return 
            }
            this._setSliderWidth(true);
            this.slider.refresh();
        })
    },
    destroyed(){
         clearTimeout(this.timer)
    },
    beforeDestroy(){
         clearTimeout(this.timer)
    },
    methods: {
        _setSliderWidth(isResize) {
            this.children = this.$refs.sliderGroup.children; //slidergroup内的子元素 slot插槽元素
            let width = 0;
            let sliderWidth = this.$refs.slider.clientWidth; // 获取当前slider组件的宽度
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                addClass(child, "slider-item");
                child.style.width = sliderWidth + "px";
                width += sliderWidth;
            }
            if (this.loop && !isResize) {
                width += 2 * sliderWidth
            }
            this.$refs.sliderGroup.style.width = width + "px";
        },
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapLoop: this.loop,
                snapThreshold: 0.3,
                snapSpeed: 400,
            })
            this.slider.on('scrollEnd', () => {
                let pageIndex = this.slider.getCurrentPage().pageX
                if (this.loop) {
                    pageIndex -= 1
                }
                this.currentIndex = pageIndex

                if (this.autoPlay) {
                    this._play()
                }
            })
        },
        _initDots() {
            this.dots = new Array(this.children.length);
        },
        _play() {
            let pageIndex = this.currentIndex + 1; //自动播放方法
            if (this.loop) {
                pageIndex += 1; //如果开启循环 首尾各加一页  
            }
            this.timer = setTimeout(() => {
                this.slider.goToPage(pageIndex, 0, 400)
            }, this.interval);

        }
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position : relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>