;(function(undefined){
	"use strict"
	var _global;

	//插件构造函数
	function qTree(opt){
		this._initial(opt)
	}

	qTree.prototype = {
		
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