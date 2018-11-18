<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="UTF-8">
  <title>万科资源管理系统 - 系统提示</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <link href="<c:url value="/components/bootstrap/dist/css/bootstrap.min.css"/>" rel="stylesheet">
  <link href="<c:url value="/styles/vkrms.css"/>" rel="stylesheet">
</head>
<body class="exception">
<div class="vk-exception-container">
  <div class="row vk-exception-title">
    <div class="col-md-12 text-center">
      <img src="<c:url value="/images/logo.png"/>" alt="万科资源管理系统"/>
    </div>
  </div>
  <div class="row vk-exception-content">
    <div class="col-md-12 text-center">
      <div class="panel panel-default vk-exception-popup">
        <div class="panel-body vk-exception-hint">
            抱歉，系统繁忙，或者发生意外错误，请您重试。
        </div>
        <div class="panel-body">
          <a href="<c:url value="/logout"/>" class="btn vk-btn-login vk-btn-default">重新登录</a>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</body>
</html>
