;(function(undefined){
	"use strict"
	var _global;

	//插件构造函数
	function QTree(){

	}

    QTree.prototype = {
        settings : {},
        _consts : {
            class: {
                tree: "qTree",
                button: "btn",
                image: "img",
                type: "nodeType",
                name: "name",
                level: "level",
                content: "content",
                node: "node",
                expand: "expand",
                status: {
                    add: "add",
                    edit: "edit",
                    delete: "delete",
                    up: "up",
                    down: "down"
                }
            },
            id: {
                root: "root",
                level: "level",
                tree: "qTree"
            },
            event: {
                CLICK: "click",
                EXPAND: "expand",
                REMOVE: "remove",
                NODECREATED: "nodeCreated"
            }
        },
        _setting : {
            treeId: "",
            treeObj: null,
            view: {
                showIcon: true,
                expand: true,
                showAddBtn: true,
                showEditBtn: true,
                showDeleteBtn: true,
                showUpBtn: true,
                showDownBtn: true,
                showExpand: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    parentKey: "pId",
                    rootParentKey: ""
                }
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
        data : {
            init : function (nodes) {
                if (nodes.length <= 0) return null;
                var data = {
                    rootData: [],
                    nodeData: []
                };
                for (var i = 0; i < nodes.length; i++) {
                    // nodes[i].find("pId", function (value) {
                        if (nodes[i]["pId"] === 0){
                            data.rootData.push(nodes[i]);
                        }else {
                            data.nodeData.push(nodes[i]);
                        }
                    // });

                }
                if (data.rootData.length <= 0) {
                    data.nodeData = [];
                }
                return data;
            },
            initRoot : function (setting, parentDomId, root, i, type) {
                if (!root) return null;
                var name = root.name;
                var rootBox = QTree.prototype.view.initRoot(parentDomId, name, i, type);
                if (setting.view.showExpand && setting.view.showExpand === false) {
                    QTree.prototype.view.removeExpand(rootBox);
                }
                if (setting.view.showAddBtn && setting.view.showAddBtn === false) {
                    QTree.prototype.view.hideAddBtn(rootBox);
                }
                if (setting.view.showEditBtn && setting.view.showEditBtn === false) {
                    QTree.prototype.view.hideEditBtn(rootBox);
                }
                return rootBox;
            },
            initNode : function (setting, node, parentDomId, index, num) {
                if (!node)return null;
                var name = node.name,
                    type = node.type;
                var li = QTree.prototype.view.initNode(parentDomId, type, name, index, num);
                if (setting.showExpand && setting.view.showExpand === false) {
                    QTree.prototype.view.removeExpand(li);
                }
                if (setting.view.showAddBtn && setting.view.showAddBtn === false) {
                    QTree.prototype.view.hideAddBtn(li);
                }
                if (setting.view.showEditBtn && setting.view.showEditBtn === false) {
                    QTree.prototype.view.hideEditBtn(li);
                }
                if (setting.view.showDeleteBtn && setting.view.showDeleteBtn === false) {
                    QTree.prototype.view.hideDeleteBtn(li);
                }
                if (setting.view.showUpBtn && setting.view.showUpBtn === false) {
                    QTree.prototype.view.hideUpBtn(li);
                }
                if (setting.view.showDownBtn && setting.view.showDownBtn === false) {
                    QTree.prototype.view.hideDownBtn(li);
                }
                return li;
            },
            initNodeData: function (setting, data, parentDomId) {
                if (!data) return null;
                var treeData = [], _data;
                for (var i = 0; i < data.rootData.length; i++) {
                    var pId = data.rootData[i].id;
                    var n = 1;
                    var rootBox = this.initRoot(setting, parentDomId, data.rootData[i], i ,data.rootData[i].type);
                    if (data.rootData[i].type === "folder") {
                        // 删除了data.rootData[i]
                        _data = this.nodeChildren(setting, pId, data.nodeData, rootBox, n, treeData);
                    }
                }
            },
            nodeChildren: function (setting, pId, data, parentDomId, n, treeData) {
                // 将数组按照树结构存储
                data.forEach(function (node, index) {
                    if (data[index].pId === pId){
                        // 获取类型为folder的节点的元素，n记录层级，index记录顺序下标
                        var dom = QTree.prototype.data.initNode(setting, data[index], parentDomId, n, index);
                        data[index].children =  QTree.prototype.data.nodeChildren(setting, data[index].id, data, dom, n + 1, treeData);
                        treeData.push(data[index]);
                    }
                });
                return treeData;
            }
        },
        event : {

        },
        _bindEvent: function (setting) {
            var obj = setting.treeObj;
            var eventName = QTree.prototype._consts.event;
            target.addEventListener("click", function (event, setting, treeId, node, clickFlag) {
                var target = event.target;
                console.log(target);
            });
            obj.addEventListener(eventName.EXPAND, function (event, setting, treeId, node) {

            });
            obj.addEventListener(eventName.REMOVE, function (event, setting, treeId, node) {

            });
            obj.addEventListener(eventName.NODECREATED, function (event, setting, treeId, node) {

            });
        },
        treeEvents: {
            bindEvent: function (setting,event) {
                for (var i = 0; i < 1; i++) {
                    QTree.prototype._bindEvent(setting, event);
                }
            },
            unbindEvent: function (setting) {
                for (var i = 0; i < 1; i++) {
                    QTree.prototype._unbindEvent(setting);
                }
            }
        },
        tools : {
            clone: function (obj) {
                if (obj === null) return null;
                var o = this.isArray(obj) ? [] : {};
                for (var i in obj) {
                    o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? this.clone(obj[i]) : obj[i]);
                }
                return o;
            },
            isArray: function (arr) {
                return Object.prototype.toString.apply(arr) === "[object Array]";
            }
        },
        view : {
            initTreeBox : function (elementId) {
                if (!elementId)return null;
                var ul = document.createElement("ul");
                ul.id = QTree.prototype._consts.id.tree;
                ul.classList.add(QTree.prototype._consts.class.tree);
                return ul;
            },
            initNode: function (parentDomId, type, name, index, num) {
                if (!parentDomId)return null;
                var nodeBox = this.setNodeLi(parentDomId, index, num),
                    ul = this.setFolderUl(parentDomId, index + 1, num),
                    content = this.setNodeContent(nodeBox),
                    expand = this.setExpand(nodeBox),
                    imgDom = this.setImg(content, type),
                    nameDom = this.setNodeName(name),
                    add = this.setAddBtn(nodeBox),
                    edit = this.setEditBtn(nodeBox),
                    del = this.setDeleteBtn(nodeBox),
                    up = this.setUpBtn(nodeBox),
                    down = this.setDownBtn(nodeBox);
                nodeBox.appendChild(expand);
                content.appendChild(imgDom);
                content.appendChild(nameDom);
                nodeBox.appendChild(content);
                nodeBox.appendChild(add);
                nodeBox.appendChild(edit);
                nodeBox.appendChild(del);
                nodeBox.appendChild(up);
                nodeBox.appendChild(down);
                switch (type) {
                    case "folder":
                        nodeBox.appendChild(ul);
                        parentDomId.appendChild(nodeBox);
                        return ul;
                    case "file":
                        parentDomId.appendChild(nodeBox);
                        return nodeBox;
                }
            },
            initRoot: function(parentDomId, name, i, type){
                if(!parentDomId) return null;
                var root = document.createElement("li"),
                    expand = this.setExpand(root),
                    content = this.setNodeContent(root),
                    imgDom = this.setImg(root, "folder"),
                    nameDom = this.setNodeName(name),
                    add = this.setAddBtn(root),
                    edit = this.setEditBtn(root),
                    ul = this.setFolderUl(parentDomId, i+1, 0);
                root.id = QTree.prototype._consts.id.tree + "_" +QTree.prototype._consts.id.root + i;
                root.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.content);
                root.appendChild(expand);
                content.appendChild(imgDom);
                content.appendChild(nameDom);
                root.appendChild(content);
                root.appendChild(add);
                root.appendChild(edit);
                switch (type) {
                    case "folder":
                        root.appendChild(ul);
                        parentDomId.appendChild(root);
                        return ul;
                    case "file":
                        parentDomId.appendChild(root);
                        return root;
                }
            },
            setNodeLi: function(parentDomId, index, num){
                if(!parentDomId) return null;
                var dom = document.createElement("li");
                dom.id = QTree.prototype._consts.id.tree + "_" +QTree.prototype._consts.id.level + index + "_" + num;
                dom.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.content);
                return dom;
            },
            setFolderUl: function (parentDomId, index, num) {
                if(!parentDomId) return null;
                var dom = document.createElement("ul");
                dom.id = QTree.prototype._consts.id.tree + "_" + index + "_"  + num;
                dom.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.level);
                return dom;
            },
            setNodeContent: function (parentDomId) {
                if (!parentDomId)return null;
                var content = document.createElement("span");
                content.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.node + "_" + QTree.prototype._consts.class.content);
                return content;
            },
            setColor: function (parentDomId) {
                // var parent = document.getElementById(parentDomId);
                parentDomId.style.background = "#ddf7ef";
                parentDomId.style.color = "#417556";
            },
            setExpand: function (parentDomId) {
                if (!parentDomId) return null;
                var expand = document.createElement("span");
                expand.classList.add(QTree.prototype._consts.class.button + "_" + QTree.prototype._consts.class.expand);
                expand.innerHTML = "+";
                return expand;
            },
            setAddBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.add + "_" + QTree.prototype._consts.class.button);
                return btn;
            },
            setEditBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.edit + "_" + QTree.prototype._consts.class.button);
                return btn;
            },
            setDeleteBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.delete + "_" + QTree.prototype._consts.class.button);
                return btn;
            },
            setUpBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.level + "_" + QTree.prototype._consts.class.status.up + "_" + QTree.prototype._consts.class.button);
                return btn;
            },
            setDownBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.level + "_" + QTree.prototype._consts.class.status.down + "_" + QTree.prototype._consts.class.button);
                return btn;
            },
            setImg: function (parentDomId, type) {
                if (!parentDomId)return null;
                var img = document.createElement("span");
                img.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.image);
                img.classList.add(QTree.prototype._consts.class.tree + "_" + type + "_" + QTree.prototype._consts.class.image);
                img.style.background = "ul(../images/"+type + ".png) round scroll";
                return img;
            },
            setNodeName: function (name) {
                var dom = document.createElement("span");
                dom.classList.add(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.name);
                dom.innerHTML = name;
                dom.style.color = "#135443";
                return dom;
            },
            setEditInput: function (target, name) {
                var input = document.createElement("input");
                input.setAttribute("type", "text");
                input.innerHTML = name;
                target.appendChild(input);
            },
            removeExpand: function(type, parentDomId) {
                if (type === "folder") {
                    // var parent = document.getElementById(parentDomId);
                    var expand = parentDomId.getElementsByClassName(QTree.prototype._consts.class.button + "_" + QTree.prototype._consts.class.expand);
                    if (expand.length > 0){
                        parentDomId.removeChild(expand[0]);
                    } else {
                        return null;
                    }
                }
            },
            removeColor: function (parentDomId) {
                // var parent = document.getElementById(parentDomId);
                parentDomId.style.background = "#ffffff";
                parentDomId.style.color = "#135443";
            },
            hideAddBtn: function (parentDomId) {
                // var parent = document.getElementById(parentDomId);
                var className = QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.add + "_" + QTree.prototype._consts.class.button;
                var addBtn = parentDomId.getElementsByClassName(className);
                if (addBtn.length > 0) {
                    addBtn[0].style.display = "none";
                }
            },
            hideEditBtn: function (parentDomId) {
                // var parent = document.getElementById(parentDomId);
                var editBtn = parentDomId.getElementsByClassName(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.edit + "_" + QTree.prototype._consts.class.button);
                if (editBtn.length > 0) {
                    editBtn[0].style.display = "none";
                }
            },
            hideDeleteBtn: function (parentDomId) {
                // var parent = document.getElementById(parentDomId);
                var deleteBtn = parentDomId.getElementsByClassName(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.delete + "_" + QTree.prototype._consts.class.button);
                if (deleteBtn.length > 0) {
                    deleteBtn[0].style.display = "none";
                }
            },
            hideUpBtn: function (parentDomId) {
                // var parent = document.getElementById(parentDomId);
                var upBtn = parentDomId.getElementsByClassName(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.up + "_" + QTree.prototype._consts.class.button);
                if (upBtn.length > 0) {
                    upBtn[0].style.display = "none";
                }
            },
            hideDownBtn: function (parentDomId) {
                // var parent = document.getElementById(parentDomId);
                var downBtn = parentDomId.getElementsByClassName(QTree.prototype._consts.class.tree + "_" + QTree.prototype._consts.class.status.down + "_" + QTree.prototype._consts.class.button);
                if (downBtn.length > 0) {
                    downBtn[0].style.display = "none";
                }
            },
            destroy: function (target) {
                target.remove();
            }
        },
		init: function (nodeData, domBox, diySetting) {
		    // 初始化文件树列表
            var ulBox = this.view.initTreeBox(domBox);
		    // 获取默认的setting配置
		    var setting = this.tools.clone(this._setting);
            // 将diySetting上的内容复制到setting上
            deepCopy(diySetting, setting);
            setting.treeId = domBox.getAttribute("id");
            setting.treeObj = domBox;
            // 将每一棵的配置按照容器ID来记录
            this.settings[setting.treeId] = setting;
                // var root = this.data.getRoot(setting);
            nodeData = nodeData ? this.tools.clone(this.tools.isArray(nodeData) ? nodeData : [nodeData]) : [];
            // 初始化数据
            var data = this.data.init(nodeData);
            // 初始化根数据
            this.data.initNodeData(setting, data, ulBox);
            domBox.appendChild(ulBox);
            var treeTools = {

            };
            QTree.prototype.treeEvents.bindEvent(setting);
        },
        destroy: function () {
            
        }
	};
    // 深拷贝，自带的object.assign()只是浅拷贝
	function deepCopy(newObj, targetObj) {
        var c = targetObj || {};
        for (var i in newObj) {
            if (typeof newObj[i] === 'object') {
                c[i] = (newObj[i].constructor === Array) ? [] : {};
                deepCopy(newObj[i], c[i]);
            } else {
                c[i] = newObj[i];
            }
        }
        return c;
    }

	// 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = QTree;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return QTree;});
    } else {
        !('QTree' in _global) && (_global.QTree = QTree);
    }
}());