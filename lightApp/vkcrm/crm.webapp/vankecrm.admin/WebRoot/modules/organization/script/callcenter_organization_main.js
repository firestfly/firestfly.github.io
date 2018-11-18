var treeInstance = null;

var maxTreeLevel = 3;//设置树最大层级


$(function() {
			// 树初始化
			treeInstance = $('#treeDiv').tree({// tree为容器ID
				asyn : false, // 异步
				rootId : 'root',
				rootText : '万科物业',
				CommandName : 'java.tree.command',
				onNodeClick : leftClick,
				expandLevel: 3,
				onLoaded: doOnLoaded,
				params : {
					daoBeanName : 'callCenterDao',
					sqlId : 'callcenter.organization.edit.tree',
					parentId : 'root'
				},
				contextMenu : function(record) {
					var items = [];
					var recodeLevel = getRecodeLevel(record);
					if (enableCreateOrg && recodeLevel < maxTreeLevel) {
						items.push({
									text : "注册子分组",
									icon : Global.contextPath + "/statics/images/ico_add.gif",
									id : record.id,
									action : addAction,
									orgName : record.text,
									parent_id : record.parentId,
									parent_name: record.text
								});
					}

					if (record.id != 'root') {
						if (enableModifyOrg) {
							items.push({
										text : "修改分组",
										icon : Global.contextPath + "/statics/images/ico_edit.gif",
										id : record.id,
										action : updateAction,
										orgName : record.text,
										parent_id : record.parentId,
										parent_name: record.parent.text
									});
						}
						if (enableDeleteOrg) {
							items.push({
										text : "删除分组",
										icon : Global.contextPath + "/statics/images/ico_del.gif",
										id : record.id,
										action : deleteAction,
										orgName : record.text,
										parent_id : record.parentId
									});
						}
						
						/**
						if (record.status == "enabled" && enableEnableOrg) {
							items.push({
										text : "停用组织",
										icon : Global.contextPath + "/statics/images/ico_pause.gif",
										id : record.id,
										action : disabledAction,
										orgName : record.text,
										parent_id : record.parentId
									});
						}
						if (record.status == "disabled" && enableDisableOrg) {
							items.push({
										text : "启用组织",
										icon : Global.contextPath + "/statics/images/ico_start.gif",
										id : record.id,
										action : enabledAction,
										orgName : record.text,
										parent_id : record.parentId
									});
						}**/
						
					}

					return {
						width : 100,
						items : items
					};
				}
			});
		});

function leftClick(id, text, record, currentNode) {
	
	
	var recodeLevel = getRecodeLevel(record);
	if(recodeLevel >= maxTreeLevel){
		return;
	}
	
	var url = Global.contextPath + '/modules/organization/list_callcenter_organization.jsp';
	var parentName = record.text;
	if (id) {
		if (id == 'root') {
			id = '';
			parentName = '万科物业';
		}
		url += '?parentId=' + id;
		url += '&parentName=' + encodeURIComponent(parentName);
	}
	document.getElementById("content_frame").src = url;
}

function refreshNodeByNodeId(nodeId) {
	treeInstance.reload();
    treeInstance.expandLevel(null, 2);
}

function doOnLoaded() {
    if (document.getElementById("content_frame").src == "") {
        var url = Global.contextPath + '/modules/organization/list_callcenter_organization.jsp?parentId=&parentName='+encodeURI("万科物业");
        document.getElementById("content_frame").src = url;
    }
}

function addAction() {
	window.frames['content_frame'].addOrg(this.data.id, this.data.parent_name);
}

function updateAction() {
	window.frames['content_frame'].editOrg(this.data.id, this.data.parent_id, this.data.parent_name);
}

function deleteAction() {
	window.frames['content_frame'].deleteOrg(this.data.id, this.data.orgName, this.data.parent_id);
}

function enabledAction() {
	window.frames['content_frame'].enabledOrg(this.data.id);
}

function disabledAction() {
	window.frames['content_frame'].disabledOrg(this.data.id);
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


