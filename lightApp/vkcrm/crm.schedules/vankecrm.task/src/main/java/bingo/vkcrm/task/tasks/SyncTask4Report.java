package bingo.vkcrm.task.tasks;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.models.appTask.*;
import bingo.vkcrm.task.services.AppTaskService;
import org.quartz.JobExecutionContext;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by szsonic on 2016/1/22/022.
 */
public class SyncTask4Report extends AbstractQuartzTask {
    private static final String SUCCESS_CODE = "0";//调用助这儿接口返回成功的标示
    private static final String SYNC_CODE = "syncTask";//写入同步日志表中的code;用于区别同步数据接口
    //用于获取app接口的所有任务
    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");
        SyncConfig config=appTaskService.querySyncConfig(SYNC_CODE);
        Date configSyncTime= config.getNextSyncTime();
        log.debug("*****************同步<APP任务>定时任务开始*****************");
        if (new Date().getTime() < configSyncTime.getTime()) {
            log.debug("[同步APP任务]-开始本次同步开始时间为："+configSyncTime+"，未到时间10秒后再试");
            log.debug("*****************同步<APP任务>定时任务结束*****************");
            return true;//如果还没到配置时间，则不开始同步，直接退出
        }
        Integer syncCycle=config.getRequestCycle();
        Date requestTime= config.getRequestTime();

        Integer pageSize=config.getPageSize();
        Integer env=config.getSyncEnv();
        String host;
        if(env==0){//判断要用生产环境还是测试环境
            host=ApplicationContext.getProperty("app.hostAndPort.test");
        }else{
            host=ApplicationContext.getProperty("app.hostAndPort.prd");
        }

        int curPage=1;
        boolean hasNextPage=true;
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(requestTime);
        String start = sdf.format(calendar.getTime());


        long current=System.currentTimeMillis();//当前时间毫秒数
        long zero=current/(1000*3600*24)*(1000*3600*24)- TimeZone.getDefault().getRawOffset();//今天零点零分零秒的毫秒数
        calendar.setTime(new Timestamp(zero));
        String end=sdf.format(calendar.getTime());
        while(hasNextPage){
            log.debug("当前同步第"+curPage+"页");
            List<AppTaskRecord> insertList=new ArrayList<AppTaskRecord>();
            List<AppTaskRecord> updateList=new ArrayList<AppTaskRecord>();
            TaskCallBack4Report taskListCallback= appTaskService.queryAllTasks4Report(curPage, pageSize,start,end,host);
            String code=taskListCallback.getCode();
            if(SUCCESS_CODE.equals(code)){
                List<AppTaskRecord> taskList=taskListCallback.getResult().getTasks();//一次请求拿到的任务数据
                log.debug("本次请求成功，返回成功条数："+taskList.size());
                for (AppTaskRecord taskRecord : taskList) {
                    String taskNo=taskRecord.getTask_no();
                    if(appTaskService.existTask(taskNo)){
                        updateList.add(taskRecord);
                    }else{
                        insertList.add(taskRecord);
                    }
                }
                if(taskList.size()<pageSize) {
                    hasNextPage = false;//如果返回条数小于请求条数，则不再调用接口
                }else {
                    curPage++;
                }
                if(insertList.size()>0){
                    appTaskService.insertSyncTask4Report(insertList);
                }
                if(updateList.size()>0){
                    appTaskService.updateSyncTask4Report(updateList);
                }
                log.debug("插入条数:"+insertList.size());
                log.debug("更新条数:"+updateList.size());
            }
        }
        config.setLastRequestTime(config.getNextSyncTime());
        appTaskService.updateSyncConfig(config,true);
        appTaskService.updateNames(requestTime);
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
