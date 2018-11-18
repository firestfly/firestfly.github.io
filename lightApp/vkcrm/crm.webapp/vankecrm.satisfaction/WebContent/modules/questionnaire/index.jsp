<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8" %>
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
        <div class="content" style="padding-top:0px;">
            <div ms-controller="satisfaction" class="panel">
                <div class="exam-intro">
                    <div class="left">
                        <i class="icf-survey"></i>
                    </div>
                    <div class="right">
                        <security:isAllow privilege="QUESTIONNAIRE_MANAGE$CREATE">
                            <button class="btn btn-primary" ms-visible="showAddBtn" ms-click="addQuestionnaireAction()">
                                <span class="icon-plus icon-white"></span>
                                <span>新增</span>
                            </button>
                        </security:isAllow>
                    </div>
                    <div class="center">
                        <h4>调查问卷列表</h4>

                        <div class="tip">...</div>
                    </div>
                </div>
                <div class="exam-box"></div>
                <div class="" id="questionnaireTableContainer">
                    <table class="table table-list">
                        <thead>
                        <tr>
                            <th>标题</th>
                            <th>开始时间</th>
                            <th>结束时间</th>
                            <th>延迟时间</th>
                            <th>说明</th>
                            <th>抽样比例</th>
                            <th>年度完成率</th>
                            <th>问题数量</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ms-repeat="questionnaires.questionnaireList">
                            <td><span ms-text="el.title"></span></td>
                            <td><span ms-text="el.beginTime"></span></td>
                            <td><span ms-text="el.endTime"></span></td>
                            <td><span ms-text="el.delayTime"></span></td>
                            <td><span ms-text="el.description"></span></td>
                            <td><span ms-text="el.sampleRatio"></span></td>
                            <td><span ms-text="el.annualCompleteRate"></span></td>
                            <td><span ms-text="el.topicCount"></span></td>
                            <td>
                                <span ms-if-loop="el.crossTime==true&&el.isEnabled==true">非进行中</span>
                                <span ms-if-loop="el.crossTime==false&&el.isEnabled==true">进行中</span>
                                <span ms-if-loop="el.crossTime==false&&el.isEnabled==false">非进行中</span>
                                <span ms-if-loop="el.crossTime==true&&el.isEnabled==false">非进行中</span>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <security:isAllow privilege="QUESTIONNAIRE_MANAGE$EDIT">
                                        <button type="button" class="btn btn-link" ms-data-id="el.id"
                                                ms-click="questionnaires.editAction()">
                                            <span class="icon-edit icon-blue"></span>
                                            <span>编辑</span>
                                        </button>
                                    </security:isAllow>
                                    <security:isAllow privilege="QUESTIONNAIRE_MANAGE$DEL">
                                        <button ms-if-loop="el.isEnabled==false" type="button" class="btn btn-link"
                                                ms-data-id="el.id"
                                                ms-click="questionnaires.removeAction()">
                                            <span class="icon-remove icon-blue"></span>
                                            <span>删除</span>
                                        </button>
                                    </security:isAllow>
                                    <security:isAllow privilege="QUESTIONNAIRE_MANAGE$EDIT">
                                        <button ms-if-loop="el.isEnabled==false" type="button" class="btn btn-link"
                                                ms-data-id="el.id"
                                                ms-click="questionnaires.restoreAction()">
                                            <span class="icon-ok icon-blue"></span>
                                            <span>启用</span>
                                        </button>
                                    </security:isAllow>
                                    <security:isAllow privilege="QUESTIONNAIRE_MANAGE$EDIT">
                                        <button ms-if-loop="el.isEnabled==true" type="button" class="btn btn-link"
                                                ms-data-id="el.id"
                                                ms-click="questionnaires.stopAction()">
                                            <span class="icon-remove icon-blue"></span>
                                            <span>停用</span>
                                        </button>
                                    </security:isAllow>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination" id="pagination"></div>
            </div>
        </div>
    </div>
</div>
<%@include file="/common/footer.jsp" %>
<script type="text/html" id="paginationtmpl">
    <ul>
        <li data-index="-1" {{if hasPrev}}class="disabled" {{
        /if}}><a href="#">上一页</a></li>
        {{each left}}
        <li data-index="{{$value.index}}"><a href="#">{{$value.index}}</a></li>
        {{/each}}
        {{if hasLeft}}
        <li data-index="{{hasLeft}}"><a href="#">...</a></li>
        {{/if}}
        {{each center}}
        <li data-index="{{$value.index}}" {{if $value.isCurrent}}class="active" {{
        /if}}><a href="#">{{$value.index}}</a></li>
        {{/each}}

        {{if hasRight}}
        <li data-index="{{hasRight}}"><a href="#">...</a></li>
        {{/if}}
        {{each right}}
        <li class="" data-index="{{$value.index}}"><a href="#">{{$value.index}}</a></li>
        {{/each}}
        <li data-index="+1" {{if hasNext}}class="disabled" {{
        /if}}><a href="#">下一页</a></li>
    </ul>
</script>
<script src="${serverPath}/static/js/views/list.js"></script>
</body>
</html>
