<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/common/taglibs.jsp"%>

<%@page import="bingo.security.SecurityContext"%>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:tvns>
<head>
    <title>短信单发</title>
    <%@include file="/common/meta.jsp"%>
    <ui:combine widgets="tree,layout,contextmenu,dhtmlxgrid,dialog,multiselect,messagebox"></ui:combine>
    <ui:script src="/modules/sms/script/sms_send_single_main.js"></ui:script>
</head>

<body>
	<div data-widget="layout" style="height:100%;width:100%;">
		<div region="west" split="true" title="短信模板分类" style="width:200px;">
            	<div id="treeDiv" oncontextmenu="return false;"></div>
		</div>
		<div region="center" style="padding:1px;width:100%;border:1px;padding: 0px;">
			<iframe name="content_frame" id="content_frame" 
					marginwidth="0" marginheight="0" 
					width=100% height="100%"
					scrolling="auto" frameborder="0">
		    </iframe> 
		</div>
	</div>
</body>
</html>