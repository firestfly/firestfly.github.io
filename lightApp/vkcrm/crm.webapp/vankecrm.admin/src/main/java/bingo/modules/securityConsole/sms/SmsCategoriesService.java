package bingo.modules.securityConsole.sms;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.ServiceResult;
import bingo.common.core.utils.StringUtils;
import bingo.security.SecurityContext;

@Service
public class SmsCategoriesService extends BaseService {
	/**
	 * 根据主键获取单条数据
	 */
	public SmsTemplateCategories findById(String categoryId) {
		return callCenterRnDao.select(SmsTemplateCategories.class, categoryId);
	}

	/**
	 * 通过主键删除模板分类
	 * 1.同时删除该分类的子分类及这些分类下的模板
	 * @param orgId 主键
	 * @return
	 */
	public void deleteCategory(String categoryId) {
		callCenterDao.getJdbcDao().update("callcenter.sms.templateCategories.delete.categories", 
				SecurityContext.getCurrentUser().getId(),categoryId,categoryId);
		callCenterDao.getJdbcDao().update("callcenter.sms.templateCategories.delete.template", 
				SecurityContext.getCurrentUser().getId(),categoryId,categoryId);
	}

	/**
	 * 创建或更新UsfOrganization 对象
	 * @param usfOrganization
	 */
	public ServiceResult saveOrUpdate(SmsTemplateCategories smsTemplateCategories) {
		
		// 校验必填项：分类名称
		if(StringUtils.isEmpty(smsTemplateCategories.getTypeName())){
			return ServiceResult.error("“分类名称”是必填的！");
		}
		// 校验分类名称是否存在
		if(callCenterRnDao.exists("callcenter.sms.template.isCategoryExist", smsTemplateCategories)){
			return ServiceResult.error("模板分类名称已存在，不能重复！");
		}
		
		if (StringUtils.isEmpty(smsTemplateCategories.getId())) {
			smsTemplateCategories.setId(UUID.randomUUID().toString().replace("-", ""));
			smsTemplateCategories.setCname(SecurityContext.getCurrentUser().getName());
			smsTemplateCategories.setCuid(SecurityContext.getCurrentUser().getId());
			smsTemplateCategories.setCtime(new Date());
			smsTemplateCategories.setDeleted("0");
			smsTemplateCategories.setEnabled("1");
			callCenterDao.insert(smsTemplateCategories);
		} else {
			smsTemplateCategories.setMuid(SecurityContext.getCurrentUser().getId());
			smsTemplateCategories.setMtime(new Date());
			callCenterDao.updateFieldsExcluded(smsTemplateCategories,"enabled","cname","cuid","ctime","deleted","duid","dtime","parentId");
		}
		return ServiceResult.succeed("保存模板分类信息成功！");
	}
	
	/**
	 * 启用/禁用模板分类
	 * @param categoryId 分类ID
	 * @param value 1启用，0停用
	 */
	public ServiceResult enabledCategory(String categoryId,String enabled) {		
		if(!(enabled.equals("1") || enabled.equals("0"))){
			return ServiceResult.error("未知错误。");
		}
		if(enabled.equals("1")){//启用分类
			// 启用时需要判断分类是否被禁用，如果分类被禁用，则不可启用
			if(enabled.equals("1") && callCenterRnDao.getJdbcDao().exists("callcenter.sms.templateCategories.isParentDisabled",categoryId)){
				return ServiceResult.error("无法启用父分类被禁用的分类。");
			}
			Map<String, String> data = new HashMap<String, String>();
			data.put("id",categoryId);
			data.put("enabled",enabled);
			callCenterDao.updateFields(SmsTemplateCategories.class, data);
		}else{//禁用分类 需要禁用分类下分类，及分类下模板
			callCenterDao.getJdbcDao().update("callcenter.sms.templateCategories.disabled.categories",categoryId,categoryId);
			callCenterDao.getJdbcDao().update("callcenter.sms.templateCategories.disabled.template",categoryId,categoryId);
		}
		return ServiceResult.succeed("成功");
	}
}