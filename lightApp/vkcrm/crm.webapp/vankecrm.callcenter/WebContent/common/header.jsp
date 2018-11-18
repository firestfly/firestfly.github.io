<%@ page language="java" pageEncoding="UTF-8"%>

<div class="header">
    <div class="header-top">
        <div class="header-left">
            <div class="logo">
                <img src="${staticWeb}/img/logo.png">
                    <em></em>

                    <h1>CRM呼叫中心</h1>
                </div>
            </div>
            <div class="header-right">
                <div class="header-btns">
                    <a class="h-btn header-user">
                        <i class="icf-service"></i>
                        <span>${loginUser.getName()}</span>
                    </a>
                    <span class="pipe"></span>
                    <a class="h-btn" ms-click="headerboxToggle">
                        <i class="icf-list"></i>
                    </a>
                    <span class="pipe"></span>
                    <a class="h-btn" href="${logoutUrl}">
                        <i class="icf-logout"></i>
                    </a>
                </div>
                <div class="header-box" ms-class="on:headerboxVisible">
                    <ul>
                        <li>
                            <a href="${adminWeb}">
                                <span>权限管理</span>
                            </a>
                        </li>
                        <li>
                            <a href="${adminWeb}">
                                <span>人员管理</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="header-center">
                <div class="header-btns">
                    <a ms-click="contentGo('contenttask')" class="btn" ms-class="on:visibleIndex=='contenttask'">
                        <i class="icf-home"></i>
                        工作台</a>
                    <a class="btn" ms-click="eventAbnormalTask" ms-if="ctrl.abnormal">
                        <i class="icf-task"></i>超时任务<em class="badge badge-num" ms-text="abnormal.count"></em>
                    </a>
                    <a ms-click="contentGo('contentreport')" class="btn" ms-class="on:visibleIndex=='contentreport'">
                        <i class="icf-call"></i>
                        话务报表</a>
                    <a ms-click="contentGo('contentnotice')" class="btn" ms-class="on:visibleIndex=='contentnotice'">
                        <i class="icf-person"></i>
                        通知中心<em class="badge badge-num" ms-text="notification.count"></em>
                    </a>
                    <a ms-click="contentGo('contentsystem')" class="btn" ms-class="on:visibleIndex=='contentsystem'" ms-if="ctrl.systemmanage">
                        <i class="icf-setting"></i>
                        系统管理</a>
                    <a ms-click="contentGo('contentsort')" class="btn" ms-class="on:visibleIndex=='contentsort'">
                        <i class="icf-setting"></i>
                        排行榜</a>
                </div>
            </div>
        </div>
        <div ms-include-src="'views/callctrl/index.html'" data-include-rendered="callctrl_rendered" data-include-replace='true'>
            <span>控件加载中...</span>
        </div>
    </div>
