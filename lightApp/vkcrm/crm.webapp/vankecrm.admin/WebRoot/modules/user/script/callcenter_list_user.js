
$(function() {
	
	// 加载职务下拉框
	$.dataservice("spring:dictionaryService.queryCallcenterItems",{dictionaryCode:'TelephonistDuty'}, function(response) {
		var dutySelect = document.getElementById('dutyId');
		for(var i=0;i<response.length;i++){
			addOption(dutySelect,response[i].code+":"+response[i].value,response[i].value);
		}
	});
});

function addOption(select_,value_,text_){	
	var op=document.createElement("option");      // 新建OPTION (op) 
	op.setAttribute("value",value_);          // 设置OPTION的 VALUE 
	op.appendChild(document.createTextNode(text_)); // 设置OPTION的 TEXT
	select_.appendChild(op);           // 为SELECT 新建一 OPTION(op)
}



function loadData(grid) {
	grid.doSearch();
}

// 分配角色 TODO 客服中心，呼叫中心角色分开
function assignRole(grid, rowData, keyData) {
	if (keyData) {
		var url = '~/modules/user/list_sec_user_role.jsp?belongtoSysId=2&userId=' + keyData;
		$.open(url, 680, 430);
	}
}

// 删除用户
function deleteUser(grid, rowData, keyData) {
	if (keyData) {
		var userName = rowData['name'];
		$.messageBox.confirm({
					message : "您确定要删除\"" + userName + "\"话务员吗？",
					callback : function(result) {
						if (result) {
							$.dataservice("spring:callcenterUserService.deleteUsers", {
										userIds : keyData
									}, function() {
										grid.refresh();
									});
						}
					}
				});
	}
}

// 新建用户
function createUser() {
	var url = "~/callcenterUser/editUser.do?orgId=" + orgId + "&orgName=" + encodeURI(orgName);
	$.open(url, 680, 500, {}, function() {
				if ($.dialogReturnValue()) {
					user_grid.doSearch();
				}
			});
}

// 修改用户
function modifyUser(grid, rowData, keyData) {
	if (keyData) {
		var url = "~/callcenterUser/editUser.do?userId=" + keyData + "&orgId=" + orgId + "&orgName=" + encodeURI(orgName);
		$.open(url, 680, 500, {}, function() {
					user_grid.doSearch();
				});
	}
}

// 设置密码
function setPassword(grid, rowData, keyData) {
	if (keyData) {
		var url = '~/user/setUserPassword.do?userId=' + keyData;
		var result = $.open(url, 420);
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