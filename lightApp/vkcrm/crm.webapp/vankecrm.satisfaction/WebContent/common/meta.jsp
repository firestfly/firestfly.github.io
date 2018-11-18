<%@ page import="bingo.common.core.ApplicationContext" %>
<%@ page import="bingo.security.SecurityContext" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>
<%@ page language="java" pageEncoding="UTF-8"%>

<meta http-equiv="X-UA-Compatible" content="IE=8"/>
<meta http-equiv="cache-control" content="no-cache, must-revalidate"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="shortcut icon" href="/favicon.ico"/>
<title>万科物业客户关系管理系统</title>
<%
    StringBuffer url = request.getRequestURL();
    String contextPath = url.delete(url.length() - request.getRequestURI().length(), url.length()).append(request.getContextPath()).toString();
    request.setAttribute("contextPath", contextPath);
    request.setAttribute("serverPath", contextPath);
    request.setAttribute("domainPath", contextPath);
    // 相关数据服务地址
    request.setAttribute("serviceCustomerPath", ApplicationContext.getProperty("service.customer.path"));
    request.setAttribute("serviceHousePath", ApplicationContext.getProperty("service.house.path"));
    request.setAttribute("serviceTaskPath", ApplicationContext.getProperty("service.task.path"));
    request.setAttribute("serviceTelPath", ApplicationContext.getProperty("service.tel.path"));
    request.setAttribute("serviceQuestionnairePath", ApplicationContext.getProperty("service.questionnaire.path"));
    // 相关Web站点地址
    request.setAttribute("staticWeb", ApplicationContext.getProperty("staticWeb"));
    request.setAttribute("adminWeb", ApplicationContext.getProperty("adminWeb"));
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

    request.setAttribute("imitatePhone", ApplicationContext.getProperty("Profile.ImitatePhone", "false"));

    request.setAttribute("softPhoneServiceEnable", ApplicationContext.getProperty("Profile.SoftPhoneServiceEnable","false"));
    request.setAttribute("softPhoneServiceHost", ApplicationContext.getProperty("Profile.SoftPhoneServiceHost"));
    request.setAttribute("softPhoneServicePort", ApplicationContext.getProperty("Profile.SoftPhoneServicePort"));
    request.setAttribute("softPhoneServiceMethod", ApplicationContext.getProperty("Profile.SoftPhoneServiceMethod"));
    request.setAttribute("addTaskPath", ApplicationContext.getProperty("Profile.AddTaskPath","http://10.0.72.35/cc/newtask.jsp"));

    //页面添加Session超时设置
    session.setMaxInactiveInterval(Integer.parseInt(ApplicationContext.getProperty("Profile.SessionMaxTime","28800")));
%>
<script type="text/javascript">
    <%--初始化公共的路径变量--%>
    var path = {};
    window.path["domain"] = '${domainPath}';
    window.path["context"] = '${contextPath}';
    window.path["server"] = '${serverPath}';
    window.path["staticWeb"] = '${staticWeb}';
    <%--初始化数据服务地址--%>
    var servicePath = {};
    window.servicePath["customer"] = '${serviceCustomerPath}';
    window.servicePath["house"] = '${serviceHousePath}';
    window.servicePath["task"] = '${serviceTaskPath}';
    window.servicePath["tel"] = '${serviceTelPath}';
    window.servicePath["questionnaire"] = '${serviceQuestionnairePath}';
</script>

<link rel="stylesheet" type="text/css" href="${staticWeb}/css/bootstrap.min.css?v=${resourceVer}"/>
<link rel="stylesheet" type="text/css" href="${staticWeb}/css/bootstrap-responsive.min.css?v=${resourceVer}"/>
<%--<link rel="stylesheet" type="text/css" href="${staticWeb}/font/iconfont.css?v=${styleSheetVersion}">--%>
<link rel="stylesheet" type="text/css" href="${staticWeb}/css/satis/main.css?v=${resourceVer}">


