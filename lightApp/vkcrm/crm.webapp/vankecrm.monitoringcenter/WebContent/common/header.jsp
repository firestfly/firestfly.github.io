<%@ page language="java" pageEncoding="UTF-8"%>

<div class="header">
    <div class="header-top">
        <div class="header-left">
            <div class="logo">
                <img src="${staticWeb}/img/logo.png">
                <em></em>
                <h1>CRM指挥中心</h1>
            </div>
        </div>
        <div class="header-right">
            <div class="header-btns">
                <a class="h-btn header-user" href="javascript:void(0)"><i
                        class="icf-service"></i><span>${loginUser.getName()}</span></a><span
                    class="pipe"></span>
                <a class="h-btn" href="javascript:void(0)" ms-click="headerboxToggle"><i
                        class="icf-list"></i></a><span class="pipe"></span>
                <a class="h-btn" href="${logoutUrl}"><i class="icf-logout"></i></a>
            </div>
            <div class="header-box" ms-class="on:headerboxVisible">
                <ul>
                    <li><a href="${adminWeb}"><span>权限管理</span></a></li>
                    <li><a href="${adminWeb}"><span>人员管理</span></a></li>
                </ul>
            </div>
        </div>
        <div class="header-center">
            <div class="header-btns">
                <a class="btn" ms-click="show('contenttask/tasklist')" ms-class="on:visibleIndex=='contenttask'">
                    <i class="icf-task"></i> 任务管理</a>
                <a class="btn" ms-click="show('contentnotice/noticelist')"
                   ms-class="on:visibleIndex=='contentnotice'">
                    <i class="icf-bookopened"></i> 公告板</a>
            </div>
        </div>
    </div>
</div>