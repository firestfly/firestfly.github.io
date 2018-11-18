define(["text!views/contentquality/index.html"], function(modelHtml) {
	var hasInit = false;

	function init() {
		if (hasInit) {
			return;
		}
		hasInit = true;
		/* 模版缓存 */
		avalon.templateCache["contentquality"] = modelHtml;
        avalon.vmodels["root"].src_contentquality = "contentquality";
		setTimeout(function() {
			helper.bindEvent();
		});
	}

	function active() {
		init();
		avalon.vmodels.root.visibleIndex = 'quality';
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