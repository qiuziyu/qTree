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
			nodes: [this._initNode]
		}
	}

	qTree.prototype = {
		_initNode: function(n,setting, parentId, level, lastNode, isFirstNode, isLastNode){
			// n，传入的node节点信息
			if(!n){
				return;
			}
			var rootNode = data.getRoot(setting, n),
				children = data.getChildrenNode(setting, n);
			n.level = level;
			n.treeId = setting.treeId + "_" + index;
			n.parentTreeId = parentNode ? parentNode.treeId : null;
			n.open = 
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