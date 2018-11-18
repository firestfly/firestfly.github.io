package bingo.vkcrm.task.common;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.MD5Util;
import bingo.vkcrm.task.models.bmap.common.RequestCommonHead;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by szsonic on 2015/11/15.
 */
public class BmapRequestHead {
    private static final String sysid = ApplicationContext.getProperty("bmap.sysid");
    private static final String wymap = ApplicationContext.getProperty("bmap.wymap");

    /**
     * 获取请求头部信息
     *
     * @param functionId
     * @return
     * @throws Exception
     */
    public static RequestCommonHead getRequestHead(String functionId) throws Exception {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.MINUTE, -3);
        String timeStamp = sdf.format(c.getTime());
        //password加密规则(MD5)：当前时间戳(yyyyMMddHHmmss)+sysid(系统定义的id:vkcrm)+"wymap"
        String password = new StringBuffer(timeStamp).append(sysid).append(wymap).toString();
        password = MD5Util.GetMD5Code(password);
        RequestCommonHead requestHead = new RequestCommonHead();
        requestHead.setFunctionid(functionId);
        requestHead.setPassword(password);
        requestHead.setTimestamp(timeStamp);
        requestHead.setSysid(sysid);
        return requestHead;
    }

    public static void main(String[] args) throws Exception {
        System.out.println(getRequestHead("getbuildinfobyproject").getPassword());
        System.out.println(getRequestHead("getbuildinfobyproject").getTimestamp());
    }
}
