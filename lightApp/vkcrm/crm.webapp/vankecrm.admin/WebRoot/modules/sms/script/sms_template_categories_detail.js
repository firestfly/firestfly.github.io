function doSave() {
	var valInfo = $.validation.validate("#SMS_CATEGORIES_EDIT_FORM");
	if (valInfo.isError)
		return {
			result : 'FAIL',
			resultDesc : '校验失败!',
			isClose : 'false',
			isTip : 'false'
		};
	var org = $('#SMS_CATEGORIES_EDIT_FORM').toJson();
	$.dataservice("spring:smsCategoriesService.saveOrUpdate", org, function(response) {
		if(response.success){
			alert(response.details);
			$.dialogReturnValue(true);
			$(document).dialogClose();
		}else{
			alert(response.message);
		}
	});
}