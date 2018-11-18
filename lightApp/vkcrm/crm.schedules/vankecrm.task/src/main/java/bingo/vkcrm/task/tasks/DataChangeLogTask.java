package bingo.vkcrm.task.tasks;

import bingo.common.core.ApplicationContext;
import bingo.dao.Dao;
import bingo.vkcrm.service.model.Comparison;
import bingo.vkcrm.service.model.DataChangeLog;
import bingo.vkcrm.common.utils.JedisUtil;
import bingo.vkcrm.common.utils.JsonUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.services.LogService;
import bingo.vkcrm.task.services.OrganizationService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 数据修改日志定时任务
 */
public class DataChangeLogTask extends AbstractQuartzTask {

    private static final String REDIS_DATA_CHANGE_LOG_KEY = ApplicationContext.getProperty("log.data.change.log.key", "DataChangeLog");
    private static final String LOG_READ_COUNT = ApplicationContext.getProperty("log.read.count", "50");

    private static final Log log = LogFactory.getLog(ExceptionLogTask.class);

    public DataChangeLogTask() {
        taskName = "数据修改日志定时任务";
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
        long logCount = JedisUtil.defaultDb().llen(REDIS_DATA_CHANGE_LOG_KEY);
        //从上下文中取出服务类实例
        LogService logService = (LogService) jobExecutionContext.getMergedJobDataMap().get("logService");
        OrganizationService organizationService = (OrganizationService) jobExecutionContext.getMergedJobDataMap().get("organizationService");
        List<DataChangeLog> dataChangeLogs = new ArrayList<DataChangeLog>();
        List<Comparison> dataChangeLogItems = new ArrayList<Comparison>();
        if (logCount > 0) {
            if (StringUtils.isNumeric(LOG_READ_COUNT)) {
                int logRedCount = Integer.parseInt(LOG_READ_COUNT);
                log.info("循环查询出：" + logCount + "条数据，持久化到数据库中.");
                //循环取出数据
                while (logRedCount > 0 &&logCount > 0) {
                    //从队列的尾部开始取出数据，并且删除
                    String logInfo = JedisUtil.defaultDb().rpop(REDIS_DATA_CHANGE_LOG_KEY);
                    if (StringUtils.isNotEmpty(logInfo)) {
                        String uuid = Dao.getUUID();
                        DataChangeLog dataChangeLog=  JsonUtil.fromJson(logInfo,DataChangeLog.class);
                        if (dataChangeLog == null) {
                            break;
                        }
                        dataChangeLog.setId(uuid);
                        if (StringUtils.isNotEmpty(dataChangeLog.getBuildingId())) {
                            Map<String, Object> organizationInfo = organizationService.queryOrganization(dataChangeLog.getBuildingId());
                            if (organizationInfo != null) {
                                dataChangeLog.setGridId(organizationInfo.get("GridId")!=null?organizationInfo.get("GridId").toString():null);
                                dataChangeLog.setGridName(organizationInfo.get("GridName")!=null?organizationInfo.get("GridName").toString():null);
                                dataChangeLog.setProjectId(organizationInfo.get("ProjectId")!=null?organizationInfo.get("ProjectId").toString():null);
                                dataChangeLog.setProjectName(organizationInfo.get("ProjectName")!=null?organizationInfo.get("ProjectName").toString():null);
                                dataChangeLog.setOrganizationId(organizationInfo.get("OrganizationId")!=null?organizationInfo.get("OrganizationId").toString():null);
                                dataChangeLog.setOrganizationName(organizationInfo.get("OrganizationName")!=null?organizationInfo.get("OrganizationName").toString():null);
                            }
                        }
                        dataChangeLogs.add(dataChangeLog);
                        List<Comparison> comparisonList = dataChangeLog.getComparisonList();
                        for (Comparison comparison : comparisonList) {
                            comparison.setId(uuid);
                            Object afterObj=comparison.getAfter();
                            Object beforeObj=comparison.getBefore();
                            String after=null;
                            String before=null;
                            if(afterObj!=null){
                                after=afterObj.toString();
                            }
                            if(beforeObj!=null){
                                before=beforeObj.toString();
                            }
                            if(afterObj==null&&beforeObj==null){
                                continue;
                            }
                            if(StringUtils.isEmpty(after)&&StringUtils.isEmpty(before)){
                                continue;//如果修改前的数据和修改后的数据都是空字符串或者null，则不插入数据库中
                            }
                            dataChangeLogItems.add(comparison);
                        }
                    }
                    logRedCount--;
                    logCount--;
                }
                logService.saveDataChangeLog(dataChangeLogs, dataChangeLogItems);
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
        long logCount = JedisUtil.defaultDb().llen(REDIS_DATA_CHANGE_LOG_KEY);
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
        return false;
    }
}
