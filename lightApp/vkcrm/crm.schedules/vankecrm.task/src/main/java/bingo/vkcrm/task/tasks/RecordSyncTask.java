package bingo.vkcrm.task.tasks;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.Record;
import bingo.vkcrm.task.services.RecordService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.util.List;

/**
 * Created by Wangzr on 15/11/11.
 */
public class RecordSyncTask extends AbstractQuartzTask {

    private static final Log log = LogFactory.getLog(RecordSyncTask.class);

    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {

        RecordService recordService = (RecordService) jobExecutionContext.getMergedJobDataMap().get("recordService");

        String mode = ApplicationContext.getProperty("record.sync.mode", "增量");
        List<Record> list = null;

        log.info("录音同步:开始进行同步,同步模式[" + mode + "]");

        if (mode.equals("指定")) {
            String startTimeStr = ApplicationContext.getProperty("record.sync.starttime", "");
            String endTimeStr = ApplicationContext.getProperty("record.sync.endtime", "");

            log.info("录音同步:指定同步开始时间[" + startTimeStr + "],指定同步结束时间[" + endTimeStr + "]");

            if (StringUtils.isEmpty(startTimeStr) || StringUtils.isEmpty(endTimeStr)) {
                log.info("录音同步:指定同步时间为空,取消同步");
                return true;
            }

            list = recordService.queryRecords(startTimeStr, endTimeStr);
        } else if (mode.equals("增量")) {
            list = recordService.queryYesterdayRecords();
        }

        log.info("录音同步:同步录音记录数量" + (list != null ? list.size() : 0));

        if (list != null && list.size() > 0) {
            log.info("录音同步:开始批量导入");
            recordService.BatchImport(list);
            log.info("录音同步:批量导入完成");
        }
        return true;
    }

    @Override
    public boolean onBefore(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }

    @Override
    public void onException(JobExecutionContext jobExecutionContext, String fromMethod, Exception exception) {

    }

    @Override
    public boolean onAfter(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }
}
