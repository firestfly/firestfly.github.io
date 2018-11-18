<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %></head>
<body>
    <%@include file="/common/header.jsp" %>
    <div class="wrap" id="search_index">
        <div class="content search-bg" style="background-image:url(${staticWeb}/img/sc/search/search-bg.png)">
            <div class="m-search" style="background-image:url(${staticWeb}/img/sc/search/tip.png)">
                <div class="m-search-logo">
                    <a href="javascript:void(0)">
                        <img src="${staticWeb}/img/sc/search/logo.png"></a>
                </div>
                <div class="m-search-wrap">
                    <div class="m-search-select">
                        <input type="hidden">
                        <span class="m-select-item">全部</span>
                        <ul class="m-search-item">
                            <li value="0" class="on" data-search-type='all'>全部</li>
                            <li value="1" data-search-type='house'>房屋</li>
                            <li value="2" data-search-type='customer'>客户</li>
                            <li value="3" data-search-type='carport'>车位</li>
                        </ul>
                    </div>
                    <div class="m-search-box">
                        <div class="m-search-btn">
                            <button onclick="indexSearch();">搜索</button>
                        </div>
                        <div class="m-search-input">
                            <input type="text" id="indexSearchText" data-search-type='home'></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="wrap loading-body" id="search_list" style="display: none">
        <div class="wrapper">
            <div class="search_bar">
                <div class="search-box">
                    <div class="search-input">
                        <input type="text" id="indexListText" data-search-type='detail'></div>
                    <div class="search-btn">
                        <button onclick="search()">搜索</button>
                    </div>
                </div>
            </div>
            <div class="tab_bar" id="search_tab_bar">
                <ul>
                    <li class="active" onclick="setType('all')">全部</li>
                    <li onclick="setType('house')">房屋</li>
                    <li onclick="setType('customer')">客户</li>
                    <li onclick="setType('carport')">车位</li>
                </ul>
            </div>
            <div class="result_wrapper">
                <div class="result_panel show" id="allListDiv"
                 style="overflow: auto;position: absolute;top: 163px;bottom: 40px;right: 0px;left: 0px;"></div>
                <div class="result_panel" id="houseListDiv"
                 style="overflow: auto;position: absolute;top: 163px;bottom: 40px;right: 0px;left: 0px;"></div>
                <div class="result_panel" id="customerListDiv"
                 style="overflow: auto;position: absolute;top: 163px;bottom: 40px;right: 0px;left: 0px;"></div>
                <div class="result_panel" id="carportListDiv"
                 style="overflow: auto;position: absolute;top: 163px;bottom: 40px;right: 0px;left: 0px;"></div>
        </div>
    </div>
</div>
<%@include file="/common/footer.jsp" %>
<script type="text/javascript">
    $(function () {
        $("#btn_header_search").addClass("on");
    });
</script>
<script type="text/javascript" src="${staticWeb}/js/sc/search.js?v=${javaScriptVersion}"></script>
</body>
</html>