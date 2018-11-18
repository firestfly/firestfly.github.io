<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>

<%@page import="bingo.security.SecurityContext" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>通知话务分组配置</title>
    <%@ include file="/common/meta.jsp" %>
    <ui:combine widgets="dhtmlxgrid,dialog,messagebox,listselectdialog"></ui:combine>
    <ui:script src="modules/notify/script/list_notify_telephonistGroup.js"></ui:script>
    <script type="text/javascript">
        var notifyId = '${param.notifyId}';
        var type = '${param.type}';
    </script>
</head>

<body class="container-body">
<div class="container-fluid">
    <div class="grid-page">
        <div class="page-title">
            <h2>通知话务分组列表</h2>
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
                                <th>话务分组名称：</th>
                                <td><input type="text" name="NAME" id="NAME" class="input-large"/></td>
                                <td class="toolbar-btns" rowspan="3">
                                    <button type="button" class="btn" onclick="notify_telephonistGroup_grid.doSearch();">查询</button>
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
                        通知话务分组列表
                    </div>
                    <div class="span6">
                        <!-- 工具栏  -->
                        <div class="pull-right">
                            <a class="btn" href="javascript:" onclick="addTelephonistGroups()"><i class="icon-plus"></i>添加话务分组</a>
                            <a class="btn" href="javascript:" onclick="deleteTelephonistGroups()"><i
                                    class="icon-remove"></i>删除话务分组</a>
                        </div>
                    </div>
                </div>
                <a href="#" class="toggle"></a>
            </div>
            <div class="panel-content">
                <dg:grid container="notify_telephonistGroup_div" id="notify_telephonistGroup_grid">
                    <dg:datasource selectSqlId="notify.get.telephonistGroup.list"
                                   fixedQueryCondition="{notifyId:'${param.notifyId}',type:'${param.type}'}"></dg:datasource>
                    <dg:checkAllColumn/>
                    <dg:operationColumn>
                        <dg:action label="删除话务分组" onClick="deleteTelephonistGroup" id="deleteTelephonistGroup"
                                   icon="/statics/images/ico_del.gif"></dg:action>
                    </dg:operationColumn>
                    <dg:column id="ID" width="0" header="话务分组ID" type="ro" frozen="false" isKey="true"
                               visible="false"></dg:column>
                    <dg:column id="NAME" width="25" header="话务分组名称" type="ro" frozen="false" align="center"></dg:column>
                </dg:grid>
            </div>
        </div>
    </div>
</div>
</body>
</html>