<%@ page language="java" pageEncoding="UTF-8" %>
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
<body style="margin:0px; background-color:rgb(240,242,241)">
<div style="width:100%; height:50px; background:rgb(46,46,51);">
    <div style="text-align:center; color:white; line-height:50px; font-size:18px;">授权失败</div>
    <div style="position: absolute;
                top: 16px;
                left: 12px;
                width: 20px;
                height: 20px;
                background-image: url('../../rm-mobile/app/images/close.png');
                background-repeat: no-repeat;
                background-position: 0px 0px;
                background-size: 100% 100%;" onclick="closeRM();"></div>
</div>
<div style="position:absolute; top:40%; left:50%; color:rgb(151,151,153); font-size:16px; width: 80%; text-align: center;
            transform:translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);" id="errorMsg">错误信息
</div>
<script type="text/javascript">
    //    setTimeout("window.location.href = '/native_service?data={\"method\":\"closeWeb\"}';", 3000);

    function closeRM() {
        window.location.href = '/native_service?data={"method":"closeWeb"}';
    }

    var errorCode = getQueryString('errorCode');
    var token = getQueryString('token');
    var errorMsg = '';

    if (errorCode == '401') {
        errorMsg = '您还未开通访问此服务的权限';
    } else if (errorCode == '204') {
        errorMsg = '您所在的项目暂未开通此服务';
    }
    document.getElementById('errorMsg').innerHTML = errorMsg;

    var rmUserStr = localStorage.rmUser,
            rmUser;
    if (rmUserStr != null) {
        rmUser = JSON.parse(localStorage.rmUser);
        rmUser.token = token;
    } else {
        rmUser = {
            token: token
        };
    }

    localStorage.rmUser = JSON.stringify(rmUser);

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
</script>
</body>
</html>

