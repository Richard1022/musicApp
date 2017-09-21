<template>
	<div class="singer">
		<list-view @select="selectSinger" :data="singers"></list-view>
		<router-view></router-view>
	</div>
</template>

<script>
import { getSingerList } from 'api/singer';  // 引入getSingerList方法
import { ERR_OK } from 'api/config' //引入常量0
import singerClass from 'common/js/singer'
import listView from 'base/list-view/list-view' //引入listview组件
import singerDetail from 'components/singer-detail/singer-detail' //引入歌手详情页组件

const HOT_NAME = "热门"
const HOT_SINGER_LENGTH = 10; //定义热门歌手length常量

export default {
	data() {
		return {
			singers: []
		}
	},
	created() {
		setTimeout(()=>{
			this._getSingerList();// 初始化获取歌手数据
		}, 1000);
	},
	methods: {
		selectSinger(singer){
			this.$router.push({
				path:`/singer/${singer.id}`,
			});
		},
		_getSingerList() {
			getSingerList().then((res) => {
				if (res.code === ERR_OK) {
					this.singers = this._normalizeSinger(res.data.list);
					// console.log(this.singers);
				}
			});
		},
		_normalizeSinger(list) { //序列化歌手列表 声明一个map对象存放分类后的歌手
			let map = {
				hot: {
					title: HOT_NAME,
					item: [] //存放热门歌手空数组,遍历singers
				}
			};
			list.forEach((item, index) => { //遍历热门常量数据,获取需要的数据存入map对象的hit键
				if (index < HOT_SINGER_LENGTH) {
					map.hot.item.push(
						new singerClass(item.Fsinger_name, item.Fsinger_mid)
					);
				};
				let key = item.Findex; //设置map新键 首字母索引 
				if (!map[key]) {
					map[key] = {
						title: key,
						item: []
					}
				};//如果首次遍历当前首字母,创建新键,设置title为首字母,item为空数组
				//如果不是首次遍历,判断是否符合首字母索引
				if (key == item.Findex) {
					map[key].item.push(
						new singerClass(item.Fsinger_name, item.Fsinger_mid)
					)
				}
			});
			//map排序
			let hot = []; //热门歌手
			let ret = [];	//排序后的歌手
			for (let key in map) {
				let val = map[key]; //当前遍历值匹配正则a-z 
				if (val.title.match(/[A-Za-z]/)) {
					ret.push(val);
				} else if (val.title === HOT_NAME) {
					hot.push(val);
				}
			};
			ret.sort((a, b) => {
				return a.title.charCodeAt(0) - b.title.charCodeAt(0);
			});
			return hot.concat(ret);
		}
	},
	components: {
		listView,
		singerDetail
	}

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer
	position fixed
	top 88px
	bottom 0
	width 100%
	.loading-container
		position absolute
		width 100%
		top 50%
		transform translateY(-50%)
	
</style>