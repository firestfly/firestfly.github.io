<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% request.setAttribute("headerBtn3", "on"); %>
<%@include file="/common/taglibs.jsp" %>
<html>
<head>
  <%@include file="/common/meta.jsp" %>
  <title>新增客户</title>
  <script type="text/javascript">
    window.carportId = '${carportId}';
  </script>
</head>

<body>
我是车位新增客户页面
<%@include file="/common/footer.jsp" %>
</body>
</html>