<%@ page language="java" pageEncoding="UTF-8"%>

<div class="footer"></div>
<script src="${staticWeb}/lib/jquery-1.11.0.min.js"></script>
<!--[if IE 8]>
<script type="text/javascript" src="${serverPath}/static/js/jquery.xdomainrequest.min.js"></script>
<![endif]-->
<script src="${staticWeb}/lib/bootstrap.min.js"></script>
<script src="${staticWeb}/js/common.js"></script>
<script src="${staticWeb}/lib/artTemplate.js"></script>
<script src="${staticWeb}/js/templateExt.js"></script>
<script type="text/html" id="paginationtmpl">
	<ul>
		<li data-index="-1" {{if hasPrev}}class="disabled" {{
		/if}}><a href="#">上一页</a></li>
		{{each left}}
		<li data-index="{{$value.index}}"><a href="#">{{$value.index}}</a></li>
		{{/each}}
		{{if hasLeft}}
		<li data-index="{{hasLeft}}"><a href="#">...</a></li>
		{{/if}}
		{{each center}}
		<li data-index="{{$value.index}}" {{if $value.isCurrent}}class="active" {{
		/if}}><a href="#">{{$value.index}}</a></li>
		{{/each}}

		{{if hasRight}}
		<li data-index="{{hasRight}}"><a href="#">...</a></li>
		{{/if}}
		{{each right}}
		<li class="" data-index="{{$value.index}}"><a href="#">{{$value.index}}</a></li>
		{{/each}}
		<li data-index="+1" {{if hasNext}}class="disabled" {{
		/if}}><a href="#">下一页</a></li>
	</ul>
</script>
<hr>
<footer>
	<p>&copy; Company 2013</p>
</footer>