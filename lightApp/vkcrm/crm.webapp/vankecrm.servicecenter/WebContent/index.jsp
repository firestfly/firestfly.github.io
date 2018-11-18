<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
<body>
<%@include file="/common/header.jsp" %>
<div class="wrap panel-body">
    <div class="content">
        <div class="ly-left">
            <div class="listbar">
                <div class="vk-tree " id="vankeTree">
                </div>
            </div>
        </div>
        <div class="ly-center">
            <div class="building-btns">
                <security:isAllow privilege="TREE_EXPORT_NOT_PAY_CUS">
                    <a class="btn btn-success" href="javascript:" id="btnExportRoom">
                        <i class="icf-daochu"></i>导出待交付房屋/车位</a>
                </security:isAllow>
                <security:isAllow privilege="TREE_IMPORT_NOT_PAY_CUS">
                    <a class="btn btn-warning" href="#importCustomerModal" data-toggle="modal">
                        <i class="icf-jianlidaochumoban"></i>导入已交付客户</a>
                </security:isAllow>
                <security:isAllow privilege="TREE_EXPORT_NOT_PAY_CUS_LIS">
                    <a class="btn btn-info" href="#logCustomerModal" data-toggle="modal"
                       onclick="loadNotPayCustomers(1);">
                        <i class="icf-search"></i>客户导入结果查询</a>
                </security:isAllow>
                <security:isAllow privilege="TREE_HOUSE_MERGE">
                    <a class="btn btn-primary" href="javascript:" id="house-combine">
                        <i class="icf-hebingdanyuan"></i>房屋合并</a>
                </security:isAllow>
            </div>
            <div class="ly-panel on welcome">
            </div>
            <div class="ly-panel index-panel on" id="indexFloorPanel">
                <div class="ly-search-panel">
                    <div class="row-fluid">
                        <div class="vk-breadcrumb" id="floorBreadcrumb">
                        </div>
                        <div class="" style="margin-left:0px;text-align: right">
                            <div class="form-inline alignRight">
                                <select class="vkt-active" placeholder="请选择管理中心"
                                        style="min-width:150px; font-size:12px;" id="sel_mc">
                                </select>
                                <select class="vkt-active" placeholder="请选择项目" style="min-width:150px;font-size:12px;"
                                        id="sel_prj">
                                </select>
                                <input type="text" class="input-medium vkt-active" placeholder="请输入房屋名称"
                                       id="houseName"/>
                                <input type="hidden" id="houseId" value=""/>
                                <input type="hidden" id="unitId" value=""/>
                                <input type="hidden" id="floor" value=""/>
                                <input type="hidden" id="buildingId" value=""/>
                                <input type="hidden" id="search_projectId" value=""/>
                                <button class="btn btn-primary" id="search_house">查询</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="house-combine-btn">
                    <label>请选择合并房屋</label>
                    <a href="javascript:" title="确认" class="btn-sure" id="btn-sure">确认</a>
                    <a href="javascript:" title="取消" class="btn-cancel" id="btn-cancel">取消</a>
                </div>
                <div class="ly-result-panel" id="buildingPanel">
                    <div class="building-list" id="buildingList">
                    </div>
                    <div class="cover" id="buildingCover"></div>
                    <div class="room-subbox">
                        <div class="subbox-content" id='subroomList'>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ly-panel index-panel" id="indexParkPanel">
                <div class="ly-park-header" style="padding-top:0px;">
                    <div class="row-fluid">
                        <div class="vk-breadcrumb" id="parkBreadcrumb">
                        </div>
                        <div class="" style="margin-left:0px;text-align: right">
                            <div class="form-inline alignRight">
                                <input type="text" class="input-medium vkt-active" placeholder="请输入车位名称"
                                       id="carportName"/>
                                <button class="btn btn-primary" id="search_carport">查询</button>							
								
	                            <a href="javascript:void(0)" class="btn j_btnSetGroup">
	                                <i class="icf-list1"></i>

	                                设置分组</a>
                            </div>
                        </div>
                    </div>
                </div>
                <!--车位分组-->
                <div class="ly-park-nav">
                    <ul class="nav nav-tabs" id="parkingNav">
                    </ul>
                </div>
                <!--车位详情-->
                <div class="modal hide carportDetail" id="modal_carportDetail">
                </div>
                <!--车位列表-->
                <div class="ly-park-panel" id="parkingPanels">
                </div>
            </div>
        </div>
    </div>
</div>

<!--导入已交付客户对话框-->
<div id="importCustomerModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="mergeModalLabel"
     aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h5>导入已交付客户</h5>
    </div>
    <div class="modal-body">
        <div class="panel">
            <form action="${serverPath}/page/customer/notPay/upload"
                  enctype="multipart/form-data"
                  target="downloadFileFrameName"
                  method="post"
                  id="frmUploadNotPayCustomer">
                <div>
                    上传文件：<input type="file" name="file_upload" id="file_upload"/>
                </div>
            </form>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal">关闭</button>
        <button type="button" id="btnUploadNotPayCustomer" class="btn btn-primary" data-loading-text="上传中...">导入</button>
    </div>
</div>
<!--导入已交付客户查询列表-->
<div id="logCustomerModal" class="modal large hide fade" tabindex="-1" role="dialog" aria-labelledby="mergeModalLabel"
     aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h5>导入已交付客户记录</h5>
    </div>
    <div class="modal-body">
        <form class="form-inline">
            上传用户 <input type="text" name="createdBy" id="createdBy" maxlength="10"/>
            上传时间 <input type="text" name="beginTime" id="beginTime" class="Wdate" onClick="WdatePicker()"
                        style="width: 90px"/>
            至
            <input type="text" name="endTime" id="endTime" class="Wdate" onClick="WdatePicker()" style="width: 90px"/>
            <button type="button" onclick="loadNotPayCustomers()" id="selectNotPayCustomerImportCustomer"
                    class="btn btn-primary">查询
            </button>
        </form>
        <div class="panel">
            <div class="panel-header">
                <div class="panel-title"><i class="icf-bookopened"></i>已交付客户导入日志</div>
            </div>
            <div id="lstNotPayCustomers"></div>
            <div class="pagination" id="paginationNotPay"></div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal">关闭</button>
    </div>
</div>
<!-- 合并房屋弹出框 -->
<div id="mergeModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="mergeModalLabel"
     aria-hidden="true">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3 id="myModalLabel">房屋资料</h3>
    </div>
    <div class="modal-body">
        <div class="panel">
            <form class="form-inline text-center">
                房屋房号:
                <input type="text" name="parentHouseName" id="parentHouseName" class="input-medium">
                入住时间:
                <input type="text" name="parentHousecheckinTime" id="parentHousecheckinTime" class="input-medium Wdate"
                       onclick="WdatePicker()">
            </form>
        </div>

    </div>
    <div class="modal-footer">
        <button class="btn" data-dismiss="modal">关闭</button>
        <button id="btnMerge" class="btn btn-primary">确定合并</button>
    </div>
</div>
<!--导入结果查询页面-->
<script type="text/html" id="tmplNotPayCustomers">
    <div>
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
    </div>
</script>
<!--车场-->
<script type="text/html" id="indexParkTemp">
    {{each list}}
    <div class="park" data-id="{{$value.id}}">
        <div class="park-name"><a href="javascript:void(0)">{{$value.name}}</a></div>
        <div class="park-owner">{{$value.owner}}</div>
        <div class="park-phone">{{$value.mobilePhone}}</div>
        <i class="park-check"></i>
    </div>
    {{/each}}
</script>
<!--房屋-->
<script type="text/html" id="indexRoomTemp">
    {{each list}}
        <div class="floor-room-wrap">
            <!-- 单独 -->
            {{if $value.parentHouses.length < 1 && $value.subHouses.length < 1 }}
            <div class="floor-room floor-room-alone state0{{$value.status}}" data-id="{{$value.houseId}}">
                <div class="alone-house-info">
                    <div class="room-num"><b>{{$value.roomNumber}}</b></div>
                    <div class="room-address"><b>{{$value.houseName}}</b></div>
                    <div class="room-name" title="{{$value.owner}}">
                        <b>业主: {{$value.owner}}</b>
                    </div>
                </div>
            </div>
            {{/if}}
             <!-- 拆分 -->
            {{if !$value.parentHouses.length && $value.subHouses.length}}
            <div class="floor-room-split">
                <div class="along-house-Info" data-id="{{$value.houseId}}">
                    <h2>拆分信息</h2>
                    <h3>{{$value.roomNumber}}</h3>
                </div>
                <div class="house-bar">
                    {{each $value.subHouses as subitem d }}
                        <a href="javascript:void(0)" class="floor-room floor-room-okhouse state0{{subitem.status}}" data-id="{{subitem.houseId}}">
                            <div class="room-num"><b>{{subitem.roomNumber}}</b></div>
                            <div class="room-address"><b>{{subitem.houseName}}</b></div>
                            <div class="room-name" title="{{subitem.owner}}">
                                <b>业主:{{subitem.owner}}</b>
                            </div>
                        </a>
                    {{/each}}
                </div>
                <div class="split-house-Info">
                    <div class="room-child">
                        <span class="room-sb red">拆</span>
                    </div>
                </div>
            </div>
            {{/if}}
             <!-- 合并 -->
            {{if $value.parentHouses.length  }}
            <div class="floor-room {{if $value.subHouses.length > 0 }}floor-room-split {{else}}floor-room-merge state0{{$value.status}}{{/if}}">
                {{if $value.isCombine && $value.subHouses.length < 1 }}
                    <div class="floor-room-okhouse" data-id="{{$value.houseId}}">
                        <div class="room-num"><b>{{$value.roomNumber}}</b></div>
                        <div class="room-address"><b>{{$value.houseName}}</b></div>
                        <div class="room-name" title="{{$value.owner}}">
                            <b>业主: {{$value.owner}}</b>
                        </div>
                    </div>
                {{/if}}

                <div class="merge-house-info dotted">
                    <h1>合并房屋信息:</h1>
                    <div class="hlist">
                        <ul>
                            {{each $value.parentHouses as item i }}
                            <li data-id="{{item.houseId}}" title="查看房屋详情">{{item.roomNumber}}</li>
                            {{/each}}
                        </ul>
                    </div>
                </div>
                 <!-- 再拆分 -->
                {{if $value.subHouses.length  }}
                <div class="house-bar">
                    {{each $value.subHouses as subitem d }}
                        <a href="javascript:void(0)" class="floor-room floor-room-okhouse state0{{subitem.status}}" data-id="{{subitem.houseId}}">
                            <div class="room-num"><b>{{subitem.roomNumber}}</b></div>
                            <div class="room-address"><b>{{subitem.houseName}}</b></div>
                            <div class="room-name" title="{{subitem.owner}}">
                                <b>业主:{{subitem.owner}}</b>
                            </div>
                        </a>
                    {{/each}}
                </div>
                {{/if}}
                <div class="split-house-Info">
                    <div class="room-child">
                        {{if $value.subHouses.length  }}

                        <span class="room-sb red">拆</span>
                        {{else}}
                        <span class="room-sb blue">合</span>

                        {{/if}}
                    </div>
                </div>
            </div>
            {{/if}}
        </div>
    {{/each}}
</script>
<!--房屋-->
<script type="text/html" id="subroomTemp">
    {{each list}}
    <a href="#" class="floor-room state0{{$value.status}}" data-id="{{$value.houseId}}">
        <div class="room-num"><b></b></div>
        <div class="room-address"><b>{{$value.houseName}}</b></div>
        <div class="room-name"><b>业主：{{$value.owner}}</b></div>
    </a>
    {{/each}}
</script>
<!--楼层-->
<script type="text/html" id="indexFloorTemp">
    {{each floors}}
    <div class="building-floor" data-floor="{{$value}}">
        <div class="floor-header">
            楼层：<span>{{$value}}层</span>
        </div>
        <div class="floor-body">
            <div class="floor-room floor-more" id="floor_{{moreid}}_{{$value}}"></div>
        </div>
    </div>
    {{/each}}
</script>
<!--车位详情模板-->
<script type="text/html" id="carportDetail">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"
                aria-hidden="true">&times;</button>
        <div>车位详情</div>
    </div>
    <div class="modal-body">
        <div class="form-horizontal">
            <form id="modal_carportTransfer_form" class="form-horizontal"
                  action="javascript:void(0)">
                <div class="row-fluid">
                    <div class="span9">
                        <div class="control-group " id="div_ownerName">
                            <label class="control-label">客户名称:</label>
                            <label class="controls" id="carport_customers">
                                <label class="control-label " style="text-align:left"
                                       id="oldownerName">{{owner}}</label>
                                <input type="text" class="span10" style="display: none;"
                                       id="ownerName"/>
                            </label>
                        </div>
                    </div>
                    <div class="span3">
                        <a href="javascript:void(0)" class="btn btn-primary"
                           id="modal_tansfercustomer_btn">关联客户</a>
                        <a href="javascript:void(0)" class="btn btn-primary hidden"
                           id="modal_transfercarport_btn">确定</a>
                    </div>
                    <input type="hidden" class="" id="ownerId" value="{{ownerId}}">
                    <input type="hidden" class="" id="newOwnerId">
                </div>
                <div class="row-fluid">
                    <div class="span9">
                        <div class="control-group">
                            <label class="control-label">项目名称:</label>

                            <div class="controls">
                                <label class="control-label"
                                       style="text-align:left">{{projectName}}</label>
                                <input type="hidden" class="" id="projectId" value="{{projectId}}">
                                <input type="hidden" class="" id="oldId" value="{{oldId}}">
                            </div>
                        </div>
                    </div>
                    <div class="span3"></div>
                </div>

                <div class="row-fluid">
                    <div class="span9">
                        <div class="control-group">
                            <label class="control-label">车位名称:</label>

                            <div class="controls">
                                <label class="control-label"
                                       style="text-align:left">{{name}}</label>
                                <input type="hidden" class="" id="carportId" value="{{id}}">
                            </div>
                        </div>
                    </div>
                    <div class="span3"></div>
                </div>
                <div class="row-fluid">
                    <div class="span9">
                        <div class="control-group">
                            <label class="control-label">车位编码:</label>

                            <div class="controls">
                                <label class="control-label"
                                       style="text-align:left">{{code}}</label>
                            </div>

                        </div>
                    </div>
                    <div class="span3"></div>
                </div>
                <div class="row-fluid">
                    <div class="span9">
                        <div class="control-group">
                            <label class="control-label">辅助编码:</label>

                            <div class="controls">
                                <label class="control-label" style="text-align:left">{{assistantCode}}</label>
                            </div>
                        </div>
                        <div class="span3"></div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="modal-footer">
        <input type="hidden" id="saveType" name="saveType" value="">
        <a href="#" data-dismiss="modal" aria-hidden="true" class="btn">关闭</a>
    </div>
</script>

<%@include file="/common/footer.jsp" %>

<script type="text/javascript" src="${staticWeb}/lib/jquery.form.min.js?v=${resourceVer}"></script>
<script type="text/javascript" src="${staticWeb}/js/sc/index.js?v=${resourceVer}"></script>
<script type="text/javascript" src="${staticWeb}/js/sc/import.js?v=${resourceVer}"></script>
<script type="text/javascript">
    var importType = 'notPayCustomer';
    $(function () {
        $("#btn_header_house").addClass("on");
//        // 上传文件
//        var options = {
//            target: '#ajaxFormCallback',
//            beforeSubmit: function () {
//            },
//            success: function (responseText, statusText, xhr, $form) {
//                $("#btnUploadNotPayCustomer").removeClass("disabled");
//                if (responseText.success) {
//                    Common.tip.add({
//                        text: "上传成功!",
//                        type: 'success'
//                    });
//                } else {
//                    Common.tip.add({
//                        text: responseText.message,
//                        type: 'warning'
//                    });
//                }
//            }
//        };
//        $('#frmUploadNotPayCustomer').on('submit', function () {
//            $(this).ajaxSubmit(options);
//            return false;
//        });
//        $("#btnUploadNotPayCustomer").on('click', function () {
//            $("#btnUploadNotPayCustomer").addClass("disabled");
//            $('#frmUploadNotPayCustomer').trigger('submit');
//        });
    });
</script>

<div class="hidden" id="ajaxFormCallback"></div>
<iframe id="downloadFileFrameID" name="downloadFileFrameName" style="display:none" onload="downloadFileFrameOnload()"></iframe>
<iframe id="downloadFileFrameID1" name="downloadFileFrameName1" style="display:none"></iframe>
<iframe id="downloadFileFrameID2" name="downloadFileFrameName2" style="display:none"></iframe>
</body>
</html>