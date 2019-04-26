import fs from 'fs'

export default {
	root: '', //项目根目录
	path: {}, //全路径
	data: {}, //工程文件数据
	scenes: [], //场景
	maps: [], //关卡数据
	modelgroups: [], //模型分组
	models: [], //模型
	levels: [], //关卡表
	init: function(root, callback) { //设置数据
		// this.data = obj;
		this.root = root;
		this.initData(root, callback);
	},
	initPath: function(root, configdata) { //设置资源路径
		this.path.model = this.root + configdata.lmPath;
		this.path.scene = this.root;
		this.path.ico = this.root + configdata.iconPath;
		this.path.map = this.root + configdata.levelPath;
		this.path.config = root + configdata.configPath;
	},
	initData: function(root, callback) {
		this.initPath(root, this.readConfig(this.root + 'config.json'));
		this.data.path = this.path;
		this.data.scenes = this.scenes = this.readConfig(this.path.config + 'sence.json');
		this.data.modelgroups = this.modelgroups = this.readConfig(this.path.config + 'modelgroup.json');
		this.data.models = this.models = this.readConfig(this.path.config + 'model.json');
		this.data.levels = this.levels = this.readConfig(this.path.config + 'level.json');

		let self = this;
		for (let i = 0; i < this.modelgroups.length; i++) {
			this.modelgroups[i].models = this.setModelByGroup(this.modelgroups[i].id);
		}
		console.log(this);
		callback();
	},
	readConfig: function(file) {
		let d = fs.readFileSync(file);
		return JSON.parse(d.toString());
	},
	setModelByGroup: function(groupId) {
		let a = [];
		for (let i = 0; i < this.models.length; i++) {
			if (this.models[i].gid == groupId) {
				a.push(this.models[i]);
			}
		}
		return a;
	}
}
