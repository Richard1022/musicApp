<template>
	<div class="remomend">
		remomend
	</div>
</template>

<script>
  import {getRecommend} from 'api/recommend'  // 引入getremonmend方法 获取推荐页数据
  import {ERR_OK} from 'api/config'  // 引入常规常量参数
  
	export default{
		methods:{
		  _getRecommend(){
		    getRecommend().then((res)=>{
		      if(res.code===ERR_OK){
		        console.log(res.data);
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