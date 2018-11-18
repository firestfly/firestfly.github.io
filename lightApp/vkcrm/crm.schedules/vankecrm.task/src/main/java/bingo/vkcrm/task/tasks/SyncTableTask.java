package bingo.vkcrm.task.tasks;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;

import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.utils.UUIDUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.appTask.TackTableResult;
import bingo.vkcrm.task.models.appTask.TaskCallBack4Table;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.services.AppTaskService;

/**
 * 
 * @ClassName: SyncTableTask   
 * @Description:Synchronous grid coding timing task clss
 * @author: 周强 
 * @date: 2016年3月17日 下午4:24:03   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */

@Controller
@RequestMapping("/syncgrid")
public class SyncTableTask extends AbstractQuartzTask{
    private static final String SUCCESS_CODE = "0";//调用助这儿接口返回成功的标示

    private static final String SYNC_CODE = "syncGridCodeTask";//写入同步日志表中的code;用于区别同步数据接口
    //用于获取app接口的所有任务
    
    //TODO 描述类的功能和大概的逻辑
    /**
     * 
     * @Description: Grid data synchronization,同步grid 表 code数据 定时任务，通过循环请求接口，调取一天数据
     * @param: @param jobExecutionContext
     * @param: @return boolean
     * @param: @throws Exception
     * @throws:Exception
     * @Author: 周强
     * @date: 2016年3月17日 下午4:26:49
     * @return:boolen 无实用意义 
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */

    
    @Override
    @RequestMapping(value="/dodast",method=RequestMethod.GET)
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");
        SyncConfig config=appTaskService.querySyncConfig(SYNC_CODE);
        Date configSyncTime= config.getNextSyncTime();
        log.debug("*****************同步<SyncTableTask任务>定时任务开始*****************");
        if (new Date().getTime() < configSyncTime.getTime()) {
        	 log.debug("*****************同步<SyncTableTask任务>定时任务返回*****************");
           return true;//如果还没到配置时间，则不开始同步，直接退出
        }
        Integer syncCycle=config.getRequestCycle();
         Date requestTime= config.getRequestTime();

        Integer pageSize=config.getPageSize();
         
        //Integer pageSize=2;
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
        long Lingdianlingfen=current/(1000*3600*24)*(1000*3600*24)- TimeZone.getDefault().getRawOffset();//今天零点零分零秒的毫秒数
        calendar.setTime(new Timestamp(Lingdianlingfen));
        String end=sdf.format(calendar.getTime());
        while(hasNextPage){//循环调用接口，每次批量获取数据，当接口 has_more返回 false的时候跳出循环
            List<TackTableResult> insertList=new ArrayList<TackTableResult>();
            List<TackTableResult> updateList=new ArrayList<TackTableResult>();
            TaskCallBack4Table taskListResult= appTaskService.queryAllTask4Table(curPage, pageSize,start,end,host);
            String code=taskListResult.getCode();
            if(SUCCESS_CODE.equals(code)){
                List<TackTableResult> taskList=taskListResult.getResult().getData(); //一次请求拿到的任务数据
                for (TackTableResult tasktable : taskList) {
                    String tdcode=tasktable.getCode();
                   // String projectCode=appTaskService.queryProjectcode4Tabletask(tdcode)!=null?appTaskService.queryProjectcode4Tabletask(tdcode):"";
                   // tasktable.setProject_code(projectCode);
                    if(appTaskService.existTabletd(tdcode)){ //校验数据在本地更新或是插入
                        updateList.add(tasktable);
                    }else{
                    	tasktable.setId(UUIDUtil.create());
                    	
                        insertList.add(tasktable);
                        tasktable.getId().length();
                    }
                }
                if("false".equals(taskListResult.getResult().getHas_more())) {//如果接口has_more返回false则跳出循环
                    hasNextPage = false;
                }else {
                    curPage++;
                }
                if(insertList.size()>0){
                    appTaskService.insertSyncTask4Tabletd(insertList);
                }
                if(updateList.size()>0){
                    appTaskService.updateSyncTask4Tabletd(updateList);
                }

            }
        }
        config.setLastRequestTime(config.getNextSyncTime());
        appTaskService.updateSyncConfig(config,true);
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
