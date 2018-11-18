<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>

<html>
	<head>
		<title>
		   <c:choose>
				<c:when test="${empty param.templateId}">注册短信模板信息</c:when>
				<c:otherwise>修改短信模板信息</c:otherwise>
			</c:choose>
        </title>
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="validator,tree,blockui,dialog,messagebox,calendar"></ui:combine>
		<ui:script src="/modules/sms/script/sms_template_detail.js"></ui:script>
	</head>
	
	<body class="container-body">
	<div class="apply-page">
		<div class="page-title">
			<h2>
				<c:choose>
					<c:when test="${empty param.templateId}">
						注册短信模板信息
					</c:when>
					<c:otherwise>
						修改短信模板信息
					</c:otherwise>
				</c:choose>
			</h2>
		</div>
		
		<div class="container-fluid">
	        <form id="SMS_TEMPLATE_EDIT_FORM" action="#" data-widget="validator" class="form-horizontal" >
				<!-- panel 内容 start -->
				<div class="panel apply-panel">
					<!-- panel 头部内容 start -->
					<div class="panel-head">
						<div class="row-fluid">
							<div class="span6 first">							
								<c:choose>
									<c:when test="${empty param.templateId}">
										注册短信模板信息
									</c:when>
									<c:otherwise>
										修改短信模板信息
									</c:otherwise>
								</c:choose>
							</div>
							<div class="span6"></div>	
						</div>
						<a href="#" class="toggle"></a>
					</div>
					<!-- panel 头部内容 end -->
					
					<!-- panel 中间内容 start -->
					<div class="panel-content">
						<!-- 数据列表样式 -->
						<table class="form-table col2-fluid" >
							<!--<caption>基本信息</caption>-->
							<tbody>
							    <c:choose>
									<c:when test="${empty param.templateId}">
										<input type="hidden" name="categoryId" id="categoryId" value="${categoryId}"/>
									</c:when>
									<c:otherwise>
										<input type="hidden" id="id" name="id" value="${param.templateId}"/>
										<input type="hidden" name="categoryId" id="categoryId" value="${categoryId}"/>
									</c:otherwise>
								</c:choose>
								<tr>
									<th>所属分类：</th>
									<td colspan="3" id="parent_name">${categoryName}</td>
								</tr>
								<tr>
									<th>模板名称：</th>
									<td colspan="3" >
										<input type="text" id="name"  maxlength="50" data-validator="required,length[0,50]" style="width:97%;" class="input-large" value="${smsTemplate.name}"/>
									</td>
								</tr>
								<tr>
									<th>模板类型：</th>
									<td colspan="3" >
										<select id="type" name="type" style="width: 98%;">
											<option <c:if test="${smsTemplate.type==1}">selected="selected"</c:if> value="1">固定模板</option>
											<option <c:if test="${smsTemplate.type==2}">selected="selected"</c:if> value="2">半定义模板</option>
										</select>
									</td>
								</tr>
								<tr>
									<th>模板内容：</th>
									<td colspan="3" >
										<textarea id="content" style="width: 98%;overflow: auto;" data-validator="required,length[0,255]" 
										rows="6" class="input-large"><c:out value="${smsTemplate.content}"></c:out></textarea>
									</td>
								</tr>
								<tr>
									<th>生效时间：</th>
									<td colspan="3" >
										<input type="text" name="startDate" id="startDate"  value="${smsTemplate.startDate}" data-validator="required"
										 data-options="{isShowWeek:'true',dateFmt:'yyyy-MM-dd'}"
										 format="yyyy-MM-dd"
										data-widget="calendar" class="input-small"/>
									</td>
								</tr>
								<tr>
									<th>失效时间：</th>
									<td colspan="3" >
										<input type="text" name="endDate" id="endDate"  value="${smsTemplate.endDate}"  data-validator="required"
										 data-options="{isShowWeek:'true',dateFmt:'yyyy-MM-dd'}"
										data-widget="calendar" class="input-small"/>
									</td>
								</tr>
								<tr>
									<td colspan="4">
										*模板里面用中文“×”代替自定义文字，数字或英文字母占半个文字
									</td>
								</tr>
							</tbody>
						</table>							
					</div>
					<!-- panel 中间内容 end -->
                    <div class="panel-foot">
						<div class="form-actions col2-fluid">
							<button type="button" class="btn"  onclick="doSave();return false;">保&nbsp;存</button>
							<button type="button" class="btn" onclick="$(this).dialogClose();">关&nbsp;闭</button>
						</div>
					</div>
				</div>
				<!-- panel 内容 end -->
			</form>
		</div>
	</div>
	</body>
</html>