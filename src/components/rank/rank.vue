<template>
	<div class="rank" ref="rank">
		<scroll class="toplist" :data="rankList" ref="topList">
			<ul>
				<li @click="selectRank(item)" class="item" v-for="(item,index) in rankList" :key="index">
					<div class="icon">
						<img :src="item.picUrl" width="100" height="100" />
					</div>
					<ul class="songlist">
						<li class="song" v-for="(listItem,index) in item.songList" :key="index">
							<span>{{index+1}}</span>
							<span>{{`${listItem.songname}-${listItem.singername}`}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!rankList.length">
				<loading :title="'正在查找排行榜数据'"></loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
import { getTopRank } from 'api/rank';
import { ERR_OK } from 'api/config';
import scroll from 'base/scroll/scroll';
import loading from 'base/loading/loading';
import { myMixin } from 'common/js/mixin';
import { mapMutations } from 'vuex';

export default {
	mixins: [
		myMixin,
	],
	created() {
		this._getTopRank();
	},
	data() {
		return {
			rankList: [],  //排行榜列表
		}
	},
	methods: {
		_getTopRank() {
			getTopRank().then((res) => {
				if (res.code === ERR_OK) {
					// console.log(res.data.topList);
					this.rankList = res.data.topList;
				}
			}, (rej) => {
				console.log('get error');
			})
		},
		handlePlayList(playList) {
			const bottomOffset = playList.length > 0 ? '60px' : '';
			this.$refs.rank.style.bottom = bottomOffset;
			this.$refs.topList.refresh();
			// console.log(this.$refs.topList.$el.style.bottom);
		},
		selectRank(item) {
			this.$router.push({
				path: `/rank/${item.id}`
			});
			this.SET_TOPLIST(item);
		},
		...mapMutations({
			SET_TOPLIST: 'SET_TOPLIST',////映射 this.SET_TOPLIST() 为 this.$store.commit('SET_TOPLIST') 
		})
	},
	components: {
		scroll,
		loading
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>