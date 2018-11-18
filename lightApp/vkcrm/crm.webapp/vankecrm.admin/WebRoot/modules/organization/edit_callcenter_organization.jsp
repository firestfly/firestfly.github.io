<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>
        <c:choose>
            <c:when test="${empty param.orgId}">注册分组信息</c:when>
            <c:otherwise>修改分组信息</c:otherwise>
        </c:choose>
    </title>
    <%@include file="/common/meta.jsp" %>
    <ui:combine widgets="validator,inputpro,blockui,dialog"></ui:combine>
    <ui:script src="/modules/organization/script/edit_callcenter_organization.js"></ui:script>
</head>

<body class="container-body">
<div class="apply-page">
    <div class="page-title">
        <h2>
            <c:choose>
                <c:when test="${empty param.orgId}">
                    注册分组信息
                </c:when>
                <c:otherwise>
                    修改分组信息
                </c:otherwise>
            </c:choose>
        </h2>
    </div>

    <div class="container-fluid">
        <form id="USF_ORGANIZATION_EDIT_FORM" action="#" data-widget="validator" class="form-horizontal">
            <!-- panel 内容 start -->
            <div class="panel apply-panel">
                <!-- panel 头部内容 start -->
                <div class="panel-head">
                    <div class="row-fluid">
                        <div class="span6 first">
                            <c:choose>
                                <c:when test="${empty param.orgId}">
                                    注册分组信息
                                </c:when>
                                <c:otherwise>
                                    修改分组信息
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
                    <table class="form-table col2-fluid">
                        <!--<caption>基本信息</caption>-->
                        <tbody>
                        <c:choose>
                            <c:when test="${empty param.orgId}">
                                <input type="hidden" name="parentId" id="parentId" value="${param.parentId}"/>
                            </c:when>
                            <c:otherwise>
                                <input type="hidden" id="id" name="id" value="${param.orgId}"/>
                                <input type="hidden" name="parentId" id="parentId" value="${org.parentId}"/>
                                <input type="hidden" name="isDeleted" id="isDeleted" value="0"/>
                            </c:otherwise>
                        </c:choose>
                        <tr>
                            <th>上级分组：</th>
                            <td colspan="3" id="parent_name">${param.parentName}</td>
                        </tr>
                        <tr>
                            <th>
                                分组名称：
                            </th>
                            <td colspan="3">
                                <input type="text" id="name" maxlength="75" data-validator="required,length[0,10]"
                                       style="width:97%;" class="input-large" value="${org.name}"/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                组长：
                            </th>
                            <td colspan="3">
                                <ui:select id="groupMaster" name="groupMaster"
                                           source="sqlId:callcenter.user.get.dutyid2"
                                           daoName="callCenterRnDao"
                                           defaultValue="${org.groupMaster}"
                                           params="{param1:'value1',param2:'value2'}"
                                           emptyText="--选择--">
                                </ui:select>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                是否接受咨询：
                            </th>
                            <td colspan="3">
                                <ui:radio id="isConsult" name="isConsult"
                                             source="sqlId:callcenter.user.get.isConsult"
                                             daoName="serviceCenterRnDao"
                                             defaultValue="${org.isConsult}"
                                             params="{param1:'value1',param2:'value2'}"
                                             htmlFragment='data-validator="required"' >
                                </ui:radio>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!-- panel 中间内容 end -->
                <div class="panel-foot">
                    <div class="form-actions col2-fluid">
                        <button type="button" class="btn" onclick="doSave();return false;">保&nbsp;存</button>
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