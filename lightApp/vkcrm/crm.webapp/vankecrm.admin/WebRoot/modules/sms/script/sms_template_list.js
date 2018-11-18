function loadData(grid) {
	grid.doSearch();
}

// 批量启用用户模板
function enableUsers() {
	var ids = user_grid.getCheckedRowIds().split(',');
	if (ids.length == 0 || ids[0] == '') {
		$.messageBox.info({
					message : "请您先选择要启用的模板,然后再进行此操作！"
				});
		return;
	}

	var vals = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i] + '';
		var value = user_grid.getCellValue(id, 'enabled_name');
		if (value.indexOf('已禁用') > 0)vals.push(user_grid.getCellValue(id, 'id'));
	}
	if (vals.length == 0) {
		$.messageBox.info({
					message : "您选择模板已经全部处于启用状态不需要进行启用操作！"
				});
	} else {
		$.messageBox.confirm({
			message : "您确定要批量启用已勾选的" + ids.length + "个模板吗？",
			timeout: 5,
			callback : function(result) {
				if (result) {
					$.dataservice("spring:smsTemplateService.enableTemplate", 
						{templateIds : vals.join(","),enabled:'1'}, function() {
							$.messageBox.info({
								message : "您成功启用了" + vals.length + "个模板!",
								callback : function() {
									user_grid.refresh();
								}
							});
						});
				}
			}
		});
	}
}

// 批量禁用用户模板
function disableUsers() {
	var ids = user_grid.getCheckedRowIds().split(',');
	if (ids.length == 0 || ids[0] == '') {
		$.messageBox.info({
					message : "请您先选择要禁用的模板,然后再进行此操作！"
				});
		return;
	}

	var vals = [];
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i] + '';
		var value = user_grid.getCellValue(id, 'enabled_name');
		if (value.indexOf('已启用') > 0) {
			vals.push(user_grid.getCellValue(id, 'id'));
		}
	}
	if (vals.length == 0) {
		$.messageBox.info({
			message : "您选择的用户已经全部处于禁用状态，不需要进行禁用操作！"
		});
	} else {
		$.messageBox.confirm({
			message : "您确定要批量禁用已勾选的" + ids.length + "个模板吗？",
			callback : function(result) {
				if (result) {
					$.dataservice("spring:smsTemplateService.enableTemplate",
					{templateIds : vals.join(","),enabled:'0'}, function() {
						$.messageBox.info({
							message : "您成功禁用了" + vals.length + "个模板!",
							callback : function() {
								user_grid.refresh();
							}
						});
					});
				}
			}
		});

	}
}

// 启用用户模板
function enableUser(grid, rowData, keyData) {
	if (keyData) {
		
		var enabled_name = rowData['enabled_name'];
		if(enabled_name != '已禁用'){
			$.messageBox.info({message:'此模板不可启用！'});
			return;
		}
		
		var userName = rowData['name'];
		$.messageBox.confirm({
			message : "您确定要启用\"" + userName + "\"模板吗？",
			callback : function(result) {
				if (result) {
					$.dataservice("spring:smsTemplateService.enableTemplate", 
						{templateIds : keyData,enabled:'1'}, function() {
							$.messageBox.info({
								message : "启用\"" + userName + "\"模板成功!",
								timeout: 5,
								callback : function() {
									grid.refresh();
								}
							});
						});
				}
			}
		});
	}
}

// 禁用用户模板
function disableUser(grid, rowData, keyData) {
	if (keyData) {
		
		var enabled_name = rowData['enabled_name'];
		if(enabled_name != '已启用'){
			$.messageBox.info({message:'此模板不可禁用！'});
			return;
		}
		var userName = rowData['name'];
		$.messageBox.confirm({
			message : "您确定要禁用\"" + userName + "\"模板吗？",
			callback : function(result) {
				if (result) {
					$.dataservice("spring:smsTemplateService.enableTemplate",
						{templateIds : keyData,enabled:'0'}, function() {
							$.messageBox.info({
								message : "禁用\"" + userName + "\"模板成功!",
								timeout : 5,
								callback : function() {
									grid.refresh();
								}
							});
						});
				}
			}
		});
	}
}


// 启用用户模板
function enableTemplage(templateId,enabled) {
	if(smsTemplateEnabled){
		$.dataservice("spring:smsTemplateService.enableTemplate", 
		{templateIds :templateId,enabled:enabled}, function() {
			user_grid.refresh();
		});
	}
}

// 删除模板
function deleteUser(grid, rowData, keyData) {
	if (keyData) {
		var userName = rowData['name'];
		$.messageBox.confirm({
			message : "您确定要删除\"" + userName + "\"模板吗？",
			callback : function(result) {
				if (result) {
					$.dataservice("spring:smsTemplateService.deleteTemplate", {
								templateIds : keyData
							}, function() {
								grid.refresh();
							});
				}
			}
		});
	}
}

// 新建模板
function createUser() {
	if(categoryId == ''){
		$.messageBox.info({message : "请选择分类！"});
		return;
	}
	var url = "~/smsTemplate/editTemplate.do?categoryId=" + categoryId + "&categoryName=" + encodeURI(categoryName);
	$.open(url, 680, null, {}, function() {
		if ($.dialogReturnValue()) {
			user_grid.refresh();
		}
	});
}

// 修改模板
function modifyUser(grid, rowData, keyData) {
	if (keyData) {
		var url = "~/smsTemplate/editTemplate.do?templateId=" + keyData + "&categoryId=" + categoryId + "&categoryName=" + encodeURI(categoryName);
		$.open(url, 680, null, {}, function() {
					grid.refresh();
				});
	}
}


function doOnBeforeMenuRender(grid, rowData, menuItems) {
	var status = rowData.ACCOUNT_STATUS;
	switch (status) {
		case 'disabled' :
			menuItems.showItem("enabled_user");
			menuItems.hideItem("disabled_user");
			break;
		case 'enabled' :
			menuItems.showItem("disabled_user");
			menuItems.hideItem("enabled_user");
			break;
	}
	return true;
}