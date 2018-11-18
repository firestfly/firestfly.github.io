package bingo.vkcrm.task.tasks;

import org.quartz.JobExecutionContext;

import bingo.vkcrm.task.common.AbstractQuartzTask;

public class CreatRortForBaseInfo extends AbstractQuartzTask{
    private static final String SUCCESS_CODE = "0";//调用助这儿接口返回成功的标示
    private static final String SYNC_CODE = "creatRepotBase";//写入同步日志表中的code;用于区别同步数据接口
	@Override
	public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
//        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");
//        SyncConfig config=appTaskService.querySyncConfig(SYNC_CODE);
//        Date configSyncTime= config.getNextSyncTime();
//        log.debug("*****************同步<CreatRortForBaseInfo任务>定时任务开始*****************");
//        if (new Date().getTime() < configSyncTime.getTime()) {
//            log.debug("[同步CreatRortForBaseInfo任务]-开始本次同步开始时间为："+configSyncTime+"，未到时间10秒后再试");
//            log.debug("*****************同步<CreatRortForBaseInfo任务>定时任务结束*****************");
//            return true;//如果还没到配置时间，则不开始同步，直接退出
//        }
//        Integer syncCycle=config.getRequestCycle();
//        Date requestTime= config.getRequestTime();
//
//        Integer pageSize=config.getPageSize();
//        Integer env=config.getSyncEnv();
//        appTaskService.callBaseReport_pro();
//		// TODO Auto-generated method stub
//        config.setLastRequestTime(config.getNextSyncTime());
//        appTaskService.updateSyncConfig(config,true);
//        appTaskService.updateNames(requestTime);
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


