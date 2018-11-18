define([], function() {

	/* avalon */
	var hasInit = false;
	var callintask = avalon.define({
		$id: "callintask",
		// 当前页码
		curPage: 1,
		pageSize: 10,
		totalSize: 0,
		form: {
			// 查询时间段
			st_time: "",
			ed_time: "",
			// 任务类容
			content: ""
		},
		// 列表数据
		data: {
			isLoading: true,
			isError: false,
			list: []
		},
		// 参数配置
		options: {
			// 来源
			source: {
				id: "",
				text: "全部",
				defaultText: "全部",
				list: [],
				levelRel: [],
				nextStep: [],
				rootOption: true
			},
			// 管理中心
			cct_organization: {
				id: "",
				text: "全部",
				defaultText: "全部",
				list: [],
				levelRel: ["cct_project", "grid", "cct_building", "cct_house"],
				nextStep: ["getProject"],
				rootOption: true
			},
			// 城市
			city: {
				id: "",
				text: "全部",
				defaultText: "全部",
				list: [],
				levelRel: ["cct_organization", "cct_project", "grid", "cct_building", "cct_house"],
				nextStep: ["getProject"],
				rootOption: true
			},
			// 项目
			cct_project: {
				id: "",
				text: "全部",
				defaultText: "全部",
				list: [],
				levelRel: ["grid", "cct_building", "cct_house"],
				nextStep: ["getBuilding", "getGrid"],
				rootOption: false
			},
			// 网格
			grid: {
				id: "",
				text: "全部",
				defaultText: "全部",
				list: [],
				levelRel: ["cct_building", "cct_house"],
				nextStep: ["getBuilding"],
				rootOption: false
			},
			// 楼栋
			cct_building: {
				id: "",
				text: "全部",
				defaultText: "全部",
				list: [],
				levelRel: ["cct_house"],
				nextStep: ["getHouse"],
				rootOption: false
			},
			// 房屋
			cct_house: {
				id: "",
				text: "全部",
				defaultText: "全部",
				list: [],
				levelRel: [],
				nextStep: [],
				rootOption: false
			}
		},
		loadOptionsTip: '正在获取...',
		curTarget: '',
		curPlaneList: [],
		hasBeenSubmitted: false,
		choosePlane_vis: false,
		paginationLoad: false,
		// 查询按钮事件
		search_event: function(e) {
			callintask.curPage = 1;
			cus_data_helper.getTaskReportData();
		},
		// 重置
		reset_event: function(e) {
			// 查询时间段
			$('.Wdate').val('');
			var _now = new Date() - 0;
			var _last_month = _now - 30 * 24 * 60 * 60 * 1000;
			callintask.form.st_time = Common.formatDate(_last_month, 'yyyy-MM-dd HH:mm:ss');
			callintask.form.ed_time = Common.formatDate(_now, 'yyyy-MM-dd HH:mm:ss');
			// 创建人
			callintask.curPage = 1;
			callintask.pageSize = 10;

			for (var key in callintask.options) {
				if (callintask.options.hasOwnProperty(key)) {
					callintask.options[key].id = '';
					if (!callintask.options[key].rootOption) {
						callintask.options[key].list = [];
					}
					callintask.options[key].text = callintask.options[key].defaultText;
				}
			}
			callintask.form.content = '';
		},
		// 导出
		export_event: function() {
			var _this = $(this);
			var exportUrl = Config["newAjaxUrl"].getCallTaskReportExport
			 + "?start=" + callintask.form.st_time
			 + "&end=" + callintask.form.ed_time
			 + "&content=" + callintask.form.content
			 //+ "&source=" + callintask.options.source.id
			 + "&cityCode=" + callintask.options.city.id
			 + "&mcId=" + callintask.options.cct_organization.id
			 + "&projectId=" + callintask.options.cct_project.id
			 + "&gridId=" + callintask.options.grid.id
			 + "&buildingCode=" + callintask.options.cct_building.id
			 + "&houseId=" + callintask.options.cct_house.id
			 + "&access_token=" + Common.cookie('access_token');
			$('#prjdetail_export').attr('src', exportUrl);
		},
		// 关闭控制面板
		close: function() {
			callintask.choosePlane_vis = false;
		},
		// 清除选择面板
		cleanCurOptions: function() {
			var _this = $(this);
			var targetName = _this.attr('target');
			if (!callintask.options[targetName]) return;
			var levelRel = callintask.options[targetName].levelRel;
			for (var i = 0; i < levelRel.length; i++) {
				callintask.options[levelRel[i]].id = "";
				callintask.options[levelRel[i]].text = callintask.options[levelRel[i]].defaultText;
				callintask.options[levelRel[i]].list = [];
			}
			callintask.options[targetName].id = "";
			callintask.options[targetName].text = callintask.options[targetName].defaultText;
			callintask.choosePlane_vis = false;
		},

		cleanRelOptions: function(targetName) {
			if (!callintask.options[targetName]) return;
			var levelRel = callintask.options[targetName].levelRel;
			for (var i = 0; i < levelRel.length; i++) {
				callintask.options[levelRel[i]].id = "";
				if (!callintask.options[levelRel[i]].rootOption) {
					callintask.options[levelRel[i]].list = [];
				}
				callintask.options[levelRel[i]].text = callintask.options[levelRel[i]].defaultText;
			}
			callintask.choosePlane_vis = false;
		},

		// 选择面板控制
		choosePlaneControl: function() {
			var _this = $(this);

			var menu_left = $("#left").width(),
					menu_top = $(".header").height();

			if (callintask.choosePlane_vis) {
				callintask.choosePlane_vis = false;
			} else {
				var targetName = _this.attr('target');
				callintask.curTarget = targetName;
				callintask.curPlaneList = callintask.options[targetName].list;

				var _input = $('input[name="' + targetName + '"]');
				var top = _input.offset().top;
				var left = _input.offset().left;

				$('#cc_choosePlane').css({
					"top": (top - menu_top) + 'px',
					"left": (left - menu_left) + 'px'
				});
				callintask.choosePlane_vis = true;
			}
		}
	});

	/* 获取数据类  列表|管理中心|项目|网格 */
	var callintask_pageInfo = null;
	var cus_data_helper = {

		// 获取管理中心
		getOrganization: function() {
			Common.ajax({
				url: Config["ajaxUrl"].getOrganization,
				type: "GET",
				success: function(data) {
					callintask.options.cct_organization.list = data;
							//cus_data_helper.getTaskReportData();
				},
				error: function() {},
				complete: function() {}
			});
		},

		// 获取字典(城市,来源)
		getDictionary: function() {
			Common.ajax({
				url: Config["ajaxUrl"].getDictionary,
				type: "POST",
				data: {
					codes: "CityCode,AppTaskSource"
				},
				success: function(data) {
					callintask.options.city.text = callintask.options.city.defaultText;
					callintask.options.source.text = callintask.options.source.defaultText;
					callintask.options.city.list = formatDictionary(data.CityCode);
					callintask.options.source.list = formatDictionary(data.AppTaskSource);
				},
				error: function() {},
				complete: function() {}
			});
		},

		// 获取项目
		getProject: function() {
			callintask.options.cct_project.text = callintask.loadOptionsTip;
			if (callintask.options.cct_organization.id == '' && callintask.options.city.id == '') return;
			Common.ajax({
				url: Config["ajaxUrl"].getProject,
				type: "GET",
				data: {
					organizationId: callintask.options.cct_organization.id
					//cityCode: callintask.options.city.id
				},
				success: function(data) {
					callintask.options.cct_project.text = callintask.options.cct_project.defaultText;
					callintask.options.cct_project.list = data;
				},
				error: function() {
					callintask.options.cct_project.text = '选项获取失败';
				},
				complete: function() {}
			});
		},

		// 获取网格by项目
		getGrid: function() {
			// callintask.options.grid.text = callintask.loadOptionsTip;
			if (callintask.options.cct_project.id == '') return;
			Common.ajax({
				url: Config["ajaxUrl"].getGrid,
				type: "GET",
				data: {
					projectId: callintask.options.cct_project.id
				},
				success: function(data) {
					// callintask.options.grid.text = callintask.options.grid.defaultText;
					callintask.options.grid.list = data;
				},
				error: function() {
					// callintask.options.grid.text = '选项获取失败';
				},
				complete: function() {}
			});
		},

		// 获取楼栋by项目
		getBuilding: function() {
			callintask.options.cct_building.text = callintask.loadOptionsTip;
			if (callintask.options.cct_project.id == '') return;
			var ajaxUrl = restURLParse(Config["ajaxUrl"].getBuilding, [{
				key: '{projectId}',
				val: callintask.options.cct_project.id
			}]);
			Common.ajax({
				url: ajaxUrl,
				type: "GET",
				success: function(data) {
					callintask.options.cct_building.text = callintask.options.cct_building.defaultText;
					callintask.options.cct_building.list = data;
				},
				error: function() {
					callintask.options.cct_building.text = '选项获取失败';
				},
				complete: function() {}
			});
		},

		// 获取房屋by项目
		getHouse: function() {
			callintask.options.cct_house.text = callintask.loadOptionsTip;
			if (callintask.options.cct_building.id == '') return;
			Common.ajax({
				url: Config["newAjaxUrl"].getHouseByBuild,
				type: "GET",
				data: {
					buildingId: callintask.options.cct_building.id
				},
				success: function(data) {
					callintask.options.cct_house.text = callintask.options.cct_house.defaultText;
					callintask.options.cct_house.list = data;
				},
				error: function() {
					callintask.options.cct_house.text = '选项获取失败';
				},
				complete: function() {}
			});
		},

		// 获取列表数据
		getTaskReportData: function() {
			callintask.hasBeenSubmitted = true;
			callintask.data.isError = false;
			if (!callintask.curPage) {
				callintask.curPage = 1;
			}
			if (callintask.curPage < 1) return;

	callintask.data.isLoading = true;
	callintask.data.list = [];
			Common.ajax({
				url:Config["ajaxUrl"].getReport_callintask,
				type: "GET",
				cache: false,
				data: {
					curPage: callintask.curPage,
					pageSize: callintask.pageSize,
					start: callintask.form.st_time,
					end: callintask.form.ed_time,
					content: callintask.form.content,
					//source: callintask.options.source.id,
					cityCode: callintask.options.city.id,
					mcId: callintask.options.cct_organization.id,
					projectId: callintask.options.cct_project.id,
					gridId: callintask.options.grid.id,
					buildingCode: callintask.options.cct_building.id,
					houseId: callintask.options.cct_house.id
				},
				success: function(data) {
					if (!callintask.paginationLoad) {
						callintask.paginationLoad = true;
						cus_data_helper.bindPageInfo();
					}
					callintask.data.isLoading = false;
					callintask.data.list = data.list;
					/* 更新分页控件 */
						var tlpinfo = data.pagination;
						callintask_pageInfo.render({
							curpage: tlpinfo.curPage,
							pagesize: tlpinfo.pageSize,
							totalpage: tlpinfo.totalPage,
							totalsize: tlpinfo.totalSize
						});
						callintask.curPage = tlpinfo.curPage;
						callintask.totalSize = tlpinfo.totalSize;
				},
				error: function() {
					callintask.data.isLoading = false;
					callintask.data.isError = true;
				},
				complete: function() {}
			});
		},

		// 设置分页信息
		bindPageInfo: function() {
			callintask_pageInfo = new Pagination({
				selector: "#ccl_pagination",
				onchange: function(pageInfo) {
					callintask.curPage = pageInfo.curpage;
					cus_data_helper.getTaskReportData();
				}
			});
		},

		// 绑定事件
		bindEvent: function() {
			// 选择管理中心
			$("#cc_choosePlane").on("click", 'li', function() {
				var text = $(this).attr('data-text'),
					code = $(this).attr('data-id');
				if (!code || !callintask.curTarget) return;
				callintask.options[callintask.curTarget].text = text;
				callintask.options[callintask.curTarget].id = code;

				// 清空关联项
				callintask.cleanRelOptions(callintask.curTarget);
				// 隐藏当前选择区域
				callintask.choosePlane_vis = false;
				// 获取下一步选项
				var nextStep = callintask.options[callintask.curTarget].nextStep || "";
				if (nextStep && nextStep.length > 0) {
					for (var i = 0; i < nextStep.length; i++) {
						cus_data_helper[nextStep[i]]();
					}
				}
			});


			// 项目变更时事件
			// $("#project").on("change", function() {
			//     // 获取选择项目下的网格
			//     callintask.form.gridId = '';
			//     callintask.form.projectId = $(this).val();
			//     cus_data_helper.getGrid();
			// });

			// 浏览器大小改变事件
			/* window.onresize = function() {
			 cus_data_helper.resizeHeight();
			 };*/
		},

		// 处理页面高度
		/*        resizeHeight: function() {
		 var page_h = $(window).height();
		 var obj = $('#custable');
		 var top_h = obj.offset().top;
		 obj.height(page_h - top_h - 55); // 55: 分页和页面间距的高度
		 }*/
	}

	/* 初始化 */
	function init() {

		if (hasInit) {
			return;
		}
		hasInit = true;

		var _now = new Date() - 0;
		var _last_month = _now - 30 * 24 * 60 * 60 * 1000;

		callintask.form.st_time = callintask.form.st_time || Common.formatDate(_last_month, 'yyyy-MM-dd HH:mm:ss');
		callintask.form.ed_time = callintask.form.ed_time || Common.formatDate(_now, 'yyyy-MM-dd HH:mm:ss');

		/* 模版缓存 */
		// avalon.templateCache["callintask"] = modelHtml;
		// avalon.vmodels["root"].src_contentprjdetail = "contentprjdetail";

		setTimeout(function() {
			// 加载管理中心
			cus_data_helper.getOrganization();
			// 加载字典(城市|来源)
			cus_data_helper.getDictionary();
			// 选择管理中心
			cus_data_helper.bindEvent();
		}, 500);
	}

	/* 清除表单 */
	function clearData(data) {
		var d = data || {},
			m = callintask.form.$model
		for (var i in m) {
			if (d.hasOwnProperty(i)) {
				callintask.form[i] = d[i];
			} else {
				callintask.form[i] = null;
			}
		}
	}

	function restURLParse(url, map) {
		var result = url;
		for (var i = 0; i < map.length; i++) {
			result = result.replace(map[i].key, map[i].val);
		}
		return result;
	}

	/* active */
	function active() {
		init();
		//avalon.vmodels.root.visibleIndex = 'callintask';
	}

	// 格式化字典
	function formatDictionary(data) {
		var len = data.length;
		var result = [];
		if (!len) return result;
		for (var i = 0; i < len; i++) {
			var tmp = {};
			tmp.id = data[i].code;
			tmp.name = data[i].value;
			result.push(tmp);
		}
		return result;
	}

	function fetchData(keyArr, mapArr, data){
		var result = [];
		if(keyArr.length != mapArr.length) return result;
		for(var i=0; i < data.length; i++){
			var item = {};
			for(var j=0; j < mapArr.length; j++){
				item[keyArr[j]] = data[mapArr[j]];
			}
			result.push(item);
		}
		return result;
	}


	return {
		active: active,
		clearData: clearData
	}
});
