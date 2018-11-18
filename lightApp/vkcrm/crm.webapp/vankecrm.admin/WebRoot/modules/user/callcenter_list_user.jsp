<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>

<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>话务员列表</title>	
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="dhtmlxgrid,dialog,multiselect,messagebox"></ui:combine>
		<ui:script src="modules/user/script/callcenter_list_user.js"></ui:script>
		<script type="text/javascript">
			var orgId = '${param.orgId}';
			var orgName = '${param.orgName}';
		</script>
	</head>
	
	<body class="container-body">
	    <!--搜索框 -->
		<div class="container-fluid">
			<div class="grid-page">
				<div class="page-title">
					<h2>话务员列表</h2>
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
							<input type="hidden" name="GROUP_ID" id="GROUP_ID" value="${param.orgId}"/>
							<table>
								<tr>
									<td class="btn-toggle" rowspan="5">									
										<a href="###" data-widget="btn-toggle" data-options="{rel:'.toggle-content2'}"  title="高级选项"><i class="icon-plus2"></i></a>
									</td>
								</tr>
								<tr>
									<th>话务员编码：</th>
									<td><input type="text" maxlength="20" name="ACCOUNT" style="width:110px" id="ACCOUNT" class="input-large"/></td>
								    <th>话务员名称：</th>
									<td><input type="text" maxlength="20" name="USER_NAME" style="width:110px" id="USER_NAME" class="input-large"/></td>
									<th>手机号码：</th>
									<td><input type="text" maxlength="20" name="MOBILE" style="width:110px" id="MOBILE" class="input-large"/></td>
									<td class="toolbar-btns" rowspan="3">
										<button type="button" class="btn" onclick="user_grid.doSearch();">查询</button>
										<button type="button" class="btn" onclick="document.forms['queryForm'].reset();">重置</button>
									</td>
								</tr>
								<tr class="toggle-content2" style="display:none">
									<th>职务：</th>
									<td>
									<select id="dutyId" name="dutyId" style="width:110px;">
										<option value=""></option>
									</select></td>
								    <th>电信工号：</th>
									<td><input type="text" maxlength="20" name="NUMBER" style="width:110px" id="NUMBER" class="input-large"/></td>
									<th></th>
									<td></td>
									<td class="toolbar-btns" rowspan="3"></td>
								</tr>
								<tr class="toggle-content2" style="display:none">
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
							<div class="span6 first"><i class="icon-list-alt"></i>话务员列表</div>
							<div class="span6">
								<!-- 工具栏  -->	
								<div class="pull-right">
								    <security:isAllow privilege="CALLCENTER_USER$CREATE_USER">
									    <a class="btn" href="javascript:void(0);" onclick="createUser()"><i class="icon-plus"></i>新建话务员</a>	
									</security:isAllow>
								</div>
							</div>
						</div>
						<a href="#" class="toggle"></a>	
					</div>
					<div class="panel-content">
						<dg:grid container="user_div" id="user_grid" loadOnFirst="false" onAfterGridScriptLoad="loadData">
							<dg:datasource selectSqlId="callcenter.user.user_list" includePageParams="true" daoName="callCenterDao"></dg:datasource>
							<dg:checkAllColumn></dg:checkAllColumn>
							<dg:operationColumn onBeforeMenuRender="doOnBeforeMenuRender">
								<security:isAllow privilege="CALLCENTER_USER$EDIT_USER">
									<dg:action label="修改话务员" onClick="modifyUser" id="modify_user" icon="/statics/images/ico_edit.gif"></dg:action>
								</security:isAllow>
								<security:isAllow privilege="CALLCENTER_USER$ASSIGN_ROLE">
									<dg:action label="分配角色" onClick="assignRole" id="assign_role" icon="/statics/images/ico_assign_role.gif"></dg:action>
								</security:isAllow>
								<security:isAllow privilege="CALLCENTER_USER$DELETE_USER">
									<dg:action label="删除话务员" onClick="deleteUser" id="delete_user" icon="/statics/images/ico_del.gif"></dg:action>
								</security:isAllow>
								<security:isAllow privilege="CALLCENTER_USER$RESET_PASSWORD">
									<dg:action label="重置密码" onClick="setPassword" id="set_password" icon="/statics/images/ico_reset.gif"></dg:action>
								</security:isAllow>
							</dg:operationColumn>
							<dg:column id="id" width="0" header="用户ID" type="ro" align="center" visible="false" isKey="true"></dg:column>
							<dg:column id="id" width="0" header="编码" type="ro" align="left" visible="false"></dg:column>
							<dg:column id="name" width="8" header="名称" type="ro" align="left"></dg:column>
							<dg:column id="mobileNumber" width="12" header="手机号码" type="ro" align="center"></dg:column>
							<dg:column id="dutyText" width="12" header="职务" type="ro" align="center"></dg:column>
							<dg:column id="groupNames" width="15" header="所在分组" type="ro" align="left"></dg:column>
							<dg:column id="numbers" width="15" header="电信工号" type="ro" align="left"></dg:column>
						</dg:grid>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>