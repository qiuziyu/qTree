# qTree
一个可复用的插件需要满足以下条件：

插件自身的作用域与用户当前的作用域相互独立，也就是插件内部的私有变量不能影响使用者的环境变量；
插件需具备默认设置参数；
插件除了具备已实现的基本功能外，需提供部分API，使用者可以通过该API修改插件功能的默认参数，从而实现用户自定义插件效果；
插件支持链式调用；
插件需提供监听入口，及针对指定元素进行监听，使得该元素与插件响应达到插件效果。


#数据格式
	{
		name:节点名称,
		id:数据标识,
		type:[folder, file],
		parentId:父节点数据标识,
		preId:前一个节点,
		lastNode:Boolean,
		level:层级,
		tree_level:在每一父级下的顺序,
	}
#数据
1、获取数据
	接口：url
	参数：{
		id:数据标识
		level:层级
	}
2、获取子节点数量
	参数：{
		id:数据标识
	}
3、数据增加

#逻辑处理
1、处理获取的数据
	循环遍历
		参数：{
			id:数据标识
			parentId:父节点标识
			tree_level:在每一父级下的顺序
			type:[folder, file]
		}
2、查询节点
	返回值：节点对象

3、添加节点
	参数：{
		id:数据标识
		type:folder[必须]
	}
	调用方法传参：{
		childNum:子节点数量
		type:[folder,file]
		parentId:父节点数据标识
	}
	逻辑：判断当前节点类型，可否进行操作
4、删除节点
	参数：{
		id:数据标识
		type:[folder,file]
			childNum:子节点数量
		parentId:父节点数据标识

}
5、修改节点信息【类型不可改】
	参数：{
		id:数据标识
		parentId:父节点数据标识
		可修改参数:{
			name:-修改后【可选】
			tree_level:在每一父级下的顺序-修改后【可选】
			level:层级-修改后【可选】
		}
}
