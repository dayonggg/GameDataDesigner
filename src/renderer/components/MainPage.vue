<template>
	<div class="page">
		<el-container>
			<el-header>
				<el-row class="title">Game Designer</el-row>
				<!-- 菜单 -->
				<el-row class="toolbar">
					<el-tooltip content="打开项目目录" placement="bottom" effect="light">
						<el-button size="mini" icon="el-icon-document" @click="load()"></el-button>
					</el-tooltip>
					<el-button-group v-if="isload" class="toolbar-group-add">
						<el-tooltip content="添加关卡" placement="bottom" effect="light">
							<el-button icon="el-icon-plus" size="mini" @click="newleveldialog = true"></el-button>
						</el-tooltip>
						<el-tooltip content="添加场景资源" placement="bottom" effect="light">
							<el-button icon="el-icon-picture-outline" size="mini" @click="newscenedialog = true"></el-button>
						</el-tooltip>
						<el-tooltip content="添加模型" placement="bottom" effect="light">
							<el-button icon="el-icon-menu" size="mini" @click="newmodeldialog = true"></el-button>
						</el-tooltip>
					</el-button-group>
				</el-row>
			</el-header>
			<el-container class="main-scene">
				<!-- 关卡列表 -->
				<el-aside v-show="showscenelist" width="160px" class="main-scene-list">
					<el-card class="box-card">
						<div v-for="s in mapdata.levels" @click="liclick(s)" class="scene-item">
							{{ s.title }}
						</div>
					</el-card>
				</el-aside>
				<el-main class="el-main-content">
					<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
						<el-tab-pane v-for="item in editableTabs" :key="item.id" :label="item.title" :name="item.id">
							<el-container>
								<el-main>
									<!-- 游戏画布 -->
									<div :id='"map-"+item.id' class="laya-content">
										<!-- {{item.scencefile}} -->
										<iframe src="src/renderer/laya.html" ref="iframe" frameborder="0" style="width: 100%; height: 100%;"></iframe>
									</div>
								</el-main>
								<el-aside width="240px">
									<!-- 工具面板 -->
									<el-collapse>
										<el-collapse-item v-for="item in mapdata.modelgroups" :title="item.label" :name="item.id">
											<el-row>
												<el-col :span="6" v-for="lm in item.models">
													<div class="model">
														<img :src="['file://'+mapdata.paths.ico+lm.icon]" width="32px" height="32px" />
														<div class="model-label">{{lm.label}}</div>
													</div>
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
		<!-- 新建关卡对话框 -->
		<el-dialog title="新建关卡" :visible.sync="newleveldialog" :before-close="newDialogClose">
			<el-form>
				<el-row>
					<el-col :span="12">
						<el-form-item label="名 称:" :label-width="formLabelWidth">
							<el-input v-model="newlevelData.title" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="编 号:" :label-width="formLabelWidth">
							<el-input v-model="newlevelData.id" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">&nbsp;</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="场 景:" :label-width="formLabelWidth">
							<el-select v-model="newlevelData.scene" filterable placeholder="请选择">
								<el-option v-for="item in mapdata.scenes" :key="item.id" :label="item.label" :value="item.ls"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="数 据:" :label-width="formLabelWidth">
							<el-select v-model="newlevelData.map" filterable placeholder="请选择">
								<el-option v-for="item in mapdata.scenes" :key="item.id" :label="item.label" :value="item.label"></el-option>
							</el-select>
						</el-form-item>
					</el-col> -->
				</el-row>
				<el-row>
					<el-form-item label="说 明:" :label-width="formLabelWidth">
						<el-input type="textarea" :rows="2" placeholder="关卡说明" v-model="newlevelData.text">
						</el-input>
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="newleveldialog = false">取 消</el-button>
				<el-button type="primary" :disabled="!newlevelData.id || !newlevelData.title || !newlevelData.text || !newlevelData.scene"
				 @click="addLevel">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 新建场景对话框 -->
		<el-dialog title="新建场景" :visible.sync="newscenedialog" :before-close="newDialogClose">
			<el-form>
				<el-row>
					<el-col :span="12">
						<el-form-item label="名 称:" :label-width="formLabelWidth">
							<el-input v-model="newsceneData.label" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="2">&nbsp;</el-col>
					<el-col :span="6">
						<el-form-item label="编 号:" :label-width="formLabelWidth">
							<el-input v-model="newsceneData.id" autocomplete="off" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item label="位 置:" :label-width="formLabelWidth">
						<el-input v-model="newsceneData.label" autocomplete="off">
							<el-button slot="append" icon="el-icon-more"></el-button>
						</el-input>
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="newscenedialog = false">取 消</el-button>
				<el-button type="primary" @click="newscenedialog = false">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 新建模型对话框 -->
		<el-dialog title="新建模型" :visible.sync="newmodeldialog" :before-close="newDialogClose">
			<el-form>
				<el-row>
					<el-col :span="15">
						<el-form-item label="名 称:" :label-width="formLabelWidth">
							<el-input v-model="newmodelData.label" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="1">&nbsp;</el-col>
					<el-col :span="8">
						<el-form-item label="编 号:" :label-width="formLabelWidth">
							<el-input v-model="newmodelData.id" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-form-item label="组 别:" :label-width="formLabelWidth">
						<el-select v-model="newmodelData.gid" filterable placeholder="请选择">
							<el-option v-for="item in mapdata.modelgroups" :key="item.id" :label="item.label" :value="item.label"></el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="位 置:" :label-width="formLabelWidth">
						<el-input v-model="newmodelData.label" autocomplete="off">
							<el-button slot="append" icon="el-icon-more"></el-button>
						</el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-col :span="20">
						<el-form-item label="图 标:" :label-width="formLabelWidth">
							<el-input v-model="newmodelData.icon" autocomplete="off" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="1">&nbsp;</el-col>
					<el-col :span="3">
						<div class="new-ico" @click="uploadIco">
							<img v-if="newmodelData.icon!=undefined?true:false" :src="['file:///'+newmodelData.icon]" width="32px" height="32px" />
							<i class="el-icon-plus" v-else></i>
						</div>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="newmodeldialog = false">取 消</el-button>
				<el-button type="primary" @click="newmodeldialog = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import ipc from 'electron'
	import fs from 'fs'
	import d from '../commonData.js'
	import ft from '../fileTask.js'

	export default {
		data() {
			return {
				isload: false, //是否已经加载了配置文件
				fullscreenLoading: false, //是否显示全屏loading，标记，暂时不用
				showscenelist: false, //是否显示关卡列表
				newleveldialog: false, //是否显示新建关卡对话框
				newscenedialog: false, //是否显示新建场景对话框
				newmodeldialog: false, //是否显示新建模型对话框
				editableTabsValue: '', //当前编辑的tab页
				editableTabs: [], //打开的tab页列表
				mapdata: {}, //数据源
				formLabelWidth: '60px',
				newlevelData: {}, //新关卡数据
				newsceneData: {}, //新场景数据
				newmodelData: {}, //新模型数据
				vueid: "expandData", //iframe通讯
				//editlevel: {}, //当前正在编辑的关卡
			}
		},

		methods: {
			load() {
				let self = this;
				ipc.ipcRenderer.send('open-project-file');
				ipc.ipcRenderer.on('selected-project-file', (e, path) => {
					let proPath = path.toString() + "/";
					d.init(proPath, function() {
						self.mapdata = d.data;
						self.isload = true;
						self.showscenelist = true;
						ft.fileDisplay(d.root);
					})
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
				this.editableTabs = []; //暂时关闭多标签页
				this.editableTabs.push(target);
				this.editableTabs[0].scene =this.mapdata.paths.scene + target.scene;
				this.editableTabsValue = target.id;
				// console.log('data',this.editableTabs[0]);
				// this.editlevel = JSON.parse(JSON.stringify(target));
				
				console.log(this.editableTabs[0]);

			},
			removeTab(targetName) {
				// 				let tabs = this.editableTabs;
				// 				let activeName = this.editableTabsValue;
				// 				console.log(targetName);
				// 				if (activeName === targetName) {
				// 					tabs.forEach((tab, index) => {
				// 						console.log(tab, index);
				// 						if (tab.id === targetName) {
				// 							let nextTab = tabs[index + 1] || tabs[index - 1];
				// 							if (nextTab) {
				// 								activeName = nextTab.id;
				// 							}
				// 						}
				// 					});
				// 				}
				// 				this.editableTabsValue = activeName;
				// 				this.editableTabs = tabs.filter(tab => tab.id !== targetName);
				// 				console.log(this);
				this.editableTabs = [];
				this.editableTabsValue = '';
				// this.editlevel = {};
			},
			newDialogClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						//清空临时数据
						this.newlevelData = this.newsceneData = this.newmodelData = {};
						done();
					})
					.catch(_ => {});
			},
			uploadIco() {
				let self = this;
				ipc.ipcRenderer.send('open-ico');
				ipc.ipcRenderer.on('selected-ico', (e, path) => {
					self.newmodelData.icon = path.toString();
					console.log(self.newmodelData.icon)
				});
			},
			addLevel() {
				this.mapdata.levels.push(this.newlevelData);
				this.newlevelData = {};
				this.newleveldialog = false;
			}
		},
		created() {
			let self = this
			window[this.vueid] = () => {
				return this.editableTabs[0];
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

	.model {
		text-align: center;
		padding: 6px 3px;
	}

	.model-label {
		font-size: 9px;
		margin-top: -5px;
	}

	.new-ico {
		width: 32px;
		height: 32px;
		border: #DCDFE6 1px dashed;
		cursor: pointer;
		padding: 3px;
		border-radius: 6px;
		text-align: center;
	}

	.new-ico img,
	.new-ico i {
		width: 32px;
		height: 32px;
		line-height: 32px;
		font-size: 24px;
	}

	.laya-content {
		background-color: #000;
		width: 100%;
		height: 100%;
		color: #fff;
	}
</style>
