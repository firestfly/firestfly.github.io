<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>

<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title></title>
		<!-- header files -->
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="dhtmlxgrid,dialog,multiselect,messagebox"></ui:combine>
		<!-- 列表操作相关的js-->
		<ui:script src="modules/organization/script/list_callcenter_organization.js"></ui:script>
		<script>
			var parentId = '${param.parentId}';
			var parentName = '${param.parentName}';
		</script>
	</head>
	
	<body class="container-body">
	    <!--搜索框 -->
		<div class="container-fluid">
		<div class="grid-page">
			<div class="page-title">
				<h2>分组列表</h2>
			</div>	
			<div class="panel search-panel">
				<div class="panel-head">
					<div class="row-fluid">
						<div class="span6 first">
							<i class="icon-list-alt"></i>
							查询条件
						</div>
						<div class="span6"></div>
					</div>
					<a href="#" class="toggle"></a>	
				</div>
				<div class="panel-content">
					<div class="toolbar">
					<form id="queryForm" style="margin: 0px;">
						<table>
							<tr>
							    <th>分组名称：</th>
						        <td><input type="text" id="org_name" name="org_name" maxlength="20" style="width:110px" class="input-large"/></td>
								<td class="toolbar-btns" rowspan="3">
									<button type="button" class="btn" onclick="organization_list_grid.doSearch();">查询</button>
									<button type="button" class="btn"/ onclick="document.forms['queryForm'].reset();">重置</button>
								</td>
							</tr>
						</table>
						</form>				
					</div>	
				</div>
			</div>
			
			<!-- 列表框 -->
			<div class="panel grid-panel">
					<div class="panel-head">
						<div class="row-fluid">
							<div class="span6 first">
								<i class="icon-list-alt"></i>
								分组信息列表
							</div>
							<div class="span6">
								<!-- 工具栏  -->	
								<div class="pull-right">
									<%if (SecurityContext.hasPermission("CALLCENTER_GROUP$CREATE")) {%>
									<a class="btn" href="javascript:void(0);" onclick="addOrg('${param.parentId}','${param.parentName}');"><i class="icon-plus"></i>注册子分组</a>
									<%}%>
								</div>
							</div>
						</div>
						<a href="#" class="toggle"></a>	
					</div>
					<div class="panel-content">
						<dg:grid container="organization_list_div" id="organization_list_grid" loadOnFirst="false" onAfterGridScriptLoad="loadData">
						<dg:datasource selectSqlId="callcenter.organization.organization_list" fixedQueryCondition="{parent:'${param.parentId}'}" daoName="callCenterDao"></dg:datasource>
						<dg:operationColumn onBeforeMenuRender="doOnBeforeMenuRender">
							<%if (SecurityContext.hasPermission("CALLCENTER_GROUP$EDIT")) {%>
							<dg:action label="修改" onClick="editOrganization" id="edit_organization" icon="/statics/images/ico_edit.gif"></dg:action>
							<%}%>
							<%if (SecurityContext.hasPermission("CALLCENTER_GROUP$DELETE")) {%>
							<dg:action label="删除" onClick="deleteOrganization" id="del_organization" icon="/statics/images/ico_del.gif"></dg:action>
							<%}%>
						</dg:operationColumn>
						<dg:column id="ID" width="0" header="分组ID" align="left" isKey="true"></dg:column>
						<dg:column id="NAME" width="40" header="分组名称" align="left"></dg:column>
						<dg:column id="PARENT_NAME" width="40" header="上级分组名称" align="left"></dg:column>
						<dg:column id="ORDER" width="0" header="序号" align="left"></dg:column>
						<dg:column id="PARENT" width="0" header="父组织" align="left"></dg:column>
					</dg:grid>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>