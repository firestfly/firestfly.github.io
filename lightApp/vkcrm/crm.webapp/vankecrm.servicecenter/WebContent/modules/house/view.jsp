<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
    <style type="text/css">
        .table-list td {
            text-align: center;
            vertical-align: middle;
            font-size: 12px;
            background: #ffffff;
        }

        .bi-info-top .span5 > h4 {
            line-height: 60px;
            margin: 0;
        }

        .bi-info-top .span7 {
            line-height: 80px;
        }

        .panel .panel-body {
            padding: 0px;
        }

        #dtn-TakeRelationBar {
            min-height: 200px;
            position: relative;
        }

        /****************表格样式****************/

        .table-info th, .table-info td {
            padding: 3px 0;

        }

        /****************订阅关系样式****************/

        #TakeRelationBox a.active {
            background: #cecece;
        }

        #transferHouseList, #transferHouseForm {
            padding: 10px 0;
        }

        #transferHouseForm .control-label {
            width: 100px;
        }

        #transferHouseForm .row {
            margin-left: 0px;
        }

        #transferHouseForm .controls {
            margin-left: 90px;
        }

        #transferHouseForm select {
            width: 174px;
        }

        #modal_transferHouse .modal-body {
            padding: 0px;
        }

        #_d_job .span6 {
            width: 160px;
        }

    </style>
</head>
<body>
<%@include file="/common/header.jsp" %>
<div class="wrap">
    <div class="content">
        <!--右侧布局-->
        <div class="ly-right">
            <!--房屋详情右侧底部按钮-->
            <div class="bi-relation-btns">
                <security:isAllow privilege="HOUSE_NUW_CUSTOMER">
                    <a href="${serverPath}/page/house/${houseId}/customer" class="bi-relation-btn"
                       id="addCustomer"><i class="icf-add"></i>新增客户</a>
                </security:isAllow>
                <a href="javascript:" class="bi-relation-btn" id="ownerHistory_showbtn">
                    <i class="icf-time"></i>历史客户</a>
            </div>
            <!--历史客户列表-->
            <div class="bi-history" id="ownerHistory_bar">
                <div class="bi-history-header">
                    <i class="icf-Go" id="ownerHistory_close"></i> 历史客户
                </div>
                <div class="bi-history-body">
                    <ul id="ownerHistory_list">
                    </ul>
                </div>
            </div>
            <!--当前客户列表-->
            <div class="bi-house">
                <div class="bi-owner" id="ownerHouserRelation_list">
                </div>
                <div class="bi-relation">
                    <ul id="ownerRelation_list">
                    </ul>
                </div>
            </div>
        </div>
        <!--中间布局-->
        <div class="ly-center2">
            <div class="detail-nav">
                <a href="javascript:history.go(-1);" title="返回">
                    <i class="icf-back"></i>
                </a>
                <span id="houseTitle"></span>
                <!-- add by liaochao 20160121 begin -->
                <span id="relation_map_btn" class="btn btn-info"
                      style="margin:10px 10px 0 0;float:right;">客户房屋关系图
                </span>
                <!-- add by liaochao 20160121 end -->
            </div>
            <div class="detail-btn-group">
                <a href="javascript:" class="btn" id="propertyFeeIsPaid"><span class="icf-wuyefei co-green"></span> 物业费
                    未知</a>
                <a href="javascript:" class="btn" id="taskPercent"><span class="icf-renwu co-deepCyan"></span> 任务 0 / 0</a>
                <security:isAllow privilege="HOUSE_TRANSFER">
                    <a href="javascript:" class="btn co-blue" id="btn_transferhouse"><i class="icf-wenben"></i>房屋过户</a>
                </security:isAllow>
                <security:isAllow privilege="HOUSE_SPLIT">
                    <a href="javascript:" class="btn co-green" id="btn_houseSplit"><i class="icf-fenlan3c"></i>房屋拆分</a>
                </security:isAllow>
            </div>
            <div class="detail-content">
                <div class="panel table-layout" id="infoPanel">
                    <div class="panel-header">
                        <div class="panel-title">
                            <i class="icf-page"></i>基本信息
                        </div>
                        <div class="panel-header-right">
                            <security:isAllow privilege="HOUSE_EDIT">
                                <a class="btn btn-link co-green" href="javascript:" id="btn_houseStatus">修改房屋信息</a>
                            </security:isAllow>&nbsp;&nbsp;&nbsp;
                            <security:isAllow privilege="HOUSE_MERGE_HIS_LIST">
                                <a class="btn btn-link co-green" href="javascript:" id="btn_houseMegerList">房屋合并历史</a>
                            </security:isAllow>&nbsp;&nbsp;&nbsp;
                            <security:isAllow privilege="TREE_HOUSE_MERGE">
                                <a class="btn btn-link co-green" href="javascript:"
                                   id="btn_mergeHouseRestore">房屋合并复原</a>
                            </security:isAllow>
                        </div>
                    </div>
                    <div id="infoContainer"></div>
                    <div class="panel-footer">
                        <span class="more-info" id="btnDetailMore"></span>
                    </div>
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
                        <div class="dtn-tabbar" id="dtn-PropertyFee">

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

    <!--房屋拆分-->
    <div class="modal large hide" id="modal_houseSplit">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4>房屋拆分</h4>
        </div>
        <div class="modal-body">
            <div class="panel">
                <form class="form-inline text-center">
                    <table style="width: 100%">
                        <tr>
                            <th>子房屋房号：</th>
                            <td><input type="text" name="subHouseName" id="subHouseName" class="input-medium"/></td>
                            <th>入住时间：</th>
                            <td><input type="text" name="subHousecheckinTime" id="subHousecheckinTime"
                                       class="input-medium Wdate" onclick="WdatePicker()"/></td>
                            <th>面积：</th>
                            <td><input type="text" name="subHouseArea" id="subHouseArea" class="input-medium"/></td>
                            <td style="text-align: left"><a href="#" class="btn btn-primary" id="houseSplit_ok">确定拆分</a>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
            <div id="subHouseTable">
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" id="houseSplit_cancel">关闭</a>
            <a href="#" class="btn btn-primary" id="houseMeger_ok" style="margin-right: 44px">子房合并</a>
        </div>
    </div>
    <!--房屋过户-->
    <div class="modal large hide transferModal" id="modal_transferHouse">
        <div class="modal-header">
            <button type="button" class="close" id="transferCloseBtn" data-dismiss="modal"
                    aria-hidden="true">&times;</button>
            <h4>房屋过户</h4>
        </div>
        <div class="modal-body">
            <div class="row-fluid">
                <div class="span4 left">
                    <div>
                        <div class="row">
                            <div class="span4">房屋名称:</div>
                            <div class="span8"><label id="transferAddress"></label></div>
                        </div>
                        <div class="row">
                            <div class="span4">当前业主:</div>
                            <div class="span8"><label id="transferOwnerName"></label></div>
                        </div>
                        <div class="row">
                            <div class="span12">&nbsp;<b>1.选择移除客房关系:</b></div>
                        </div>
                        <!--当前房屋客户列表-->
                        <div id="transferRelationList">
                        </div>
                        <div class="row">
                            <div class="span12">&nbsp;<b>2.从右侧添加新业主:</b></div>
                        </div>
                        <!--新增业主-->
                        <div id="transferRelationNewList">
                        </div>
                    </div>
                </div>
                <div class="span8 right">
                    <div id="transferHouseList">
                        <form class="form-inline" id="List_searchForm">
                            <div class="row-fluid">
                                <table>
                                    <tr>
                                        <td>
                                            <div class="input-prepend">
                                                <span class="add-on">客户姓名</span>
                                                <input class="input-small" type="text" name="name" placeholder="">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="input-prepend">
                                                <span class="add-on">联系电话</span>
                                                <input class="input-small" type="text" name="phone" placeholder="">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="input-prepend">
                                                <span class="add-on">证件号码</span>
                                                <input class="input-small" type="text" name="cardNum"
                                                       placeholder="">
                                            </div>
                                        </td>
                                        <td>
                                            <div class="btn-group">
                                                <button type="button" id="List_searchBtn" class="btn btn-primary"><i
                                                        class="icon-search icon-white"></i>查询
                                                </button>
                                                <button type="button" id="Add_userBtn" class="btn"><i
                                                        class="icon-plus"></i>新增
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="panel" style="padding: 0px;">
                                                <div class="panel-header">
                                                    <div class="panel-title icf-page"> 客户列表</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td style="padding:6px 5px;text-align:right">

                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </form>
                        <div class="row-fluid" id="customerTableDiv">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>姓名</th>
                                    <th>电话</th>
                                    <th>证件号码</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody id="List_listBody">
                                <tr>
                                    <td colspan="5">暂无数据</td>
                                </tr>
                                </tbody>
                                <script id="__view_search_list" type="text/html">
                                    {{if list}}
                                    {{each list}}
                                    <tr data-id="{{$value.id}}">
                                        <td>{{$index + 1}}</td>
                                        <td>{{$value.fullName}}</td>
                                        <td>{{$value.mainMobile}}</td>
                                        <td>{{$value.certificateId}}</td>
                                        <td>
                                            <div>
                                                <a href="javascript:void(0);" data-id="{{$value.id}}"
                                                   data-name="{{$value.fullName}}">添加</a>
                                            </div>
                                        </td>
                                    </tr>
                                    {{/each}}
                                    {{else}}
                                    <tr>
                                        <td colspan="5">暂无数据</td>
                                    </tr>
                                    {{/if}}
                                </script>
                            </table>
                        </div>
                        <div class="pagination" id="pagination"></div>
                    </div>
                    <div id="transferHouseForm" style="display:none;">
                        <form id="form_Customer" method="post" class="form-horizontal">
                            <div class="panel" style="padding: 0px;">
                                <div class="panel-header">
                                    <div class="panel-title icf-page"> 客户信息</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="J_form__username">姓名：</label>

                                        <div class="controls">
                                            <input type="text" name="basic.fullName" class="input-medium"
                                                   id="J_form__username"
                                                   data-validator="required,length[0~50],specialCaracters">
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="J_form_mainMobile">主用手机：</label>

                                        <div class="controls">
                                            <input type="text" id="J_form_mainMobile" class="input-medium"
                                                   name="basic.mainMobile"
                                                   data-validator="required,phone" tipsy-render="true"
                                                   placeholder="必填"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_cardType">证件类型：</label>

                                        <div class="controls">
                                            <select name="basic.certificateType" class="input-medium"
                                                    id="_d_cardType"></select>
                                            <em class="icf-import errortip"></em>
                                            <script id="__d_cardType" type="text/html">
                                                {{each details.CustomerCertificateType}}
                                                <option value="{{$value.code}}"
                                                        {{if $value.code== "1" }}
                                                selected="selected"
                                                {{/if}} >
                                                {{$value.value}}
                                                </option>
                                                {{/each}}
                                            </script>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="check_idcard">证件号码：</label>

                                        <div class="controls">
                                            <input id="check_idcard" type="text" class="input-medium"
                                                   name="basic.certificateId"
                                                   tipsy-render="true" placeholder="必填"
                                                   data-validator="required,specialCaracters,func[validateIdcard]"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label " for="_d_standbyMobile">备用手机：</label>

                                        <div class="controls ">
                                            <input type="text" class="input-medium" id="_d_standbyMobile"
                                                   name="basic.standbyMobile"
                                                   tipsy-render="true" data-validator="mobile"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d__homeTel">住宅电话：</label>

                                        <div class="controls">
                                            <input type="text" class="input-medium" id="_d__homeTel"
                                                   name="basic.homeTel"
                                                   tipsy-render="true" data-validator="phone"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_officeTel">办公电话：</label>

                                        <div class="controls">
                                            <input type="text" class="input-medium" id="_d_officeTel"
                                                   name="basic.officeTel"
                                                   tipsy-render="true" data-validator="phone"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_customerType">客户类型：</label>

                                        <div class="controls">
                                            <select name="basic.customerType" class="input-medium"
                                                    id="_d_customerType" data-validator="required"></select>
                                            <em class="icf-import errortip"></em>
                                            <script id="__d_customerType" type="text/html">
                                                {{each details.CustomerType}}
                                                <option value="{{$value.code}}"
                                                        {{if $value.code== "2"}}
                                                selected="selected"
                                                {{/if}} >
                                                {{$value.value}}
                                                </option>
                                                {{/each}}
                                            </script>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_affiliation">客户归属：</label>

                                        <div class="controls">
                                            <select name="basic.affiliation" id="_d_affiliation"
                                                    class="input-medium"></select>
                                            <em class="icf-import errortip"></em>
                                            <script type="text/html" id="__d_affiliation">
                                                {{each details.CustomerAffilication}}
                                                <option value="{{$value.code}}"
                                                        {{if $value.code== "2"}}
                                                selected="selected"
                                                {{/if}} >
                                                {{$value.value}}
                                                </option>
                                                {{/each}}
                                            </script>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_sex">性别：</label>

                                        <div class="dtn-controls">
                                            <div id="_d_sex"></div>
                                            <script id="__d_sex" type="text/html">
                                                {{each details.CustomerSex}}
                                                <label class="radio inline">
                                                    <input type="radio" name="basic.sex"
                                                           value="{{$value.code}}" {{if $value.code==
                                                    "3"}}checked="checked"{{/if}} >{{$value.value}}
                                                </label>
                                                {{/each}}
                                                <em class="icf-import errortip"></em>
                                            </script>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form id="form_CustomerDetail" method="post" class="form-horizontal">
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_email">邮箱：</label>

                                        <div class="controls">
                                            <input type="text" class="input-medium" name="details.email"
                                                   id="_d_email" tipsy-render="true" data-validator="email"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_postCode">邮编：</label>

                                        <div class="controls">
                                            <input type="text" id="_d_postCode" class="input-medium"
                                                   name="details.postCode"
                                                   tipsy-render="true" data-validator="zip"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_qq">QQ：</label>

                                        <div class="controls">
                                            <input type="text" class="input-medium" name="details.qq"
                                                   tipsy-render="true" id="_d_qq" data-validator="qq"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_wechat">微信号：</label>

                                        <div class="controls">
                                            <input type="text" id="_d_wechat" class="input-medium"
                                                   name="details.weChat" data-validator="specialCaracters"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_birthday">出生日期：</label>

                                        <div class="controls">
                                            <input type="text" id="_d_birthday" class="input-medium Wdate"
                                                   onClick="WdatePicker()"
                                                   name="details.birthday" data-validator="date"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_registerAddr">户籍地址：</label>

                                        <div class="controls">
                                            <input type="text" id="_d_registerAddr" class="input-medium"
                                                   name="details.registerAddr"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_bloodType">血型：</label>

                                        <div class="controls">
                                            <select name="details.blood" class="input-medium"
                                                    id="_d_bloodType"></select>
                                            <em class="icf-import errortip"></em>
                                            <script id="__d_bloodType" type="text/html">
                                                {{each details.CustomerBlood}}
                                                <option value="{{$value.code}}"
                                                        {{if $value.code== "8"}}
                                                selected="selected"
                                                {{/if}} >
                                                {{$value.value}}
                                                </option>
                                                {{/each}}
                                            </script>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_company">工作单位：</label>

                                        <div class="controls">
                                            <input type="text" id="_d_company" class="input-medium"
                                                   name="details.company"
                                                   data-validator="length[0~200],specialCaracters"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_urgencyContacts">紧急联系人：</label>

                                        <div class="controls">
                                            <input type="text" class="input-medium" id="_d_urgencyContacts"
                                                   name="details.urgencyContacts"
                                                   data-validator="length[0~50],specialCaracters"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label"
                                               for="_d_urgencyMobileNumber">紧急联系手机：</label>

                                        <div class="controls">
                                            <input type="text" id="_d_urgencyMobileNumber" class="input-medium"
                                                   name="details.urgencyMobileNumber"
                                                   data-validator="mobile" tipsy-render="true"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label"
                                               for="_d_urgencyPhoneNumber">紧急联系电话：</label>

                                        <div class="controls">
                                            <input type="text" id="_d_urgencyPhoneNumber" class="input-medium"
                                                   name="details.urgencyPhoneNumber"
                                                   data-validator="phone" tipsy-render="true"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                                <div class="span6">
                                    <div class="control-group">
                                        <label class="control-label"
                                               for="_d_urgencyMobileNumber">工作地址：</label>

                                        <div class="controls">
                                            <input type="text" class="input-medium" name="details.contactAddr"
                                                   data-validator="length[0~200],specialCaracters"/>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span12">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_job">职业：</label>

                                        <div class="dtn-controls" style="margin-left: 100px;">
                                            <div class="c_d_hide on" id="_d_job"></div>
                                            <script type="text/html" id="__d_job">
                                                {{each details.CustomerOccupation}}
                                                <label class="radio inline span6">
                                                    <input name="details.occupation" type="radio"
                                                           value="{{$value.code}}">{{$value.value}}
                                                </label>
                                                {{/each}}
                                                <em class="icf-import errortip"></em>
                                            </script>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="span12">
                                    <div class="control-group">
                                        <label class="control-label" for="_d_urgencyMobileNumber">备注：</label>

                                        <div class="controls">
                                                <textarea class="span11" cols="10" rows="3"
                                                          data-validator="length[0~200],specialCaracters"></textarea>
                                            <em class="icf-import errortip"></em>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="row">
                            <div class="span12" style="text-align:center;">
                                <button id="addc_form_btn" class="btn btn-primary" type="button">新增客户</button>
                                <button id="transfer_back_to_list" class="btn" type="button">
                                    返回列表
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" id="transferHouse_ok">确认过户</a>
            <a href="#" class="btn" id="transferHouse_cancel">取消</a>
        </div>
    </div>
    <!--房屋状态编辑-->
    <div class="modal medium hide" id="modal_houseStatus">
        <div class="modal-header">
            <%--<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>--%>
            <h4>房屋状态信息</h4>
        </div>
        <div class="modal-body">
            <div class="modal-cover hide">
                <div class="modal-cover-bg"></div>
                <div class="modal-cover-text"></div>
            </div>
            <form id="modal_houseStatus_form" class="form-horizontal" action="javascript:void(0)">
                <div class="control-group">
                    <label class="control-label">房屋状态：</label>

                    <div class="controls" id="houseStatusTemp">
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">常用联系人：</label>

                    <div class="controls" id="contactsName_list">
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">入住时间：</label>

                    <div class="controls">
                        <input type='text' name="checkInTime" id="checkInTime" class="Wdate"
                               onClick="WdatePicker()" style="width:146px"/>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">是否二手房：</label>

                    <div class="controls">
                        <select name="secondhand">
                            <option value="false">否</option>
                            <option value="true">是</option>
                        </select>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">宽带：</label>

                    <div class="controls" id="houseBroadbandTemp">
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" id="houseStatus_ok">确认</a>
            <a href="#" class="btn" id="houseStatus_cancel">取消</a>
        </div>
    </div>
</div>


<!-- 合并历史 -->
<div class="modal medium hide" id="modal_houseMegerList">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4>合并历史</h4>
    </div>
    <div class="modal-body">
        <div id="houseMegerListTable"></div>
    </div>
    <div class="modal-footer">
        <a href="#" class="btn" id="houseMegerList_cancel">关闭</a>
    </div>
</div>

<!-- 渲染模板 -->
<!-- 房屋状态 -->
<script type="text/html" id="tmplStatus">
    <select name="status">
        {{each HouseStatus}}
        {{if $value}}
        <option value="{{$value.code}}">{{$value.value}}</option>
        {{/if}}
        {{/each}}
    </select>
</script>
<!-- 宽带 -->
<script type="text/html" id="tmplBoardband">
    {{each Broadband}}
    {{if $value}}
    <label class="radio inline"><input type='radio' name="broadband" value="{{$value.code}}">{{$value.value}}</label>
    {{/if}}
    {{/each}}
</script>
<!-- 子房屋列表 -->
<script type="text/html" id="subHouseTemp">
    <div class="table-body">
        <table class="table table-list">
            <thead>
            <tr>
                <th><input type="checkbox" id="selectAll" name="selectAll" onclick="checkall()"/></th>
                <th>序号</th>
                <th>子房屋名称</th>
                <th>入住日期</th>
                <th>常用联系人</th>
                <th>房屋状态</th>
                <th>面积</th>
                <th>操作 <a class="h-btn j_add"></a></th>
            </tr>
            </thead>
            <tbody>
            {{each details}}
            {{if $value}}
            <tr>
                <td><input type="checkbox" id="zfxk" name="zfxk" value="{{$value.houseId}}" onclick="checkzfxk()"/></td>
                <td>{{$index}}</td>
                <td>{{$value.houseName}}</td>
                <td>{{$value.checkInTime}}</td>
                <td>{{$value.contactsName}}</td>
                <td>{{$value.statusText}}</td>
                <td>{{$value.propertyArea}}</td>
                <td>
                    <a class="h-btn j_del" data-id="{{$value.houseId}}"><i class="icf-delete"></i></a>
                </td>
            </tr>
            {{/if}}
            {{/each}}
            </tbody>
        </table>
    </div>
</script>
<script type="text/html" id="tmplHouseTitle">
    <h4>{{basic && basic.name}}({{basic && basic.unit}}-单元)</h4>
</script>
<script type="text/html" id="contactsNameTemp">
    <select name="contactsId">
        {{if list}}
        {{each list}}
        {{if $value}}
        <option value="{{$value.customerId}}">{{$value.fullName}}</option>
        {{/if}}
        {{/each}}
        {{/if}}
    </select>
</script>
<!-- 要解除的关系列表 -->
<script type="text/html" id="transferHouseTemp">
    {{each list}}
    {{if $value}}
    <div class="row">
        <div class="span3 offset2">{{$value.fullName}}</div>
        <div class="span3"><span class="tag {{$value.color}}">{{$value.spanName}}</span></div>
        <div class="span3">
            <label class="checkbox">
                <input type="checkbox" checked="checked" data-id="{{$value.customerId}}"
                       data-type="{{$value.relationType}}">
            </label>
        </div>
    </div>
    {{/if}}
    {{/each}}
</script>
<!-- 要新增的关系列表 -->
<script type="text/html" id="transferHouseNewTemp">
    <div class="row" id="customer_ID_{{customer && customer.customerId}}">
        <div class="span3 offset2">
            <label>{{customer && customer.customerName}}</label>
            <input type="hidden" value="{{customer && customer.customerId}}" name="transferHouseNewCustomer"></div>
        <div class="span3">
            <span class="tag tag-yellow">拥有</span>
        </div>
        <div class="span3">
            <a name="transferHouseRemoveCustomer" data-id="customer_ID_{{customer && customer.customerId}}">
                <i class="icf-delete"></i></a>
        </div>
    </div>
</script>
<!-- 业主列表 -->
<script type="text/html" id="ownerTemp">
    {{each list}}
    {{if $value}}
    <div class="bi-owner-info" data-id="{{$value.customerId}}">
        <security:isAllow privilege="HOUSE_DETAIL$RELACTION_EDIT">
            <%--modified by liaochao 20160126 begin--%>
            <%--<a href="javascript:" title="删除" class="relation-del" data-id="{{$value.customerId}}"></a>--%>
            <%--modified by liaochao 20160126 end--%>
        </security:isAllow>

        <div class="bi-ownerbox-top">
            <div class="bi-owner-img">
                <img src="${serverPath}/static/img/_/user03.png">
            </div>
            <div class="bi-ownerbox-info">
                <div class="bi-owner-name" title="{{$value.fullName}}">{{$value.fullName}}</div>
                <div class="bi-owner-phone">{{$value.mainMobileNumber}}</div>
            </div>
        </div>
        <div class="clear"></div>
        <div class="bi-owner-tags">
            <div class="owner-tagbox" id="owner-tagbox" data-id="{{$value.customerId}}">
                <!--{{if $value.relation}}
                <span class="tag tag-yellow tag-off" data-code = "1">拥有</span>
                <span class="tag tag-blue tag-off" data-code = "2">居住</span>
                <span class="tag tag-cyan tag-off" data-code = "3">账单</span>
                <span class="tag tag-green tag-off" data-code = "4">分润</span>
                <span class="tag tag-red tag-off" data-code = "5">其他</span>
                <span class="tag tag-orange tag-off" data-code = "6">租赁</span>
                {{/if}}-->
            </div>
        </div>
    </div>
    {{/if}}
    {{/each}}
</script>
<script type="text/javascript">

    var hasEditRelationRole = false;
    <security:isAllow privilege="HOUSE_DETAIL$RELACTION_EDIT">
    hasEditRelationRole = true;
    </security:isAllow>

</script>
<script type="text/html" id="RelationBarTemp">
    <span class="tag tag-yellow tag-off" data-code="{{details.HouseCustomerRelationType[0].code}}">拥有</span>
    <span class="tag tag-blue tag-off" data-code="{{details.HouseCustomerRelationType[1].code}}">居住</span>
    <span class="tag tag-orange tag-off" data-code="{{details.HouseCustomerRelationType[2].code}}">租赁</span>
    <span class="tag tag-cyan tag-off" data-code="{{details.HouseCustomerRelationType[3].code}}">账单</span>
    <span class="tag tag-green tag-off" data-code="{{details.HouseCustomerRelationType[4].code}}">分润</span>
    <span class="tag tag-red tag-off" data-code="{{details.HouseCustomerRelationType[5].code}}">其他</span>
</script>
<!-- 历史客户 -->
<script type="text/html" id="ownerHistoryTemp">
    {{each details}}
    {{if $value}}
    <li>
        <a href="#">
            <span class="name">{{$value.fullName}}</span>
            <span class="phone">{{$value.mainMobileNumber}}</span>
            {{if $value.relationTypeText}}<span class="tag tag-unify">{{$value.relationTypeText}}</span>{{/if}}
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
            <security:isAllow privilege="HOUSE_DETAIL$RELACTION_EDIT">
                <a href="javascript:" title="删除" class="relation-del" data-id="{{$value.customerId}}"></a>
            </security:isAllow>

            <div class="relation-img" data-id="{{$value.customerId}}" title="查看详情">
                <img src="${serverPath}/static/img/_/user03.png">
            </div>
            <div class="relation-center">
                <div class="relation-name">
                    {{$value.fullName}}
                </div>
                <div class="relation-phone">
                    {{$value.mainMobileNumber}}
                </div>
            </div>
            <div class="relation-right">
                <div class="relation-tags">
                    {{if $value.relation}}
                    {{each $value.relation}}
                    {{if $value}}
                    <span class="tag {{$value.color}}">{{$value.name}}</span>
                    {{/if}}
                    {{/each}}
                    {{/if}}
                </div>
            </div>
        </div>
    </li>
    {{/if}}
    {{/each}}
</script>
<!--房屋详情模板-->
<script type="text/html" id="tmplHouseInfo">
    <div class="panel-body" data-basic>
        <table class="table table-info">
            <tr>
                <th>省/市：</th>
                <td>{{ detail | str: 'province' }}/{{ detail | str: 'city' }}</td>
                <th>收费面积：</th>
                <td>{{ #detail | str: 'propertyArea', ' m<sup>2</sup>' }}</td>
                <th>建筑面积：</th>
                <td>{{ #detail | str: 'builtUpArea', ' m<sup>2</sup>' }}</td>
            </tr>
            <tr>
                <th>二手房：</th>
                <td>{{ basic | bool: 'secondhand', '是', '否'}}</td>
                <th>房屋状态：</th>
                <td>{{ basic | str: 'statusText' }}</td>
                <th>参考服务费：</th>
                <td>{{ detail | str: 'referenceServiceCharge', ' 元' }}
                </td>
            </tr>
            <tr>
                <th>宽带：</th>
                <td>{{ basic | str: 'broadbandText' }}</td>
                <th>朝向：</th>
                <td>{{ detail | str: 'orientation' }}</td>
                <th>户型：</th>
                <td>{{ detail | str: 'layoutText' }}</td>
            </tr>
            <tr>
                <th>入住日期：</th>
                <td>{{ basic | str: 'checkInTime' }}</td>
                <th>交付日期：</th>
                <td>{{if basic && basic.deliverTime != undefined}}{{basic.deliverTime}}{{/if}}</td>
                <th></th>
                <td></td>
            </tr>
        </table>
    </div>
    <div class="panel-body panel-hide" data-detail>
        <hr/>
        <table class="table table-info">
            <tr>
                <th>产权类型：</th>
                <td>{{if basic && basic.equityTypeText != undefined}}{{basic.equityTypeText }}{{/if}}</td>
                <th>销售装修：</th>
                <td>{{if detail && detail.salesUnitPrice != undefined}}{{detail.salesUnitPrice}} 元{{/if}}</td>
                <th>拥有子房屋：</th>
                <td>{{if basic && basic.hasSubRoom != undefined}}{{basic.hasSubRoom ? '是' : '否'}}{{/if}}</td>
            </tr>
            <tr>
                <th>房屋编码：</th>
                <td colspan="2">{{if basic && basic.code != undefined}}{{basic.code}}{{/if}}</td>
                <th>辅助编码：</th>
                <td colspan="1">{{if basic && basic.assistCode != undefined}}{{basic.assistCode}}{{/if}}</td>
            </tr>
        </table>
    </div>
    <div class="panel-body panel-hide" data-detail>
        <hr/>
        <table class="table table-info">
            <tr>
                <th>套内面积：</th>
                <td>{{if detail && detail.setArea != undefined}}{{detail.setArea}} m<sup>2</sup>{{/if}}
                </td>
                <th>预售套内面积：</th>
                <td>{{if detail && detail.areaOfPreSale != undefined}}{{detail.areaOfPreSale}}
                    m<sup>2</sup>{{/if}}
                </td>
                <th>实测建筑面积：</th>
                <td>{{if detail && detail.actualConstructionArea != undefined}}{{detail.actualConstructionArea}}
                    m<sup>2</sup>{{/if}}
                </td>
            </tr>
            <tr>
                <th>预售建筑面积：</th>
                <td>{{if detail && detail.preSaleConstructionArea != undefined}}{{detail.preSaleConstructionArea}}
                    m<sup>2</sup>{{/if}}
                </td>
                <th>公摊面积：</th>
                <td>{{if detail && detail.poolArea != undefined}}{{detail.poolArea}} m<sup>2</sup>{{/if}}
                </td>
                <th>实测公摊面积：</th>
                <td>{{if detail && detail.measuredPoolArea != undefined}}{{detail.measuredPoolArea}}
                    m<sup>2</sup>{{/if}}
                </td>
            </tr>
            <tr>
                <th>实测套内面积：</th>
                <td>{{if detail && detail.fieldMeasuredArea != undefined}}{{detail.fieldMeasuredArea}}
                    m<sup>2</sup>{{/if}}
                </td>
                <th>花园面积：</th>
                <td>{{if detail && detail.gardenArea != undefined}}{{detail.gardenArea}} m<sup>2</sup>{{/if}}
                </td>
                <th>露台面积：</th>
                <td>{{if detail && detail.terraceArea != undefined}}{{detail.terraceArea}} m<sup>2</sup>{{/if}}
                </td>
            </tr>
            <tr>
                <th>车库面积：</th>
                <td>{{if detail && detail.garageArea != undefined}}{{detail.garageArea}} m<sup>2</sup>{{/if}}
                </td>
                <th>地下室面积：</th>
                <td>{{if detail && detail.basementArea != undefined}}{{detail.basementArea}} m<sup>2</sup>{{/if}}
                </td>
                <th>实测地下室面积：</th>
                <td>{{if detail && detail.measuredBasementArea != undefined}}{{detail.measuredBasementArea}}
                    m<sup>2</sup>{{/if}}
                </td>
            </tr>

        </table>
    </div>
</script>
<!-- 物业服务模板 -->
<script type="text/html" id="PropertyServiceTemplate">
    <table class="table table-list">
        <thead>
        <tr>
            <th>序号</th>
            <th>创建时间</th>
            <th>任务描述</th>
            <th>项目名称</th>
            <th>业务类型名称</th>
            <%--<th>业务类型编码</th>--%>
            <th>数据来源</th>
            <th>联系人姓名</th>
            <th>联系电话</th>
            <th>状态</th>
            <th>任务编码</th>
        </tr>
        </thead>
        <tbody>
        {{each list}}
        {{if $value}}
        <tr>
            <td>
                {{$index+1}}
            </td>
            <%--add by liaochao 20160201 begin--%>
            <td>
                {{$value.created}}
            </td>
            <%--add by liaochao 20160201 end--%>
            <td>
                {{$value.contentText}}
            </td>
            <td>
                {{$value.project_name}}
            </td>
            <td>
                {{$value.business_name}}
            </td>
            <%--<td>--%>
            <%--{{$value.business_type}}--%>
            <%--</td>--%>
            <td>
                {{$value.source}}
            </td>
            <td>
                {{$value.contact}}
            </td>
            <td>
                {{$value.mobile}}
            </td>
            <td>
                {{$value.statusTo}}
            </td>
            <td>
                {{$value.task_no}}
            </td>
        </tr>
        {{/if}}
        {{/each}}
        </tbody>
    </table>
</script>
<!-- 邮包模板 -->
<script type="text/html" id="ParcelTemplate">
    <table class="table table-list">
        <thead>
        <tr>
            <th>时间</th>
            <th>单号</th>
            <th>状态</th>
            <th>快递公司</th>
            <th>姓名</th>
            <th>手机号</th>
        </tr>
        </thead>
        <tbody>
        {{each list}}
        {{if $value}}
        <tr>
            <td>
                {{$value.time}}
            </td>
            <td>
                {{$value.billNo}}
            </td>
            <td>
                {{$value.statusTo}}
            </td>
            <td>
                {{$value.expCompany}}
            </td>
            <td>
                {{$value.custName}}
            </td>
            <td>
                {{$value.custMobile}}
            </td>
        </tr>
        {{/if}}
        {{/each}}
        </tbody>
    </table>
</script>
<!-- 邮包模板 -->
<script type="text/html" id="PropertyFeeTemplate">
    <table class="table table-list">
        <thead>
        <tr>
            <th>月份</th>
            <th>应付金额</th>
            <th>实付金额</th>
            <th>条目名称</th>
            <th>欠缴情况</th>
        </tr>
        </thead>
        <tbody>
        {{each bis as item i}}
        {{if item}}
        {{each item.costs}}
        {{if $value}}
        <tr>
            <td>
                {{item.mth}}
            </td>
            <td>
                {{$value.expenses}}
            </td>
            <td>
                {{$value.paid}}
            </td>
            <td>
                {{$value.expenseName}}
            </td>
            <td>
                {{if $value.status && $value.status == "1"}}
                已缴
                {{else}}
                未缴
                {{/if}}
            </td>
        </tr>
        {{/if}}
        {{/each}}
        {{/if}}
        {{/each}}
        </tbody>
    </table>
</script>


<!-- 合并历史 -->
<script type="text/html" id="houseMegerListTemp">
    <div class="table-body">
        <table class="table table-list">
            <thead>
            <tr>
                <th>序号</th>
                <th>源屋名称</th>
                <th>物业面积</th>
            </tr>
            </thead>
            <tbody>
            {{if details.length == 0}}
            <tr>
                <td colspan="7" class="alignCenter">暂无数据</td>
            </tr>
            {{else}}
            {{each details}}
            {{if $value}}
            <tr>
                <td>{{$index}}</td>
                <td>{{$value.houseName}}</td>
                <td>{{$value.propertyArea}}m<sup>2</sup></td>
            </tr>
            {{/if}}
            {{/each}}
            {{/if}}
            </tbody>
        </table>
    </div>
</script>

<%@include file="/common/footer.jsp" %>
<%-- add by liaochao 20160119 begin--%>
<style>
    #house_customer, #customer_house {
        position: absolute;
        width: 100%;
        top: 55px;
        bottom: 40px;
        /*display: none;*/
    }

    .echart-back {
        position: absolute;
        top: 60px;
        left: 5px;
        width: 48px;
        height: 48px;
        z-index: 1;
        font-size: 18px;
    }

</style>
<a href="javascript:void(0);" title="返回">
    <i id="relation-map-back-btn" class="icf-back echart-back" style="width:48px;height:48px;padding-left: 10px;
    padding-top: 7px;"></i>
</a>
<%--房屋为主--%>
<div id="house_customer">
</div>
<%--客户为主--%>
<div id="customer_house">
</div>

<div id="loading" class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-body">
                加载中 ......
            </div>
        </div>
    </div>
</div>

<script>
    $("#house_customer").hide();
    $("#customer_house").hide();
    $("#relation-map-back-btn").hide();
</script>
<%-- add by liaochao 20160119 end--%>
<script type="text/javascript">
    window.houseId = '${houseId}';
    window.houseCode = '${code}';
    window.house = {};
    $(function () {
        $("#btn_header_house").addClass("on");
    });
</script>
<!-- add by liaochao 2016021 begin -->
<script type="text/javascript" src="${staticWeb}/lib/echarts.min.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/sc/house.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/sc/house_relation_map.js?v=${javaScriptVersion}"></script>
<!-- add by liaochao 2016021 end -->
</body>
</html>
