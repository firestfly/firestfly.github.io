<%@ page language="java" pageEncoding="UTF-8" %>
<div class="header">
    <div class="header-top">
        <div class="header-left">
            <div class="logo">
                <img src="${staticWeb}/img/logo.png">
                <em></em>
                <h1>CRM 满意度调查</h1>
            </div>
        </div>
        <div class="header-right">
            <div class="header-btns">
                <a class="h-btn header-user" href="javascript:void(0)"><i
                        class="icf-service"></i><span>${loginUser.getName()}</span></a><span class="pipe"></span>
                <a class="h-btn" href="javascript:void(0)" ms-click="headerboxToggle"><i class="icf-list"></i></a><span
                    class="pipe"></span>
                <a class="h-btn" href="${logoutUrl}"><i class="icf-logout"></i></a>
            </div>
            <div class="header-box" ms-class="on:headerboxVisible">
                <ul>
                    <li><a href="${adminPath}"><span>权限管理</span></a></li>
                    <li><a href="${adminPath}"><span>人员管理</span></a></li>
                </ul>
            </div>
        </div>
        <div class="header-center">
            <div class="header-btns">
                <security:isAllow privilege="QUESTIONNAIRE_CALL">
                    <a class="btn" ms-click="view('queslist')"
                       ms-class="on:visibleIndex == 'queslist'||visibleIndex == 'quescall'"><i
                            class="icf-task"></i> 问卷调查</a>
                </security:isAllow>
                <security:isAllow privilege="QUESTIONNAIRE_RESULT">
                    <a class="btn" ms-click="view('quesquery')" ms-class="on:visibleIndex == 'quesquery'"><i
                            class="icf-call"></i> 话务查询</a>
                </security:isAllow>
                <security:isAllow privilege="QUESTIONNAIRE_MANAGE">
                    <a class="btn" href="page/questionnaire/manage"><i class="icf-survey"></i> 问卷管理</a>
                </security:isAllow>
            </div>
        </div>
    </div>
</div>