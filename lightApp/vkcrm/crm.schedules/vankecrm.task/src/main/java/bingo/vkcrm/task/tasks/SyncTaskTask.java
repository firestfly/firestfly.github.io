package bingo.vkcrm.task.tasks;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.service.utils.EmojiUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.appTask.*;
import bingo.vkcrm.task.services.AppTaskService;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by szsonic on 2015/11/27.
 */
public class SyncTaskTask extends AbstractQuartzTask {
    private static final Log log = LogFactory.getLog(SyncTaskTask.class);
    private static final String successCode = "0";//调用助这儿接口返回成功的标示
    private static final int pageSize = 30;//每次调用接口请求的任务数量，最大不能超过30（住这儿接口限制）

    //用于获取app接口的所有任务
    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");
        int curPage = 1;
        boolean hasNextPage = true;
        while (hasNextPage) {
            TaskListCallback taskListCallback = appTaskService.queryAllTasks(curPage, pageSize);
            String code = taskListCallback.getCode();
            if (successCode.equals(code)) {
                List<SyncTaskRecords> taskList = taskListCallback.getResult().getTasks();
                if (taskList.size() < pageSize) {
                    hasNextPage = false;//如果返回条数小于请求条数，则不再调用接口
                } else {
                    curPage++;
                }
                for (SyncTaskRecords syncTaskRecords : taskList) {
                    appTaskService.insertSyncTask(syncTaskRecords);
                }
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
