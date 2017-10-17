<template>
    <scroll ref="suggestScroll" class="suggest" :data="result" :pullUp="pullUp" @scrollToBottom="searchMore">
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text">{{getSearchName(item)}}</p>
                </div>
            </li>
            <loading v-show="hasMore" title="loading..."></loading>
        </ul>
    </scroll>
</template>

<script type="text/ecmascript-6">
import { searchSong } from 'api/search';
import { ERR_OK } from 'api/config';
import { createSong } from 'common/js/song';
import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
import Singer from 'common/js/singer';
import { mapMutations } from 'vuex';
import { mapActions } from 'vuex';

const SEARCH_TYPE = 'singer';
const perpage = 20; //单次搜索数量

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
            pullUp: true,
            hasMore: true, //搜索更多sign
        }
    },
    created() {

    },
    methods: {
        getIconClass(item) {
            if (item.type === SEARCH_TYPE) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getSearchName(item) {
            if (item.type === SEARCH_TYPE) {
                return item.singername
            } else {
                return `${item.name}-${item.singer}`
            }
        },
        search() {
            this.hasMore = true;
            this.page = 1;
            this.$refs.suggestScroll.scrollTo(0, 0);
            searchSong(this.queryTxt, this.page, this.showSinger, perpage).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this.getResult(res.data);
                    this.checkMore(res.data); //搜索完 判断是否还有更多
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
                let arr = [...data.song.list];
                arr = this.formatSong(arr);
                ret.push(...arr);

            }
            return ret;
        },
        formatSong(list) {
            let ret = [];
            list.forEach((item) => {
                if (item.songid && item.albumid) {
                    ret.push(createSong(item));
                }
            });
            return ret;
        },
        searchMore() {
            if (!this.hasMore) {
                return
            };
            this.page++;
            searchSong(this.queryTxt, this.page, this.showSinger, perpage).then((res) => {
                if (res.code === ERR_OK) {
                    this.result = this.result.concat(this.getResult(res.data));
                    this.checkMore(res.data);
                }
            }, (req) => {
                console.log('error')
            })
        },
        checkMore(data) {
            const song = data.song;
            if (!song.list.length || (song.totalnum <= song.curnum + 20 * song.curpage)) {
                this.hasMore = false;
            }
        },
        selectItem(item) {
            if (item.type === SEARCH_TYPE) {
                const singer = new Singer(item.singername, item.singermid);
                this.$router.push({
                    path: `/search/${singer.id}`
                });
                this.setSinger(singer);
            } else {
                this.insertSearchSong(item);
            }
            this.$emit('saveEvent', item);
        },
        ...mapMutations({
            setSinger: 'SET_SINGER',//映射 this.setSinger() 为 this.$store.commit('setSinger')
        }),
        ...mapActions([
            'insertSearchSong'
        ]),
        scrollRefresh() {
            this.$refs.suggestScroll.refresh();
        }
    },
    watch: {
        queryTxt(newVal) {
            this.search();
        }
    },
    components: {
        scroll,
        loading,
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