;(function(undefined){
	"use strict"
	var _global;

	//插件构造函数
	function QTree(){
	    this.settings = {};
		this._consts = {
            class: {
                tree: "qTree",
                    button: "btn",
                    image: "img",
                    type: "nodeType",
                    name: "name",
                    level: "level",
                    content: "content",
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
            }
        };
        this._setting = {
            treeId: "",
            treeObj: null,
            view: {
                showIcon: true,
                expand: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    parentKey: "pId",
                    rootParentKey: ""
                }
            }
        };
        this.data = {
		    init : function (nodes) {

            },
            initRoot : function (setting) {

            },
            getRoot : function(setting) {},
            initNode : function (node) {
                if (!node)return null;


            }
        };
        this.tools = {
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
        };
        this.view = {
            initTreebox : function (elementId) {
                if (!elementId)return null;
                var ul = document.createElement("ul");
                ul.id = _consts.id.tree;
                ul.classList.add(_consts.class.tree);
                return ul;
            },
            addRoot: function(parentDomId){
                if(!parentDomId) return null;
                var root = document.createElement("li");
                root.id = _consts.id.tree + "_" +_consts.id.root;
                root.classList.add(_consts.class.tree + "_" + _consts.class.content);
                return root;
            },
            addExpand: function (parentDomId) {
                if (!parentDomId) return null;
                var expand = document.createElement("span");
                expand.classList.add(_consts.class.button + "_" + _consts.class.expand);
                expand.innerHTML = "+";
                return expand;
            },
            setAddBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(_consts.class.tree + "_" + _consts.class.status.add + "_" + _consts.class.button);
                return btn;
            },
            setEditBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(_consts.class.tree + "_" + _consts.class.status.edit + "_" + _consts.class.button);
                return btn;
            },
            setDeleteBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(_consts.class.tree + "_" + _consts.class.status.delete + "_" + _consts.class.button);
                return btn;
            },
            setUpBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(_consts.class.tree + "_" + _consts.class.status.up + "_" + _consts.class.button);
                return btn;
            },
            setDownBtn: function (parentDomId) {
                if (!parentDomId)return null;
                var btn = document.createElement("span");
                btn.classList.add(_consts.class.tree + "_" + _consts.class.status.down + "_" + _consts.class.button);
                return btn;
            },
            setImg: function (parentDomId, type) {
                if (!parentDomId)return null;
                var img = document.createElement("span");
                img.classList.add(_consts.class.tree + "_" + _consts.class.type + "_" + _consts.class.image);
                img.style.background = "ul(../images/"+type + ".png) round scroll";
                return img;
            },
            destroy: function () {

            },
            setNodeName: function (parentDomId,name) {
                var dom = document.createElement("span");
                dom.classList.add(_consts.class.tree + _consts.class.name);
                dom.innerHTML = name;
                return dom;
            },

        };
	}

    QTree.prototype = {
		init: function (nodeData, domBox, diySetting) {
		    // 获取默认的setting配置
		    var setting = this.tools.clone(this._setting);
            // 将diySetting上的内容复制到setting上
            deepCopy(diySetting, setting);
            setting.treeId = domBox.getAttribute("id");
            setting.treeObj = domBox;
            // 将每一棵的配置按照容器ID来记录
            this.settings[setting.treeId] = setting;
            this.data.initRoot(setting);
            var root = this.data.getRoot(setting);
            nodeData = nodeData ? this.tools.clone(this.tools.isArray(nodeData) ? nodeData : [nodeData]) : [];
            if (setting.data.simpleData.enable) {
                this.data.nodeChildren(setting, root, nodeData);
            }
        },
        destroy: function () {
            
        }
	}
    // 深拷贝，自带的object.assign()只是浅拷贝
	function deepCopy(newObj, targetObj) {
        var c = targetObj || {};
        for (var i in newObj) {
            if (typeof newObj[i] === 'object') {
                c[i] = (newObj[i].constructor === Array) ? [] : {};
                this.deepCopy(newObj[i], c[i]);
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