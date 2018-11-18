<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>

<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>短信群发</title>	
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="validator,dhtmlxgrid,dialog,multiselect,messagebox"></ui:combine>
		<ui:script src="modules/sms/script/sms_template_list.js"></ui:script>
		<ui:script src="modules/sms/script/sms_send_batch.js"></ui:script>
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
					<h2>短信群发</h2>
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
							<input type="hidden" name="enabled" id="enabled" value="1"/>
							<input type="hidden" name="status" id="status" value="2"/>
							<table>
								<tr>
									<th>模板标题：</th>
									<td><input type="text" maxlength="20" id="name" name="name" style="width:200px" class="input-large"/></td>
									<th>模板内容：</th>
									<td><input type="text" maxlength="20" id="content" name="content" style="width:200px" class="input-large"/></td>
									<td class="toolbar-btns">
										<button type="button" class="btn" onclick="user_grid.doSearch();">查询</button>
										<button type="button" class="btn" onclick="document.forms['queryForm'].reset();">重置</button>
									</td>
								</tr>
							</table>
							</form>
						</div>	
					</div>
				</div>
					<form id="sendForm" style="margin: 0px;">
					<!-- 模板类型 -->
					<input type="hidden" id="type" name="type"/>
					<input type="hidden" id="content" name="content"/>
					<input type="hidden" id="templateId" name="templateId"/>
					<div class="panel-content">
						<table class="form-table col2-fluid" >
							<tbody>
								<tr>
									<th>发送号码：</th>
									<td>
										<textarea id="numbers" style="width: 98%;overflow: auto;" data-validator="required"
										rows="10" class="input-large"></textarea>
									</td>
								</tr>
								<tr>
									<th></th>
									<td>
										多个手机号码用半角逗号","分隔
									</td>
								</tr>
								<tr>
									<th>模板内容：</th>
									<td>
										<span id="templateContent"></span><br>
										<textarea id="sendContent" style="width: 98%;overflow: auto;" data-validator="required,length[0,500]"
										onkeyup="contentOnchange()"
										rows="6" class="input-large"></textarea>
									</td>
								</tr>
							</tbody>
						</table>							
					</div>
                    <div class="panel-head">
						<div class="form-actions col2-fluid" style="text-align: right;padding-right: 10px">
							<button type="button" class="btn"  onclick="doSend();return false;">发&nbsp;送</button>
						</div>
					</div>
					</form>
				<!-- panel 内容 end -->
				
			
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
						<dg:grid container="user_div" id="user_grid" loadOnFirst="false" onAfterGridScriptLoad="loadData" onRowClick="onRowClick">
							<dg:datasource selectSqlId="callcenter.sms.template.list" includePageParams="true" daoName="callCenterDao"></dg:datasource>
							<dg:column id="id" width="0" header="id" type="ro" align="center" visible="false" isKey="true"></dg:column>
							<dg:column id="category_id" width="0" header="模板分类ID" type="ro" align="center" visible="false"></dg:column>
							<dg:column id="category_name" width="12" header="模板分类" type="ro" align="center"></dg:column>
							<dg:column id="type" width="0" header="模板类型ID" type="ro" align="left" visible="false"></dg:column>
							<dg:column id="type_name" width="8" header="模板类型" type="ro" align="left"></dg:column>
							<dg:column id="name" width="10" header="模板标题" type="ro" align="left"></dg:column>
							<dg:column id="content" width="12" header="模板内容" type="ro" align="left"></dg:column>
						</dg:grid>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>