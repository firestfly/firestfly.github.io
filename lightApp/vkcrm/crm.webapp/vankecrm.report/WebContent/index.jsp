<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>
<html>
  <head>
    <%@include file="/common/meta.jsp" %>
    <script type="text/javascript" src="static/dep/jquery/jquery.js"></script>
    <script type="text/javascript" src="static/dep/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="static/dep/pagination/pagination.js"></script>
    <script type="text/javascript" src="static/dep/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="static/js/config.js"></script>
    <script type="text/javascript" src="static/js/common.js"></script>
    <script type="text/javascript" src="static/dep/avalon/avalon.js" data-main="static/js/main"></script>
  </head>
  <body ms-controller="root">
    <div class="tips-box" id="tipsBox"></div>
    <div class="wrap">
      <%@include file="/common/header.jsp" %>
      <!-- 内容页面 -->
      <div class="content">
        <!-- 左侧树 -->
        <div class="left" id="left">
          <div class="sidebar-handle">
            <span>报表</span>
            <i class="icon iconfont">&#xe603;</i>
          </div>
          <div class="accordion" id="accordion2">
            <div class="accordion-group">
              <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse1">
                  <i class="handle item"></i>
                  基础信息报表
                </a>
              </div>
              <div id="collapse1" class="accordion-body collapse">
                <div class="accordion-inner">
                  <ul>
                    <li data-type="base">基础信息统计报表</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-group hide">
              <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse2">
                  <i class="handle item"></i>
                  查询信息报表
                </a>
              </div>
              <div id="collapse2" class="accordion-body collapse">
                <div class="accordion-inner">
                  <ul>
                    <li data-type="customer">客户信息查询</li>
                    <li data-type="car">车辆信息查询</li>
                    <li data-type="pet">宠物信息查询</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-group hide">
              <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse3">
                  <i class="handle item"></i>
                  质量检查报表
                </a>
              </div>
              <div id="collapse3" class="accordion-body collapse">
                <div class="accordion-inner">
                  <ul>
                    <li data-type="quality">客户数据质量检查报表</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-group hide">
              <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse4">
                  <i class="handle item"></i>
                  修改记录报表
                </a>
              </div>
              <div id="collapse4" class="accordion-body collapse">
                <div class="accordion-inner">
                  <ul>
                    <li data-type="cusupdate">客户修改记录报表</li>
                    <li data-type="grupdate">客房关系修改记录报表</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-group hide">
              <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse5">
                  <i class="handle item"></i>
                  呼叫中心报表
                </a>
              </div>
              <div id="collapse5" class="accordion-body collapse">
                <div class="accordion-inner">
                  <ul>
                    <li data-type="callintask">呼入-任务清单报表</li>
                    <li data-type="callinrecord">呼入-话务清单报表</li>
                    <li data-type="callincharts">呼入-呼入组排行榜</li>
                    <li data-type="calloutdetail">外呼-外呼工作明细</li>
                    <li data-type="calloutcharts">外呼-外呼组排行榜</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="accordion-group hide">
              <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse6">
                  <i class="handle item"></i>
                  满意度调查报表
                </a>
              </div>
              <div id="collapse6" class="accordion-body collapse">
                <div class="accordion-inner">
                  <ul>
                    <li data-type="sfdetail">满意度明细表</li>
                    <li data-type="sfamass">进度积累</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- add by linyuli -->
            <div class="accordion-group">
              <div class="accordion-heading">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse7">
                  <i class="handle item"></i>
                  项目报表
                </a>
              </div>
              <div id="collapse7" class="accordion-body collapse">
                <div class="accordion-inner">
                  <ul>
                    <li data-type="prjdetail">任务明细报表</li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- add end -->
        </div>
      </div>
      <!-- 右侧页面 -->
      <div class="right">
        <!-- 基础信息报表 - 基础信息统计报表 -->
        <div class="pagecontent" id="src_base" ms-visible="visibleIndex=='base'" ms-include-src="src_base"></div>

        <!-- 查询信息报表 - 客户信息查询 -->
        <div class="pagecontent" id="src_customer" ms-visible="visibleIndex=='customer'" ms-include-src="src_customer"></div>
        <!-- 查询信息报表 - 车辆信息查询 -->
        <div class="pagecontent" id="src_car" ms-visible="visibleIndex=='car'" ms-include-src="src_car"></div>
        <!-- 查询信息报表 - 宠物信息查询 -->
        <div class="pagecontent" id="src_pet" ms-visible="visibleIndex=='pet'" ms-include-src="src_pet"></div>

        <!-- 质量检查报表 - 客户数据质量检查报表 -->
        <div class="pagecontent" id="src_quality" ms-visible="visibleIndex=='quality'" ms-include-src="src_quality"></div>

        <!-- 修改纪录报表 - 客户修改纪录报表 -->
        <div class="pagecontent" id="src_cusupdate" ms-visible="visibleIndex=='cusupdate'" ms-include-src="src_cusupdate"></div>
        <!-- 修改纪录报表 - 客房关系修改纪录报表 -->
        <div class="pagecontent" id="src_grupdate" ms-visible="visibleIndex=='grupdate'" ms-include-src="src_grupdate"></div>

        <!-- 呼叫中心报表 - 呼入-任务清单报表 -->
        <div class="pagecontent" id="src_callintask" ms-visible="visibleIndex=='callintask'" ms-include-src="src_callintask"></div>

        <!-- 呼叫中心报表 - 呼入-话务清单报表 -->
        <div class="pagecontent" id="src_callinrecord" ms-visible="visibleIndex=='callinrecord'" ms-include-src="src_callinrecord"></div>

        <!-- 呼叫中心报表 - 呼入-呼入组排行榜 -->
        <div class="pagecontent" id="src_callincharts" ms-visible="visibleIndex=='callincharts'" ms-include-src="src_callincharts"></div>

        <!-- 呼叫中心报表 - 外呼-外呼工作明细 -->
        <div class="pagecontent" id="src_calloutdetail" ms-visible="visibleIndex=='calloutdetail'" ms-include-src="src_calloutdetail"></div>

        <!-- 呼叫中心报表 - 外呼-外呼组排行榜 -->
        <div class="pagecontent" id="src_calloutcharts" ms-visible="visibleIndex=='calloutcharts'" ms-include-src="src_calloutcharts"></div>

        <!-- 呼叫中心报表 - 满意度明细表 -->
        <div class="pagecontent" id="src_sfdetail" ms-visible="visibleIndex=='sfdetail'" ms-include-src="src_sfdetail"></div>

        <!-- 呼叫中心报表 - 进度积累 -->
        <div class="pagecontent" id="src_sfamass" ms-visible="visibleIndex=='sfamass'" ms-include-src="src_sfamass"></div>

        <!-- 项目报表 - 事件细明 -->
        <div class="pagecontent" id="src_prjdetail" ms-visible="visibleIndex=='prjdetail'" ms-include-src="src_prjdetail"></div>
      </div>
    </div>
  </div>
</body>
</html>
