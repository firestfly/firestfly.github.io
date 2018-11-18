// 默认查询全部：all，查询全部；house，查询房屋；carport，查询车位；customer，查询客户
var searchType = 'all';
var customerSearchUrl = window.servicePath["customer"] + '/v1/search/';
var houseSearchUrl = window.servicePath["house"] + '/v1/search/';

var customerSearchCode = ['customerName', 'customerNumberMain', 'customerNumberStandby', 'customerNumberHomeTel', 'customerNumberOfficeTel', 'customerCertificateId'];
var houseSearchCode = ['houseName'];
var carportSearchCode = ['carportName'];

var allListDiv = $("#allListDiv");
var houseListDiv = $("#houseListDiv");
var customerListDiv = $("#customerListDiv");
var carportListDiv = $("#carportListDiv");

//主页TAB切换
jQuery(document).ready(function() {
	$("#search_tab_bar li").on("click", function() {
		var order = $("#search_tab_bar li").index(this);
		$("#search_tab_bar").find(".active").removeClass("active");
		$(this).addClass("active");
		$(".result_panel.show").removeClass("show");
		$(".result_panel").eq(order).addClass("show");
	});
	// 搜索下拉框
	$(".m-search-wrap").on("click",".m-search-select",function(){
		$(".m-search-item").toggle();
	})
	// 下拉框项目
	$(".m-search-item").on("click", "li", function(){
		// 选中当前项目
		$(".m-search-item li").removeClass("on");
		$(this).addClass("on");
		// 获取当前项目值
		var that = $(this),
			index = that.index(),
			text = that.text();
		// 赋值文本
		$(".m-select-item").text(text);
		searchType = that.attr("data-search-type");
		// 选项卡
		$("#search_tab_bar ul li").removeClass("active");
		$("#search_tab_bar ul li").eq(index).addClass("active");
	});
	/* 全能搜索文本框键盘事件 [data-search-type]属性值
	 home:  首页搜索框
	 detail: 列表页面搜索框
	 */
	$("#indexSearchText,#indexListText").keyup(function(){
		var that = $(this),
			type = that.attr("data-search-type");
		var e = event || window.event;
		// enter 键
		if(e && e.keyCode == 13){
			if(type == 'home')
				indexSearch();
			if(type == 'detail')
				search();
		}
	});
});

// 首页查询：开始查询，并切换到列表
function indexSearch() {
	// 输入框值不能为空
	var searchValue = document.getElementById('indexSearchText').value;
	if (searchValue == '') {
		return;
	}
	document.getElementById('search_index').style.display = 'none';
	document.getElementById('search_list').style.display = '';
	document.getElementById('indexListText').value = document.getElementById('indexSearchText').value;
	search();
}

// 查询
function search() {
	// 校验查询条件不能为空
	var searchValue = document.getElementById('indexListText').value;
	if (searchValue == '') {
		return;
	}
	Common.loadingNeedUnload({
		text: '',
		container: '.loading-body'
	});
	if (searchType == 'all') { //查询全部
		allListDiv.html('');
		houseListDiv.html('');
		customerListDiv.html('');
		carportListDiv.html('');
		searchOne(houseSearchUrl, 'houseName', 'house');
		searchOne(customerSearchUrl, 'customerName', 'customer');
		searchOne(customerSearchUrl, 'customerNumberMain', 'customer');
		searchOne(customerSearchUrl, 'customerNumberStandby', 'customer');
		searchOne(customerSearchUrl, 'customerNumberHomeTel', 'customer');
		searchOne(customerSearchUrl, 'customerNumberOfficeTel', 'customer');
		searchOne(customerSearchUrl, 'customerCertificateId', 'customer');
		searchOne(houseSearchUrl, 'carportName', 'carport');
	} else if (searchType == 'house') { //查询房屋
		allListDiv.html('');
		houseListDiv.html('');
		searchOne(houseSearchUrl, 'houseName', 'house');
	} else if (searchType == 'customer') { //查询客户
		allListDiv.html('');
		customerListDiv.html('');
		searchOne(customerSearchUrl, 'customerName', 'customer');
		searchOne(customerSearchUrl, 'customerNumberMain', 'customer');
		searchOne(customerSearchUrl, 'customerNumberStandby', 'customer');
		searchOne(customerSearchUrl, 'customerNumberHomeTel', 'customer');
		searchOne(customerSearchUrl, 'customerNumberOfficeTel', 'customer');
		searchOne(customerSearchUrl, 'customerCertificateId', 'customer');
	} else if (searchType == 'carport') { //查询车位
		allListDiv.html('');
		carportListDiv.html('');
		searchOne(houseSearchUrl, 'carportName', 'carport');
	}
}

// 进行一次请求
function searchOne(url, code, type) {
	Common.ajax({
		url: url,
		type: "get",
		data: {
			code: code,
			value: document.getElementById('indexListText').value
		},
		success: function(res) {
			if (res.success) {
				for (var i = 0; i < res.details.length; i++) {
					addItem(res.details[i], type);
				}
			}
			Common.unLoading();
		}
	});
}

// 添加一条记录到列表
function addItem(dataItem, type) {
	Common.unLoading();
	var text = "";
	if (type == 'house') { //添加房屋记录
		text += '<div class="result_card">';
		text += '    <img src="' + window.path["server"] + '/static/img/search/search-home.png">';
		text += '    <a href="' + window.path["server"] + '/page/house/' + dataItem.id + '/details" title="' + dataItem.extend1 + '" class="result_card_detail">';
		text += '        <h1>' + dataItem.extend1 + '</h1>';
		text += '        <h2><label>业主：</label><span>' + dataItem.extend2 + '</span></h2>';
		text += '        <h3>' + dataItem.name + '</h3>';
		text += '    </a>';
		text += '</div>';
		allListDiv.append(text);
		houseListDiv.append(text);
	} else if (type == 'customer') { //添加客户记录/customer/e7cda6aa522411e599cad00d52eb478c/details?houseId=4de28ef4514b11e599cad00d52eb478c
		// 房屋ID为空时不能连接到客户页面
		text += '<div class="result_card">';
		text += '    <img src="' + window.path["server"] + '/static/img/search/search-person.png">';
		if (dataItem.extend3 != '') {
			text += '    <a href="' + window.path["server"] + '/page/customer/' + dataItem.id + '/details?houseId=' + dataItem.extend3 + '" title="' + dataItem.name + '" class="result_card_detail">';
		} else {
			text += '    <a href="#" class="result_card_detail">';
		}
		text += '        <h1>' + dataItem.name + '</h1>';
		text += '        <h2><label>手机号码：</label><span>' + dataItem.extend1 + '</span></h2>';
		text += '        <h3>' + dataItem.extend2 + '</h3>';
		text += '    </a>';
		text += '</div>';
		allListDiv.append(text);
		customerListDiv.append(text);
	} else if (type == 'carport') { //添加车位记录
		// TODO 车位详情页面URL未定
		text += '<div class="result_card">';
		text += '    <img src="' + window.path["server"] + '/static/img/search/search-car.png">';
		text += '    <a href="' + window.path["server"] + '/page/carport/' + dataItem.id + '/details" title="' + dataItem.extend1 + '" class="result_card_detail">';
		text += '        <h1>' + dataItem.extend1 + '</h1>';
		text += '        <h2><label>业主：</label><span>' + dataItem.extend2 + '</span></h2>';
		text += '        <h3>' + dataItem.name + '</h3>';
		text += '    </a>';
		text += '</div>';
		allListDiv.append(text);
		carportListDiv.append(text);
	}
}

// 设置查询分类
function setType(type) {
	searchType = type;
}