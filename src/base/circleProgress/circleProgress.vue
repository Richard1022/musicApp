<template>
    <div class="progress-circle">
        <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
            <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" />
        </svg>
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
// stroke-dasharray：定义描边的虚线长度，如果提供奇数个，则会自动复制该值成偶数
// stroke-dashoffset：定义虚线描边的偏移量（在路径开始的前面，看不到）
export default {
    props: {
        radius: { //SVG宽高
            type: Number,
            default: 100
        },
        percent: {
            type: Number,
            default: 100
        }
    },
    data() {
        return {
            dashArray: 2 * Math.PI * 50,
        }
    },
    computed: {
        dashOffset() {
            return this.percent * this.dashArray;
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>