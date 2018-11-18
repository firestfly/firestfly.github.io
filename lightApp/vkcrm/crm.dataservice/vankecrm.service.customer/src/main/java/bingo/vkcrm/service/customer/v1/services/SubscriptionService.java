package bingo.vkcrm.service.customer.v1.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.common.utils.Des3;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.Subscription.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.utils.HttpClientUtilForAppSubscribe;

/**
 * 订阅关系服务
 * @author chengsiyuan
 *
 */
@Service
public class SubscriptionService extends CustomerCommonService {
	
	/**
	 * 邮包
	 * @param customerId
	 * @param pageNo
	 * @param pageSize
	 * @return
	 * @throws Exception 
	 */
	public ParcelResponse getParcel(String customerId,String pageNo, String pageSize) throws Exception{
		//查询电话号码
		String mobile = getPhoneNum(customerId);
		String[] mobiles = {mobile};
		ParcelResponse parcelResponse = new ParcelResponse();
		ParcelRequest parcelRequest = new ParcelRequest();
		ParcelRequestParameter parameter = new ParcelRequestParameter();
		RequestHead head = new RequestHead();
		//该时间戳是固定的
		String timeStamp = "2012-12-12 12:12:12";
		String url = ApplicationContext.getProperty("app.parcel.url");
		String sysid = ApplicationContext.getProperty("app.parcel.sysid");
		String password = ApplicationContext.getProperty("app.parcel.password");
		String functionid = ApplicationContext.getProperty("app.parcel.functionid");
		head.setSysid(sysid);
		head.setPassword(password);
		head.setTimestamp(timeStamp);
		head.setFunctionid(functionid);
		parameter.setMobile(mobiles);
		parameter.setBeginDate("");
		parameter.setEndDate("");
		parameter.setPageNo(pageNo);
		parameter.setPageSize(pageSize);
		parcelRequest.setHead(head);
		parcelRequest.setParameter(parameter);
		parcelResponse = HttpClientUtilForAppSubscribe.post(parcelRequest, ParcelResponse.class,url);
		return parcelResponse;
	}
	
	/**
	 * 获取客户所拥有房屋的物业费
	 * @param customerId
	 * @return
	 * @throws Exception
	 */
	public List<EncryptTxtResponse> getPropertyFee(String customerId) throws Exception{
		List<EncryptTxtResponse> encryptTxtResponses = new ArrayList<EncryptTxtResponse>();
		//获取url
		String url = ApplicationContext.getProperty("app.propertyfee.url","http://10.0.57.114:9005/vanke-webapi/api/NCBill");
		//获取加密秘钥
		String secretKey = ApplicationContext.getProperty("app.propertyfee.secretKey","ySiWZ/Hv2bpikmPblP000000");
		List<HouseAssistCode> list = getHouseAssistCode(customerId);
		if(list == null || list.size() <= 0){
			return null;
		}
		for (HouseAssistCode houseAssistCode : list) {
			//请求结构加密部分
			EncryptTxtRequest encryptTxtRequest = new EncryptTxtRequest();
			//请求体
			PropertyFee propertyFee = new PropertyFee();
			encryptTxtRequest.setBill_end_mth(null);
			encryptTxtRequest.setBill_start_mth(null);
			//设置房屋编码（辅助编码）
//			encryptTxtRequest.setHouse_mdscode("1003A1100000000002X7");
			encryptTxtRequest.setHouse_mdscode(houseAssistCode.getAssistCode());
			encryptTxtRequest.setPwd("");
			//设置项目code
//			encryptTxtRequest.setProject_code("44030011");
			encryptTxtRequest.setProject_code(houseAssistCode.getProjectCode());
			//转成json
			String encryptTxt = JsonUtil.toJson(encryptTxtRequest);
			//进行加密
			String encryptTxtencode = Des3.encode(encryptTxt, secretKey);
			//不用加密部分
			propertyFee.setVersion("1.0");
			propertyFee.setCaller("ZHUZHE");
			propertyFee.setCallee("APPPAY");
			propertyFee.setTimestamp("2015-01-19 09:56:26");
			propertyFee.setOperation("QUERY");
			propertyFee.setReturnValue("0");
			propertyFee.setReturnMsg(null);
			propertyFee.setTaskId(null);
			propertyFee.setEncryptTxt(encryptTxtencode);
			propertyFee.setPara(null);
			propertyFee.setReturnData(null);
			//请求
			PropertyFeeResponse propertyFeeResponse = HttpClientUtilForAppSubscribe.post(propertyFee, PropertyFeeResponse.class,url);
			//加密部分解密后json字符串
			String decryptTxt = null;
			EncryptTxtResponse encryptTxtResponse = null;
			if(StringUtils.isNotBlank(propertyFeeResponse.getEncryptTxt())){
			//对返回参数中加密部分的解密
			decryptTxt = Des3.decode(propertyFeeResponse.getEncryptTxt(), secretKey);
			//解密后转成对象
			encryptTxtResponse = JsonUtil.fromJson(decryptTxt, EncryptTxtResponse.class);
			encryptTxtResponse.setHouseName(houseAssistCode.getHouseName());
			encryptTxtResponses.add(encryptTxtResponse);
			}
		}
		
		return encryptTxtResponses;
	}
	
	/**
	 * 根据客户id查询客户主用手机号码
	 * @param customerId
	 * @return
	 */
	public String getPhoneNum(String customerId){
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("customerId", customerId);
		String mainMobile = centerDao.queryForStringQuietly("sql.customer.mainMobile", parameters);
		return mainMobile;
	}
	
	/**
	 * 根据客户id获取客户下所有房产信息
	 * @param customerId
	 * @return
	 */
	public List<HouseAssistCode> getHouseAssistCode(String customerId){
		List<HouseAssistCode> list = new ArrayList<HouseAssistCode>();
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("customerId", customerId);
		list = centerDao.queryForList(HouseAssistCode.class, "sql.customer.houseAssistCode", parameters);
		return list;
	}
	

}
