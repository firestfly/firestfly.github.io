<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>

<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>
        <c:choose>
            <c:when test="${empty param.notifyId}">
                通知订阅配置
            </c:when>
            <c:otherwise>
                通知订阅配置
            </c:otherwise>
        </c:choose>
    </title>
    <%@include file="/common/meta.jsp"%>
    <ui:combine widgets="validator,inputpro,blockui,listselectdialog,dialog,messagebox"></ui:combine>
    <ui:script src="/modules/notify/script/edit_notify.js"></ui:script>
</head>

<body class="container-body">
<div class="apply-page">
    <div class="page-title">
        <h2>
            <c:choose>
                <c:when test="${empty param.notifyId}">
                    通知订阅配置
                </c:when>
                <c:otherwise>
                    通知订阅配置
                </c:otherwise>
            </c:choose>
        </h2>
    </div>

    <div class="container-fluid">
        <form id="NOTIFY_EDIT_FORM" action="#" data-widget="validator" class="form-horizontal" >
            <!-- panel 内容 start -->
            <div class="panel apply-panel">
                <!-- panel 头部内容 start -->
                <div class="panel-head">
                    <div class="row-fluid">
                        <div class="span6 first">
                            <c:choose>
                                <c:when test="${empty param.notifyId}">
                                    新建通知订阅配置
                                </c:when>
                                <c:otherwise>
                                    新建通知订阅配置
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
                        <tbody>
                        <input type="hidden" name="id" id="id" value="${notify.id}"/>
                        <tr>
                            <th>通知类型：</th>
                            <td>
                                <ui:select id="type" name="type"
                                           source="sqlId:notify.get.dictionary"
                                           daoName="serviceCenterRnDao"
                                           defaultValue="${notify.type}"
                                           params="{code:SubscribeType}"
                                           emptyText="--选择--"
                                           htmlFragment='data-validator="required"' >
                                </ui:select>
                            </td>
                        </tr>
                        <tr>
                            <th>标题：</th>
                            <td height="100px">
                                <input type="text" data-validator="required" id="title"  style="width: 180px;" class="input-large"	maxlength="38" value="${notify.title}"/>
                            </td>
                        </tr>
                        <tr>
                            <th>发布者类型：</th>
                            <td>
                                <ui:select id="initialtorMode" name="initialtorMode"
                                           source="sqlId:notify.get.dictionary"
                                           daoName="serviceCenterRnDao"
                                           defaultValue="${notify.initialtorMode}"
                                           onchange="onInitialtorModeChange()"
                                           params="{code:InitialtorMode}"
                                           emptyText="--选择--"
                                           htmlFragment='data-validator="required"' >
                                </ui:select>
                            </td>
                        </tr>
                        <%--<tr>--%>
                            <%--<th>发布者：</th>--%>
                            <%--<td>--%>
                                <%--<button class="btn" id="editInitialtor" disabled>配置发布者</button>--%>
                            <%--</td>--%>
                        <%--</tr>--%>
                        <tr>
                            <th>订阅者类型：</th>
                            <td>
                                <ui:select id="recipientMode" name="recipientMode"
                                           source="sqlId:notify.get.dictionary"
                                           daoName="serviceCenterRnDao"
                                           defaultValue="${notify.recipientMode}"
                                           onchange="onRecipientModeChange()"
                                           params="{code:RecipientMode}"
                                           emptyText="--选择--"
                                           htmlFragment='data-validator="required"' >
                                </ui:select>
                            </td>
                        </tr>
                        <%--<tr>--%>
                            <%--<th>订阅者：</th>--%>
                            <%--<td>--%>
                                <%--<button class="btn" id="editRecipient" disabled>配置订阅者</button>--%>
                            <%--</td>--%>
                        <%--</tr>--%>
                        </tbody>
                    </table>
                </div>
                <!-- panel 中间内容 end -->
                <div class="panel-foot">
                    <div class="form-actions col2-fluid">
                        <c:if test="${notify.id != null}">
                            <button type="button" class="btn"  onclick="doUpdate();return false;">更&nbsp;新</button>
                        </c:if>
                        <c:if test="${notify.id == null}">
                            <button type="button" class="btn"  onclick="doSave();return false;">保&nbsp;存</button>
                        </c:if>
                        <button type="button" class="btn" onclick="$(this).dialogClose();">关&nbsp;闭</button>
                    </div>
                </div>
            </div>
            <!-- panel 内容 end -->
        </form>
    </div>
</div>
<script type="text/javascript">
    var notifyId = '${notify.id}';
</script>
</body>
</html>