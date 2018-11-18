<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
  <head>
    <%@include file="/common/meta.jsp" %>
    <script type="text/javascript" src="${staticWeb}/lib/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="${staticWeb}/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="${serverPath}/static/js/plugs/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="${staticWeb}/js/pagination.js?v=${resourceVer}"></script>
    <script type="text/javascript" src="${staticWeb}/js/satis/config.js?v=${resourceVer}"></script>
    <script type="text/javascript">
      Config.local.userId = '${loginUser.getId()}';
      Config.local.userName = '${loginUser.getName()}';
      Config.local.mobile = '${loginUser.getMobilePhone()}';
      Config.local.phone = ${imitatePhone};
      Config.local.serviceEnable = ${softPhoneServiceEnable};
      Config.local.serviceHost = '${softPhoneServiceHost}';
      Config.local.servicePort = '${softPhoneServicePort}';
      Config.local.serviceMethod = '${softPhoneServiceMethod}';
      Config.local.callCenterNewTaskPath = '${addTaskPath}'; // 呼叫中心 新建任务页面
    </script>
    <script type="text/javascript" src="${staticWeb}/js/satis/common.js?v=${resourceVer}"></script>
    <script type="text/javascript" src="${serverPath}/static/js/softphone.js?v=${resourceVer}"></script>
    <script type="text/javascript" src="${serverPath}/static/js/avalon/avalon.js" data-main="static/js/main.js?v=${resourceVer}"></script>

  </head>
  <body ms-controller="root">
    <!-- 遮罩 -->
    <div class="backdrop"></div>
    <div class="tips-box" id="tipsBox"></div>
    <div class="wrap">
      <%@include file="/common/header.jsp" %>
      <div ms-include-src="'views/callctrl/index.html'" data-include-rendered="renderCallctrl"></div>
      <div class="content2" ms-include-src="visibleIndex"></div>
    </div>
    <div class="cover on" id="basecover">
      <span class="loading">
        欢迎使用满意度调查<br/>
        正在初始化...</span>
    </div>
  </body>
</html>
