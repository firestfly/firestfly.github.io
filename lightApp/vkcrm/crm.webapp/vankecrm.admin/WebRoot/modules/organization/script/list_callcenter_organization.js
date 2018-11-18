function loadData(grid) {
	grid.doSearch();
}

// 新增组织机构
function addOrg(parentOrgId, parentOrgName) {
	var parent_id = "";
	var parent_name = "根分组";
	if (parentOrgId != 'root') {
		parent_id = parentOrgId;
		parent_name = parentOrgName;
	}
	var url = "~/modules/organization/edit_callcenter_organization.jsp?orgId=&parentId="
			+ parent_id + "&parentName=" + encodeURI(parent_name);
	$.open(url, 450, null, {}, function() {
				if ($.dialogReturnValue()) {
					organization_list_grid.refresh();
					parent.refreshNodeByNodeId();
				}
			});
}

// 从列表为入口编辑
function editOrganization(grid, rowData, keyData) {
	editOrg(keyData, parentId, parentName);
}

// 从树形为入口编辑
function editOrg(orgId, parentId, parentName) {
	var url = "~/callcenterOrganizationController/editOrganization.do?orgId=" + orgId
			+ "&parentName=" + encodeURI(parentName);
	$.open(url, 450, null, {}, function() {
				if ($.dialogReturnValue()) {
					organization_list_grid.refresh();
					parent.refreshNodeByNodeId();
				}
			});
}

// 从树形为入口编辑
function deleteOrg(orgId, orgName, parentId) {
	$.messageBox.confirm({
				message : "您确认要删除\"" + orgName + "\"？",
				callback : function(result) {
					if (result) {
						$
								.dataservice(
										"spring:callcenterOrganizationService.deleteOrganization",
										{orgId : orgId}, function() {
											organization_list_grid.refresh();
											parent.refreshNodeByNodeId();
										});
					}
				}
			});
}

// 从列表为入口编辑
function deleteOrganization(grid, rowData, keyData) {
	if (keyData) {
		var orgName = rowData['NAME'];
		var _parentId = rowData['PARENT'];
		deleteOrg(keyData, orgName, _parentId);
	}
}

function doOnBeforeMenuRender(grid, rowData, menuItems) {
	var status = rowData.STATUS;
	switch (status) {
		case 'disabled' :
			menuItems.showItem("enabled_organization");
			menuItems.hideItem("disabled_organization");
			break;
		case 'enabled' :
			menuItems.showItem("disabled_organization");
			menuItems.hideItem("enabled_organization");
			break;
	}
	return true;
}