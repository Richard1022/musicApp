<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box @queryEvent="doSearch" ref="searchBox"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!selectTxt">
			<div class="shortcut">
				<div class="hot-key">
					<h1 class="title">热门搜索</h1>
					<ul>
						<li @click="selectHotKey(item.k)" class="item" v-for="(item,index) in searchRecommends" :key="index">{{item.k}}</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="search-result" v-show="selectTxt">
			<suggest ref="suggest" :queryTxt="selectTxt"></suggest>
		</div>
	</div>
</template>

<script>
import searchBox from 'base/searchBox/searchBox';
import { getHotSearch } from 'api/search';
import { ERR_OK } from 'api/config';
import suggest from 'components/suggest/suggest';

export default {
	data() {
		return {
			searchRecommends: [],
			selectTxt: '',
		}
	},
	computed: {

	},
	methods: {
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
		}
	},
	created() {
		this._getHotSearch();
	},
	components: {
		searchBox,
		suggest,
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