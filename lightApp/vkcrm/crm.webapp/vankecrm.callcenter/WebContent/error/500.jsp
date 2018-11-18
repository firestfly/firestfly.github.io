<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title></title>
</head>
<body>
<a href="javascript:history.back();">返回</a>

<br/>
<h5>错误信息</h5>
<p>
  <%= exception.getMessage()%>
    ${errorMessage}
</p>
<pre class="page-404">          .----.
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
</body>
</html>
