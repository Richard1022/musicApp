<template>
	<div id="app">
		<m-header></m-header>
		<tab></tab>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<player></player>
	</div>
</template>

<script>
import MHeader from 'components/m-header/m-header'  //引入头部组件
import Tab from 'components/tab/tab'         // 引入导航组件
import player from 'components/player/player'

export default {
	components: {
		MHeader,
		Tab,
		player
	}
}
</script>

<style>

</style>
