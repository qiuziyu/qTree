;(function(undefined){
	"use strict"
	var _global;

	//插件构造函数
	function qTree(){
		this.settings = {},
		this.roots = {},
		this.caches = {},
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
			event: {
				NODECREATED: "qtree_createNode",
				CLICK: "qtree_click",
				EXPAND: "qtree_expand",
				COLLAPSE: "qtree_collapse",
				REMOVE: "qtree_remove",
				SELECTED: "qtree_selected",
				UNSELECTED: "qtree_unselected"
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
					icon: "icon",
					children: "children",
					isParent: "isParent"
				},
				simpleData: {
					idKey: "id",
					pIdKey: "pId",
					rootPId: null
				},
                keep: {
                    parent: false,
                    leaf: false
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
			},
			callback: {
				// 判断在某个事件发生前的状态
                beforeAsync: null,
                beforeClick: null,
                beforeDblClick: null,
                beforeRightClick: null,
                beforeMouseDown: null,
                beforeMouseUp: null,
                beforeExpand: null,
                beforeCollapse: null,
                beforeRemove: null,
				// 判断事件发生状态
                onAsyncError: null,
                onAsyncSuccess: null,
                onNodeCreated: null,
                onClick: null,
                onDblClick: null,
                onRightClick: null,
                onMouseDown: null,
                onMouseUp: null,
                onExpand: null,
                onCollapse: null,
                onRemove: null
			}
		},
		this._init = {
			caches: [this._initCache],
			nodes: [this._initNode],
			roots: [this._initRoot],
			binds: [this._bindEvent],
			unbind: [this._unbindEvent],
			afterA: [],
			beforeA: [],
			innerBeforeA: [],
			innerAfterA: [],
            qTreeTools: []
		},
			// methods of data
		this.data = {
			/************************ 添加 ********************/
			// cache of node
			addNodeCache: function (setting, node) {
                this.data.getCache(setting).nodes[this.data.getNodeCacheId(node.treeId)] = node;
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
            },
			addInitBind: function (bindEvent) {
				this._init.binds.push(bindEvent);
            },
			addInitUnBind: function (unbindEvent) {
				this._init.unbind.push(unbindEvent);
            },
			addInitCache: function (initCache) {
				this._init.caches.push(initCache);
            },
			addInitNode: function (initNode) {
				this._init.nodes.push(initNode);
            },
			addInitRoot: function (initRoot) {
				this._init.roots.push(initRoot);
            },
			addNodesData: function (setting, parentNode, index, nodes) {
				var children = this.data.nodeChildren(setting, parentNode), params;
				// 没有子节点
				if (!children){
					children = this.data.nodeChildren(setting, parentNode, []);
					index = -1;
				} else if(index >= children.length){
					index = -1;
				}
				// 包含子节点
				if (children.length > 0 && index === 0){
					children[0].isFirstNode = false;
					view.setNodeLineIcons(setting, children[0]);
				} else if (children.length > 0 && index < 0){
					children[children.length - 1].isLastNode = false;
					view.setNodeLineIcons(setting, children[children.length - 1]);
				}
				this.data.nodeIsParent(setting, parentNode, true);

				if (index < 0) {
					this.data.nodeChildren(setting, parentNode, children.concat(nodes));
				}else {
					params = [index, 0].concat(nodes);
					children.splice.apply(children, params);
				}
            },
			addSelectedNode: function (setting, node) {
				var root = this.data.getRoot(setting);
				if (!this.data.isSelectedNode(setting, node)){
					root.curSelectedList.push(node);
				}
            },
            /************************ 获取 ********************/
			getAfterA: function (setting, node, array) {
				for (var i = 0, j = this._init.afterA.length; i < j; i++){
					this._init.afterA[i].apply(this,arguments);
				}
            },
			getBeforeA: function (setting, node, array) {
                for (var i = 0, j = this._init.beforeA.length; i < j; i++){
                    this._init.beforeA[i].apply(this,arguments);
                }
            },
            getInnerAfterA: function (setting, node, array) {
                for (var i = 0, j = this._init.innerAfterA.length; i < j; i++){
                    this._init.beforeA[i].apply(this,arguments);
                }
            },
            getInnerBeforeA: function (setting, node, array) {
                for (var i = 0, j = this._init.innerBeforeA.length; i < j; i++){
                    this._init.beforeA[i].apply(this,arguments);
                }
            },
			getCache: function (setting) {
				return caches[setting.treeId];
            },
			getRoot: function(setting){
				return setting ? roots[setting.treeId] : null;
			},
			getRoots: function(){
				return roots;
			},
			getSetting: function(treeId){
				return settings[treeId];
			},
			getSettings: function(){
				return settings
			},
            // 获取根节点下所有节点
            getNodes: function (setting) {
                return this.data.nodeChildren(setting, this.data.getRoot(setting));
            },
            // get node index bellow parentNode
			getNodeIndex: function (setting, node) {
				if(!node) return null;
				//获取父节点
				var parentNode = node.parentTreeId ? node.getParentNode() : this.data.getRoot(setting),
					//获取其父节点的所有子节点
					children = this.data.nodeChildren(setting, parentNode);
				for (var i = 0; i <= children.length - 1; i++){
					if (children[i] === node){
						//返回节点的下标，从0开始
						return i;
					}
				}
				return -1;
            },
            getNextNode: function (setting, node) {
				if (!node) return null;
				var parentNode = node.parentTreeId ? node.getParentNode() : this.data.getRoot(setting),
					children = this.data.nodeChildren(setting, parentNode);
                for (var i = 0; i <= children.length - 1; i++){
                    if (children[i] === node){
                        //返回节点下一个节点
                        return (i == children.length - 1 ? null : children[i + 1]);
                    }
                }
                return null;
            },
            getPreNode: function(setting, node){
				if(!node)return null;
                var parentNode = node.parentTreeId ? node.getParentNode() : this.data.getRoot(setting),
                    children = this.data.nodeChildren(setting, parentNode);
                for (var i = 0; i <= children.length - 1; i++){
                    if (children[i] === node){
                        //返回节点下一个节点
                        return (i == 0 ? null : children[i - 1]);
                    }
                }
                return null;
			},
            getNodeCache: function (setting, treeId) {
				if (!treeId) return null;
				var n = caches[setting.treeId].nodes[this.data.getNodeCacheId(treeId)];
				return n ? n : null;
            },
            // 获取节点的路径，如父节点-父节点1-节点
			getNodePath: function (setting, node) {
				if (!node) return null;
				var path;
				if (node.parentTreeId) {
					path = node.getParentNode().getPath();
				} else {
					path = [];
				}

				if (path) {
					path.push(node);
				}
				return path;
            },
            nodeIsParent: function (setting, node, newIsParent) {
                if (!node) {
                    return false;
                }
                var key = setting.data.key.isParent;
                if (typeof  newIsParent !== "undefined"){
                    if (typeof  newIsParent !== "string"){
                        newIsParent = this.tools.eqs(newIsParent, "true");
                    }
                    newIsParent = !!newIsParent;
                    node[key] = newIsParent;
                }
                return node[key];
            },
			// 获取节点下的所有子节点，或为节点添加新的子节点
			nodeChildren: function(setting, node, newChildren){
				if (!node){
					return null;
				}
				var key = setting.data.key.children;
				if (typeof  newChildren !== "undefined"){
					node[key] = newChildren;
				}
				return node[key];
			},
			nodeName: function(setting, node, newName){
                var key = setting.data.key.name;
                if (typeof newName !== 'undefined') {
                    node[key] = newName;
                }
                return "" + node[key];
			},
            nodeTitle: function (setting, node) {
                var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
                return "" + node[t];
            },

            /*
            * 查询节点信息
            * */
            /* 全部匹配 */
			// 一个个的出结果
            getNodeByParam: function (setting, nodes, key, value) {
                if (!nodes || !key) return null;
                for (var i = 0; i < nodes.length; i++){
                    var node = nodes[i];
                    if (node[key] == value){
                        return nodes[i];
                    }
                    var children = this.data.nodeChildren(setting, node);
                    var tmp = this.data.getNodeByParam(setting, children, key, value);
                    if (tmp) return tmp;
                }
                return null;
            },
            // 返回一个结果集
            getNodesByParam: function (setting, nodes, key, value) {
                if (!nodes || !key) return [];
                var result = [];
                for (var i = 0; i < nodes.length; i++){
                    var node = nodes[i];
                    if (node[key] == value){
                        result.push(node);
                    }
                    var children = this.data.nodeChildren(setting, node);
                    result = result.concat(this.data.getNodesByParam(setting, children, key, value));
                }
                return result;
            },
			/* 模糊匹配 */
			getNodesByParamFuzzy: function (setting, nodes, key, value) {
                if (!nodes || !key) return [];
                var result = [];
                value = value.toLowerCase();
                for (var i = 0; i < nodes.length; i++){
                    var node = nodes[i];
                    if (typeof node[key] == "string" && nodes[i][key].toLowerCase().indexOf(value) > -1){
                        result.push(node);
                    }
                    var children = this.data.nodeChildren(setting, node);
                    result = result.concat(this.data.getNodesByParamFuzzy(setting, children, key, value));
                }
                return result;
            },
			/* 根据条件查询 */
            getNodesByFilter: function (setting, nodes, filter, isSingle, invokeParam) {
                if (!nodes) return (isSingle ? null : []);
                var result = isSingle ? null : [];
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    if (this.tools.apply(filter, [node, invokeParam], false)) {
                        if (isSingle) {
                            return node;
                        }
                        result.push(node);
                    }
                    var children = this.data.nodeChildren(setting, node);
                    var tmpResult = this.data.getNodesByFilter(setting, children, filter, isSingle, invokeParam);
                    if (isSingle && !!tmpResult) {
                        return tmpResult;
                    }
                    result = isSingle ? tmpResult : result.concat(tmpResult);
                }
                return result;
            },
			getqTreeTools: function (treeId) {
				var root = this.getRoot(this.getSetting(treeId));
				return root ? root.treeTools : null;
            },
            /************************ 初始化 ********************/
            initCache: function (setting) {
				for (var i = 0; i< this._init.caches.length; i++){
					this._init.caches[i].apply(this, arguments);
				}
            },
            initNode: function (setting) {
                for (var i = 0; i< this._init.nodes.length; i++){
                    this._init.nodes[i].apply(this, arguments);
                }
            },
            initRoot: function (setting) {
                for (var i = 0; i< this._init.roots.length; i++){
                    this._init.roots[i].apply(this, arguments);
                }
            },
            /************************ 判断 ********************/
            isSelectedNode: function (setting, node) {
				var root = this.data.getRoot(setting);
				for (var i = 0; i < root.curSelectedList.length; i++){
					if (node === root.curSelectedList[i]) return true;
				}
            },
            /************************ 操作 ********************/
            // 删除
            removeSelectedNode: function (setting, node) {
                var root = this.data.getRoot(setting);
                for (var i = 0, j = root.curSelectedList.length; i < j; i++) {
                    if (node === root.curSelectedList[i] || !this.data.getNodeCache(setting, root.curSelectedList[i].treeId)) {
                        root.curSelectedList.splice(i, 1);
                        setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, node]);
                        i--;
                        j--;
                    }
                }
            },
            removeNodeCache: function(setting, node){
                var children = this.data.nodeChildren(setting, node);
                if (children){
                    for (var i = 0; i < children.length; i++){
                        this.data.removeNodeCache(setting, children[i]);
                    }
                }
                this.data.getCache(setting).nodes[this.data.getNodeCacheId(node.treeId)] = null;
            },

			//设置
			setCache: function (setting, cache) {
				caches[setting.treeId] = cache;
            },
			setRoot: function (setting, root) {
				roots[setting.treeId] = root;
            },
            setqTreeTools: function (setting, qTreeTools) {
				for (var i = 0; i < this._init.qTreeTools.length; i++){
					this._init.qTreeTools[i].apply(this, arguments);
				}
            },
			// 转换为数组格式
			transformToArrayFormat: function (setting, nodes) {
                if (!nodes) return [];
                var r = [];
                if (this.tools.isArray(nodes)) {
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        var node = nodes[i];
                        _do(node);
                    }
                } else {
                    _do(nodes);
                }
                return r;

                function _do(_node) {
                    r.push(_node);
                    var children = this.data.nodeChildren(setting, _node);
                    if (children) {
                        r = r.concat(this.data.transformToArrayFormat(setting, children));
                    }
                }
            },
			// 转换为文件树格式
            transformToqTreeFormat: function (setting, sNodes) {
                var i, l,
                    key = setting.data.simpleData.idKey,
                    parentKey = setting.data.simpleData.pIdKey;
                if (!key || key == "" || !sNodes) return [];

                if (this.tools.isArray(sNodes)) {
                    var r = [];
                    var tmpMap = {};
                    for (i = 0, l = sNodes.length; i < l; i++) {
                        tmpMap[sNodes[i][key]] = sNodes[i];
                    }
                    for (i = 0, l = sNodes.length; i < l; i++) {
                        var p = tmpMap[sNodes[i][parentKey]];
                        if (p && sNodes[i][key] != sNodes[i][parentKey]) {
                            var children = this.data.nodeChildren(setting, p);
                            if (!children) {
                                children = this.data.nodeChildren(setting, p, []);
                            }
                            children.push(sNodes[i]);
                        } else {
                            r.push(sNodes[i]);
                        }
                    }
                    return r;
                } else {
                    return [sNodes];
                }
            }
		},
			// 事件代理方法
		this.event = {
			bindEvent: function (setting) {
				for (var i = 0; i < this._init.binds.length; i++){
					this._init.binds[i].apply(this, arguments);
				} 
            },
			unbindEvent: function (setting) {
                for (var i = 0; i < this._init.unbind.length; i++){
                    this._init.unbind[i].apply(this, arguments);
                }
            },
			bindTree: function (setting) {
				var eventParam = {
				    treeId: setting.treeId
                },
                    obj = setting.treeObj;
				if (!setting.view.txtSelectedEnable) {
				    obj.addEventListener('selectstart', this.handler.onSelectStart).css({
                        "-moz-user-select": "-moz-none"
                    });
                }
                // TODO
            },
            unbindTree: function (setting) {
              // TODO
            },
            doProxy: function (e) {
                // TODO
            },
            proxy: function (e) {
                //TODO
            }
		},
		this.handler = {},
        this.tools = {},
        this.view = {},
        this._initRoot = function (setting){
            var rootNode = this.data.getRoot(setting);
            if(!rootNode) {
                rootNode = {};
                this.data.setRoot(setting, rootNode);
            }
            this.data.nodeChildren(setting, rootNode, []);
            rootNode.expandTriggerFlag = false;
            rootNode.curSelectedList = [];
            rootNode.noSelection = true;
            rootNode.createNodes = [];
            rootNode.qId = 0;
        },
        this._initCache = function (setting) {
            var cache = this.data.getCache(setting);
            if(!cache){
                cache = {};
                this.data.setCache(setting, cache);
            }
            cache.nodes = {};
            cache.doms = {};
        },
        // 默认绑定事件
        this._bindEvent = function (setting){
            var obj = setting.treeObj,
                eventCName = consts.event;
            obj.addEventListener(eventCName.NODECREATED, function (event, treeId, node) {
                this.tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
            });
            obj.addEventListener(eventCName.CLICK, function (event, treeId, node, srcEvent, clickFlag) {
                this.tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
            });
            obj.addEventListener(eventCName.EXPAND, function (event, treeId, node) {
                this.tools.apply(setting.callback.onExpand, [event, treeId, node]);
            });
            obj.addEventListener(eventCName.COLLAPSE, function (event, treeId, node) {
                this.tools.apply(setting.callback.onCollapse, [event, treeId, node]);
            });
            obj.addEventListener(eventCName.REMOVE, function (event, treeId, treeNode) {
                this.tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
            });
            obj.addEventListener(eventCName.SELECTED, function (event, treeId, node) {
                this.tools.apply(setting.callback.onSelected, [treeId, node]);
            });
            obj.addEventListener(eventCName.UNSELECTED, function (event, treeId, node) {
                this.tools.apply(setting.callback.onUnSelected, [treeId, node]);
            });
        },
        // 解除默认绑定事件
        this._unbindEvent = function (setting) {
            var obj = setting.treeObj,
                eventCName = consts.event;
            obj.removeEventListener(eventCName.NODECREATED)
                .removeEventListener(eventCName.CLICK)
                .removeEventListener(eventCName.EXPAND)
                .removeEventListener(eventCName.COLLAPSE)
                .removeEventListener(eventCName.REMOVE)
                .removeEventListener(eventCName.SELECTED)
                .removeEventListener(eventCName.UNSELECTED);
        },
        this._initNode = function(n,setting, parentId, level, lastNode, isFirstNode, isLastNode){
            // n，传入的node节点信息
            if(!n){
                return;
            }
            var rootNode = this.data.getRoot(setting, n),
                children = this.data.getChildrenNode(setting, n),
                isParent = this.data.nodeIsParent(setting, n);
            // 对传入的nose节点存储信息
            n.level = level;
            // treeId = _level_index
            n.treeId = setting.treeId + "_" + n.level + "_" + index;
            n.parentTreeId = parentNode ? parentNode.treeId : null;
            n.isFirstNode = isFirstNode;
            n.isLastNode = isLastNode;

            // n具有的方法
            n.getParentNode = function () {
                return this.data.getNodeCache(setting, n.parentId);
            };
            n.getPreNode = function () {
                return this.data.getPreNode(setting, n);
            };
            n.getNextNode = function () {
                return this.data.getNextNode(setting, n);
            };
            n.getIndex = function () {
                return this.data.getNodeIndex(setting, n);
            };
            n.getPath = function () {
                return this.data.getNodePath(setting, n);
            };
        }
	    /****************** 定义赋值 ******************/
	    this.consts = this._const,
	    this._z = {
	        tools: this.tools,
            view: this.view,
            event: this.event,
            data: this.data,
        }
	}

	qTree.prototype = {
        getqTreeObj : function(treeId){
            var obj = data.getqTreeObj(treeId);
            return obj ? obj : null;
        },
        destroy : function(treeId){
            if (!!treeId && treeId.length > 0){
                this.view.destroy(this.data.getSetting(treeId));
            } else {
                for (var s in this.settings) {
                    this.view.destroy(this.settings[s]);
                }
            }
        },
        init : function(obj, qSetting, qNodes) {
            var setting = this.tools.clone(this._setting);
            // js中使用深拷贝
            this.deepCopy(setting, qSetting);
        },
        // 深拷贝，自带的object.assign()只是浅拷贝
        deepCopy: function(p, c) {
            var c = c || {};
            for (var i in p) {
                if (typeof p[i] === 'object') {
                    c[i] = (p[i].constructor === Array) ? [] : {};
                    this.deepCopy(p[i], c[i]);
                } else {
                    c[i] = p[i];
                }
        }
        return c;
    }
    };

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