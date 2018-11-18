<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
<%
    request.setAttribute("headerBtn2", "on");
%>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
< ms-controller="root">
<div class="tips-box" id="tipsBox"></div>
<div class="wrap">
    <%@include file="/common/header.jsp" %>
    <div class="task_layout" ms-controller="taskcall">

        <!-- search area -->
        <div class="form_layout">
            <form id="taskcall_form">
                <fieldset>
                    <table id="task" class="table task-table">
                        <tr>
                            <th>
                                <label for="fromTime">开始时间:</label>
                            </th>
                            <td>
                                <input type="text" class="Wdate input2" id="fromTime"
                                       onclick="WdatePicker({maxDate:'#F{$dp.$D(\'toTime\')}',dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                       ms-duplex="form.fromTime"/>
                            </td>
                            <th>
                                <label for="toTime">结束时间:</label>
                            </th>
                            <td>
                                <input type="text" class="Wdate input2" id="toTime"
                                       onclick="WdatePicker({minDate:'#F{$dp.$D(\'fromTime\')}',dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                       ms-duplex="form.toTime"/>
                            </td>
                            <th>
                                <label for="fromDuration">通话时长:</label>
                            </th>
                            <td>
                                <input type="text" class="input1" ms-duplex="form.fromDuration" id="fromDuration"
                                       placeholder="单位为秒"/>
                                至
                                <input type="text" class="input1" ms-duplex="form.toDuration" id="toDuration"
                                       placeholder="单位为秒"/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label for="type">通话类型:</label>
                            </th>
                            <td>
                                <select class="select2" ms-duplex="form.type" id="type">
                                    <option value="">全部</option>
                                    <option value="1">呼入</option>
                                    <option value="2">呼出</option>
                                </select>
                            </td>
                            <th>
                                <label for="callNumber">接触号码:</label>
                            </th>
                            <td>
                                <input type="text" class="input2" ms-duplex="form.callNumber" placeholder="请输入接触号码"
                                       id="callNumber"/>
                            </td>
                            <th>
                                <label for="telephonist">受理人:</label>
                            </th>
                            <td>
                                <input type="text" class="input2" ms-duplex="form.telephonist" placeholder="请输入受理人"
                                       id="telephonist"/>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <label for="tapeCode">流水号:</label>
                            </th>
                            <td>
                                <input type="text" class="input2" ms-duplex="form.tapeCode" placeholder="请输入流水号"
                                       id="tapeCode"/>
                            </td>
                            <th>
                                <label for="hasCheck">是否质检:</label>
                            </th>
                            <td>
                                <select class="select2" id="hasCheck" ms-duplex="form.hasCheck">
                                    <option value="">全部</option>
                                    <option value="1">是</option>
                                    <option value="0">否</option>
                                </select>
                            </td>
                            <th>
                                <label for="callReason">通话原因:</label>
                            </th>
                            <td>
                                <select id="callReason" class="select2" ms-duplex="form.callReason">
                                    <option value="">全部</option>
                                    <option ms-repeat="callreasons" ms-attr-value="el.id" ms-text="el.content"></option>
                                </select>
                            </td>
                        </tr>
                    </table>
                </fieldset>
            </form>
        </div>

        <!-- function btns area -->
        <div class="operation_btns right">
            <a class="btn btn-primary" ms-click="searchclick">
                <span class="icon-search icon-white"></span> 查 询</a>
            <a class="btn" ms-click="resetclick">
                <span class="icon-refresh"></span> 重 置</a>
            <ul class="none">
                <li><span class="icon-ok icon-white"></span> 质检</li>
                <li><span class="icon-play icon-white"></span> 播放录音</li>
                <li><span class="icon-download-alt icon-white"></span> 下载录音</li>
                <li><span class="icon-tasks icon-white"></span> 话务统计</li>
            </ul>
        </div>

        <!-- table list area -->
        <div id="taskcall" class="notice-list">
            <table class="table table-hover table-bordered list-max">
                <thead>
                <tr>
                    <th>操作</th>
                    <th>来电时间</th>
                    <th>通话类型</th>
                    <th>接触号码</th>
                    <th>通话时长</th>
                    <th>挂机方</th>
                    <th>受理人</th>
                    <th>满意度评价</th>
                    <th>任务单号</th>
                    <th>采集原因</th>
                    <th>质检情况</th>
                    <th>流水号(录音)</th>
                </tr>
                </thead>
                <tbody id="tbody_taskcall">
                <tr ms-repeat="taskcalllist.data">
                    <td>
                        <a name='taskinput'
                           ms-data-id="el.callId"
                           ms-data-type="el.type"
                           ms-data-value="el.callNumber">补录任务</a>
                        <a name='taskreason'
                           ms-data-id="el.callId"
                           ms-data-type="el.type"
                           ms-data-value="el.callNumber"
                           ms-data-reasonscode="el.reasonCodes||''">原因采集</a>
                    </td>
                    <td><span ms-text="el.callTime"></span></td>
                    <td><span ms-text="el.typeText"></span></td>
                    <td><span ms-text="el.callNumber"></span></td>
                    <td><span ms-text="el.durationTime"></span></td>
                    <td><span ms-text="el.hangUp"></span></td>
                    <td><span ms-text="el.telephonist"></span></td>
                    <td><span ms-text="el.satifaction"></span></td>
                    <td>
                        <!-- <span ms-title="el.tasksAll" ms-text="el.tasks"> -->
                        <a name="taskno" ms-repeat="el.tasks" ms-data-taskno="el"><span ms-text="el"></span>;</a>
                        <!-- </span> -->
                    </td>
                    <td><span ms-title="el.reasonsAll" ms-text="el.reasons"></span></td>
                    <td><span ms-text="el.hasCheck"></span></td>
                    <td><span ms-text="el.tapeCode"></span></td>
                </tr>
                <tr ms-if="!taskcalllist.isLoading && taskcalllist.data.size()==0">
                    <td class="align-center" colspan="10">暂无数据</td>
                </tr>
                <tr ms-if="taskcalllist.isLoading">
                    <td class="align-center" colspan="10">正在加载...</td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- total area -->
        <div id="total" class="total">
            呼入数 <b ms-text="statistic.callInCount"></b>
            呼出数 <b ms-text="statistic.callOutCount"></b>
            呼出未接通数 <b ms-text="statistic.callOutMissCount"></b>
            已检数 <b ms-text="statistic.checkedCount"></b>
        </div>

        <!-- table list page area -->
        <div class="pagination" id="taskcall_pagination"></div>
    </div>

    <!-- 话务统计 -->
    <div id="taskcall_total" data-backdrop="static" class="modal hide fade in">
        <div class="modal-header">
            <a id="m_close" class="close" data-dismiss="modal">×</a>
            <h4>话务统计</h4>
        </div>
        <div class="modal-body">
            <table class="table table-hover table-bordered">
                <thead>
                <tr>
                    <th>统计时间段</th>
                    <th>呼入数</th>
                    <th>呼出数</th>
                    <th>呼出未接通数</th>
                    <th>已检数</th>
                </tr>
                </thead>
                <tbody id="taskcall_totallist">
                </tbody>
            </table>
        </div>
        <div class="modal-footer">
            <a href="#" data-dismiss="modal" class="btn">关 闭</a>
        </div>
    </div>

    <!-- 原因补录 -->
    <div id="taskcall_reasondialog" class="modal hide" ms-controller="taskcall_reason">
        <div class="modal-header">
            <a class="close" data-dismiss="modal">×</a>
            <h4>补录原因采集</h4>
        </div>
        <div class="modal-body">
            <table class="table table-info">
                <tr>
                    <th>编号</th>
                    <td><span ms-text="reasonNumber"></span></td>
                    <th>号码</th>
                    <td><span ms-text="reasonPhone"></span></td>
                    <th>类型</th>
                    <td><span ms-text="reasonType"></span></td>
                </tr>
                <tr>
                    <th>呼叫原因</th>
                    <td colspan="5">
                        <label class="inline" ms-repeat="reasonList"><input name="taskcall_reason" ms-value="el.id"
                                                                            type="checkbox" ms-duplex="reasons"><span
                                ms-text="el.content"></span></label>
                    </td>
                </tr>
            </table>
        </div>
        <div class="modal-footer">
            <a id="taskcall_reasonsubmit" class="btn btn-primary">保 存</a>
            <a data-dismiss="modal" class="btn">关 闭</a>
        </div>
    </div>

    <!-- 话务查询列表 -->
    <script type="text/html" id="taskcalllist">
        {{each list as value index}}
        <tr>
            <td>
                <input type="radio" name="taskcalllist"
                       data-id="{{value.callId}}"
                       data-type="{{value.type}}"
                       data-value="{{value.callNumber}}"
                       value="{{value.callNumber}}"/>
            </td>
            <td>{{value.callTime}}</td>
            <td>{{value.typeText}}</td>
            <td>{{value.callNumber}}</td>
            <td>{{value.durationTime}}</td>
            <td>{{value.hangUp}}</td>
            <td>{{value.telephonist}}</td>
            <td>{{value.satifaction}}</td>
            <td>
                {{each value.tasks as task}}
                <a href="#" data-taskno="{{task}}">{{task}};</a>
                {{/each}}
            </td>
            <td title="{{value.reasonsAll}}">{{value.reasons}}</td>
            <td>{{value.hasCheck}}</td>
            <td>{{value.tapeCode}}</td>
        </tr>
        {{/each}}
    </script>

    <!-- 话务统计列表 -->
    <script type="text/html" id="taskcalltotallist">
        {{each list as value}}
        <tr>
            <td>{{value.beginTime}} ~ {{value.endTime}}</td>
            <td>{{value.callInCount}}</td>
            <td>{{value.callOutCount}}</td>
            <td>{{value.callOutMissCount}}</td>
            <td>{{value.checkedCount}}</td>
        </tr>
        {{/each}}
    </script>
    <div class="cover on" id="basecover">
    </div>
</div>
<%@include file="/common/footer.jsp" %>
<script src="${serverPath}/static/js/views/call.js"></script>
</body>
</html>