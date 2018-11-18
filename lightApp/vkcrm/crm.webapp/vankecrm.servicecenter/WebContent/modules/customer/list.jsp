<!doctype html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
  <head>
    <%@include file="/common/meta.jsp" %>
  </head>
  <body>
    <style type="text/css">
      .table-list td {
        text-align: center;
        vertical-align: middle;
      }

      .table-list th {
        padding: 8px 0;
        font-weight: bold;
      }

      #searchForm table {
        margin: auto;
        width: 100%;
      }

      #searchForm table td {
        text-align: right;
        padding: 5px;
      }

    </style>
    <%@include file="/common/header.jsp" %>
    <div class="content scrollable">
      <!--<div>-->
      <div class="ly-panel on" id="personListPanel">
        <div class="ly-search-panel">
          <form class="form-inline text-center" id="searchForm">
            <table>
              <tr>
                <td>
                  <span class="add-on">姓名：</span>
                  <input type="text" name="customerName" class="input-medium"/>
                </td>
                <td>
                  <span class="add-on">手机：</span>
                  <input type="text" name="mobileNumber" class="input-medium"/>
                </td>
                <td>
                  <span class="add-on">证件类型：</span>
                  <select type="select" name="certificateType" id="certificateType" style="width: 160px;"></select>
                </td>
                <td>
                  <span class="add-on">证件号码：</span>
                  <input type="text" name="certificateId" class="input-medium"/>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="add-on">车牌号：</span>
                  <input type="text" name="licenseNumber" class="input-medium"/>
                </td>
                <td></td>
                <td></td>
                <td>
                  <div class="btn-group">
                    <button type="button" class="btn btn-primary" id="searchBtn">查询</button>
                    <button type="button" class="btn btn-primary" id="resetBtn">重置</button>
                  </div>
                </td>
              </tr>
            </table>
            <!--<span class="add-on">姓名：</span>
                <input type="text" name="customerName" class="input-medium"/>
                <span class="add-on">手机：</span><input type="text" name="mobileNumber" class="input-medium"/>
                <span class="add-on">证件类型：</span> <select type="select" name="certificateType" id="certificateType" style="width: 160px;">
                         </select>
                <span class="add-on">证件号码：</span><input type="text" name="certificateId" class="input-medium"/>
                <span class="add-on">车牌号：</span><input type="text" name="licenseNumber" class="input-medium"/>
                <div class="btn-group">
                  <button type="button" class="btn btn-primary" id="searchBtn">查询</button>
                  <button type="button" class="btn btn-primary" id="resetBtn">重置</button>
                </div>-->
          </form>
        </div>
        <!--<div>-->
        <div class="panel" style="padding-top:0px;">
          <div class="panel-header">
            <div class="panel-title icf-bookopened">
              客户列表</div>
          </div>
          <div class="panel-body">
            <div id="customerTable"></div>
            <div class="pagination" id="pagination"></div>
          </div>
        </div>
        <!--</div>-->
      </div>
      <div class="ly-panel" id="personComplainPanel"></div>
      <div class="ly-panel" id="personCarePanel"></div>
      <div class="ly-panel" id="personOrderPanel"></div>
      <!--</div>-->
    </div>
    <script type="text/html" id="customerTableTemplate">
      <div>
        <table class="table table-list">
          <thead>
            <tr>
              <th>姓名</th>
              <th>电话</th>
              <th>相关物业</th>
              <th>与房屋关系</th>
              <th>与房屋状态</th>
              <th>证件类型</th>
              <th>证件号码</th>
              <th>车牌号</th>
              <th>详情</th>
            </tr>
          </thead>
          <tbody>
            {{if list}}
            {{each list}}
            <tr>
              {{if $value}}
              <td>{{$value.customerName}}</td>
              <td>{{$value.mainMobile}}</td>
              <td style="text-align:left;">{{$value.houseName}}</td>
              <td>{{$value.relationTypeText}}</td>
              <td>{{$value.type}}</td>
              <td>{{$value.certificateTypeText}}</td>
              <td>{{$value.certificateId}}</td>
              <td title="{{$value.licenseNumber}}">{{$value.licenseNumber}}</td>
              {{if $value.houseId}}
              <td>
                <a class="btn btn-link" href="${serverPath}/page/customer/{{$value.customerId}}/details?houseId={{$value.houseId}}">详情</a>
              </td>
            {{else}}
              <td>
                <a class="btn btn-link" href="${serverPath}/page/customer/{{$value.customerId}}/details">详情</a>
              </td>
            {{/if}}
          {{/if}}
        </tr>
      {{/each}}
    {{else}}
      <td colspan="8">暂无数据</td>
    {{/if}}
  </tbody>
</table>
</div>
</script>
<script type="text/html" id="selectTemplate">
<option value=""></option>
{{if details.CustomerCertificateType}}
{{each details.CustomerCertificateType}}
{{if $value}}
<option value="{{$value.code}}">{{$value.value}}</option>
{{/if}}
{{/each}}
{{/if}}
</script>
<%@include file="/common/footer.jsp" %>
<script type="text/javascript">
$(function () {
  $("#btn_header_customer").addClass("on");
});
</script>
<script type="text/javascript" src="${staticWeb}/js/sc/customer_list.js?v=${javaScriptVersion}"></script>
</body>
</html>
