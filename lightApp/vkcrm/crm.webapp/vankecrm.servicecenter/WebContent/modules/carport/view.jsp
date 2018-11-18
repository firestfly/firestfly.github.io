<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>
<html>
<head>
    <%@include file="/common/meta.jsp"%>
    <title>车位信息</title>
</head>
<style type="text/css">
    .table-list td{
        text-align:center;
        vertical-align:middle;
    }
    .bi-info-top .span5 > h4{
        line-height:60px;
        margin:0;
    }
    .bi-info-top .span7{
        line-height:80px;
    }

    .panel .panel-body{
        padding:0px;
    }

    /****************返回按钮****************/
    .dtn-icon-back{
        border-right:1px solid #dfe0e4;
        float:left;
        width:60px;
    }

    .dtn-btnbox-right{
        text-align:right;
        margin:5px 5px 0 0;
    }

    /****************表格样式****************/
    .panel .panel-hide{
        padding:0px;
    }
    .table{
        margin:8px 0;
    }
    td b{
        font-weight:normal;
    }
    /****************订阅关系样式****************/
    #TakeRelationBox a.active{
        background: #cecece;
    }
    #houserTitle {
        float: left;
        padding: 0 10px;
    }
    #houserTitle h4 {
        line-height: 48px;
        font-weight: normal;
        margin: 0px;
    }
</style>

<body>
<div class="wrap">
    <%@include file="/common/header.jsp" %>
    <script>
        var hasEditCarportPermission=false;
        <security:isAllow privilege="TREE_CARPORT_EDIT">
        hasEditCarportPermission =true;
        console.log(hasEditCarportPermission);
        </security:isAllow>
    </script>
    <div class="content">
        <div class="ly-right">
            <div class="bi-relation-btns">
                <security:isAllow privilege="HOUSE_NUW_CUSTOMER"><a
                        href="${serverPath}/page/carport/${carportId}/customer" class="bi-relation-btn icf-add"
                        id="addCustomer">
                    新增客户</a></security:isAllow>
                <a href="#" class="bi-relation-btn icf-time" id="ownerHistory_showbtn"> 历史客户</a>
            </div>
            <div class="bi-history" id="ownerHistory_bar">
                <div class="bi-history-header">
                    <i class="icf-Go" id="ownerHistory_close"></i> 历史客户
                </div>
                <div class="bi-history-body">
                    <ul id="ownerHistory_list">

                    </ul>
                </div>
            </div>
            <div class="bi-house">
                <div>
                    <div class="bi-owner" id="ownerHouserRelation_list">
                    </div>
                    <div class="bi-relation">
                        <ul id="ownerRelation_list">
                            <li>
                                <div class="relation" data-id="{{$value.details.customerId}}">
                                        <a href="javascript:" title="删除" class="relation-del" data-id="{{$value.details.customerId}}"></a>
                                    <div class="relation-img" data-id="{{$value.details.customerId}}" title="查看详情">
                                        <img src="${staticWeb}/img/sc/user.png">
                                    </div>
                                    <div class="relation-center">
                                        <div class="relation-name">
                                            {{$value.details.owner}}
                                        </div>
                                        <div class="relation-phone">
                                            {{$value.details.mainMobile}}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="ly-center2">
            <div class="detail-nav">
                <a href="javascript:history.go(-1);" title="返回">
                    <i class="icf-back"></i>
                </a>
                <span id="carportTitle"></span>
            </div>
            <div class="detail-btn-group">
                <a href="javascript:" class="btn"><span class="icf-wuyefei co-green"></span> 物业费 未知</a>
                <a href="javascript:" class="btn" id="taskPercent"><span class="icf-renwu co-deepCyan"></span> 任务 0 / 0</a>
                <%--<security:isAllow privilege="HOUSE_TRANSFER">--%>
                    <%--&lt;%&ndash;<a href="javascript:" class="btn co-blue" id="btn_transferhouse"><i class="icf-wenben"></i>车位过户</a>&ndash;%&gt;--%>
                <%--</security:isAllow>--%>
            </div>
            <div class="detail-content">
                <div class="panel table-layout" id="infoPanel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <span class="icf-page"></span>
                            基本信息
                        </div>
                        <div class="panel-header-right">
                            <security:isAllow privilege="HOUSE_EDIT">
                                <a class="co-green" href="#" id="btn_carportStatus">修改车位信息</a>
                            </security:isAllow>&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                    <div id="infoContainer">
                    </div>
                    <%--<div class="panel-footer">--%>
                    <%--<span class="more-info" id="btnDetailMore"></span>--%>
                    <%--</div>--%>
                </div>
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <i class="icf-bookopened"></i>订阅关系
                        </div>
                        <div class="panel-header-right" id="TakeRelationBox">
                            <a class="btn active" order="0" href="javascript:"><i
                                    class="icf-iconbuildingalt"></i>物业服务</a>
                            <a class="btn" order="1" href="javascript:"><i class="icf-wuyefei"></i>物业费</a>
                            <a class="btn" order="2" href="javascript:"><i class="icf-gudingzichan"></i>资产管家</a>
                            <a class="btn" order="3" href="javascript:"><i class="icf-person1"></i>房屋管家</a>
                            <a class="btn" order="4" href="javascript:"><i class="icf-person2"></i>生活管家</a>
                            <a class="btn" order="5" href="javascript:"><i class="icf-huiyuanqia"></i>一卡通</a>
                            <a class="btn" order="6" href="javascript:"><i class="icf-yizhan"></i>幸福驿站</a>
                            <a class="btn" order="7" href="javascript:"><i class="icf-package"></i>邮包</a>
                            <a class="btn" order="8" href="javascript:"><i class="icf-zhanghu"></i>账户</a>
                            <a class="btn" order="9" href="javascript:"><i class="icf-wodezhangdan"></i>账单</a>
                            <a class="btn" order="10" href="javascript:"><i class="icf-iconfont04"></i>客户访谈</a>
                        </div>
                    </div>
                    <div class="panel-body" id="dtn-TakeRelationBar">
                        <div class="dtn-tabbar active" id="dtn-PropertyService">

                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar" id="dtn-Parcel">
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                        <div class="dtn-tabbar">
                            <h5>
                                功能开发中·····
                            </h5>
                        </div>
                    </div>
                    <div class="pagination" id="TakeRelationPagination">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--车位信息编辑-->
<div class="modal medium hide" id="modal_carportStatus">
    <div class="modal-header">
        <%--<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>--%>
        <h4>车位状态信息</h4>
    </div>
    <div class="modal-body">
        <div class="modal-cover hide">
            <div class="modal-cover-bg"></div>
            <div class="modal-cover-text"></div>
        </div>
        <form id="modal_carportStatus_form" class="form-horizontal" action="javascript:void(0)">
            <div class="control-group">
                <label class="control-label">车位状态：</label>

                <div class="controls">
                    <select name="status" id="status">

                    </select>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">常用联系人：</label>

                <div class="controls">
                    <select name="contactsId" id="contactsId">

                    </select>
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">开始时间：</label>
                <div class="controls">
                    <input type="text" name="startTime" id="startTime" class="Wdate"
                           onClick="WdatePicker()" style="width:146px"/>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn btn-primary" id="carportStatus_ok">确认</a>
        <a href="#" class="btn" id="carportStatus_cancel">取消</a>
    </div>
</div>
<!-- 车位地址 -->
<script type="text/html" id="carportAddressTemp">
    <h4>{{details && details.name}}</h4>
</script>
<!-- 历史客户 -->
<script type="text/html" id="ownerHistoryTemp">
    {{each details}}
    {{if $value}}
    <li>
        <a href="#">
            <span class="name">{{$value.owner}}</span>
            <span class="phone">{{$value.mainMobile}}</span>
        </a>
    </li>
    {{/if}}
    {{/each}}
</script>
<!-- 客户列表 -->
<script type="text/html" id="ownerRelationTemp">
    {{each list}}
    {{if $value}}
    <li>
        <div class="relation" data-id="{{$value.customerId}}">
            {{if $value.canEdit}}
             <a href="javascript:" title="删除" class="relation-del" data-id="{{$value.customerId}}"></a>
            {{/if}}
            <div class="relation-img" data-id="{{$value.customerId}}" title="查看详情">
                <img src="${staticWeb}/img/sc/user.png">
            </div>
            <div class="relation-center">
                <div class="relation-name">
                    {{$value.owner}}
                </div>
                <div class="relation-phone">
                    {{$value.mainMobile}}
                </div>
            </div>
        </div>
    </li>
    {{/if}}
    {{/each}}
</script>
<!-- 车位信息 -->
<script type="text/html" id="carportInfoTemp">
    <div class="panel-body" >
        <hr/>
        <table class="table table-info">
            <tr>
                <th>楼盘:</th>
                <td data-id="{{details.projectId}}"><b>{{details.projectName}}</b>
                </td>
                <th>编码:</th>
                <td><b>{{details && details.code}}</b>
                </td>
                <th>辅助编码:</th>
                <td><b>{{details && details.assistantCode}}</b>
                </td>
            </tr>
            <tr>
                <th>车位类型:</th>
                <td><b>{{details && details.parkingTypeText}}</b>
                </td>
                <th>产权类型:</th>
                <td><b>{{details && details.equityTypeText}}</b>
                </td>
                <th>车位状态:</th>
                <td><b>{{details && details.statusText}}</b>
                </td>
            </tr>
        </table>
    </div>
</script>
<!-- 任务列表 -->
<script type="text/html" id="TakeRelation">
    <table class="table table-list">
        <thead>
        <tr>
            <th>序号</th>
            <th>创建时间</th>
            <th>事件编号</th>
            <th>客户名称</th>
            <th>客户类型</th>
            <th>事件类型</th>
            <th>标题</th>
            <th>物业地址</th>
            <th>状态</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</script>
<script type="text/html" id="selectTemp">
    <option value=" " selected="selected">==请选择==</option>
    {{if list}}
    {{each list}}
        {{if $value}}
            <option value="{{$value.code}}">{{$value.value}}</option>
        {{/if}}
    {{/each}}
    {{/if}}
</script>
<script type="text/html" id="contactsTemp">
    <option value=" " selected="selected">==请选择==</option>
    {{if list}}
    {{each list}}
    {{if $value}}
    <option value="{{$value.customerId}}">{{$value.owner}}</option>
    {{/if}}
    {{/each}}
    {{/if}}
</script>
<%@include file="/common/footer.jsp" %>
<script type="text/javascript">
    window.carportId = '${id}';
    $(function () {
        $("#btn_header_house").addClass("on");
    });
</script>
<script type="text/javascript" src="${staticWeb}/js/sc/carport.js?v=${javaScriptVersion}"></script>
</body>
