<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>

<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>短信模板列表</title>	
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="dhtmlxgrid,dialog,multiselect,messagebox"></ui:combine>
		<ui:script src="modules/sms/script/sms_template_list.js"></ui:script>
		<script type="text/javascript">
			var categoryId = '${param.categoryId}';
			var categoryName = '${param.categoryName}';
			<security:isAllow privilege="SMS_TEMPLATE$ENABLED">
			var smsTemplateEnabled = true;
			</security:isAllow>
		</script>
	</head>
	
	<body class="container-body">
	    <!--搜索框 -->
		<div class="container-fluid">
			<div class="grid-page">
				<div class="page-title">
					<h2>短信模板列表</h2>
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
							<input type="hidden" name="categoryId" id="categoryId" value="${param.categoryId}"/>
							<table>
								<tr>
									<td class="btn-toggle" rowspan="5">									
										<a href="###" data-widget="btn-toggle" data-options="{rel:'.toggle-content2'}"  title="高级选项"><i class="icon-plus2"></i></a>
									</td>
								</tr>
								<tr>
									<th>模板标题：</th>
									<td><input type="text" maxlength="20" id="name" name="name" style="width:110px" class="input-large"/></td>
								    <th>启用/禁用状态：</th>
									<td>
									<select id="enabled" name="enabled" style="width:110px;">
										<option value="">--请选择--</option>
										<option value="1">启用</option>
										<option value="0">禁用</option>
									</select>
									</td>
									<th>模板状态：</th>
									<td>
									<select id="status" name="status" style="width:110px;">
										<option value="">--请选择--</option>
										<option value="1">待生效</option>
										<option value="2">已生效</option>
										<option value="3">已失效</option>
									</select>
									</td>
									<td class="toolbar-btns" rowspan="3">
										<button type="button" class="btn" onclick="user_grid.doSearch();">查询</button>
										<button type="button" class="btn" onclick="document.forms['queryForm'].reset();">重置</button>
									</td>
								</tr>
								<tr class="toggle-content2" style="display:none">
									<th>短信内容：</th>
									<td><input type="text" maxlength="20" id="content" name="content" style="width:110px" class="input-large"/></td>
								    <th></th>
									<td></td>
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
							<div class="span6 first"><i class="icon-list-alt"></i>短信模板列表 <b>${param.categoryName}</b></div>
							<div class="span6">
								<!-- 工具栏  -->	
								<div class="pull-right">
								    <security:isAllow privilege="SMS_TEMPLATE$CREATE">
									    <a class="btn" href="javascript:void(0);" onclick="createUser()"><i class="icon-plus"></i>新建短信模板</a>	
									</security:isAllow>
									<security:isAllow privilege="SMS_TEMPLATE$ENABLED">
										<a class="btn" href="javascript:void(0);" onclick="enableUsers()"><i class="icon-play"></i>启用</a>
										<a class="btn" href="javascript:void(0);" onclick="disableUsers()"><i class="icon-stop"></i>禁用</a>	
									</security:isAllow>
								</div>
							</div>
						</div>
						<a href="#" class="toggle"></a>	
					</div>
					<div class="panel-content">
						<dg:grid container="user_div" id="user_grid" loadOnFirst="false" onAfterGridScriptLoad="loadData">
							<dg:datasource selectSqlId="callcenter.sms.template.list" includePageParams="true" daoName="callCenterDao"></dg:datasource>
							<dg:checkAllColumn></dg:checkAllColumn>
							<dg:operationColumn onBeforeMenuRender="doOnBeforeMenuRender">
								<security:isAllow privilege="SMS_TEMPLATE$EDIT">
									<dg:action label="修改模板" onClick="modifyUser" id="modify_user" icon="/statics/images/ico_edit.gif"></dg:action>
								</security:isAllow>
								<security:isAllow privilege="SMS_TEMPLATE$DEL">
									<dg:action label="删除模板" onClick="deleteUser" id="delete_user" icon="/statics/images/ico_del.gif"></dg:action>
								</security:isAllow>
								<%-- 
								<security:isAllow privilege="SMS_TEMPLATE$ENABLED">
									<dg:action label="启用帐号" onClick="enableUser" id="enabled_user" icon="/statics/images/ico_start.gif"></dg:action>
								</security:isAllow>
								<security:isAllow privilege="SMS_TEMPLATE$ENABLED">
									<dg:action label="禁用帐号" onClick="disableUser" id="disabled_user" icon="/statics/images/ico_pause.gif"></dg:action>
								</security:isAllow>
								 --%>
							</dg:operationColumn>
							<dg:column id="id" width="0" header="id" type="ro" align="center" visible="false" isKey="true"></dg:column>
							<dg:column id="category_name" width="12" header="模板分类" type="ro" align="center"></dg:column>
							<dg:column id="type_name" width="8" header="模板类型" type="ro" align="left"></dg:column>
							<dg:column id="name" width="10" header="模板标题" type="ro" align="left"></dg:column>
							<dg:column id="content" width="12" header="模板内容" type="ro" align="center"></dg:column>
							<dg:column id="cname" width="6" header="创建人" type="ro" align="center"></dg:column>
							<dg:column id="ctime" width="12" header="创建时间" type="ro" align="left"></dg:column>
							<dg:column id="start_date" width="8" header="生效日期" type="ro" align="left"></dg:column>
							<dg:column id="end_date" width="8" header="失效日期" type="ro" align="left"></dg:column>
							<dg:column id="status" width="8" header="模板状态" type="ro" align="left"></dg:column>
							<dg:column id="enabled" width="0" header="启用/禁用状态" type="ro" align="center" visible="false"></dg:column>
							<dg:column id="enabled_name" width="12" header="启用/禁用状态" type="ro" align="center"></dg:column>
						</dg:grid>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>