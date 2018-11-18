package bingo.vkcrm.task.tasks;

import bingo.common.core.ApplicationContext;
import bingo.dao.Dao;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.tel.SetStatus;
import bingo.vkcrm.task.services.TelService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.util.ArrayList;
import java.util.List;

/**
 * 坐席状态信息同步任务
 */
public class SyncSetStatusTask extends AbstractQuartzTask {
    private static final String SET_INFO_KEY = ApplicationContext.getProperty("Profile.setinfo.key","SET_INFO");
    private static final String LOG_READ_COUNT = ApplicationContext.getProperty("log.read.count", "50");
    private static final String AGENT_DB = "redis.agent.db";

    private static final Log log = LogFactory.getLog(RestAccessLogTask.class);

    public SyncSetStatusTask() {
        taskName = "坐席状态信息同步任务";
    }

    /**
     * 执行调度任务
     *
     * @param jobExecutionContext
     * @return
     * @throws Exception
     */
    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        long logCount = JedisUtil.defaultDb().llen(SET_INFO_KEY);
        //从上下文中取出服务类实例
        TelService telService = (TelService) jobExecutionContext.getMergedJobDataMap().get("telService");
        List<SetStatus> setStatuses = new ArrayList<SetStatus>();
        if (logCount > 0) {
            if (StringUtils.isNumeric(LOG_READ_COUNT)) {
                int logRedCount = Integer.parseInt(LOG_READ_COUNT);
                log.info("循环查询出：" + logCount + "条数据，持久化到数据库中.");
                //循环取出数据
                while (logRedCount > 0) {
                    //从队列的尾部开始取出数据，并且删除
                    byte[] logInfo = JedisUtil.switchDb(AGENT_DB).rpop(SET_INFO_KEY.getBytes("UTF-8"));
                    if (logInfo != null) {
                        log.debug("日志信息：" + new String(logInfo, "UTF-8"));
                        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
                        SetStatus setStatus = gson.fromJson(new String(logInfo, "UTF-8"), SetStatus.class);
                        if (setStatus == null) {
                            break;
                        }
                        setStatuses.add(setStatus);
                    }
                    logRedCount--;
                }
                telService.saveSetStatuses(setStatuses);
            } else {

                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * 执行调度前的处理
     *
     * @param jobExecutionContext
     * @return
     * @throws Exception
     */
    @Override
    public boolean onBefore(JobExecutionContext jobExecutionContext) throws Exception {
        long logCount = JedisUtil.defaultDb().llen(SET_INFO_KEY);
        if (logCount > 0) {
            log.info("从Redis中读取到" + taskName + "数据条数：" + logCount + "，开始执行任务.");
            return true;
        } else {
            log.info("从Redis中读取不到" + taskName + "数据，" + "停止执行任务.");
            return false;
        }
    }

    /**
     * 错误处理
     *
     * @param jobExecutionContext
     * @param fromMethod
     * @param exception
     */
    @Override
    public void onException(JobExecutionContext jobExecutionContext, String fromMethod, Exception exception) {
        log.error(exception.getMessage());
    }

    /**
     * 执行调度后的处理
     *
     * @param jobExecutionContext
     * @return
     * @throws Exception
     */
    @Override
    public boolean onAfter(JobExecutionContext jobExecutionContext) throws Exception {
        return true;
    }
}
