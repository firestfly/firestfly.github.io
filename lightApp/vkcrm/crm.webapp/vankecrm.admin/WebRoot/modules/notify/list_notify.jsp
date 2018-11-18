<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>

<%@page import="bingo.security.SecurityContext" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <%@ include file="/common/meta.jsp" %>
    <ui:combine widgets="dhtmlxgrid,dialog,messagebox"></ui:combine>
    <ui:script src="modules/notify/script/list_notify.js"></ui:script>
</head>

<body class="container-body">
<div class="container-fluid">
    <div class="grid-page">
        <div class="page-title">
            <h2>通知订阅配置列表</h2>
        </div>

        <!-- 列表框 -->
        <div class="panel grid-panel">
            <div class="panel-head">
                <div class="row-fluid">
                    <div class="span6 first">
                        <i class="icon-list-alt"></i>
                        通知订阅配置列表
                    </div>
                    <div class="span6">
                        <!-- 工具栏  -->
                        <div class="pull-right">
                            <%if (SecurityContext.hasPermission("NOTIFY_MANAGE$CREATE_NOTIFY")) {%>
                            <a class="btn" href="javascript:" onclick="createNotify()"><i class="icon-plus"></i>新建通知订阅配置</a>
                            <a class="btn" href="javascript:" onclick="deleteNotifies()"><i
                                    class="icon-remove"></i>删除通知订阅配置</a>
                            <%}%>
                        </div>
                    </div>
                </div>
                <a href="#" class="toggle"></a>
            </div>
            <div class="panel-content">
                <dg:grid container="notify_div" id="notify_grid">
                    <dg:datasource selectSqlId="notify.get.list" daoName="rnDao"></dg:datasource>
                    <dg:checkAllColumn/>
                    <dg:operationColumn frozen="false">
                        <%if (SecurityContext.hasPermission("NOTIFY_MANAGE$EDIT_NOTIFY")) {%>
                        <dg:action label="修改配置" onClick="editNotify" id="editNotify"
                                   icon="/statics/images/ico_edit.gif"></dg:action>
                        <%}%>
                        <%if (SecurityContext.hasPermission("NOTIFY_MANAGE$DELETE_NOTIFY")) {%>
                        <dg:action label="删除配置" onClick="deleteNotify" id="deleteNotify"
                                   icon="/statics/images/ico_del.gif"></dg:action>
                        <%}%>
                        <dg:action label="发布者配置" onClick="editInitialtor" id="editInitialtor"
                                   icon="/statics/images/ico_assign_auth.gif"></dg:action>

                        <dg:action label="订阅者配置" onClick="editRecipient" id="editRecipient"
                                   icon="/statics/images/ico_assign_auth.gif"></dg:action>
                    </dg:operationColumn>
                    <dg:column id="ID" width="0" header="id" type="ro" isKey="true" visible="false"></dg:column>
                    <dg:column id="TYPE_ID" width="0" header="id" type="ro" visible="false"></dg:column>
                    <dg:column id="INITIALTOR_MODE" width="0" header="id" type="ro" visible="false"></dg:column>
                    <dg:column id="RECIPIENT_MODE" width="0" header="id" type="ro" visible="false"></dg:column>
                    <dg:column id="TYPE" width="25" header="通知类型" type="ro" align="center"></dg:column>
                    <dg:column id="INITIALTOR_MODE_TEXT" width="25" header="发布者类型" type="ro" align="center"></dg:column>
                    <dg:column id="RECIPIENT_MODE_TEXT" width="25" header="订阅者类型" type="ro" align="center"></dg:column>
                    <dg:column id="TITLE" width="25" header="标题" type="ro" align="center"></dg:column>
                    <dg:column id="CREATE_DATE" width="25" header="创建时间" type="ro" align="center"></dg:column>
                    <dg:column id="UPDATE_DATE" width="25" header="修改时间" type="ro" align="center"></dg:column>
                </dg:grid>
            </div>
        </div>
    </div>
</div>
</body>
</html>