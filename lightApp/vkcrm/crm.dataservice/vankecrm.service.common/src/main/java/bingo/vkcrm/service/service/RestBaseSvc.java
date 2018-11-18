package bingo.vkcrm.service.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import bingo.vkcrm.common.utils.JsonUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.BufferedHttpEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import org.springframework.web.client.RestTemplate;


/**
 * Created by asus on 2015/10/28.
 */
public abstract class RestBaseSvc extends BaseService {

    /**
     * POST
     * @param responseType
     * @param url
     * @param param
     * @return
     * @throws Exception
     */
    public <T> T post(Class<T> responseType,String url,Map<String, String> param) throws Exception {
        T t = null;
        String mainUrl = getMainUrl(url, param);
        byte[] dataByte = null;
        HttpClient httpClient = new DefaultHttpClient();
        HttpPost httpPost = new HttpPost(mainUrl);
        if(null != param && !param.isEmpty()) {
            //设置参数
            UrlEncodedFormEntity encodedFormEntity = new UrlEncodedFormEntity(setHttpParams(param), "UTF-8");
            httpPost.setEntity(encodedFormEntity);
        }
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

    /**
     * PUT
     * @param responseType
     * @param url
     * @param param
     * @return
     * @throws Exception
     */
    public <T> T put(Class<T> responseType,String url,Map<String, String> param) throws Exception {
        String mainUrl = getMainUrl(url, param);
        byte[] dataByte = null;
        HttpClient httpClient = new DefaultHttpClient();
        HttpPut httpPut = new HttpPut(mainUrl);
        //设置参数
        if (null != param && !param.isEmpty()) {
            UrlEncodedFormEntity encodedFormEntity = new UrlEncodedFormEntity(setHttpParams(param), "UTF-8");
            httpPut.setEntity(encodedFormEntity);
        }
        // 执行请求
        HttpResponse httpResponse = httpClient.execute(httpPut);
        // 获取返回的数据
        HttpEntity httpEntity = httpResponse.getEntity();
        if (httpEntity != null) {
            dataByte = getData(httpEntity);
            httpPut.abort();
        }
        //将字节数组转换成为字符串
        String result = bytesToString(dataByte);
        return jsonToObject(result,responseType);
    }



    /**
     * get
     * @param responseType
     * @param url
     * @param param
     * @return
     * @throws Exception
     */
    public <T> T get(Class<T> responseType,String url,Map<String, String> param) throws Exception {
        return new RestTemplate().getForObject(getMainUrlForGet(url, param), responseType);
    }

//    public <T> T get(Class<T> responseType, String url, Map<String, String> parameters) throws Exception{
//        String mainUrl = getMainUrl(url, parameters);
//        byte[] dataByte = null;
//        HttpClient httpClient = new DefaultHttpClient();
//        HttpGet httpGet = new HttpGet(mainUrl);
//        if(null != parameters && !parameters.isEmpty()) {
//            //设置参数
//        }
//        // 执行请求
//        HttpResponse httpResponse = httpClient.execute(httpGet);
//        // 获取返回的数据
//        HttpEntity httpEntity = httpResponse.getEntity();
//        if (httpEntity != null) {
//            byte[] responseBytes = getData(httpEntity);
//            dataByte = responseBytes;
//            httpGet.abort();
//        }
//        //将字节数组转换成为字符串
//        String result = bytesToString(dataByte);
//        JsonObject obj = jsonToObject(result, JsonObject.class);
//        return obj;
//    }

    private <T> T jsonToObject(String jsonStr,Class<T> responseType) throws IOException {
        return JsonUtil.fromJson(jsonStr, responseType);
    }

    protected abstract String getMainUrl(String url,Map<String, String> param);

    protected abstract String getMainUrlForGet(String url,Map<String, String> param);

    /**
     * 获取Entity中数据
     * @param httpEntity 头部数据
     * @return
     * @throws Exception
     */
    private byte[] getData(HttpEntity httpEntity) throws Exception{
        BufferedHttpEntity bufferedHttpEntity = new BufferedHttpEntity(httpEntity);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bufferedHttpEntity.writeTo(byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }


    /**
     * 设置HttpPost请求参数
     * @param argsMap
     * @return BasicHttpParams
     */
    private List<BasicNameValuePair> setHttpParams(Map<String, String> argsMap){
        List<BasicNameValuePair> nameValuePairList = new ArrayList<BasicNameValuePair>();
        //设置请求参数
        if (argsMap!=null && !argsMap.isEmpty()) {
            Set<Map.Entry<String, String>> set = argsMap.entrySet();
            Iterator<Map.Entry<String, String>> iterator = set.iterator();
            while(iterator.hasNext()){
                Map.Entry<String, String> entry = iterator.next();
                BasicNameValuePair basicNameValuePair = new BasicNameValuePair(entry.getKey(), entry.getValue().toString());
                nameValuePairList.add(basicNameValuePair);
            }
        }
        return nameValuePairList;
    }

    /**
     * 将字节数组转换成字符串
     * @param bytes
     * @return
     * @throws UnsupportedEncodingException
     */
    private String bytesToString(byte[] bytes) throws UnsupportedEncodingException{
        if (bytes!=null) {
            String returnStr = new String(bytes,"utf-8");
            returnStr = StringUtils.trim(returnStr);
            return returnStr;
        }
        return null;
    }
}
