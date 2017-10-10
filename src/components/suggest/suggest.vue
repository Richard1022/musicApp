<template>
    <div class="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="(item,index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text">{{getSearchName(item)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import { searchSong } from 'api/search';
import { ERR_OK } from 'api/config';

const SEARCH_TYPE = 'singer';

export default {
    props: {
        queryTxt: {
            type: String,
            default: ""
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            result: [],
        }
    },
    created() {

    },
    methods: {
        getIconClass(item) {
            if (item.type === SEARCH_TYPE){
                return 'icon-mine'
            }else{
                return 'icon-music'
            }
        },
        getSearchName(item){
            if(item.type === SEARCH_TYPE){
               return item.singername 
            }else{
                return `${item.songname}-${item.singer[0].name}`
            }
        },
        search() {
            searchSong(this.queryTxt, this.page, this.showSinger).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this.getResult(res.data);
                    console.log(this.result);
                }
            }, (rej) => {
                console.log('promise reject!!!')
            })
        },
        getResult(data) {
            let ret = [];
            if (data.zhida && data.zhida.singerid) {
                ret.push({ ...data.zhida, ...{ type: SEARCH_TYPE } });
            }
            if (data.song) {
                ret.push(...data.song.list);
            }
            return ret;
        }
    },
    watch: {
        queryTxt(newVal) {
            this.search();
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
    height: 100%;
    overflow: hidden;

    .suggest-list {
        padding: 0 30px;

        .suggest-item {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
        }

        .icon {
            flex: 0 0 30px;
            width: 30px;

            [class^='icon-'] {
                font-size: 14px;
                color: $color-text-d;
            }
        }

        .name {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-d;
            overflow: hidden;

            .text {
                no-wrap();
            }
        }
    }

    .no-result-wrapper {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>