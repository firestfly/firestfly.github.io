<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>

<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>短信发送日志列表</title>	
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="dhtmlxgrid,dialog,multiselect,messagebox,calendar"></ui:combine>
		<ui:script src="modules/sms/script/sms_send_log.js"></ui:script>
		<script type="text/javascript">
			var categoryId = '${param.categoryId}';
			var categoryName = '${param.categoryName}';
		</script>
	</head>
	
	<body class="container-body">
	    <!--搜索框 -->
		<div class="container-fluid">
			<div class="grid-page">
				<div class="page-title">
					<h2>短信发送日志列表</h2>
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
									<th>模板类型：</th>
									<td>
									<select id="type" name="type" class="input-medium">
										<option value="">--请选择--</option>
										<option value="1">固定模板</option>
										<option value="2">半定义模板</option>
										<!-- <option value="3">自定义模板</option> -->
									</select>
									</td>
									<th>接收手机：</th>
									<td><input type="text" maxlength="20" id="mobile" name="mobile" class="input-medium"/></td>
								    <th>发送人：</th>
									<td><input type="text" maxlength="20" id="createdBy" name="createdBy" class="input-medium"/></td>
									<td class="toolbar-btns" rowspan="3">
										<button type="button" class="btn" onclick="user_grid.doSearch();">查询</button>
										<button type="button" class="btn" onclick="document.forms['queryForm'].reset();">重置</button>
									</td>
								</tr>
								<tr class="toggle-content2" style="display:none">
								    <th>短信内容：</th>
									<td><input type="text" maxlength="20" id="content" name="content" class="input-medium"/></td>
									<th>发送时间：</th>
									<td><input type="text" name="timeBegin" id="timeBegin" data-widget="calendar" data-options="{'isShowWeek':'true','dateFmt':'yyyy-MM-dd'}" class="input-medium"/></td>
								    <th>至</th>
									<td><input type="text" name="timeEnd" id="timeEnd" data-widget="calendar" data-options="{'isShowWeek':'true','dateFmt':'yyyy-MM-dd'}" class="input-medium"/></td>
									<td class="toolbar-btns" rowspan="3"></td>
								</tr>
								<tr class="toggle-content2" style="display:none">
									<th>发送成功</th>
									<td>
									<select id="success" name="success" class="input-medium">
										<option value="">--请选择--</option>
										<option value="1">是</option>
										<option value="0">否</option>
									</select>
									</td>
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
							</div>
						</div>
						<a href="#" class="toggle"></a>	
					</div>
					<div class="panel-content">
						<dg:grid container="user_div" id="user_grid" loadOnFirst="false" onAfterGridScriptLoad="loadData">
							<dg:datasource selectSqlId="callcenter.sms.log.list" includePageParams="true" daoName="callCenterDao"></dg:datasource>
							<dg:column id="send_time" width="12" header="发送时间" type="ro" align="center"></dg:column>
							<dg:column id="numbers" width="8" header="接收号码" type="ro" align="left"></dg:column>
							<dg:column id="type_text" width="8" header="模板类型" type="ro" align="center"></dg:column>
							<dg:column id="content" width="12" header="短信内容" type="ro" align="left"></dg:column>
							<dg:column id="send_name" width="6" header="发送人" type="ro" align="center"></dg:column>
							<dg:column id="success_text" width="8" header="发送成功" type="ro" align="center"></dg:column>
							<dg:column id="error_message" width="10" header="发送信息" type="ro" align="left"></dg:column>
							<dg:column id="return_name" width="8" header="状态报告" type="ro" align="left"></dg:column>
						</dg:grid>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>