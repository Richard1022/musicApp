<template>
	<div class="remomend">
			<div class="recomend-content">
				<div class="recomend-wrapper">
						<slider>
							<div v-for="item in recomends">
								<a :href="item.linkUrl">
									<img :src="item.picUrl">
								</a>
							</div>
						</slider>
				</div>
			</div>
	</div>
</template>

<script>
  import {getRecommend} from 'api/recommend'  // 引入getremonmend方法 获取推荐页数据
  import {ERR_OK} from 'api/config'  // 引入常规常量参数
	import slider from 'base/slider' // 引入slider基础轮播组件
	
	export default{
		data(){
			return{
				recomends:[],
			}
		},
		components:{
			slider,
		},
		methods:{
		  _getRecommend(){
		    getRecommend().then((res)=>{
		      if(res.code===ERR_OK){
						
						this.recomends=res.data.slider;
		      }
		    })
		  }
		},
		created(){
		  this._getRecommend();
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>