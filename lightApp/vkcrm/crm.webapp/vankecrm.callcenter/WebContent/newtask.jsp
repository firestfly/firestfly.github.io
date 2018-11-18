<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>
<head>
    <%@include file="/common/meta.jsp" %>
    <script type="text/javascript" src="${staticWeb}/lib/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="${staticWeb}/lib/bootstrap.min.js"></script>
    <script type="text/javascript" src="${staticWeb}/lib/artTemplate.js"></script>
    <script type="text/javascript" src="${staticWeb}/js/cc/pagination.js"></script>
    <script type="text/javascript" src="${staticWeb}/js/cc/config.js"></script>
    <script type="text/javascript" src="${staticWeb}/js/cc/common.js"></script>
    <script type="text/javascript">
        Config.local.userId = '${loginUser.getId()}';
        Config.local.userName = '${loginUser.getName()}';
        Config.local.mobile = '${loginUser.getMobilePhone()}';
        Config.local.phone = ${imitatePhone};
        Config.local.serviceEnable = ${softPhoneServiceEnable};
        Config.local.serviceHost = '${softPhoneServiceHost}';
        Config.local.servicePort = '${softPhoneServicePort}';
        Config.local.serviceMethod = '${softPhoneServiceMethod}';
        window.SIMPLEMODEL = true;//新增任务页面
    </script>
    <script type="text/javascript" src="${serverPath}/static/js/softphone.js"></script>
    <script type="text/javascript" src="${serverPath}/static/js/avalon/avalon.js" data-main="${serverPath}/static/js/main.js"></script>

    <script type="text/javascript">

        <%-- 公告列表.公告创建 CALLCENTER_NOTICE_LIST$CREATE --%>
        var hasCallcenterNoticeListCreate = false;
        <%-- 公告列表.公告审批 CALLCENTER_NOTICE_LIST$APPROVE --%>
        var hasCallcenterNoticeListApproveRole = false;
        <%-- 公告列表.公告编辑 CALLCENTER_NOTICE_LIST$EDIT --%>
        var hasCcallcenterNoticeListEditRole = false;
        <%-- 公告列表.公告关闭 CALLCENTER_NOTICE_LIST$CLOSE --%>
        var hasCcallcenterNoticeListCloseRole = false;

        <%-- 任务详情.任务定责 CALLCENTER_TASK_DETAIL$RESPONSIBLE --%>
        var hasCcallcenterTaskDetailResponsibleRole = false;
        <%-- 任务详情.任务评价 CALLCENTER_TASK_DETAIL$EVALUATION --%>
        var hasCcallcenterTaskDetailEvaluationRole = false;
        <%-- 任务详情.任务取消/结束：CALLCENTER_TASK_DETAIL$CANCEL --%>
        var hasCallcenterTaskDetailCancel = false;

        <%-- 话务查询列表.原因采集：CALLCENTER_TELCALLRECORD$REASON_CREATE --%>
        var hasCallcenterTelcallrecordReasonCreate = false;
        <%-- 话务查询列表.下载录音：CALLCENTER_TELCALLRECORD$DOWNLOAD_SOUND --%>
        var hasCallcenterTelcallrecordDownloadSound = false;

        <%-- 首页.超时任务按钮：CALLCENTER_INDEX$TASK_ABNORMAL --%>
        var hasCallcenterIndexTaskAbnormal = false;
        <%-- 首页.系统管理按钮：CALLCENTER_INDEX$MANAGE --%>
        var hasCallcenterIndexManage = false;


        <%-- 公告列表.公告创建 CALLCENTER_NOTICE_LIST$CREATE --%>
        <security:isAllow privilege="CALLCENTER_NOTICE_LIST$CREATE">
        hasCallcenterNoticeListCreate = true;
        </security:isAllow>
        <%-- 公告列表.公告审批 CALLCENTER_NOTICE_LIST$APPROVE --%>
        <security:isAllow privilege="CALLCENTER_NOTICE_LIST$APPROVE">
        hasCallcenterNoticeListApproveRole = true;
        </security:isAllow>
        <%-- 公告列表.公告编辑 CALLCENTER_NOTICE_LIST$EDIT --%>
        <security:isAllow privilege="CALLCENTER_NOTICE_LIST$EDIT">
        hasCcallcenterNoticeListEditRole = true;
        </security:isAllow>
        <%-- 公告列表.公告关闭 CALLCENTER_NOTICE_LIST$CLOSE --%>
        <security:isAllow privilege="CALLCENTER_NOTICE_LIST$CLOSE">
        hasCcallcenterNoticeListCloseRole = true;
        </security:isAllow>

        <%-- 话务查询列表.原因采集：CALLCENTER_TELCALLRECORD$REASON_CREATE --%>
        <security:isAllow privilege="CALLCENTER_TASK_DETAIL$RESPONSIBLE">
        hasCcallcenterTaskDetailResponsibleRole = true;
        </security:isAllow>
        <%-- 话务查询列表.下载录音：CALLCENTER_TELCALLRECORD$DOWNLOAD_SOUND --%>
        <security:isAllow privilege="CALLCENTER_TASK_DETAIL$EVALUATION">
        hasCcallcenterTaskDetailEvaluationRole = true;
        </security:isAllow>
        <%-- 任务详情.任务取消：CALLCENTER_TASK_DETAIL$CANCEL --%>
        <security:isAllow privilege="CALLCENTER_TASK_DETAIL$CANCEL">
        hasCallcenterTaskDetailCancel = true;
        </security:isAllow>

        <%-- 话务查询列表.原因采集：CALLCENTER_TELCALLRECORD$REASON_CREATE --%>
        <security:isAllow privilege="CALLCENTER_TELCALLRECORD$REASON_CREATE">
        hasCallcenterTelcallrecordReasonCreate = true;
        </security:isAllow>
        <%-- 话务查询列表.下载录音：CALLCENTER_TELCALLRECORD$DOWNLOAD_SOUND --%>
        <security:isAllow privilege="CALLCENTER_TELCALLRECORD$DOWNLOAD_SOUND">
        hasCallcenterTelcallrecordDownloadSound = true;
        </security:isAllow>

        <%-- 首页.超时任务按钮：CALLCENTER_INDEX$TASK_ABNORMAL --%>
        <security:isAllow privilege="CALLCENTER_INDEX$TASK_ABNORMAL">
        hasCallcenterIndexTaskAbnormal = true;
        </security:isAllow>
        <%-- 首页.系统管理按钮：CALLCENTER_INDEX$MANAGE --%>
        <security:isAllow privilege="CALLCENTER_INDEX$MANAGE">
        hasCallcenterIndexManage = true;
        </security:isAllow>

    </script>
</head>
<body ms-controller="root">
<div class="tips-box" id="tipsBox"></div>
<div class="wrap">
    <div class="header">
        <div class="header-top">
            <div class="header-left">
                <div class="logo">
                    <img src="${staticWeb}/img/logo.png">
                    <em></em>
                    <h1>CRM呼叫中心</h1>
                </div>
            </div>
            <div class="header-center">
            </div>
        </div>
    </div>
    <div class="content2" ms-include-src="src_contentnewtask"></div>
</div>
<div class="cover on" id="basecover">
		<span class="loading">
		欢迎使用CRM呼叫中心<br/>
		正在初始化...</span>
</div>
</body>
</html>
