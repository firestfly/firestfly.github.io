var treeInstance = null;
var maxTreeLevel = 3;//设置树最大层级
var rootName = '呼叫中心';


$(function() {
	// 树初始化
	treeInstance = $('#treeDiv').tree({// tree为容器ID
		asyn : false, // 异步
		rootId : 'root',
		rootText : rootName,
		CommandName : 'java.tree.command',
		onNodeClick : leftClick,
		expandLevel: 3,
		onLoaded: doOnLoaded,
		params : {
			daoBeanName : 'callCenterDao',
			sqlId : 'callcenter.sms.tree',
			parentId : 'root',
			enabled : 1
		},
		contextMenu : function(record) {
			var items = [];
			var recodeLevel = getRecodeLevel(record);
			return {
				width : 100,
				items : items
			};
		}
	});
});

// 左击事件,显示列表
function leftClick(id, text, record, currentNode) {
	var url = Global.contextPath + '/modules/sms/sms_send_single.jsp';
	var parentName = record.text;
	if (id) {
		if (id == 'root') {
			id = '';
			parentName = rootName;
		}
		url += '?categoryId=' + id;
		url += '&categoryName=' + encodeURIComponent(parentName);
	}
	document.getElementById("content_frame").src = url;
}

// 加载完成事件
function doOnLoaded() {
    if (document.getElementById("content_frame").src == "") {
        var url = Global.contextPath + '/modules/sms/sms_send_single.jsp?categoryId=&categoryName='+encodeURI(rootName);
        document.getElementById("content_frame").src = url;
    }
}


/**
 * 获取当前节点的等级
 * @param {} record 当前节点
 * @return {Number}
 */
function getRecodeLevel(record){
	var parent = record.parent;
	for(var level = 1;level < 10;level++){		
		if(parent){
			parent = parent.parent;
		}else{
			return level;
		}
	}
	return 10;
}

