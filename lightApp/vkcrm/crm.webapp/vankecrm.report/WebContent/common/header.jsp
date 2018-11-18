<%@page import="bingo.common.core.ApplicationContext"%>
<%@page import="bingo.security.SecurityContext"%>
<%@ page language="java" pageEncoding="UTF-8"%>
<%
    String headerUserName = SecurityContext.getCurrentUser().getName();
    request.setAttribute("headerUserName", headerUserName);
    request.setAttribute("adminPathServicePath", ApplicationContext.getProperty("adminPath"));

%>


<div class="header">
    <div class="header-top">
        <div class="header-left">
            <div class="logo">
                <img src="${staticWeb}/img/logo.png">
                <em></em>
                <h1>CRM报表中心</h1>
            </div>
        </div>
        <div class="header-center">
        </div>
        <div class="header-right">
            <div class="header-btns">
                <a class="h-btn header-user" href="javascript:void(0)" id="headerUser"><span>${loginUser.name}</span></a><span class="pipe"></span>
                <a class="h-btn" href="${logoutUrl}" id="headerOut"><i class="icon iconfont">&#xe604;</i></a>
            </div>
        </div>
    </div>
</div>

