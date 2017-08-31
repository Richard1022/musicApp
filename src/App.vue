<template>
  <div id="app"> 
   	<m-header></m-header>
   	<tab></tab>
		<router-view></router-view>
  </div>
</template>

<script>
	import MHeader from 'components/m-header/m-header'  //引入头部组件
	import Tab from 'components/tab/tab'         // 引入导航组件
export default {
		components:{
			MHeader,
			Tab
		}
}
</script>

<style>

</style>
