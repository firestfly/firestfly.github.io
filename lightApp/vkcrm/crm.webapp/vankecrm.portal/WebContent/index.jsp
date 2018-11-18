<%@ taglib prefix="security" uri="http://www.bingosoft.net/security.tld" %>
<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
<body>
<div>
    <%@include file="/common/header.jsp" %>
    <div class="logout" style="text-align: right;">
        <a href="${logoutUrl}">退出</a>
    </div>
    <form method="post" action="javascript:void(0);">
        <div class="a_rk">
            <h1 class="title">物业CRM统一入口</h1>
            <div class="l_rk l_jtf">
                <security:isAllow privilege="SERVICE_CENTER">
			<span id="spnkf" class="li">
				<a href="${serviceCenterPath}">
                    <i class="i"><img src="${staticWeb}/img/portal/i_rk_kf.png"></i>
                    <strong class="t">客服中心</strong>
                </a>
			</span>
                </security:isAllow>
                <security:isAllow privilege="CALL_CENTER">
			<span id="spncc" class="li">
				<a href="${callCenterPath}">
                    <i class="i"><img src="${staticWeb}/img/portal/i_rk_hj.png"></i>
                    <strong class="t">呼叫中心</strong>
                </a>
			</span>
                </security:isAllow>
                <security:isAllow privilege="MONITORING_CENTER">
			<span id="spnjk" class="li">
				<a href="${monitorCenterPath}">
                    <i class="i"><img src="${staticWeb}/img/portal/i_rk_jk.png"></i>
                    <strong class="t">指挥中心</strong>
                </a>
			</span>
                </security:isAllow>
                <security:isAllow privilege="SATISFACTION">
            <span id="spndw" class="li">
                <a href="${satisfactionPath}">
                    <i class="i"><img src="${staticWeb}/img/portal/i_rk_wj.png"></i>
                    <strong class="t">问卷调查</strong>
                </a>
                </span>
                </security:isAllow>
                <security:isAllow privilege="REPORT">
            <span id="spnrpt" class="li">
                <a href="${reportCenterPath}">
                    <i class="i"><img src="${staticWeb}/img/portal/i_rk_bb.png"></i>
                    <strong class="t">报表中心</strong>
                </a>
            </span>
                </security:isAllow>
                <security:isAllow privilege="SERVICE_CENTER">
			<span id="spnkf" class="li">
				<a href="${businessPrintCenterPath}">
                    <i class="i"><img src="${staticWeb}/img/portal/i_rk_bp.png"></i>
                    <strong class="t">装修备案</strong>
                </a>
			</span>
                </security:isAllow>
                <b class="jr"></b>
            </div>
            <div class="c_copyright"></div>
        </div>
    </form>
    <%@include file="/common/footer.jsp" %>
</div>
</body>
</html>
