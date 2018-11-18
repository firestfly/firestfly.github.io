<%@ page language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
    <script type="text/javascript" src="${staticWeb}/lib/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="${staticWeb}/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="${staticWeb}/lib/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="${staticWeb}/js/mc/pagination.js?v=${resourceVer}"></script>
    <script type="text/javascript" src="${staticWeb}/js/mc/config.js?v=${resourceVer}"></script>
    <script type="text/javascript" src="${staticWeb}/js/mc/common.js?v=${resourceVer}"></script>
    <script type="text/javascript" src="${serverPath}/static/js/avalon/avalon.js" data-main="${serverPath}/static/js/main.js?v=${resourceVer}"></script>
    <script type="text/javascript">
        Config.local.publisher = "${loginUser.getName()}";
        Config.local.publisherId = "${loginUser.getId()}";
        Config.local.contactMobile = "${loginUser.getMobilePhone()}";
    </script>
</head>
<body ms-controller="root">
<div class="tips-box" id="tipsBox"></div>
<div class="wrap">
    <%@include file="/common/header.jsp" %>
    <div class="content2" ms-visible="visibleIndex=='contenttask'" ms-include-src="src_contenttask"></div>
    <div class="content2" ms-visible="visibleIndex=='contentnotice'" ms-include-src="src_contentnotice"></div>
    <div class="content2" ms-visible="visibleIndex=='contentsystem'" ms-include-src="src_contentsystem"></div>
</div>
<div class="cover on" id="basecover">
		<span class="loading">
		欢迎使用CRM指挥中心<br/>
		正在初始化...</span>
</div>
</body>
</html>
