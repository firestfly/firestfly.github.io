package bingo.vkcrm.service.tel.v1.services;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.*;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.common.core.ApplicationContext;
import bingo.common.core.utils.DateUtils;
import bingo.dao.Page;
import bingo.vkcrm.service.common.ListResult;
import bingo.vkcrm.service.common.ServiceResult;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.tel.v1.models.SmsSendLog;
import bingo.vkcrm.service.tel.v1.models.SmsSendMobile;
import bingo.vkcrm.service.tel.v1.models.SmsTemplate;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.common.utils.ValidateUtil;
/**
 * 短信服务
 * @author chengsiyuan
 *
 */
@Service
public class MessageService extends BaseService{

	private static final String SERVICE_URL = ApplicationContext.getProperty("smsSend.URL"); 
	private static final String USERNAME    = ApplicationContext.getProperty("smsSend.UserName");
	private static final String PASSWORD;
	private static Map<String, String> errorMessageMap;
	static{
		String passWord = ApplicationContext.getProperty("smsSend.Password");
		try {
			passWord = encrypt(USERNAME+encrypt(passWord));
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		PASSWORD = passWord;
		
		errorMessageMap = new HashMap<String, String>();
		errorMessageMap.put("0", "失败");
		errorMessageMap.put("-1", "用户名或者密码不正确");
		errorMessageMap.put("-2", "必填选项为空");
		errorMessageMap.put("-3", "短信内容0个字节");
		errorMessageMap.put("-4", "0个有效号码");
		errorMessageMap.put("-5", "余额不够");
		errorMessageMap.put("-10", "用户被禁用");
		errorMessageMap.put("-11", "短信内容超过500字");
		errorMessageMap.put("-12", "无扩展权限（ext字段需填空）");
		errorMessageMap.put("-13", "IP校验错误");
		errorMessageMap.put("-14", "内容解析异常");
		errorMessageMap.put("-990", "未知错误");
		
	}

	/**
	 * 发送短信
	 * @param numbers 接口号码
	 * @param content 短信内容
	 * @param timing 定时发送时间
	 * @param extCode 扩展编码
	 * @param templateId 模版ID
	 * @param type 模版类型
	 * @param user 当前用户
	 */
	public ServiceResult sendMessage(String[] numbers,String content,String dstime,
			String extCode,String templateId,String type,User user) throws Exception{
		
		if(null == numbers || StringUtils.isEmpty(content)){
			return ServiceResult.error("手机号码和短信内容都是必填的！");
		}
		
		// 检查手机号码是否正确
		List<String> sendList = new ArrayList<String>();
		String errorMessage = "";
		for(String number : numbers){
			if(ValidateUtil.isMobile(number)){
				sendList.add(number);
			}else{
				errorMessage += number + ",";
			}
		}
		if(StringUtils.isNotEmpty(errorMessage)){
			errorMessage = errorMessage.substring(0, errorMessage.length()-1);
			errorMessage = errorMessage+"手机号码格式不正确！";
		}
		if(sendList.size() == 0){
			return ServiceResult.error(errorMessage);
		}
		String[] newSendArray = sendList.toArray(new String[0]);
		String newSendStr = "";
		for(String temp : newSendArray){
			newSendStr += temp +",";
		}
		newSendStr = newSendStr.substring(0, newSendStr.length()-1);
		
		// 检查Dstime
		Date timing = null;
		if(StringUtils.isNotEmpty(dstime)){
			timing = DateUtils.toDate(dstime);
			if(null == timing){
				return ServiceResult.error("定时时间格式不正确！");
			}
		}
		
		String msgid = UUIDUtil.create();
		StringBuffer sb = new StringBuffer(SERVICE_URL);
		sb.append("username="+USERNAME);
//		sb.append("&password=d368513a0c90f7b9c31535a2ad249592");
		sb.append("&password="+PASSWORD);
		sb.append("&mobile="+newSendStr);
		sb.append("&content="+URLEncoder.encode(content,"utf-8"));
		sb.append("&dstime="+(dstime==null?"":dstime));
		sb.append("&ext="+(extCode==null?"":extCode));
		sb.append("&msgid="+(msgid==null?"":msgid));
		sb.append("&msgfmt=utf-8");
		URL url = new URL(sb.toString());
		System.out.println(sb.toString());
		URLConnection conn = url.openConnection();
		conn.setRequestProperty("accept", "*/*");
		conn.setRequestProperty("connection", "Keep-Alive");
		conn.connect(); 
		BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
		String line = "";
		String result = "";
		while ((line=in.readLine())!=null){
			result += line + "\n";
		}
		in.close();
		if(null != errorMessageMap.get(result)){
			errorMessage += "发送错误信息：" + result + errorMessageMap.get(result);
			sendLog(newSendArray, content, timing, extCode, msgid, templateId, type, true,errorMessage, user);
			return ServiceResult.error(errorMessage);
		}else{
			errorMessage += "成功发送"+sendList.size()+"条短信。"+result;
			sendLog(newSendArray, content, timing, extCode, msgid, templateId, type, true,errorMessage, user);
			return ServiceResult.succeed(errorMessage);
		}
	}
	

	/**
	 * 查询短信模版
	 * @param pager 分页信息
	 * @param name 模版名称
	 * @param content 短信内容
	 */
	public ServiceResult queryTemplate(Page page,String name,String content) throws Exception{
		Map<String, String> queryParam = new HashMap<String, String>();
		queryParam.put("name", name);
		queryParam.put("content", content);
		List<SmsTemplate> smsTemplateList = bizRoDao.queryForListPage(SmsTemplate.class, page, "callcenter.sms.template.list", null, queryParam, true);
        ListResult<SmsTemplate> listResult = new ListResult<SmsTemplate>(page, smsTemplateList);
        return ServiceResult.succeed(listResult);
	}
	
	
	
	/**
	 * 
	 * @param numbers 接口号码
	 * @param content 短信内容
	 * @param timing 定时发送时间
	 * @param extCode 扩展编码
	 * @param msgid 客户自定义消息ID
	 * @param templateId 模版ID
	 * @param type 模版类型
	 * @param success 是否发送成功
	 * @param user 当前用户
	 */
	public void sendLog(String[] numbers,String content,Date timing,String extCode,
			String msgid,String templateId,String type,boolean success,String errorMessage,User user){
		
		String sendId = UUIDUtil.create();
		SmsSendLog ssl = new SmsSendLog();
		ssl.setId(sendId);
		ssl.setTemplateId(templateId);
		ssl.setContent(content);
		ssl.setExtCode(extCode);
		ssl.setMsgid(msgid);
		ssl.setSuccess(success);
		ssl.setErrorMessage(errorMessage);
		ssl.setTiming(timing);
		ssl.setType(type);
		ssl.setSendName(user.getName());
		ssl.setSendUid(user.getId());
		ssl.setSendTime(new Date());
		// 保存发送日志
		bizDao.insert(ssl);
		
		// 保存发送手机号码
		List<SmsSendMobile> smsSendMobileList = new ArrayList<SmsSendMobile>();		
		for(String number : numbers){
			SmsSendMobile ssm = new SmsSendMobile();
			ssm.setSendId(sendId);
			ssm.setMobile(number);
			smsSendMobileList.add(ssm);
		}
		bizDao.batchInsert(SmsSendMobile.class, smsSendMobileList);
	}
	

	/**
	 * MD5加密
	 */
	private static String encrypt(String text) throws Exception{
		char hexDigits[]={'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'};       
        try {
            byte[] btInput = text.getBytes();
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] textByte = mdInst.digest();
            // 把密文转换成十六进制的字符串形式
            int j = textByte.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = textByte[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }	

	}
	
	
	
	
//	public static void main(String[] args) throws Exception {
//		String[] numbers = {"18520878238"};
//		sandMessage("住这儿验证码19039411:45:06","13580581147,18520878238");
//	}
}
