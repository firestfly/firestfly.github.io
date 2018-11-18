package bingo.vkcrm.service.house.v1.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.house.v1.models.Subscription.*;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.common.utils.Des3;
import bingo.vkcrm.service.utils.HttpClientUtilForAppSubscribe;
import bingo.vkcrm.common.utils.JsonUtil;

/**
 * 订阅关系服务
 * @author chengsiyuan
 *
 */
@Service
public class SubscriptionService extends BaseService {

	/**
	 * 一卡通
	 * @param cardNo ： 卡号数组
	 * @param pageNo
	 * @param pageSize
	 * @return
	 * @throws Exception 
	 */
	public CardResponse getCard(String[] cardNo,String pageNo,String pageSize) throws Exception{
		//一卡通请求体对象
		CardRequest cardRequest = new CardRequest();
		//请求体查询参数
		CardRequestParameter parameter = new CardRequestParameter();
		//请求体头部
		RequestHead head = new RequestHead();
		//该时间戳是固定的
		String timeStamp = "2012-12-12 12:12:12";
		//在config.xml获取url、账号、密码和functionId
		String url = ApplicationContext.getProperty("app.card.url");
		String sysid = ApplicationContext.getProperty("app.card.sysid");
		String password = ApplicationContext.getProperty("app.card.password");
		String functionid = ApplicationContext.getProperty("app.card.functionid");
		head.setSysid(sysid);
		head.setPassword(password);
		head.setTimestamp(timeStamp);
		head.setFunctionid(functionid);
		//暂不做时间区间查询
		parameter.setBeginDate("");
		parameter.setEndDate("");
		parameter.setCardNo(cardNo);
		parameter.setPageNo(pageNo);
		parameter.setPageSize(pageSize);
		cardRequest.setHead(head);
		cardRequest.setParameter(parameter);
		//调用住这儿APP
		return HttpClientUtilForAppSubscribe.post(cardRequest, CardResponse.class,url);
	}
	
	/**
	 * 邮包
	 * @param houseId ： 房屋id
	 * @param pageNo
	 * @param pageSize
	 * @return
	 * @throws Exception 
	 */
	public ParcelResponse getParcel(String houseId,String pageNo,String pageSize) throws Exception{
		//查询该房屋下所有电话号码
		String[] mobile = getPhoneNum(houseId);
		ParcelRequest parcelRequest = new ParcelRequest();
		ParcelRequestParameter parameter = new ParcelRequestParameter();
		RequestHead head = new RequestHead();
		//该时间戳是固定的
		String timeStamp = "2012-12-12 12:12:12";
		String url = ApplicationContext.getProperty("app.parcel.url");
		String sysId = ApplicationContext.getProperty("app.parcel.sysid");
		String password = ApplicationContext.getProperty("app.parcel.password");
		String functionId = ApplicationContext.getProperty("app.parcel.functionid");
		head.setSysid(sysId);
		head.setPassword(password);
		head.setTimestamp(timeStamp);
		head.setFunctionid(functionId);
		parameter.setMobile(mobile);
		parameter.setBeginDate("");
		parameter.setEndDate("");
		parameter.setPageNo(pageNo);
		parameter.setPageSize(pageSize);
		parcelRequest.setHead(head);
		parcelRequest.setParameter(parameter);
		return HttpClientUtilForAppSubscribe.post(parcelRequest, ParcelResponse.class,url);
	}
	
	/**
	 * 物业费
	 * @param houseId ： 房屋id
	 * @return
	 * @throws Exception 
	 */
	public EncryptTxtResponse getProperty(String houseId) throws Exception{
		//获取url
		String url = ApplicationContext.getProperty("app.propertyfee.url","http://10.0.57.114:9005/vanke-webapi/api/NCBill");
		//获取加密秘钥
		String secretKey = ApplicationContext.getProperty("app.propertyfee.secretKey","ySiWZ/Hv2bpikmPblP000000");
		//获取房屋辅助编码和所在项目code
		HouseAssistCode houseAssistCode = getHouseAssistCode(houseId);
		//查不出到辅助编码不做操作
		if(houseAssistCode == null){
			return null;	
		}
		if(StringUtils.isBlank(houseAssistCode.getAssistCode()) || StringUtils.isBlank(houseAssistCode.getProjectCode())){
			return null;
		}
		PropertyFee propertyFee = new PropertyFee();
		//请求数据加密部分实体
		EncryptTxtRequest encryptTxtRequest = new EncryptTxtRequest();
		encryptTxtRequest.setBill_end_mth(null);
		encryptTxtRequest.setBill_start_mth(null);
		//设置房屋编码（辅助编码）
//		encryptTxtRequest.setHouse_mdscode("1003A1100000000002X7");
		encryptTxtRequest.setHouse_mdscode(houseAssistCode.getAssistCode());
		encryptTxtRequest.setPwd("");
		//设置项目code
//		encryptTxtRequest.setProject_code("44030011");
		encryptTxtRequest.setProject_code(houseAssistCode.getProjectCode());
		//转成json
		String encryptTxt = JsonUtil.toJson(encryptTxtRequest);
		//进行加密(Des3加密需要加密文本、秘钥和一个向量，前两个在config配置，向量在Des3文件里)
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
		encryptTxtResponse = JsonUtil.fromJson(decryptTxt,EncryptTxtResponse.class);

		}
		return encryptTxtResponse;
	}
	
	/**
	 * 根据房屋id查询房屋下所有客户主用手机号码
	 * @param houseId
	 * @return
	 */
	public String[] getPhoneNum(String houseId){
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("houseId", houseId);
		List<String> list = centerRoDao.queryForList(String.class,"sql.house.mainMobile", parameters);
		//装成数组
		String[] mobile = new String[list.size()];
		for(int i = 0 ; i< list.size() ; i++){
			mobile[i] = list.get(i);
		}
		return mobile;
	}

	/**
	 * 根据房屋id获取房屋辅助编码和项目编码
	 * @param houseId
	 * @return
	 */
	public HouseAssistCode getHouseAssistCode(String houseId){
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("houseId", houseId);
		HouseAssistCode houseAssistCode = centerRoDao.queryForObjectQuietly(HouseAssistCode.class, "sql.house.assistCode", parameters);
		return houseAssistCode;
	}
}
