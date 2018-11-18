package bingo.vkcrm.service.tel.v1.controllers;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.tel.v1.models.Telecomno;
import bingo.vkcrm.service.tel.v1.services.TelUserService;

@Controller
@RequestMapping("api/v1/teluser")
public class TelUserController extends BaseController{
	@Autowired
	TelUserService service;
	private static final Log log = LogFactory.getLog(TelUserController.class);
	
	/**
	 * 获取登陆者电信工号
	 * @return
	 */
	@RequestMapping(value = "/get",method = RequestMethod.GET)
	@ResponseBody
	public ServiceResult getTelCallRecord(){
		List<Telecomno> numbers = new ArrayList<Telecomno>();
		try {
			String userId = getCurrentUser().getId();
			numbers = service.getTelNumer(userId);
			return ServiceResult.succeed(numbers);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	}
}
