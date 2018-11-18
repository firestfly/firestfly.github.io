<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="profiles" type="java.lang.String[]" scope="request"/>
<c:set var="baseUrl" value="${pageContext.request.contextPath}"/>
<c:set var="buildNo" value="@buildNo@" scope="page"/>
<c:set var="buildNoReqString" value="" scope="request"/>
<c:if test="${buildNo != ''}">
    <c:set var="buildNoReqString" value="?flag=${buildNo}" scope="request"/>
</c:if>

<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>rm-mobile</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="yes"/>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache, must-revalidate">
    <meta http-equiv="expires" content="Wed, 26 Feb 1997 08:21:57 GMT">
    <title>万科资源管理信息系统</title>
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css(.) styles/vendor.css -->
    <!-- bower:css -->
    <%--<link href="<c:url value="/rm-mobile/bower_components/mobile-angular-ui/dist/css/mobile-angular-ui-base.min.css" />"--%>
    <%--rel="stylesheet" type="text/css">--%>
    <!-- endbower -->
    <!-- endbuild -->
    <!-- build:css(.tmp) styles/main.css -->

    <link href="<c:url value="/rm-mobile/app/styles/main.css" />" rel="stylesheet" type="text/css">
    <link href="<c:url value="/rm-mobile/app/styles/index.css" />" rel="stylesheet" type="text/css">
    <!-- endbuild -->
    <script>
        !function (n) {
            var e = n.document, t = e.documentElement, i = 750, d = i / 75, o = "orientationchange"in n ? "orientationchange" : "resize", a = function () {
                var n = t.clientWidth || 320;
                n > 540 && (n = 540), t.style.fontSize = n / d + "px"
            };
            e.addEventListener && (n.addEventListener(o, a, !1), e.addEventListener("DOMContentLoaded", a, !1))
        }(window);
    </script>
</head>

<body ng-app="rmMobile" ng-controller="MainCtrl as main">

<div class="loading-modal" ng-if="loading">
    <div class="loading-box">
        <img src="<c:url value="/rm-mobile/app/images/loading.gif"/>" alt="页面正在加载中..."/>
    </div>
</div>
<div class="app color-grey">
    <!-- Navbars -->
    <div class="page-navbar">
        <div class="navbar-brand-center">
            <span ng-bind="main.title">我的资源服务</span>
        </div>
        <div ng-cloak class="left-icon" ng-show="main.showBack">
            <div ng-click="main.back()">
                <div class="nav-back"></div>
                <span ng-bind="main.backBtnText">返回</span>
            </div>
        </div>

        <div ng-cloak class="left-icon" ng-show="main.showClose" ng-click="main.close()">
            <div class="nav-close"></div>
        </div>

        <div ng-cloak class="right-icon" ui-yield-to="navbarAction" ng-show="main.showCalendar"
             ng-click="main.calendar()">
            <div class="nav-calendar"></div>
        </div>
        <div ng-cloak class="right-icon" ng-show="main.refresh" ng-click="reFreshDay()">
            刷新&nbsp;
        </div>
        <a ng-cloak class="right-icon" ng-if="main.rightBtnText" ng-bind="main.rightBtnText"
           ng-click="main.filterSelect()"></a>
    </div>
    <!-- App Body -->
    <div class="app-body">
        <div class="app-content">
            <ng-view></ng-view>
        </div>
    </div>
</div>

<div class="modal-box" ng-if="modelBox" ng-class="{'active': modelBox}">
    <div class="modal-backdrop"></div>
    <div class="modal-dialog">
        <div class="modal-header border-b">
            <h3 class="modal-title">系统消息</h3>
        </div>
        <div class="modal-body border-b">
            <div>{{ msg }}</div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" type="button" ng-click="main.ok()">确定</button>
        </div>
    </div>
</div>
<!-- ~ .app -->
<script type="text/javascript">
    var baseUrl = "${baseUrl}";
    var environment = 'product'
</script>

<c:if test="${profiles[0] == 'dev'}">
    <!-- build:js(.) scripts/vendor.js -->
    <!-- bower:js -->
    <script type="text/javascript" src="<c:url value="/rm-mobile/bower_components/angular/angular.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/bower_components/angular-route/angular-route.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/bower_components/angular-i18n/angular-locale_zh-cn.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/js/fastclick.js"/>"></script>
    <!-- endbower -->
    <!-- endbuild -->
    <!-- build:js({.tmp,app}) scripts/scripts.js -->

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/app.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/initApp.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/common/common.module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/common/common-service.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/common/sessionRecoverer.js"/>"></script>

    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/directives/directive.module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/home/home.module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/home/calendar.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/home/main.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/home/home.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/home/home.service.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/point/point.module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/point/point-service.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/point/point.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wifi/wifi.module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wifi/wifiAdd.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wifi/wifiModify.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wifi/wifiSearch.js"/>"></script>

    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/attendance/attendance.module.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/attendance/attendance-service.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/attendance/attendance.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/attendance/attendance-detail.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/attendance/attendance-rest.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/attendance/attendance-type.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/attendance/attendance-holidays.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/schedule/schedule.module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/schedule/schedule-service.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/schedule/schedule.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/sign-in/sign-in.module.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/sign-in/sign-in-service.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/sign-in/sign-in.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/description/index.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wealth/wealth.service.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wealth/index.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wealth/details.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/wealth/history.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/myattendance/myattendance.module.js"/>"></script>
    <script type="text/javascript"
            src="<c:url value="/rm-mobile/app/modules/myattendance/myattendance-service.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/myattendance/index.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/js/angular-pickadate.js"/>"></script>

    <script type="text/javascript" src="<c:url value="/rm-mobile/app/js/touch.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/rm-mobile/app/modules/directives/picker-year.js"/>"></script>

    <!-- endbuild -->
    <script type="text/javascript">
        var environment = 'dev'
    </script>
</c:if>

<c:if test="${profiles[0] != 'dev'}">
    <script type="text/javascript" src="<c:url value="/static/scripts/mobile-all-min-@buildNo@.js"/>"></script>
</c:if>
<c:if test="${profiles[0] == 'sit'}">
    <script type="text/javascript">
        var environment = 'sit'
    </script>
</c:if>
</body>

</html>
