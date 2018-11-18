package bingo.vkcrm.task.tasks;

import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.appTask.TaskRecordCallback;
import bingo.vkcrm.task.models.appTask.TaskRecords;
import bingo.vkcrm.task.services.AppTaskService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by szsonic on 2015/11/27.
 */
public class CreateAppTaskTask extends AbstractQuartzTask {
    private static final Log log = LogFactory.getLog(CreateAppTaskTask.class);


    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");
        //1.获取任务表中，任务状态是发布(status=2)（草稿无需同步），并且isSync=0的数据（代表需要同步）
        List<TaskRecords> taskRecordsList=appTaskService.getFailedTask();//获取需要发送的任务列表
        for (TaskRecords taskRecords : taskRecordsList) {
            TaskRecordCallback callback=appTaskService.addTaskRecord(taskRecords);
            if("0".equals(callback.getCode())){
                String taskNo=callback.getResult().getTask_no();
                //如果调用成功，获取app返回的任务流水号
                appTaskService.updateTaskInfo(taskRecords.getId(),taskNo);
                //把任务表中设置该任务的流水号和同步时间，且状态设置为无需同步
                log.info("调用接口返回成功！任务ID："+taskRecords.getId()+",taskNo:"+taskNo);
                //输出日志信息
            }else{
                log.info("接口调用失败！错误编码：" + callback.getCode() + ",错误信息：" + callback.getError());
            }
        }
        return false;
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
