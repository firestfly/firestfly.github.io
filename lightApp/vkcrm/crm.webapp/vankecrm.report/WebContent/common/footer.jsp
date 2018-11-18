<%@ page language="java" pageEncoding="UTF-8"%>

<div class="footer"></div>
<script src="${staticWeb}/lib/jquery-1.11.0.min.js?v=${javaScriptVersion}"></script>
<!--[if IE 8]>
<script type="text/javascript" src="${staticWeb}/lib/jquery.xdomainrequest.min.js?v=${javaScriptVersion}"></script>
<![endif]-->
<script type="text/javascript" src="${staticWeb}/lib/JSON2.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/lib/bootstrap.min.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/lib/artTemplate.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/lib/My97DatePicker/WdatePicker.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/templateExt.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/validate.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/pagination.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/satis/common.js?v=${javaScriptVersion}"></script>
<script type="text/javascript" src="${staticWeb}/js/satis/config.js"></script>
<script type="text/javascript" src="${serverPath}/static/js/avalon/avalon.js"></script>
<script type="text/html" id="paginationtmpl">
	<ul>
		<li data-index="-1" {{if hasPrev}}class="disabled"{{/if}}><a href="#">上一页</a></li>
		{{each left}}
			<li data-index="{{$value.index}}"><a href="#">{{$value.index}}</a></li>
		{{/each}}
		{{if hasLeft}}
			<li data-index="{{hasLeft}}"><a href="#">...</a></li>
		{{/if}}
		{{each center}}
			<li data-index="{{$value.index}}" {{if $value.isCurrent}}class="active"{{/if}}><a href="#">{{$value.index}}</a></li>
		{{/each}}

		{{if hasRight}}
			<li data-index="{{hasRight}}"><a href="#">...</a></li>
		{{/if}}
		{{each right}}
			<li class="" data-index="{{$value.index}}"><a href="#">{{$value.index}}</a></li>
		{{/each}}
		<li data-index="+1" {{if hasNext}}class="disabled"{{/if}}><a href="#">下一页</a></li>
	</ul>
</script>