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
			parentId : 'root'
		},
		contextMenu : function(record) {
			var items = [];
			var recodeLevel = getRecodeLevel(record);
			if (enableCreateCategories && recodeLevel < maxTreeLevel  && (record.status == "1" || record.id == 'root')) {
				items.push({
							text : "注册子分类",
							icon : Global.contextPath + "/statics/images/ico_add.gif",
							id : record.id,
							action : addAction,
							orgName : record.text,
							parent_id : record.parentId,
							parent_name: record.text
						});
			}

			if (record.id != 'root') {
				if (enableEditCategories && record.status == "1") {
					items.push({
								text : "修改分类",
								icon : Global.contextPath + "/statics/images/ico_edit.gif",
								id : record.id,
								action : updateAction,
								orgName : record.text,
								parent_id : record.parentId,
								parent_name: record.parent.text
							});
				}
				if (enableDelCategories && record.status == "1") {
					items.push({
								text : "删除分类",
								icon : Global.contextPath + "/statics/images/ico_del.gif",
								id : record.id,
								action : deleteAction,
								orgName : record.text,
								parent_id : record.parentId
							});
				}
				if (record.status == "1" && enableEnableCategories) {
					items.push({
								text : "禁用分类",
								icon : Global.contextPath + "/statics/images/ico_pause.gif",
								id : record.id,
								action : disabledAction,
								orgName : record.text,
								parent_id : record.parentId
							});
				}
				if (record.status == "0" && enableEnableCategories) {
					items.push({
								text : "启用分类",
								icon : Global.contextPath + "/statics/images/ico_start.gif",
								id : record.id,
								action : enabledAction,
								orgName : record.text,
								parent_id : record.parentId
							});
				}
				
			}

			return {
				width : 100,
				items : items
			};
		}
	});
});

// 左击事件,显示列表
function leftClick(id, text, record, currentNode) {
//	var recodeLevel = getRecodeLevel(record);
//	if(recodeLevel >= maxTreeLevel){
//		return;
//	}
	var url = Global.contextPath + '/modules/sms/sms_template_list.jsp';
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

// 重新加载树
function refreshNodeByNodeId(nodeId) {
	treeInstance.reload();
    treeInstance.expandLevel(null, 2);
}

// 加载完成事件
function doOnLoaded() {
    if (document.getElementById("content_frame").src == "") {
        var url = Global.contextPath + '/modules/sms/sms_template_list.jsp?categoryId=&categoryName='+encodeURI(rootName);
        document.getElementById("content_frame").src = url;
    }
}

// 注册新分类事件
function addAction() {
	addOrg(this.data.id, this.data.parent_name);
}

// 修改分类事件
function updateAction() {
	editOrg(this.data.id, this.data.parent_id, this.data.parent_name);
}

// 删除分类事件
function deleteAction() {
	deleteOrg(this.data.id, this.data.orgName, this.data.parent_id);
}

// 启用分类事件
function enabledAction() {
	enabledOrg(this.data.id,'1');
}

// 禁用分类事件
function disabledAction() {
	enabledOrg(this.data.id,'0');
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


// 新增分类
function addOrg(parentOrgId, parentOrgName) {
	var parent_id = "";
	var parent_name = rootName;
	if (parentOrgId != 'root') {
		parent_id = parentOrgId;
		parent_name = parentOrgName;
	}
	var url = "~/smsCategories/editCategory.do?parentId=" + parent_id + "&parentName=" + encodeURI(parent_name);
	$.open(url, 450, 200, {}, function() {
		if ($.dialogReturnValue()) {
			refreshNodeByNodeId();
		}
	});
}


// 从树形为入口编辑
function editOrg(categoryId, parentId, parentName) {
	var url = "~/smsCategories/editCategory.do?categoryId=" + categoryId + "&parentName=" + encodeURI(parentName);
	$.open(url, 450, 200, {}, function() {
		if ($.dialogReturnValue()) {
			refreshNodeByNodeId();
		}
	});
}


// 从树形为入口编辑
function deleteOrg(categoryId, orgName, parentId) {
	$.messageBox.confirm({
		message : "您确认要删除\"" + orgName + "\"及该分类下的所有子分类和模板？",
		callback : function(result) {
			if (result) {
				$.dataservice("spring:smsCategoriesService.deleteCategory",
					{categoryId : categoryId}, 
					function() {
						window.location.href = window.location.href;
					}
				);
			}
		}
	});
}


// 从树形为入口启用
function enabledOrg(categoryId,value) {
	
	var msg = "您确认要启用该分类吗？";
	if(value == 0){
		msg = "您确认要禁用该分类吗？禁用分类会禁用分类下的分类以及分类下的模板！";
	}
	
	$.messageBox.confirm({
		message : msg,
		callback : function(result) {
			if (result) {
				$.dataservice("spring:smsCategoriesService.enabledCategory",
					{categoryId:categoryId,enabled:value}, 
					function(response) {
						if(response.success){
							if(value == 1){
								refreshNodeByNodeId();
							}else{
								window.location.href = window.location.href;
							}
						}else{
							alert(response.message);
						}
					}
				);
			}
		}
	});
}




