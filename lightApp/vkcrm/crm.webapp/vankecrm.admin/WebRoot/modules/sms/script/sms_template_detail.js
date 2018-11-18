/**
 * 新增修改短信模板JS文件
 * 
 */
$(function() {
	disPlayCalendar();
});


/**
 * 处理保存按钮动作
 */
function doSave() {	
	// 验证表单
	var valInfo = $.validation.validate("#SMS_TEMPLATE_EDIT_FORM");
	if (valInfo.isError){return;}
	var user = $('#SMS_TEMPLATE_EDIT_FORM').toJson();
	
	// 保存话务员信息
	$.dataservice("spring:smsTemplateService.saveOrUpdate", user, function(response){
		if(response.success){
			alert(response.details);		
			$.dialogReturnValue(true);
			$(document).dialogClose();
		}else{
			alert(response.message);
		}
	});
}
/**
 * 显示日期类型
 */
function disPlayCalendar(){
	$("#startDate").calendar({
		isShowWeek : true,
		dateFmt : 'yyyy-MM-dd',
		onpicked : function() {
			var endTime = document.getElementById("endDate").value;
			var beginTime = this.value;
			if (beginTime && endTime) {
				var t = compareDate(beginTime, endTime);
				if (t > 0) {
					$.messageBox.info({message:"生效日期不能大于失效日期!"});
					this.value = ""
				}
			}
		}
	});
	$("#endDate").calendar({
		isShowWeek : true,
		dateFmt : 'yyyy-MM-dd',
		onpicked : function() {
			var beginTime = document.getElementById("startDate").value;
			var endTime = this.value;
			if (beginTime && endTime) {
				var t = compareDate(beginTime, endTime);
				if (t > 0) {
					$.messageBox.info({message:"生效日期不能大于失效日期!"});
					this.value = ""
				}
			}
		}
	});
}
function stringToTime(dateStr) {
	var day = dateStr.split('-');
	var date = new Date(Number(day[0]), Number(day[1]) - 1, Number(day[2]));
	return date;
}
function compareDate(dateString1, dateString2) {
	if (dateString1 != null && dateString2 != null) {
		var t1 = stringToTime(dateString1);
		var t2 = stringToTime(dateString2);
		return t1 - t2;
	}
	return 0;
}







