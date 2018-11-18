<%@ page language="java" pageEncoding="UTF-8" %>
<div class="header">
  <div class="header-left">
    <a href="${serverPath}" class="logo" title="首页">
      <img src="${staticWeb}/img/logo.png">
      <em></em>
      <h1>CRM客服中心</h1>
    </a>
  </div>
  <div class="header-right">
    <div class="header-btns">
      <a class="h-btn header-user" href="javascript:void(0)"
         id="headerUser"><span>${loginUser.name}</span></a><span class="pipe"></span>
      <a class="h-btn" href="javascript:void(0)" id="headerMenu" title="管理菜单"><i class="icf-list"></i></a><span
            class="pipe"></span>
      <a class="h-btn" href="${logoutUrl}" id="headerOut"><i class="icf-tuichu"></i></a>
    </div>
    <div class="header-box" id="headerMenuBox">
      <ul>
        <li><a href="${adminWeb}" title="权限管理"><span>权限管理</span></a></li>
        <li><a href="${adminWeb}" title="人员管理"><span>人员管理</span></a></li>
      </ul>
    </div>
  </div>
  <div class="header-center">
    <div class="header-btns">
      <a id="btn_header_search" class="btn" href="${serverPath}/page/search" title="搜索"><i class="icf-search"></i>搜索</a>
      <a id="btn_header_house" class="btn" href="${serverPath}/page/houses" title="房屋"><i class="icf-home"></i>房屋</a>
      <a id="btn_header_customer" class="btn" href="${serverPath}/page/customers" title="客户"><i class="icf-person"></i>客户</a>

      <!-- 没有管家审批或法律纠纷户导入权限，不显示工作台 -->
      <security:isAllow privilege="WORK_SPACE">
      <a id="btn_header_workspace" class="btn" href="${serverPath}/page/workspace" title="工作台"><i class="icf-bookopened"></i>工作台</a>
      </security:isAllow>
    </div>
  </div>
</div>
