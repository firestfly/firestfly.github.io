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
.card { width: 800px; margin: 0 auto; text-align: center; }
.header img { vertical-align: middle; }
.input-invalidate { color: red; }
#searchHouse table {margin-bottom: 0;}
#searchHouse .table-list th:first-child,
#searchHouse .table-list td:first-child {
    border-left: 1px solid #ddd;
}
#searchHouse .table>tbody>tr>td,
#searchHouse .table>tbody>tr>th, 
#searchHouse.table>tfoot>tr>td,
#searchHouse .table>tfoot>tr>th,
#searchHouse .table>thead>tr>td,
#searchHouse .table>thead>tr>th {
    border-top: 1px solid #ddd;
}
</style>
<body>
    <form method="post" ms-controller="decorationRecord" name="decorationForm" id="decorationForm" class="form-inline">
        <div class="edite  print-hidden">
            <div class="btn-group w150 mb20">
                <span class="btn btn-sm btn-success" ms-if="!data.serialNumber || (data.serialNumber && data.isPrint == 0)" ms-click="save(0)">保存</span>
                <span class="btn btn-sm btn-success" ms-click="print">打印</span>
                <a class="btn btn-sm btn-success" href="${serverPath}/index.jsp">返回</a>
            </div>
            <input type="hidden" name="isPrint" ms-duplex="data.isPrint">
        </div>
        <div class="card tc">
            <div class="header"><img src="${serverPath}/static/img/timg.jpg" alt="" height=50></div>
            <h3>装修备案表</h3>
            <p class="tl">
                <b>编号：</b>
                <input type="hidden" value="VK-WY/TX08-K04-F1"> VK-WY/TX08-K04-F1
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
                        <td colspan="2">业主姓名</td>
                        <td colspan="4">
                            <div class="pa f16 input-invalidate" ms-if="!data.customerName">*</div>
                            <input type="text" ms-attr-readonly="(+data.isPrint != 0)" pattern="^(([\u4E00-\u9FA5]{2,7})|([a-zA-Z]+))$" data-errtips="业主姓名填写有误" name="customerName" ms-duplex="data.customerName" class="input-noborder w" disableautocomplete autocomplete="off" ms-blur="validate">
                        </td>
                        <td colspan="2">装修负责人</td>
                        <td colspan="4">
                            <div class="pa f16 input-invalidate" ms-if="!data.decorationName">*</div>
                            <input type="text" ms-attr-readonly="(+data.isPrint != 0)" pattern="^(([\u4E00-\u9FA5]{2,7})|([a-zA-Z]+))$" data-errtips="装修负责人填写有误" ms-blur="validate" name="decorationName" ms-duplex="data.decorationName" class="input-noborder w" disableautocomplete autocomplete="off">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">房号</td>
                        <td colspan="4" style="word-break: break-all;">
                            <div class="pa f16 input-invalidate" ms-if="!data.houseName">*</div>
                            <input type="text" ms-attr-readonly="(+data.isPrint != 0)" ms-blur="validate" name="houseName" data-errtips="房号填写有误" ms-duplex="data.houseName" class="input-noborder w150 fl" disableautocomplete autocomplete="off" ms-visible="!(+data.isPrint != 0)">
                            <div class="btn btn-primary btn-xs fr" data-backdrop="static" data-toggle="modal" data-target="#searchHouse" ms-click="searchHouse">搜索</div>
                            <div ms-visible="(+data.isPrint != 0)" class="tl">{{ data.houseName }}</div>
                        </td>
                        <td colspan="2">装修单位</td>
                        <td colspan="4" style="word-break: break-all;">
                            <div class="pa f16 input-invalidate" ms-if="!data.decorationUnit">*</div>
                            <input type="text" ms-visible="!(+data.isPrint != 0)" ms-attr-readonly="(+data.isPrint != 0)" ms-blur="validate" name="decorationUnit" data-errtips="装修单位填写有误" ms-duplex="data.decorationUnit" class="input-noborder w" disableautocomplete autocomplete="off">
                            <div ms-visible="(+data.isPrint != 0)" style="word-break: break-word;text-align: left;">{{ data.decorationUnit }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">业主电话</td>
                        <td colspan="4">
                            <div class="pa f16 input-invalidate" ms-if="!data.mobilePhone">*</div>
                            <input type="text" ms-attr-readonly="(+data.isPrint != 0)" ms-blur="validate" data-errtips="业主电话号码格式不正确" pattern="(^0\d{9,11}$)|(^1\d{10}$)" name="mobilePhone" ms-duplex="data.mobilePhone" class="input-noborder w" disableautocomplete autocomplete="off">
                        </td>
                        <td colspan="2">装修单位电话</td>
                        <td colspan="4">
                            <div class="pa f16 input-invalidate" ms-if="!data.decorationPhone">*</div>
                            <input type="text" ms-attr-readonly="(+data.isPrint != 0)" ms-blur="validate" name="decorationPhone" ms-duplex="data.decorationPhone" class="input-noborder w" disableautocomplete autocomplete="off" data-errtips="装修单位电话号码格式不正确" pattern="(^0\d{9,11}$)|(^1\d{10}$)">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">介绍人</td>
                        <td colspan="10">
                            <div class="pa f16 input-invalidate" ms-if="!data.referrals">*</div>
                            <input type="text" ms-attr-readonly="(+data.isPrint != 0)" ms-blur="validate" name="referrals" ms-duplex="data.referrals" pattern="^(([\u4E00-\u9FA5]{2,7})|([a-zA-Z]+))$" data-errtips="介绍人填写有误" class="input-noborder w" disableautocomplete autocomplete="off">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="vertical-align: middle; text-align: center;">装修<br>施工<br>项目<br>内容</td>
                        <td colspan="10">
                            <div class="pa f16 input-invalidate none" ms-if="!decorationContent">*</div>
                            <input type="hidden" name="decorationContent">
                            <div class="decorationItem" ms-click="checkItem(0, $event)">
                                <i class="icon-chevron-right mr10"></i>
                                <b>全屋装修</b>
                                <label><i class="icon-check-empty" ms-class-1="icon-check: decorationContent.indexOf('全屋装修____0')>-1" ms-class-2="checked: decorationContent.indexOf('全屋装修____0')>-1" data-val="全屋装修"></i></label>
                            </div>
                            <div class="decorationItem" ms-click="checkItem(1, $event)">
                                <div>
                                    <i class="icon-chevron-right mr10"></i>
                                    <b>局部装修</b>
                                </div>
                                <div class="ml30">
                                    <span class="ib" ms-repeat="localDecoration">
                                        {{ el }} <i class="icon-check-empty mr5" ms-class-1="checked: decorationContent.indexOf(el + '____1')>-1" ms-class-2="icon-check: decorationContent.indexOf(el + '____1')>-1" ms-data-val="el"></i> 
                                    </span>
                                    <div>
                                        其他功能房间改造:
                                        <input type="text" ms-visible="!(+data.isPrint != 0)" class="w150 input-border-bottom" ms-duplex="donstructionInput1">
                                        <span ms-visible="(+data.isPrint != 0)"> {{donstructionInput1}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="decorationItem" ms-click="checkItem(2, $event)">
                                <div>
                                    <i class="icon-chevron-right mr10"></i>
                                    <b>墙面翻新</b>
                                </div>
                                <div class="ml30">
                                    <span ms-repeat="wallRenovation">
                                        {{ el }} <i class="icon-check-empty mr5" ms-class-1="checked: decorationContent.indexOf(el + '____2')>-1" ms-class-2="icon-check: decorationContent.indexOf(el + '____2')>-1" ms-data-val="el"></i> 
                                    </span>
                                    <span>特殊工艺说明:<input type="text"  ms-visible="!(+data.isPrint != 0)" class="w150 input-border-bottom" ms-duplex="donstructionInput2"><span  ms-visible="(+data.isPrint != 0)"> {{donstructionInput2}}</span>（如防水处理、隔热处理等）</span>
                                </div>
                            </div>
                            <div class="ml30 tl">
                                <span>装修施工期：
                                    <input type="text" ms-visible="!(+data.isPrint != 0)" id="d4311" name="beginDate" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-M-d', onpicked: removeInval,oncleared:addInval,maxDate:'#F{$dp.$D(\'d4312\')}'})" class="Wdate input-border-bottom w150" ms-duplex="data.beginDate">
                                    <span ms-visible="(+data.isPrint != 0)">
                                    {{ data.beginDate | date("yyyy年M月dd日")}}
                                    </span>至
                                    <input type="text" ms-visible="!(+data.isPrint != 0)" id="d4312" name="endDate" readonly="readonly" onclick="WdatePicker({dateFmt:'yyyy-M-d', onpicked: removeInval,oncleared:addInval,minDate:'#F{$dp.$D(\'d4311\')}'})" class="Wdate input-border-bottom w150" ms-duplex="data.endDate">
                                    <span ms-visible="(+data.isPrint != 0)">
                                    {{ data.endDate | date("yyyy年M月dd日") }}
                                    </span>
                                </span>
                                <div class="mt5">施工延迟记录：</div>
                                <textarea ms-attr-readonly="(+data.isPrint != 0)" ms-blur="validateTextLength(500)" name="delayRecord" ms-duplex="data.delayRecord" ms-visible="!(+data.isPrint != 0)" class="input-noborder"></textarea>
                                <div class="h80" ms-visible="(+data.isPrint != 0)">{{ data.delayRecord }}</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="vertical-align: middle; text-align: center;">业主确认</td>
                        <td colspan="10" class="tl p5">
                            <span class="f12">本人自愿提供物业服务中心规定要求提供的相关资料，并对其负责。
                            <br> 本人已签订
                            <<装修管理服务协议>>，且已知晓全部内容及权利与责任，并自愿承诺遵守。
                                <br> 如因本人装修原因造成房屋本体损害或侵害他人权益的，由本人承担相应责任。</span>
                            <div class="clearfix">
                                <div class="fr">
                                    <span>签署人（业主）：</span>
                                    <span class="h20 ib w100"></span>
                                </div>
                            </div>
                            <div class="clearfix mt10">
                                <div class="fr">
                                    <div class="ib text-border-bottom w50 mr5"></div>年
                                    <div class="ib text-border-bottom w30 mr5 ml5"></div>月
                                    <div class="ib text-border-bottom w30 ml5 mr5"></div>日
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="6">
                            <p class="tl">装修施工单位：</p>
                            <div class="h40"></div>
                            <div class="clearfix mt10">
                                <div class="fr">
                                    签字（章）：
                                    <div class="h20 ib w100"></div>
                                </div>
                            </div>
                            <div class="clearfix mt10">
                                <div class="fr">
                                    <div class="ib text-border-bottom w50 mr5"></div>年
                                    <div class="ib text-border-bottom w30 mr5 ml5"></div>月
                                    <div class="ib text-border-bottom w30 ml5 mr5"></div>日
                                </div>
                            </div>
                        </td>
                        <td colspan="6">
                            <p class="tl">物业服务中心：</p>
                            <div class="h40"></div>
                            <div class="clearfix mt10">
                                <div class="fr">
                                    经办人：
                                    <div class="h20 ib w100"></div>
                                </div>
                            </div>
                            <div class="clearfix mt10">
                                <div class="fr">
                                    <div class="ib text-border-bottom w50 mr5"></div>年
                                    <div class="ib text-border-bottom w30 mr5 ml5"></div>月
                                    <div class="ib text-border-bottom w30 ml5 mr5"></div>日
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="12" class="tl ">备注：
                            <textarea ms-attr-readonly="(+data.isPrint != 0)" ms-visible="!(+data.isPrint != 0)" name="remarks" ms-duplex="data.remarks" id="" class="input-noborder"></textarea>
                            <span ms-visible="(+data.isPrint != 0)" class="p5">
                                {{ data.remarks }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="tl f12">
                <p>备案资料</p>
                <ul>
                    <li>1.业主身份证或委托代理人本人身份证、业主身份证复印件及委托书、装修单位负责人身份证、营业执照、资质证书及装修施工合同复印件、装修施工图纸和施工方案（如更改原有水电线路需提供水电线路图）。</li>
                    <li>2.按体系要求情况需提供的政府部门、业委会相关证明文件。</li>
                </ul>
            </div>
        </div>
        <div class="modal fade" id="searchHouse" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">搜索房屋信息</h4>
            </div>
            <div class="modal-body">
                <table class="table table-bordered table-hover table-list">
                    <thead>
                        <tr>
                            <th class="tc">业主姓名</th>
                            <th class="tc">房号</th>
                            <th class="tc">电话</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <div class="oa scrollTable">
                    <table class="table table-bordered table-hover table-list">
                        <thead>
                        </thead>
                        <tbody>
                            <tr ms-repeat-row="houseList" ms-click="fillRow(row)">
                                <td>{{row.fullName}}</td>
                                <td>{{row.contactAddr}}</td>
                                <td>{{row.mainMobile}}</td>
                            </tr>
                            <tr ms-click="fillRow()" data-dismiss="modal">
                                <td>第一行</td>
                                <td>第一行</td>
                                <td>第一行</td>
                            </tr>
                            <tr ms-click="fillRow()" data-dismiss="modal">
                                <td>第二行</td>
                                <td>第二行</td>
                                <td>第二行</td>
                            </tr>
                            <tr ms-click="fillRow()" data-dismiss="modal">
                                <td>第三行</td>
                                <td>第三行</td>
                                <td>第三行</td>
                            </tr>
                            <tr ms-click="fillRow()" data-dismiss="modal">
                                <td>第四行</td>
                                <td>第四行</td>
                                <td>第四行</td>
                            </tr>
                            <tr ms-if="noSearchData">
                                <td colspan="3">未搜索到数据</td>
                            </tr>
                            <tr ms-if="showSearching">
                                <td colspan="3">正在搜索,请稍后...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary">确定</button>
                </div>
            </div>
        </div>
    </div>
    </form>
    <script src="${serverPath}/static/js/jquery.min.js?v=1.11.3"></script>
    <script src="${serverPath}/static/js/jquery-impromptu/jquery-impromptu.min.js"></script>
    <script src="${serverPath}/static/css/bootstrap/js/bootstrap.min.js"></script>
    <script src="${serverPath}/static/js/avalon/dist/avalon.min.js"></script>
    <script src="${serverPath}/static/js/datepicker/WdatePicker.js"></script>
    <script src="${serverPath}/static/js/common.js"></script>
    <script src="${serverPath}/static/js/views/record.js"></script>
</body>


</html>
