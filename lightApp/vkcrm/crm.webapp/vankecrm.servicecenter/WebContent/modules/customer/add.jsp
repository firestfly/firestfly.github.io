<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% request.setAttribute("headerBtn3", "on"); %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
    <title>新增客户</title>
    <script type="text/javascript">
        window.houseId = '${houseId}';
        window.pendingId = '${param.pendingId}';
    </script>
</head>
<style>
    .jiufen.on {
        display: none;
    }

    .c_form {
        padding: 0;
    }

    .addc_query_info {

    }

    .table-list td {
        text-align: center;
        vertical-align: middle;
    }

    .dtn-icon-back {
        line-height: 60px;
        font-size: 16px;
        color: #08c;
    }

    .span3 {
        margin-top: 14px;
    }

    .content.scrollable.c_form {
        position: relative;
    }

    #addc-form {
        position: absolute;
        top: 55px;
        bottom: 112px;
        right: 0px;
        left: 0px;
        overflow: auto;
    }

    .form-actions {
        padding: 0px 20px !important;
    }

    .dtn-bottom-btnbox {
        position: absolute;
        bottom: 41px;
        left: 0px;
        right: 0px;
    }

    .input-medium {
        width: 156px;
    }
</style>
<body>
<div class="wrap">
    <%@include file="/common/header.jsp" %>
    <div class="content scrollable c_search">
        <div style="float:left;width:59px;height:59px;background:#f5f5f5; border-top:1px solid #e5e5e5; border-right:1px solid #e5e5e5;">
            <a href="javascript:history.go(-1);" title="返回" class="dtn-icon-back">
                <span class="icf-back" style="line-height:14px; font-size:1.2em;margin-left:1em;"></span>
            </a>
        </div>
        <div style="margin-left:60px;">
            <form class="form-inline text-center" id="searchForm">
                <div class="panel form-actions">
                    <div class="panel-header">
                        <div class="row-fluid">
                            <div class="span3">
                                <span class="add-on">姓名：</span>
                                <input class="input-medium" type="text" name="name"/>
                            </div>
                            <div class="span3">
                                <span class="add-on">电话：</span>
                                <input class="input-medium" type="text" name="phone">
                            </div>
                            <div class="span3">
                                <span class="add-on">证件：</span>
                                <input class="input-medium" type="text" name="cardNum">
                            </div>
                            <div class="span3">
                                <div class="btn-group">
                                    <button type="button" id="searchBtn" class="btn btn-primary"><i
                                            class="icon-search icon-white"></i>查询
                                    </button>
                                    <button type="button" id="addUserBtn" class="btn"><i class="icon-plus"></i>新增
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="addc_query_info">
            <div class="panel" style="padding-top:0px;">
                <div class="panel-header">
                    <div class="panel-title">
                        <span class="icf-bookopened"></span>
                        客户列表
                    </div>
                </div>
                <div class="panel-body relative" id="customerTableDiv" style="min-height:400px;">
                    <table class="table table-list">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>姓名</th>
                            <th>电话</th>
                            <th>证件号码</th>
                            <th class="y_init">与房屋关系</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody id="customerTableBody"></tbody>
                        <script id="__view_search_list" type="text/html">
                            {{if details.customers.list && details.customers.list.length > 0}}
                            {{each details.customers.list}}
                            {{if $value}}
                            <tr>
                                <td>{{$index + 1}}</td>
                                <td>{{$value.fullName}}</td>
                                <td>{{$value.mainMobile}}</td>
                                <td>{{$value.certificateId}}</td>
                                <td>
                                    <form id="{{$value.id}}" action="javascript:void(0);">
                                        <div class="control-group">
                                            <div class="controls dtn-controls">
                                                {{include 'checkboxTemplate' details}}
                                            </div>
                                        </div>
                                    </form>
                                </td>
                                <td>
                                    <div>
                                        <a href="javascript:void(0);" data-id="{{$value.id}}">确认添加</a>
                                    </div>
                                </td>
                            </tr>
                            {{/if}}
                            {{/each}}
                            {{else }}
                            <td colspan="6">暂无数据</td>
                            {{/if}}
                        </script>
                    </table>
                    <div class="pagination" id="pagination"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="content scrollable c_form ">
        <div class="addc_user_lbs">
        </div>
        <div id="addc-form">
            <form method="post" id="form_Customer">
                <div class="panel form-actions">
                    <div class="panel-header">
                        <div class="panel-title icf-page"> 基本信息</div>
                    </div>
                    <table class="table table-newuser dtn-controls">
                        <tr>
                            <th><label>姓名：</label></th>
                            <td><input id="check_name" name="basic.fullName" type="text" class="input-medium"
                                       data-validator="required,length[0~50]" tipsy-render="true"
                                       placeholder="必填"/>
                                <em class="icf-import errortip"></em></td>
                            <th><label>证件类型：</label></th>
                            <td>
                                <select name="basic.certificateType" class="span2" data-validator="required"
                                        id="_d_cardType"> </select>
                                <em class="icf-import errortip"></em></td>
                            <script type="text/html" id="__d_cardType">
                                {{each details.CustomerCertificateType}}
                                    {{ #$value | option: "1"}}
                                {{/each}}
                            </script>
                            <th><label>证件号码：</label></th>
                            <td><input id="check_idcard" name="basic.certificateId" type="text" class="input-medium"
                                       data-validator="required,func[validateIdcard]"
                                       tipsy-render="true" placeholder="必填"/><em class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label>性别：</label></th>
                            <td id="_d_sex"><em class="icf-import errortip"></em></td>
                            <script id="__d_sex" type="text/html">
                                {{each details.CustomerSex}}
                                {{if $value}}
                                <label class="radio inline">
                                    <input type="radio" name="basic.sex" class="J_form_sex_male" value="{{$value.code}}"
                                           {{if $value.code== "3"}} checked="checked"{{/if}}>{{$value.value}}
                                </label>
                                {{/if}}
                                {{/each}}
                            </script>
                            <th><label>主用手机：</label></th>
                            <td><input name="basic.mainMobile" type="text" class="input-medium"
                                       data-validator="required,phone"
                                       tipsy-render="true" placeholder="必填"/><em class="icf-import errortip"></em></td>
                            <th><label>备用手机：</label></th>
                            <td><input type="text" name="basic.standbyMobile" class="input-medium"
                                       data-validator="mobile"
                                       tipsy-render="true"/><em class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label>办公电话：</label></th>
                            <td><input name="basic.officeTel" type="text" class="input-medium"
                                       data-validator="phone"
                                       tipsy-render="true"/><em class="icf-import errortip"></em></td>
                            <th><label>客户类型：</label></th>
                            <td>
                                <select class="span2" name="basic.customerType" id="_d_customerType"
                                        data-validator="required"></select>
                                <em class="icf-import errortip"></em></td>
                            <script id="__d_customerType" type="text/html">
                                {{each details.CustomerType}}
                                    {{ #$value | option: "2"}}
                                {{/each}}
                            </script>
                            <th><label>客户归属：</label></th>
                            <td>
                                <select name="basic.affiliation" class="span2" id="_d_affiliation"> </select>
                                <em class="icf-import errortip"></em></td>
                            <script id="__d_affiliation" type="text/html">
                                {{each details.CustomerAffilication}}
                                    {{ #$value | option: "2"}}
                                {{/each}}
                            </script>
                        </tr>
                        <tr>
                            <th><label>住宅电话：</label></th>
                            <td><input name="basic.homeTel" type="text" class="input-medium" data-validator="phone"
                                       tipsy-render="true"/><em class="icf-import errortip"></em></td>
                        </tr>
                    </table>
                </div>
            </form>

            <form method="post" id="form_houseRel">
                <div class="panel form-actions">
                    <div class="panel-header">
                        <div class="panel-title icf-page"> 房屋关系</div>
                    </div>
                    <div class="control-group">
                        <div class="controls dtn-controls" id="_d_houseRel"></div>
                        <script id="__d_houseRel" type="text/html">
                            {{each details.HouseCustomerRelationType}}
                            {{if $value}}
                            <label class="checkbox inline checkbox_house" style="width:80px;">
                                <input type="checkbox" name="houseRelationTypes" data-validator="required"
                                       value="{{$value.code}}">{{$value.value}}</label>
                            {{/if}}
                            {{/each}}
                            <em class="icf-import errortip"></em>
                        </script>
                    </div>
                </div>
            </form>

            <form method="post" id="form_CustomerDetail">
                <div class="panel form-actions">
                    <div class="panel-header">
                        <div class="panel-title icf-page"> 详细信息</div>
                    </div>
                    <table class="table table-newuser dtn-controls">
                        <tr>
                            <th><label>邮箱：</label></th>
                            <td><input name="details.email" type="email" class="input-medium" data-validator="email"
                                       tipsy-render="true"/><em class="icf-import errortip"></em></td>
                            <th><label>QQ：</label></th>
                            <td><input name="details.qq" type="text" class="input-medium" data-validator="qq"
                                       tipsy-render="true"/>
                                <em class="icf-import errortip"></em></td>
                            <th><label>微信号：</label></th>
                            <td><input name="details.weChat" type="text" class="input-medium"
                                       data-validator="specialCaracters"/><em class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label>血型：</label></th>
                            <td>
                                <select name="details.blood" class="span2" id="_d_bloodType"></select>
                                <script type="text/html" id="__d_bloodType">
                                    {{each details.CustomerBlood}}
                                        {{ #$value | option: "8"}}
                                    {{/each}}
                                </script>
                                <em class="icf-import errortip"></em></td>
                            <th><label>生日：</label></th>
                            <td><input name="details.birthday" type="text" onclick="WdatePicker()"
                                       class="input-medium Wdate" data-validator="date"/><em
                                    class="icf-import errortip"></em></td>
                            <th><label>邮编：</label></th>
                            <td><input name="details.postCode" type="text" class="input-medium" data-validator="zip"
                                       tipsy-render="true"/><em class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label>紧急联系人：</label></th>
                            <td><input name="details.urgencyContacts" type="text" class="input-medium" data-validator="length[0~50]"/><em
                                    class="icf-import errortip" ></em>
                            </td>
                            <th><label>紧急联系人手机：</label></th>
                            <td><input name="details.urgencyMobileNumber" type="text" class="input-medium"
                                       data-validator="mobile"
                                       tipsy-render="true"/><em class="icf-import errortip"></em></td>
                            <th><label>紧急联系电话：</label></th>
                            <td><input name="details.urgencyPhoneNumber" type="text" class="input-medium"
                                       data-validator="phone" tipsy-render="true"/><em
                                    class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label> 工作单位：</label></th>
                            <td colspan="5">
                                <input name="details.company" type="text" class="input-block-level"
                                       data-validator="length[0~200]" style="width: 95%;"/><em
                                    class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label> 公司地址：</label></th>
                            <td colspan="5">
                                <input name="details.companyAddr" type="text" class="input-block-level"
                                       data-validator="length[0~200]" style="width: 95%;"/><em
                                    class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label>户籍地址：</label></th>
                            <td colspan="5">
                                <input name="details.registerAddr" type="text" class="input-block-level"
                                       data-validator="length[0~200]" style="width: 95%;"/><em
                                    class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label> 通讯地址：</label></th>
                            <td colspan="5">
                                <input name="details.contactAddr" type="text" class="input-block-level"
                                       data-validator="length[0~200]" style="width: 95%;"/><em
                                    class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th><label>职业：</label></th>
                            <td colspan="5">
                                <div class="controls dtn-radioBOX" id="_d_job"></div>
                                <script id="__d_job" type="text/html">
                                    {{each details.CustomerOccupation}}
                                    {{if $value}}
                                    <label class="radio inline" style="width:160px;">
                                        <input name="details.occupation" type="radio" value="{{$value.code}}" checked>{{$value.value}}
                                    </label>
                                    {{/if}}
                                    {{/each}}
                                </script>
                                <em class="icf-import errortip"></em></td>
                        </tr>
                        <tr>
                            <th>备注：</th>
                            <td colspan="5">
                                <textarea name="details.remark" type="text" class="input-block-level"
                                          data-validator="length[0~200]"></textarea>
                                <em class="icf-import errortip"></em></td>
                        </tr>
                    </table>
                </div>
            </form>

            <form method="post" id="form_hobbies">
                <div class="panel form-actions">
                    <div class="panel-header">
                        <div class="panel-title icf-page"> 兴趣爱好</div>
                    </div>
                    <div class="control-group addc_hobbies">
                        <div class="controls dtn-controls" id="_d_hobby"></div>
                        <script id="__d_hobby" type="text/html">
                            {{each details.CustomerHobbies}}
                            {{if $value}}
                            <label class="checkbox inline" style="width:110px;">
                                <input name="hobbies" type="checkbox" value="{{$value.code}}">{{$value.value}}
                            </label>
                            {{/if}}
                            {{/each}}
                        </script>
                    </div>
                </div>
            </form>

            <form method="post" id="form_kehuRel">
                <div class="panel form-actions">
                    <div class="panel-header">
                        <div class="panel-title icf-page"> 业主关系</div>
                    </div>
                    <div class="control-group">
                        <ul class="unstyled inline" id="_view_customer_listBody"></ul>
                        <script type="text/html" id="__view_customer_listBody">
                            {{each details}}
                            {{if $value}}
                            <li> 与业主{{$value.fullName}}关系：
                                <input type="hidden" value="{{$value.customerId}}" name="customerId"/>
                                <select name="relationType" class="span2 relationselect"
                                        data-validator="required"></select>
                            </li>
                            {{/if}}
                            {{/each}}
                        </script>
                    </div>
                </div>
            </form>

            <form method="post" id="form_Specialidentity">
                <div class="panel form-actions">
                    <div class="panel-header">
                        <div class="panel-title icf-page"> 特殊身份</div>
                    </div>
                    <div class="jiufen on">
                        <div id="form_starttime">
                            <label style="line-height:28px;">
                                法律纠纷开始时间:
                                <input type="text" onclick="WdatePicker()" name="beginDate"
                                       class="span3 Wdate _begintime"/>
                            </label>
                        </div>
                        <div id="form_chixutime">
                            <label>
                                法律纠纷持续时间:
                                <select class="_staytime">
                                    <option value=""></option>
                                    <option value="1">1月</option>
                                    <option value="3">3月</option>
                                    <option value="6">6月</option>
                                    <option value="12">12月</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="control-group addc_specialidentity">
                        <div class="controls dtn-controls" id="_d_sp"></div>
                        <script id="__d_sp" type="text/html">
                            {{each details.CustomerIdentity}}
                            {{if $value}}
                            <label class="checkbox inline" style="width:140px;">
                                <input class="checkbox_shenfen" name="identity" type="checkbox" value="{{$value.code}}">{{$value.value}}
                            </label>
                            {{/if}}
                            {{/each}}
                        </script>
                    </div>
                </div>
            </form>

            <form method="post" id="form_houseID" class="hide">
                <label>房屋id</label>
                <input type="text" id="houseId" name="houseId" value=""/>
            </form>
        </div>
        <div class="form-actions text-center dtn-bottom-btnbox">
            <button id="addc_form_btn" class="btn btn-primary " type="button" data-loading-text="数据保存中..."
                    style="margin:20px 0;">保存数据
            </button>
            <button id="cancelc_form_btn" class="btn" type="button" style="margin:20px 0;">返回列表</button>
            <a id="cancelToWorkbench_btn"  class="btn" style="margin:20px 0;display:none" href="javascript:history.go(-1);">返回</a>
        </div>
        <script id="selectTemplate" type="text/html">
            {{if list}}
            {{each list}}
            {{if $value}}
            <option value="{{$value.code}}" {{if $value.code == "9"}}selected="selected"{{/if}}>{{$value.value}}</option>
            {{/if}}
            {{/each}}
            {{/if}}
        </script>
        <script id="checkboxTemplate" type="text/html">
            {{if items}}
            {{each items}}
            {{if $value}}
            <label class="checkbox inline">
                <input name="relationType" type="checkbox" value="{{$value.code}}">{{$value.value}}
            </label>
            {{/if}}
            {{/each}}
            {{/if}}
        </script>
    </div>
</div>
<%@include file="/common/footer.jsp" %>
<script type="text/javascript" src="${staticWeb}/js/sc/customer_add.js"></script>
<script type="text/javascript">
    $(function () {
        $("#btn_header_customer").addClass("on");
    });
</script>
</body>
</html>
