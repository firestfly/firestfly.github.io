package bingo.vkcrm.common.utils;

import java.util.Date;

/**
 * Created by szsonic on 2015/11/15.
 */
public class DateUtil {
    //返回两个日期相差的秒
    public static Integer getDifferenceTime(Date date1,Date date2){
        Long diff=date1.getTime()-date2.getTime();
        return  new Long(Math.abs(diff/1000)).intValue();
    }
}
