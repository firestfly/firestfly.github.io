<!doctype html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
<body>
<style type="text/css">
    .table-list td { text-align: center; vertical-align: middle; }
    .table-list th { padding: 8px 0; font-weight: bold; }
    #searchForm table { margin: auto; width: 100%; }
    #searchForm table td { text-align: right; padding: 5px; }
</style>
<%@include file="/common/header.jsp" %>
<script type="text/javascript">
	var importType = '${importTypeCode}';
	var importName = '${importTypeName}';
</script>
<div class="content scrollable">
    <div class="ly-panel on" id="personListPanel">
        <div class="ly-search-panel">
            <form class="form-inline text-center" id="searchForm">
                <table>
                    <tr>
                        <td>
                            <span class="add-on">上传用户 ：</span>
                            <input type="text" name="createdBy" id="createdBy" maxlength="10"/>
                        </td>
                        <td>
                            <span class="add-on">上传时间 ：</span>
                            <input type="text" name="beginTime" id="beginTime" class="Wdate" onClick="WdatePicker()" style="width: 90px"/>
                        </td>
                        <td>
                            <span class="add-on">至</span>
                            <input type="text" name="endTime" id="endTime" class="Wdate" onClick="WdatePicker()" style="width: 90px"/>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button type="button" onclick="loadNotPayCustomers()" id="selectNotPayCustomerImportCustomer" class="btn btn-primary">查询</button>
                                <button type="button" class="btn btn-primary" id="resetBtn">重置</button>
                            </div>
                        </td>
                    </tr>
                </table>
            </form>
        </div>

        <div class="panel" style="padding-top:0px;">
            <div class="panel-header">
                <div class="panel-title icf-bookopened">${importTypeName}列表</div>
                <a class="btn btn-warning" href="#importCustomerModal" data-toggle="modal"><i class="icf-jianlidaochumoban"></i>${importTypeName}模板下载</a>
                <a class="btn btn-warning" href="#importCustomerModal" data-toggle="modal"><i class="icf-jianlidaochumoban"></i>导入${importTypeName}</a>
            </div>
            <div id="lstNotPayCustomers"></div>
            <div class="pagination" id="paginationNotPay"></div>
        </div>
	</div>
</div>

<!--导入已交付客户对话框-->
<div id="importCustomerModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="mergeModalLabel" aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h5>导入${importTypeName}</h5>
    </div>
    <div class="modal-body">
        <div class="panel">
            <form action="${serverPath}/customer/notPay/upload"
                  enctype="multipart/form-data"
                  method="post"
                  id="frmUploadNotPayCustomer">
                <div>
                <input type="hidden" id="importType" name="importType" value="${importTypeCode}"/>
                上传文件：<input type="file" name="file_upload"/>
                </div>
            </form>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal">关闭</button>
        <button id="btnUploadNotPayCustomer" class="btn btn-primary">导入</button>
    </div>
</div>

<%@include file="/common/footer.jsp" %>

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
        <td style="text-align: center;">{{value.totalNums}} / {{value.successNums}} / {{value.errorNums}}</td>
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
<script type="text/javascript" src="${staticWeb}/lib/jquery.form.min.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/sc/import.js?v=${javaScriptVersion}"></script>
<script type="text/javascript">
    $(function () {
        // 上传文件
        var options = {
            target: '#ajaxFormCallback',
            beforeSubmit: function () {
            },
            success: function (responseText, statusText, xhr, $form) {
                if (responseText.success) {
                    Common.tip.add({
                        text: "上传成功!",
                        type: 'success'
                    });
                } else {
                    Common.tip.add({
                        text: responseText.message,
                        type: 'warning'
                    });
                }
            }
        };
        $('#frmUploadNotPayCustomer').submit(function () {
            $(this).ajaxSubmit(options);
            return false;
        });
        $("#btnUploadNotPayCustomer").on('click', function () {
            $("#btnUploadNotPayCustomer").addClass("disabled");
            $('#frmUploadNotPayCustomer').trigger('submit');
        });
    });
</script>
<div class="hidden" id="ajaxFormCallback"></div>
<iframe id="downloadFileFrameID" name="downloadFileFrameName" style="display:none" onload="downloadFileFrameOnload()"></iframe>
<iframe id="downloadFileFrameID1" name="downloadFileFrameName1" style="display:none"></iframe>
<iframe id="downloadFileFrameID2" name="downloadFileFrameName2" style="display:none"></iframe>

</body>
</html>