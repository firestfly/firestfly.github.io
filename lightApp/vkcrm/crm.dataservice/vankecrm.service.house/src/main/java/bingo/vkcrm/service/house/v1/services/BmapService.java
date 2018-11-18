package bingo.vkcrm.service.house.v1.services;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.common.utils.MD5Util;
import bingo.vkcrm.service.enums.AccessTypes;
import bingo.vkcrm.service.house.v1.models.bmap.*;
import bingo.vkcrm.service.model.RestAccessLog;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.service.utils.HttpClientUtilForAppSubscribe;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by szsonic on 2016/3/21/021.
 */
@Service
public class BmapService extends BaseService {
    private static final String SYS_ID = ApplicationContext.getProperty("bmap.sysid");
    private static final String WY_MAP = ApplicationContext.getProperty("bmap.wymap");
    private final String BMAP_URL = ApplicationContext.getProperty("bmap.hostAndPort");
    private static final String ACCOUNT = ApplicationContext.getProperty("bmap.account");
    private static final String BMAP_HOUSECODE_FUNCTIONID = "applyforpropertycode";

    public BmapResponse getBampHouseCode(List<RequestHouse> requestHouses) throws Exception{
        BmapRequest bmapRequest=new BmapRequest();

        BmapParameter bmapParameter=new BmapParameter();
        bmapParameter.setPropsize("1");
        bmapParameter.setProps(requestHouses);
        bmapParameter.setSource("CRM");
        bmapParameter.setAccount(ACCOUNT);

        bmapRequest.setHead(getBmapHead(BMAP_HOUSECODE_FUNCTIONID));
        bmapRequest.setParameter(bmapParameter);
        BmapResponse response = getBmapCode(bmapRequest,BMAP_URL);

        return response;
    }




    public BmapRequestHead getBmapHead(String functionId) throws Exception{
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.MINUTE, -3);
        String timeStamp = sdf.format(c.getTime());
        //password加密规则(MD5)：当前时间戳(yyyyMMddHHmmss)+sysid(系统定义的id:vkcrm)+"wymap"
        String password = new StringBuffer(timeStamp).append(SYS_ID).append(WY_MAP).toString();
        password = MD5Util.GetMD5Code(password);
        BmapRequestHead requestHead = new BmapRequestHead();
        requestHead.setFunctionid(functionId);
        requestHead.setPassword(password);
        requestHead.setTimestamp(timeStamp);
        requestHead.setSysid(SYS_ID);
        return requestHead;
    }


    public BmapResponse getBmapCode(BmapRequest bmapRequest, String url) throws  Exception{
        Date startTime = null;
        BmapResponse callback = null;
        String exceptionMsg = null;
        try {
            startTime = new Date();
            callback = HttpClientUtilForAppSubscribe.post(bmapRequest, BmapResponse.class, url);
        } catch (Exception e) {
            e.printStackTrace();
            exceptionMsg = e.getMessage();
        } finally {
            Date endTime = new Date();
            log2RedisMQ(startTime, endTime, url, JsonUtil.toJson(bmapRequest), JsonUtil.toJson(callback), "调用战图接口获取房屋编码", exceptionMsg);
        }
        return callback;
    }



    /**
     * 存入Redis消息队列
     *
     * @param requestDate      请求时间
     * @param responseDate     响应时间
     * @param remoteUrl        访问地址
     * @param parameters       参数
     * @param result           结果
     * @param actionName       动作
     * @param exceptionMessage 异常信息
     */
    private void log2RedisMQ(Date requestDate, Date responseDate, String remoteUrl, String parameters, String result, String actionName, String exceptionMessage) {
        try {
            RestAccessLog restAccessLog = new RestAccessLog();
            restAccessLog.setActionName(actionName);
            restAccessLog.setAccessType(AccessTypes.Bmap.getValue());
            restAccessLog.setParameterMapJson(parameters);
            restAccessLog.setResultJson(result);
            restAccessLog.setRequestDate(requestDate);
            restAccessLog.setResponseDate(responseDate);
            restAccessLog.setRequestMethod("POST");
            restAccessLog.setRequestUrl(remoteUrl);
            restAccessLog.setExceptionMessage(exceptionMessage);
            restAccessLog.setCreateDate(new Date());
            String jsonString = JsonUtil.toJson(restAccessLog);
            String accessLogKey = ApplicationContext.getProperty("log.restaccesslog.key", "RestAccessLog");
            JedisUtil.defaultDb().lpush(accessLogKey.getBytes("UTF-8"), jsonString.getBytes("UTF-8"));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
        }
    }

}
