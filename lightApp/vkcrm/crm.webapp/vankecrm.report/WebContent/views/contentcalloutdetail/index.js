define(["text!views/contentcalloutdetail/index.html"], function(modelHtml) {
	var hasInit = false;

	function init() {
		if (hasInit) {
			return;
		}
		hasInit = true;
		/* 模版缓存 */
		avalon.templateCache["contentcalloutdetail"] = modelHtml;
        avalon.vmodels["root"].src_contentcalloutdetail = "contentcalloutdetail";
		setTimeout(function() {
			helper.bindEvent();
		});
	}

	function active() {
		init();
		avalon.vmodels.root.visibleIndex = 'calloutdetail';
	}

	function inactive() {

	}
	var helper = {
		bindEvent: function() {

		}
	}
	return {
		active: active,
		inactive: inactive
	}
})