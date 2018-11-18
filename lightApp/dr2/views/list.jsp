<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>

<html>
<head>
    <%@include file="/common/meta.jsp" %>
    <title>装修备案表汇总</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link href="${serverPath}/static/assets/css/bootstrap.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="${serverPath}/static/assets/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="${serverPath}/static/assets/css/ace.min.css"/>
    <link href="${serverPath}/static/js/jquery-impromptu/jquery-impromptu.min.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="${serverPath}/static/css/base.css"/>
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="${serverPath}/static/assets/js/html5shiv.js"></script>
    <script src="${serverPath}/static/assets/js/respond.min.js"></script>
    <![endif]-->
    <link rel="stylesheet" href="${serverPath}/static/css/common.css">
    <style>
        .table-head { padding: 20px; border-left: 1px solid #ddd; border-right: 1px solid #ddd; }
        .table-header { line-height: 60px; }
        body { letter-spacing: 0; }
        #table {font-size: 14px;}
        .dataTables_filter input[type=text] { height: 20px; vertical-align: top; }
        .dataTables_filter { text-align: left; }
    </style>
</head>

<body>
<div class="main-container" ms-controller="dataTable">
    <div class="main-container-inner">
        <div class="page-content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-xs-12">
                            <!-- <h3 class="header smaller lighter blue">数据表格</h3> -->
                            <div class="table-header clearfix">
                                <!-- <div class="col-xs-4">装修备案表汇总</div> -->
                                <div class="col-xs-4">
                                    <img src="${serverPath}/static/img/logo.png" alt="">
                                </div>
                                <div class="col-xs-4 tc f24">装修备案表汇总</div>
                                <div class="col-xs-4 text-right">
                                    <span class="icon-user mr5"></span>${loginUser.name}
                                    <a href="${logoutUrl}" class="white"><i class="icon-signout mr5"></i>退出</a>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <div class="clearfix table-head" style="display: block;">
                                    <div class="col-xs-6">
                                        <div class="dataTables_filter">
                                            搜索:
                                            <select id="" ms-duplex="searchOption">
                                                <option value="customerName" selected>业主姓名</option>
                                                <option value="houseName">房号</option>
                                                <option value="mobilePhone">联系电话</option>
                                                <option value="serialNumber">序号</option>
                                            </select>
                                            <input type="text" placeholder="输入搜索内容" ms-duplex="searchText">
                                        </div>
                                    </div>
                                    <div class="col-xs-6 tr">
                                        <a href="${serverPath}/views/record.jsp" class="mr10"><i class="icon-plus mr5"></i>新建装修备案表</a>
                                    </div>
                                </div>
                                <table id="table" class="table table-striped table-bordered table-hover">
                                    <thead>
                                    <tr>
                                        <!-- <th class="center">
                                            <label>
                                                <input type="checkbox" class="ace" />
                                                <span class="lbl"></span>
                                            </label>
                                        </th> -->
                                        <th width="6%" ms-click="sortBy('id')">序号<i class="icon-caret-down fr cp"></i></th>
                                        <th width="13%" ms-click="sortBy('customerName')">业主姓名<i class="icon-caret-down fr cp"></i></th>
                                        <th width="21%" ms-click="sortBy('houseName')">房号<i class="icon-caret-down fr cp"></i></th>
                                        <th width="15%" ms-click="sortBy('mobilePhone')" class="hidden-480">联系电话<i class="icon-caret-down fr cp"></i></th>
                                        <th width="14%" ms-click="sortBy('decorationName')"> 装修负责人<i class="icon-caret-down fr cp"></i></th>
                                        <th ms-click="sortBy('decorationUnit')">装修单位<i class="icon-caret-down fr cp"></i></th>
                                        <th width="7%">操作</th>
                                        <th width="7%">打印</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr ms-if="dataArray.size() == 0"><td colspan="8">暂无数据</td></tr>
                                    <tr ms-class="cp: +row.isPrint == 0 " ms-repeat-row="dataArray" ms-click="check($index, 0, $event)">
                                        <!-- <td class="center">
                                            <label>
                                                <input type="checkbox" class="ace" />
                                                <span class="lbl"></span>
                                            </label>
                                        </td> -->
                                        <td ms-text="::row.id"></td>
                                        <td ms-text="::row.customerName"></td>
                                        <td ms-text="::row.houseName"></td>
                                        <td ms-text="::row.mobilePhone" class="hidden-480"></td>
                                        <td ms-text="::row.decorationName"></td>
                                        <td ms-text="::row.decorationUnit" class="hidden-480"></td>
                                        <td>
                                            <a class="mr10 top-tip"  ms-class-1="green: (+row.isPrint == 0)"  ms-class-2="gray: (+row.isPrint !== 0)" data-tips="编辑装修备案表" ms-click="check($index, row.isPrint, $event)">
                                                <i class="icon-pencil bigger-130"></i>
                                            </a>
                                            <a class="mr10 top-tip" ms-class-1="red: (+row.isPrint == 0)"  ms-class-2="gray: (+row.isPrint !== 0)" data-tips="删除装修备案表" ms-click="remove($index, $remove, $event, row.isPrint)">
                                                <i class="icon-trash bigger-130"></i>
                                            </a>
                                        </td>
                                        <td>
                                        <span class="mr10 left-tip" ms-class-1="gray: (+row.isPrint == 1 || +row.isPrint == 3)" ms-class-2="green: (+row.isPrint != 1 && +row.isPrint != 3)" ms-data-tips="+row.isPrint == 1 || +row.isPrint == 3?'已打印装修备案表':'装修备案表未打印'">
                                                <i class="icon-print bigger-130"></i>
                                            </span>
                                            <span class="left-tip"  ms-click="produce($index, $event)" ms-class-1="gray: (+row.isPrint == 2 || +row.isPrint == 3)" ms-class-2="green: (+row.isPrint != 2 && +row.isPrint != 3)" ms-data-tips="+row.isPrint == 2 || +row.isPrint == 3?'已打印装修施工证':'装修施工证未打印'">
                                                <i class="icon-print bigger-130"></i>
                                            </span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="dataTables_info">
                                        <span class="dataTables_length">
                                            <label>每页显示
                                                <select size="1" name="table_length" ms-change="changePageSize"
                                                        ms-duplex="pageSize">
                                                    <option value="10" selected="selected">10</option>
                                                    <option value="20">20</option>
                                                    <option value="30">30</option>
                                                </select> 条</label>
                                        </span>/共{{allItems}} 条</div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="dataTables_paginate paging_bootstrap">
                                            <ul class="pagination">
                                                <li class="prev" ms-click="pageIndex(page - 1)" ms-class="disabled: page == 1">
                                                    <a>
                                                        <i class="icon-double-angle-left"></i>
                                                    </a>
                                                </li>
                                                <li ms-class="active: page == el" ms-repeat="pageNumber"
                                                    ms-click="pageIndex(el)">
                                                    <a>
                                                        {{el}}
                                                    </a>
                                                </li>
                                                <li class="next" ms-click="pageIndex(page + 1)"
                                                    ms-class="disabled: page == pageNumber[pageNumber.size() - 1]">
                                                    <a>
                                                        <i class="icon-double-angle-right"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="${serverPath}/static/js/jquery.min.js"></script>
<script src="${serverPath}/static/js/jquery-impromptu/jquery-impromptu.min.js"></script>
<script src="${serverPath}/static/js/avalon/dist/avalon.min.js"></script>
<script src="${serverPath}/static/js/common.js"></script>
<script src="${serverPath}/static/js/views/list.js"></script>
<script>
    /*$('table th input:checkbox').on('click', function () {
        var that = this;
        $(this).closest('table').find('tr > td:first-child input:checkbox')
                .each(function () {
                    this.checked = that.checked;
                    $(this).closest('tr').toggleClass('selected');
                });

    });*/
</script>
</body>

</html>
