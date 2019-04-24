<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'game'
  }
</script>

<style>
	@import '/src/renderer/assets/style.css';
	
	html,
	body {
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;
	}
	
	#app{
		height: 100%;
	}
</style>
