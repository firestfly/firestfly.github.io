<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta charset="UTF-8">
        <title>欢迎万科资源管理系统</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <link href="<c:url value="/components/bootstrap/dist/css/bootstrap.min.css"/>" rel="stylesheet">
        <!--[if lt IE 9]>
        <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        <link href="/components/bootstrap-fileinput/css/fileinput.css" media="all" rel="stylesheet" type="text/css" />
        <meta name="_csrf" content="${_csrf.token}"/>
        <meta name="_csrf_header" content="${_csrf.headerName}"/>
    </head>
    <body>
        <form method="post" action="/api/excel" enctype="multipart/form-data">
            <input id="importExcelFile" type="file" name="excelFile"  data-show-preview="false">
            <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
        </form>
    </body>
    <script src="/components/jquery/dist/jquery.min.js"></script>
    <script src="/components/bootstrap-fileinput/js/fileinput.js" type="text/javascript"></script>
    <script src="/components/bootstrap-fileinput/js/fileinput_locale_zh.js" type="text/javascript"></script>
    <script src="/components/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>
    <script>
        $(document).ready(function() {
            $('#importExcelFile').fileinput({
                language: 'zh',
                allowedFileExtensions : ['xls','xlsx']
            });
        });
    </script>
</html>
