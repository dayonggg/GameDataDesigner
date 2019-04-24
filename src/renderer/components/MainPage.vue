<template>
	<div class="scene">
		<div class="secne-list">
			<el-button type="primary" size="mini" @click="test()">
				open
			</el-button>
			<ul class="secne-list-item">
				<li v-for="s in mapdata.maps" @click="liclick(s)">
					{{ s.title }}
				</li>
			</ul>
		</div>
		<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
			<el-tab-pane v-for="(item, index) in editableTabs" :key="item.id" :label="item.title" :name="item.id">
				<!-- {{item.scencefile}} -->
				<div :id='"map-"+item.id' class="laya-content">{{item.scencefile}}</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import fs from 'fs'
	import ipc from 'electron'

	export default {
		data() {
			return {
				editableTabsValue: '',
				editableTabs: [],
				mapdata:{}
			}
		},

		methods: {
			test() {
				let self = this;
				ipc.ipcRenderer.send('open-project-file');
				ipc.ipcRenderer.on('selected-project-file',(e,path)=>{
					let proPath = path.toString();
					fs.readFile(proPath, function(err, data) {
						if (err) {
							throw err;
						}
						localStorage.setItem('projectPath',proPath);
						console.log(JSON.parse(data.toString()));
						// console.log(self);
						self.mapdata = JSON.parse(data.toString());
						console.log(self);
					});
				})
			},
			liclick(t) {
				let etabs = this.editableTabs;
				let isnew = true;
				etabs.forEach((f, index) => {
					if (f.id == t.id) {
						this.editableTabsValue = t.id;
						isnew = false;
					}
				});
				if (isnew) {
					this.addTab(t)
				}
			},
			addTab(target) {
				this.editableTabs.push(target);
				this.editableTabsValue = target.id;
			},
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				console.log(targetName);
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						console.log(tab,index);
						if (tab.id === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.id;
							}
						}
					});
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.id !== targetName);
				console.log(this);
			}
		}
	}
</script>

<style>
	.secne-list {
		float: left;
		height: 100%;
		width: 200px;
	}

	.secne-list-item {
		width: 100%;
		height: calc(100%-20);
	}

	.el-tabs {
		float: left;
		height: 100%;
		width: calc(100% - 210px);
	}

	.scene {
		width: 100%;
		height: 100%;
		min-height: 500px;
		min-width: 500px;
	}
</style>
