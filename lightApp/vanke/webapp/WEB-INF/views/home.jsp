<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="profiles" type="java.lang.String[]" scope="request"/>
<c:set var="buildNo" value="@buildNo@" scope="page"/>
<c:set var="buildNoReqString" value="" scope="request"/>
<c:if test="${buildNo != ''}">
    <c:set var="buildNoReqString" value="?flag=${buildNo}" scope="request"/>
</c:if>
<%
    response.setHeader("Pragma", "No-cache");
    response.setHeader("Cache-Control", "no-cache");
    response.setDateHeader("Expires", -10);
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
    <meta http-equiv="expires" content="Wed, 26 Feb 1997 08:21:57 GMT">
    <title>万科资源管理信息系统</title>
    <link rel="icon" href="<c:url value="/images/vkrms.ico"/>" type="image/x-icon">
    <script>
        var ua = navigator.userAgent;
        if (ua.indexOf("VKStaffAssistant-Android") >= 0) {
            /*
             * 在app的webview中，跳转到移动端
             * */
            window.location.pathname = "/home-mobile";
        } else {
            /*
             * 不在app中，包括移动端浏览器和PC端浏览器，则跳转到移动端
             * */
            //window.location.pathname = "/home";
        }
    </script>
    <%@ include file="styles.jspf" %>
    <c:if test="${profiles[0] != 'dev'}">
        <link rel="stylesheet" type="text/css" href="<c:url value="/styles/style-min-@buildNo@.css"/>">
    </c:if>
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body id="ng-app" ng-app="vkrmsApp">
<div id="toast_cont">
    <div id="toast_content"></div>
</div>
<div class="LoadingBar" id="progressBar"></div>
<div id="wrapper">
    <div class="loading-modal" ng-if="loading">
        <div class="loading-box">
            <img src="<c:url value="/images/loading.gif"/>" alt="页面正在加载中..."/>
        </div>
    </div>
    <nav class="navbar navbar-default navbar-static-top vk-navbar" role="navigation">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand vk-logo" href="<c:url value="/"/>">
                <img src="<c:url value="/images/logo@2x.png"/>" width="163" height="29" alt="万科资源管理信息系统"/>
            </a>
        </div>

        <ul class="nav navbar-top-links navbar-right">
            <li>
                <span class="nav-username"></span>
            </li>
            <li>
                |&nbsp;&nbsp;&nbsp;&nbsp;<a href="<c:url value="/logout"/>" class="btn btn-link">退出登录</a>
            </li>
        </ul>
        <%@ include file="menu.jspf" %>
    </nav>
    <div id="page-wrapper">
        <div id="page-title" ng-show="isPageTitleShow">

            <ul class="c-breadcrumb">
                <li><i class="fa fa-home fa-fw"></i><a href="#/">首页</a></li>
                <li ng-repeat="item in pageTitle.split('-')"
                    ng-class="{'last': $index == pageTitle.split('-').length - 1}">
                    <i class="icon-arrow2"></i>
                    <span ng-if="item.split('#').length == 1" class="gray" ng-bind="item"></span>
                    <a ng-if="item.split('#').length == 2" href="{{'#' + item.split('#')[1]}}" class="gray"
                       ng-bind="item.split('#')[0]"></a>

                </li>
            </ul>
            <%--<small ng-bind="pageSubTitle" ></small>--%>
            <a ng-if="backBtnHref" ng-href="{{ backBtnHref }}" class="btn btn-default page-back">返回</a>
            <a ng-show="backBtn" href="javascript:history.back();" class="btn btn-default page-back">返回列表</a>
        </div>
        <div ng-view class="ng-views"></div>
    </div>

    <!-- Common Modal -->
    <div class="modal fade" id="commonModal" role="dialog">
        <div class="modal-dialog modal-sm">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">系统提示</h5>
                </div>
                <div class="modal-body">
                    <i class="fa modal-icon"></i>

                    <p>系统提示</p>
                </div>
                <div class="modal-footer">
                    <button class="btn vk-btn-default" type="button" data-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="commonLoadingModal" role="dialog">
        <div class="modal-dialog modal-sm">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">系统提示</h5>
                </div>
                <div class="modal-body">
                    <i class="fa fa-spinner" aria-hidden="true"></i> 正在校验数据，请勿操作页面！
                </div>
                <div class="modal-footer">
                </div>
            </div>
        </div>
    </div>

    <script type="text/ng-template" id="confirmDialog.html">
        <div class="modal-header">
            <button type="button" class="close"  ng-click="confirmClose()"><span aria-hidden="true">&times;</span></button>
            <i class="fa modal-icon" ng-class="icon"></i>
            <h5 class="modal-title" ng-bind="title"></h5>
        </div>
        <div class="modal-body confirm-dialog--body">
            <span ng-bind-html="content"></span>
        </div>
        <div class="modal-footer">
            <button class="btn vk-btn-default" type="button" ng-click="ok()" ng-bind="okText"></button>
            <button class="btn vk-btn-passion" type="button" ng-click="cancel()" ng-bind="cancelText"
                    ng-show="showCloseBtn"></button>
        </div>
    </script>

</div>
<%--</c:if>--%>
<c:if test="${profiles[0] != 'dev'}">
    <script type="text/javascript"
            src="https://api.map.baidu.com/api?v=2.0&ak=PTiRHfiOODukdOvyWADpexkNcYOgYS00"></script>
    <script type="text/javascript"
            src="<c:url value="/components/baidu-map/sign-in-area-drawing-manager.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/components/baidu-map/sign-in-area-GeoUtils_min.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/scripts/vendor-min.js${buildNoReqString}"/>"></script>
    <script type="text/javascript" src="<c:url value="/app/directives/angular-scrollable-table.js" />"></script>
    <script type="text/javascript" src="<c:url value="/static/scripts/vkrms-min-@buildNo@.js"/>"></script>
    <script>
        (function (para) {
            var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
            w['sensorsDataAnalytic201505'] = n;
            w[n] = w[n] || function (a) {
                    return function () {
                        (w[n]._q = w[n]._q || []).push([a, arguments]);
                    }
                };
            var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister', 'getAppStatus'];
            for (var i = 0; i < ifs.length; i++) {
                w[n][ifs[i]] = w[n].call(null, ifs[i]);
            }
            if (!w[n]._t) {
                x = d.createElement(s), y = d.getElementsByTagName(s)[0];
                x.async = 1;
                x.src = p;
                x.setAttribute('charset', 'UTF-8');
                y.parentNode.insertBefore(x, y);
                w[n].para = para;
            }
        })({
            sdk_url: 'https://static.sensorsdata.cn/sdk/1.9.11/sensorsdata.min.js',
            heatmap_url: 'https://static.sensorsdata.cn/sdk/1.9.11/heatmap.min.js',
            name: 'sa',
            web_url: 'https://vankeservicetest.cloud.sensorsdata.cn/?project=production',
            server_url: 'https://vankeservicetest.cloud.sensorsdata.cn:4006/sa?token=ee32e16095f8d953&project=production',
            heatmap: {}
        });
        sa.quick('autoTrack');
    </script>
</c:if>
<%@ include file="scripts.jspf" %>
</body>
</html>
