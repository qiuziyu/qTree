/*
;(function(undefined){
	"use strict"
	var _global;

	//插件构造函数
	function QTree(){
		this.settings = {},
		this.roots = {},
		this.caches = {},
		this._consts = {
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
            line: {
                ROOT: "root",
                ROOTS: "roots",
                CENTER: "center",
                BOTTOM: "bottom",
                NOLINE: "noline",
                LINE: "line"
            },
			folder: {
				OPEN: "open",
				CLOSE: "close",
                FILE: "file"
			},
			event: {
				NODECREATED: "qtree_createNode",
				CLICK: "qtree_click",
				EXPAND: "qtree_expand",
				COLLAPSE: "qtree_collapse",
                ASYNC_SUCCESS: "ztree_async_success",
                ASYNC_ERROR: "ztree_async_error",
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
                showTitle: true,
				fontCSS: {},
				selectedMulti: true,
                expandSpeed: "fast",
                nameIsHTML: false,
                addDiyDom: null,
                autoCancelSelected: true,
                txtSelectedEnable: false
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
                xhrFields: {},
				url: "",
				autoParam: [],
                otherParam: [],
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
	    /!****************** 定义赋值 ******************!/
        this.consts = this._consts,
	    this._z = {
	        tools: this.tools,
            view: this.view,
            event: this.treeEvents,
            data: this.data,
            handler: this.handlers
        }
	}

	QTree.prototype = {
        _initRoot : function (setting){
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
        _initCache : function (setting) {
            var cache = data.getCache(setting);
            if(!cache){
                cache = {};
                data.setCache(setting, cache);
            }
            cache.nodes = {};
            cache.doms = {};
        },
        // 默认绑定事件
        _bindEvent : function (setting){
            var obj = setting.treeObj,
                eventCName = consts.event;
            obj.addEventListener(eventCName.NODECREATED, function (event, treeId, node) {
                tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
            });
            obj.addEventListener(eventCName.CLICK, function (event, treeId, node, srcEvent, clickFlag) {
                tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
            });
            obj.addEventListener(eventCName.EXPAND, function (event, treeId, node) {
                tools.apply(setting.callback.onExpand, [event, treeId, node]);
            });
            obj.addEventListener(eventCName.COLLAPSE, function (event, treeId, node) {
                tools.apply(setting.callback.onCollapse, [event, treeId, node]);
            });
            obj.addEventListener(eventCName.REMOVE, function (event, treeId, treeNode) {
                tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
            });
            obj.addEventListener(eventCName.SELECTED, function (event, treeId, node) {
                tools.apply(setting.callback.onSelected, [treeId, node]);
            });
            obj.addEventListener(eventCName.UNSELECTED, function (event, treeId, node) {
                tools.apply(setting.callback.onUnSelected, [treeId, node]);
            });
        },
        // 解除默认绑定事件
        _unbindEvent : function (setting) {
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
        _initNode : function(n,setting, parentId, level, lastNode, isFirstNode, isLastNode){
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
        },
        // methods of data
        data : {
            /!************************ 添加 ********************!/
            // cache of node
            addNodeCache: function (setting, node) {
                this.getCache(setting).nodes[this.getNodeCacheId(node.treeId)] = node;
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
                var children = this.nodeChildren(setting, parentNode), params;
                // 没有子节点
                if (!children){
                    children = this.nodeChildren(setting, parentNode, []);
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
                this.nodeIsParent(setting, parentNode, true);

                if (index < 0) {
                    this.nodeChildren(setting, parentNode, children.concat(nodes));
                }else {
                    params = [index, 0].concat(nodes);
                    children.splice.apply(children, params);
                }
            },
            addSelectedNode: function (setting, node) {
                var root = this.getRoot(setting);
                if (!this.isSelectedNode(setting, node)){
                    root.curSelectedList.push(node);
                }
            },
            /!************************ 获取 ********************!/
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
                return this.caches[setting.treeId];
            },
            getRoot: function(setting){
                return setting ? this.roots[setting.treeId] : null;
            },
            getRoots: function(){
                return this.roots;
            },
            getSetting: function(treeId){
                return this.settings[treeId];
            },
            getSettings: function(){
                return this.settings;
            },
            // 获取根节点下所有节点
            getNodes: function (setting) {
                return this.nodeChildren(setting, this.getRoot(setting));
            },
            // get node index bellow parentNode
            getNodeIndex: function (setting, node) {
                if(!node) return null;
                //获取父节点
                var parentNode = node.parentTreeId ? node.getParentNode() : this.getRoot(setting),
                    //获取其父节点的所有子节点
                    children = this.nodeChildren(setting, parentNode);
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
                var parentNode = node.parentTreeId ? node.getParentNode() : this.getRoot(setting),
                    children = this.nodeChildren(setting, parentNode);
                for (var i = 0; i <= children.length - 1; i++){
                    if (children[i] === node){
                        //返回节点下一个节点
                        return (i === children.length - 1 ? null : children[i + 1]);
                    }
                }
                return null;
            },
            getPreNode: function(setting, node){
                if(!node)return null;
                var parentNode = node.parentTreeId ? node.getParentNode() : this.getRoot(setting),
                    children = this.nodeChildren(setting, parentNode);
                for (var i = 0; i <= children.length - 1; i++){
                    if (children[i] === node){
                        //返回节点下一个节点
                        return (i === 0 ? null : children[i - 1]);
                    }
                }
                return null;
            },
            getNodeCache: function (setting, treeId) {
                if (!treeId) return null;
                var n = caches[setting.treeId].nodes[this.getNodeCacheId(treeId)];
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
                        newIsParent = tools.eqs(newIsParent, "true");
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

            /!*
            * 查询节点信息
            * *!/
            /!* 全部匹配 *!/
            // 一个个的出结果
            getNodeByParam: function (setting, nodes, key, value) {
                if (!nodes || !key) return null;
                for (var i = 0; i < nodes.length; i++){
                    var node = nodes[i];
                    if (node[key] === value){
                        return nodes[i];
                    }
                    var children = this.nodeChildren(setting, node);
                    var tmp = this.getNodeByParam(setting, children, key, value);
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
                    if (node[key] === value){
                        result.push(node);
                    }
                    var children = this.nodeChildren(setting, node);
                    result = result.concat(this.getNodesByParam(setting, children, key, value));
                }
                return result;
            },
            /!* 模糊匹配 *!/
            getNodesByParamFuzzy: function (setting, nodes, key, value) {
                if (!nodes || !key) return [];
                var result = [];
                value = value.toLowerCase();
                for (var i = 0; i < nodes.length; i++){
                    var node = nodes[i];
                    if (typeof node[key] === "string" && nodes[i][key].toLowerCase().indexOf(value) > -1){
                        result.push(node);
                    }
                    var children = this.nodeChildren(setting, node);
                    result = result.concat(this.getNodesByParamFuzzy(setting, children, key, value));
                }
                return result;
            },
            /!* 根据条件查询 *!/
            getNodesByFilter: function (setting, nodes, filter, isSingle, invokeParam) {
                if (!nodes) return (isSingle ? null : []);
                var result = isSingle ? null : [];
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    if (tools.apply(filter, [node, invokeParam], false)) {
                        if (isSingle) {
                            return node;
                        }
                        result.push(node);
                    }
                    var children = this.nodeChildren(setting, node);
                    var tmpResult = this.getNodesByFilter(setting, children, filter, isSingle, invokeParam);
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
            /!************************ 初始化 ********************!/
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
                for (var i = 0; i< _init.roots.length; i++){
                    _init.roots[i].apply(this, arguments);
                }
            },
            /!************************ 判断 ********************!/
            isSelectedNode: function (setting, node) {
                var root = this.getRoot(setting);
                for (var i = 0; i < root.curSelectedList.length; i++){
                    if (node === root.curSelectedList[i]) return true;
                }
            },
            /!************************ 操作 ********************!/
            // 删除
            removeSelectedNode: function (setting, node) {
                var root = this.getRoot(setting);
                for (var i = 0, j = root.curSelectedList.length; i < j; i++) {
                    if (node === root.curSelectedList[i] || !this.getNodeCache(setting, root.curSelectedList[i].treeId)) {
                        root.curSelectedList.splice(i, 1);
                        setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, node]);
                        i--;
                        j--;
                    }
                }
            },
            removeNodeCache: function(setting, node){
                var children = this.nodeChildren(setting, node);
                if (children){
                    for (var i = 0; i < children.length; i++){
                        this.removeNodeCache(setting, children[i]);
                    }
                }
                this.getCache(setting).nodes[this.getNodeCacheId(node.treeId)] = null;
            },

            //设置
            setCache: function (setting, cache) {
                this.caches[setting.treeId] = cache;
            },
            setRoot: function (setting, root) {
                this.roots[setting.treeId] = root;
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
                if (tools.isArray(nodes)) {
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
                    var children = this.nodeChildren(setting, _node);
                    if (children) {
                        r = r.concat(this.transformToArrayFormat(setting, children));
                    }
                }
            },
            // 转换为文件树格式
            transformToqTreeFormat: function (setting, sNodes) {
                var i, l,
                    key = setting.data.simpleData.idKey,
                    parentKey = setting.data.simpleData.pIdKey;
                if (!key || key === "" || !sNodes) return [];

                if (tools.isArray(sNodes)) {
                    var r = [];
                    var tmpMap = {};
                    for (i = 0, l = sNodes.length; i < l; i++) {
                        tmpMap[sNodes[i][key]] = sNodes[i];
                    }
                    for (i = 0, l = sNodes.length; i < l; i++) {
                        var p = tmpMap[sNodes[i][parentKey]];
                        if (p && sNodes[i][key] !== sNodes[i][parentKey]) {
                            var children = this.nodeChildren(setting, p);
                            if (!children) {
                                children = this.nodeChildren(setting, p, []);
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
        treeEvents : {
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
                    var cssPro = "-moz-user-select";
                    obj.addEventListener('selectstart', handlers.onSelectStart).style.cssPro = "-moz-none";
                }
                obj.addEventListener('click', eventParam, this.proxy);
                obj.addEventListener('dblclick', eventParam, this.proxy);
                obj.addEventListener('mouseover', eventParam, this.proxy);
                obj.addEventListener('mouseout', eventParam, this.proxy);
                obj.addEventListener('mousedown', eventParam, this.proxy);
                obj.addEventListener('mouseup', eventParam, this.proxy);
                obj.addEventListener('contextmenu', eventParam, this.proxy);
            },
            unbindTree: function (setting) {
                var o = setting.treeObj;
                o.removeEventListener('selectstart', handlers.onSelectStart)
                    .removeEventListener('click', this.proxy)
                    .removeEventListener('dblclick', this.proxy)
                    .removeEventListener('mouseover', this.proxy)
                    .removeEventListener('mouseout', this.proxy)
                    .removeEventListener('mousedown', this.proxy)
                    .removeEventListener('mouseup', this.proxy)
                    .removeEventListener('contextmenu', this.proxy);
            },
            doProxy: function (e) {
                var results = [];
                for (var i = 0, j = this._init.proxys.length; i < j; i++) {
                    var proxyResult = this._init.proxys[i].apply(this, arguments);
                    results.push(proxyResult);
                    if (proxyResult.stop) {
                        break;
                    }
                }
                return results;
            },
            proxy: function (e) {
                var setting = data.getSetting(e.data.treeId);
                if (!tools.uCanDo(setting, e)) return true;
                var results = this.doProxy(e),
                    r = true, x = false;
                for (var i = 0, l = results.length; i < l; i++) {
                    var proxyResult = results[i];
                    if (proxyResult.nodeEventCallback) {
                        x = true;
                        r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
                    }
                    if (proxyResult.treeEventCallback) {
                        x = true;
                        r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
                    }
                }
                return r;
            }
        },
        handlers : {
            onSwitchNode: function (event, node) {
                var setting = data.getSetting(event.data.treeId);
                if (node.open) {
                    if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) === false) return true;
                    data.getRoot(setting).expandTriggerFlag = true;
                    view.switchNode(setting, node);
                } else {
                    if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) === false) return true;
                    data.getRoot(setting).expandTriggerFlag = true;
                    view.switchNode(setting, node);
                }
                return true;
            },
            onClickNode: function (event, node) {
                var setting = data.getSetting(event.data.treeId),
                    clickFlag = ((setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey)) && data.isSelectedNode(setting, node)) ? 0 : (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey) && setting.view.selectedMulti) ? 2 : 1;
                if (tools.apply(setting.callback.beforeClick, [setting.treeId, node, clickFlag], true) === false) return true;
                if (clickFlag === 0) {
                    view.cancelPreSelectedNode(setting, node);
                } else {
                    view.selectNode(setting, node, clickFlag === 2);
                }
                setting.treeObj.trigger(this.consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
                return true;
            },
            onZTreeMousedown: function (event, node) {
                var setting = data.getSetting(event.data.treeId);
                if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
                    tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
                }
                return true;
            },
            onZTreeMouseup: function (event, node) {
                var setting = data.getSetting(event.data.treeId);
                if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
                    tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
                }
                return true;
            },
            onZTreeDblclick: function (event, node) {
                var setting = data.getSetting(event.data.treeId);
                if (tools.apply(setting.callback.beforeDblClick, [setting.treeId, node], true)) {
                    tools.apply(setting.callback.onDblClick, [event, setting.treeId, node]);
                }
                return true;
            },
            onZTreeContextmenu: function (event, node) {
                var setting = data.getSetting(event.data.treeId);
                if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
                    tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
                }
                return (typeof setting.callback.onRightClick) !== "function";
            },
            onSelectStart: function (e) {
                var n = e.originalEvent.srcElement.nodeName.toLowerCase();
                return (n === "input" || n === "textarea");
            }
        },
        tools : {
            apply: function (fun, param, defaultValue) {
                if ((typeof fun) === "function") {
                    return fun.apply(qt, param ? param : []);
                }
                return defaultValue;
            },
            canAsync: function (setting, node) {
                var children = data.nodeChildren(setting, node);
                var isParent = data.nodeIsParent(setting, node);
                return (setting.async.enable && node && isParent && !(node.zAsync || (children && children.length > 0)));
            },
            clone: function (obj) {
                if (obj === null) return null;
                var o = this.isArray(obj) ? [] : {};
                for (var i in obj) {
                    o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? this.clone(obj[i]) : obj[i]);
                }
                return o;
            },
            eqs: function (str1, str2) {
                return str1.toLowerCase() === str2.toLowerCase();
            },
            isArray: function (arr) {
                return Object.prototype.toString.apply(arr) === "[object Array]";
            },
            isElement: function (o) {
                return (
                    typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
                );
            },
            $: function (node, exp, setting) {
                if (!!exp && typeof exp !== "string") {
                    setting = exp;
                    exp = "";
                }
                if (typeof node === "string") {
                    return this.$(node, setting ? setting.treeObj.get(0).ownerDocument : null);
                } else {
                    return this.$("#" + node.treeId + exp, setting ? setting.treeObj : null);
                }
            },
            getMDom: function (setting, curDom, targetExpr) {
                if (!curDom) return null;
                while (curDom && curDom.id !== setting.treeId){
                    for (var i = 0, l = targetExpr.length; curDom.tagName && i < l; i++) {
                        if (this.tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
                            return curDom;
                        }
                    }
                    curDom = curDom.parentNode;
                }
                return null;
            },
            getNodeMainDom: function (target) {
                return (document.getElementById(target.id).parent("li").get(0) || document.getElementById(target).parentsUntil("li").parent().get(0));
            },
            isChildOrSelf: function (dom, parentId) {
                return (document.getElementById(dom.id).closest("#" + parentId).length > 0);
            },
            uCanDo: function (setting, e) {
                return true;
            }
        },
        view : {
            addNodes: function (setting, parentNode, index, newNodes, isSilent) {
                // 获取父节点存在的状态
                var isParent = data.nodeIsParent(setting, parentNode);
                // 若没有父节点，状态为false，是叶子节点
                if (parentNode && !isParent && setting.data.keep.leaf) {
                    return;
                }
                if (!tools.isArray(newNodes)) {
                    newNodes = [newNodes];
                }
                if (setting.data.simpleData.enable) {
                    newNodes = data.transformToqTreeFormat(setting, newNodes);
                }
                if (parentNode) {
                    var target_switchObj = $$(parentNode, this.consts.id.SWITCH, setting),
                        target_iconObj = $$(parentNode, this.consts.id.ICON, setting),
                        target_ulObj = $$(parentNode, this.consts.id.UL);
                    if (!parentNode.open) {
                        this.replaceSwitchClass(parentNode, target_switchObj, this.consts.folder.CLOSE);
                        this.replaceIconClass(parentNode, target_iconObj, this.consts.folder.CLOSE);
                        parentNode.open = false;
                        target_ulObj.style.display = "none";
                    }
                    data.addNodesData(setting, parentNode, index, newNodes);
                    this.createNodes(setting, parentNode.level + 1, newNodes, parentNode, index);
                    if (! isSilent) {
                        this.expandCollapseParentNode(setting, parentNode, true);
                    }
                }else {
                    data.addNodesData(setting, data.getRoot(setting), index, newNodes);
                    this.createNodes(setting, 0, newNodes, null, index);
                }
            },
            appendNodes: function (setting, level, nodes, parentNode, index, initFlag, openFlag) {
                if (!nodes) return [];
                var html = [];

                var tmpPNode = (parentNode) ? parentNode : data.getRoot(setting),
                    tmpPChild = data.nodeChildren(setting, tmpPNode),
                    isFirstNode, isLastNode;

                if (!tmpPChild || index >= tmpPChild.length - nodes.length) {
                    index = -1;
                }

                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    if (initFlag) {
                        isFirstNode = ((index === 0 || tmpPChild.length === nodes.length) && (i === 0));
                        isLastNode = (index < 0 && i === (nodes.length - 1));
                        data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
                        data.addNodeCache(setting, node);
                    }
                    var isParent = data.nodeIsParent(setting, node);

                    var childHtml = [];
                    var children = data.nodeChildren(setting, node);
                    if (children && children.length > 0) {
                        //make child html first, because checkType
                        childHtml = this.view.appendNodes(setting, level + 1, children, node, -1, initFlag, openFlag && node.open);
                    }
                    if (openFlag) {
                        this.view.makeDOMNodeMainBefore(html, setting, node);
                        this.view.makeDOMNodeLine(html, setting, node);
                        data.getBeforeA(setting, node, html);
                        this.view.makeDOMNodeNameBefore(html, setting, node);
                        data.getInnerBeforeA(setting, node, html);
                        this.view.makeDOMNodeIcon(html, setting, node);
                        data.getInnerAfterA(setting, node, html);
                        this.view.makeDOMNodeNameAfter(html, setting, node);
                        data.getAfterA(setting, node, html);
                        if (isParent && node.open) {
                            this.view.makeUlHtml(setting, node, html, childHtml.join(''));
                        }
                        this.view.makeDOMNodeMainAfter(html, setting, node);
                        data.addCreatedNode(setting, node);
                    }
                }
                return html;
            },
            appendParentULDom: function (setting, node) {
                var html = [],
                    nObj = this.$(node, setting);
                if (!nObj.get(0) && !!node.parentTreeId) {
                    this.appendParentULDom(setting, node.getParentNode());
                    nObj = this.$(node, setting);
                }
                var ulObj = this.$(node, consts.id.UL, setting);
                if (ulObj.get(0)) {
                    ulObj.remove();
                }
                var children = data.nodeChildren(setting, node),
                    childHtml = this.appendNodes(setting, node.level + 1, children, node, -1, false, true);
                this.makeUlHtml(setting, node, html, childHtml.join(''));
                nObj.append(html.join(''));
            },
            asyncNode: function (setting, node, isSilent, callback) {
                var i, l;
                var isParent = data.nodeIsParent(setting, node);
                if (node && !isParent) {
                    tools.apply(callback);
                    return false;
                } else if (node && node.isAjaxing) {
                    return false;
                } else if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) === false) {
                    tools.apply(callback);
                    return false;
                }
                if (node) {
                    node.isAjaxing = true;
                    var icoObj = this.$(node, consts.id.ICON, setting);
                    icoObj.setAttribute({"style": "", "class": consts.className.BUTTON + " " + consts.className.ICON_LOADING});
                }

                var tmpParam = {};
                var autoParam = tools.apply(setting.async.autoParam, [setting.treeId, node], setting.async.autoParam);
                for (i = 0, l = autoParam.length; node && i < l; i++) {
                    var pKey = autoParam[i].split("="), spKey = pKey;
                    if (pKey.length > 1) {
                        spKey = pKey[1];
                        pKey = pKey[0];
                    }
                    tmpParam[spKey] = node[pKey];
                }
                var otherParam = tools.apply(setting.async.otherParam, [setting.treeId, node], setting.async.otherParam);
                if (tools.isArray(otherParam)) {
                    for (i = 0, l = otherParam.length; i < l; i += 2) {
                        tmpParam[otherParam[i]] = otherParam[i + 1];
                    }
                } else {
                    for (var p in otherParam) {
                        tmpParam[p] = otherParam[p];
                    }
                }

                var _tmpV = data.getRoot(setting)._ver;
                var xhr = new XMLHttpRequest();
                var type = setting.async.type;
                var url = tools.apply(setting.async.url, [setting.treeId, node], setting.async.url);
                xhr.open(type, url, true);
                xhr.setRequestHeader("Content-Type", setting.async.contentType);
                xhr.onreadystatechange = function(msg, XMLHttpRequest, textStatus, errorThrown){
                    if (xhr.readyState === 4 && xhr.status===200){
                        if (_tmpV !== data.getRoot(setting)._ver) {
                            return;
                        }
                        var newNodes = [];
                        try {
                            if (!msg || msg.length === 0) {
                                newNodes = [];
                            } else if (typeof msg === "string") {
                                newNodes = eval("(" + msg + ")");
                            } else {
                                newNodes = msg;
                            }
                        } catch (err) {
                            newNodes = msg;
                        }

                        if (node) {
                            node.isAjaxing = null;
                            node.zAsync = true;
                        }
                        this.setNodeLineIcons(setting, node);
                        if (newNodes && newNodes !== "") {
                            newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
                            this.view.addNodes(setting, node, -1, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
                        } else {
                            this.view.addNodes(setting, node, -1, [], !!isSilent);
                        }
                        setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
                        tools.apply(callback);
                    }else {
                        if (_tmpV !== data.getRoot(setting)._ver) {
                            return;
                        }
                        if (node) node.isAjaxing = null;
                        this.setNodeLineIcons(setting, node);
                        setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
                    }
                };
                xhr.send(setting.async.contentType.indexOf('application/json') > -1 ? JSON.stringify(tmpParam) : tmpParam);
                /!*$.ajax({
                    contentType: setting.async.contentType,
                    cache: false,
                    type: setting.async.type,
                    url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
                    data: setting.async.contentType.indexOf('application/json') > -1 ? JSON.stringify(tmpParam) : tmpParam,
                    dataType: setting.async.dataType,
                    headers: setting.async.headers,
                    xhrFields: setting.async.xhrFields,
                    success: function (msg) {
                        if (_tmpV !== data.getRoot(setting)._ver) {
                            return;
                        }
                        var newNodes = [];
                        try {
                            if (!msg || msg.length === 0) {
                                newNodes = [];
                            } else if (typeof msg === "string") {
                                newNodes = eval("(" + msg + ")");
                            } else {
                                newNodes = msg;
                            }
                        } catch (err) {
                            newNodes = msg;
                        }

                        if (node) {
                            node.isAjaxing = null;
                            node.zAsync = true;
                        }
                        this.view.setNodeLineIcos(setting, node);
                        if (newNodes && newNodes !== "") {
                            newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
                            this.view.addNodes(setting, node, -1, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
                        } else {
                            this.view.addNodes(setting, node, -1, [], !!isSilent);
                        }
                        setting.treeObj.trigger(this.consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
                        tools.apply(callback);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (_tmpV !== data.getRoot(setting)._ver) {
                            return;
                        }
                        if (node) node.isAjaxing = null;
                        this.view.setNodeLineIcos(setting, node);
                        setting.treeObj.trigger(this.consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
                    }
                });*!/
                return true;
            },
            cancelPreSelectedNode: function (setting, node, excludeNode) {
                var list = data.getRoot(setting).curSelectedList,
                    i, n;
                for (i = list.length - 1; i >= 0; i--) {
                    n = list[i];
                    if (node === n || (!node && (!excludeNode || excludeNode !== n))) {
                        var id = this.$(n, consts.id.A, setting);
                        document.getElementById(id).classList.remove(consts.node.SELECTEDNODE);
                        if (node) {
                            data.removeSelectedNode(setting, node);
                            break;
                        } else {
                            list.splice(i, 1);
                            // TODO
                            setting.treeObj.trigger(consts.event.UNSELECTED, [setting.treeId, n]);
                        }
                    }
                }
            },
            createNodeCallback: function(setting) {
                if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
                    var root = data.getRoot(setting);
                    while (root.createdNodes.length > 0) {
                        var node = root.createdNodes.shift();
                        tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
                        if (!!setting.callback.onNodeCreated) {
                            setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node]);
                        }
                    }
                }
            },
            createNodes: function(setting, level, nodes, parentNode, index) {
                if (!nodes || nodes.length === 0) return;
                var root = data.getRoot(setting),
                    openFlag = !parentNode || parentNode.open || !!this.$(data.nodeChildren(setting, parentNode)[0], setting).get(0);
                root.createdNodes = [];
                var zTreeHtml = this.appendNodes(setting, level, nodes, parentNode, index, true, openFlag),
                    parentObj, nextObj;

                if (!parentNode) {
                    parentObj = setting.treeObj;
                    //setting.treeObj.append(zTreeHtml.join(''));
                } else {
                    var ulObj = this.$(parentNode, consts.id.UL, setting);
                    if (ulObj.get(0)) {
                        parentObj = ulObj;
                        //ulObj.append(zTreeHtml.join(''));
                    }
                }
                if (parentObj) {
                    if (index >= 0) {
                        nextObj = parentObj.children()[index];
                    }
                    if (index >= 0 && nextObj) {
                        document.getElementById(nextObj).before(zTreeHtml.join(''));
                    } else {
                        parentObj.append(zTreeHtml.join(''));
                    }
                }

                this.createNodeCallback(setting);
            },
            destroy: function (setting) {
                if (!setting) return;
                data.initCache(setting);
                data.initRoot(setting);
                treeEvents.unbindTree(setting);
                treeEvents.unbindEvent(setting);
                setting.treeObj.innerHTML = '';
                delete this.settings[setting.treeId];
            },
            expandCollapseNode: function (setting, node, expandFlag, animateFlag, callback) {
                var root = data.getRoot(setting);
                var tmpCb, _callback;
                if (!node) {
                    tools.apply(callback, []);
                    return;
                }
                var children = data.nodeChildren(setting, node);
                var isParent = data.nodeIsParent(setting, node);
                if (root.expandTriggerFlag) {
                    _callback = callback;
                    tmpCb = function () {
                        if (_callback) _callback();
                        if (node.open) {
                            setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node]);
                        } else {
                            setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node]);
                        }
                    };
                    callback = tmpCb;
                    root.expandTriggerFlag = false;
                }
                if (!node.open && isParent && ((!$$(node, consts.id.UL, setting).get(0)) || (children && children.length > 0 && !$$(children[0], setting).get(0)))) {
                    this.appendParentULDom(setting, node);
                    this.createNodeCallback(setting);
                }
                if (node.open === expandFlag) {
                    tools.apply(callback, []);
                    return;
                }

                var ulObj = this.$(node, consts.id.UL, setting),
                    switchObj = this.$(node, consts.id.SWITCH, setting),
                    icoObj = this.$(node, consts.id.ICON, setting);

                if (isParent) {
                    node.open = !node.open;
                    if (node.iconOpen && node.iconClose) {
                        icoObj.setAttribute("style", this.makeNodeIcoStyle(setting, node));
                    }

                    if (node.open) {
                        this.replaceSwitchClass(node, switchObj, consts.folder.OPEN);
                        this.replaceIconClass(node, icoObj, consts.folder.OPEN);
                        if (animateFlag === false || setting.view.expandSpeed === "") {
                            ulObj.show();
                            tools.apply(callback, []);
                        } else {
                            if (children && children.length > 0) {
                                ulObj.slideDown(setting.view.expandSpeed, callback);
                            } else {
                                ulObj.show();
                                tools.apply(callback, []);
                            }
                        }
                    } else {
                        this.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
                        this.replaceIconClass(node, icoObj, consts.folder.CLOSE);
                        if (animateFlag === false || setting.view.expandSpeed === "" || !(children && children.length > 0)) {
                            ulObj.style.display = "none";
                            tools.apply(callback, []);
                        } else {
                            ulObj.slideUp(setting.view.expandSpeed, callback);
                        }
                    }
                } else {
                    tools.apply(callback, []);
                }
            },
            expandCollapseParentNode: function (setting, node, expandFlag, animateFlag, callback) {
                if (!node) return;
                if (!node.parentTreeId) {
                    this.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
                    return;
                } else {
                    this.expandCollapseNode(setting, node, expandFlag, animateFlag);
                }
                if (node.parentTreeId) {
                    this.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
                }
            },
            expandCollapseSonNode: function (setting, node, expandFlag, animateFlag, callback) {
                var root = data.getRoot(setting),
                    treeNodes = (node) ? data.nodeChildren(setting, node) : data.nodeChildren(setting, root),
                    selfAnimateSign = (node) ? false : animateFlag,
                    expandTriggerFlag = data.getRoot(setting).expandTriggerFlag;
                data.getRoot(setting).expandTriggerFlag = false;
                if (treeNodes) {
                    for (var i = 0, l = treeNodes.length; i < l; i++) {
                        if (treeNodes[i]) this.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
                    }
                }
                data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
                this.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
            },
            isSelectedNode: function (setting, node) {
                if (!node) {
                    return false;
                }
                var list = data.getRoot(setting).curSelectedList,
                    i;
                for (i = list.length - 1; i >= 0; i--) {
                    if (node === list[i]) {
                        return true;
                    }
                }
                return false;
            },
            makeDOMNodeIcon: function (html, setting, node) {
                var nameStr = data.nodeName(setting, node),
                    name = setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                html.push("<span id='", node.treeId, consts.id.ICON,
                    "' title='' treeNode", consts.id.ICON, " class='", this.makeNodeIcoClass(setting, node),
                    "' style='", this.makeNodeIcoStyle(setting, node), "'></span><span id='", node.treeId, consts.id.SPAN,
                    "' class='", consts.className.NAME,
                    "'>", name, "</span>");
            },
            makeDOMNodeLine: function (html, setting, node) {
                html.push("<span id='", node.treeId, consts.id.SWITCH, "' title='' class='", this.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH, "></span>");
            },
            makeDOMNodeMainAfter: function (html, setting, node) {
                html.push("</li>");
            },
            makeDOMNodeMainBefore: function (html, setting, node) {
                html.push("<li id='", node.treeId, "' class='", consts.className.LEVEL, node.level, "' tabindex='0' hidefocus='true' treenode>");
            },
            makeDOMNodeNameAfter: function (html, setting, node) {
                html.push("</a>");
            },
            makeDOMNodeNameBefore: function (html, setting, node) {
                var title = data.nodeTitle(setting, node),
                    url = this.makeNodeUrl(setting, node),
                    fontcss = this.makeNodeFontCss(setting, node),
                    fontStyle = [];
                for (var f in fontcss) {
                    fontStyle.push(f, ":", fontcss[f], ";");
                }
                html.push("<a id='", node.treeId, consts.id.A, "' class='", consts.className.LEVEL, node.level, "' treeNode", consts.id.A, " onclick=\"", (node.click || ''),
                    "\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='", this.makeNodeTarget(node), "' style='", fontStyle.join(''),
                    "'");
                if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {
                    html.push("title='", title.replace(/'/g, "&#39;").replace(/</g, '&lt;').replace(/>/g, '&gt;'), "'");
                }
                html.push(">");
            },
            makeNodeFontCss: function (setting, node) {
                var fontCss = tools.apply(setting.view.fontCSS, [setting.treeId, node], setting.view.fontCSS);
                return (fontCss && ((typeof fontCss) !== "function")) ? fontCss : {};
            },
            makeNodeIcoClass: function (setting, node) {
                var icoCss = ["ico"];
                if (!node.isAjaxing) {
                    var isParent = data.nodeIsParent(setting, node);
                    icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
                    if (isParent) {
                        icoCss.push(node.open ? this.consts.folder.OPEN : this.consts.folder.CLOSE);
                    } else {
                        icoCss.push(this.consts.folder.FILE);
                    }
                }
                return this.consts.className.BUTTON + " " + icoCss.join('_');
            },
            makeNodeIcoStyle: function (setting, node) {
                var icoStyle = [];
                if (!node.isAjaxing) {
                    var isParent = data.nodeIsParent(setting, node);
                    var icon = (isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node[setting.data.key.icon];
                    if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
                    if (setting.view.showIcon === false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
                        icoStyle.push("width:0px;height:0px;");
                    }
                }
                return icoStyle.join('');
            },
            makeNodeLineClass: function (setting, node) {
                var lineClass = [];
                if (setting.view.showLine) {
                    if (node.level === 0 && node.isFirstNode && node.isLastNode) {
                        lineClass.push(consts.line.ROOT);
                    } else if (node.level === 0 && node.isFirstNode) {
                        lineClass.push(consts.line.ROOTS);
                    } else if (node.isLastNode) {
                        lineClass.push(consts.line.BOTTOM);
                    } else {
                        lineClass.push(consts.line.CENTER);
                    }
                } else {
                    lineClass.push(consts.line.NOLINE);
                }
                if (data.nodeIsParent(setting, node)) {
                    lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
                } else {
                    lineClass.push(consts.folder.FILE);
                }
                return this.makeNodeLineClassEx(node) + lineClass.join('_');
            },
            makeNodeLineClassEx: function (node) {
                return consts.className.BUTTON + " " + consts.className.LEVEL + node.level + " " + consts.className.SWITCH + " ";
            },
            makeNodeTarget: function (node) {
                return (node.target || "_blank");
            },
            makeNodeUrl: function (setting, node) {
                var urlKey = setting.data.key.url;
                return node[urlKey] ? node[urlKey] : null;
            },
            makeUlHtml: function (setting, node, html, content) {
                html.push("<ul id='", node.treeId, consts.id.UL, "' class='", consts.className.LEVEL, node.level, " ", this.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block" : "none"), "'>");
                html.push(content);
                html.push("</ul>");
            },
            makeUlLineClass: function (setting, node) {
                return ((setting.view.showLine && !node.isLastNode) ? consts.line.LINE : "");
            },
            removeChildNodes: function (setting, node) {
                if (!node) return;
                var nodes = data.nodeChildren(setting, node);
                if (!nodes) return;

                for (var i = 0, l = nodes.length; i < l; i++) {
                    data.removeNodeCache(setting, nodes[i]);
                }
                data.removeSelectedNode(setting);
                delete node[setting.data.key.children];

                if (!setting.data.keep.parent) {
                    data.nodeIsParent(setting, node, false);
                    node.open = false;
                    var tmp_switchObj = this.$(node, consts.id.SWITCH, setting),
                        tmp_icoObj = this.$(node, consts.id.ICON, setting);
                    this.replaceSwitchClass(node, tmp_switchObj, consts.folder.FILE);
                    this.replaceIconClass(node, tmp_icoObj, consts.folder.FILE);
                    this.$(node, consts.id.UL, setting).remove();
                } else {
                    this.$(node, consts.id.UL, setting).innerHTML = '';
                }
            },
            scrollIntoView: function (setting, dom) {
                if (!dom) {
                    return;
                }
                // support IE 7
                if (typeof Element === 'undefined') {
                    var contRect = setting.treeObj.get(0).getBoundingClientRect(),
                        findMeRect = dom.getBoundingClientRect();
                    if (findMeRect.top < contRect.top || findMeRect.bottom > contRect.bottom
                        || findMeRect.right > contRect.right || findMeRect.left < contRect.left) {
                        dom.scrollIntoView();
                    }
                    return;
                }
                // CC-BY jocki84@googlemail.com, https://gist.github.com/jocki84/6ffafd003387179a988e
                if (!Element.prototype.scrollIntoViewIfNeeded) {
                    Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
                        "use strict";

                        function makeRange(start, length) {
                            return {"start": start, "length": length, "end": start + length};
                        }

                        function coverRange(inner, outer) {
                            if (
                                false === centerIfNeeded ||
                                (outer.start < inner.end && inner.start < outer.end)
                            ) {
                                return Math.max(
                                    inner.end - outer.length,
                                    Math.min(outer.start, inner.start)
                                );
                            }
                            return (inner.start + inner.end - outer.length) / 2;
                        }

                        function makePoint(x, y) {
                            return {
                                "x": x,
                                "y": y,
                                "translate": function translate(dX, dY) {
                                    return makePoint(x + dX, y + dY);
                                }
                            };
                        }

                        function absolute(elem, pt) {
                            while (elem) {
                                pt = pt.translate(elem.offsetLeft, elem.offsetTop);
                                elem = elem.offsetParent;
                            }
                            return pt;
                        }

                        var target = absolute(this, makePoint(0, 0)),
                            extent = makePoint(this.offsetWidth, this.offsetHeight),
                            elem = this.parentNode,
                            origin;

                        while (elem instanceof HTMLElement) {
                            // Apply desired scroll amount.
                            origin = absolute(elem, makePoint(elem.clientLeft, elem.clientTop));
                            elem.scrollLeft = coverRange(
                                makeRange(target.x - origin.x, extent.x),
                                makeRange(elem.scrollLeft, elem.clientWidth)
                            );
                            elem.scrollTop = coverRange(
                                makeRange(target.y - origin.y, extent.y),
                                makeRange(elem.scrollTop, elem.clientHeight)
                            );

                            // Determine actual scroll amount by reading back scroll properties.
                            target = target.translate(-elem.scrollLeft, -elem.scrollTop);
                            elem = elem.parentNode;
                        }
                    };
                }
                dom.scrollIntoViewIfNeeded();
            },
            setFirstNode: function (setting, parentNode) {
                var children = data.nodeChildren(setting, parentNode);
                if (children.length > 0) {
                    children[0].isFirstNode = true;
                }
            },
            setLastNode: function (setting, parentNode) {
                var children = data.nodeChildren(setting, parentNode);
                if (children.length > 0) {
                    children[children.length - 1].isLastNode = true;
                }
            },
            removeNode: function (setting, node) {
                var root = data.getRoot(setting),
                    parentNode = (node.parentTreeId) ? node.getParentNode() : root;

                node.isFirstNode = false;
                node.isLastNode = false;
                node.getPreNode = function () {
                    return null;
                };
                node.getNextNode = function () {
                    return null;
                };

                if (!data.getNodeCache(setting, node.treeId)) {
                    return;
                }

                this.$(node, setting).remove();
                data.removeNodeCache(setting, node);
                data.removeSelectedNode(setting, node);

                var children = data.nodeChildren(setting, parentNode);
                for (var i = 0, l = children.length; i < l; i++) {
                    if (children[i].treeId === node.treeId) {
                        children.splice(i, 1);
                        break;
                    }
                }
                view.setFirstNode(setting, parentNode);
                view.setLastNode(setting, parentNode);

                var tmp_ulObj, tmp_switchObj, tmp_icoObj,
                    childLength = children.length;

                //repair nodes old parent
                if (!setting.data.keep.parent && childLength === 0) {
                    //old parentNode has no child nodes
                    data.nodeIsParent(setting, parentNode, false);
                    parentNode.open = false;
                    delete parentNode[setting.data.key.children];
                    tmp_ulObj = this.$(parentNode, consts.id.UL, setting);
                    tmp_switchObj = this.$(parentNode, consts.id.SWITCH, setting);
                    tmp_icoObj = this.$(parentNode, consts.id.ICON, setting);
                    view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.FILE);
                    view.replaceIconClass(parentNode, tmp_icoObj, consts.folder.FILE);
                    tmp_ulObj.style.display = "none";

                } else if (setting.view.showLine && childLength > 0) {
                    //old parentNode has child nodes
                    var newLast = children[childLength - 1];
                    tmp_ulObj = this.$(newLast, consts.id.UL, setting);
                    tmp_switchObj = this.$(newLast, consts.id.SWITCH, setting);
                    tmp_icoObj = this.$(newLast, consts.id.ICON, setting);
                    if (parentNode === root) {
                        if (children.length === 1) {
                            //node was root, and qtree has only one root after move node
                            view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT);
                        } else {
                            var tmp_first_switchObj = this.$(children[0], consts.id.SWITCH, setting);
                            view.replaceSwitchClass(children[0], tmp_first_switchObj, consts.line.ROOTS);
                            view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
                        }
                    } else {
                        view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
                    }
                    tmp_ulObj.classList.remove(consts.line.LINE);
                }
            },
            replaceSwitchClass: function (node, obj, newName) {

            },
            replaceIconClass: function (node, obj, newName) {

            },
            selectNode: function (setting, node, addFlag) {

            },
            setNodeFontCss: function (setting, treeNode) {
                var aObj = $$(treeNode, this.consts.id.A, setting),
                    fontCss = this.view.makeNodeFontCss(setting, treeNode);
                if (fontCss) {
                    aObj.classList.add(fontCss);
                }
            },
            setNodeLineIcons: function (setting, node) {
                if (!node) return;
                var switchObj = this.$(node, this.consts.id.SWITCH, setting),
                    ulObj = this.$(node, this.consts.id.UL, setting),
                    icoObj = this.$(node, this.consts.id.ICON, setting),
                    ulLine = this.makeUlLineClass(setting, node);
                if (ulLine.length === 0) {
                    ulObj.classList.remove(consts.line.LINE);
                } else {
                    ulObj.classList.add(ulLine);
                }
                switchObj.setAttribute("class", this.makeNodeLineClass(setting, node));
                if (data.nodeIsParent(setting, node)) {
                    switchObj.removeAttribute("disabled");
                } else {
                    switchObj.setAttribute("disabled", "disabled");
                }
                icoObj.removeAttribute("style");
                icoObj.setAttribute("style", this.makeNodeIcoStyle(setting, node));
                icoObj.setAttribute("class", this.makeNodeIcoClass(setting, node));
            },
            setNodeName: function (setting, node) {
                var title = data.nodeTitle(setting, node),
                    nObj = this.$(node, consts.id.SPAN, setting);
                nObj.innerHTML = '';
                if (setting.view.nameIsHTML) {
                    nObj.innerHTML(data.nodeName(setting, node));
                } else {
                    nObj.text(data.nodeName(setting, node));
                }
                if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
                    var aObj = this.$(node, consts.id.A, setting);
                    aObj.setAttribute("title", !title ? "" : title);
                }
            },
            setNodeTarget: function (setting, node) {
                var aObj = this.$(node, consts.id.A, setting);
                aObj.setAttribute("target", this.makeNodeTarget(node));
            },
            setNodeUrl: function (setting, node) {
                var aObj = this.$(node, consts.id.A, setting),
                    url = this.makeNodeUrl(setting, node);
                if (url == null || url.length === 0) {
                    aObj.removeAttribute("href");
                } else {
                    aObj.setAttribute("href", url);
                }
            },
            switchNode: function (setting, node) {
                if (node.open || !tools.canAsync(setting, node)) {
                    this.expandCollapseNode(setting, node, !node.open);
                } else if (setting.async.enable) {
                    if (!this.asyncNode(setting, node)) {
                        this.expandCollapseNode(setting, node, !node.open);
                        return ;
                    }
                } else if (node) {
                    this.expandCollapseNode(setting, node, !node.open);
                }
            }
        },
        getqTreeObj : function(treeId){
            var obj = data.getqTreeTools(treeId);
            return obj ? obj : null;
        },
        destroy : function(treeId){
            if (!!treeId && treeId.length > 0){
                this.view.destroy(data.getSetting(treeId));
            } else {
                for (var s in this.settings) {
                    this.view.destroy(this.settings[s]);
                }
            }
        },
        init : function(obj, qSetting, qNodes) {

            var setting = tools.clone(this._setting);
            // js中使用深拷贝,将qSetting深拷贝到setting上(object,target)
            this.deepCopy(qSetting, setting);

            setting.treeId = obj.getAttribute("id");
            setting.treeObj = obj;
            setting.treeObj.innerHTML = '';
            this.settings[setting.treeId] = setting;

            // for old browser,(e.g., IE6)
            if (typeof document.body.style.maxHeight === "undefined") {
                setting.view.expandSpeed = "";
            }
            // 一系列初始化操作
            data.initRoot(setting);
            var root = data.getRoot(setting);
            qNodes = qNodes ? tools.clone(tools.isArray(qNodes) ? qNodes : [qNodes]) : [];
            if (setting.data.simpleData.enable) {
                data.nodeChildren(setting, root, data.transformToqTreeFormat(setting,qNodes));
            }else {
                data.nodeChildren(setting, root, qNodes);
            }
            data.initCache(setting);
            treeEvents.unbindTree(setting);
            treeEvents.bindTree(setting);
            treeEvents.unbindEvent(setting);
            treeEvents.bindEvent(setting);

            var qTreeTools = {
                setting: setting,
                addNodes: function (parentNode, index, newNodes, isSilent) {
                    if (!parentNode) parentNode = null; // 没有父节点，设为空
                    // 获取父节点存在的状态
                    var isParent = data.nodeIsParent(setting, parentNode);
                    // 若没有父节点，状态为false，是叶子节点
                    if (parentNode && !isParent && setting.data.keep.leaf) return null;
                    // 将index按照10进制数解析
                    var i = parseInt(index, 10);
                    if (isNaN(i)){
                        isSilent = !!newNodes;
                        newNodes = index;
                        index = -1;
                    } else {
                        index = i;
                    }
                    if (!newNodes) return null;
                    var qNewNodes = tools.clone(tools.isArray(newNodes) ? newNodes : [newNodes]);

                    function addCallback() {
                        view.addNodes(setting, parentNode, index, qNewNodes, (isSilent === true));
                    }
                    if (tools.canAsync(setting, parentNode)) {
                        view.asyncNode(setting, parentNode, isSilent, addCallback);
                    } else {
                        addCallback();
                    }
                    return qNewNodes;
                },
                cancelSelectedNode: function (node) {
                    view.cancelPreSelectedNode(setting, node);
                },
                destroy: function () {
                    view.destroy(setting);
                },
                expandAll: function (expandFlag) {
                    expandFlag = !!expandFlag;
                    view.expandCollapseSonNode(setting, null, expandFlag, true);
                    return expandFlag;
                },
                expandNode: function (node, expandFlag, sonSign, focus, callbackFlag) {
                    if (!node || !data.nodeIsParent(setting, node)) return null;
                    if (expandFlag !== true && expandFlag !== false) {
                        expandFlag = !node.open;
                    }
                    callbackFlag = !!callbackFlag;

                    if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) === false)) {
                        return null;
                    } else if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) === false)) {
                        return null;
                    }
                    if (expandFlag && node.parentTreeId) {
                        view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, false);
                    }
                    if (expandFlag === node.open && !sonSign) {
                        return null;
                    }

                    data.getRoot(setting).expandTriggerFlag = callbackFlag;
                    if (!tools.canAsync(setting, node) && sonSign) {
                        view.expandCollapseSonNode(setting, node, expandFlag, true, showNodeFocus);
                    } else {
                        node.open = !expandFlag;
                        view.switchNode(this.setting, node);
                        showNodeFocus();
                    }
                    return expandFlag;

                    function showNodeFocus() {
                        var a = this.$(node, setting).get(0);
                        if (a && focus !== false) {
                            view.scrollIntoView(setting, a);
                        }
                    }
                },
                getNodes: function () {
                    return data.getNodes(setting);
                },
                getNodeByParam: function (key, value, parentNode) {
                    if (!key) return null;
                    return data.getNodeByParam(setting, parentNode ? data.nodeChildren(setting, parentNode) : data.getNodes(setting), key, value);
                },
                getNodeByTId: function (tId) {
                    return data.getNodeCache(setting, tId);
                },
                getNodesByParam: function (key, value, parentNode) {
                    if (!key) return null;
                    return data.getNodesByParam(setting, parentNode ? data.nodeChildren(setting, parentNode) : data.getNodes(setting), key, value);
                },
                getNodesByParamFuzzy: function (key, value, parentNode) {
                    if (!key) return null;
                    return data.getNodesByParamFuzzy(setting, parentNode ? data.nodeChildren(setting, parentNode) : data.getNodes(setting), key, value);
                },
                getNodesByFilter: function (filter, isSingle, parentNode, invokeParam) {
                    isSingle = !!isSingle;
                    if (!filter || (typeof filter !== "function")) return (isSingle ? null : []);
                    return data.getNodesByFilter(setting, parentNode ? data.nodeChildren(setting, parentNode) : data.getNodes(setting), filter, isSingle, invokeParam);
                },
                getNodeIndex: function (node) {
                    if (!node) return null;
                    var parentNode = (node.parentTreeId) ? node.getParentNode() : data.getRoot(setting);
                    var children = data.nodeChildren(setting, parentNode);
                    for (var i = 0, l = children.length; i < l; i++) {
                        if (children[i] === node) return i;
                    }
                    return -1;
                },
                getSelectedNodes: function () {
                    var r = [], list = data.getRoot(setting).curSelectedList;
                    for (var i = 0, l = list.length; i < l; i++) {
                        r.push(list[i]);
                    }
                    return r;
                },
                isSelectedNode: function (node) {
                    return data.isSelectedNode(setting, node);
                },
                reAsyncChildNodesPromise: function (parentNode, reloadType, isSilent) {
                    var promise = new Promise(function (resolve, reject) {
                        try {
                            qTreeTools.reAsyncChildNodes(parentNode, reloadType, isSilent, function () {
                                resolve(parentNode);
                            });
                        } catch (e) {
                            reject(e);
                        }
                    });
                    return promise;
                },
                reAsyncChildNodes: function (parentNode, reloadType, isSilent, callback) {
                    if (!this.setting.async.enable) return;
                    var isRoot = !parentNode;
                    if (isRoot) {
                        parentNode = data.getRoot(setting);
                    }
                    if (reloadType === "refresh") {
                        var children = data.nodeChildren(setting, parentNode);
                        for (var i = 0, l = children ? children.length : 0; i < l; i++) {
                            data.removeNodeCache(setting, children[i]);
                        }
                        data.removeSelectedNode(setting);
                        data.nodeChildren(setting, parentNode, []);
                        if (isRoot) {
                            this.setting.treeObj.innerHTML = '';
                        } else {
                            var ulObj = this.$(parentNode, consts.id.UL, setting);
                            ulObj.innerHTML = '';
                        }
                    }
                    view.asyncNode(this.setting, isRoot ? null : parentNode, !!isSilent, callback);
                },
                refresh: function () {
                    this.setting.treeObj.innerHTML = '';
                    var root = data.getRoot(setting),
                        nodes = data.nodeChildren(setting, root);
                    data.initRoot(setting);
                    data.nodeChildren(setting, root, nodes);
                    data.initCache(setting);
                    view.createNodes(setting, 0, data.nodeChildren(setting, root), null, -1);
                },
                removeChildNodes: function (node) {
                    if (!node) return null;
                    var nodes = data.nodeChildren(setting, node);
                    view.removeChildNodes(setting, node);
                    return nodes ? nodes : null;
                },
                removeNode: function (node, callbackFlag) {
                    if (!node) return;
                    callbackFlag = !!callbackFlag;
                    if (callbackFlag && tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) === false) return;
                    view.removeNode(setting, node);
                    if (callbackFlag) {
                        this.setting.treeObj.trigger(this.consts.event.REMOVE, [setting.treeId, node]);
                    }
                },
                selectNode: function (node, addFlag, isSilent) {
                    if (!node) return;
                    if (tools.uCanDo(setting)) {
                        addFlag = setting.view.selectedMulti && addFlag;
                        if (node.parentTreeId) {
                            view.expandCollapseParentNode(setting, node.getParentNode(), true, false, showNodeFocus);
                        } else if (!isSilent) {
                            try {
                                this.$(node, setting).focus().blur();
                            } catch (e) {
                            }
                        }
                        view.selectNode(setting, node, addFlag);
                    }

                    function showNodeFocus() {
                        if (isSilent) {
                            return;
                        }
                        var a = this.$(node, setting).get(0);
                        view.scrollIntoView(setting, a);
                    }
                },
                transformToqTreeNodes: function (simpleNodes) {
                    return data.transformToqTreeFormat(setting, simpleNodes);
                },
                transformToArray: function (nodes) {
                    return data.transformToArrayFormat(setting, nodes);
                },
                updateNode: function (node, checkTypeFlag) {
                    if (!node) return;
                    var nObj = this.$(node, setting);
                    if (nObj.get(0) && tools.uCanDo(setting)) {
                        view.setNodeName(setting, node);
                        view.setNodeTarget(setting, node);
                        view.setNodeUrl(setting, node);
                        view.setNodeLineIcons(setting, node);
                        view.setNodeFontCss(setting, node);
                    }
                }
            };
            root.treeTools = qTreeTools;
            data.setqTreeTools(setting, qTreeTools);
            var children = data.nodeChildren(setting, root);
            if (children && children.length > 0) {
                this.view.createNodes(setting, 0, children, null, -1);
            } else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
                this.view.asyncNode(setting);
            }
            return qTreeTools;
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

    var qt = new QTree(),
        tools = qt._z.tools,
        consts = qt._consts,
        view = qt._z.view,
        data = qt._z.data,
        treeEvents = qt._z.treeEvents,
        _init = qt._init;


	// 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = QTree;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return QTree;});
    } else {
        !('QTree' in _global) && (_global.QTree = QTree);
    }
}());*/
