<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>
<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>通话原因配置</title>	
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="dhtmlxgrid,dialog,messagebox"></ui:combine>
		<ui:script src="modules/telcallreason/script/list_telcallreason.js"></ui:script>
	</head>
	
	<body class="container-body">
	    <!--搜索框 -->
		<div class="container-fluid">
			<div class="grid-page">
				<div class="page-title">
					<h2>通话原因列表</h2>
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
									<th>通话类型：</th>
									<td>
									<select id="type" name="type" class="input-large">
										<option value="">--请选择通话类型--</option>
										<option value="1">呼入</option>
										<option value="2">呼出</option>
									</select>
									</td>
								    <th>通话原因：</th>
									<td><input type="text" maxlength="20" name="content" style="width:200px" id="content" class="input-large"/></td>
									<td class="toolbar-btns" rowspan="3">
										<button type="button" class="btn" onclick="user_grid.doSearch();">查询</button>
										<button type="button" class="btn" onclick="document.forms['queryForm'].reset();">重置</button>
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
							<div class="span6 first"><i class="icon-list-alt"></i>通话原因列表</div>
							<div class="span6">
								<!-- 工具栏  -->	
								<div class="pull-right">
								    <security:isAllow privilege="CALLCENTER_TELCALLREASON$CREATE">
									    <a class="btn" href="javascript:void(0);" onclick="createTelcallreason()"><i class="icon-plus"></i>新建通话原因</a>	
									</security:isAllow>
								</div>
							</div>
						</div>
						<a href="#" class="toggle"></a>	
					</div>
					<div class="panel-content">
						<dg:grid container="user_div" id="user_grid" loadOnFirst="false" onAfterGridScriptLoad="loadData">
							<dg:datasource selectSqlId="callcenter.telcallreason.list" includePageParams="true" daoName="callCenterRnDao"></dg:datasource>
							<dg:operationColumn>
								<security:isAllow privilege="CALLCENTER_TELCALLREASON$EDIT">
									<dg:action label="修改通话原因" onClick="modifyTelcallreason" id="modify_telcallreason" icon="/statics/images/ico_edit.gif"></dg:action>
								</security:isAllow>
								<security:isAllow privilege="CALLCENTER_TELCALLREASON$DEL">
									<dg:action label="删除通话原因" onClick="deleteTelcallreason" id="delete_telcallreason" icon="/statics/images/ico_del.gif"></dg:action>
								</security:isAllow>
							</dg:operationColumn>
							<dg:column id="id" width="0" header="通话原因ID" type="ro" align="center" visible="false" isKey="true"></dg:column>
							<dg:column id="typeText" width="8" header="通话类型" type="ro" align="center"></dg:column>
							<dg:column id="content" width="18" header="通话原因" type="ro" align="left"></dg:column>
							<dg:column id="creator" width="15" header="创建人" type="ro" align="center"></dg:column>
							<dg:column id="createTime" width="15" header="创建时间" type="ro" align="center"></dg:column>
							<dg:column id="sortNo" width="15" header="排序" type="ro" align="right"></dg:column>
						</dg:grid>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>