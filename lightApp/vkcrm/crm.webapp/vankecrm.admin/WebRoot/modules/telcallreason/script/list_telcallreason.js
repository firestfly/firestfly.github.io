
$(function() {

});

function loadData(grid) {
	grid.doSearch();
}


// 删除通话原因
function deleteTelcallreason(grid, rowData, keyData) {
	if (keyData) {
		var userName = rowData['Name'];
		$.messageBox.confirm({
			message : "您确定要删除通话原因吗？",
			callback : function(result) {
				if (result) {
					$.dataservice("spring:telCallReasonService.deleteCallReason", {
						id : keyData
					}, function() {
						grid.doSearch();
					});
				}
			}
		});
	}
}

// 新建用户
function createTelcallreason() {
	var url = "~/telCallReason/editTelcallreason.do";
	$.open(url, 480, 270, {}, function() {
		//if ($.dialogReturnValue()) {
			grid.doSearch();
		//}
	});
}

// 修改用户
function modifyTelcallreason(grid, rowData, keyData) {
	if (keyData) {
		var url = "~/telCallReason/editTelcallreason.do?id=" + keyData;
		$.open(url, 480, 270, {}, function() {
			grid.doSearch();
		});
	}
}
