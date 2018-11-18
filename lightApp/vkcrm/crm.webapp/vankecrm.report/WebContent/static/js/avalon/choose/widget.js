/**
 * $replace: Boolean, 真值时表示替换其容器
 * $slot: String 默认插入点的名字
 * $template: String 组件的模板
 * $extend: String 指定要继承的组件名
 * $container: DOM 插入元素的位置,比如dialog就不一定在使用它的位置插入,通常放在body中
 * $construct: Function 用于调整三个配置项的合并,默认是function:(a, b,c ){return avalon.mix(a, b,c)}
 * $$template Function 用于微调组件的模板,传入$template与当前元素
 * $init: Function 刚开始渲染时调用的回调, 传入model与当前元素
 * $childReady: Function 当其子组件$ready完毕后, 会冒泡到当前组件触发的回调, 传入model与当前元素
 * $ready: Function 当组件的所有子组件都调用其$ready回调后才触发的回调, 传入model与当前元素
 * $dispose: Function 该组件被移出DOM树，并且元素不存在msRetain属性时的销毁回调, 传入model与当前元素
 */
define(["avalon", "text!./widget.html"], function(avalon, template) {
	var group = ["run", "organization", "project", "building", "house"]
	var ajaxUrl = {
		"operation": Config.ajaxUrl["getOperation"],
		"organization": Config.ajaxUrl["getOrganization"],
		"grid": Config.ajaxUrl["getGrid"],
		"city": Config.ajaxUrl["getCity"],
		"project": Config.ajaxUrl["getProject"],
		"building": Config.ajaxUrl["getBuilding"],
		"company": Config.ajaxUrl["getCompany"],
		"house": Config.ajaxUrl["getHouse"]
	}

	/**
	 * ajajx
	 */
	// 获取请求参数
	function getAjaxData() {
		switch (op_type) {
			case "operation":
			case "organization":
			case "grid":
			case "city":
			case "company":
			case "project":
			case "building":
			case "house":
		}
		return {};
	}
	avalon.component("crm:choose", {
		input: "",
		list: [],
		loading: false,
		visible: false,
		disable: false,
		isright: false, // 是否靠右，默认靠左
		code: "",
		// col: "1",
		$computed: {
			col: {
				get: function() {
					var c = Math.ceil(this.list.size() / 8);
					// c >= 1 && c <= 3
					return c == 0 ? 1 : c > 3 ? 3 : c;
				}
			}
		},
		onclean: function() {},
		onclose: function() {},
		$replace: false,
		$template: template,
		$init: function(vm, dom, vms) {},
		$ready: function(vm, dom, vms) {
			var model = vm,
				jq_children = $(dom).children(),
				jq_elem,
				jq_box,
				parentVM,
				option,
				op_type,
				op_notSpecial,
				op_disable;
			// 获取下拉选项
			var ajaxHandle = null;

			function ajaxGetList(op_type) {
				if (ajaxHandle) {
					ajaxHandle.abort();
				}
				model.loading = true;
				//------ test
				setTimeout(function() {

					model.loading = false;
					var l = parseInt(Math.random() * 30),
						arr = [];
					for (var i = 0; i < l; i++) {
						arr.push({
							id: i,
							name: i
						})
					};
					model.list = arr;
				}, 200)
				return;
				//------ test end
				ajaxHandle = Common.ajax({
					url: ajaxUrl[op_type],
					type: "GET",
					data: getAjaxData(),
					success: function(res) {
						model.loading = false;
						model.list = res;
					},
					error: function() {
						model.loading = false;
					}
				});
			};
			/**
			 * 变量初始化
			 */
			// 最近的父级VM
			parentVM = vms[0];
			// 输入框
			jq_elem = jq_children.eq(0);
			// 弹出框
			jq_box = jq_children.eq(2);
			// 数值来源
			op_type = jq_elem.attr("widget-type");
			op_notSpecial = op_type !== 'city' && op_type !== 'grid' && op_type !== 'company';
			op_disable = jq_elem.attr("widget-root") === undefined && op_notSpecial;
			/**
			 * 获取当前输入框的上级变量
			 */
			var watchWord;
			switch (op_type) {
				// 运营中心
				case "operation":
					watchWord = [{
						watch: "form.operationId",
						change: true
					}];
					break;
					// 管理中心
				case "organization":
					watchWord = [{
						watch: "form.operationId",
						change: true
					}];
					break;
					// ——城市
				case "city":
					watchWord = [{
						watch: "form.organizationId",
						change: false
					}];
					break;
					// ——公司
				case "company":
					watchWord = [{
						watch: "form.organizationId",
						change: false
					}]
					break;
					// 项目
				case "project":
					watchWord = [{
						watch: "form.cityId",
						change: false
					}, {
						watch: "form.companyId",
						change: false
					}, {
						watch: "form.organizationId",
						change: true
					}];
					break;
					// ——网格
				case "grid":
					watchWord = [{
						watch: "form.projectId",
						change: false
					}];
					break;
					// 楼栋
				case "building":
					watchWord = [{
						watch: "form.projectId",
						change: true
					}, {
						watch: "form.gridId",
						change: false
					}];
					break;
					// 房屋
				case "house":
					watchWord = [{
						watch: "form.buildingId",
						change: true
					}];
					break;
			};
			/**
			 * 监听上级值变化，如果发生变化，则输入框清空，如果是直属上级清空，则输入框disable
			 */
			parentVM.$watch("form." + op_type + "Id", function(newValue, oldValue) {
				model.code = newValue;
			});
			if (watchWord && watchWord.length) {
				var o;
				for (var i = 0; i < watchWord.length; i++) {
					o = watchWord[i];
					parentVM.$watch(o["watch"], (function(t, w, c) {
						return function(newValue, oldValue) {
							parentVM.form[t + "Text"] = "";
							parentVM.form[t + "Id"] = "";
							// 当父级值变化，且当前级随父级状态改变
							if (c) {
								model.list = [];
								if (newValue) {
									model.disable = false;
								} else {
									model.disable = true;
								}
							}
							// 当父级值变化，且有值，改变当前级的选项
							if (newValue) {
								ajaxGetList(t)
							}
						}
					})(op_type, o["watch"], o["change"]));
				}
			};
			if (op_notSpecial) {
				model.$watch("disable", function(newValue, oldValue) {
					if (newValue) {
						jq_elem.attr("disable", true);
					} else {
						jq_elem.removeAttr("disable");
					}
				});
			}

			// bind event
			setTimeout(function() {
				if (!op_disable) {
					// 初始化
					ajaxGetList(op_type);
				}
				model.disable = op_disable;
				// 如果是最后一个td，则弹出框靠右
				model.isright = jq_elem.parent().parent().next().length == 0;

				// 模型事件复写
				model.onclose = function() {
					model.visible = false;
					if (event) {
						event.stopPropagation && event.stopPropagation();
						event.preventDefault && event.preventDefault();
						event.cancelBubble = true;
						event.returnValue = false;
					}
				}
				model.onclean = function() {
					parentVM.form[op_type + "Text"] = "";
					parentVM.form[op_type + "Id"] = "";
					model.visible = false;
				}
				// 点击输入框事件
				jq_elem.on("click", function() {
					if (model.disable) {
						return false;
					}
					model.visible = true;
					return false;
				});
				// 点击选择框事件
				jq_box.on("click", 'li', function() {
					var that = $(this),
						text = that.attr('data-text'),
						code = that.attr('data-id');
					if (!code) return;
					// 赋值
					parentVM.form[op_type + "Text"] = text;
					parentVM.form[op_type + "Id"] = code;
					// 隐藏当前选择区域
					// model.visible = false;
				});
				$(document).on("click", function() {
					model.visible = false;
				});
			});
		},
		$dispose: function(model, dom, vms) {}

	});

});