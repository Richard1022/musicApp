<template>
    <transition name="singerSlide">
        <div class="singer-detail">

        </div>
    </transition>
</template>
<script>
export default {

}
</script>
<style lang="stylus">
@import "~common/stylus/variable"
    .singer-detail
        position fixed
        left 0
        top 0
        bottom 0
        right 0
        z-index 100
        background $color-background
        
.singerSlide-enter-active,singerSlider-leave-active
    transition all .3s
.singerSlide-enter,.singerSlide-leave-to
    transform: translate3d(100%, 0, 0)

</style>

