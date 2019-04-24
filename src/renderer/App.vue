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
	html,body{
		margin: 0px;
		padding: 0px;
		width: 100%;
		height: 100%;
		background-color: #fffefa;
	}
	
	#app{
		height: 100%;
	}
</style>
