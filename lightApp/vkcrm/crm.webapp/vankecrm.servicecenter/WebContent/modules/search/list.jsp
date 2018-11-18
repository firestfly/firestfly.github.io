<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
<body>
<%@include file="/common/header.jsp" %>
<div class="wrap">
    <div class="content search-bg">
        <div class="m-search">
            <div class="m-search-logo">
                <a href="javascript:void(0)"><img src="${serverPath}/static/img/search/logo.png"></a>
            </div>
            <div class="m-search-wrap">
                <form>
                    <div class="m-search-select">
                        <input type="hidden">
                        <span>全部</span>
                        <ul>
                            <li value="0" class="on">全部</li>
                            <li value="1">房屋</li>
                            <li value="2">客户</li>
                            <li value="3">物业</li>
                        </ul>
                    </div>
                    <div class="m-search-box">
                        <div class="m-search-btn">
                            <button>搜索</button>
                        </div>
                        <div class="m-search-input">
                            <input type="text">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<%@include file="/common/footer.jsp" %>
<script type="text/javascript">
    $(function () {
        $("#btn_header_search").addClass("on");
    });
</script>
<script type="text/javascript" src="${staticWeb}/js/sc/index.js?v=${javaScriptVersion}"></script>
</body>
</html>