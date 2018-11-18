<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>
		    <c:choose>
				<c:when test="${empty param.userId}">新建通话原因</c:when>
				<c:otherwise>编辑通话原因</c:otherwise>
			</c:choose>	
		</title>
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="validator,inputpro,dialog,blockui"></ui:combine>
		<ui:script src="/modules/telcallreason/script/edit_telcallreason.js"></ui:script>
		<script type="text/javascript">
			var id = '${param.id}';
			var type = '${telCallReason.type}';
		</script>
	</head>
	
	<body class="container-body">
	<div class="apply-page">
		<div class="page-title">
			<h2>
				<c:choose>
					<c:when test="${empty param.userId}">新建通话原因</c:when>
					<c:otherwise>编辑通话原因</c:otherwise>
				</c:choose>	
			</h2>
		</div>
		
		<div class="container-fluid">
	        <form id="TEL_CALL_REASON_FOMR" action="#" data-widget="validator" class="form-horizontal" >
	        	<input type="hidden" name="id" id="id" value="${param.id}"/>
				<!-- panel 内容 start -->
				<div class="panel apply-panel">
					<!-- panel 头部内容 start -->
					<div class="panel-head">
						<div class="row-fluid">
							<div class="span6 first">							
								<c:choose>
									<c:when test="${empty param.userId}">新建通话原因</c:when>
									<c:otherwise>编辑通话原因</c:otherwise>
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
						<table class="form-table col4-fluid" >
							<!--<caption>基本信息</caption>-->
							<tbody>
								<tr>
								    <th>通话原因：</th>
									<td><input type="text"  id="content" name="content" data-validator="required" maxlength="40" style="width: 180px;" class="input-large" value="${telCallReason.content}"/></td>
								</tr>
								<tr>
									<th>通话类型：</th>
									<td>
									<select id="type" name="type" class="input-large" data-validator="required"  style="width: 180px;">
										<option value="1">呼入</option>
										<option value="2">呼出</option>
									</select>
									</td>
								</tr>
								<tr>
								    <th>排序号：</th>
									<td><input type="text"  id="sortNo" name="sortNo" data-validator="required,integer" maxlength="5" style="width: 180px;" class="input-large" value="${telCallReason.sortNo}"/></td>
								</tr>
							</tbody>
						</table>							
					</div>
					<!-- panel 中间内容 end -->
                    <div class="panel-foot">
						<div class="form-actions col4-fluid">
							<button type="button" class="btn" onclick="doSave();return false;"><i class="icon-save"></i>保&nbsp;存</button>
							<button type="button" class="btn" onclick="$(this).dialogClose();return false;"><i class="icon-close"></i>关&nbsp;闭</button>
						</div>
					</div>
				</div>
				<!-- panel 内容 end -->
			</form>
		</div>
	</div>
	</body>
</html>