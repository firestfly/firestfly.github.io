define(["text!views/contentsfamass/index.html"], function(modelHtml) {
	var hasInit = false;

	function init() {
		if (hasInit) {
			return;
		}
		hasInit = true;
		/* 模版缓存 */
		avalon.templateCache["contentsfamass"] = modelHtml;
        avalon.vmodels["root"].src_contentsfamass = "contentsfamass";
		setTimeout(function() {
			helper.bindEvent();
		});
	}

	function active() {
		init();
		avalon.vmodels.root.visibleIndex = 'sfamass';
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