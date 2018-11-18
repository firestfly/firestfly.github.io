package bingo.vkcrm.task.tasks;

import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.response.*;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.services.AppTaskService;
import org.quartz.JobExecutionContext;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class SyncGridTask extends AbstractQuartzTask {
    /**
     * 调用助这儿接口返回成功的标示
     */
    private static final String SUCCESS_CODE = "0";
    /**
     * 写入同步日志表中的code;用于区别同步数据接口
     */
    private static final String SYNC_CODE = "syncGridTask";

    /**
     *
     * @param jobExecutionContext
     * @return
     * @throws Exception
     */
    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");

        SyncConfig config = appTaskService.querySyncConfig(SYNC_CODE);
        Date syncTime = config.getNextSyncTime();

        if (new Date().getTime() < syncTime.getTime()) {
            // 如果还没到配置时间，则不开始同步，直接退出
            log.info("[网格同步]未到同步时间");
            return true;
        }

        Date requestTime = config.getRequestTime();

        Integer pageSize = config.getPageSize();

        int curPage = 1;
        boolean hasNextPage = true;

        // 当前时间毫秒数
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(requestTime);
        long updated = calendar.getTimeInMillis() / 1000;


        // 循环调用接口，每次批量获取数据，当接口 has_more返回 false的时候跳出循环
        while (hasNextPage) {

            GridResponse result = appTaskService.getGridResponse(curPage, pageSize, updated);
            String code = result.getCode();

            if (SUCCESS_CODE.equals(code)) {
                GridResult data = result.getResult();

                log.debug("正在同步:" + data.getPage() + " / " + data.getTotal_page());

                // 先把同步结果放到同步表中
                List<GridData> lstGridHouses = data.getData();
                appTaskService.addSyncResult(GridData.class, lstGridHouses);

                // 如果接口has_more返回false则跳出循环
                if (!data.getHas_more()) {
                    hasNextPage = false;
                } else {
                    curPage++;
                }

            }
        }

        config.setLastRequestTime(syncTime);
        appTaskService.updateSyncConfig(config, true);

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