<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>

<html>
<head>
    <%@include file="/common/meta.jsp" %>
    <title>装修施工证</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="${serverPath}/static/css/bootstrap/css/bootstrap.min.css">
    <script src="${serverPath}/static/js/jquery.min.js?v=1.11.3"></script>
    <script src="${serverPath}/static/js/avalon/dist/avalon.min.js"></script>
    <link rel="stylesheet" href="${serverPath}/static/assets/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="${serverPath}/static/css/base.css">
    <link href="${serverPath}/static/js/datepicker/skin/WdatePicker.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="${serverPath}/static/css/common.css">
    <script src="${serverPath}/static/js/datepicker/WdatePicker.js"></script>
    <script src="${serverPath}/static/js/common.js"></script>
    <script src="${serverPath}/static/js/views/prove.js"></script>
</head>
<style>
    .card { position: relative; width: 900px; margin: 0 auto; padding: 0 40px 10px 0; line-height: 1.8;}
    p { margin-bottom: 5px; }
    .set { text-indent: 2em; padding: 0 20px; margin-top: 5px; }
    .list-item { margin-left: 50px; margin-top: 5px; padding: 0 20px; line-height: 1.6;}
    .lian { position: absolute; width: 40px; right: 20px; top: 200px; line-height: 1.5; font-size: 12px;}
    .form { padding: 0 10px 0 40px; border-bottom: 2px solid #333; }
</style>

<body ms-controller="decoration">
    <div class="edite  print-hidden">
        <span class="btn btn-sm btn-success" ms-click="print">打印</span>
        <span class="btn btn-sm btn-success" ms-click="back">返回</span>
    </div>
    <div class="card">
        <header class="header"><img src="${serverPath}/static/img/timg.jpg" alt="" height=50></header>
        <form action="" class="form">
            <h3 class="tc">装修施工证</h3>
            <p class="tl">
                编号： VK-WY/TX08-K04-F1 版本： A/0 生效日期： {{data.effectDate | date("yyyy年MM月dd日")}} 序列号： {{ data.serialNumber }}
            </p>
            <div class="set">
                经物业服务中心核对，接受{{ data.decorationUnit }}(装修单位)对{{ data.houseName }}(房号)的装修方案并予以登记，装修期限为{{ data.beginDate | date("yyyy年MM月dd日")}}至 {{ data.endDate | date("yyyy年MM月dd日") }}
            </div>
            <div class="list-item pr">
                主要装修项目如下：
                <div class="donstructionItem">
                    <i class="icon-chevron-right mr10"></i>
                    <b>全屋装修</b>
                    <span><i class="icon-check-empty" ms-class="icon-check: decorationContent.indexOf('全屋装修____0')>-1" data-val="全屋装修"></i></span>
                </div>
                <div class="donstructionItem">
                    <div>
                        <i class="icon-chevron-right mr10"></i>
                        <b>局部装修</b>
                    </div>
                    <div class="ml30">
                        <span class="ib" ms-repeat="localDecoration">
                                        {{ el }} <i class="icon-check-empty mr5" ms-class="icon-check: decorationContent.indexOf(el + '____1')>-1"></i> 
                                    </span>
                        <span>
                            其他功能房间改造:
                            {{donstructionInput1}}
                        </span>
                    </div>
                </div>
                <div class="donstructionItem">
                    <div>
                        <i class="icon-chevron-right mr10"></i>
                        <b>墙面翻新</b>
                    </div>
                    <div class="ml30">
                        <span ms-repeat="wallRenovation">
                                        {{ el }} <i class="icon-check-empty mr5" ms-class="icon-check: decorationContent.indexOf(el + '____2')>-1"></i> 
                                    </span>
                        <span>特殊工艺说明:
                            {{donstructionInput2}}（如防水处理、隔热处理等）</span>
                    </div>
                </div>
                <div class="mt5">延期记录情况：
                <div class="h80">{{ data.delayRecord }}</div>
                </div>
            </div>
            <div class="clearfix">
                <div class="fr">
                    <div class="h20 ib"></div>
                    <span>{{ data.serviceCenter }}</span>物业服务中心
                </div>
            </div>
            <div class="clearfix">
                <div class="fr">
                    <div class="ib text-border-bottom w50 mr5"></div>年
                    <div class="ib text-border-bottom w30 mr5 ml5"></div>月
                    <div class="ib text-border-bottom w30 ml5 mr5"></div>日
                </div>
            </div>
        </form>
        <div class="last-msg">
            说明：一式两联，原件服务中心保存，复印件粘贴装修户门外。
        </div>
        <div class="lian">第
            <br>二
            <br>联
            <br>贴
            <br>装
            <br>修
            <br>户
            <br>门
            <br>外</div>
    </div>
</body>



</html>
