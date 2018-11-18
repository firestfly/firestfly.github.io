<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>

<html>
<head>
    <%@include file="/common/meta.jsp" %>
    <title>装修备案表</title>
    <meta name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="${serverPath}/static/css/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="${serverPath}/static/assets/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="${serverPath}/static/css/base.css">
    <link href="${serverPath}/static/js/datepicker/skin/WdatePicker.css" rel="stylesheet" type="text/css">
    <link href="${serverPath}/static/js/jquery-impromptu/jquery-impromptu.min.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="${serverPath}/static/css/common.css">
</head>
<style>
.card {width: 900px;margin: 0 auto;}
</style>
<body>
    <form action="" class="p5" ms-controller="material">
        <div class="edite">
            <div class="btn-group w150 mb20">
                <span class="btn btn-sm btn-success" ms-if="!data.serialNumber || (data.serialNumber && data.isPrint == 0)" ms-click="save(0)">保存</span>
                <span class="btn btn-sm btn-success" ms-click="print">打印</span>
                <a class="btn btn-sm btn-success" href="${serverPath}/index.jsp">返回</a>
            </div>
            <input type="hidden" name="isPrint" ms-duplex="data.isPrint">
        </div>
        <div class="card tc">
            <h1>物资搬出情况登记表</h1>
            <p class="tl">
                <b>编号：</b>
                <input type="hidden" value="VK-WY/TX08-K04-F2"> VK-WY/TX08-K04-F2
                <b class="ml10">版本：</b>
                <input type="hidden" name="version" value="V1.0"> A/0
                <b class="ml10">生效日期：</b>
                <input type="hidden" name="effectDate" ms-attr-value="data.effectDate"> {{data.effectDate | date("yyyy年M月d日")}}
                <b class="ml10">序列号：</b>
                <input type="hidden" name="serialNumber" ms-if="data.serialNumber" ms-attr-value="data.serialNumber">{{ data.serialNumber }}
            </p>
            <table class="table table-list">
                <tbody>
                    <tr>
                        <td colspan="2">部门</td>
                        <td colspan="4" width="32%">
                            <div class="pa f16 input-invalidate" ms-if="!data.department">*</div>
                            <input type="text" name="department" ms-duplex="data.department" class="input-noborder w">
                        </td>
                        <td colspan="2" width="25%">
                            日期
                        </td>
                        <td colspan="4">
                            <div class="pa f16 input-invalidate" ms-if="!data.startTime">*</div>
                            <input type="text" name="startTime" ms-duplex="data.startTime" onclick="WdatePicker({dateFmt:'yyyy-M-d'})" class="input-noborder tl">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">房号</td>
                        <td colspan="4">
                            <div class="pa f16 input-invalidate" ms-if="!data.roomNum">*</div>
                            <input type="text" name="roomNum" ms-duplex="data.roomNum" class="input-noborder w">
                        </td>
                        <td colspan="2">房屋性质</td>
                        <td colspan="4">
                            <i class="icon-check-empty"></i>租用
                            <i class="icon-check-empty"></i>自用
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">申办人</td>
                        <td colspan="4">
                            <div class="pa f16 input-invalidate" ms-if="!data.bidPerson">*</div>
                            <input type="text" name="bidPerson" ms-duplex="data.bidPerson" class="input-noborder w">
                        </td>
                        <td colspan="2">证件号码</td>
                        <td colspan="4" class="tl">
                            <div class="pa f16 input-invalidate" ms-if="!data.idNum">*</div>
                            <input type="text" name="idNum" ms-duplex="data.idNum" class="input-noborder w200">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">确认方式</td>
                        <td colspan="10" class="tl">
                            
                            <div>
                                <i class="icon-check-empty"></i>
                                业主本人（签名：<input type="text" name="ownerSignature" class="input-noborder w100">）
                            </div>
                            <div>
                                <i class="icon-check-empty"></i>电话（号码：
                                <input type="text" name="telNum" class="input-noborder w150"> 确认时间：
                                <input type="text" name="confirmTime" onclick="WdatePicker({dateFmt:'yyyy-M-d'})" class="input-noborder">）
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">搬离原因</td>
                        <td colspan="10" class="tl">
                            <i class="icon-check-empty"></i>装修完成
                            <i class="icon-check-empty"></i>承租期满
                            <i class="icon-check-empty"></i>房屋转让
                            <i class="icon-check-empty"></i>其他
                            <input class="input-border-bottom w200" type="text">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">序号</td>
                        <td colspan="4">物资名称</td>
                        <td>数量</td>
                        <td colspan="2">规格/型号</td>
                        <td colspan="3">备注</td>
                    </tr>
                    <tr ms-repeat-row="data.materialList">
                        <td colspan="2">
                            <input type="text" ms-duplex="row.sortNum" class="input-noborder w tc" </td>
                            <td colspan="4">
                                <input type="text" ms-duplex="row.materialName" class="input-noborder w tc">
                            </td>
                            <td>
                                <input type="text" ms-duplex="row.num" class="input-noborder w tc">
                            </td>
                            <td colspan="2">
                                <input type="text" ms-duplex="row.model" class="input-noborder w tc">
                            </td>
                            <td colspan="3">
                                <input type="text" ms-duplex="row.remark" class="input-noborder w tc">
                            </td>
                    </tr>
                    <tr>
                        <td rowspan="4" colspan="2">搬运车辆资料</td>
                        <td colspan="2">车牌号码</td>
                        <td colspan="3">
                            <input type="text" name="carNum" ms-duplex="data.carNum" class="input-noborder w">
                        </td>
                        <td colspan="2">车型</td>
                        <td colspan="3">
                            <input type="text" name="carModels" ms-duplex="data.carModels" class="input-noborder w">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">司机驾驶证号</td>
                        <td colspan="3">
                            <input type="text" name="driverLicense" ms-duplex="data.driverLicense" class="input-noborder w">
                        </td>
                        
                        <td colspan="2">颜色</td>
                        <td colspan="3">
                            <input type="text" name="carColor" ms-duplex="data.carColor" class="input-noborder w">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">发证机关</td>
                        <td colspan="8">
                            <input type="text" name="authority" ms-duplex="data.authority" class="input-noborder w">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">档案编号</td>
                        <td colspan="8">
                            <input type="text" name="archivesNum" ms-duplex="data.archivesNum" class="input-noborder w">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">其他证号</td>
                        <td colspan="10">
                            <input type="text" name="otherNum" ms-duplex="data.otherNum" class="input-noborder w">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">部门经手人</td>
                        <td colspan="2">
                            <input type="text" name="handlingDepartment" ms-duplex="data.handlingDepartment" class="input-noborder w">
                        </td>
                        <td colspan="2">出纳员/授权人</td>
                        <td colspan="2">
                            <input type="text" name="cashier" ms-duplex="data.cashier" class="input-noborder w">
                        </td>
                        <td colspan="2">安全员</td>
                        <td colspan="2">
                            <input type="text" name="securityOfficer" ms-duplex="data.securityOfficer" class="input-noborder w">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">备注</td>
                        <td colspan="10">
                            <input type="text" name="remark" ms-duplex="data.remark" class="input-noborder w">
                        </td>
                    </tr>
                </tbody>
            </table>
            <p class="tl">注：1.口内打勾；2.业主本人办理，核实后无须填写证件号码。</p>
        </div>
    </form>
    <script src="${serverPath}/static/js/jquery.min.js?v=1.11.3"></script>
    <script src="${serverPath}/static/js/jquery-impromptu/jquery-impromptu.min.js"></script>
    <script src="${serverPath}/static/js/avalon/dist/avalon.min.js"></script>
    <script src="${serverPath}/static/js/datepicker/WdatePicker.js"></script>
    <script src="${serverPath}/static/js/common.js"></script>
    <script src="${serverPath}/static/js/views/material.js"></script>
</body>


</html>
