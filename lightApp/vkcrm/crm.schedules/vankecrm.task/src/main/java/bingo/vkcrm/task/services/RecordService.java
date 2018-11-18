package bingo.vkcrm.task.services;

import bingo.common.core.ApplicationContext;
import bingo.dao.IDao;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.task.models.Record;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by hades on 15/11/11.
 */
@Service
public class RecordService extends BaseService {

    private static final Log log = LogFactory.getLog(RecordService.class);

    @Autowired
    private IDao recordDao;

    @Autowired
    private IDao bizDao;

    private final String DATETIME_FORMAT_LONG = "yyyy-MM-dd HH:mm:ss";
    private final String DATETIME_FORMAT_SHORT = "yyyy-MM-dd";

    /**
     * 查询昨天的录音记录
     * @return
     */
    public List<Record> queryYesterdayRecords(){
        SimpleDateFormat format = new SimpleDateFormat(DATETIME_FORMAT_SHORT);
        String startTimeStr = format.format(DateUtils.addDays(new Date(), -1)) + " 00:00:00";
        String endTimeStr = format.format(DateUtils.addDays(new Date(), -1)) + " 23:59:59";

        return queryRecords(startTimeStr, endTimeStr);
    }

    /**
     * 查询之前的录音记录
     * 需要在配置文件中指定需要同步的开始结束时间
     * @return
     */
    public List<Record> queryRecords(String startTimeStr, String endTimeStr){
        if(StringUtils.isEmpty(startTimeStr) || StringUtils.isEmpty(endTimeStr)){
            return null;
        }

        SimpleDateFormat format = new SimpleDateFormat(DATETIME_FORMAT_LONG);
        Date startTime = null;
        Date endTime = null;
        try {
            startTime = format.parse(startTimeStr);
            endTime = format.parse(endTimeStr);
        }
        catch(ParseException ex){

        }

        this.delAll(startTimeStr, endTimeStr);

        log.info("录音同步:查询录音 开始时间[" + startTimeStr + "] 结束时间[" + endTimeStr + "]");

        Map<String, Object> parameter = new HashMap<String, Object>();
        parameter.put("startTime", startTime);
        parameter.put("endTime", endTime);

        return recordDao.queryForList(Record.class, "sql.query.records.between", parameter);
    }

    private boolean delAll(String startTimeStr, String endTimeStr){

        SimpleDateFormat format = new SimpleDateFormat(DATETIME_FORMAT_LONG);
        Date startTime = null;
        Date endTime = null;
        try {
            startTime = format.parse(startTimeStr);
            endTime = format.parse(endTimeStr);
        }
        catch(ParseException ex){

        }

        log.info("录音同步:准备清空记录,开始时间[" + startTimeStr + "] 结束时间[" + endTimeStr + "]");

        Map<String, Object> parameter = new HashMap<String, Object>();
        parameter.put("startTime", startTime);
        parameter.put("endTime", endTime);

        return bizDao.delete("sql.clean.records.between", parameter) > 0;
    }

    /**
     *
     * @param records
     * @return
     */
    public boolean BatchImport(List<Record> records){
        return bizDao.batchInsert(Record.class, records) != null;
    }
}
