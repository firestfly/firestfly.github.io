package bingo.vkcrm.service.utils;  
  
import java.security.SignatureException;
import java.util.*;

import javax.crypto.Mac;  
import javax.crypto.SecretKey;  
import javax.crypto.spec.SecretKeySpec;  

import org.apache.commons.codec.binary.Base64;

import com.google.common.io.BaseEncoding;

import bingo.common.core.ApplicationContext;
import bingo.common.core.utils.StringUtils;
import bingo.vkcrm.service.model.HmacSHA1Result;


/**
 * Created by 邱楚生 手机号码:15916451862,13560392970 QQ:65509713 on 2015/9/30.
 * 获取助这儿加密结果
 */
public class HMACSHA1 {  
  
    private static final String MAC_NAME = "HmacSHA1";    
    private static final String ENCODING = "UTF-8";
    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";
    
    /**
     * 获取加密结果
     * @param url 接口URL 如：/api/partner/tasks
     * @param param 接口键值对
     * @return HmacSHA1Result
     * @throws Exception
     */
    public static HmacSHA1Result getHmacSHA1Encrypt(String url,Map<String, String> param) throws Exception{

    	// 设置时间戳
    	Calendar calendar=Calendar.getInstance();   
    	calendar.setTime(new Date());
    	String ts = (int)(calendar.getTimeInMillis()/1000) +"";
    	param.put("ts", ts);
    	
    	// 排序取值
    	String paramValues = "";
    	List<String> keyList = new ArrayList<String>();    	
    	for(String key : param.keySet()){
    		keyList.add(key);
    	}
    	Collections.sort(keyList);
    	for(String key : keyList){
    		if(StringUtils.isNotEmpty(param.get(key))){
    			paramValues += param.get(key);
    		}
    		
    	}
    	
//    	System.out.println("app.AccessKey="+ApplicationContext.getProperty("app.AccessKey"));
//    	System.out.println("app.SecretKey="+ApplicationContext.getProperty("app.SecretKey"));
//    	System.out.println("calculateRFC2104HMAC="+calculateRFC2104HMAC(paramValues+url, ApplicationContext.getProperty("app.SecretKey")));
//    	System.out.println("HmacSHA1Encrypt="+HmacSHA1Encrypt(paramValues+url, ApplicationContext.getProperty("app.SecretKey")));
    	
    	// 计算token
    	String token = calculateRFC2104HMAC(paramValues+url, ApplicationContext.getProperty("app.SecretKey"));    	
    	String accessKey = ApplicationContext.getProperty("app.AccessKey");

    	// 拼接新URI
    	String newUri = "";
    	newUri += "token="+token;
    	newUri += "&access_key=" + accessKey;
    	newUri += "&ts=" + ts;  
    	
    	// 拼接结果集
    	HmacSHA1Result hmacSHA1Result = new HmacSHA1Result();
    	hmacSHA1Result.setTs(ts);
    	hmacSHA1Result.setToken(token);
    	hmacSHA1Result.setAccessKey(accessKey);
    	hmacSHA1Result.setNewUri(newUri);
    	
    	return hmacSHA1Result;
    	
    }
    
    

    /**
     * * Computes RFC 2104-compliant HMAC signature.
     * * * @param data
     * * The data to be signed.
     * *
     * * @param key The signing key.
     * * @return The Base64-urlSafe encoded RFC 3548-compliant HMAC signature.
     * * @throws java.security.SignatureException when signature generation fails
     * */
    public static String calculateRFC2104HMAC(String data, String key)
        throws java.security.SignatureException {
    	//System.out.println(data);
        String result;
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(ENCODING), HMAC_SHA1_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_SHA1_ALGORITHM);
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(ENCODING));
            result = BaseEncoding.base64Url().encode(rawHmac);
        } catch (Exception e) {
            throw new SignatureException("Failed to generate HMAC : " + e.getMessage());
        }
        return result;
    }
     
    
    
      
    /**  
     * 使用 HMAC-SHA1 签名方法对对encryptText进行签名  
     * @param encryptText 被签名的字符串  
     * @param encryptKey  密钥  
     * @return  
     * @throws Exception  
    */   
    public static String HmacSHA1Encrypt(String encryptText, String encryptKey) throws Exception{
        byte[] data=encryptKey.getBytes(ENCODING);  
        //根据给定的字节数组构造一个密钥,第二参数指定一个密钥算法的名称  
        SecretKey secretKey = new SecretKeySpec(data, MAC_NAME); 
        //生成一个指定 Mac 算法 的 Mac 对象  
        Mac mac = Mac.getInstance(MAC_NAME);   
        //用给定密钥初始化 Mac 对象  
        mac.init(secretKey);          
        byte[] text = encryptText.getBytes(ENCODING);    
        //完成 Mac 操作   
        byte[] hmacSHA1Result = mac.doFinal(text);
        
        String base64String = Base64.encodeBase64String(hmacSHA1Result);
        base64String = base64String.replace("+", "-");
        base64String = base64String.replace("/", "_");
        return base64String;
    }
    
    public static void main(String[] args) throws Exception {    	
    	//System.out.println(HmacSHA1Encrypt("duckbar1442374528/api/partner/something", "THE_KEY"));
    	
    	//int xxx = (new Date()).

//    	Calendar calendar=Calendar.getInstance();   
//    	calendar.setTime(new Date());
//    	String ts = (int)(calendar.getTimeInMillis()/1000) +"";
    	
    	
    	//http://test.4009515151.com/api/partner/tasks?curPage=1&pageSize=10
    	
    	Map<String, String> paramMap = new HashMap<String, String>();
    	paramMap.put("page", "1");
    	paramMap.put("per_page", "10");
    	//System.out.println("http://stage.4009515151.com"+getHmacSHA1Encrypt("/api/partner/tasks",paramMap));
    	System.out.println("http://stage.4009515151.com/api/partner/tasks?"+getHmacSHA1Encrypt("/api/partner/tasks",paramMap).getNewUri()+"&page=1&per_page=10");
    	System.out.println("http://test.4009515151.com/api/partner/tasks?"+getHmacSHA1Encrypt("/api/partner/tasks",paramMap).getNewUri());
    	
    	//System.out.println(HmacSHA1Encrypt("duckbar1442374528/api/partner/something", "THE_KEY"));
	}
    
    
    
}  