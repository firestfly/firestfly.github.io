/**
 * 新增修改话务员JS文件
 * 
 */

var skillList;

var telecomnoLength = 0;


$(function() {
	if(null != type){
		document.getElementById('type').value = type;
	}
});

/**
 * 处理保存按钮动作
 */
function doSave() {	
	// 验证表单
	var valInfo = $.validation.validate("#TEL_CALL_REASON_FOMR");
	if (valInfo.isError){return;}
	var telCallReason = $('#TEL_CALL_REASON_FOMR').toJson();
	
	// 保存话务员信息
	$.dataservice("spring:telCallReasonService.saveOrUpdate", telCallReason, function(response){
		if(response.success){
			alert(response.details);		
			$.dialogReturnValue(true);
			$(document).dialogClose();
		}else{
			alert(response.message);
		}
	});
}

