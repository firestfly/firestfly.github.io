<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isErrorPage="true" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>
<a class="error-back" href="javascript:history.back();">
    <span class="icf-back">返回</span>
</a>

<br/>
<pre class="page-404">          .----.
       _.'__    `.
   .--($)($$)---/#\
 .' @          /###\
 :         ,   #####
  `-..__.-' _.-\###/
        `;_:    `"'
      .'"""""`.
     /,  ya ,\\
    //  404!  \\
    `-._______.-'
    ___`. | .'___
   (______|______)
</pre>
<div class="error-info">
    <h5>错误信息</h5>

    <p>
        <%= exception.getMessage()%>
    </p>
</div>


</body>
</html>
