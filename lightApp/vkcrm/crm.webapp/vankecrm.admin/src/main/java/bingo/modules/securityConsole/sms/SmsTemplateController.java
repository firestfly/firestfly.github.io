package bingo.modules.securityConsole.sms;

import org.lightframework.mvc.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import bingo.common.core.utils.StringUtils;

/**
 * 
 * 模板服务前端控制类
 */
@Controller
public class SmsTemplateController {
	
	@Autowired
	private SmsTemplateService templateService;

	/**
	 * 进入模板基本信息页面
	 * @param templateId 模板ID
	 * @param categoryId 分类ID
	 * @param categoryName 分类名称
	 */
	public void editTemplate(String templateId, String categoryId, String categoryName){
		if (StringUtils.isNotEmpty(templateId)) {
			SmsTemplate smsTemplate = templateService.getTemplateById(templateId);
			Result.setAttribute("smsTemplate", smsTemplate);
			Result.setAttribute("categoryId", smsTemplate.getCategoryId());
			Result.setAttribute("categoryName", categoryName);
		}else{
			Result.setAttribute("smsTemplate", new SmsTemplate());
			Result.setAttribute("categoryId", categoryId);
			Result.setAttribute("categoryName", categoryName);
		}
		Result.forward("/modules/sms/sms_template_detail.jsp");
	}
}
