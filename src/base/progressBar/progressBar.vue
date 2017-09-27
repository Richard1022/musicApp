<template>
    <div class="progress-bar" ref="processBar">
        <div class="bar-inner">
            <div class="progress" ref="doneProgress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
const BTN_WIDTH=16; //按钮宽度

export default {
    props: {
        precent: {  //父组件传入precent 参数  控制百分比
            type: Number,
            default: 0
        }
    },
    mounted(){
        // console.log(this.$refs.progressBtn.clientWidth)
    },
    watch: {
        precent(newVal) { //监听百分比
            let barWidth = this.$refs.processBar.clientWidth - BTN_WIDTH;//进度条行程
            let offsetLeftWidth= newVal*barWidth;
            this.$refs.doneProgress.style.width=`${offsetLeftWidth}px`;  //操作dom 
            this.$refs.progressBtn.style.transform=`translate3d(${offsetLeftWidth}px,0,0)`
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