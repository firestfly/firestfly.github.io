<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:tvns>
<head>
	<title>
		<c:choose>
			<c:when test="${empty param.id}">
				注册系统（子）模块
			</c:when>
			<c:otherwise>
				修改系统（子）模块
			</c:otherwise>
		</c:choose>
	</title>
	<%@include file="/common/meta.jsp"%>
    <ui:combine widgets="validator,inputpro,blockui,dialog"></ui:combine>
	<ui:script src="modules/function/module/script/edit_sec_module.js"></ui:script>
</head>

<body class="container-body">
	<div class="apply-page">
		<div class="page-title">
			<h2>
				<c:choose>
					<c:when test="${empty param.id}">
						注册系统（子）模块
					</c:when>
					<c:otherwise>
						修改系统（子）模块
					</c:otherwise>
				</c:choose>
			</h2>
		</div>
		
		<div class="container-fluid">
	        <form id="AIP_SYSTEM_EDIT_FORM" action="#" data-widget="validator" class="form-horizontal" >
	        	<input type="hidden" id="type" value="Module"/>
	        	<c:choose>
					<c:when test="${empty param.id}">
						<input type="hidden" id="parent" value="${param.parentId}"/>
					</c:when>
					<c:otherwise>
						<input type="hidden" id="id" value="${param.id}"/>
						<input type="hidden" id="parent" value="${module.parent}"/>
					</c:otherwise>
				</c:choose>
			
				<!-- panel 内容 start -->
				<div class="panel apply-panel">
					<!-- panel 头部内容 start -->
					<div class="panel-head">
						<div class="row-fluid">
							<div class="span6 first">							
								<c:choose>
									<c:when test="${empty param.id}">
										注册系统（子）模块
									</c:when>
									<c:otherwise>
										修改系统（子）模块
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
							    <c:if test="${not empty param.parentId}">
								<tr>
									<th>
										上级模块名称：
									</th>
									<td >
										${param.parentName}
									</td>
								</tr>
								</c:if>
								<tr>
									<th>
										模块名称：
									</th>
									<td >
										<input id="name" type="text"  data-validator="required,length[0,150]" style="width:98%;" value="${module.name}" class="input-large"  maxlength="150"/>
									</td>
								</tr>
								<tr>
									<th>
										模块代码：
									</th>
									<td >
										<input id="code" type="text"  data-validator="required,length[0,50],func[checkUniqueCode]" style="width:98%;" value="${module.code}" class="input-large"  maxlength="50"/>
									</td>
								</tr>
								<c:if test="${empty param.parentId}">
								<tr>
									<th>
									<img title="访问子系统的路径上下文，如http://{host}:{port}/Org，host和port是代表域名和端口号的变量" style="cursor:pointer" src="${path}/statics/images/ico_help.gif" />
										地址空间：
									</th>
									<td >
										<input id="context" type="text" data-validator="length[0,300]" class="input-large" value="${module.context}" style="width: 98%" maxlength="300"/>
									</td>
								</tr>
								</c:if>
								<tr>
									<th>
									<img title="填写访问地址的相对路径,必须以/开头，如/modules/organization/org_main.jsp" style="cursor:pointer" src="${path}/statics/images/ico_help.gif" />
										访问地址：
									</th>
									<td >
										<input id="url" type="text" data-validator="length[0,300]" class="input-large" value="${module.url}" style="width: 98%" maxlength="300"/>
									</td>
								</tr>
								<tr>
									<th>
										显示顺序：
									</th>
									<td >
										<input id="order" type="text"  data-validator="integer" style="width:98%;" value="${module.order}" class="input-large"  maxlength="50"/>
									</td>
								</tr>
								<tr>
									<th>
										备注：
									</th>
									<td>
										<textarea id="description" data-validator="length[0,1000]" class="textArea" style="width: 98%" rows="3"></textarea>
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