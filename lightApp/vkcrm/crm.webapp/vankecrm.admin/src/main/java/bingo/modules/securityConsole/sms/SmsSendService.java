package bingo.modules.securityConsole.sms;

import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.ServiceResult;
import bingo.common.core.utils.StringUtils;
import bingo.security.SecurityContext;

/**
 * 
 * <code>{@link SmsSendService}</code>
 * 短信发送处理服务类
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
@Service
public class SmsSendService extends BaseService {

	/**
	 * 批量启用模板
	 * @param templateIds 模板Id集合
	 * @param enabled 启、禁用状态，1启用，0停用
	 */
	public ServiceResult enableTemplate(String[] templateIds,String enabled) {
		SmsTemplate smsTemplate = new SmsTemplate();
		smsTemplate.setEnabled(enabled);
		int count = 0;
		for (String templateId : templateIds) {
			// 启用时需要判断分类是否被禁用，如果分类被禁用，则不可启用
			if(enabled.equals("1") && callCenterRnDao.getJdbcDao().exists("callcenter.sms.templateCategories.isCategoryDisabled",templateId)){
				continue;
			}
			smsTemplate.setId(templateId);
			callCenterDao.updateFields(SmsTemplate.class, smsTemplate, "enabled");
			count++;
		}
		return ServiceResult.succeed(count+"");
	}

	/**
	 * 批量删除模板
	 * @param userIds 模板Id集合
	 */
	public void deleteTemplate(String[] templateIds) {
		SmsTemplate smsTemplate = new SmsTemplate();
		smsTemplate.setDeleted("1");
		smsTemplate.setDuid(SecurityContext.getCurrentUser().getId());
		smsTemplate.setDtime(new Date());
		for (String templateId : templateIds) {
			smsTemplate.setId(templateId);
			callCenterDao.updateFields(SmsTemplate.class, smsTemplate, "deleted","duid","dtime");
		}
	}
	
	/**
	 * 创建或更新secUser 对象
	 * @param secUser
	 * @throws Exception 
	 */
	public ServiceResult saveOrUpdate(SmsTemplate smsTemplate) {
		String templateId = smsTemplate.getId();
		
		// 校验必填项：所属分类ID,模板类型，模板名称，模板内容，生效时间，失效时间
		if(StringUtils.isEmpty(smsTemplate.getCategoryId()) || 
				StringUtils.isEmpty(smsTemplate.getType()) || 
				StringUtils.isEmpty(smsTemplate.getName()) || 
				StringUtils.isEmpty(smsTemplate.getContent()) || 
				null == smsTemplate.getStartDate() || 
				null == smsTemplate.getEndDate()){
			return ServiceResult.error("所属分类ID,模板类型，模板名称，模板内容，生效时间，失效时间是必填的！");
		}
		
		// 校验时间先后，失效时间必须大于生效时间
		if(smsTemplate.getEndDate().compareTo(smsTemplate.getStartDate()) < 0){
			return ServiceResult.error("失效时间必须大于生效时间！");
		}
		
		// 校验模板名称是否存在
		if(callCenterRnDao.exists("callcenter.sms.template.isTemplateExist", smsTemplate)){
			return ServiceResult.error("模板名称已存在，不能重复！");
		}
		
		if (StringUtils.isEmpty(templateId)) {// 新增模板
			smsTemplate.setId(UUID.randomUUID().toString().replace("-", ""));
			smsTemplate.setCname(SecurityContext.getCurrentUser().getName());
			smsTemplate.setCuid(SecurityContext.getCurrentUser().getId());
			smsTemplate.setCtime(new Date());
			smsTemplate.setDeleted("0");
			smsTemplate.setEnabled("1");
			callCenterDao.insert(smsTemplate);
		} else {// 修改模板
			smsTemplate.setMuid(SecurityContext.getCurrentUser().getId());
			smsTemplate.setMtime(new Date());
			callCenterDao.updateFieldsExcluded(smsTemplate,"enabled","cname","cuid","ctime","deleted","duid","dtime","categoryId");
		}
		return ServiceResult.succeed("保存模板信息成功！");
	}

	/**
	 * 通过模板ID获取模板对象
	 * @param templateId
	 * @return
	 */
	public SmsTemplate getTemplateById(String templateId) {
		return callCenterRnDao.select(SmsTemplate.class, templateId);
	}
}
