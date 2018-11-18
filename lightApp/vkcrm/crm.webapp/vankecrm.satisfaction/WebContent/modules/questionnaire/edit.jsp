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
<body>
<style type="text/css">
    .questionnaire {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        overflow: auto;
    }

    .exam-intro .right {
        float: right !important;
        width: 160px !important;
        line-height: 46px !important;
    }

    .table-list td {
        text-align: center;
    }
</style>
<div class="tips-box" id="tipsBox"></div>
<div class="wrap">
    <div class="header">
        <div class="header-top">
            <div class="header-left">
                <div class="logo">
                    <img src="${staticWeb}/img/logo.png">
                    <em></em>

                    <h1>CRM 满意度调查</h1>
                </div>
            </div>
            <div class="header-right">
                <div class="header-btns">
                    <a class="h-btn header-user" href="javascript:void(0)"><i
                            class="icf-service"></i><span>${loginUser.getName()}</span></a><span class="pipe"></span>
                    <a class="h-btn" href="javascript:void(0)" ms-click="headerboxToggle"><i
                            class="icf-list"></i></a><span class="pipe"></span>
                    <a class="h-btn" href="${logoutUrl}"><i class="icf-logout"></i></a>
                </div>
                <div class="header-box" ms-class="on:headerboxVisible">
                    <ul>
                        <li><a href="${adminPath}"><span>权限管理</span></a></li>
                        <li><a href="${adminPath}"><span>人员管理</span></a></li>
                    </ul>
                </div>
            </div>
            <div class="header-center">
                <div class="header-btns">
                    <security:isAllow privilege="QUESTIONNAIRE_CALL">
                        <a class="btn" href="${serverPath}/#!/queslist"><i
                                class="icf-task"></i> 问卷调查</a>
                    </security:isAllow>
                    <security:isAllow privilege="QUESTIONNAIRE_RESULT">
                        <a class="btn" href="${serverPath}/#!/quesquery"><i
                                class="icf-call"></i> 话务查询</a>
                    </security:isAllow>
                    <security:isAllow privilege="QUESTIONNAIRE_MANAGE">
                        <a class="btn on" href="${serverPath}/page/questionnaire/manage"><i class="icf-survey"></i> 问卷管理</a>
                    </security:isAllow>
                </div>
            </div>
        </div>
    </div>
    <div class="quescall questionnaire" style="margin-top:55px;">
        <div class="content" style="padding-top:0px;" ms-controller="questionnaireEdit" id="questionnaireEdit">
            <div class="panel">
                <!-- <fieldset> -->
                <div class="exam-intro">
                    <div class="left">
                        <i class="icf-survey"></i>
                    </div>
                    <div class="right">
                        <select class="span2" ms-duplex="form.subjectId">
                            <option value="default">默认主题</option>
                            <option value="satisfaction">满意度调查</option>
                        </select>
                    </div>
                    <div class="center">
                        <h4>问卷信息</h4>

                        <div class="tip">%项目%:项目名称 %物业%:物业地址 %姓名%:客户名 %用户名%:登录用户名</div>
                    </div>
                </div>
                <div class="exam-box">
                    <form action="javascript:void(0)" id="questionnaireForm">
                        <table class="table table-info">
                            <tr>
                                <th>问卷标题</th>
                                <td><input type="text" class="span2" ms-duplex="form.title"
                                           data-validator="required,length[0~50]"><em class="icf-import errortip"></em>
                                </td>
                                <th>抽样比例</th>
                                <td>
                                    <div class="input-append">
                                        <input type="text" class="span2" ms-duplex="form.sampleRatio"
                                               data-validator="required,integer,range[1~100]">
                                        <span class="add-on">%</span>
                                        <em class="icf-import errortip"></em>
                                    </div>
                                </td>
                                <th>年度完成率</th>
                                <td>
                                    <div class="input-append">
                                        <input type="text" class="span2" ms-duplex="form.annualCompleteRate"
                                               data-validator="required,integer,range[1~100]">
                                        <span class="add-on">%</span>
                                        <em class="icf-import errortip"></em>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>开始时间</th>
                                <td><input type="text" class="span2 Wdate" id="beginTime"
                                           onclick="var endTime=$dp.$('endTime');WdatePicker({onpicked:function(){endTime.click();},maxDate:'#F{$dp.$D(\'endTime\')}'})"
                                           ms-duplex="form.beginTime" data-validator="required,date"><em
                                        class="icf-import errortip"></em></td>
                                <th>结束时间</th>
                                <td><input type="text" class="span2 Wdate" id="endTime"
                                           onclick="WdatePicker({minDate:'#F{$dp.$D(\'beginTime\')}'})"
                                           ms-duplex="form.endTime" data-validator="required,date"><em
                                        class="icf-import errortip"></em></td>
                                <th>延迟时间</th>
                                <td><input type="text" class="span2 Wdate"
                                           onclick="WdatePicker({minDate:'#F{$dp.$D(\'endTime\')}'})"
                                           ms-duplex="form.delayTime" data-validator="required,date"><em
                                        class="icf-import errortip"></em></td>
                            </tr>
                            <tr>
                                <th>问卷说明</th>
                                <td colspan="5">
                                    <textarea rows="4" class="span11" ms-duplex="form.description"
                                              data-validator="required,length[0~100]"></textarea><em
                                        class="icf-import errortip"></em>
                                </td>
                            </tr>
                            <tr>
                                <th>是否启用</th>
                                <td><label class="checkbox"><input type="checkbox" ms-duplex-checked="form.isEnabled"/></label>
                                </td>
                                <td colspan="4">
                                    <%--<div class="text-center exam-control">--%>
                                        <%--<div class="btn-group">--%>
                                            <%--<button type="button" class="btn btn-primary" id="questionnaireSaveBtn"--%>
                                                    <%--ms-click="saveAction()">--%>
                                                <%--<span class="icon-ok icon-white"></span>--%>
                                                <%--<span>保存</span>--%>
                                            <%--</button>--%>
                                            <%--<!-- <button type="button" class="btn btn-primary" id="questionnaireDeployBtn">发布</button> -->--%>
                                            <%--<button type="button" class="btn" id="questionnaireResetBtn"--%>
                                                    <%--ms-click="cancelAction()">--%>
                                                <%--<span class="icon-refresh"></span>--%>
                                                <%--<span>返回</span>--%>
                                            <%--</button>--%>
                                        <%--</div>--%>
                                    <%--</div>--%>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
                <br>
                <div class="exam-intro">
                    <div class="left">
                        <i class="icf-survey"></i>
                    </div>
                    <div class="center">
                        <h4>特殊身份配置</h4>
                        <div class="tip">设置不参与调查的特殊身份</div>
                    </div>
                </div>
                <div class="exam-box">
                    <div class="">
                        <div class="panel">
                            <div class="panel-body">
                                <form class="form-inline" action="javascript:void(0)">
                                    <div class="">
                                        <label class="checkbox" ms-repeat="identities"
                                               style="width:140px;height:32px;font-size:12px;">
                                            <input type="checkbox" name="identity" ms-data-id="el.id"
                                                   ms-attr-value="el.code" ms-duplex-string="excludeSpecialIdentities"><span ms-text="el.value"></span>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="text-center exam-control">
                        <div class="btn-group">
                            <button type="button" class="btn btn-primary" id="questionnaireSaveBtn"
                                    ms-click="saveAction()">
                                <span class="icon-ok icon-white"></span>
                                <span>保存</span>
                            </button>
                            <!-- <button type="button" class="btn btn-primary" id="questionnaireDeployBtn">发布</button> -->
                            <button type="button" class="btn" id="questionnaireResetBtn"
                                    ms-click="cancelAction()">
                                <span class="icon-refresh"></span>
                                <span>返回</span>
                            </button>
                        </div>
                    </div>
                </div>
                <br>
                <div class="exam-intro">
                    <div class="left">
                        <i class="icf-survey"></i>
                    </div>
                    <div class="center">
                        <h4>项目信息</h4>
                        <div class="tip">选择参加问卷调查的项目</div>
                    </div>
                </div>
                <div class="exam-box">
                    <table style='border: 0px solid #A9D6F6;;border-collapse: collapse;padding:0px;width:100%;'>
                        <tr>
                            <td align='center' width='400px' style='border:1px solid #A9D6F6;text-align: left'>
                                备选项目：<input type="text" name="projectName" id="projectName" class="input-large"
                                            style="margin-top: 10px"/>
                                <button type="button" class="btn btn-primary" onclick="queryProject();">
                                    <span class="icon-search icon-white"></span>
                                    <span>查询</span>
                                </button>
                                <br>
                                <select name="project1" id="project1" onchange="project1change()" multiple="multiple"
                                        style="width: 370px;height: 400px"></select>
                            </td>
                            <td align='center' width='*' style='border:1px solid #A9D6F6;text-align: left'>
                                <p>已选择项目：</p>

                                <table style='border: 0px;padding:0px;width:100%;'>
                                    <div id="selectedProject" style="height: 400px;overflow: auto;width: 100%"></div>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                    </table>
                    <table style='border: 0px solid #A9D6F6;;border-collapse: collapse;padding:0px;width:100%;'>
                        <tr>
                            <td>
                                <div class="text-left exam-control">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-primary" id="questionnaireSaveBtn"
                                                ms-click="saveProject()">
                                            <span class="icon-ok icon-white"></span>
                                            <span>保存</span>
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="panel">
                <div class="exam-intro">
                    <div class="left">
                        <i class="icf-survey"></i>
                    </div>
                    <div class="right">
                        <button class="btn btn-primary" id="editTopicBtn" ms-visible="showAddBtn"
                                ms-click="addTopicAction()">
                            <span class="icon-plus icon-white"></span>
                            <span>新增</span>
                        </button>
                    </div>
                    <div class="center">
                        <h4>问题列表</h4>

                        <div class="tip">%项目%:项目名称 %物业%:物业地址 %姓名%:客户名 %用户名%:登录用户名</div>
                    </div>
                </div>
                <div class="exam-box"></div>
                <div class="" id="topicTableContainer">
                    <table class="table table-list">
                        <thead>
                        <tr>
                            <!-- <th>
                              <label class="checkbox">
                                <input type="checkbox" ms-duplex-checked="allchecked" data-duplex-changed="checkAll">
                                </label>
                            </th> -->
                            <th>序号</th>
                            <th>题目</th>
                            <th>权重</th>
                            <th>指标</th>
                            <th>选项类型</th>
                            <th>选项数量</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ms-repeat="topics.topicList">
                            <!-- <td>
                                <label class="checkbox">
                                  <input type="checkbox" ms-duplex-checked="el.checked" ms-data-index=$index data-duplex-changed="checkOne">
                                </label>
                            </td> -->
                            <td><span ms-text="el.sequence"></span></td>
                            <td><span ms-text="el.title"></span></td>
                            <td><span ms-text="el.weight"></span></td>
                            <td><span ms-text="el.target"></span></td>
                            <td><span ms-text="el.optionModeText"></span></td>
                            <td><span ms-text="el.optionCount"></span></td>
                            <td>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-link" ms-data-id="el.id" ms-data-object="el"
                                            ms-click="topics.editAction()">
                                        <span class="icon-pencil icon-blue"></span>
                                        <span>编辑</span>
                                    </button>
                                    <button type="button" class="btn btn-link" ms-data-id="el.id"
                                            ms-click="topics.removeAction()">
                                        <span class="icon-remove icon-blue"></span>
                                        <span>删除</span>
                                    </button>
                                    <!-- <button type="button" class="btn btn-primary" ms-data-id="el.id" ms-click="topics.preViewAction()">预览</button> -->
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="content" style="padding-top:0px;display: none;" ms-controller="topicEdit" id="topicEdit">
            <div class="panel">
                <div class="exam-intro">
                    <div class="left">
                        <i class="icf-survey"></i>
                    </div>
                    <div class="right">

                    </div>
                    <div class="center">
                        <h4>问题信息</h4>

                        <div class="tip">%项目%:项目名称 %物业%:物业地址 %姓名%:客户名 %用户名%:登录用户名</div>
                    </div>
                </div>
                <div class="exam-box">
                    <form action="javascript:void(0)" id="topicForm">
                        <table class="table table-info">
                            <tr>
                                <th>序号</th>
                                <td><input type="text" class="span1" id="topicSequence" ms-duplex="form.sequence"
                                           data-validator="required,integer,range[1~99],func[checkTopicSequence]"><em
                                        class="icf-import errortip"></em></td>
                                <th>标题</th>
                                <td colspan="3">
                                    <input type="text" class="span7" ms-duplex="form.title"
                                           data-validator="required,length[0~500]"><em class="icf-import errortip"></em>
                                </td>
                            </tr>
                            <tr>
                                <th>指标</th>
                                <td><input type="text" class="span2" ms-duplex="form.target"
                                           data-validator=""><em class="icf-import errortip"></em></td>
                                <th>权重</th>
                                <td>
                                    <div class="input-append">
                                        <input type="text" class="span2" ms-duplex="form.weight"
                                               data-validator="integer,range[1~100]">
                                        <span class="add-on">%</span>
                                        <em class="icf-import errortip"></em>
                                    </div>
                                </td>
                                <th>类型</th>
                                <td>
                                    <div>
                                        <select class="span2" ms-duplex="form.optionMode" data-validator="required">
                                            <option ms-repeat="topicOptionModes" ms-data-id="el.id"
                                                    ms-attr-value="el.code" ms-text="el.value"></option>
                                        </select>
                                    </div>
                                </td>
                                <%--<th>是否启用</th>--%>
                                <%--<td><label class="checkbox"><input type="checkbox" ms-duplex-checked="form.isEnabled"/></label>--%>
                                <%--</td>--%>
                            </tr>
                        </table>
                    </form>
                    <div class="exam-control">
                        <div class="btn-group">
                            <button type="button" class="btn btn-primary" id="topicSaveBtn" ms-click="saveAction()">
                                <span class="icon-ok icon-white"></span>
                                <span>保存</span>
                            </button>
                            <button type="button" class="btn" id="topicResetBtn" ms-click="resetAction()">
                                <span class="icon-refresh"></span>
                                <span>重置</span>
                            </button>
                            <button type="button" class="btn" id="topicCancelBtn" ms-click="cancelAction()">
                                <span class="icon-refresh"></span>
                                <span>返回</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel">
                <div class="exam-intro">
                    <div class="left">
                        <i class="icf-survey"></i>
                    </div>
                    <div class="right">
                        <button class="btn btn-primary" id="editTopicBtn" ms-visible="showAddBtn"
                                ms-click="addOptionAction()">
                            <span class="icon-plus icon-white"></span>
                            <span>新增</span>
                        </button>
                    </div>
                    <div class="center">
                        <h4>选项列表</h4>

                        <div class="tip">%项目%:项目名称 %物业%:物业地址 %姓名%:客户名 %用户名%:登录用户名</div>
                    </div>
                </div>
                <div class="exam-box"></div>
                <div class="" id="optionTableContainer">
                    <table class="table table-list">
                        <thead>
                        <tr>
                            <!-- <th>
                              <label class="checkbox">
                                <input type="checkbox" ms-duplex-checked="allchecked" data-duplex-changed="checkAll">
                                </label>
                            </th> -->
                            <th>序号</th>
                            <th>选项分类</th>
                            <th>分数</th>
                            <th>选项内容</th>
                            <th>处理方式</th>
                            <th>跳转序号</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ms-repeat="options.optionList">
                            <!-- <td>
                                <label class="checkbox">
                                  <input type="checkbox" ms-duplex-checked="el.checked" ms-data-index=$index data-duplex-changed="checkOne">
                                </label>
                            </td> -->
                            <td><span ms-text="el.sequence"></span></td>
                            <td><span ms-text="el.categoryText"></span></td>
                            <td><span ms-text="el.score"></span></td>
                            <td><span ms-text="el.content"></span></td>
                            <td><span ms-text="el.processModeText"></span></td>
                            <td><span ms-text="el.gotoTopic"></span></td>
                            <td>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-link" ms-data-id="el.id" ms-data-object="el"
                                            ms-click="options.editAction()">
                                        <span class="icon-pencil icon-blue"></span>
                                        <span>编辑</span>
                                    </button>
                                    <button type="button" class="btn btn-link" ms-data-id="el.id"
                                            ms-click="options.removeAction()">
                                        <span class="icon-remove icon-blue"></span>
                                        <span>删除</span>
                                    </button>
                                    <!-- <button type="button" class="btn btn-primary" ms-data-id="el.id" ms-click="options.preViewAction()">预览</button> -->
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal hide edit-dialog" id="topicEditDialog" style="height:400px;width: 1024px;margin-left: -512px;">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h3>选项信息</h3>
        </div>
        <div class="modal-body">
            <div class="" ms-controller="optionEdit">
                <div class="text-left">
                    <form action="javascript:void(0)" id="optionForm">
                        <table class="table table-info">
                            <tr>
                                <th>序号</th>
                                <td><input type="text" class="span2" id="optionSequence" ms-duplex="form.sequence"
                                           data-validator="required,integer,range[1~99],func[checkOptionSequence]"><em
                                        class="icf-import errortip"></em></td>
                                <th>选项分类</th>
                                <td>
                                    <div>
                                        <select class="span2" ms-duplex="form.category" data-validator="required">
                                            <option ms-repeat="optionCategories" ms-data-id="el.id"
                                                    ms-attr-value="el.code" ms-text="el.value"></option>
                                        </select>
                                        <em class="icf-import errortip"></em>
                                </td>
                </div>
                <th>分数</th>
                <td><input type="text" class="span2" ms-duplex="form.score" data-validator="required,double"><em
                        class="icf-import errortip"></em></td>
                </tr>
                <tr>
                    <th>选项内容</th>
                    <td colspan="6">
                        <input type="text" class="span8" ms-duplex="form.content"
                               data-validator="required,length[0~500]"><em class="icf-import errortip"></em>
                    </td>
                </tr>
                <tr>
                    <th>处理</th>
                    <td colspan="6">
                        <div class="text-left">
                            <label class="inline" ms-repeat="processModes">
                                <input type="radio" ms-duplex-number="form.processMode" ms-data-id="el.id"
                                       ms-attr-value="el.code"><span ms-text="el.value"></span>
                                <input type="text" class="span1" name="gotoTopic" ms-if-loop="el.code == 2"
                                       ms-duplex="form.gotoTopic" disabled>
                            </label>
                            <em ms-if-loop="el.code == 2" class="icf-import errortip"></em>
                        </div>
                    </td>
                </tr>
                </table>
                </form>
                <div class="text-center">
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary" id="optionSaveBtn" ms-click="saveAction()">
                            <span class="icon-ok"></span>
                            <span>保存</span>
                        </button>
                        <button type="button" class="btn" id="optionResetBtn" ms-click="resetAction()">
                            <span class="icon-refresh"></span>
                            <span>重置</span>
                        </button>
                        <!-- <button type="button" class="btn" id="optionResetBtn" ms-click="resetAction()">重设</button> -->
                        <button type="button" class="btn" id="optionCancelBtn" ms-click="cancelAction()">
                            <span class="icon-refresh"></span>
                            <span>返回</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="modal-footer">
          <a href="javascript:void(0)" class="btn" data-dismiss="modal" aria-hidden="true">关闭</a>
          <a href="#" class="btn btn-primary">保存</a>
        </div> -->
    </div>
    <%@include file="/common/footer.jsp" %>
    <script src="${serverPath}/static/js/plugs/datepicker/WdatePicker.js"></script>
    <script src="${serverPath}/static/js/views/selectProject.js"></script>
    <script src="${serverPath}/static/js/views/edit.js"></script>
    <script type="text/javascript">
        window['questionnaireId'] = '${questionnaireId}';
    </script>
</body>
</html>
