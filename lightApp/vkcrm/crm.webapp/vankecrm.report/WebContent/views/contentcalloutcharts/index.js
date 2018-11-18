define(["text!views/contentcalloutcharts/index.html"], function(modelHtml) {
	var hasInit = false;

	function init() {
		if (hasInit) {
			return;
		}
		hasInit = true;
		/* 模版缓存 */
		avalon.templateCache["contentcalloutcharts"] = modelHtml;
        avalon.vmodels["root"].src_contentcalloutcharts = "contentcalloutcharts";
		setTimeout(function() {
			helper.bindEvent();
		});
	}

	function active() {
		init();
		avalon.vmodels.root.visibleIndex = 'calloutcharts';
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