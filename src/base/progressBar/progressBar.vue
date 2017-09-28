<template>
    <div class="progress-bar" ref="processBar" @click="clickChangeProgress">
        <div class="bar-inner">
            <div class="progress" ref="doneProgress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
const BTN_WIDTH = 16; //按钮宽度

export default {
    props: {
        percent: {  //父组件传入precent 参数  控制百分比
            type: Number,
            default: 0
        }
    },
    created() {
        this.touch = {}; //创建一个无需双向数据绑定的实时监听的实例属性
    },
    methods: {
        progressTouchStart(e) {
            this.touch.initiated = true; //初始化touch标识符
            this.touch.startX = e.touches[0].pageX; //获得touch start 开始的 pageX的pageX坐标
            this.touch.left = this.$refs.doneProgress.clientWidth; // 已播放宽度
        },
        progressTouchMove(e) {
            //判断 是否初始化touch标识符
            if (!this.touch.initiated) {
                return
            };
            const slideX = e.touches[0].pageX - this.touch.startX; // slideX 滑动偏移量
            //已播放位置+滑动偏移量 边界设定 最小为0  最大为 进度条宽度;
            const offsetWidth = Math.min(this.$refs.processBar.clientWidth, Math.max(0, this.touch.left + slideX));
            this.domOffset(offsetWidth);
        },
        progressTouchEnd(e) {
            this.touch.initiated = false; //滑动结束  改变标识符 派发事件
            this.distributeProgress(); //向父组件派发百分比
        },
        clickChangeProgress(e){
           this.domOffset(e.offsetX);
           this.distributeProgress();
        },
        distributeProgress() {
            const barWidth =this.$refs.processBar.clientWidth - BTN_WIDTH; 
            const percent=this.$refs.doneProgress.clientWidth/barWidth;
            this.$emit('percentChange',percent);
        },
        domOffset(offsetLeftWidth) {//操作dom 
            this.$refs.doneProgress.style.width = `${offsetLeftWidth}px`;
            this.$refs.progressBtn.style.transform = `translate3d(${offsetLeftWidth}px,0,0)`
        }
    },
    watch: {
        percent(newVal) { //监听百分比
            if (newVal >= 0 && !this.touch.initiated) { //滑动时  不回调
                let barWidth = this.$refs.processBar.clientWidth - BTN_WIDTH;//进度条行程
                let offsetLeftWidth = newVal * barWidth;
                this.domOffset(offsetLeftWidth);
            }
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>