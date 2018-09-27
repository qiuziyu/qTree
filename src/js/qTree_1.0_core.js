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
                addDiyDom: null
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
		this.handler = {
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
                setting.treeObj.trigger(consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
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
                return (typeof setting.callback.onRightClick) != "function";
            },
            onSelectStart: function (e) {
                var n = e.originalEvent.srcElement.nodeName.toLowerCase();
                return (n === "input" || n === "textarea");
            }
        },
        this.tools = {
		    apply: function (fun, param, defaultValue) {
		        if ((typeof fun) == "function") {
                    return fun.apply(qt, param ? param : []);
                }
                return defaultValue;
            },
            clone: function (obj) {
                if (obj === null) return null;
                var o = this.tools.isArray(obj) ? [] : {};
                for (var i in obj) {
                    o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? this.tools.clone(obj[i]) : obj[i]);
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
            }
        },
        this.view = {
		    addNodes: function (setting, parentNode, index, newNodes, isSilent) {
                // 获取父节点存在的状态
                var isParent = this.data.nodeIsParent(setting, parentNode);
                // 若没有父节点，状态为false，是叶子节点
                if (parentNode && !isParent && setting.data.keep.leaf) {
                    return;
                }
                if (!this.tools.isArray(newNodes)) {
                    newNodes = [newNodes];
                }
                if (setting.data.simpleData.enable) {
                    newNodes = this.data.transformToqTreeFormat(setting, newNodes);
                }
                if (parentNode) {
                    var target_switchObj = $$(parentNode, this.consts.id.SWITCH, setting),
                        target_iconObj = $$(parentNode, this.consts.id.ICON, setting),
                        target_ulObj = $$(parentNode, this.consts.id.UL);
                    if (!parentNode.open) {
                        this.view.replaceSwitchClass(parentNode, target_switchObj, this.consts.folder.CLOSE);
                        this.view.replaceIconClass(parentNode, target_iconObj, this.consts.folder.CLOSE);
                        parentNode.open = false;
                        target_ulObj.style.display = "none";
                    }
                    this.data.addNodesData(setting, parentNode, index, newNodes);
                    this.view.createNodes(setting, parentNode.level + 1, newNodes, parentNode, index);
                    if (! isSilent) {
                        this.view.expandCollapseParentNode(setting, parentNode, true);
                    }
                }else {
                    this.data.addNodesData(setting, this.data.getRoot(setting), index, newNodes);
                    this.view.createNodes(setting, 0, newNodes, null, index);
                }
            },
            appendNodes: function (setting, level, nodes, parentNode, index, initFlag, openFlag) {
                if (!nodes) return [];
                var html = [];

                var tmpPNode = (parentNode) ? parentNode : this.data.getRoot(setting),
                    tmpPChild = this.data.nodeChildren(setting, tmpPNode),
                    isFirstNode, isLastNode;

                if (!tmpPChild || index >= tmpPChild.length - nodes.length) {
                    index = -1;
                }

                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    if (initFlag) {
                        isFirstNode = ((index === 0 || tmpPChild.length == nodes.length) && (i == 0));
                        isLastNode = (index < 0 && i == (nodes.length - 1));
                        this.data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
                        this.data.addNodeCache(setting, node);
                    }
                    var isParent = this.data.nodeIsParent(setting, node);

                    var childHtml = [];
                    var children = this.data.nodeChildren(setting, node);
                    if (children && children.length > 0) {
                        //make child html first, because checkType
                        childHtml = this.view.appendNodes(setting, level + 1, children, node, -1, initFlag, openFlag && node.open);
                    }
                    if (openFlag) {
                        this.view.makeDOMNodeMainBefore(html, setting, node);
                        this.view.makeDOMNodeLine(html, setting, node);
                        this.data.getBeforeA(setting, node, html);
                        this.view.makeDOMNodeNameBefore(html, setting, node);
                        this.data.getInnerBeforeA(setting, node, html);
                        this.view.makeDOMNodeIcon(html, setting, node);
                        this.data.getInnerAfterA(setting, node, html);
                        this.view.makeDOMNodeNameAfter(html, setting, node);
                        this.data.getAfterA(setting, node, html);
                        if (isParent && node.open) {
                            this.view.makeUlHtml(setting, node, html, childHtml.join(''));
                        }
                        this.view.makeDOMNodeMainAfter(html, setting, node);
                        this.data.addCreatedNode(setting, node);
                    }
                }
                return html;
            },
            appendParentULDom: function (setting, node) {
                var html = [],
                    nObj = $$(node, setting);
                if (!nObj.get(0) && !!node.parentTreeId) {
                    this.view.appendParentULDom(setting, node.getParentNode());
                    nObj = $$(node, setting);
                }
                var ulObj = $$(node, this.consts.id.UL, setting);
                if (ulObj.get(0)) {
                    ulObj.remove();
                }
                var children = this.data.nodeChildren(setting, node),
                    childHtml = this.view.appendNodes(setting, node.level + 1, children, node, -1, false, true);
                this.view.makeUlHtml(setting, node, html, childHtml.join(''));
                nObj.append(html.join(''));
            },
            asyncNode: function (setting, node, isSilent, callback) {
                var i, l;
                var isParent = this.data.nodeIsParent(setting, node);
                if (node && !isParent) {
                    this.tools.apply(callback);
                    return false;
                } else if (node && node.isAjaxing) {
                    return false;
                } else if (this.tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) === false) {
                    this.tools.apply(callback);
                    return false;
                }
                if (node) {
                    node.isAjaxing = true;
                    var icoObj = $$(node, this.consts.id.ICON, setting);
                    icoObj.setAttribute({"style": "", "class": this.consts.className.BUTTON + " " + this.consts.className.ICON_LOADING});
                }

                var tmpParam = {};
                var autoParam = this.tools.apply(setting.async.autoParam, [setting.treeId, node], setting.async.autoParam);
                for (i = 0, l = autoParam.length; node && i < l; i++) {
                    var pKey = autoParam[i].split("="), spKey = pKey;
                    if (pKey.length > 1) {
                        spKey = pKey[1];
                        pKey = pKey[0];
                    }
                    tmpParam[spKey] = node[pKey];
                }
                var otherParam = this.tools.apply(setting.async.otherParam, [setting.treeId, node], setting.async.otherParam);
                if (this.tools.isArray(otherParam)) {
                    for (i = 0, l = otherParam.length; i < l; i += 2) {
                        tmpParam[otherParam[i]] = otherParam[i + 1];
                    }
                } else {
                    for (var p in otherParam) {
                        tmpParam[p] = otherParam[p];
                    }
                }

                var _tmpV = this.data.getRoot(setting)._ver;
                var xhr = new XMLHttpRequest();
                var type = setting.async.type;
                var url = this.tools.apply(setting.async.url, [setting.treeId, node], setting.async.url);
                var data = setting.async.contentType.indexOf('application/json') > -1 ? JSON.stringify(tmpParam) : tmpParam;
                xhr.open(type, url, true);
                xhr.setRequestHeader("Content-Type", setting.async.contentType);
                xhr.onreadystatechange = function(msg, XMLHttpRequest, textStatus, errorThrown){
                    if (xhr.readyState === 4 && xhr.status===200){
                        if (_tmpV !== this.data.getRoot(setting)._ver) {
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
                            newNodes = this.tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
                            this.view.addNodes(setting, node, -1, !!newNodes ? this.tools.clone(newNodes) : [], !!isSilent);
                        } else {
                            this.view.addNodes(setting, node, -1, [], !!isSilent);
                        }
                        setting.treeObj.trigger(this.consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
                        this.tools.apply(callback);
                    }else {
                        if (_tmpV !== this.data.getRoot(setting)._ver) {
                            return;
                        }
                        if (node) node.isAjaxing = null;
                        this.view.setNodeLineIcos(setting, node);
                        setting.treeObj.trigger(this.consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
                    }
                };
                xhr.send(data);
                /*$.ajax({
                    contentType: setting.async.contentType,
                    cache: false,
                    type: setting.async.type,
                    url: this.tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
                    data: setting.async.contentType.indexOf('application/json') > -1 ? JSON.stringify(tmpParam) : tmpParam,
                    dataType: setting.async.dataType,
                    headers: setting.async.headers,
                    xhrFields: setting.async.xhrFields,
                    success: function (msg) {
                        if (_tmpV !== this.data.getRoot(setting)._ver) {
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
                            newNodes = this.tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
                            this.view.addNodes(setting, node, -1, !!newNodes ? this.tools.clone(newNodes) : [], !!isSilent);
                        } else {
                            this.view.addNodes(setting, node, -1, [], !!isSilent);
                        }
                        setting.treeObj.trigger(this.consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
                        this.tools.apply(callback);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (_tmpV !== this.data.getRoot(setting)._ver) {
                            return;
                        }
                        if (node) node.isAjaxing = null;
                        this.view.setNodeLineIcos(setting, node);
                        setting.treeObj.trigger(this.consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
                    }
                });*/
                return true;
            },
            cancelPreSelectedNode: function (setting, node, excludeNode) {
                var list = this.data.getRoot(setting).curSelectedList,
                    i, n;
                for (i = list.length - 1; i >= 0; i--) {
                    n = list[i];
                    if (node === n || (!node && (!excludeNode || excludeNode !== n))) {
                        var id = this.$(n, this.consts.id.A, setting);
                        document.getElementById(id).classList.remove(this.consts.node.SELECTEDNODE);
                        if (node) {
                            this.data.removeSelectedNode(setting, node);
                            break;
                        } else {
                            list.splice(i, 1);
                            // TODO
                            setting.treeObj.trigger(this.consts.event.UNSELECTED, [setting.treeId, n]);
                        }
                    }
                }
            },
            createNodeCallback: function(setting) {
                if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
                    var root = this.data.getRoot(setting);
                    while (root.createdNodes.length > 0) {
                        var node = root.createdNodes.shift();
                        this.tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
                        if (!!setting.callback.onNodeCreated) {
                            setting.treeObj.trigger(this.consts.event.NODECREATED, [setting.treeId, node]);
                        }
                    }
                }
            },
            createNodes: function(setting, level, nodes, parentNode, index) {
                if (!nodes || nodes.length == 0) return;
                var root = this.data.getRoot(setting),
                    openFlag = !parentNode || parentNode.open || !!$$(this.data.nodeChildren(setting, parentNode)[0], setting).get(0);
                root.createdNodes = [];
                var zTreeHtml = this.view.appendNodes(setting, level, nodes, parentNode, index, true, openFlag),
                    parentObj, nextObj;

                if (!parentNode) {
                    parentObj = setting.treeObj;
                    //setting.treeObj.append(zTreeHtml.join(''));
                } else {
                    var ulObj = $$(parentNode, this.consts.id.UL, setting);
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
                        $(nextObj).before(zTreeHtml.join(''));
                    } else {
                        parentObj.append(zTreeHtml.join(''));
                    }
                }

                this.view.createNodeCallback(setting);
            },
            destroy: function (setting) {
                if (!setting) return;
                this.data.initCache(setting);
                this.data.initRoot(setting);
                event.unbindTree(setting);
                event.unbindEvent(setting);
                setting.treeObj.empty();
                delete this.settings[setting.treeId];
            },
            expandCollapseNode: function (setting, node, expandFlag, animateFlag, callback) {
                var root = this.data.getRoot(setting);
                var tmpCb, _callback;
                if (!node) {
                    this.tools.apply(callback, []);
                    return;
                }
                var children = this.data.nodeChildren(setting, node);
                var isParent = this.data.nodeIsParent(setting, node);
                if (root.expandTriggerFlag) {
                    _callback = callback;
                    tmpCb = function () {
                        if (_callback) _callback();
                        if (node.open) {
                            setting.treeObj.trigger(this.consts.event.EXPAND, [setting.treeId, node]);
                        } else {
                            setting.treeObj.trigger(this.consts.event.COLLAPSE, [setting.treeId, node]);
                        }
                    };
                    callback = tmpCb;
                    root.expandTriggerFlag = false;
                }
                if (!node.open && isParent && ((!$$(node, consts.id.UL, setting).get(0)) || (children && children.length > 0 && !$$(children[0], setting).get(0)))) {
                    this.view.appendParentULDom(setting, node);
                    this.view.createNodeCallback(setting);
                }
                if (node.open == expandFlag) {
                    this.tools.apply(callback, []);
                    return;
                }

                var ulObj = document.getElementById(this.$(node, this.consts.id.UL, setting)),
                    switchObj = document.getElementById(this.$(node, this.consts.id.SWITCH, setting)),
                    icoObj = document.getElementById(this.$(node, this.consts.id.ICON, setting));

                if (isParent) {
                    node.open = !node.open;
                    if (node.iconOpen && node.iconClose) {
                        icoObj.setAttribute("style", this.view.makeNodeIcoStyle(setting, node));
                    }

                    if (node.open) {
                        this.view.replaceSwitchClass(node, switchObj, this.consts.folder.OPEN);
                        this.view.replaceIconClass(node, icoObj, this.consts.folder.OPEN);
                        if (animateFlag === false || setting.view.expandSpeed === "") {
                            ulObj.show();
                            this.tools.apply(callback, []);
                        } else {
                            if (children && children.length > 0) {
                                ulObj.slideDown(setting.view.expandSpeed, callback);
                            } else {
                                ulObj.show();
                                this.tools.apply(callback, []);
                            }
                        }
                    } else {
                        view.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
                        view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
                        if (animateFlag == false || setting.view.expandSpeed == "" || !(children && children.length > 0)) {
                            ulObj.hide();
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
                    this.view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
                    return;
                } else {
                    this.view.expandCollapseNode(setting, node, expandFlag, animateFlag);
                }
                if (node.parentTId) {
                    this.view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
                }
            },
            expandCollapseSonNode: function (setting, node, expandFlag, animateFlag, callback) {
                var root = this.data.getRoot(setting),
                    treeNodes = (node) ? this.data.nodeChildren(setting, node) : this.data.nodeChildren(setting, root),
                    selfAnimateSign = (node) ? false : animateFlag,
                    expandTriggerFlag = this.data.getRoot(setting).expandTriggerFlag;
                this.data.getRoot(setting).expandTriggerFlag = false;
                if (treeNodes) {
                    for (var i = 0, l = treeNodes.length; i < l; i++) {
                        if (treeNodes[i]) this.view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
                    }
                }
                this.data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
                this.view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
            },
            isSelectedNode: function (setting, node) {
                if (!node) {
                    return false;
                }
                var list = this.data.getRoot(setting).curSelectedList,
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
                    name = this.setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                html.push("<span id='", node.treeId, this.consts.id.ICON,
                    "' title='' treeNode", this.consts.id.ICON, " class='", this.view.makeNodeIcoClass(setting, node),
                    "' style='", this.view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.treeId, this.consts.id.SPAN,
                    "' class='", this.consts.className.NAME,
                    "'>", name, "</span>");
            },
            makeDOMNodeLine: function (html, setting, node) {
                html.push("<span id='", node.treeId, this.consts.id.SWITCH, "' title='' class='", this.view.makeNodeLineClass(setting, node), "' treeNode", this.consts.id.SWITCH, "></span>");
            },
            makeDOMNodeMainAfter: function (html, setting, node) {
                html.push("</li>");
            },
            makeDOMNodeMainBefore: function (html, setting, node) {
                html.push("<li id='", node.treeId, "' class='", this.consts.className.LEVEL, node.level, "' tabindex='0' hidefocus='true' treenode>");
            },
            makeDOMNodeNameAfter: function (html, setting, node) {
                html.push("</a>");
            },
            makeDOMNodeNameBefore: function (html, setting, node) {
                var title = this.data.nodeTitle(setting, node),
                    url = this.view.makeNodeUrl(setting, node),
                    fontcss = this.view.makeNodeFontCss(setting, node),
                    fontStyle = [];
                for (var f in fontcss) {
                    fontStyle.push(f, ":", fontcss[f], ";");
                }
                html.push("<a id='", node.treeId, this.consts.id.A, "' class='", this.consts.className.LEVEL, node.level, "' treeNode", this.consts.id.A, " onclick=\"", (node.click || ''),
                    "\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='", this.view.makeNodeTarget(node), "' style='", fontStyle.join(''),
                    "'");
                if (this.tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {
                    html.push("title='", title.replace(/'/g, "&#39;").replace(/</g, '&lt;').replace(/>/g, '&gt;'), "'");
                }
                html.push(">");
            },
            makeNodeFontCss: function (setting, node) {
                var fontCss = this.tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
                return (fontCss && ((typeof fontCss) !== "function")) ? fontCss : {};
            },
            makeNodeIcoClass: function (setting, node) {
                var icoCss = ["ico"];
                if (!node.isAjaxing) {
                    var isParent = this.data.nodeIsParent(setting, node);
                    icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
                    if (isParent) {
                        icoCss.push(node.open ? this.consts.folder.OPEN : this.consts.folder.CLOSE);
                    } else {
                        icoCss.push(this.consts.folder.DOCU);
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
                        lineClass.push(this.consts.line.ROOT);
                    } else if (node.level === 0 && node.isFirstNode) {
                        lineClass.push(this.consts.line.ROOTS);
                    } else if (node.isLastNode) {
                        lineClass.push(this.consts.line.BOTTOM);
                    } else {
                        lineClass.push(this.consts.line.CENTER);
                    }
                } else {
                    lineClass.push(this.consts.line.NOLINE);
                }
                if (this.data.nodeIsParent(setting, node)) {
                    lineClass.push(node.open ? this.consts.folder.OPEN : this.consts.folder.CLOSE);
                } else {
                    lineClass.push(this.consts.folder.DOCU);
                }
                return this.view.makeNodeLineClassEx(node) + lineClass.join('_');
            },
            makeNodeLineClassEx: function (node) {
                return this.consts.className.BUTTON + " " + this.consts.className.LEVEL + node.level + " " + this.consts.className.SWITCH + " ";
            },
            makeNodeTarget: function (node) {
                return (node.target || "_blank");
            },
            makeNodeUrl: function (setting, node) {
                var urlKey = setting.data.key.url;
                return node[urlKey] ? node[urlKey] : null;
            },
            makeUlHtml: function (setting, node, html, content) {
                html.push("<ul id='", node.treeId, this.consts.id.UL, "' class='", this.consts.className.LEVEL, node.level, " ", this.view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block" : "none"), "'>");
                html.push(content);
                html.push("</ul>");
            },
            makeUlLineClass: function (setting, node) {
                return ((setting.view.showLine && !node.isLastNode) ? this.consts.line.LINE : "");
            },
            removeChildNodes: function (setting, node) {
                if (!node) return;
                var nodes = this.data.nodeChildren(setting, node);
                if (!nodes) return;

                for (var i = 0, l = nodes.length; i < l; i++) {
                    this.data.removeNodeCache(setting, nodes[i]);
                }
                this.data.removeSelectedNode(setting);
                delete node[setting.data.key.children];

                if (!setting.data.keep.parent) {
                    this.data.nodeIsParent(setting, node, false);
                    node.open = false;
                    var tmp_switchObj = $$(node, this.consts.id.SWITCH, setting),
                        tmp_icoObj = $$(node, this.consts.id.ICON, setting);
                    this.view.replaceSwitchClass(node, tmp_switchObj, this.consts.folder.FILE);
                    this.view.replaceIconClass(node, tmp_icoObj, this.consts.folder.FILE);
                    $$(node, this.consts.id.UL, setting).remove();
                } else {
                    $$(node, this.consts.id.UL, setting).empty();
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
                var children = this.data.nodeChildren(setting, parentNode);
                if (children.length > 0) {
                    children[0].isFirstNode = true;
                }
            },
            setLastNode: function (setting, parentNode) {
                var children = this.data.nodeChildren(setting, parentNode);
                if (children.length > 0) {
                    children[children.length - 1].isLastNode = true;
                }
            },
            removeNode: function (setting, node) {
                var root = this.data.getRoot(setting),
                    parentNode = (node.parentTreeId) ? node.getParentNode() : root;

                node.isFirstNode = false;
                node.isLastNode = false;
                node.getPreNode = function () {
                    return null;
                };
                node.getNextNode = function () {
                    return null;
                };

                if (!data.getNodeCache(setting, node.tId)) {
                    return;
                }

                $$(node, setting).remove();
                data.removeNodeCache(setting, node);
                data.removeSelectedNode(setting, node);

                var children = data.nodeChildren(setting, parentNode);
                for (var i = 0, l = children.length; i < l; i++) {
                    if (children[i].tId == node.tId) {
                        children.splice(i, 1);
                        break;
                    }
                }
                view.setFirstNode(setting, parentNode);
                view.setLastNode(setting, parentNode);

                var tmp_ulObj, tmp_switchObj, tmp_icoObj,
                    childLength = children.length;

                //repair nodes old parent
                if (!setting.data.keep.parent && childLength == 0) {
                    //old parentNode has no child nodes
                    data.nodeIsParent(setting, parentNode, false);
                    parentNode.open = false;
                    delete parentNode[setting.data.key.children];
                    tmp_ulObj = $$(parentNode, consts.id.UL, setting);
                    tmp_switchObj = $$(parentNode, consts.id.SWITCH, setting);
                    tmp_icoObj = $$(parentNode, consts.id.ICON, setting);
                    view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.DOCU);
                    view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
                    tmp_ulObj.css("display", "none");

                } else if (setting.view.showLine && childLength > 0) {
                    //old parentNode has child nodes
                    var newLast = children[childLength - 1];
                    tmp_ulObj = $$(newLast, consts.id.UL, setting);
                    tmp_switchObj = $$(newLast, consts.id.SWITCH, setting);
                    tmp_icoObj = $$(newLast, consts.id.ICON, setting);
                    if (parentNode == root) {
                        if (children.length == 1) {
                            //node was root, and ztree has only one root after move node
                            view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT);
                        } else {
                            var tmp_first_switchObj = $$(children[0], consts.id.SWITCH, setting);
                            view.replaceSwitchClass(children[0], tmp_first_switchObj, consts.line.ROOTS);
                            view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
                        }
                    } else {
                        view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
                    }
                    tmp_ulObj.removeClass(consts.line.LINE);
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
            setNodeLineIcos: function (setting, node) {
                if (!node) return;
                var switchObj = $$(node, this.consts.id.SWITCH, setting),
                    ulObj = $$(node, this.consts.id.UL, setting),
                    icoObj = $$(node, this.consts.id.ICON, setting),
                    ulLine = this.view.makeUlLineClass(setting, node);
                if (ulLine.length == 0) {
                    ulObj.classList.remove(this.consts.line.LINE);
                } else {
                    ulObj.classList.add(ulLine);
                }
                switchObj.setAttribute("class", this.view.makeNodeLineClass(setting, node));
                if (this.data.nodeIsParent(setting, node)) {
                    switchObj.removeAttribute("disabled");
                } else {
                    switchObj.setAttribute("disabled", "disabled");
                }
                icoObj.removeAttribute("style");
                icoObj.setAttribute("style", this.view.makeNodeIcoStyle(setting, node));
                icoObj.setAttribute("class", this.view.makeNodeIcoClass(setting, node));
            },
            setNodeName: function (setting, node) {
                var title = this.data.nodeTitle(setting, node),
                    nObj = $$(node, this.consts.id.SPAN, setting);
                nObj.empty();
                if (setting.view.nameIsHTML) {
                    nObj.html(this.data.nodeName(setting, node));
                } else {
                    nObj.text(this.data.nodeName(setting, node));
                }
                if (this.tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
                    var aObj = $$(node, this.consts.id.A, setting);
                    aObj.setAttribute("title", !title ? "" : title);
                }
            },
            setNodeTarget: function (setting, node) {
                var aObj = $$(node, this.consts.id.A, setting);
                aObj.setAttribute("target", this.view.makeNodeTarget(node));
            },
            setNodeUrl: function (setting, node) {
                var aObj = $$(node, this.consts.id.A, setting),
                    url = this.view.makeNodeUrl(setting, node);
                if (url == null || url.length == 0) {
                    aObj.removeAttribute("href");
                } else {
                    aObj.setAttribute("href", url);
                }
            },
            switchNode: function (setting, node) {
                if (node.open || !this.tools.canAsync(setting, node)) {
                    this.view.expandCollapseNode(setting, node, !node.open);
                } else if (setting.async.enable) {
                    if (!this.view.asyncNode(setting, node)) {
                        this.view.expandCollapseNode(setting, node, !node.open);
                        return;
                    }
                } else if (node) {
                    this.view.expandCollapseNode(setting, node, !node.open);
                }
            }
        },
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
            // js中使用深拷贝,将qSetting深拷贝到setting上(object,target)
            this.deepCopy(qSetting, setting);

            setting.treeId = obj.getAttribute("id");
            setting.treeObj = obj;
            setting.treeObj.empty();
            this.settings[setting.treeId] = setting;

            // for old browser,(e.g., IE6)
            if (typeof document.body.style.maxHeight === "undefined") {
                setting.view.expandSpeed = "";
            }
            // 一系列初始化操作
            this.data.initRoot(setting);
            var root = this.data.getRoot(setting);
            qNodes = qNodes ? tools.clone(tools.isArray(qNodes) ? qNodes : [qNodes]) : [];
            if (setting.data.simpleData.enable) {
                this.data.nodeChildren(setting, root, this.data.transformToqTreeFormat(setting,qNodes));
            }else {
                this.data.nodeChildren(setting, root, qNodes);
            }
            this.data.initCache(setting);
            this.event.unbindTree(setting);
            this.event.bindTree(setting);
            this.event.unbindEvent(setting);
            this.event.bindEvent(setting);

            var qTreeTools = {
                setting: setting,
                addNodes: function (parentNode, index, newNodes, isSilent) {
                    if (!parentNode) parentNode = null; // 没有父节点，设为空
                    // 获取父节点存在的状态
                    var isParent = this.data.nodeIsParent(setting, parentNode);
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
                    var qNewNodes = this.tools.clone(this.tools.isArray(newNodes) ? newNodes : [newNodes]);

                    function addCallback() {
                        this.view.addNodes(setting, parentNode, index, qNewNodes, (isSilent === true));
                    }
                    if (this.tools.canAsync(setting, parentNode)) {
                        this.view.asyncNode(setting, parentNode, isSilent, addCallback);
                    } else {
                        addCallback();
                    }
                    return qNewNodes;
                },
                cancelSelectedNode: function (node) {
                    this.view.cancelPreSelectedNode(setting, node);
                },
                destroy: function () {
                    this.view.destroy(setting);
                },
                expandAll: function (expandFlag) {
                    expandFlag = !!expandFlag;
                    this.view.expandCollapseSonNode(setting, null, expandFlag, true);
                    return expandFlag;
                },
                expandNode: function (node, expandFlag, sonSign, focus, callbackFlag) {
                    if (!node || !this.data.nodeIsParent(setting, node)) return null;
                    if (expandFlag !== true && expandFlag !== false) {
                        expandFlag = !node.open;
                    }
                    callbackFlag = !!callbackFlag;

                    if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false)) {
                        return null;
                    } else if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false)) {
                        return null;
                    }
                    if (expandFlag && node.parentTId) {
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
                        var a = $$(node, setting).get(0);
                        if (a && focus !== false) {
                            view.scrollIntoView(setting, a);
                        }
                    }
                },
                getNodes: function () {
                    return this.data.getNodes(setting);
                },
                getNodeByParam: function (key, value, parentNode) {
                    if (!key) return null;
                    return this.data.getNodeByParam(setting, parentNode ? this.data.nodeChildren(setting, parentNode) : this.data.getNodes(setting), key, value);
                },
                getNodeByTId: function (tId) {
                    return this.data.getNodeCache(setting, tId);
                },
                getNodesByParam: function (key, value, parentNode) {
                    if (!key) return null;
                    return this.data.getNodesByParam(setting, parentNode ? this.data.nodeChildren(setting, parentNode) : this.data.getNodes(setting), key, value);
                },
                getNodesByParamFuzzy: function (key, value, parentNode) {
                    if (!key) return null;
                    return this.data.getNodesByParamFuzzy(setting, parentNode ? this.data.nodeChildren(setting, parentNode) : this.data.getNodes(setting), key, value);
                },
                getNodesByFilter: function (filter, isSingle, parentNode, invokeParam) {
                    isSingle = !!isSingle;
                    if (!filter || (typeof filter != "function")) return (isSingle ? null : []);
                    return this.data.getNodesByFilter(setting, parentNode ? this.data.nodeChildren(setting, parentNode) : this.data.getNodes(setting), filter, isSingle, invokeParam);
                },
                getNodeIndex: function (node) {
                    if (!node) return null;
                    var parentNode = (node.parentTreeId) ? node.getParentNode() : this.data.getRoot(setting);
                    var children = this.data.nodeChildren(setting, parentNode);
                    for (var i = 0, l = children.length; i < l; i++) {
                        if (children[i] == node) return i;
                    }
                    return -1;
                },
                getSelectedNodes: function () {
                    var r = [], list = this.data.getRoot(setting).curSelectedList;
                    for (var i = 0, l = list.length; i < l; i++) {
                        r.push(list[i]);
                    }
                    return r;
                },
                isSelectedNode: function (node) {
                    return this.data.isSelectedNode(setting, node);
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
                        parentNode = this.data.getRoot(setting);
                    }
                    if (reloadType == "refresh") {
                        var children = this.data.nodeChildren(setting, parentNode);
                        for (var i = 0, l = children ? children.length : 0; i < l; i++) {
                            this.data.removeNodeCache(setting, children[i]);
                        }
                        this.data.removeSelectedNode(setting);
                        this.data.nodeChildren(setting, parentNode, []);
                        if (isRoot) {
                            this.setting.treeObj.empty();
                        } else {
                            var ulObj = document.getElementById(this.$(parentNode, this.consts.id.UL, setting));
                            ulObj.empty();
                        }
                    }
                    this.view.asyncNode(this.setting, isRoot ? null : parentNode, !!isSilent, callback);
                },
                refresh: function () {
                    this.setting.treeObj.empty();
                    var root = this.data.getRoot(setting),
                        nodes = this.data.nodeChildren(setting, root);
                    this.data.initRoot(setting);
                    this.data.nodeChildren(setting, root, nodes);
                    this.data.initCache(setting);
                    this.view.createNodes(setting, 0, this.data.nodeChildren(setting, root), null, -1);
                },
                removeChildNodes: function (node) {
                    if (!node) return null;
                    var nodes = this.data.nodeChildren(setting, node);
                    this.view.removeChildNodes(setting, node);
                    return nodes ? nodes : null;
                },
                removeNode: function (node, callbackFlag) {
                    if (!node) return;
                    callbackFlag = !!callbackFlag;
                    if (callbackFlag && this.tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return;
                    this.view.removeNode(setting, node);
                    if (callbackFlag) {
                        this.setting.treeObj.trigger(this.consts.event.REMOVE, [setting.treeId, node]);
                    }
                },
                selectNode: function (node, addFlag, isSilent) {
                    if (!node) return;
                    if (this.tools.uCanDo(setting)) {
                        addFlag = setting.view.selectedMulti && addFlag;
                        if (node.parentTreeId) {
                            this.view.expandCollapseParentNode(setting, node.getParentNode(), true, false, showNodeFocus);
                        } else if (!isSilent) {
                            try {
                                document.getElementById(this.$(node, setting)).focus().blur();
                            } catch (e) {
                            }
                        }
                        this.view.selectNode(setting, node, addFlag);
                    }

                    function showNodeFocus() {
                        if (isSilent) {
                            return;
                        }
                        var a = $$(node, setting).get(0);
                        view.scrollIntoView(setting, a);
                    }
                },
                transformTozTreeNodes: function (simpleNodes) {
                    return this.data.transformTozTreeFormat(setting, simpleNodes);
                },
                transformToArray: function (nodes) {
                    return this.data.transformToArrayFormat(setting, nodes);
                },
                updateNode: function (node, checkTypeFlag) {
                    if (!node) return;
                    var nObj = $$(node, setting);
                    if (nObj.get(0) && this.tools.uCanDo(setting)) {
                        this.view.setNodeName(setting, node);
                        this.view.setNodeTarget(setting, node);
                        this.view.setNodeUrl(setting, node);
                        this.view.setNodeLineIcos(setting, node);
                        this.view.setNodeFontCss(setting, node);
                    }
                }
            };
            root.treeTools = qTreeTools;
            this.data.setqTreeTools(setting, qTreeTools);
            var children = this.data.nodeChildren(setting, root);
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