define(["text!views/contentproject/index.html"], function(modelHtml) {
	var hasInit = false;

	function init() {
		if (hasInit) {
			return;
		}
		hasInit = true;
		/* 模版缓存 */
		avalon.templateCache["contentproject"] = modelHtml;
        avalon.vmodels["root"].src_contentproject = "contentproject";
		setTimeout(function() {
			helper.bindEvent();
		});
	}

	function active() {
		init();
		avalon.vmodels.root.visibleIndex = 'project';
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