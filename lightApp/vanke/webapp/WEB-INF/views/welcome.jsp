<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>万科资源管理系统</title>
    <link rel="icon" href="<c:url value="/images/vkrms.ico"/>" type="image/x-icon">
    <link href="<c:url value="/components/bootstrap/dist/css/bootstrap.min.css"/>" rel="stylesheet">
    <link href="<c:url value="/styles/vkrms.css"/>" rel="stylesheet">
</head>
<body class="welcome">
<div class="vk-welcome-container">
    <div class="row">
        <div class="col-md-12 text-center">
            <img src="<c:url value="/images/vanke-logo.png"/>" alt="万科logo" class="welcome-logo"/>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12 text-center">
            <div class="panel panel-default login-popup">
                <div class="panel-heading">资源管理信息系统</div>
                <div class="panel-body">
                    <a href="<c:url value="/login"/>" class="btn vk-btn-login vk-btn-default">登 录</a>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</body>
</html>
