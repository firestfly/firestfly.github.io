<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>

<html>
	<head>
	    <title>角色对应的权限分配</title>
	    <%@include file="/common/meta.jsp"%>
		<ui:combine widgets="tree,blockui,dialog,messagebox,calendar"></ui:combine>
		<ui:script src="/modules/project/script/project_role.js"></ui:script>
		<script>
			var userId = '${param.roleId}';
		</script>
	</head>
	
	<body class="container-body">
	<div class="apply-page">
		<div class="page-title"><h2>温馨提示：您现在是给<font color="red">&nbsp;${param.roleName}&nbsp;</font>分配项目权限（选择组织会自动将选中组织所有项目授权给用户）</h2></div>
		
		<div class="container-fluid">
				<!-- panel 内容 start -->
				<div class="panel apply-panel">
					<!-- panel 头部内容 start -->
					<div class="panel-head">
						<div class="row-fluid">
							<div class="span6 first"></div>
							<div class="span6"></div>	
						</div>
						<a href="#" class="toggle"></a>
					</div>
					<!-- panel 头部内容 end -->
					<!-- panel 中间内容 start -->
					<div class="panel-content">
						<div class="row-fluid" style="padding-top:2px;padding-bottom: 2px;">
							<div class="span3" style="width: 22%">
								<div id="treeDiv" style="height:450px;padding-top:3px;overflow: auto;vertical-align:top;">
								</div>
							</div>
												
							<div class="span7" style="width: 74%">
								<div id="dataEntityId" style="padding-left: 1px;width:100%;">
					
									<form id="queryForm" style="margin: 0px;">
									<table>
										<tr>
										    <th>项目名称：</th>
											<td><input type="text" name="projectName" id="projectName" class="input-large"/></td>
											<td class="toolbar-btns" rowspan="3">
												<button type="button" class="btn" onclick="queryProject();">查询</button>
											</td>
										</tr>
									</table>
									</form>
									<table style='border: 1px solid #A9D6F6;;border-collapse: collapse;padding:2px;width:100%;'>
									<tr>
										<td align='center' width='28%' style='border:1px solid #A9D6F6;background-color: #DFEAFB;text-align: left'>
											备选项目：（最多显示50个）
											<select name="project1" id="project1" onchange="project1change()" multiple="multiple" style="width: 170px;height: 400px"></select>
										</td>
										<td align='center' width='*' style='border:1px solid #A9D6F6;background-color: #DFEAFB;text-align: left'>
											已选择项目：<button type="button" class="btn" onclick="cleanAll();">删除全部</button>
											
										<table style='border: 0px;padding:2px;width:100%;'>
											<div id="selectedProject" style="height: 400px;overflow: auto;"></div>
										</table>
										</td>
									</tr>
									</table>
								</div>
							</div>
						</div>						
					</div>
					<!-- panel 中间内容 end -->
                    <div class="panel-foot">
						<div class="form-actions col2-fluid">
							<button type="button" class="btn"  onclick="savePrivilege();return false;">保&nbsp;存</button>
				    		<button type="button" class="btn" onclick="$(this).dialogClose();">关&nbsp;闭</button>
						</div>
					</div>
				</div>
				<!-- panel 内容 end -->
		</div>
	</div>
	</body>
</html>