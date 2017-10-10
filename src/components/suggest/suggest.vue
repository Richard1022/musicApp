<template>
    <div class="suggest">
        <ul class="suggest-list">
            <li>
                <div class="icon"></div>
                <div class="name">
                    <p class="text"></p>
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
    methods: {
        search() {
            searchSong(this.queryTxt, this.page, this.showSinger).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this.getResult(res.data);
                }
            }, (rej) => {
                console.log('promise reject!!!')
            })
        },
        getResult(data) {
            let ret = [];
            if (data.zhida && data.zhida.singerid) {
                ret.push({ ...data.zhida, ...{ type:SEARCH_TYPE}});
            }
            if(data.song){
                ret.push(data.song.list);
            }
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