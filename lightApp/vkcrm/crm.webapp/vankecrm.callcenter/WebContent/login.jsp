<!DOCTYPE html>
<%@page language="java" pageEncoding="UTF-8" %>
<%@page import="bingo.security.SecurityContext" %>
<%@page import="bingo.security.principal.IUser" %>
<%@ page import="bingo.vkcrm.common.utils.AESUtil" %>
<%@ page import="bingo.vkcrm.common.utils.CookieUtil" %>
<%@ page import="bingo.vkcrm.common.utils.JedisUtil" %>
<%@ page import="bingo.vkcrm.common.utils.JsonUtil" %>
<%@ page import="java.util.UUID" %>
<%@ page import="org.apache.commons.lang3.StringUtils" %>
<%@include file="/common/taglibs.jsp" %>
<%
    String tokenCookieName = ApplicationContext.getProperty("token.cookie.key", "access_token");
    int expireTime = Integer.parseInt(ApplicationContext.getProperty("token.cookie.expire", "1800"));

    String username = request.getParameter("username_post");
    String password = request.getParameter("password_post");

    if ("login".equals(request.getParameter("action"))) {

        username = AESUtil.decryptParm(username, "0102030405060708");
        password = AESUtil.decryptParm(password, "0102030405060708");

        if (null == username || "".equals(username.trim())) {
            request.setAttribute("errors", "请输入登录帐号");
        } else {
            if (SecurityContext.getProvider().validateUser(username, password)) {
                SecurityContext.getProvider().signIn(request, username);

                String access_token = UUID.randomUUID().toString().replace("-", "").toUpperCase();

                IUser userInfo = SecurityContext.getProvider().getCurrentUser(request);

                String userInfoJsonString = AESUtil.encrypt2Str(JsonUtil.toJson(userInfo), "0102030405060708");

                JedisUtil.defaultDb().set(access_token.getBytes("UTF-8"), userInfoJsonString.getBytes("UTF-8"), expireTime);

                CookieUtil.addCookie(response, tokenCookieName, access_token, -1);

                String returnUrl = request.getParameter("returnUrl");
                if (StringUtils.isNotEmpty(returnUrl) && !"null".equalsIgnoreCase(returnUrl)) {
                    response.sendRedirect(returnUrl);
                } else {
                    String contextPath = request.getContextPath();
                    if(StringUtils.startsWith(contextPath, "/")){
                        response.sendRedirect(contextPath);
                    }else{
                        response.sendRedirect("/" + contextPath);
                    }
                }
            } else {
                request.setAttribute("errors", "用户名或密码不正确");
            }
        }
    }

    String errors = (String) request.getAttribute("errors");
    boolean isError = null != errors && !"".equals(errors.trim());
%>

<html>
<head>
    <title>万科客户关系管理系统登录</title>
    <%@include file="/common/meta.jsp" %>
    <script type="text/javascript" src="${staticWeb}/js/login.js"></script>
    <script type="text/javascript" src="${staticWeb}/lib/CryptoJSv3.1.2/rollups/aes.js"></script>
    <link rel="stylesheet" href="${staticWeb}/css/login.css"/>
</head>
<body>
<div class="wrapper-login">
    <div class="login-box">
        <div class="login">
            <!-- 用户登录信息 start-->
            <div class="login-form">
                <form method="post" action="${contextPath}/login.jsp" target="_self">
                    <!-- login title -->
                    <h1></h1>
                    <!-- login 表单数据 -->
                    <div class="errorMsg">
                        <%
                            if (isError) {
                        %>
                        <%=errors%>
                        <%
                            }
                        %>
                    </div>
                    <input type="hidden" name="returnUrl" value="<%=request.getParameter("returnUrl")%>"/>
                    <input type="hidden" name="action" value="login"/>

                    <div class="input-group">
                        <label></label>
                        <input type="text" id="username"
                               onkeydown="if(event.keyCode == 13||event.which == 13){doSubmit();}" tabindex="1"
                               accesskey="u"/>
                        <input type="hidden" id="username_post" name="username_post" value=""/>
                    </div>

                    <div class="input-group">
                        <label></label>
                        <input type="password" id="password"
                               onkeydown="if(event.keyCode == 13||event.which == 13){doSubmit();}" tabindex="2"
                               accesskey="p"/>
                        <input type="hidden" id="password_post" name="password_post" value=""/>
                    </div>

                    <div class="input-group">
                        <label></label>
                        <button type="button" class="btn btn-blue btn-login" onclick="javascript:doSubmit();">登录
                        </button>
                    </div>
                </form>
            </div>
            <!-- 用户登录信息 end-->
        </div>
    </div>
</div>
</body>
</html>