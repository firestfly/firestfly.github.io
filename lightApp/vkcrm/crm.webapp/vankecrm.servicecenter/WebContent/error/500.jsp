<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title></title>
</head>
<body style="position: relative;">
<a href="javascript:history.back();">返回</a>

<br/>
<h5>错误信息</h5>
<p>
  <%= exception.getMessage()%>
    ${errorMessage}
</p>
<div style="position: absolute; top: 0px;bottom: 0px;left:0px;right: 0px;">
    <pre class="page-404" style="width:120px;margin:80px auto;">          .----.
       _.'__    `.
   .--($)($$)---/#\
 .' @          /###\
 :         ,   #####
  `-..__.-' _.-\###/
        `;_:    `"'
      .'"""""`.
     /,  ya ,\\
    //  500!  \\
    `-._______.-'
    ___`. | .'___
   (______|______)
        </pre>
</div>
</body>
</html>
