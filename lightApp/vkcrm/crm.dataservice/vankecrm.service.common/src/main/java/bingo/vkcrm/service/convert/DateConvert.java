package bingo.vkcrm.service.convert;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.convert.converter.Converter;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by szsonic on 2015/11/8.
 */
public class DateConvert implements Converter<String,Date> {
    private static final Log log = LogFactory.getLog(DateConvert.class);
    @Override
    public Date convert(String source) {
        try {
            if(StringUtils.isEmpty(source)){
                return null;
            }
            if(source.indexOf(":")>0){//代表该日期格式有时分秒
                return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(source);
            }else{
                return new SimpleDateFormat("yyyy-MM-dd").parse(source);
            }
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return null;
    }
}

