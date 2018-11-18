<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp"%>
<html>
    <head>
        <%@include file="/common/meta.jsp" %>
        <script type="text/javascript" src="${staticWeb}/lib/jquery-1.11.0.min.js"></script>
        <script type="text/javascript" src="${staticWeb}/lib/bootstrap.min.js"></script>
        <script type="text/javascript" src="${staticWeb}/lib/artTemplate.js"></script>
        <script type="text/javascript" src="${staticWeb}/js/cc/pagination.js?v=${resourceVer}"></script>
        <script type="text/javascript" src="${staticWeb}/js/cc/config.js?v=${resourceVer}"></script>
        <script type="text/javascript" src="${staticWeb}/js/cc/common.js?v=${resourceVer}"></script>
        <script type="text/javascript">
            Config.local.userId = '${loginUser.getId()}';
            Config.local.userName = '${loginUser.getName()}';
            Config.local.mobile = '${loginUser.getMobilePhone()}';
            Config.local.phone = ${imitatePhone};
            Config.local.serviceEnable = ${softPhoneServiceEnable};
            Config.local.serviceHost = '${softPhoneServiceHost}';
            Config.local.servicePort = '${softPhoneServicePort}';
            Config.local.serviceMethod = '${softPhoneServiceMethod}';
        </script>
        <script type="text/javascript" src="${serverPath}/static/js/softphone.js?v=${resourceVer}"></script>
        <script type="text/javascript" src="${serverPath}/static/js/avalon/avalon.js" data-main="${serverPath}/static/js/main.js?v=${resourceVer}"></script>

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

            <%-- 排行榜.呼入、呼出所属班组；班组名称：CALLCENTER_SORT$MANAGE --%>
            var groupClassNameText = '呼入组A', hasGroupClassOperation = 'all';

        </script>
    </head>
    <body ms-controller="root">
        <div class="tips-box" id="tipsBox"></div>
        <div class="wrap">
            <%@include file="/common/header.jsp" %>
            <div class="content" ms-visible="visibleIndex=='contenttask'" ms-include-src="src_contenttask"></div>
            <div class="content" ms-visible="visibleIndex=='contentreport'" ms-include-src="src_contentreport"></div>
            <div class="content" ms-visible="visibleIndex=='contentnotice'" ms-include-src="src_contentnotice"></div>
            <div class="content" ms-visible="visibleIndex=='contentsystem'" ms-include-src="src_contentsystem"></div>
            <div class="content" ms-visible="visibleIndex=='contentsort'" ms-include-src="src_contentsort"></div>
        </div>
        <div class="cover on" id="basecover">
            <span class="loading">
                欢迎使用CRM呼叫中心<br/>
                正在初始化...</span>
        </div>
        <!-- 遮罩 -->
        <div class="backdrop"></div>
        <script type="text/html" id="paginationtmpl">
            <ul>
                <li data-index="-1" {{if hasPrev}} class="disabled" {{
        /if}}>
                    <a href="javascript:">上一页</a>
                </li>
                {{each left}}
                <li data-index="{{$value.index}}">
                    <a href="javascript:">{{$value.index}}</a>
                </li>
            {{/each}}
            {{if hasLeft}}
                <li data-index="{{hasLeft}}">
                    <a href="javascript:">...</a>
                </li>
            {{/if}}
            {{each center}}
            <li data-index="{{$value.index}}" {{if $value.isCurrent}} class="active disabled" {{
        /if}}>
                <a href="javascript:">{{$value.index}}</a>
            </li>
        {{/each}}

        {{if hasRight}}
            <li data-index="{{hasRight}}">
                <a href="javascript:">...</a>
            </li>
        {{/if}}
        {{each right}}
        <li class="" data-index="{{$value.index}}">
            <a href="javascript:">{{$value.index}}</a>
        </li>
    {{/each}}
    <li data-index="+1" {{if hasNext}} class="disabled" {{
        /if}}>
        <a href="javascript:">下一页</a>
    </li>
</ul>
</script>
</body>
</html>
