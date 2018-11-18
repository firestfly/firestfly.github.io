/**
 * This file created at 2014年9月4日.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.excel.importer.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.common.CallbackResult;
import bingo.ui.grid.utils.DateUtils;
import bingo.excel.importer.DefaultExcelImporter;
import bingo.excel.model.DictionaryItems;
import bingo.excel.model.DimCustCodeGen;
import bingo.excel.model.MainCarport;
import bingo.excel.model.MainCustomer;
import bingo.excel.model.MainCustomerDetail;
import bingo.excel.model.MainHouse;
import bingo.excel.model.MainProject;
import bingo.excel.model.MidCarportCustomer;
import bingo.excel.model.MidCustomerHouse;
import bingo.excel.model.TreeOrganization;
import bingo.excel.util.IDCardUtil;
import bingo.excel.util.IDCardUtil2;
import bingo.excel.util.MapHelper;
import bingo.excel.util.ValidateUtil;
import bingo.security.principal.IUser;
import bingo.vkcrm.service.utils.UUIDUtil;

/**
 * <code>{@link NotPayCustomerImpService}</code>
 *
 * 客户导入处理类：校验每一行数据是否正确
 * 
 * 
 * 2015-12-31 新增需求
 * 关于客房、客车位关系的批量导入功能，对于客户信息的导入判断调整如下。
 *  一、根据证件类型和证件号码判断客户编码是否存在？
 *  1）如果客户编码不存在，则对输入的客户信息进行合法性校验，如果通过则录入到系统中；如果没有则提示错误，让操作人员进行修改。
 *  2）如果客户编码存在，再判断输入的客户姓名与DB中的客户姓名相同，如果客户姓名不相同则提示错误，让操作人员进行修改。如果客户姓名相同进入如下操作：
 *  a)        如果客户的导入的手机号码是否与DB中的客户四个电话进行比较，如果存在，则不进行处理；如果不存在需要进行如下判断：
 *    i.             如果手机号码不存在，将导入的客户电话放置到四个电话中的空白中。
 *    另一个问题：
 *    客车位关系在数据库中添加拥有和租赁，以便客车位关系导入。
 *
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
@Service
public class NotPayCustomerImpService extends DefaultExcelImporter {
	
	/** 物业类型：房屋 */
	private static final String BUILDING_TYPE_HOURSE = "房屋";
	/** 物业类型：车位 */
	private static final String BUILDING_TYPE_CARPORT = "车位";
	/** 证件类型：身份证 身份证需要验证 */
	private static final String CARD_TYPE_SFZ = "大陆身份证";

	/** 线程缓存对象：缓存身份证类型 */
	static ThreadLocal<Map<String, Object>> localMap = new ThreadLocal<Map<String, Object>>();
	
	/** 客服证件类型 */
	private static final String DICTIONARY_TYPE_CUSTOMER_CERTIFICATE_TYPE = "CustomerCertificateType";
	/** 客房关系 */
	private static final String DICTIONARY_TYPE_HOUSE_CUSTOMER_RELATIONTYPE = "HouseCustomerRelationType";
	/** 客车关系 */
	private static final String DICTIONARY_TYPE_CARPORT_CUSTOMER_RELATIONTYPE = "CarportCustomerRelation";	
	
	/** 组织类型：楼栋 */
	private static final String BUILDING_LEVEL_TYPE_BLD = "BLD";

	/** 客房所有关系：拥有 跟租赁冲突 */
	private static final String RELATION_TYPE_YY = "拥有";
	/** 客房所有关系：租赁 跟拥有冲突*/
	private static final String RELATION_TYPE_ZP = "租赁";
	
	/** 客户默认类型：普通 */
	private static final String CUSTOMER_TYPE_DEFAULT = "2";
	private static final String CUSTOMER_TYPE_DEFAULT_TEXT = "普通";
	
	/** 客户性别 */
	private static final String SEX_BOY_CODE = "1";
	private static final String SEX_BOY_NAME = "男";
	private static final String SEX_GIRL_CODE = "2";
	private static final String SEX_GIRL_NAME = "女";
	
	/**
	 * 说明:校验并处理待交付客户信息导入记录（每一行调用1次）
	 * @param item 存放行数据
	 * @param param 存放上下文数据。如用户领先
	 * @param alreadyData 已处理的数据
	 * return CallbackResult 处理结果
	 */
	public CallbackResult validateOneRow(Map<String, Object> item, Map<String, Object> param, List<Map<String, Object>> alreadyData) throws Exception {
		try{
			//excel 表头模板：客户名称，证件类型，证件号码，手机号码，备用手机号码 ，项目名称，项目编号，楼栋，名称，编号，房屋/车位，客房关系
			//获取需要处理的字段
			String customerName        = MapHelper.saveGetString(item, "客户名称");
			String cardType            = MapHelper.saveGetString(item, "证件类型");
			String cardNumber          = MapHelper.saveGetString(item, "证件号码");
			String mainMobilenumber    = MapHelper.saveGetString(item, "手机号码");
			String standbyMobilenumber = MapHelper.saveGetString(item, "备用手机号码");
			String projectName         = MapHelper.saveGetString(item, "项目名称");
			String projectCode         = MapHelper.saveGetString(item, "项目编号");
			String loudongName         = MapHelper.saveGetString(item, "楼栋");
			String buildingName        = MapHelper.saveGetString(item, "名称");
			String buildingCode        = MapHelper.saveGetString(item, "编号");
			String buildingType        = MapHelper.saveGetString(item, "房屋/车位");
			String relationType        = MapHelper.saveGetString(item, "客房关系");
			boolean isNewCustomer      = false;
			boolean isEditCustomer     = false;//是否需要更新客户信息，客户手机号码补空需要更新客户信息
			
			// 获取导入信息
			IUser importUser = (IUser)param.get("importUser");
			
			// 校验必填项：“客户名称”,“证件类型”,“证件号码”,“项目名称”,“项目编号”，“名称”，“编号”，“房屋/车位”都是必填的
			if(StringUtils.isEmpty(customerName) || StringUtils.isEmpty(cardType) || StringUtils.isEmpty(cardNumber) ||
					StringUtils.isEmpty(projectName) || StringUtils.isEmpty(projectCode) || 
					StringUtils.isEmpty(buildingName) || StringUtils.isEmpty(buildingCode) || StringUtils.isEmpty(buildingType)
					){
				return new CallbackResult(false,"“客户名称”,“证件类型”,“证件号码”,“项目名称”,“项目编号”，“名称”，“编号”，“房屋/车位”是必填的。");
			}
			
			cardNumber = cardNumber.toUpperCase();
			
			// 校验房屋类型：如果“房屋/车位”必须填写为“房屋”或“车位”
			if(!(buildingType.equals(BUILDING_TYPE_HOURSE) || buildingType.equals(BUILDING_TYPE_CARPORT))){
				return new CallbackResult(false,"“房屋/车位”必须填写“"+BUILDING_TYPE_HOURSE+"”或“"+BUILDING_TYPE_CARPORT+"”。");			
			}
			
			// 校验证件类型名称是否合法：证件类型必须为指定的类型
			if(!isValueExist(DICTIONARY_TYPE_CUSTOMER_CERTIFICATE_TYPE, cardType)){
				return new CallbackResult(false,"“证件类型”必须为“"+getValueList(DICTIONARY_TYPE_CUSTOMER_CERTIFICATE_TYPE)+"”。");
			}
			
			// 如果是身份证需要校验号码准确度，如果是15位身份证号码，需要转成18位身份证号码
			if(CARD_TYPE_SFZ.equals(cardType)){
				String idVardErrorMessage = IDCardUtil2.IDCardValidate(cardNumber);
				if(StringUtils.isNotEmpty(idVardErrorMessage)){
					return new CallbackResult(false,"身份证号码格式不正确："+idVardErrorMessage);
				}			
				// 15位身份证号码转18位身份证号码
				if(cardNumber.length() == 15){
					cardNumber = IDCardUtil.from15to18(19, cardNumber);
				}
			}
			
	
			// 校验手机号码格式
			if(StringUtils.isNotEmpty(mainMobilenumber)){
				if(!ValidateUtil.isMobile(mainMobilenumber)){
					return new CallbackResult(false,"“手机号码”格式不正确。");
				}
			}
			// 校验常用手机号码格式
			if(StringUtils.isNotEmpty(standbyMobilenumber)){
				if(!ValidateUtil.isMobile(mainMobilenumber)){
					return new CallbackResult(false,"“备用手机号码”格式不正确。");
				}
			}
			
			// 校验客房关系字段：导入“房屋”时，楼栋是必填的，客户房屋关系必须为："拥有,居住,租赁,账单,分润"
			if(buildingType.equals(BUILDING_TYPE_HOURSE)){
				if(StringUtils.isEmpty(relationType) || StringUtils.isEmpty(loudongName)){
					return new CallbackResult(false,"导入“房屋”关系，“客房关系”、“楼栋”字段是必填的。");
				}
				if(!isValueExist(DICTIONARY_TYPE_HOUSE_CUSTOMER_RELATIONTYPE, relationType)){
					return new CallbackResult(false,"“客房关系”必须为“"+getValueList(DICTIONARY_TYPE_HOUSE_CUSTOMER_RELATIONTYPE)+"”。");
				}
			}else{
				if(!isValueExist(DICTIONARY_TYPE_CARPORT_CUSTOMER_RELATIONTYPE, relationType)){
					return new CallbackResult(false,"“客房关系”必须为“"+getValueList(DICTIONARY_TYPE_CARPORT_CUSTOMER_RELATIONTYPE)+"”。");
				}
			}
			
			// 校验项目是否存在
			Map<String, Object> queryProjectMap = new HashMap<String, Object>();
			queryProjectMap.put("PROJECT_NAME", projectName);
			queryProjectMap.put("PROJECT_CODE", projectCode);
			queryProjectMap.put("IMPORT_USERID", importUser.getId());
			MainProject prj = serviceCenterRnDao.queryForObject(MainProject.class,"sql-excel-queryProjectID", queryProjectMap);
			if(null == prj){
				return new CallbackResult(false,"“项目”不存在，请检查“项目名称”、“项目编码”填写是否正确。");
			}
			if(StringUtils.isEmpty(prj.getHasRole())){
				return new CallbackResult(false,"您没有该项目的权限！");
			}
			
			/**
			 * 通过客户名称，证件类型，证件号码 验证用户是否存在
			 * 验证客户是否存在，如果客户不存在需要新增客户
			 * 通过客户名称，证件类型，证件号码 判断客户是否存在
			 */
			Map<String, Object> queryMap = new HashMap<String, Object>();
			queryMap.put("CARD_TYPE", getCode(DICTIONARY_TYPE_CUSTOMER_CERTIFICATE_TYPE, cardType));
			queryMap.put("CARD_NUMBER", cardNumber);
			MainCustomer customer = serviceCenterRnDao.queryForObject(MainCustomer.class, "sql-excel-queryCustomerByNameCard", queryMap);
			MainCustomerDetail customerDetail = new MainCustomerDetail();
			if(null == customer){
				isNewCustomer = true;
				// 新增时主要手机号码必填
				if(StringUtils.isEmpty(mainMobilenumber)){
					return new CallbackResult(false,"“手机号码”是必填的。");
				}
				
				customer = new MainCustomer();			
				customer.setId(UUID.randomUUID().toString().replace("-", ""));
				customer.setCode(newCustomerCode());
				customer.setFullname(customerName);
				customer.setCertificatetype(getCode(DICTIONARY_TYPE_CUSTOMER_CERTIFICATE_TYPE, cardType));
				customer.setCertificatetypetext(cardType);
				customer.setCertificateid(cardNumber);
				customer.setMainmobile(mainMobilenumber);
				customer.setStandbymobile(standbyMobilenumber);
				customer.setCreator(importUser.getName());
				customer.setCreatorid(importUser.getId());
				customer.setCreatetime(new Date());
				customer.setModifier(importUser.getName());
				customer.setModifierid(importUser.getId());
				customer.setModifytime(new Date());
				customer.setIsdeleted("0");
				// 默认客户为普通类型
				customer.setCustomertype(CUSTOMER_TYPE_DEFAULT);
				customer.setCustomertypetext(CUSTOMER_TYPE_DEFAULT_TEXT);
				// 判断客户时男是女
				if(CARD_TYPE_SFZ.equals(cardType)){
					String sex = getCustomerSex(cardNumber);
					if(sex.equals("1")){
						customer.setSex(SEX_BOY_CODE);
						customer.setSextext(SEX_BOY_NAME);
					}else{
						customer.setSex(SEX_GIRL_CODE);
						customer.setSextext(SEX_GIRL_NAME);
					}
				}
				if(CARD_TYPE_SFZ.equals(cardType)){
					customerDetail.setId(customer.getId());
					customerDetail.setBirthday(IDCardUtil2.getBrithday(customer.getCertificateid()));
				}else{	//不是省份证时也需添加一条客户详情信息
					customerDetail.setId(customer.getId());
				}
				customerDetail.setModifier(importUser.getName());
				customerDetail.setModifierid(importUser.getId());
				customerDetail.setModifytime(new Date());
			}else{
				if(!customer.getFullname().equals(customerName)){
					return new CallbackResult(false,"客户证件号已存在系统中，不能登记重复证件号。");
				}else{
					
					/**
					 * 2015-12-31 李工新增需求，导入时将客户手机号码填入到已存在的客户空号码里面
					 */				
					List<String> mobileNumbers = new ArrayList<String>();
					int i = 0;
					
					// 校验手机号码格式
					if(StringUtils.isNotEmpty(mainMobilenumber)){
						if(!isMobileExists(customer, mainMobilenumber)){
							mobileNumbers.add(mainMobilenumber);
						}
					}
					// 校验常用手机号码格式
					if(StringUtils.isNotEmpty(standbyMobilenumber)){
						if(!isMobileExists(customer, standbyMobilenumber)){
							mobileNumbers.add(standbyMobilenumber);
						}
					}
					//填充空白主要手机号码
					if(mobileNumbers.size() > i && StringUtils.isEmpty(customer.getMainmobile())){
						customer.setMainmobile(mobileNumbers.get(i++));
						isEditCustomer = true;
					}
					//填充空白主要手机号码
					if(mobileNumbers.size() > i && StringUtils.isEmpty(customer.getStandbymobile())){
						customer.setStandbymobile(mobileNumbers.get(i++));
						isEditCustomer = true;
					}
					//填充空白家庭电话号码
					if(mobileNumbers.size() > i && StringUtils.isEmpty(customer.getHometel())){
						customer.setHometel(mobileNumbers.get(i++));
						isEditCustomer = true;
					}
					//填充空办公电话号码
					if(mobileNumbers.size() > i && StringUtils.isEmpty(customer.getOfficetel())){
						customer.setOfficetel(mobileNumbers.get(i++));
						isEditCustomer = true;
					}
				}
			}
			
			// 检查车位是否存在
			if(buildingType.equals(BUILDING_TYPE_CARPORT)){
				// 查询车位，看车位是否存在
				MainCarport carport = serviceCenterRnDao.getJdbcDao().queryForObjectQuietly
						(MainCarport.class,"sql-excel-queryCarportByName", prj.getId(),buildingName,buildingCode);			
				if(null == carport){
					return new CallbackResult(false,"“车位”不存在，请检查“名称”、“编码”填写是否正确。");
				}
				
				// 查询车位与客户关系
				String relationTypeCode = getCode(DICTIONARY_TYPE_CARPORT_CUSTOMER_RELATIONTYPE, relationType);
				if(serviceCenterRnDao.getJdbcDao().exists("sql-excel-queryCarportRelaction", carport.getId(),customer.getId(),relationTypeCode)){
					return new CallbackResult(false,"客户与车位已有“"+relationType+"”关系，不可重复导入。");
				}
				if(isNewCustomer){
					serviceCenterDao.insert(customer);
					if(null != customerDetail){
						serviceCenterDao.insert(customerDetail);
					}
				}
				
				// 保存客房车位关系
				MidCarportCustomer midCarportCustomer = new MidCarportCustomer();
				//midCarportCustomer.setId(UUIDUtil.create());
				midCarportCustomer.setCarportid(carport.getId());
				midCarportCustomer.setCustomerid(customer.getId());
				midCarportCustomer.setCreator(importUser.getName());
				midCarportCustomer.setCreatorid(importUser.getId());
				midCarportCustomer.setRelationtype(relationTypeCode);
				midCarportCustomer.setCreatetime(new Date());
				midCarportCustomer.setIsdeleted("0");
				serviceCenterDao.insert(midCarportCustomer);
				
			// 检查房屋是否存在
			}else{
				
				// 检查楼栋名称填写是否正确
				Map<String, Object> queryBuildingMap = new HashMap<String, Object>();
				queryBuildingMap.put("BUILDING_LEVEL_TYPE", BUILDING_LEVEL_TYPE_BLD);
				queryBuildingMap.put("PROJECT_ID", prj.getId());
				queryBuildingMap.put("BUILDING_NAME", loudongName);
				TreeOrganization to = serviceCenterRnDao.queryForObject(TreeOrganization.class, "sql-excel-queryOrgByName", queryBuildingMap);
				if(null == to){
					return new CallbackResult(false,"“楼栋”不存在，请检查“楼栋”填写是否正确。");
				}
				
				// 检查房屋是否存在
				Map<String, Object> queryHouseMap = new HashMap<String, Object>();
				queryHouseMap.put("PROJECT_ID", prj.getId());
				queryHouseMap.put("BUILDING_NAME", loudongName);
				queryHouseMap.put("HOUSE_NAME", buildingName);
				queryHouseMap.put("HOUSE_CODE", buildingCode);
				MainHouse house = serviceCenterRnDao.queryForObject(MainHouse.class, "sql-excel-queryHourseByName", queryHouseMap);
				if(null == house){
					return new CallbackResult(false,"“房屋”不存在，请检查“名称”、“编码”填写是否正确。");
				}
				
				// 查询客户跟房屋是否已经有相关关系
				Map<String, Object> queryCustomerHouseMap = new HashMap<String, Object>();
				queryCustomerHouseMap.put("HOUSE_ID",house.getId());
				queryCustomerHouseMap.put("CUSTOMER_ID", customer.getId());
				List<MidCustomerHouse>  customerHouseList = serviceCenterRnDao.queryForList(MidCustomerHouse.class, "sql-excel-queryCustomerHouse", queryCustomerHouseMap);
				List<String> relationTypes=new ArrayList<String>();
				for(MidCustomerHouse temp : customerHouseList){
					relationTypes.add(temp.getRelationtypetext());
				}
				// 校验客户与房屋是否已经有要导入的关系
				if(relationTypes.contains(relationType)){
					return new CallbackResult(false,"客户与此房屋有“"+relationType+"”关系，不可重复导入。");
				}
				// “拥有”与“租凭”关系不能同时存在
				if(relationType.equals(RELATION_TYPE_YY) && relationTypes.contains(RELATION_TYPE_ZP)){
					return new CallbackResult(false,"客户与此房屋有“租赁”关系，不能添加“拥有”关系。");
				}
				if(relationType.equals(RELATION_TYPE_ZP) && relationTypes.contains(RELATION_TYPE_YY)){
					return new CallbackResult(false,"客户与此房屋有“拥有”关系，不能添加“租赁”关系。");
				}
				
				MidCustomerHouse customerHouse = new MidCustomerHouse();
				customerHouse.setCustomerid(customer.getId());
				customerHouse.setHouseid(house.getId());
				customerHouse.setCreatorid(importUser.getId());
				customerHouse.setCreator(importUser.getName());
				customerHouse.setCreatetime(new Date());
				customerHouse.setRelationtype(getCode(DICTIONARY_TYPE_HOUSE_CUSTOMER_RELATIONTYPE, relationType));
				customerHouse.setRelationtypetext(relationType);
				// 保存车位、车位对应关系、客户信息
				if(isNewCustomer){
					serviceCenterDao.insert(customer);
					if(null != customerDetail){
						serviceCenterDao.insert(customerDetail);
					}	
				}
				serviceCenterDao.insert(customerHouse);
			}
			//补全客户空号码
			if(isEditCustomer){
				serviceCenterDao.updateFields(customer,"mainmobile","standbymobile","hometel","officetel");
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
		return new CallbackResult(true,"待交付客户导入成功。");
		
	}

	/* (non-Javadoc)
	 * @see bingo.excel.importer.IExcelImporter#saveOneRow(java.util.Map, java.util.Map)
	 */
	public CallbackResult saveOneRow(Map<String, Object> item,Map<String, Object> param) throws Exception {
		return null;
	}

	/* (non-Javadoc)
	 * @see bingo.excel.importer.IExcelImporter#isAllowSaveWhenError()
	 */
	public boolean isAllowSaveWhenError() {
		return false;
	}
	
	/**
	 * 通过身份证号码识别客户性别
	 * @param idCardNo18
	 * @return
	 */
	public String getCustomerSex(String idCardNo18){		
		String sex = idCardNo18.substring(16, 17);
		if(Integer.parseInt(sex)%2==0){sex = "2";}else{sex ="1";}
		return sex;
	}
	
	
	/**
	 * 生成新客户编码
	 * @return 客户编码
	 * @throws Exception 
	 */
	public String newCustomerCode() throws Exception{
		
		// 插入客户ID生成表
		DimCustCodeGen custCodeGem = new DimCustCodeGen();
		long code=0;
		boolean isCodeSingo = false;
		int count=0;//循环次数
		
		do {
			if(count > 100){throw new Exception("获取客户ID失败，多次获取到重复的客户ID，请重试！");}
			count++;
			custCodeGem.setValue(UUIDUtil.create());
			custCodeGem.setPid(null);
			serviceCenterDao.insert(custCodeGem);
			
			// 获取生成的pid再+10亿，预防客户ID小于10位数
			Map<String, Object> queryMap = new HashMap<String, Object>();
			queryMap.put("VALUE", custCodeGem.getValue());		
			custCodeGem = serviceCenterDao.queryForObject(DimCustCodeGen.class, "sql.customer.queryCustCodeGem", queryMap);		
			code = Long.parseLong(custCodeGem.getPid());
			code = code+1200000000;
			
			if(!serviceCenterRnDao.getJdbcDao().exists("sql.customer.checkCode", code)){
				isCodeSingo = true;
			}			
		} while (!isCodeSingo);
		
		return code+"";
		
	}

    /**
     * 获取字典表数据
     * @param typeCode 数据类型 dim_dictionary.code
     * @return 数据项列表
     */
	@SuppressWarnings("unchecked")
	private List<DictionaryItems> getDisctionary(String type){
		if(null == localMap.get() || null == localMap.get().get(type)){
			if(null == localMap.get()){
				localMap.set(new HashMap<String, Object>());
			}			
			// 从数据库查询证件类型数据字典,证件类型需要过滤掉不用的
			
			List<DictionaryItems> dictionaryItems = serviceCenterRnDao.getJdbcDao().queryForList(DictionaryItems.class, DictionaryItems.class, "sql.common.query.dictionary",type);
			if(type.equals(DICTIONARY_TYPE_CUSTOMER_CERTIFICATE_TYPE)){
				List<DictionaryItems> dictionaryItemsTemp = new ArrayList<DictionaryItems>();
	            for (DictionaryItems item : dictionaryItems) {
	                String code=item.getCode();
	                if(code.equals("1")||code.equals("2")||code.equals("3")||code.equals("7")||code.equals("8")||
	                        code.equals("10")||code.equals("11")||code.equals("12")||code.equals("13")||code.equals("18")){
	                	dictionaryItemsTemp.add(item);
	                }
	            }
				localMap.get().put(type,dictionaryItemsTemp);
			}else{
				localMap.get().put(type,dictionaryItems);
			}
		}
		return (List<DictionaryItems>)localMap.get().get(type);
    }
	
	/**
	 * 查看用户填写的字典项是否存在（证件类型，客服关系，客车位关系等）
	 * 用于判断用户Excel里面填写的值是否正确
	 * @param type 数据字典类型
	 * @param value Excel中填写的值 
	 * @return
	 */
	private boolean isValueExist(String type,String value){
		List<DictionaryItems> itemList = getDisctionary(type);
		for(DictionaryItems item : itemList){
			if(item.getValue().equals(value)){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 获取数据字典所有值，用户返回错误信息
	 * @param type 数据字典类型
	 * @return
	 */
	private String getValueList(String type){
		List<DictionaryItems> itemList = getDisctionary(type);
		String valueList = "";
		for(DictionaryItems item : itemList){
			if(StringUtils.isEmpty(valueList)){
				valueList += item.getValue();
			}else{
				valueList += "," + item.getValue();
			}
		}
		return valueList;
	}

	/**
	 * 通过值获取数据字典code
	 * @param type 数据字典类型
	 * @param value Excel中填写的值 
	 * @return
	 */
	private String getCode(String type,String value){
		List<DictionaryItems> itemList = getDisctionary(type);
		for(DictionaryItems item : itemList){
			if(item.getValue().equals(value)){
				return item.getCode();
			}
		}
		return "";
	}
	
	/**
	 * 比对手机号码是否已经存在
	 * @param customer 客户基本信息
	 * @param number 新手机号码
	 * @return
	 */
	private boolean isMobileExists(MainCustomer customer,String number){
		// 比对号码是否跟主用手机号码一致
		if(StringUtils.isNotEmpty(customer.getMainmobile()) && number.equals(customer.getMainmobile())){
			return true;
		}
		// 比对手机号码是否跟备用手机号码一致
		if(StringUtils.isNotEmpty(customer.getStandbymobile()) && number.equals(customer.getStandbymobile())){
			return true;
		}
		// 比对手机号码是否跟家庭电话号码一致
		if(StringUtils.isNotEmpty(customer.getHometel()) && number.equals(customer.getHometel())){
			return true;
		}
		// 比对手机号码是否跟办公电话号码一致
		if(StringUtils.isNotEmpty(customer.getOfficetel()) && number.equals(customer.getOfficetel())){
			return true;
		}
		return false;
	}
	
    
    public static void main(String[] args) {
		
    	String id18 = "445121198311231233";
    	String str=id18.substring(6,14);
    	System.out.println(str);
		Date birthday = bingo.ui.grid.utils.DateUtils.toDate(str,"yyyyMMdd");

    	System.out.println(DateUtils.toString(birthday, DateUtils.LONG_DATETIME_FORMAT));
    	
    	
	}}
