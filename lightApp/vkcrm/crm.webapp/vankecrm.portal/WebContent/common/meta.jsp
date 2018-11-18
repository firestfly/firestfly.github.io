<%@ page import="bingo.security.SecurityContext" %>
<%@ page import="bingo.vkcrm.common.utils.CookieUtil" %>
<%@ page language="java" pageEncoding="UTF-8" %>

<meta http-equiv="X-UA-Compatible" content="IE=8"/>
<meta http-equiv="cache-control" content="no-cache, must-revalidate"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="shortcut icon" href="/favicon.ico"/>
<title>万科物业客户关系管理系统</title>
<%
    String contextPath = request.getContextPath();
    request.setAttribute("contextPath", contextPath);
    request.setAttribute("serverPath", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + contextPath);
    request.setAttribute("domainPath", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort());
    request.setAttribute("revokeUrl", ApplicationContext.getProperty("Profile.oauth.revoke_url"));

    request.setAttribute("serviceCenterPath", request.getScheme() + "://sc." + request.getServerName() + ":" + request.getServerPort() + contextPath);
    request.setAttribute("callCenterPath", request.getScheme() + "://cc." + request.getServerName() + ":" + request.getServerPort() + contextPath);
    request.setAttribute("monitorCenterPath", request.getScheme() + "://mc." + request.getServerName() + ":" + request.getServerPort() + contextPath);
    request.setAttribute("serviceCenterPath", request.getScheme() + "://sc." + request.getServerName() + ":" + request.getServerPort() + contextPath);
    request.setAttribute("satisfactionPath", request.getScheme() + "://survey." + request.getServerName() + ":" + request.getServerPort() + contextPath);
    request.setAttribute("reportCenterPath", request.getScheme() + "://rp." + request.getServerName() + ":" + request.getServerPort() + contextPath);
    request.setAttribute("businessPrintCenterPath", request.getScheme() + "://bp." + request.getServerName() + ":" + request.getServerPort() + contextPath);
    // 相关Web站点地址
    request.setAttribute("staticWeb", ApplicationContext.getProperty("staticWeb"));
    request.setAttribute("adminWeb", ApplicationContext.getProperty("adminWeb"));
    // 当前登录用户
    request.setAttribute("loginUser", SecurityContext.getCurrentUser());
    // JavaScript版本号
    request.setAttribute("javaScriptVersion", "v1.0.0");
    request.setAttribute("styleSheetVersion", "v1.0.0");
    response.setHeader("P3P", "CP=\"CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR\"");

    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Pragrma", "no-cache");
    response.setDateHeader("Expires", 0);

    request.setAttribute("logoutUrl", contextPath + "/logout.jsp");

    String accessToken = CookieUtil.getCookieValue(request, "access_token");

    request.setAttribute("accessToken", accessToken);

    //页面添加Session超时设置
    session.setMaxInactiveInterval(Integer.parseInt(ApplicationContext.getProperty("Profile.SessionMaxTime","28800")));
%>

<link rel="stylesheet" type="text/css" href="${staticWeb}/css/portal/style.css?v=${styleSheetVersion}">
<script src="${staticWeb}/lib/jquery-1.11.0.min.js"></script>
<script src="${staticWeb}/js/common.js"></script>

<script type="text/javascript">
    var revokeUrl = '${revokeUrl}';
    var accessToken = '${accessToken}';
</script>

