package bingo.vkcrm.service.tel.v1.controllers;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import bingo.security.principal.IUser;
import bingo.security.principal.User;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.controller.BaseController;
import bingo.vkcrm.service.exceptions.EmptyParameterException;
import bingo.vkcrm.service.tel.v1.models.TelCallReason;
import bingo.vkcrm.service.tel.v1.services.TelCallReasonService;

/**
 * 采集原因配置
 * @author chengsiyuan
 * 
 */
@Controller
@RequestMapping("api/v1/telrecord")
public class TelCallReasonController extends BaseController{
	@Autowired
	TelCallReasonService service;
	private static final Log log = LogFactory.getLog(TelCallReasonController.class);
	
	/**
	 * 获取�?��通话原因
	 * @param type 通话类型�?、全部�?1、呼入�?2、呼�?
	 * @return
	 */
	@RequestMapping(value = "/callreason/get",method = RequestMethod.GET)
	@ResponseBody
	public ServiceResult getAllCallReason(String type){
		try {
			if(StringUtils.isEmpty(type)){
				throw new EmptyParameterException("type", "通话类型");
			}
			List<TelCallReason> list = new ArrayList<TelCallReason>();
			list = service.getAllCallReson(type);
			return ServiceResult.succeed(list);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}
	}
	
	/**
	 * 添加通话原因
	 * @param telcallreason
	 * @return
	 */
	@RequestMapping(value = "/callreason/add",method = RequestMethod.POST)
	@ResponseBody
	public ServiceResult addCallReason(TelCallReason telcallreason){
		try {
			//通话类型不能为空
			if(!(telcallreason.getType() == 1 || telcallreason.getType() == 2)){
				throw new EmptyParameterException("type", "类型设置错误");
			}
			//获取已经存在的数�?
			List<TelCallReason> alllist = new ArrayList<TelCallReason>();
			alllist = service.getAllCallReson("0");
			//判断是否已经存在该数据（通话类型和�?话原因内容不能同时相同）
			for (TelCallReason oldtelCallReason : alllist) {
				if(oldtelCallReason.getContent().equals(telcallreason.getContent()) && oldtelCallReason.getType()==telcallreason.getType()){
					return ServiceResult.error(new Exception("该原因已存在"));
				}
			}
			IUser creator = new User();
	        creator.setId(getCurrentUser().getId());
	        creator.setName(getCurrentUser().getName());
			service.addCallReason(telcallreason,creator);
			return ServiceResult.succeed(null);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}catch (Throwable e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
	}
	
	/**
	 * 更新通话原因
	 * @param telcallreason
	 * @return
	 */
	@RequestMapping(value = "/callreason/update",method = RequestMethod.POST)
	@ResponseBody
	public ServiceResult updateCallReason(TelCallReason telcallreason){
		try {
			if(StringUtils.isEmpty(telcallreason.getId())){
				throw new EmptyParameterException("id", "通话记录id");
			}
			if(!(telcallreason.getType() == 1 || telcallreason.getType() == 2)){
				throw new EmptyParameterException("type", "类型设置错误");
			}
			//获取已经存在的数�?
			List<TelCallReason> alllist = new ArrayList<TelCallReason>();
			alllist = service.getAllCallReson("0");
			//判断是否已经存在该数据（通话类型和�?话原因内容不能同时相同）
			for (TelCallReason oldtelCallReason : alllist) {
				if(oldtelCallReason.getContent().equals(telcallreason.getContent()) && oldtelCallReason.getType()==telcallreason.getType() && oldtelCallReason.getId() != telcallreason.getId()){
					return ServiceResult.error(new Exception("该原因已存在"));
				}
			}
			service.updateCallReason(telcallreason);
			return ServiceResult.succeed(null);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		}catch (Throwable e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
	}
	
	/**
	 * 删除通话原因
	 * @param telcallreason
	 * @return
	 */
	@RequestMapping(value = "/callreason/remove",method = RequestMethod.POST)
	@ResponseBody
	public ServiceResult removeCallReason(String id){
		try {
			if(StringUtils.isEmpty(id)){
				throw new EmptyParameterException("id", "通话原因id");
			}
			service.removeCallReason(id);
			return ServiceResult.succeed(null);
		} catch (Exception e) {
			e.printStackTrace();
	        log.error(this, e);
			return ServiceResult.error(e);
		} catch (Throwable e) {
            e.printStackTrace();
            log.error(this, e);
            return ServiceResult.error(e);
        }
	}
}
