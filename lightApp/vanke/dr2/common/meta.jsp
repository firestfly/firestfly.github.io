<%@ page import="bingo.common.core.ApplicationContext" %>
<%@ page import="bingo.security.SecurityContext" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page language="java" pageEncoding="UTF-8" %>

<meta http-equiv="X-UA-Compatible" content="IE=8"/>
<meta http-equiv="cache-control" content="no-cache, must-revalidate"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="shortcut icon" href="/favicon.ico"/>
<title></title>
<%
    StringBuffer url = request.getRequestURL();
    String contextPath = url.delete(url.length() - request.getRequestURI().length(), url.length()).append(request.getContextPath()).toString();
    request.setAttribute("contextPath", contextPath);
    request.setAttribute("serverPath", contextPath);
    request.setAttribute("domainPath", contextPath);
    // 相关Web站点地址
    request.setAttribute("staticWeb", contextPath + "/static");
    // 当前登录用户
    request.setAttribute("loginUser", SecurityContext.getCurrentUser());
    //登陆类型
    request.setAttribute("loginMode", ApplicationContext.getProperty("Profile.Security.Login_Mode", "local"));
    // 资源文件版本号
    request.setAttribute("resourceVer", ApplicationContext.getProperty("version.num", "0.0.0.0") + "-" + ApplicationContext.getProperty("version.date", new SimpleDateFormat("yyyyMMdd").format(new Date())));

    response.setHeader("P3P", "CP=\"CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR\"");

    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Pragrma", "no-cache");
    response.setDateHeader("Expires", 0);

    request.setAttribute("logoutUrl", contextPath + "/logout.jsp");

    //页面添加Session超时设置
    session.setMaxInactiveInterval(Integer.parseInt(ApplicationContext.getProperty("Profile.SessionMaxTime", "28800")));
%>
<script type="text/javascript">
    <%--初始化公共的路径变量--%>
    var path = {};
    window.path["domain"] = '${domainPath}';
    window.path["context"] = '${contextPath}';
    window.path["server"] = '${serverPath}';
    window.path["staticWeb"] = '${staticWeb}';
</script>

<style type="text/css">

    .sidebar-nav {
        padding: 9px 0;
    }

    @media (max-width: 980px) {
        /* Enable use of floated navbar text */
        .navbar-text.pull-right {
            float: none;
            padding-left: 5px;
            padding-right: 5px;
        }
    }
</style>

<link rel="stylesheet" type="text/css" href="${serverPath}/static/font/iconfont.css?v=${resourceVer}">

