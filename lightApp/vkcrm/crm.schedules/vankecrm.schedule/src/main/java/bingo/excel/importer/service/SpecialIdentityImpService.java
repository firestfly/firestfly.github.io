/**
 * This file created at 2014年9月4日.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.importer.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.common.CallbackResult;
import bingo.common.core.utils.DateUtils;
import bingo.excel.importer.DefaultExcelImporter;
import bingo.excel.model.DictionaryItems;
import bingo.excel.model.DimCustSpecialidentity;
import bingo.excel.model.MainCustomer;
import bingo.excel.util.MapHelper;
import bingo.security.principal.IUser;
import bingo.vkcrm.service.utils.UUIDUtil;

/**
 * <code>{@link SpecialIdentityImpService}</code>
 *
 * 法律纠纷户批量导入处理类
 *
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
@Service
public class SpecialIdentityImpService extends DefaultExcelImporter {
	
	private static final String CARD_TYPES_LIS_KEY = "CARD_TYPES_LIS";
	private static final String CARD_TYPES_STR_KEY = "CARD_TYPES_STR";
	private static final String CARD_TYPES_MAP_KEY = "CARD_TYPES_MAP";
	/** 线程缓存对象：缓存身份证类型 */
	static ThreadLocal<Map<String, Object>> localMap = new ThreadLocal<Map<String, Object>>();
	
	/**
	 *说明:校验并处理法律纠纷户导入
	 *
	 */
	@SuppressWarnings("unchecked")
	public CallbackResult validateOneRow(Map<String, Object> item, Map<String, Object> param, List<Map<String, Object>> alreadyData) throws Exception {
		try{
			//excel 表头模板：客户姓名,手机号,证件类型,证件号码,房屋名称,开始时间,持续时间
			//获取需要处理的字段
			String customerName = MapHelper.saveGetString(item, "客户姓名");
			String mainMobile   = MapHelper.saveGetString(item, "手机号");
			String cardType     = MapHelper.saveGetString(item, "证件类型");
			String cardNumber   = MapHelper.saveGetString(item, "证件号码");
			String houseName    = MapHelper.saveGetString(item, "房屋名称");
			String duration     = MapHelper.saveGetString(item, "持续时间");
			
			IUser importUser = (IUser)param.get("importUser");// 获取导入信息
			MainCustomer customer = null;// 查询到的客户信息
			String errorMsg = "";

			// 校验必填项：“开始时间”,“持续时间”
			if(StringUtils.isEmpty(duration)){
				return new CallbackResult(false,"“开始时间”,“持续时间”是必填的。");
			}

			Object beginDate = item.get("开始时间");
			String beginStr = "";
			if(null == beginDate){
				return new CallbackResult(false,"“开始时间”,“持续时间”是必填的。");
			}
			if(beginDate instanceof String){
				beginStr = beginDate.toString();
				beginStr = beginStr.replace("/", "-");
				beginDate = DateUtils.toDate(beginStr);
				// 校验日期格式是否正确
				if(null == beginDate){
					return new CallbackResult(false,"“开始时间”日期格式不正确。");
				}
			}
			
			duration = duration.replace("月", "");
	
			// 校验时长是否正确
			if(!StringUtils.isNumeric(duration)){
				return new CallbackResult(false,"持续时长必须为正整数。");
			}
					
			// 查询客户1：通过“客户名称+房屋名称”查找客户
			if(StringUtils.isNotEmpty(customerName) && StringUtils.isNotEmpty(houseName)){
				List<MainCustomer> customerList = 
						serviceCenterRnDao.getJdbcDao().queryForList(MainCustomer.class, "sql-excel-specialidentity-select-byHouseName", customerName,houseName);
				if(null != customerList && customerList.size() == 1){
					customer = customerList.get(0);
				}
				if(null != customerList && customerList.size() > 1){
					errorMsg = "通过“客户名称”+“房屋名称”查询到多个客户，无法区分客户 ";
					for( int i=0;i<customerList.size();i++){
						errorMsg += "客户"+(i+1)+":";
						errorMsg += "证件类型-"+customerList.get(i).getCertificatetypetext() + "，";
						errorMsg += "证件号码-"+customerList.get(i).getCertificateid() + "；";
					}
				}
			}
	
			// 查询客户2：通过“客户姓名+手机号”查找客户
			if(null == customer && StringUtils.isNotEmpty(customerName) && StringUtils.isNotEmpty(mainMobile)){
				Map<String, String> queryMap = new HashMap<String, String>();
				queryMap.put("fullName", customerName);
				queryMap.put("mainMobile", mainMobile);
				List<MainCustomer> customerList = 
						serviceCenterRnDao.queryForList(MainCustomer.class, "sql-excel-specialidentity-select-byCustomerBase",queryMap);
				if(null != customerList && customerList.size() == 1){
					customer = customerList.get(0);
				}
				if(null != customerList && customerList.size() > 1){
					errorMsg = "通过“客户姓名”+“手机号查”询到多个客户，无法区分客户 ";
					for( int i=0;i<customerList.size();i++){
						errorMsg += "客户"+(i+1)+":";
						errorMsg += "证件类型-"+customerList.get(i).getCertificatetypetext() + "，";
						errorMsg += "证件号码-"+customerList.get(i).getCertificateid() + "；";
					}
				}
			}
			
			// 查询客户3：通过“客户姓名+证件类型+证件号码”查找客户
			if(null == customer && StringUtils.isNotEmpty(customerName) && StringUtils.isNotEmpty(cardType) && StringUtils.isNotEmpty(cardNumber)){
	
				// 校验证件类型名称是否合法：证件类型必须为指定的类型
				List<String> carTypeList = getCarTypeList();
				if(!carTypeList.contains(cardType)){
					return new CallbackResult(false,"“证件类型”必须为“"+localMap.get().get(CARD_TYPES_STR_KEY)+"”。");
				}
				
				Map<String, String> queryMap = new HashMap<String, String>();
				queryMap.put("fullName", customerName);
				queryMap.put("certificateType", ((Map<String, String>)localMap.get().get(CARD_TYPES_MAP_KEY)).get(cardType));
				queryMap.put("certificateId", cardNumber);
				List<MainCustomer> customerList = 
						serviceCenterRnDao.queryForList(MainCustomer.class, "sql-excel-specialidentity-select-byCustomerBase",queryMap);
				if(null != customerList && customerList.size() == 1){
					customer = customerList.get(0);
				}
				if(null != customerList && customerList.size() > 1){
					errorMsg = "通过“客户姓名+证件类型+证件号码”询到多个客户，无法区分客户 ";
					for( int i=0;i<customerList.size();i++){
						errorMsg += "客户"+(i+1)+":";
						errorMsg += "证件类型-"+customerList.get(i).getCertificatetypetext() + "，";
						errorMsg += "证件号码-"+customerList.get(i).getCertificateid() + "；";
					}
				}
			}
			
			// 查询不到客户返回错误信息
			if(null == customer){
				if(StringUtils.isEmpty(errorMsg)){
					errorMsg = "查询不到客户信息。";
				}
				return new CallbackResult(false,errorMsg);
			}		
			
			// 查询客户已有法律纠纷特殊身份做新增修改
			DimCustSpecialidentity specialidentity = 
					serviceCenterDao.getJdbcDao().queryForObjectQuietly(DimCustSpecialidentity.class, "sql-excel-specialidentity-select-specialidentity", customer.getId());
	
			// 计算法律纠纷结束时间
	        GregorianCalendar gc = new GregorianCalendar();
	        gc.setTime((Date)beginDate);
	        gc.add(Calendar.MONTH, Integer.parseInt(duration));
			if(null == specialidentity){//新增客户法律纠纷
				specialidentity = new DimCustSpecialidentity();
				specialidentity.setId(UUIDUtil.create());
				specialidentity.setIdentity("8");
				specialidentity.setCustomerid(customer.getId());
				specialidentity.setCreator(importUser.getName());
				specialidentity.setCreatorid(importUser.getId());
				specialidentity.setCreatetime(new Date());
				specialidentity.setBegindate((Date)beginDate);
				specialidentity.setDuration(duration);
		        specialidentity.setEnddate(gc.getTime());
		        serviceCenterDao.insert(specialidentity);
				return new CallbackResult(true,"增加客户法律纠纷信息成功。");
			}else{//修改客户法律纠纷
//				specialidentity.setBegindate((Date)beginDate);
//				specialidentity.setDuration(duration);
//		        specialidentity.setEnddate(gc.getTime());
//				specialidentity.setModifier(importUser.getName());
//				specialidentity.setModifierid(importUser.getId());
//				specialidentity.setModifytime(new Date());
//				serviceCenterDao.update(specialidentity);
				return new CallbackResult(false,"当前客户已为纠纷户，请查验时间。");
			}		
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
	}
	

    /**
     * 获取字典表数据
     * @param typeCode 数据类型 dim_dictionary.code
     * @return 数据项列表
     */
	@SuppressWarnings("unchecked")
	private List<String> getCarTypeList(){
    	if(null == localMap.get()){
        	List<DictionaryItems> choiced = serviceCenterRnDao.getJdbcDao().queryForList(DictionaryItems.class, DictionaryItems.class, "sql.common.query.dictionary", "CustomerCertificateType");            
            List<String> cardTypesLis = new ArrayList<String>();
    		Map<String, String> cardTypesMap = new HashMap<String, String>();
    		for(DictionaryItems dictionaryItem : choiced){
    			cardTypesLis.add(dictionaryItem.getValue());
    			cardTypesMap.put(dictionaryItem.getValue(), dictionaryItem.getCode());
    		}
    		Map<String, Object> dataMap = new HashMap<String, Object>();
    		dataMap.put(CARD_TYPES_LIS_KEY, cardTypesLis);
    		
    		String cardTypesStr = "";
    		for(int i = 0;i<cardTypesLis.size();i++){
    			if(i==0){
    				cardTypesStr+=cardTypesLis.get(i);
    			}else{
    				cardTypesStr+="，"+cardTypesLis.get(i);
    			}
    		}
    		dataMap.put(CARD_TYPES_STR_KEY, cardTypesStr);
    		dataMap.put(CARD_TYPES_MAP_KEY, cardTypesMap);    
            localMap.set(dataMap);
    	}    	
    	return (List<String>)localMap.get().get(CARD_TYPES_LIS_KEY);
    }
    
    public static void main(String[] args) {
    	System.out.println(StringUtils.isNumeric("abc"));
    	System.out.println(StringUtils.isNumeric("123"));
    	System.out.println(StringUtils.isNumeric("-123"));
    	System.out.println(StringUtils.isNumeric("123.55"));
	}


	/* (non-Javadoc)
	 * @see bingo.excel.importer.IExcelImporter#saveOneRow(java.util.Map, java.util.Map)
	 */
	public CallbackResult saveOneRow(Map<String, Object> item,
			Map<String, Object> param) throws Exception {
		// implement IExcelImporter.saveOneRow
		return null;
	}


	/* (non-Javadoc)
	 * @see bingo.excel.importer.IExcelImporter#isAllowSaveWhenError()
	 */
	public boolean isAllowSaveWhenError() {
		// implement IExcelImporter.isAllowSaveWhenError
		return false;
	}
}
