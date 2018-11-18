<%@ page import="bingo.security.SecurityContext" %>
<%@ page import="bingo.vkcrm.common.utils.CookieUtil" %>
<%@ page import="bingo.common.core.ApplicationContext" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>
<%
    StringBuffer url = request.getRequestURL();
    String contextPath = url.delete(url.length() - request.getRequestURI().length(), url.length()).append(request.getContextPath()).toString();
    SecurityContext.getProvider().signOut(request);
    CookieUtil.deleteCookie(response, request, "access_token");
    request.getSession().invalidate();
    if ("local".equalsIgnoreCase(ApplicationContext.getProperty("Profile.Security.Login_Mode", "local"))) {
        response.sendRedirect(contextPath);
    } else {
        response.sendRedirect(ApplicationContext.getProperty("portalWeb", "http://tvkcrm.vankeservice.com"));
    }
%>
</body>
</html>
