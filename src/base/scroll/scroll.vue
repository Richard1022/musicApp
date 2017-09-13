<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
    props: {
        data: {
            type: Array,
            default: null
        },
        proboType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        _initScroll() { //初始化bscroll
            if (!this.$refs.wrapper) //如果没有bscroll 
            {
                return
            }
            this.scroll=new BScroll(this.$refs.wrapper, {
                click: this.click,
                proboType: this.proboType,
            })
        },
        refresh(){
            this.scroll&&this.scroll.refresh();
        },
        disabled(){
            this.scroll&&this.scroll.disabled();
        },
        enabled(){
            this.scroll&&this.scroll.enabled();
        }
    },
    mounted(){
        setTimeout(()=> {
            this._initScroll(); //初始化调用
        }, 20);
    },
    watch:{
        data(val,oldVal){
            let that=this;
            setTimeout(function() {
                that.refresh();
            }, 20);
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>


