import fs from 'fs'
import path from 'path'

export default {
	root: '', //项目根目录
	paths: {}, //全路径
	data: {}, //工程文件数据
	scenes: [], //场景
	maps: [], //关卡数据
	modelgroups: [], //模型分组
	models: [], //模型
	levels: [], //关卡表
	init: function(root, callback) { //设置数据
		// this.data = obj;
		this.root = root;
		console.log(this.root)
		this.initData(this.root, callback);
	},
	initPath: function(root, configdata) { //设置资源路径
		this.paths.model = path.join(root, configdata.lmPath);
		this.paths.scene = path.join(root, configdata.lsPath);
		this.paths.material = path.join(root, configdata.lmatPath);
		this.paths.ico = path.join(root, configdata.iconPath);
		this.paths.map = path.join(root, configdata.levelPath);
		this.paths.config = path.join(root, configdata.configPath);
	},
	initData: function(root, callback) {
		this.initPath(root, this.readConfig(path.join(root, 'config.json')));
		this.data.paths = this.paths;
		this.data.scenes = this.scenes = this.readConfig(path.join(this.paths.config, 'sence.json'));
		this.data.modelgroups = this.modelgroups = this.readConfig(path.join(this.paths.config, 'modelgroup.json'));
		this.data.models = this.models = this.readConfig(path.join(this.paths.config, 'model.json'));
		this.data.levels = this.levels = this.readConfig(path.join(this.paths.config, 'level.json'));

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
