<template>
	<div class="recommend">
		<div class="recommend-content">
			<div v-if="recommends.length" class="recomend-wrapper">
				<slider>
					<div v-for="item in recommends">
						<a :href="item.linkUrl">
							<img :src="item.picUrl">
						</a>
					</div>
				</slider>
			</div>
			<div class="recommend-list">
				<h2 class="list-title">热门歌单推荐</h2>
				<ul>
					<li class="item" v-for="(item,index) in discList">
						<div class="icon">
							<img :src="item.imgurl" height="60" width="60">
						</div>
						<div class="text">
							<h2 class="name" v-text="item.creator.name"></h2>
							<p class="desc" v-text="item.dissname"></p>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { getRecommend } from 'api/recommend'  // 引入getremonmend方法 获取推荐页数据
import { ERR_OK } from 'api/config'  // 引入常规常量参数
import slider from 'base/slider' // 引入slider基础轮播组件
import {getDiscList} from 'api/recommend' 

export default {
	data() {
		return {
			recommends: [],
			discList:[],
		}
	},
	components: {
		slider,
	},
	methods: {
		_getRecommend() {
			getRecommend().then((res) => {
				if (res.code === ERR_OK) {

					this.recommends = res.data.slider;
				}
			})
		},
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
						// console.log(res.data.list); //接受代理请求到的数据
            this.discList = res.data.list
          }
        })
      },
	},
	created() {
		this._getRecommend();
		this._getDiscList();
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>