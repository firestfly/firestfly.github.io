<!doctype html>
<%@ page language="java" pageEncoding="UTF-8" %>
<html>
<head>
    <%@include file="/common/meta.jsp" %>
</head>
<body>
<%@include file="/common/header.jsp" %>
<div class="container-fluid">
    <div class="row-fluid">
        <div class="span3">
            <%@include file="/common/sildebar.jsp" %>
        </div>
        <div class="span9">
            <div><input type="text" id="projectCode">
                <input class="btn btn-small btn-primary" type="button" value="待交付房屋查看" id="showrooms"/>
                <input class="btn btn-small btn-primary" type="button" value="直接导出" id="exportrooms"/>
            </div>
            <div id="exportRoom"></div>
        </div>
    </div>
</div>
<script type="text/html" id="tabletmpl">
    <div>
        <table class="table">
            <thead>
            <tr>
                <th class=""/>
                序号</th>
                <th class="">项目名称</th>
                <th class="">项目编号</th>
                <th class="">楼栋名称</th>
                <th class="">房屋名称</th>
                <th class="">房屋编号</th>
            </tr>
            </thead>
            <tbody>
            {{each details as value index}}
            <tr>
                <td>{{index+1}}</td>
                <td><a href="#">{{value.belongtoProjectname}}</a></td>
                <td>{{value.belongtoProjectcode}}</td>
                <td class="">{{value.belongtoBuilding}}</td>
                <td class="">{{value.room_name}}</td>
                <td class="">{{value.roomCord}}</td>
            </tr>
            {{/each}}
            </tbody>
        </table>
    </div>
    {{include 'paginationtmpl'}}
</script>
<script type="text/html" id="paginationtmpl">
    <div class="pagination">
        <ul>
            <li><a href="#">上一页</a></li>
            <li><a href="#">1</a></li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#">4</a></li>
            <li><a href="#">5</a></li>
            <li><a href="#">下一页</a></li>
        </ul>
    </div>
</script>
<%@include file="/common/footer.jsp" %>
<script src="${serverPath}/modules/roomsExport/script/roomexport.js"></script>
</body>
</html>