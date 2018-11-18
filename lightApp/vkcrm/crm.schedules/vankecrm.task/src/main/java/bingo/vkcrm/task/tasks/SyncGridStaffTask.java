package bingo.vkcrm.task.tasks;

import java.util.Date;
import java.util.List;

import bingo.vkcrm.task.models.response.*;
import org.quartz.JobExecutionContext;

import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.sync.SyncConfig;
import bingo.vkcrm.task.services.AppTaskService;

public class SyncGridStaffTask extends AbstractQuartzTask {
    /**
     * 调用助这儿接口返回成功的标示
     */
    private static final String SUCCESS_CODE = "0";
    /**
     * 写入同步日志表中的code;用于区别同步数据接口
     */
    private static final String SYNC_CODE = "syncGridStaffTask";


    @Override
    /**
     * 网格-管家定时更新
     * @Description:
     * @param: @param jobExecutionContext
     * @param: @return
     * @param: @throws Exception
     * @throws:
     *
     *
     * @Author: huangsx
     * @date: 2016年3月26日 下午2:14:49
     * @return:{返回参数名}{返回参数说明}  
     *
     * @exception:TODO
     * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
     */
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");

        SyncConfig config = appTaskService.querySyncConfig(SYNC_CODE);
        Date configSyncTime = config.getNextSyncTime();

        if (new Date().getTime() < configSyncTime.getTime()) {
            // 如果还没到配置时间，则不开始同步，直接退出
            return true;
        }

        Date requestTime = config.getRequestTime();
        Integer pageSize = config.getPageSize();

        int curPage = 1;
        boolean hasNextPage = true;

        // 循环调用接口，每次批量获取数据，当接口 has_more返回 false的时候跳出循环
        while (hasNextPage) {

            GridStaffResponse result = appTaskService.getGridStaffResponse(curPage, pageSize);
            String code = result.getCode();

            if (SUCCESS_CODE.equals(code)) {

                GridStaffResult data = result.getResult();

                log.debug("正在同步:" + data.getPage() + " / " + data.getTotal_page());

                // 先把同步结果放到同步表中
                List<GridStaffData> lstGridStaff = data.getData();
                appTaskService.addSyncResult(GridStaffData.class, lstGridStaff);

                // 如果接口has_more返回false则跳出循环
                if ("false".equals(data.getHas_more())) {
                    hasNextPage = false;
                } else {
                    curPage++;
                }
            }
        }

        config.setLastRequestTime(config.getNextSyncTime());
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