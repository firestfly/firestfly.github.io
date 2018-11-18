// 模块名：_modelName_
define([], function() {
	/**
	 * 变量定义
	 */
	var hasInit = false;
	var listPager, getList_handle;
	/**
	 * 初始化
	 */
	function init() {
		if (hasInit) {
			return;
		}
		hasInit = true;
		setTimeout(function() {
			helper.bindEvent();
		});
	}
	/**
	 * 激活
	 */
	function active() {
		init();
	}
	/**
	 * 冷冻
	 */
	function inactive() {

	}
	/**
	 * 数据模型
	 */
	var model = avalon.define({
		$id: "_modelName_",
		form: {},
		data: {
			list: [],
			loading: false
		},
		search_event: function() {
			helper.ajaxGetList();
		},
		reset_event: function() {}
	});
	/**
	 * 指令
	 */
	var helper = {
		// 事件绑定
		bindEvent: function() {
			listPager = new Pagination({
				selector: "#_modelName__pager",
				onchange: function(pageInfo) {
					helper.ajaxGetList(pageInfo.curpage);
				}
			})
		},
		// 获取变量
		getFormData: function() {
			return {};
		},
		// 获取查询列表
		ajaxGetList: function(pageIndex) {
			if (getList_handle) {
				getList_handle.abort();
			}
			var data = helper.getFormData();
			data["pageIndex"] = pageIndex || 1;
			// 初始化
			model.data.loading = true;
			model.data.list = [];
			getList_handle = Common.ajax({
				url: Config.ajaxUrl["getReport__modelName_"],
				type: "GET",
				data: data,
				success: function(res) {
					model.data.list = res;
					var pginfo = data.pagination;
					listPager.render({
						curpage: pginfo.curPage,
						pagesize: pginfo.pageSize,
						totalpage: pginfo.totalPage,
						totalsize: pginfo.totalSizeƒ
					})
				},
				complete: function() {
					model.data.loading = false;
				}
			})
		}
	}
	return {
		active: active,
		inactive: inactive
	}
})