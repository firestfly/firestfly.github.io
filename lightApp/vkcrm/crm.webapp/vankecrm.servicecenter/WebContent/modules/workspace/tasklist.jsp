<!doctype html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
<body class="task_body">
<%@include file="/common/header.jsp" %>
<%
    // 判断是否有管家审批权限、法律纠纷户导入权限
    boolean hasPendingRole = SecurityContext.hasPermission("WORK_SPACE$PENDING_VIEW,WORK_SPACE$PENDING");
    boolean hasSpecialidentityImpRole = SecurityContext.hasPermission("WORK_SPACE$SPECIALIDENTITY_IMP");
    // 判断是否显示管家审批tab页
    if(hasPendingRole){
        request.setAttribute("GtasksPanelClass", "ly-panel GtasksPanel on");
    }else{
        request.setAttribute("GtasksPanelClass", "ly-panel GtasksPanel");
    }
    // 判断是否显示法律纠纷户导入
    if(!hasPendingRole && hasSpecialidentityImpRole){
        request.setAttribute("personComplainPanelClass", "ly-panel GtasksPanel on");
    }else{
        request.setAttribute("personComplainPanelClass", "ly-panel GtasksPanel");
    }
    boolean hasPermission=SecurityContext.hasPermission("CUSTOMER_EDIT_HIGH");
%>
<div class="content scrollable" id="scrollable" style="position:relative;">
    <div class="WorkbenchTab" id="WorkbenchTab">
        <ul>
            <security:isAllow privilege="WORK_SPACE$PENDING_VIEW,WORK_SPACE$PENDING">
                <li class="active">
                    <a href="javascript:">管家审批</a>
                </li>
            </security:isAllow>
            <security:isAllow privilege="WORK_SPACE$SPECIALIDENTITY_IMP">
                <li>
                    <a href="javascript:">法律纠纷户管理</a>
                </li>
            </security:isAllow>
            <li>
                <a href="javascript:">活动组织</a>
            </li>
        </ul>
    </div>
    <!--<div>-->

    <security:isAllow privilege="WORK_SPACE$PENDING_VIEW,WORK_SPACE$PENDING">
        <div class="${GtasksPanelClass}" id="GtasksPanel">
            <div class="ly-search-panel">
                <form class="form-inline text-center task_searchForm" id="task_searchForm">
                    <table>
                        <tr>
                            <td>
                                <span class="add-on">查询日期：</span>
                                <input id="steward-search-startTime" type="text" onClick="WdatePicker()" name="beginDate" class="span2 Wdate _begintime"/>
                            </td>
                            <td style="text-align:left; padding-left:0px;">
                                <span class="add-on">至</span>
                                <input id="steward-search-endTime" type="text" onClick="WdatePicker()" name="beginDate" class="span2 Wdate _begintime"/>
                            </td>
                            <td>
                                <span class="add-on">数据来源：</span>
                                <select id="steward-search-from" type="select" name="数据来源" class="span2">
                                </select>
                            </td>
                            <td>
                                <span class="add-on">类型：</span>
                                <select id="steward-search-operator" type="select" name="类型" class="span2">
                                </select>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-primary" id="task_searchBtn">查询</button>
                                    <button type="reset" class="btn btn-primary" id="task_resetBtn">重置</button>
                                </div>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
            <div class="panel" style="padding-top:0px;">
                <div class="panel-header manage-tab" id="manage-tab">
                    <ul>
                        <li class="active" id="nopass-list">
                            待办列表
                        </li>
                        <li id="pass-list">
                            已办列表
                        </li>
                    </ul>
                </div>
                <div class="panel-body" id="manage-panel-body" style="position:relative;">
                    <div id="customerTable" class="customerTable" style="min-height:auto;overflow:auto;">
                    </div>
                    <div class="pagination" id="TasksListPagination" style="position:relative;"></div>
                </div>
            </div>
        </div>
    </security:isAllow>

    <!-- 法律纠纷户管理 -->
    <security:isAllow privilege="WORK_SPACE$SPECIALIDENTITY_IMP">
        <div class="${personComplainPanelClass}" id="personComplainPanel">
            <script type="text/javascript">
                var importType = 'specialidentity';
            </script>
            <div class="content scrollable" style="padding-top: 0px;padding-bottom: 0px">
                <div class="ly-search-panel">
                    <form class="form-inline text-center" id="searchForm">
                        <table style="width: 100%">
                            <tr>
                                <td>
                                    <span class="add-on">上传用户 ：</span>
                                    <input type="text" name="createdBy" id="createdBy" maxlength="10"/>
                                </td>
                                <td>
                                    <span class="add-on">上传时间 ：</span>
                                    <input type="text" name="beginTime" id="beginTime" onClick="WdatePicker()"
                                           class="span2 Wdate _begintime"/>
                                </td>
                                <td>
                                    <span class="add-on">至</span>
                                    <input type="text" name="endTime" id="endTime" onClick="WdatePicker()"
                                           class="span2 Wdate _begintime"/>
                                </td>
                                <td>
                                    <div class="btn-group">
                                        <button type="button" onclick="loadNotPayCustomers()"
                                                id="selectNotPayCustomerImportCustomer" class="btn btn-primary">查询
                                        </button>
                                        <button type="reset" class="btn btn-primary" id="resetBtn">重置</button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
                <div class="panel" style="padding-top:0px;">
                    <div class="panel-header">
                        <div class="panel-title icf-bookopened">法律纠纷户导入列表</div>
                        <a class="btn btn-warning" href="#importCustomerModal" data-toggle="modal" style="float: right;margin-top: 5px">
                            <i class="icf-jianlidaochumoban"></i>导入</a>
                        <a class="btn btn-warning" data-toggle="modal" style="float: right;margin-top: 5px;margin-right: 10px" id="btnDownLoadTemplate">
                            <i class="icf-jianlidaochumoban"></i>模板下载</a>
                    </div>
                    <div class="panel-body" id="customer-panel-body" style="position:relative;">
                        <div id="lstNotPayCustomers"></div>
                        <div class="pagination" id="paginationNotPay"></div>
                    </div>
                </div>
            </div>


            <!--导入已交付客户对话框-->
            <div id="importCustomerModal" class="modal hide fade" tabindex="-1" role="dialog"
                 aria-labelledby="mergeModalLabel" aria-hidden="true">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h5>导入法律纠纷户</h5>
                </div>
                <div class="modal-body">
                    <div class="panel">
                        <form action="${serverPath}/page/customer/notPay/upload"
                              enctype="multipart/form-data"
                              target="downloadFileFrameName"
                              method="post"
                              id="frmUploadNotPayCustomer">
                            <div>
                                <input type="hidden" id="importType" name="importType" value="specialidentity"/>
                                上传文件：<input type="file" name="file_upload" id="file_upload"/>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn" data-dismiss="modal">关闭</button>
                    <button id="btnUploadNotPayCustomer" class="btn btn-primary">导入</button>
                </div>
            </div>

            <!--导入结果查询页面-->
            <script type="text/html" id="tmplNotPayCustomers">
                <table class="table table-hover crm-table">
                    <thead>
                    <tr>
                        <th class="alignCenter" style="width: 100px;">文件名称</th>
                        <th class="alignCenter" style="width: 80px;">上传用户</th>
                        <th class="alignCenter" style="width: 70px;">上传时间</th>
                        <th class="alignCenter" style="width: 70px;">处理状态</th>
                        <th class="alignCenter" style="width: 100px;">总数/成功/失败</th>
                        <th class="alignCenter" style="width: 120px;">处理信息</th>
                        <th class="alignCenter" style="width: 40px;">下载</th>
                    </tr>
                    </thead>
                    <tbody>
                    {{if pagination.totalSize == 0}}
                    <tr>
                        <td colspan="7" class="alignCenter">暂无数据</td>
                    </tr>
                    {{else}}
                    {{each list as value index}}
                    <tr>
                        <td class="alignLeft" title="{{value.fileShortName}}">
                            <div class="text-ellipsis" style="width: 13em;">{{value.fileShortName}}</div>
                        </td>
                        <td class="alignCenter">{{value.createdBy}}</td>
                        <td class="alignCenter">{{value.uploadTime}}</td>
                        <td class="alignCenter">{{value.operateStatus}}</td>
                        <td style="text-align: center;">{{value.totalNums}} / {{value.successNums}} / {{value.errorNums}}
                        </td>
                        <td class="alignLeft" title="{{value.operateResultInfo}}">
                            <div class="text-ellipsis" style="width: 13em;">{{value.operateResultInfo}}</div>
                        </td>
                        <td class="alignCenter">
                            {{if value.operateStatus == '已处理'}}
                            <a href="javascript:downNotPayResultExcelFile('{{value.pid}}')">下载</a>
                            {{/if}}
                        </td>
                    </tr>
                    {{/each}}
                    {{/if}}
                    </tbody>
                </table>
            </script>
            <div class="hidden" id="ajaxFormCallback"></div>
        </div>
    </security:isAllow>


    <div class="ly-panel" id="personCarePanel">
    </div>
    <div class="ly-panel" id="personOrderPanel">
    </div>
    <!--</div>-->
</div>
<!--修改任务弹出框-->
<div class="modal modal_edittask hide" id="modal_edittask">
    <div class="modal_wrap" style="width: 700px; max-height:500px">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4>修改信息</h4>
        </div>
        <div class="modal-body" id="ModalEditTaskBar" style="position:relative;">
        </div>
        <div class="modal-footer">
            <a href="javascript:" class="btn" id="Task_cancel" data-dismiss="modal" aria-hidden="true">关闭</a>
            <!-- <a href="javascript:" class="btn btn-primary" id="Edit_GiveUp">放弃</a> -->
            <a href="javascript:" class="btn btn-primary" id="Edit_OK" style="margin-right: 44px">确定</a>
        </div>
    </div>
</div>
<!-- 项目房屋选择弹出框 -->
<div class="modal hide fade" id="modal_housechoose" style="width:680px;margin-left:-340px;">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>房屋确认</h3>
    </div>
    <div class="modal-body" style="overflow:visible;">
        <select class="span2" id="housechoose_project" style="margin-bottom:10px;" disabled>
            <option>==正在加载管理中心==</option>
        </select>
        <!-- <div class="input-append">
            <input type="text" class="span2" id="housechoose_project" disabled>
            <span class="add-on icf-down" id="housechoose_projectclick"></span>
        </div> -->
        <div class="input-append">
            <input type="text" class="span3" id="housechoose_houseName" disabled>
            <span class="add-on icf-down" id="housechoose_houseclick"></span>
        </div>
        <input type="hidden" id="housechoose_projectId">
        <input type="hidden" id="housechoose_houseId">
        <input type="hidden" id="housechoose_customerId">
    </div>
    <div class="modal-footer">
        <a href="javascript:" class="btn" data-dismiss="modal">关闭</a>
        <a href="javascript:" class="btn btn-primary" id="housechoose_ok">确认</a>
    </div>
</div>
<script type="text/html" id="ModalEditTaskTemplate">
    <h1 class="task_housename" id="task_housename" data-id="{{basedata.houseRelation.houseId}}" data-pendingId="{{pendingdata.basic.pendingId}}">
        {{pendingdata.houseRelation[0] && pendingdata.houseRelation[0].houseName}}</h1>
    <div class="panel">
        <form class="form-inline text-center">
            <div class="edit-info" data-type="inputedit" edit-type="text">
                <table>
                    <tr>
                        <th>客户姓名：</th>
                        <td class="basedata" id="base_name" data-id="{{basedata.basic.id}}"
                            data-text="{{basedata.basic.fullName}}">
                            <div class="info-div">
                                <input type="text" value="{{basedata.basic.fullName}}" name="ConsumerName"
                                       class="info-input info-input-unedit" disabled="true"
                                       onBlur="EditVerify('base_name','notext')">
                            </div>
                        </td>
                        <security:isAllow privilege="WORK_SPACE$CUSTOMER_OPERATE_PERMISSION">
                            <td class="task_info_exchange">
                                <a href="javascript:" class="btn_exchange" title="更改"></a>
                            </td>
                        </security:isAllow>
                        <td class="tempdata" id="pending_name" data-text="{{pendingdata.basic.fullName}}"
                            data-id="{{pendingdata.basic.customerId}}">
                            <div class="info-div">
                                <input type="text" value="{{pendingdata.basic.fullName}}" name="ConsumerName"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <security:isAllow privilege="WORK_SPACE$CUSTOMER_OPERATE_PERMISSION">
                            <td class="edit-btnbar">
                                <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                                <a href="javascript:" class="btn-editinfo cencel">取消</a>
                            </td>
                        </security:isAllow>
                    </tr>
                </table>
            </div>
            <div class="edit-info" data-type="Sex" edit-type="check">
                <table>
                    <tr>
                        <th>性别：</th>
                        <td class="basedata" id="base_sex" data-text="{{basedata.basic.sexText}}"
                            data-code="{{basedata.basic.sex}}">
                            <div class="info-div">
                                {{basedata.basic.sexText}}
                            </div>
                        </td>
                        <td class="task_info_exchange">
                            <a href="javascript:" class="btn_exchange" title="更改"></a>
                        </td>
                        <td class="tempdata" data-text="{{pendingdata.basic.sexText}}"
                            data-code="{{pendingdata.basic.sex}}">
                            <div class="info-div">
                                {{pendingdata.basic.sexText}}
                            </div>
                        </td>
                        <td class="edit-btnbar">
                            <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                            <a href="javascript:" class="btn-editinfo cencel">取消</a>
                        </td>
                    </tr>
                </table>
                <div class="info_checkbar" id="SexBar">

                </div>
            </div>
            {{if hasEditPermission}}
            <div class="edit-info" data-type="certificateType" edit-type="check">
                <table>
                    <tr>
                        <th>证件类型：</th>
                        <td class="basedata" id="base_certificateType"
                            data-text="{{basedata.basic.certificateTypeText}}"
                            data-code="{{basedata.basic.certificateType}}">
                            <div class="info-div">
                                {{basedata.basic.certificateTypeText}}
                            </div>
                        </td>
                        <security:isAllow privilege="WORK_SPACE$CUSTOMER_OPERATE_PERMISSION">
                            <td class="task_info_exchange">
                                <a href="javascript:" class="btn_exchange" title="更改"></a>
                            </td>
                        </security:isAllow>
                        <td class="tempdata" data-text="{{pendingdata.basic.certificateTypeText}}"
                            data-code="{{pendingdata.basic.certificateType}}">
                            <div class="info-div">
                                {{pendingdata.basic.certificateTypeText}}
                            </div>
                        </td>
                        <security:isAllow privilege="WORK_SPACE$CUSTOMER_OPERATE_PERMISSION">
                            <td class="edit-btnbar">
                                <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                                <a href="javascript:" class="btn-editinfo cencel">取消</a>
                            </td>
                        </security:isAllow>
                    </tr>
                </table>
                <div class="info_checkbar">
                    <select value="身份证" name="certificateType" class="info-select" id="certificateTypeBar">

                    </select>
                </div>
            </div>
            {{/if}}
            {{if hasEditPermission}}
            <div class="edit-info" data-type="inputedit" edit-type="text">
                <table>
                    <tr>
                        <th>证件号码：</th>
                        <td class="basedata" id="base_certificateId" data-text="{{basedata.basic.certificateId}}">
                            <div class="info-div">
                                <input type="text" value="{{basedata.basic.certificateId}}" name="certificateId"
                                       class="info-input info-input-unedit" disabled="true"
                                       onBlur="EditVerify('base_certificateId','IDNumber')">
                            </div>
                        </td>
                        <security:isAllow privilege="WORK_SPACE$CUSTOMER_OPERATE_PERMISSION">
                            <td class="task_info_exchange">
                                <a href="javascript:" class="btn_exchange" title="更改"></a>
                            </td>
                        </security:isAllow>
                        <td class="tempdata" data-text="{{pendingdata.basic.certificateId}}">
                            <div class="info-div">
                                <input type="text" value="{{pendingdata.basic.certificateId}}" name="certificateId"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <security:isAllow privilege="WORK_SPACE$CUSTOMER_OPERATE_PERMISSION">
                            <td class="edit-btnbar">
                                <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                                <a href="javascript:" class="btn-editinfo cencel">取消</a>
                            </td>
                        </security:isAllow>
                    </tr>
                </table>
            </div>
            {{/if}}
            <div class="edit-info" data-type="inputedit" edit-type="text">
                <table>
                    <tr>
                        <th>主用手机：</th>
                        <td class="basedata" id="base_mainMobile" data-text="{{basedata.basic.mainMobile}}">
                            <div class="info-div">
                                <input type="text" value="{{basedata.basic.mainMobile}}" name="mainMobile"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="task_info_exchange">
                            <a href="javascript:" class="btn_exchange" title="更改"></a>
                        </td>
                        <td class="tempdata" data-text="{{pendingdata.basic.mainMobile}}">
                            <div class="info-div">
                                <input type="text" value="{{pendingdata.basic.mainMobile}}" name="mainMobile"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="edit-btnbar">
                            <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                            <a href="javascript:" class="btn-editinfo cencel">取消</a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="edit-info" data-type="inputedit" edit-type="text">
                <table>
                    <tr>
                        <th>备用手机：</th>
                        <td class="basedata" id="base_standbyMobile" data-text="{{basedata.basic.standbyMobile}}">
                            <div class="info-div">
                                <input type="text" value="{{basedata.basic.standbyMobile}}" name="standbyMobile"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="task_info_exchange">
                            <a href="javascript:" class="btn_exchange" title="更改"></a>
                        </td>
                        <td class="tempdata" data-text="{{pendingdata.basic.standbyMobile}}">
                            <div class="info-div">
                                <input type="text" value="{{pendingdata.basic.standbyMobile}}" name="standbyMobile"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="edit-btnbar">
                            <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                            <a href="javascript:" class="btn-editinfo cencel">取消</a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="edit-info" data-type="inputedit" edit-type="text">
                <table>
                    <tr>
                        <th>住宅电话：</th>
                        <td class="basedata" id="base_homeTel" data-text="{{basedata.basic.homeTel}}">
                            <div class="info-div">
                                <input type="text" value="{{basedata.basic.homeTel}}" name="homeTel"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="task_info_exchange">
                            <a href="javascript:" class="btn_exchange" title="更改"></a>
                        </td>
                        <td class="tempdata" data-text="{{pendingdata.basic.homeTel}}">
                            <div class="info-div">
                                <input type="text" value="{{pendingdata.basic.homeTel}}" name="homeTel"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="edit-btnbar">
                            <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                            <a href="javascript:" class="btn-editinfo cencel">取消</a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="edit-info" data-type="inputedit" edit-type="text">
                <table>
                    <tr>
                        <th>办公电话：</th>
                        <td class="basedata" id="base_officeTel" data-text="{{basedata.basic.officeTel}}">
                            <div class="info-div">
                                <input type="text" value="{{basedata.basic.officeTel}}" name="homeTel"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="task_info_exchange">
                            <a href="javascript:" class="btn_exchange" title="更改"></a>
                        </td>
                        <td class="tempdata" data-text="{{pendingdata.basic.officeTel}}">
                            <div class="info-div">
                                <input type="text" value="{{pendingdata.basic.officeTel}}" name="homeTel"
                                       class="info-input info-input-unedit" disabled="true">
                            </div>
                        </td>
                        <td class="edit-btnbar">
                            <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                            <a href="javascript:" class="btn-editinfo cencel">取消</a>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="edit-info" data-type="CustomerHobbies" edit-type="check">
                <table>
                    <tr>
                        <th>兴趣爱好：</th>
                        <td class="basedata" id="base_hobbies" data-text="{{basedata.hobbyTo}}"
                            data-code="{{each basedata.hobby}}{{$value.contentId}},{{/each}}">
                            <div class="info-div">
                                {{basedata.hobbyTo}}
                            </div>
                        </td>
                        <td class="task_info_exchange">
                            <a href="javascript:" class="btn_exchange" title="更改"></a>
                        </td>
                        <td class="tempdata" data-text="{{pendingdata.hobbyTo}}"
                            data-code="{{each pendingdata.hobby}}{{$value.contentId}},{{/each}}">
                            <div class="info-div">
                                {{pendingdata.hobbyTo}}
                            </div>
                        </td>
                        <td class="edit-btnbar">
                            <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                            <a href="javascript:" class="btn-editinfo cencel">取消</a>
                        </td>
                    </tr>
                </table>
                <div class="info_checkbar" id="CustomerHobbiesBar">

                </div>
            </div>
            <div class="edit-info" data-type="HouseCustomerRelationType" edit-type="check">
                <table>
                    <tr>
                        <th>与房屋关系：</th>
                        <td class="basedata" id="base_houseRelation" data-text="{{basedata.houseRelationTo}}"
                            data-code="{{each basedata.houseRelation}}{{$value.relationType}},{{/each}}">
                            <div class="info-div">
                                {{basedata.houseRelationTo}}
                            </div>
                        </td>
                        <td class="task_info_exchange">
                            <a href="javascript:" class="btn_exchange" title="更改"></a>
                        </td>
                        <td class="tempdata" data-text="{{pendingdata.houseRelationTo}}"
                            data-code="{{each pendingdata.houseRelation}}{{$value.relationType}},{{/each}}">
                            <div class="info-div">
                                {{pendingdata.houseRelationTo}}
                            </div>
                        </td>
                        <td class="edit-btnbar">
                            <a href="javascript:" class="btn-editinfo edit editstate">编辑</a>
                            <a href="javascript:" class="btn-editinfo cencel">取消</a>
                        </td>
                    </tr>
                </table>
                <div class="info_checkbar" id="HouseCustomerRelationBar">

                </div>
            </div>
            <div class="edit-info" data-type="" edit-type="">
                <table>
                    <tr>
                        <th id="base_from">数据来源：</th>
                        <td class="basedata">
                            <div class="info-div">
                                {{pendingdata.basic.from}}
                            </div>
                        </td>
                        <td>
                        </td>
                        <td class="tempdata">
                        </td>
                        <td class="edit-btnbar">
                        </td>
                    </tr>
                </table>
                <div class="info_checkbar" id="HouseCustomerRelationBar">
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 任务列表模板 -->
<script type="text/html" id="taskListTemplate">
    <table class="task_card">
        <thead>
        <tr>
            <th>
                项目名称
            </th>
            <th>
                相关房屋
            </th>
            <th>
                提交时间
            </th>
            <th>
                客户姓名
            </th>
            <th>
                类型
            </th>
            <th>
                数据来源
            </th>
            <th>
                操作
            </th>
        </tr>
        </thead>
        <tbody id="tasklistbar">
        {{if list && list.length > 0}}
        {{each list}}
        <tr data-id="{{$value.houseName}}">
            <td>
                {{$value.projectName}}
            </td>
            <td class="houseName">
                {{$value.houseName}}
            </td>
            <td>
                {{$value.createTime}}
            </td>
            <td>
                {{$value.fullName}}
            </td>
            <td>
                {{$value.operator}}
            </td>
            <td>
                {{$value.from}}
            </td>
            <td class="alignCenter">
                {{if stata && stata.length}}
                <a href="javascript:" class="task_btn">已办</a>
                {{else}}
                <a href="javascript:" class="task_btn task_btn_edit j_handle"
                   data-houseId="{{$value.houseId}}"
                   data-customerId="{{$value.customerId}}"
                   data-crmCustomerId="{{$value.crmCustomerId}}">处理</a>
                <a href="javascript:" class="task_btn task_btn_add j_abandon"
                   data-customerId="{{$value.customerId}}">放弃</a>
                {{/if}}
            </td>
        </tr>
        {{/each}}
        {{else}}
        <tr>
            <td colspan= "7" align="center">
                暂无数据
            </td>
        </tr>
        {{/if}}

        </tbody>
    </table>
</script>
<!-- 查询条件数据来源模板 -->
<script type="text/html" id="SearchFromTemplate">
    {{each from}}
    <option {{if $value.code == "1"}}selected="selected"{{/if}} data-code="{{$value.code}}">
    {{$value.value}}
    </option>
    {{/each}}
</script>
<!-- 查询条件类型模板 -->
<script type="text/html" id="SearchOperatorTemplate">
    <option select="selected">全部</option>
    {{each operator}}
    <option data-code="{{$value.code}}">
        {{$value.value}}
    </option>
    {{/each}}
</script>
<!-- 性别模板 -->
<script type="text/html" id="EditSexTemplate">
    {{each Sex}}
    <label class="radio inline">
        <input type="radio" name="Sex" value="{{$value.value}}">
        {{$value.value}}
    </label>
    {{/each}}
</script>
<!-- 证件类型模板 -->
<script type="text/html" id="EditcertificateTypeTemplate">
    <option select="selected">
        ==请选择==
    </option>
    {{each CustomerCertificateType}}
    <option data-code="{{$value.code}}">
        {{$value.value}}
    </option>
    {{/each}}
</script>
<!--  兴趣爱好模板 -->
<script type="text/html" id="CustomerHobbiesBarTemplate">
    {{each CustomerHobbies}}
    <label class="checkbox inline" style="width:120px;">
        <input type="checkbox" name="CustomerHobbies" value="{{$value.value}}" data-code="{{$value.code}}">
        {{$value.value}}
    </label>
    {{/each}}
</script>
<!-- 与业主关系模板 -->
<script type="text/html" id="EditCustomerRelationTypeTemplate">
    {{each CustomerRelationType}}
    <label class="radio inline">
        <input type="radio" name="CustomerRelationType" value="{{$value.value}}" data-code="{{$value.code}}">
        {{$value.value}}
    </label>
    {{/each}}
</script>
<!-- 与房屋关系模板 -->
<script type="text/html" id="EditHouseCustomerRelationTypeTemplate">
    {{each HouseCustomerRelationType}}
    <label class="checkbox inline">
        <input type="checkbox" name="HouseCustomerRelationType" value="{{$value.value}}" data-code="{{$value.code}}">
        {{$value.value}}
    </label>
    {{/each}}
</script>
<%@include file="/common/footer.jsp" %>
<script type="text/javascript">
    $(function () {
        $("#btn_header_workspace").addClass("on");
    });
    var hasEditPermission = <%=hasPermission%>;
</script>
<script type="text/javascript" src="${staticWeb}/lib/jquery.form.min.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/sc/import.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/sc/workspace.js?v=${javaScriptVersion}"></script>
<iframe id="downloadFileFrameID" name="downloadFileFrameName" style="display:none" onload="downloadFileFrameOnload()"></iframe>
<iframe id="downloadFileFrameID1" name="downloadFileFrameName1" style="display:none"></iframe>
</body>
</html>