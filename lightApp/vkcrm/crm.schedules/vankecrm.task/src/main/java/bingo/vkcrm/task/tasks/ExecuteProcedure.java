package bingo.vkcrm.task.tasks;

import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.services.SyncService;
import org.quartz.JobExecutionContext;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Administrator on 2016/5/6.
 */
public class ExecuteProcedure extends AbstractQuartzTask {

    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        SyncService appTaskService = (SyncService) jobExecutionContext.getMergedJobDataMap().get("syncService");
        long current=System.currentTimeMillis();//当前时间毫秒数
        long zero=current/(1000*3600*24)*(1000*3600*24)- TimeZone.getDefault().getRawOffset();//今天零点零分零秒的毫秒数
        Calendar calendar=Calendar.getInstance();
        calendar.setTime(new Timestamp(zero));
        Date endTime=calendar.getTime();
        calendar.add(Calendar.DATE,-1);
        Date startTime=calendar.getTime();
        appTaskService.updateTelCallRecordExpand(startTime,endTime);
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
