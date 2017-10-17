<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box @queryEvent="doSearch" ref="searchBox"></search-box>
		</div>
		<div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!selectTxt">
			<scroll ref="shortcutScroll" :data="concatData" class="shortcut">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜索</h1>
						<ul>
							<li @click="selectHotKey(item.k)" class="item" v-for="(item,index) in searchRecommends" :key="index">{{item.k}}</li>
						</ul>
					</div>
					<div class="search-history" v-show="getSearchHistory.length">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span class="clear" @click="openConfirm">
								<i class="icon-clear"></i>
							</span>
						</h1>
						<search-list @slelectSearch="selectSearchSong" :searches="getSearchHistory"></search-list>
					</div>
				</div>
			</scroll>
		</div>
		<div class="search-result" ref="searchResult" v-show="selectTxt">
			<suggest @saveEvent="saveHistory" ref="suggest" :queryTxt="selectTxt"></suggest>
		</div>
		<confirm ref="confirm" :text="'确认清空全部?'" :confirmBtnText="'清空搜索'" @confirm="clearAll"></confirm>
		<router-view></router-view>
	</div>
</template>

<script>
import searchBox from 'base/searchBox/searchBox';
import { getHotSearch } from 'api/search';
import { ERR_OK } from 'api/config';
import suggest from 'components/suggest/suggest';
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
import searchList from 'base/searchList/searchList';
import confirm from 'base/confirm/confirm';
import scroll from 'base/scroll/scroll';
import { myMixin } from 'common/js/mixin';

export default {
	mixins: [
		myMixin
	],
	data() {
		return {
			searchRecommends: [],
			selectTxt: '',
		}
	},
	computed: {
		...mapGetters([
			'getSearchHistory',
		]),
		concatData() {
			return this.searchRecommends.concat(this.getSearchHistory);
		}
	},
	methods: {
		handlePlayList(playList) {
			const bottomOffset = playList.length > 0 ? '60px' : '';
			this.$refs.shortcutWrapper.style.bottom = bottomOffset; //修改scroll组件父级尺寸,改动滚动视口,refresh
			// console.log(this.$refs.shortcutScroll.$el.style.bottom);
			this.$refs.shortcutScroll.refresh();
			this.$refs.searchResult.style.bottom = bottomOffset;
			this.$refs.suggest.scrollRefresh();
		},
		doSearch(newQuery) {
			this.selectTxt = newQuery;
		},
		_getHotSearch() {
			getHotSearch().then((res) => {
				if (res.code === ERR_OK) {
					this.searchRecommends = res.data.hotkey.slice(0, 10);
				}
			}, (rej) => {
				console.log('get error')
			})
		},
		selectHotKey(item) {
			this.$refs.searchBox.setQueryTxt(item);
		},
		saveHistory(item) {
			// console.log(this.selectTxt);
			this.saveSearchHistory(this.selectTxt);
		},
		...mapActions([
			'saveSearchHistory'
		]),
		clearAll() {
			localStorage.clear();
			this.$store.commit('SET_HISTORY', []);
		},
		selectSearchSong(item) {
			this.$refs.searchBox.queryTxt = item;
		},
		openConfirm() {
			this.$refs.confirm.show();
		},
	},
	created() {
		this._getHotSearch();
	},
	components: {
		searchBox,
		suggest,
		searchList,
		confirm,
		scroll
	},
	watch: {
		selectTxt(newQuery) {
			if (!newQuery) {
				setTimeout(() => {
					this.$refs.shortcutScroll.refresh();
				})
			}
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
	.search-box-wrapper {
		margin: 20px;
	}

	.shortcut-wrapper {
		position: fixed;
		top: 178px;
		bottom: 0;
		width: 100%;

		.shortcut {
			height: 100%;
			overflow: hidden;

			.hot-key {
				margin: 0 20px 20px 20px;

				.title {
					margin-bottom: 20px;
					font-size: $font-size-medium;
					color: $color-text-l;
				}

				.item {
					display: inline-block;
					padding: 5px 10px;
					margin: 0 20px 10px 0;
					border-radius: 6px;
					background: $color-highlight-background;
					font-size: $font-size-medium;
					color: $color-text-d;
				}
			}

			.search-history {
				position: relative;
				margin: 0 20px;

				.title {
					display: flex;
					align-items: center;
					height: 40px;
					font-size: $font-size-medium;
					color: $color-text-l;

					.text {
						flex: 1;
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
		}
	}

	.search-result {
		position: fixed;
		width: 100%;
		top: 178px;
		bottom: 0;
	}
}
</style>