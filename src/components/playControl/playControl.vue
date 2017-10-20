<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="playMode" @click="changePlayMode"></i>
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <scroll ref="listContent" class="list-content" :data="sequenceList">
                    <transition-group tag="ul" name="list">
                        <li @click="selectPlayListItem(item,index)" class="item" v-for="(item,index) in sequenceList" :key="item.id">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like">
                                <i class="icon-favour"></i>
                            </span>
                            <span class="delete" @click.stop="removeSongItem(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import scroll from 'base/scroll/scroll'
import confirm from 'base/confirm/confirm'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
import { PlayerConfig } from 'common/js/config'
import { playModeMixin } from 'common/js/mixin' //引入全局混合

export default {
    mixins: [
        playModeMixin
    ],
    components: {
        scroll,
        confirm,
    },
    data() {
        return {
            test: [],
            showFlag: false,
        }
    },
    computed: {
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'mode',
            'playList',
        ]),
        modeText() {
            return this.mode === PlayerConfig.sequence ? '顺序播放' : this.mode === PlayerConfig.random ? '随机播放' : '单曲循环'
        }
    },
    methods: {
        confirmClear() {
            this.clearPlayList();
        },
        show() {
            this.showFlag = true;
            setTimeout(() => {
                this.$refs.listContent.refresh();
            }, 20);
        },
        hide() {
            this.showFlag = false;
        },
        getCurrentIcon(item) {
            if (this.currentSong.id === item.id) {
                return 'icon-play'
            } else {
                return ''
            }
        },
        selectPlayListItem(item, index) {
            //如果是顺序播放或者单曲循环,直接在playlist setindex ,
            //若当前playmode为random,先寻到item在playlist中的index
            if (this.mode === PlayerConfig.random) {
                index = this.playList.findIndex((filterItem) => {
                    return filterItem.id === item.id
                });
            }
            this.setCurrentIndex(index);
            this.setPlayState(true);
        },
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENTINDEX',
            setPlayState: 'SET_PLAYING_STATE',
        }),
        ...mapActions([
            'deleteSongList',
            'clearPlayList'
        ]),
        removeSongItem(item) {
            this.deleteSongList(item);
            if (!this.playList.length) {
                this.hide();
            }
        },
        showConfirm() {
            this.$refs.confirm.show();
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;

    &.list-fade-enter-active, &.list-fade-leave-active {
        transition: opacity 0.3s;

        .list-wrapper {
            transition: all 0.3s;
        }
    }

    &.list-fade-enter, &.list-fade-leave-to {
        opacity: 0;

        .list-wrapper {
            transform: translate3d(0, 100%, 0);
        }
    }

    &.list-fade-enter, .list-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: $color-highlight-background;

        .list-header {
            position: relative;
            padding: 20px 30px 10px 20px;

            .title {
                display: flex;
                align-items: center;

                .icon {
                    margin-right: 10px;
                    font-size: 30px;
                    color: $color-theme-d;
                }

                .text {
                    flex: 1;
                    font-size: $font-size-medium;
                    color: $color-text-l;
                }

                .clear {
                    extend-click();

                    .icon-clear {
                        font-size: $font-size-medium;
                        color: $color-text-d;
                    }
                }
            }
        }

        .list-content {
            max-height: 240px;
            overflow: hidden;

            .item {
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 30px 0 20px;
                overflow: hidden;

                &.list-enter-active, &.list-leave-active {
                    transition: all 0.1s;
                }

                &.list-enter, &.list-leave-to {
                    height: 0;
                }

                .current {
                    flex: 0 0 20px;
                    width: 20px;
                    font-size: $font-size-small;
                    color: $color-theme-d;
                }

                .text {
                    flex: 1;
                    no-wrap();
                    font-size: $font-size-medium;
                    color: $color-text-d;
                }

                .like {
                    extend-click();
                    margin-right: 15px;
                    font-size: $font-size-small;
                    color: $color-theme;

                    .icon-favorite {
                        color: $color-sub-theme;
                    }
                }

                .delete {
                    extend-click();
                    font-size: $font-size-small;
                    color: $color-theme;
                }
            }
        }

        .list-operate {
            width: 140px;
            margin: 20px auto 30px auto;

            .add {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                border: 1px solid $color-text-l;
                border-radius: 100px;
                color: $color-text-l;

                .icon-add {
                    margin-right: 5px;
                    font-size: $font-size-small-s;
                }

                .text {
                    font-size: $font-size-small;
                }
            }
        }

        .list-close {
            text-align: center;
            line-height: 50px;
            background: $color-background;
            font-size: $font-size-medium-x;
            color: $color-text-l;
        }
    }
}
</style>