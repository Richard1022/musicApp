<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    props: {
        data: {  //传入data属性 watch监听变动,若变动scroll refresh
            type: Array,
            default: []
        },
        probeType: { //滚动距离监听等级123
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        listenScroll: { //监听scroll prop true时  init方法中调用
            type: Boolean,
            default: false
        },
        pullUp: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        _initScroll() { //初始化bscroll
            if (!this.$refs.wrapper) //如果没有bscroll 
            {
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                click: this.click,
                probeType: this.probeType,
            });
            if (this.listenScroll) {
                let vm = this;
                this.scroll.on("scroll", (pos) => {
                    vm.$emit("scroll", pos);//子组件响度组件通信,父组件监听scroll事件获取传递参数pos
                })
            };
            if (this.pullUp) {
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToBottom'); //监听滑动到底部派发事件
                    }
                })
            }
        },
        refresh() {
            this.scroll && this.scroll.refresh();
        },
        disabled() {
            this.scroll && this.scroll.disabled();
        },
        enabled() {
            this.scroll && this.scroll.enabled();
        },
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
        }
    },
    mounted() {
        setTimeout(() => {
            this._initScroll(); //初始化调用
        }, 500);
        window.addEventListener("resize", () => {
            if (!this.scroll) {
                this._initScroll();
            }
            this.scroll && this.scroll.refresh()
        });
    },
    watch: {
        data(val, oldVal) {
            let that = this;
            setTimeout(function() {
                that.refresh();
            }, 20);
        }
    }
}
</script>
<style lang="stylus" scoped>
</style>


