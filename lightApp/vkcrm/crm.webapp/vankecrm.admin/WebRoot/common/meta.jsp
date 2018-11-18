<!-- HTTP 1.1 -->
<%@page import="bingo.common.core.ApplicationContext"%>
<meta http-equiv="cache-control" content="no-store"/>
<%@page import="bingo.web.GlobalConfig"%>
<!-- HTTP 1.0 -->
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<%
	StringBuffer url = request.getRequestURL();
	String contextPath = url.delete(url.length() - request.getRequestURI().length(), url.length()).append(request.getContextPath()).toString();
	request.setAttribute("contextPath",contextPath);
	request.setAttribute("path",contextPath);
	request.setAttribute("serverPath",contextPath);
	response.setHeader("P3P","CP=\"CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR\"");
	
	String theme = GlobalConfig.getConfigValue("Profile.theme","szmobile");
	request.setAttribute("theme",theme);
	

    // 相关数据服务地址
    request.setAttribute("serviceCustomerPath", ApplicationContext.getProperty("service.customer.path"));
    request.setAttribute("serviceHousePath", ApplicationContext.getProperty("service.house.path"));
    request.setAttribute("serviceTaskPath", ApplicationContext.getProperty("service.task.path"));
    request.setAttribute("serviceTelPath", ApplicationContext.getProperty("service.tel.path"));
    // 相关Web站点地址
    request.setAttribute("staticWeb", ApplicationContext.getProperty("staticWeb"));
	
	
%>

<script type="text/javascript">
	var Global = {};
	Global.contextPath = '${contextPath}';
	Global.serverPath = '${serverPath}';
	var Config = Global ;

	window.Global = Global;

	var dataServiceURL = Global.contextPath+"/dataservice/" ;
	
    <%--初始化数据服务地址--%>
    var servicePath = {};
    window.servicePath["customer"] = '${serviceCustomerPath}';
    window.servicePath["house"] = '${serviceHousePath}';
    window.servicePath["task"] = '${serviceTaskPath}';
    window.servicePath["tel"] = '${serviceTelPath}';
</script>

<ui:combine widgets="framework-common">
	<link rel="stylesheet" type="text/css" href="${contextPath}/statics/themes/${theme}/style.css" />
</ui:combine>

<!-- fix themes -->
<style type="text/css">
	.datalist .toolbar{
		padding-bottom:0px;
		height:22px;
	}
	
	.ui-tag-radio input{
		vertical-align: middle;
		position:relative;
	}
	
	.ui-tag-radio td{
		height:10px;
	}
	
	.ui-tag-radio label{
		padding: 0px 5px;
		position:relative;
		display: inline-block;
	}
</style>

<script type="text/javascript">
		$(function(){
			  $(document).find("form").keydown(function(e){
				  var kc = e.keyCode ;
				  if(kc == 13){
					 var $tgt = $(e.target);
					 
					 if (!$tgt.is('input'))return true ;
					 
			 		 if (e && e.preventDefault) {
			 			e.preventDefault();
			 		 } else {
						window.event.returnValue = false;
					 }
					 return false;
				  }
				  return true ;
		      }) ;
		  }) ;
		
		

		function alertObject(o,level1){
			var text ='';
			if(level1 == undefined )level1=1;
			if( o==undefined || o=='')return '';
			else if(level1 > 2)return o+'';
			else if(o instanceof String || o instanceof Number)return o+'';
			else{
				for (var key in o) {
					for(var i=1;i<level1;i++)text += '- ';
					try{
						text += key+" = "+alertObject(o[key],level1+1)+"<br>\n";
					}catch(e){
						text += key+" = "+e;
					}
				}
			}
//			else if(o instanceof Array){
//				for (var i = 0;i<o.length;i++) {
//					text += i+" = "+alertObject(o[i])+"<br>\n";
//				}
//			}
			
			return text;
		}
		
		
		  </script>