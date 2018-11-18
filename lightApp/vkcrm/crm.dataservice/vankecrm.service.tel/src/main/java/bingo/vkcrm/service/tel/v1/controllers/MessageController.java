package bingo.vkcrm.service.tel.v1.controllers;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.dao.Page;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.tel.v1.services.MessageService;

/**
 * 短信控制器
 * @author chengsiyuan
 *
 */
@Controller
@RequestMapping("api/v1/message")
public class MessageController extends BaseController{
	@Autowired
	MessageService service;
	private static final Log log = LogFactory.getLog(MessageController.class);
	

	@RequestMapping(value = "/sand",method = RequestMethod.POST)
	@ResponseBody
	public ServiceResult sendMessage(String numbers,String content){
		try {
			return service.sendMessage(numbers.split(","), content,"", "", "", "", getCurrentUser());
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	}
	
	
	/**
	 * 发送短信
	 * @param numbers 电话号码，支持多个
	 * @param content 短信内容
	 * @param dstime 定时时间，为空时表示立即发送（选填）
	 * @param extCode 扩展编号：接收短信时使用
	 * @param templateId 模版ID（选填）
	 * @return
	 */
	@RequestMapping(value = "/send",method = RequestMethod.POST)
	@ResponseBody
	public ServiceResult sendMessage(String[] numbers,String content,String dstime,String extCode,String templateId,String type){
		try {
			return service.sendMessage(numbers, content, dstime, extCode, templateId,type, getCurrentUser());
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	}
	
	/**
	 * 查询短信模版
	 * @param numbers 电话号码，支持多个
	 * @param content 短信内容
	 * @param dstime 定时时间，为空时表示立即发送（选填）
	 * @param extCode 扩展编号：接收短信时使用
	 * @param templateId 模版ID（选填）
	 * @return
	 */
	@RequestMapping(value = "/querytemplate",method = RequestMethod.POST)
	@ResponseBody
	public ServiceResult queryTemplate(String name,String content,int curPage, int pageSize){		
        Page page = new Page();
        page.setPage(curPage);
        page.setPageSize(pageSize);
		try {
			return service.queryTemplate(page, name, content);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	}

}




















