<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>
		    <c:choose>
				<c:when test="${empty param.userId}">新建话务员</c:when>
				<c:otherwise>编辑话务员</c:otherwise>
			</c:choose>	
		</title>
		<%@include file="/common/meta.jsp"%>
		<ui:combine widgets="validator,inputpro,listselectdialog,dialog,blockui,messagebox"></ui:combine>
		<ui:script src="/modules/user/script/callcenter_edit_user.js"></ui:script>
		<script type="text/javascript">
			var org_id = '${user.orgId}';
			var dutyId = '${user.dutyId}:${user.dutyText}';
			var userId = '${param.userId}';
		</script>
	</head>
	
	<body class="container-body">
	<div class="apply-page">
		<div class="page-title">
			<h2>
				<c:choose>
					<c:when test="${empty param.userId}">新建话务员</c:when>
					<c:otherwise>编辑话务员</c:otherwise>
				</c:choose>	
			</h2>
		</div>
		
		<div class="container-fluid">
	        <form id="SEC_USER_FOMR" action="#" data-widget="validator" class="form-horizontal" >
	        	<input type="hidden" name="actionType" id="actionType" value="${user.actionType}"/>
	        	<input type="hidden" name="id" id="id" value="${user.id}"/>
				<!-- panel 内容 start -->
				<div class="panel apply-panel">
					<!-- panel 头部内容 start -->
					<div class="panel-head">
						<div class="row-fluid">
							<div class="span6 first">							
								<c:choose>
									<c:when test="${empty param.userId}">新建话务员</c:when>
									<c:otherwise>编辑话务员</c:otherwise>
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
									<th>话务员编号：</th>
									<td>
										<input type="text" data-validator="required,func[checkUniqueAccount]" id="loginId"
											style="width: 180px;" class="input-large"	maxlength="38" value=""/>
									</td>
								    <th>话务员名称：</th>
									<td><input type="text"  id="name" name="name" data-validator="required" maxlength="20" style="width: 180px;" class="input-large" value="${user.name}"/></td>
								</tr>
								<tr>
									<th>联系电话：</th>
									<td><input type="text" id="mobileNumber" data-validator="mobile,required[联系电话必须填写。]"  maxlength="20"  style="width: 180px;" class="input-large" value="${user.mobileNumber}"/></td>
									<th>所属分组：</th>
									<td>
										 <input type="hidden" id="groups" name="groups" value="${user.groupids}"/>
										 <input type="text" name="groupNames" id="groupNames" class="inputimg" readOnly="readonly" 
										 data-validator="required" style="cursor:pointer;width: 180px;" value="${user.groupNames}" onclick="selectClz();return false;"/>
									</td>
								</tr>
								<tr>
									<th>职务：</th>
									<td>
									<select id="dutyId" name="dutyId" data-validator="required" style="width:180px;">
										<option value=""></option>
									</select>
									</td>
									<th></th>
									<td></td>
								</tr>
								<c:if test="${empty param.userId}">
									<tr>
										<th>
											登录密码：
										</th>
										<td>
											<input type="password"  id="password" data-validator="required[密码不能为空],equalToField[checkPassword,密码和确认密码不一致]"  maxlength="40" style="width: 180px;" class="input-large" />
										</td>
										<th id = 'checkPassTh'>
											确认密码：
										</th>
										<td id = 'checkPassTd'>
											<input type="password"  id="checkPassword" data-validator="required,equalToField[password,密码和确认密码不一致]" maxlength="40"  style="width: 180px;" class="input-large"/>
										</td>
										<td colspan="2" id = "hideTd" style="display: none"></td>
									</tr>
								</c:if>
								<tr>
									<td colspan="4">
										<p>
										<b>电信工号列表：</b>
										<button type="button" class="btn" onclick="addUserTelecomno('','');return false;" style="float: right;margin-right:10px;"><i class="icon-add"></i>添加&nbsp;&nbsp;&nbsp;</button>
										</p>
                        				<div id="telecomnoList"></div>
									</td>
								</tr>
							</tbody>
						</table>							
					</div>
					<!-- panel 中间内容 end -->
                    <div class="panel-foot" style="float: bottom">
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