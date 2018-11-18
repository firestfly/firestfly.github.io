/**
 * This file created at 2011-12-30.
 *
 * Copyright (c) 2002-2011 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.service.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import bingo.vkcrm.common.utils.JsonUtil;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.service.model.HmacSHA1Result;


/**
 * <code>{@link HttpClientUtilForAppSubscribe}</code>
 * 此文档为CRM调用助这儿订阅关系接口封装类，方便查询助这儿订阅关系
 * @author 邱楚生 手机号码:15916451862,13560392970 QQ:65509713
 */
public class HttpClientUtilForAppSubscribe {
	private static final Log log = LogFactory.getLog(HttpClientUtilForAppSubscribe.class);
	/**
	 * POST 方式提交到助这儿
	 * @param requestData 请求体对象，要求结构跟接口文档一致
	 * @param responseType 返回对象的class
	 * @param url 接口URL完整路径
	 * @return
	 * @throws Exception
	 */
	public static <T> T post(Object requestData,Class<T> responseType,String url) throws Exception {		
		T t = null;
        byte[] dataByte = null; 
        HttpClient httpClient = new DefaultHttpClient(); 
        HttpPost httpPost = new HttpPost(url);

        String requestStr = JsonUtil.toJson(requestData);
        StringEntity strEntity = new StringEntity(requestStr, "UTF-8");
		strEntity.setContentType(new BasicHeader(HTTP.CONTENT_TYPE, "application/x-www-form-urlencoded"));
		strEntity.setContentEncoding(new BasicHeader(HTTP.CONTENT_ENCODING, "UTF-8"));
		httpPost.setHeader("Accept", "application/json");
		httpPost.setHeader("Content-Type", "application/json");
		httpPost.setEntity(strEntity);
	    byte[] b = requestStr.getBytes("UTF-8");
	    InputStream is = new ByteArrayInputStream(b,0,b.length);
	    
	    HttpEntity he = new InputStreamEntity(is);
	    httpPost.setEntity(he);
        // 执行请求         
        HttpResponse httpResponse = httpClient.execute(httpPost); 
        // 获取返回的数据        
        HttpEntity httpEntity = httpResponse.getEntity(); 
        if (httpEntity != null) { 
            byte[] responseBytes = getData(httpEntity); 
            dataByte = responseBytes; 
            httpPost.abort(); 
        } 
        //将字节数组转换成为字符串         
        String result = bytesToString(dataByte);
        t = jsonToObject(result,responseType);
		return t;
	}

	public static <T> T jsonToObject(String jsonStr,Class<T> responseType) throws IOException{
		return JsonUtil.fromJson(jsonStr,responseType);
	}
	
	public static String getMainUrl(String url,Map<String, String> param){
		String hostAndPort = ApplicationContext.getProperty("app.hostAndPort");
    	HmacSHA1Result	hmacSHA1Result = new HmacSHA1Result();
    	try {
			hmacSHA1Result = HMACSHA1.getHmacSHA1Encrypt(url, param);
		} catch (Exception e) {
			e.printStackTrace();
		}		
    	String mainUrl = hostAndPort+url+"?"+hmacSHA1Result.getNewUri();
    	return mainUrl;
	}
	

    /** 
     * 获取Entity中数据 
     * @param httpEntity 
     * @return 
     * @throws Exception 
     */
    public static byte[] getData(HttpEntity httpEntity) throws Exception{ 
        BufferedHttpEntity bufferedHttpEntity = new BufferedHttpEntity(httpEntity); 
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(); 
        bufferedHttpEntity.writeTo(byteArrayOutputStream); 
        byte[] responseBytes = byteArrayOutputStream.toByteArray(); 
        return responseBytes;

    }

    /** 
     * 将字节数组转换成字符串 
     * @param bytes 
     * @return 
     * @throws UnsupportedEncodingException 
     */
    public static String bytesToString(byte[] bytes) throws UnsupportedEncodingException{ 
        if (bytes!=null) { 
            String returnStr = new String(bytes,"utf-8"); 
            returnStr = StringUtils.trim(returnStr);
            log.debug(StringEscapeUtils.unescapeJava(returnStr));
            return StringEscapeUtils.unescapeJava(returnStr);
        } 
        return null; 
    } 
	
	


}
