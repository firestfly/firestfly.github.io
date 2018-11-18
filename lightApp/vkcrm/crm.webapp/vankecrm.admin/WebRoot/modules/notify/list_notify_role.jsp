<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>

<%@page import="bingo.security.SecurityContext" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>通知角色配置</title>
    <%@ include file="/common/meta.jsp" %>
    <ui:combine widgets="dhtmlxgrid,dialog,messagebox,listselectdialog"></ui:combine>
    <ui:script src="modules/notify/script/list_notify_role.js"></ui:script>
    <script type="text/javascript">
        var notifyId = '${param.notifyId}';
        var type = '${param.type}';
    </script>
</head>

<body class="container-body">
<div class="container-fluid">
    <div class="grid-page">
        <div class="page-title">
            <h2>通知角色列表</h2>
        </div>
        <!--搜索框 -->
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
                                <th>角色名称：</th>
                                <td><input type="text" name="ROLE_NAME" id="ROLE_NAME" class="input-large"/></td>
                                <th>
                                    角色描述：
                                </th>
                                <td>
                                    <input type="text" maxlength="20" name="ROLE_DESCRIPTION" style="width:110px" id="ROLE_DESCRIPTION"
                                           class="input-large"/>
                                </td>
                                <td class="toolbar-btns" rowspan="3">
                                    <button type="button" class="btn" onclick="notify_role_grid.doSearch();">查询</button>
                                    <button type="button" class="btn" onclick="document.forms['queryForm'].reset();">
                                        重置
                                    </button>
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
                    <div class="span6 first">
                        <i class="icon-list-alt"></i>
                        通知角色列表
                    </div>
                    <div class="span6">
                        <!-- 工具栏  -->
                        <div class="pull-right">
                            <a class="btn" href="javascript:" onclick="addRoles()"><i class="icon-plus"></i>添加角色</a>
                            <a class="btn" href="javascript:" onclick="deleteRoles()"><i
                                    class="icon-remove"></i>删除角色</a>
                        </div>
                    </div>
                </div>
                <a href="#" class="toggle"></a>
            </div>
            <div class="panel-content">
                <dg:grid container="notify_role_div" id="notify_role_grid">
                    <dg:datasource selectSqlId="notify.get.role.list"
                                   fixedQueryCondition="{notifyId:'${param.notifyId}',type:'${param.type}'}"></dg:datasource>
                    <dg:checkAllColumn/>
                    <dg:operationColumn>
                        <dg:action label="删除角色" onClick="deleteRole" id="deleteRole"
                                   icon="/statics/images/ico_del.gif"></dg:action>
                    </dg:operationColumn>
                    <dg:column id="ROLE_ID" width="0" header="角色ID" type="ro" frozen="false" isKey="true"
                               visible="false"></dg:column>
                    <dg:column id="ROLE_NAME" width="25" header="角色名称" type="ro" frozen="false" align="center"></dg:column>
                    <dg:column id="ROLE_DESCRIPTION" width="100" header="角色描述" type="ro" frozen="false" align="center"></dg:column>
                </dg:grid>
            </div>
        </div>
    </div>
</div>
</body>
</html>