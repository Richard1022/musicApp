<template>
    <div class="search-list" v-show="searches.length">
        <transition-group name="list" tag="ul">
            <li :key="item" class="search-item" @click.stop="selectItem(item)" v-for="item in searches">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteList(item)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>

<script type="text/ecmascript-6">
import { searchKey } from 'common/js/cache';
import { mapMutations } from 'vuex';
import {searchMixin} from 'common/js/mixin'

export default {
    mixins:[
        searchMixin
    ],
    props: {
        searches: {
            type: Array,
            default: [],
        }
    },
    methods: {
        selectItem(item) {
            this.$emit('slelectSearch', item)
        },
        // deleteList(paraItem) {
        //     let storageSearchList = JSON.parse(localStorage.getItem(searchKey));
        //     let deleteIndex = storageSearchList.findIndex((item) => {
        //         return item === paraItem
        //     });
        //     storageSearchList.splice(deleteIndex, 1);
        //     this.setHistory(storageSearchList);
        //     //重新存储localstorage需要序列化
        //     storageSearchList = JSON.stringify(storageSearchList);
        //     localStorage.setItem(searchKey, storageSearchList);
        // },
        // ...mapMutations({
        //     setHistory: 'SET_HISTORY'
        // }),
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-list {
    .search-item {
        display: flex;
        align-items: center;
        height: 40px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
            transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
            height: 0;
        }

        .text {
            flex: 1;
            color: $color-text-l;
        }

        .icon {
            extend-click();

            .icon-delete {
                font-size: $font-size-small;
                color: $color-text-d;
            }
        }
    }
}
</style>