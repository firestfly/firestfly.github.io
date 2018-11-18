<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
<style type="text/css">
    .jiufen {
        margin-top: 10px;
    }

    .jiufen.on {
        display: none;
    }

    .table-list td {
        text-align: center;
    }

    .detail-icon-back {
        line-height: 48px;
        padding: 5px 0 0 15px;
        font-size: 16px;
        color: #08c;
        border-bottom: 1px solid #d6dde7;
        display: block;
    }
    /*add by liaochao 20160121 begin*/
    .entrance-relation-map{
        position: absolute;
        cursor: pointer;
        width:50px;
        height:50px;
        bottom:0px;
        right:20px;
    }
    /*add by liaochao 20160121 end*/
</style>
<body>
<%@include file="/common/header.jsp" %>
<div class="wrap">
    <div class="content">
        <div class="ly-left">
            <a href="javascript:history.go(-1);" title="返回" class="detail-icon-back">
                <span class="icf-back" style="line-height:16px; font-size:1.2em;"></span>
                返回
            </a>
            <!-- ownerinfo -->
            <div class="bi-house bi-userinfo" style=" top:54px">
                <div class="bi-owner" id="ownerInfo">
                </div>
                <div class="bi-relation" id="customerRelationInfo">
                    <ul>
                    </ul>
                </div>
                <%--add by liaochao 20160121 begin--%>
                <div class="entrance-relation-map">
                    <img src="${serverPath}/static/img/entrance.png">
                </div>
                <%--add by liaochao 20160121 end--%>
            </div>
            <!-- ownerinfo end -->
        </div>
        <div class="ly-center">
            <div class="ui-info-top">
                <!-- nav -->
                <ul class="nav nav-tabs" id="userinfo_tab">
                    <li class="active"><a href="#userinfo_all">综合</a></li>
                    <li><a href="#userinfo_jiben">基本信息</a></li>
                    <li><a href="#userinfo_cheliang">车辆</a></li>
                    <li><a href="#userinfo_chongwu">宠物</a></li>
                    <li><a href="#userinfo_xingqu">个人兴趣</a></li>
                    <li><a href="#userinfo_specialidentity">特殊身份</a></li>
                    <li><a href="#userinfo_yikatong">一卡通</a></li>
                    <li><a href="#userinfo_yingxiang">影像资料</a></li>
                    <li><a href="#userinfo_dingyue">订阅关系</a></li>
                </ul>
                <!-- nav end -->
            </div>
            <div class="ui-info-bottom">
                <!-- 综合信息tab -->
                <div class="tabcontent active" id="userinfo_all">
                    <!-- 综合基本信息 -->
                    <div class="panel" id="allBaseInfoPanel">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-page"></span>
                                基本信息
                            </div>
                        </div>
                        <hr>
                        <div id="allBaseInfoBody">
                        </div>
                        <div class="panel-footer">
                            <span class="more-info" id="userinfoBaseMore"></span>
                        </div>
                    </div>
                    <!-- 综合基本信息 end -->
                    <!-- 综合车辆 -->
                    <div class="panel">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-iconfontcheliangguanli"></span>
                                车辆
                            </div>
                        </div>
                        <hr>
                        <div class="panel-body">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>车牌号</th>
                                    <th>购置时间</th>
                                    <th>车辆品牌</th>
                                    <th>车辆颜色</th>
                                </tr>
                                </thead>
                                <tbody id="allCarsPanelBody">

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- 综合车辆end -->
                    <!-- 综合宠物panel -->
                    <div class="panel">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-gongyichongwu"></span>
                                宠物
                            </div>
                        </div>
                        <hr>
                        <div class="panel-body">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>宠物名称</th>
                                    <th>品种</th>
                                    <th>性别</th>
                                    <th>领养时间</th>
                                </tr>
                                </thead>
                                <tbody id="allPetsPanelBody">

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- 综合宠物panel end -->
                    <!-- 综合个人兴趣 -->
                    <div class="panel">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-ganxingqu"></span>
                                个人兴趣
                            </div>
                        </div>
                        <hr>
                        <div class="panel-body" id="allInterestPanelBody">

                        </div>
                    </div>
                    <!-- 综合个人兴趣 end -->

                    <!-- 特殊身份 -->
                    <!-- <div class="panel">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-ganxingqu"></span>
                                特殊身份
                            </div>
                        </div>
                        <hr>
                        <div class="panel-body" id="allSpecialidentityPanelBody">

                        </div>
                    </div> -->
                    <!-- 特殊身份 end -->

                    <!-- 综合一卡通 -->
                    <div class="panel">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-huiyuanqia"></span>
                                一卡通
                            </div>
                        </div>
                        <hr>
                        <div class="panel-body">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>卡号</th>
                                    <th>卡序列号</th>
                                </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- 综合一卡通 end -->
                    <!-- 综合订阅关系 -->
                    <div class="panel hide">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-bookopened"></span>
                                订阅关系（物业服务）
                            </div>
                        </div>
                        <hr>
                        <div class="panel-body">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>创建时间</th>
                                    <th>事件编号</th>
                                    <th>客户名称</th>
                                    <th>客户类型</th>
                                    <th>标题</th>
                                    <th>物业地址</th>
                                    <th>事件状态</th>
                                </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- 综合订阅关系 end -->
                    <!-- 综合相关物业 -->
                    <div class="panel">
                        <div class="panel-header">
                            <div class="panel-title">
                                <span class="icf-iconbuildingalt"></span>
                                相关物业
                            </div>
                        </div>
                        <hr>
                        <div class="panel-body" id="userinfoBaseMoreBody">

                        </div>
                    </div>
                    <!-- 综合相关物业 end -->
                </div>
                <!-- 综合信息tab end -->

                <!-- 基本信息tab -->
                <div class="tabcontent" id="userinfo_jiben">
                    <div id="edit_content">
                        <div class="form_info">
                            <div class="panel">
                                <div class="row-fluid">
                                    <div class="panel-header span4">
                                        <div class="panel-title">
                                            <span class="icf-page"></span>
                                            基本信息
                                        </div>
                                    </div>
                                    <div class="text-right span8">
                                        <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                                            <button class="btn btn-primary" type="button" id="basic_save_btn">保存
                                            </button>
                                            <button class="btn" type="button" id="basic_cancel_btn">取消
                                            </button>
                                            <button class="btn btn-link" id="basic_edit_btn" type="button">编 辑</button>
                                        </security:isAllow>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <form id="basic_info" data-widget="validator">
                                <input type="hidden" name="id" value="${customerId}"/>
                                <input type="hidden" name="houseId" value="${houseId}"/>
                                <input type="hidden" name="buildingId" value="${buildingId}"/>
                                <input type="hidden" name="buildingType" value="${buildingType}"/>
                                <table class="table table-newuser ">
                                    <tr>
                                        <th><label>姓名：</label></th>
                                        <td id="_view_name"></td>
                                        <script id="__view_name" type="text/html">
                                            <span class="_basic_view">{{customer.fullName}}</span>
                                            <input type="text" name="fullName" class="c_hide on span3"
                                                   data-validator="required,length[0~100]"
                                                    <%if (!SecurityContext.hasPermission("CUSTOMER_EDIT_HIGH")) {%>
                                                   readonly="readonly"
                                                    <%}%>
                                                   value="{{customer.fullName}}"/><em class="icf-import errortip"></em>
                                        </script>
                                        <th><label>证件类型：</label></th>
                                        <td id="_view_cardType" class="_basic_view"></td>
                                        <script id="__view_cardType" type="text/html">
                                            <span>{{customer.certificateTypeText}}</span>
                                        </script>
                                        <td class="c_hide on">
                                            <select name="certificateType" class="span3" data-validator="required"
                                                    <%
                                                        if (!SecurityContext.hasPermission("CUSTOMER_EDIT_HIGH")) {
                                                    %>
                                                    disabled="disabled"
                                                    <%}%>
                                                    id="_d_cardType"></select><em class="icf-import errortip"></em>
                                            <script id="__d_cardType" type="text/html">
                                                {{each details.CustomerCertificateType}}
                                                <option value="{{$value.code}}" {{if $value.code == "1"}}selected="selected"{{/if}}>{{$value.value}}</option>
                                                {{/each}}
                                            </script>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label>证件号码：</label></th>
                                        <td id="_view_idcard"></td>
                                        <script type="text/html" id="__view_idcard">
                                            <span class="_basic_view">{{customer.certificateId}}</span>
                                            <input name="certificateId" type="text" class="c_hide on span3"
                                                   data-validator="required,func[validateIdcard]"
                                                    <%if (!SecurityContext.hasPermission("CUSTOMER_EDIT_HIGH")) {%>
                                                   readonly="readonly"
                                                    <%}%>
                                                   value="{{customer.certificateId}}"/><em
                                                    class="icf-import errortip"></em>
                                        </script>
                                        <th><label>性别：</label></th>
                                        <td id="_view_sex" class="_basic_view"></td>
                                        <script type="text/html" id="__view_sex">
                                            <span>{{customer.sexText}}</span>
                                        </script>
                                        <td id="_d_sex" class="c_hide on"></td>
                                        <script id="__d_sex" type="text/html">
                                            {{each details.CustomerSex}}
                                            <label class="radio inline">
                                                <input type="radio" name="sex" value="{{$value.code}}" {{if $value.code == "3"}}checked="checked"{{/if}}>{{$value.value}}
                                            </label>
                                            {{/each}}
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>主用手机：</label></th>
                                        <td id="_view_mainMobile"></td>
                                        <script type="text/html" id="__view_mainMobile">
                                            <span class="_basic_view">{{customer.mainMobile}}</span>
                                            <input name="mainMobile" type="text" class="c_hide on span3"
                                                   data-validator="required,phone"
                                                   value="{{customer.mainMobile}}"/><em
                                                    class="icf-import errortip"></em>
                                        </script>
                                        <th><label>备用手机：</label></th>
                                        <td id="_view_standbyMobile"></td>
                                        <script type="text/html" id="__view_standbyMobile">
                                            <span class="_basic_view">{{customer.standbyMobile}}</span>
                                            <input name="standbyMobile" type="text" class="c_hide on span3"
                                                   data-validator="mobile"
                                                   value="{{customer.standbyMobile}}"/><em
                                                    class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>办公电话：</label></th>
                                        <td id="_view_officeTel"></td>
                                        <script id="__view_officeTel" type="text/html">
                                            <span class="_basic_view">{{customer.officeTel}}</span>
                                            <input name="officeTel" type="text" class="c_hide on span3"
                                                   data-validator="phone"
                                                   value="{{customer.officeTel}}"/><em class="icf-import errortip"></em>
                                        </script>
                                        <th><label>客户类型：</label></th>
                                        <td id="_view_customerType" class="_basic_view"></td>
                                        <script id="__view_customerType" type="text/html">
                                            <span>{{customer.customerTypeText}}</span>
                                        </script>
                                        <td class="c_hide on">
                                            <select name="customerType" class="span3" id="_d_customerType"
                                                    data-validator="required"></select><em
                                                class="icf-import errortip"></em>
                                            <script id="__d_customerType" type="text/html">
                                                {{each details.CustomerType}}
                                                <option value="{{$value.code}}" {{if $value.code == "2"}}selected="selected"{{/if}}>{{$value.value}}</option>
                                                {{/each}}
                                            </script>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th><label>客户归属：</label></th>
                                        <td id="_view_affType" class="_basic_view"></td>
                                        <script id="__view_affType" type="text/html">
                                            <span>{{customer.affiliationText}}</span>
                                        </script>

                                        <td class="c_hide on">
                                            <select name="affiliation" id="_d_affiliation"></select><em
                                                class="icf-import errortip"></em>
                                            <script type="text/html" id="__d_affiliation">
                                                {{each details.CustomerAffilication}}
                                                <option value="{{$value.code}}" {{if $value.code == "2"}}selected="selected"{{/if}}>{{$value.value}}</option>
                                                {{/each}}
                                            </script>
                                        </td>
                                        <th><label>住宅电话：</label></th>
                                        <td id="_view_homeTel"></td>
                                        <script type="text/html" id="__view_homeTel">
                                            <span class="_basic_view">{{customer.homeTel}}</span>
                                            <input name="homeTel" type="text" class="span3 on c_hide"
                                                   data-validator="phone"
                                                   value="{{customer.homeTel}}"/><em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                </table>
                            </form>
                            <hr/>
                        </div>
                        <div class="form_info">
                            <div class="panel">
                                <div class="row-fluid">
                                    <div class="panel-header span4">
                                        <div class="panel-title">
                                            <span class="icf-page"></span>
                                            详细信息
                                        </div>
                                    </div>
                                    <div class="text-right span8">
                                        <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                                            <button class="btn btn-primary" type="button" id="details_save_btn">保存
                                            </button>
                                            <button class="btn" type="button" id="details_cancel_btn">取消
                                            </button>
                                            <button class="btn btn-link" type="button" id="details_edit_btn">编 辑
                                            </button>
                                        </security:isAllow>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <form id="detail_info" data-widget="validator">
                                <input type="hidden" name="id" value="${customerId}"/>
                                <input type="hidden" name="houseId" value="${houseId}"/>
                                <input type="hidden" name="buildingId" value="${buildingId}"/>
                                <input type="hidden" name="buildingType" value="${buildingType}"/>
                                <table class="table table-newuser ">
                                    <tr>
                                        <th><label>邮箱：</label></th>
                                        <td id="_view_email"></td>
                                        <script type="text/html" id="__view_email">
                                            <span class="_details_view">{{customerDetails && customerDetails.email}}</span>
                                            <input name="email" type="email" class=" c_d_hide on"
                                                   value="{{customerDetails && customerDetails.email}}"
                                                   data-validator="email"/><em class="icf-import errortip"></em>
                                        </script>
                                        <th><label>QQ：</label></th>
                                        <td id="_view_qq"></td>
                                        <script type="text/html" id="__view_qq">
                                            <span class="_details_view">{{customerDetails && customerDetails.qq}}</span>
                                            <input name="qq" type="text" class=" c_d_hide on"
                                                   value="{{customerDetails && customerDetails.qq}}"
                                                   data-validator="qq"/><em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>微信号：</label></th>
                                        <td id="_view_wechat"></td>
                                        <script type="text/html" id="__view_wechat">
                                            <span class="_details_view">{{customerDetails && customerDetails.weChat}}</span>
                                            <input name="weChat" type="text" class=" c_d_hide on"
                                                   value="{{customerDetails && customerDetails.weChat}}"
                                                   data-validator="specialCaracters"/><em
                                                    class="icf-import errortip"></em>
                                        </script>
                                        <th><label>生日：</label></th>
                                        <td id="_view_birthday"></td>
                                        <script type="text/html" id="__view_birthday">
                                            <span class="_details_view">{{customerDetails && customerDetails.birthday}}</span>
                                            <input name="birthday" type="text" onclick="WdatePicker()"
                                                   class="Wdate c_d_hide on"
                                                   value="{{customerDetails && customerDetails.birthday}}"
                                                   data-validator="date"/><em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>血型：</label></th>
                                        <td id="_view_blood" class="_details_view"></td>
                                        <script type="text/html" id="__view_blood">
                                            <span>{{customerDetails && customerDetails.bloodText}}</span>
                                        </script>
                                        <td class="c_d_hide on">
                                            <select name="blood" class="" id="_d_bloodType"></select><em
                                                class="icf-import errortip"></em>
                                            <script id="__d_bloodType" type="text/html">
                                                {{each details.CustomerBlood}}
                                                <option value="{{$value.code}}" {{if $value.code == "8"}}selected="selected"{{/if}}>{{$value.value}}</option>
                                                {{/each}}
                                            </script>
                                        </td>
                                        <th><label>紧急联系人：</label></th>
                                        <td id="_view_J_name"></td>
                                        <script type="text/html" id="__view_J_name">
                                            <span class="_details_view">{{customerDetails && customerDetails.urgencyContacts}}</span>
                                            <input name="urgencyContacts" type="text" class=" c_d_hide on"
                                                   value="{{customerDetails && customerDetails.urgencyContacts}}"/><em
                                                    class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>紧急联系人手机：</label></th>
                                        <td id="_view_J_phone"></td>
                                        <script type="text/html" id="__view_J_phone">
                                            <span class="_details_view">{{customerDetails && customerDetails.urgencyMobileNumber}}</span>
                                            <input name="urgencyMobileNumber" type="text" class=" c_d_hide on"
                                                   value="{{customerDetails && customerDetails.urgencyMobileNumber}}"
                                                   data-validator="mobile"/><em class="icf-import errortip"></em>
                                        </script>
                                        <th><label>紧急联系人电话：</label></th>
                                        <td id="_view_J_tel"></td>
                                        <script type="text/html" id="__view_J_tel">
                                            <span class="_details_view">{{customerDetails && customerDetails.urgencyPhoneNumber}}</span>
                                            <input name="urgencyPhoneNumber" type="text" class=" c_d_hide on"
                                                   value="{{customerDetails && customerDetails.urgencyPhoneNumber}}"
                                                   data-validator="phone"/><em
                                                    class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>邮编：</label></th>
                                        <td id="_view_postCode"></td>
                                        <script type="text/html" id="__view_postCode">
                                            <span class="_details_view">{{customerDetails && customerDetails.postCode}}</span>
                                            <input name="postCode" type="text" class=" c_d_hide on"
                                                   value="{{customerDetails && customerDetails.postCode}}"
                                                   data-validator="zip"/><em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>工作单位：</label></th>
                                        <td id="_view_c" colspan="3"></td>
                                        <script type="text/html" id="__view_c">
                                            <span class="_details_view">{{customerDetails && customerDetails.company}}</span>
                                            <textarea type="text" name="company" class=" c_d_hide on input-block-level"
                                                      data-validator="length[0~200]"
                                                      placeholder="不得超过100个字">{{customerDetails && customerDetails.company}}</textarea>
                                            <em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>公司地址：</label></th>
                                        <td id="_view_c_addre" colspan="3"></td>
                                        <script type="text/html" id="__view_c_addre">
                                            <span class="_details_view">{{customerDetails && customerDetails.companyAddr}}</span>
                                            <textarea name="companyAddr"
                                                      class=" c_d_hide on input-block-level" type="text"
                                                      data-validator="length[0~200]"
                                                      placeholder="不得超过100个字">{{customerDetails && customerDetails.companyAddr}}</textarea>
                                            <em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>户籍地址：</label></th>
                                        <td id="_view_h_addre" colspan="3"></td>
                                        <script type="text/html" id="__view_h_addre">
                                            <span class="_details_view">{{customerDetails && customerDetails.registerAddr}}</span>
                                            <textarea name="registerAddr"
                                                      class=" c_d_hide on input-block-level" type="text"
                                                      data-validator="length[0~200]"
                                                      placeholder="不得超过100个字">{{customerDetails && customerDetails.registerAddr}}</textarea>
                                            <em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>联系地址：</label></th>
                                        <td id="_view_conAddre" colspan="3"></td>
                                        <script type="text/html" id="__view_conAddre">
                                            <span class="_details_view">{{customerDetails && customerDetails.contactAddr}}</span>
                                            <textarea name="contactAddr"
                                                      class=" c_d_hide on input-block-level" type="text"
                                                      data-validator="length[0~200]"
                                                      placeholder="不得超过100个字">{{customerDetails && customerDetails.contactAddr}}</textarea>
                                            <em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                    <tr>
                                        <th><label>职业：</label></th>
                                        <td id="_view_job" class="_details_view" colspan="3"></td>
                                        <script type="text/html" id="__view_job">
                                            <span>{{customerDetails && customerDetails.occupationText}}</span>
                                        </script>
                                        <td class="c_d_hide on" id="_d_job" colspan="3">
                                            <script type="text/html" id="__d_job">
                                                {{each details.CustomerOccupation}}
                                                <label class="radio inline">
                                                    <input name="occupation" type="radio" value="{{$value.code}}">{{$value.value}}
                                                </label>
                                                {{/each}}
                                            </script>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>备注：</th>
                                        <td id="_view_remark" colspan="3"></td>
                                        <script type="text/html" id="__view_remark">
                                            <span class="_details_view">{{customerDetails && customerDetails.remark}}</span>
                                            <textarea name="remark"
                                                      class=" c_d_hide on input-block-level" type="text"
                                                      data-validator="length[0~200]">{{customerDetails && customerDetails.remark}}</textarea>
                                            <em class="icf-import errortip"></em>
                                        </script>
                                    </tr>
                                </table>
                            </form>
                            <hr/>
                        </div>
                        <div class="form_info">
                            <div class="panel">
                                <div class="row-fluid">
                                    <div class="panel-header span4">
                                        <div class="panel-title">
                                            <span class="icf-page"></span>
                                            个人标签
                                        </div>
                                    </div>
                                    <div class="text-right span8">
                                        <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                                            <button class="btn btn-primary" type="button" id="tags_save_btn">保存
                                            </button>
                                            <button class="btn" type="button" id="tags_cancel_btn">取消
                                            </button>
                                            <button class="btn btn-link" type="button" id="tags_edit_btn">编 辑</button>
                                        </security:isAllow>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <form id="edit_person_tips">
                                <input type="hidden" name="id" value="${customerId}"/>
                                <input type="hidden" name="houseId" value="${houseId}"/>

                                <div class="tags">
                                    <div id="_view_tags" class="_tags_view"></div>
                                    <script type="text/html" id="__view_tags">
                                        {{each details}}
                                        <span class="word" name="{{$value.id}}">{{$value.contentText}}</span>
                                        {{/each}}
                                    </script>
                                    <div class="c_tags_hide on" id="_d_tags">
                                        <script type="text/html" id="__d_tags">
                                            {{each details.CustomerTags}}
                                            <label class="checkbox inline">
                                                <input name="tagIds" type="checkbox" value="{{$value.code}}">{{$value.value}}
                                            </label>
                                            {{/each}}
                                        </script>
                                    </div>
                                </div>
                            </form>
                            <hr/>
                        </div>
                    </div>
                </div>
                <!-- 基本信息tab end -->

                <!-- 车辆tab -->
                <div class="tabcontent" id="userinfo_cheliang">
                    <div class="panel">
                        <div class="panel-body">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>车牌号</th>
                                    <th>购置时间</th>
                                    <th>车辆品牌</th>
                                    <th>车辆颜色</th>
                                    <th>状态</th>
                                    <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                                        <th>操作 <span id="btnAddCar" class="label label-info btnright"><span
                                                class="icon-plus icon-white"></span></span>
                                            <a class="h-btn none"><i class="icf-fileadd"></i></a></th>
                                    </security:isAllow>
                                </tr>
                                </thead>
                                <tbody id="customerCarsPanelBody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- 车辆tab end -->

                <!-- 宠物tab -->
                <div class="tabcontent" id="userinfo_chongwu">
                    <div class="panel">
                        <div class="panel-body">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>宠物名称</th>
                                    <th>品种</th>
                                    <th>性别</th>
                                    <th>领养时间</th>
                                    <th>状态</th>
                                    <th>描述</th>
                                    <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                                        <th>操作 <span id="btnAddPet" class="label label-info btnright"><span
                                                class="icon-plus icon-white"></span></span>
                                            <a class="h-btn none" id="btnAddPet"><i class="icf-fileadd"></i></a></th>
                                    </security:isAllow>
                                </tr>
                                </thead>
                                <tbody id="customerPetsPanelBody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- 宠物tab end -->

                <!-- 兴趣tab -->
                <div class="tabcontent" id="userinfo_xingqu">
                    <div class="panel">
                        <div class="panel-body">
                            <form class="form-inline" id="userinfo_xingqu_checkbog" action="javascript:void(0)">
                                <div class="xingqu-checkbox-group" id="customerInterstedPanelBody">

                                </div>
                                <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                                    <div class="xingqu-btns alignCenter">
                                        <button class="btn btn-primary" id="customerInterstedPanelSave">保存</button>
                                        <button class="btn" type="reset" id="customerInterstedPanelReset">重置</button>
                                    </div>
                                </security:isAllow>
                            </form>
                        </div>
                    </div>
                </div>
                <!-- 兴趣tab end -->

                <!-- 特殊身份tab -->
                <div class="tabcontent" id="userinfo_specialidentity">
                    <div class="panel">
                        <div class="panel-body">
                            <form class="form-inline" id="userinfo_specialidentity_checkbog"
                                  action="javascript:void(0)">
                                <div class="specialidentity-checkbox-group" id="customerSpecialidentityPanelBody">

                                </div>
                                <div class="jiufen on">
                                    <div id="form_starttime" style="margin-bottom:5px;">
                                        <label style="text-align:right;width:120px;">法律纠纷开始时间:</label>
                                        <input type="text" onclick="WdatePicker()" name="beginDate"
                                               class="span2 Wdate _begintime" id="beginDate"/>
                                    </div>
                                    <div id="form_chixutime">
                                        <label style="text-align:right;width:120px;">法律纠纷持续时间:</label>
                                        <select class="span2 _staytime" id="duration">
                                            <option value="">==请选择==</option>
                                            <option value="1">1月</option>
                                            <option value="3">3月</option>
                                            <option value="6">6月</option>
                                            <option value="12">12月</option>
                                        </select>
                                    </div>
                                </div>
                                <security:isAllow privilege="CUSTOMER_EDIT_HIGH">
                                <div class="xingqu-btns alignCenter">
                                    <button class="btn btn-primary" id="customerSpecialidentityPanelSave">保存</button>
                                    <button class="btn" type="reset" id="customerSpecialidentityPanelReset">重置</button>
                                </div>
                                </security:isAllow>
                            </form>
                        </div>
                    </div>
                </div>
                <!-- 特殊身份tab end -->

                <div class="tabcontent" id="userinfo_yikatong"></div>

                <!-- 影像tab -->
                <div class="tabcontent" id="userinfo_yingxiang">
                    <div class="panel">
                        <div class="panel-body">
                            <table class="table table-list">
                                <thead>
                                <tr>
                                    <th>客户名称</th>
                                    <th>影像标题</th>
                                    <th>影像类型</th>
                                    <th>扫描日期</th>
                                    <th>
                                		<security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                                        <a id="btnSacn" role="button" class="" data-toggle="modal">
	                                        <span class="label label-info btnright">
	                                        	<span class="icon-plus icon-white" style="margin-bottom:3px;"></span>
	                                    	</span>
                                        </a>
                                        </security:isAllow>
                                    </th>
                                </tr>
                                </thead>
                                <tbody id="customerScanBody">
                                <script type="text/html" id="imginfo">
                                    {{each details.bigeyes}}
                                    <tr>
                                        <td><span name="customerName"></span></td>
                                        <td><a href="{{$value.path}}" target="_blank">{{$value.title}}</a></td>
                                        <td>{{$value.docTypeText}}</td>
                                        <td>{{$value.archDate}}</td>
                                    </tr>
                                    {{/each}}
                                </script>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- 新增影像 Modal -->
                    <div id="scanModal" class="modal hide transfer-house"
                         style="width: 920px;margin-left: -450px;top:3%;" tabindex="-1" role="dialog"
                         aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-header">
                            <button type="button" class="close"
                                    onclick="closeDevice(document.getElementById('docScan'))" data-dismiss="modal"
                                    aria-hidden="true">×
                            </button>
                            <h4 id="myModalLabel">新增影像资料</h4>
                        </div>


                        <div id="customerscan" style="width: auto; min-height: 0px; max-height: none;">
                            <div style="width: 300px; float: left;">

                                <form class="form-horizontal">
                                    <div class="control-group" style="padding-top:10px;text-align:center;">

                                        <button class="btn btn-primary" type="button"
                                                onclick="openDevice(document.getElementById('docScan'))"><span
                                                class="icon-eye-open icon-white" style="margin-top:4px;"></span> 打开设备
                                        </button>
                                        <button class="btn btn-warning" type="button"
                                                onclick="closeDevice(document.getElementById('docScan'))"><span
                                                class="icon-eye-close icon-white" style="margin-top:4px;"></span> 关闭设备
                                        </button>

                                    </div>
                                    <div class="control-group">
                                        <label class="control-label " for="resolutionLb">分辨率:</label>

                                        <div class="controls">
                                            <select id="resolutionLb" class="span2"
                                                    onchange="changeResolution(document.getElementById('docScan'),this)">
                                                <option value="0">2592×1944</option>
                                                <option value="1">2048×1536</option>
                                                <option value="2">1600×1200</option>
                                                <option value="3" selected="selected">1280×1024</option>
                                                <option value="4">640×480</option>
                                                <option value="5">320×240</option>
                                            </select>
                                        </div>
                                    </div>


                                    <div class="control-group">
                                        <label class="control-label" for="sizeLb">扫描尺寸:</label>

                                        <div class="controls">
                                            <select id="sizeLb" class="span2"
                                                    onchange="changeScanSize(document.getElementById('docScan'),this)">
                                                <option value="1">A3</option>
                                                <option value="2" selected="selected">A4</option>
                                                <option value="3">A5</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="colorLb">扫描颜色:</label>

                                        <div class="controls">
                                            <select id="colorLb" class="span2"
                                                    onchange="changeScanColor(document.getElementById('docScan'),this)">
                                                <option value="0">彩色</option>
                                                <option value="1" selected="selected">灰度</option>
                                                <option value="2">黑白</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="rotateLb">旋转角度:</label>

                                        <div class="controls">
                                            <select id="rotateLb" class="span2"
                                                    onchange="changeRotate(document.getElementById('docScan'),this)">
                                                <option value="0" selected="selected">0度</option>
                                                <option value="1">90度</option>
                                                <option value="2">270度</option>
                                                <option value="3">180度</option>
                                            </select>
                                        </div>
                                    </div>

                                    <!-- <input type="text" id="" value="黑白阀值" class="hide">
                                    <input type="text" id="" value="JPG图片质量" class="hide">
                                     -->

                                    <div class="control-group">
                                        <label class="control-label" for="">文档标题:</label>

                                        <div class="controls">
                                            <input type="text" id="docTitle" class="span2">
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="docTypeLb">* 文档类型:</label>

                                        <div class="controls">
                                            <select id="docTypeLb" class="span2">
                                                <option value="DCTP">对私合同</option>
                                                <option value="DCIPS">个人证照</option>
                                                <option value="DCIPSID">身份证</option>
                                                <option value="DCIPSPP">护照</option>
                                                <option value="DCIPSOF">军官证</option>
                                                <option value="DCIPSHM">港澳居民证</option>
                                                <option value="DCIPSPC">警官证</option>
                                                <option value="DCIPSTW">台胞证</option>
                                                <option value="DCIPSNC">外国证照</option>
                                                <option value="DCICOD">印章</option>
                                                <option value="DFRCSCU">客户信息表</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <label class="control-label" for="docPageNo">当前页码:</label>

                                        <div class="controls">
                                            <input type="text" id="docPageNo" value="1" class="span2">
                                        </div>
                                    </div>
                                    <div class="control-group" style="text-align:right;padding-right:10px;">
                                        <button type="button" class="btn btn-primary" onclick="scancustomerinfo()"
                                                data-loading-text="Loading..."><span class="icon-camera icon-white"
                                                                                     style="margin-top:3px;"></span>
                                            开始扫描
                                        </button>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="docSubTypeLb">文档子类型:</label>

                                        <div class="controls">
                                            <select id="docSubTypeLb">
                                                <option value="1" label="1" class="span2"></option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="archLocation">原件归档位置:</label>

                                        <div class="controls">
                                            <input value="" id="archLocation" class="span2">
                                        </div>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="archDateDtb">归档日期:</label>

                                        <div class="controls">
                                            <input type="text" id="archDateDtb" value="" class="span2">
                                        </div>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="storageYears">保存年限:</label>

                                        <div class="controls">
                                            <input type="text" id="storageYears" value="0" class="span2">
                                        </div>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="secretLevelLb">保密级别:</label>

                                        <div class="controls">
                                            <select id="secretLevelLb" class="span2">
                                                <option value="0" selected="selected"></option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="barCode">条码值:</label>

                                        <div class="controls">
                                            <input type="text" class="span2" id="barCode" name="barCode" value="">
                                        </div>
                                    </div>

                                    <div class="control-group hide">
                                        <label class="control-label" for="scanResult">扫描结果:</label>

                                        <div class="controls">
                                            <textarea id="scanResult" class="span2" readonly cols="10"
                                                      rows="3"></textarea>
                                        </div>
                                    </div>

                                    <input type="hidden" id="companyCode" value="${companyCode}">
                                    <input type="hidden" id="projectCode" value="${projectCode}">
                                </form>
                            </div>

                            <div style="margin-left: 304px; overflow-y:auto">
                                <div>
                                    <span>已扫描的文件</span>
                                    <ul id="sanedimg">
                                    </ul>
                                </div>
                                <div id="detail-object">
                                    <object id="docScan" width="600" height="400"
                                            classid="CLSID:7AB00224-FA10-4288-9EE0-F9B291000459">
                                        <param name="IP" value="10.0.71.47">
                                        <param name="PORT" value="4875">
                                        <param name="UNIT" value="">
                                        <param name="PROJECT" value="">
                                        <param name="DOCTYPE" value="">
                                        <param name="USER" value="">
                                        <param name="USERIP" value="">
                                    </object>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button class="btn" onclick="closeDevice(document.getElementById('docScan'))"
                                    data-dismiss="modal" aria-hidden="true">关闭
                            </button>
                        </div>
                    </div>
                </div>
                <!-- 影像tab end -->

                <!-- 订阅关系tab -->
                <div class="tabcontent" id="userinfo_dingyue">
                    <div class="panel">
                        <div class="panel-header">
                            <div class="panel-title icf-bookopened"> 订阅关系</div>
                            <div class="panel-header-right">
                                <a class="btn" href="#"><i class="icf-iconbuildingalt"></i> 物业服务</a>
                                <a class="btn" href="#"><i class="icf-wuyefei"></i> 物业费</a>
                                <a class="btn" href="#"><i class="icf-gudingzichan"></i> 资产管家</a>
                                <a class="btn" href="#"><i class="icf-person1"></i> 房屋管家</a>
                                <a class="btn" href="#"><i class="icf-person2"></i> 生活管家</a>
                                <a class="btn" href="#"><i class="icf-huiyuanqia"></i> 一卡通</a>
                                <a class="btn" href="#"><i class="icf-yizhan"></i> 幸福驿站</a>
                                <a class="btn" href="#"><i class="icf-package"></i> 邮包</a>
                                <a class="btn" href="#"><i class="icf-zhanghu"></i> 账户</a>
                                <a class="btn" href="#"><i class="icf-wodezhangdan"></i> 账单</a>
                                <a class="btn" href="#"><i class="icf-iconfont04"></i> 客户访谈</a>
                            </div>
                        </div>
                        <div class="panel-body">
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
                                <tr>
                                    <td colspan="9">暂无数据</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- 订阅关系tab end -->
            </div>
        </div>
    </div>
    <!-- update pet -->
    <div class="modal hide" id="modal_updatePet">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4>宠物信息</h4>
        </div>
        <div class="modal-body">
            <form id="updatePetForm" class="form-horizontal">
                <input type="hidden" name="customerId">
                <input type="hidden" name="id">

                <div class="control-group">
                    <label class="control-label">* 宠物名称：</label>

                    <div class="controls">
                        <input type="text" name="name" data-validator="required" class="span3"/><em
                            class="icf-import errortip"></em>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label"> 品种：</label>

                    <div class="controls">
                        <select name="breed" class="span3"></select>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">* 性别：</label>

                    <div class="controls">
                        <select type="select" name="sex" class="span3" data-validator="required"></select><em
                            class="icf-import errortip"></em>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">领养时间：</label>

                    <div class="controls">
                        <input type="text" name="adoptTime" class="Wdate"
                               onClick="WdatePicker()" class="span3"/>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label"> 状态：</label>

                    <div class="controls">
                        <select type="select" name="status" class="span3" data-validator="required"></select><em
                            class="icf-import errortip"></em>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">描述：</label>

                    <div class="controls">
                        <input type="text" name="description" class="span3"/>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" id="pet_add" style="display:none">确认</a>
            <a href="#" class="btn btn-primary" id="pet_update" style="display:none">更新</a>
            <a href="#" class="btn" id="pet_cancel">取消</a>
        </div>
    </div>
    <!-- update pet end -->
    <!-- update car -->
    <div class="modal hide" id="modal_updateCar">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4>车辆信息</h4>
        </div>
        <div class="modal-body">
            <form id="updateCarForm" class="form-horizontal">
                <input type="hidden" name="customerId">
                <input type="hidden" name="id">

                <div class="control-group">
                    <label class="control-label">* 车牌号：</label>

                    <div class="controls">
                        <input type="text" name="licenseNumber" data-validator="required" class="span3"/><em
                            class="icf-import errortip"></em>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label"> 购置时间：</label>

                    <div class="controls">
                        <input type="text" name="buyTime" class="Wdate"
                               onClick="WdatePicker()" class="span3"/>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label"> 车辆品牌：</label>

                    <div class="controls">
                        <select name="brand" class="span3"></select>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">* 车辆颜色：</label>

                    <div class="controls">
                        <select name="color" data-validator="required" class="span3"></select><em
                            class="icf-import errortip"></em>
                    </div>
                </div>
                <div class="control-group">
                    <label class="control-label">* 状态：</label>

                    <div class="controls">
                        <select name="status" class="span3" data-validator="required"></select><em
                            class="icf-import errortip"></em>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn btn-primary" id="car_add" style="display:none">确认</a>
            <a href="#" class="btn btn-primary" id="car_update" style="display:none">更新</a>
            <a href="#" class="btn" id="car_cancel">取消</a>
        </div>
    </div>
    <!-- 综合版基本信息模板 -->
    <script type="text/html" id="allDetailInfoTemp">
        <div class="panel-body">
            <table class="table table-info">
                <tr>
                    <th style="width: 15%"> 姓名：</th>
                    <td style="width: 17%">{{basic && basic.fullName}}</td>
                    <th style="width: 15%">证件类型：</th>
                    <td style="width: 17%">{{basic && basic.certificateTypeText}}</td>
                    <th style="width: 15%">证件号码：</th>
                    <td style="width: 21%">{{basic && basic.certificateId}}</td>
                </tr>
                <tr>
                    <th>性别 ：</th>
                    <td>{{basic && basic.sexText}}</td>
                    <th>生日：</th>
                    <td>{{details && details.birthday}}</td>
                    <th>主用手机：</th>
                    <td>{{basic && basic.mainMobile}}</td>
                </tr>
                <tr>
                    <th>住宅电话：</th>
                    <td>{{basic && basic.homeTel}}</td>
                    <th>备用手机：</th>
                    <td>{{basic && basic.standbyMobile}}</td>
                    <th>客户类型：</th>
                    <td>{{basic && basic.customerTypeText}}</td>
                </tr>
            </table>
        </div>
        <div class="panel-body panel-hide">
            <table class="table table-info">
                <hr/>
                <tr>
                    <th style="width: 15%">客户归属：</th>
                    <td style="width: 17%">{{basic && basic.affiliationText}}</td>
                    <th style="width: 15%">办公电话：</th>
                    <td style="width: 17%">{{basic && basic.officeTel}}</td>
                    <th style="width: 15%">通讯地址：</th>
                    <td style="width: 22%">{{basic && basic.contactAddr}}</td>
                </tr>
                <tr>
                    <th>邮编 ：</th>
                    <td>{{details && details.postCode}}</td>
                    <th>QQ：</th>
                    <td>{{details && details.qq}}</td>
                    <th>Email：</th>
                    <td>{{details && details.email}}</td>
                </tr>
                <tr>
                    <th>血型：</th>
                    <td>{{details && details.bloodText}}</td>
                    <th>微信：</th>
                    <td>{{details && details.weChat}}</td>
                    <th>职业：</th>
                    <td>{{details && details.occupationText}}</td>
                </tr>
            </table>
        </div>
        <div class="panel-body panel-hide">
            <table class="table table-info">
                <hr/>
                <tr>
                    <th style="width: 15%">工作单位：</th>
                    <td style="width: 17%">{{details && details.company}}</td>
                    <th style="width: 15%">工作地址：</th>
                    <td style="width: 17%">{{details && details.companyAddr}}</td>
                    <th style="width: 15%">紧急联系人手机：</th>
                    <td style="width: 21%">{{details && details.urgencyMobileNumber}}</td>
                </tr>
                <tr>
                    <th>紧急联系人 ：</th>
                    <td>{{details && details.urgencyContacts}}</td>
                    <th>户籍地址：</th>
                    <td>{{details && details.registerAddr}}</td>
                    <th>紧急联系人电话：</th>
                    <td>{{details && details.urgencyPhoneNumber}}</td>
                </tr>
                <tr>
                    <th>备注：</th>
                    <td colspan="5">{{details && details.remark}}</td>
                </tr>
            </table>
        </div>
    </script>
    <!-- 基本信息模板 -->
    <script type="text/html" id="customerDetailInfoTemp">


    </script>
    <!-- 相关物业 -->
    <!-- {{each details as value index}}
            <a href="javascript:void(0)" class="floor-room {{value.status_style}}" data-id="{{value.id}}">-->
    <!-- <div class="room-state">常驻</div> -->
    <!-- <div class="room-num"></div>
    <div class="room-address">{{value.name}}</div>
    <div class="room-name"></div>
</a>
{{/each}}-->
    <script type="text/html" id="customerPropertyInfoTemp">
        <div class="floor-body">
        {{each details}}
            {{if $value.hasPermission}}
                <div class="floor-room floor-room-persondetail {{$value.statusStyle}} hasPermission" data-id="{{$value.id}}" building-type="{{$value.type}}"
                 style="cursor: pointer">
            {{else}}
                <div class="floor-room floor-room-persondetail {{$value.statusStyle}}" data-id="{{$value.id}}" building-type="{{$value.type}}"
                     style="cursor:no-drop">
            {{/if}}
                    <div class="alone-house-info">
                        <div class="room-address"><b>{{$value.name}}</b></div>
                    </div>
                </div>
        {{/each}}
        </div>
    </script>
    <!-- 综合车辆模板 -->
    <script type="text/html" id="allCarsInfoTemp">
        {{each details}}
        <tr>
            <td>{{$value.licenseNumber}}</td>
            <td>{{$value.buyTime}}</td>
            <td>{{$value.brandText}}</td>
            <td>{{$value.colorText}}</td>
        </tr>
        {{/each}}
    </script>
    <!-- 车辆模板 -->
    <script type="text/html" id="customerCarsInfoTemp">
        {{each details as value index}}
        <tr>
            <td>{{value.licenseNumber}}</td>
            <td>{{value.buyTime}}</td>
            <td>{{value.brandText}}</td>
            <td>{{value.colorText}}</td>
            <td>{{value.statusText}}</td>
            <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                <td>
                    <a class="edit" data-status="{{value.status}}"
                       data-licenseNumber="{{value.licenseNumber}}" data-buyTime="{{value.buyTime}}"
                       data-brand="{{value.brand}}" data-color="{{value.color}}" data-id="{{value.id}}"
                       data-customerId="{{value.customerId}}">编辑</a>
                    <a class="delete" data-id="{{value.id}}"
                       data-customerId="{{value.customerId}}">删除</a>
                </td>
            </security:isAllow>
        </tr>
        {{/each}}
    </script>
    <!-- 综合宠物信息模板 -->
    <script type="text/html" id="allPetsInfoTemp">
        {{each details}}
        <tr>
            <td>{{$value.name}}</td>
            <td>{{$value.breedText}}</td>
            <td>{{$value.sexText}}</td>
            <td>{{$value.adoptTime}}</td>
        </tr>
        {{/each}}
    </script>
    <!-- 宠物信息模板 -->
    <script type="text/html" id="customerPetsInfoTemp">
        {{each details as value index}}
        <tr>
            <td>{{value.name}}</td>
            <td>{{value.breedText}}</td>
            <td>{{value.sexText}}</td>
            <td>{{value.adoptTime}}</td>
            <td>{{value.statusText}}</td>
            <td>{{value.description}}</td>
            <security:isAllow privilege="CUSTOMER_EDIT,CUSTOMER_EDIT_HIGH">
                <td>
                    <a class="edit" data-id="{{value.id}}" data-customerId="{{value.customerId}}"
                       data-status="{{value.status}}" data-name="{{value.name}}" data-breed="{{value.breed}}"
                       data-sex="{{value.sex}}" data-adoptTime="{{value.adoptTime}}"
                       data-description="{{value.description}}">编辑</a>
                    <a class="delete" data-id="{{value.id}}"
                       data-customerId="{{value.customerId}}">删除</a>
                </td>
            </security:isAllow>
        </tr>
        {{/each}}
    </script>
    <!-- 综合版兴趣 -->
    <script type="text/html" id="allInterstedInfoTemp">
        {{each details}}
        <span class="word">{{$value.contentText}}</span>
        {{/each}}
    </script>
    <!-- 综合版兴趣 end -->
    <!-- 兴趣模板 -->
    <script type="text/html" id="customerInterstedInfoTemp">
        {{each details}}
        <label class="checkbox" style="font-size:12px;">
            <input type="checkbox" name="intersted" value="{{$value.code}}" data-id="{{$value.code}}">
            {{$value.value}}
        </label>
        {{/each}}
    </script>
    <!-- 特殊身份模板 -->
    <script type="text/html" id="customerIdentityInfoTemp">
        {{if details}}
        {{each details}}
			<label class="checkbox" style="width:140px;height:32px;font-size:12px;">
			<input type="checkbox" name="identity" value="{{$value.code}}" data-id="{{$value.code}}"/>
			{{$value.value}}
			</label>
        {{/each}}
        {{/if}}
    </script>
    <!-- 特殊身份模板 end -->
    <!-- 关系模板 -->
    <script type="text/html" id="customerRelationTemp">
        <ul>
            {{each details}}
            <li>
                <div class="relation">
                    <div class="relation-img">
                        <img src="${serverPath}/static/img/_/user03.png">
                    </div>
                    <div class="relation-center">
                        <div class="relation-name">
                            {{$value.toCustomerName}}
                        </div>
                        <div class="relation-rel">
                            {{$value.relation}}
                        </div>
                    </div>
                    <div class="relation-phone">
                        {{$value.mainMobilenumber}}
                    </div>
                </div>
            </li>
            {{/each}}
        </ul>
    </script>
    <!-- 用户信息模板 -->
    <script type="text/html" id="ownerinfoTemp">
        <div class="bi-owner-info" style="cursor:default;">
            <div class="bi-ownerbox-top">
                <div class="bi-owner-img">
                    <img src="${serverPath}/static/img/_/user03.png">
                </div>
                <div class="bi-ownerbox-info">
                    <div class="bi-owner-name">{{basic.fullName}}</div>
                    <div class="bi-owner-phone">{{basic.mainMobile}}</div>
                </div>
            </div>

            <div class="bi-owner-tags">
            </div>
        </div>
    </script>
    <!-- update car end -->
    <%@include file="/common/footer.jsp" %>
    <%-- add by liaochao 20160119 begin--%>
    <style>
         #customer_house {
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
        $("#customer_house").hide();
        $("#relation-map-back-btn").hide();
    </script>
    <%-- add by liaochao 20160119 end--%>
    <script type="text/javascript">
        window.customerId = '${customerId}';
        window.customerCode = '${code}';
        window.customerName = '${fullName}';
        window.houseId = '${houseId}';
        window.buildingId = '${buildingId}';
        window.buildingType = '${buildingType}';
        $(function () {
            $("#btn_header_customer").addClass("on");
        });
    </script>
    <script type="text/javascript" src="${staticWeb}/js/sc/customer.js?v=${javaScriptVersion}"></script>
    <script type="text/javascript" src="${staticWeb}/js/sc/customer_edit.js?v=${javaScriptVersion}"></script>
    <script type="text/javascript" src="${staticWeb}/js/sc/bigeyes.js?v=${javaScriptVersion}"></script>
    <!-- add by liaochao 20160121 begin -->
    <script type="text/javascript" src="${staticWeb}/lib/echarts.min.js?v=${javaScriptVersion}"></script>
    <script type="text/javascript" src="${staticWeb}/js/sc/customer_relation_map.js?v=${javaScriptVersion}"></script>
    <!-- add by liaochao 20160121 end -->
</body>
</html>
