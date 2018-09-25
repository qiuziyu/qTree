;(function(undefined){
	"use strict"
	var _global;

	//插件构造函数
	function qTree(){
		this._const = {
			className: {
				BUTTON: "btn",
				LEVEL: "level",
				ICON_LOADING: "icon_loading",
				SWITCH: "switch",
				NAME: "node_name"
			},
			id: {
				A: "_a",
				ICON: "_icon",
				SPAN: "_span",
				SWITCH: "_switch",
				UL: "_ul"
			},
			folder: {
				OPEN: "open",
				CLOSE: "close",
			},
			file: {
				FILE: "file"
			},
			node: {
				SELECTEDNODE: "selectedNode"
			}
		},
		this._setting = {
			treeId: "",
			treeObj: null,
			view: {
				showIcon: true,
				showLine: true,
				fontCSS: {},
				selectedMulti: true
			},
			data: {
				key: {
					name: "name",
					title: "",
					icon: "icon"
				},
				simpleData: {
					idKey: "id",
					pIdKey: "pId",
					rootPId: null
				}
			},
			async: {
				//异步参数配置
				enable: false,
				contentType: "application/x-www-form-urlencoded",
				type: "post",
				dataType: "text",
				headers: {},
				url: "",
				autoParam: [],
				dataFilter: null
			}
		},
		this._init = {
			caches: [this._initCache],
			nodes: [this._initNode],
			roots: [this._initRoot],
			afterA: [],
			beforeA: [],
			innerBeforeA: [],
			innerAfterA: []
		},
			// methods of data
		this.data = {
			// cache of node
			addNodeCache: function (setting, node) {
				data.getCache(setting).nodes[data.getNodeCacheId(node.treeId)] = node;
            },
			getNodeCacheId: function (treeId) {
				// 获取treeId在第二个"_"往后的数字
				return treeId.substring(treeId.lastIndexOf("_") + 1);
            },
			addAfterA: function (afterA) {
				this._init.afterA.push(afterA);
            },
			addBeforeA: function (beforeA) {
				this._init.beforeA.push(beforeA);
            },
			addInnerAfterA: function (innerAfterA) {
				this._init.innerAfterA.push(innerAfterA);
            },
			addInnerBeforeA: function (innerBeforeA) {
				this._init.innerBeforeA.push(innerBeforeA);
            }
		}
	}

	qTree.prototype = {
		_initRoot: function (setting){
			var rootNode = data.getRoot(setting);
			if(!rootNode) {
				rootNode = {};
				data.setRoot(setting, rootNode);
			}
			data.nodeChildren(setting, rootNode, []);
			rootNode.expandTriggerFlag = false;
			rootNode.curSelectedList = [];
			rootNode.noSelection = true;
			rootNode.createNodes = [];
			rootNode.qId = 0;
		},
		_initCache: function (setting) {
			var cache = data.getCache(setting);
			if(!cache){
				cache = {};
				data.setCache(setting, cache);
			}
			cache.nodes = {};
			cache.doms = {};
		},
		_initNode: function(n,setting, parentId, level, lastNode, isFirstNode, isLastNode){
			// n，传入的node节点信息
			if(!n){
				return;
			}
			var rootNode = data.getRoot(setting, n),
				children = data.getChildrenNode(setting, n),
				isParent = data.nodeIsParent(setting, n);
			// 对传入的nose节点存储信息
			n.level = level;
			// treeId = _level_index
			n.treeId = setting.treeId + "_" + n.level + "_" + index;
			n.parentTreeId = parentNode ? parentNode.treeId : null;
			n.isFirstNode = isFirstNode;
			n.isLastNode = isLastNode;
			
			// n具有的方法
			n.getParentNode = function () {
				return data.getNodeCache(setting, n.parentId);
			};
			n.getPreNode = function () {
				return data.getPreNode(setting, n);
			};
			n.getNextNode = function () {
				return data.getNextNode(setting, n);	
			};
			n.getIndex = function () {
				return data.getNodeIndex(setting, n);	
            };
			n.getPath = function () {
				return data.getNodePath(setting, n);
            };
		}
	}

	// 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = qTree;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return qTree;});
    } else {
        !('qTree' in _global) && (_global.qTree = qTree);
    }
}());