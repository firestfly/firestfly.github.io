package bingo.vkcrm.service.convert;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.convert.converter.Converter;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by szsonic on 2015/11/3.
 * 日期装换工具，前台直接传日期字符串，后台可以直接用Date类型接收
 */
public class LongDateConvert implements Converter<String,Date> {
    private static final Log log = LogFactory.getLog(LongDateConvert.class);
    @Override
    public Date convert(String source) {
       try {
           if(StringUtils.isEmpty(source)){
               return null;
           }
           return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(source);
       }catch (Exception e){
           e.printStackTrace();
           log.error(e.getMessage());
       }
        return null;
    }
}
