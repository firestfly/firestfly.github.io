package bingo.modules.securityConsole.sms;

import org.lightframework.mvc.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import bingo.common.core.utils.StringUtils;

@Controller
public class SmsCategoriesController {
	
	@Autowired
	private SmsCategoriesService categoriesService;

	/**
	 * 进入短信模板分类编辑页面
	 * @param categoryId
	 * @param parentId
	 * @param parentName
	 */
	public void editCategory(String categoryId,String parentId, String parentName) {
		if(StringUtils.isEmpty(categoryId)){
			Result.setAttribute("smsTemplateCategories", new SmsTemplateCategories());
		}else{
			SmsTemplateCategories smsTemplateCategories = categoriesService.findById(categoryId);
			Result.setAttribute("smsTemplateCategories", smsTemplateCategories);
		}
		Result.forward("/modules/sms/sms_template_categories_detail.jsp");
	}
}