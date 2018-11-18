<%@ page import="bingo.security.SecurityContext" %>
<%@ page import="bingo.vkcrm.common.utils.CookieUtil" %>
<%@ page import="bingo.vkcrm.webapp.security.service.OAuthService" %>
<%@ page import="bingo.common.core.ApplicationFactory" %>
<%@ page import="bingo.vkcrm.common.utils.JedisUtil" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>
<%
    String contextPath = request.getContextPath();
    String accessToken = CookieUtil.getCookieValue(request, "access_token");
    OAuthService oAuthService = (OAuthService) ApplicationFactory.getBeanForName("oAuthService");
    oAuthService.oauthLogout(accessToken);
    SecurityContext.getProvider().signOut(request);
    JedisUtil.defaultDb().del(accessToken.getBytes("UTF-8"));
    CookieUtil.deleteCookie(response, request, "access_token");
    request.getSession().invalidate();
    response.sendRedirect(request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + contextPath);
%>
</body>
</html>
