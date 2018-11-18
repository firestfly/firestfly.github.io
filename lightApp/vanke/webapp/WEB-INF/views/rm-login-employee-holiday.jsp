<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="baseUrl" value="${pageContext.request.contextPath}"/>

<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>rm-mobile</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="yes"/>
</head>
<body>
<script type="text/javascript">
    var rmUserStr = getCookie('rmUser'),
            baseUrl = "${baseUrl}";

    if (rmUserStr != null) {
        window.location.href = baseUrl + "/home-mobile-login/employee-holiday?token=" + JSON.parse(rmUserStr).token;
    } else {
        window.location.href = baseUrl + "/login/app/employee/holiday";
    }
    //读取cookies
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
</script>
</body>
</html>
