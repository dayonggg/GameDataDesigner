<template>
	<div class="page">
		<el-container>
			<el-header>
				<el-row class="title">Game Designer</el-row>
				<el-row class="toolbar">
					<el-button size="mini" icon="el-icon-document" @click="load()"></el-button>
					<el-button-group v-if="isload" class="toolbar-group-add">
						<el-button icon="el-icon-plus" size="mini"></el-button>
						<el-button icon="el-icon-picture-outline" size="mini"></el-button>
						<el-button icon="el-icon-menu" size="mini"></el-button>
					</el-button-group>
				</el-row>
			</el-header>
			<el-container class="main-scene">
				<el-aside v-show="showscenelist" width="160px" class="main-scene-list">
					<el-card class="box-card">
						<div v-for="s in mapdata.maps" @click="liclick(s)" class="scene-item">
							{{ s.title }}
						</div>
					</el-card>
				</el-aside>
				<el-main class="el-main-content">
					<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
						<el-tab-pane v-for="item in editableTabs" :key="item.id" :label="item.title" :name="item.id">
							<el-container>
								<el-main>
									<div :id='"map-"+item.id' class="laya-content">{{item.scencefile}}</div>
								</el-main>
								<el-aside width="240px">
									<el-collapse>
										<el-collapse-item v-for="item in mapdata.lmgroup" :title="item.label" :name="item.typeid">
											<el-row>
												<el-col :span="6" v-for="lm in item.models">
													<div>{{lm.label}}</div>
												</el-col>
											</el-row>
										</el-collapse-item>
									</el-collapse>
								</el-aside>
							</el-container>
						</el-tab-pane>
					</el-tabs>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import fs from 'fs'
	import ipc from 'electron'
	import d from '../commonData.js'

	export default {
		data() {
			return {
				isload: false,
				showscenelist: false,
				editableTabsValue: '',
				editableTabs: [],
				mapdata: {}
			}
		},

		methods: {
			load() {
				let self = this;
				ipc.ipcRenderer.send('open-project-file');
				ipc.ipcRenderer.on('selected-project-file', (e, path) => {
					let proPath = path.toString();
					fs.readFile(proPath, function(err, data) {
						if (err) {
							throw err;
						}
						localStorage.setItem('projectPath', proPath);
						//初始化数据
						self.d = '';
						self.editableTabs = [];
						self.isload = true;
						self.showscenelist = true;
						d.setData(JSON.parse(data.toString()));
						self.mapdata = d.data;
					});
				});

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
						console.log(tab, index);
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

<style scoped>
	.page,
	.el-container,
	.el-aside,
	.el-main,
	.el-tabs,
	.el-tab-pane {
		height: 100%;
		width: 100%;
		padding: 0px;
	}

	.el-header {
		background-color: #fffefa;
	}

	.title {
		text-align: center;
		height: 20px;
		line-height: 20px;
		font-size: 12px;
	}

	.toolbar {
		height: 36px;
		padding: 4px;
	}

	.toolbar-group-add {
		margin-left: 40px;
	}

	.main-scene-list,
	.el-main-content {
		padding: 0px;
		border: none;
		border-top: #d8ca9e 1px solid;
	}

	.main-scene-list {
		border-right: #d8ca9e 1px solid;
	}

	.scene-item {
		padding: 8px 20px;
		font-size: 12px;
		display: block;
	}

	.scene-item:active {
		color: #0000FF;
	}

	.scene-item:hover {
		background-color: #e0edd3;
	}

	.box-card {
		height: calc(100% - 5px);
		width: 100%;
	}

	.el-card__body {
		padding: 0px !important
	}

	.laya-content {
		background-color: #000;
		width: 100%;
		height: 100%;
		color: #fff;
	}
</style>
