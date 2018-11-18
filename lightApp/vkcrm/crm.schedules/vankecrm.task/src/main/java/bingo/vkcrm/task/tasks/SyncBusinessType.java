package bingo.vkcrm.task.tasks;

import bingo.common.core.ApplicationContext;
import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.common.utils.CacheUtil;
import bingo.vkcrm.task.common.AbstractQuartzTask;
import bingo.vkcrm.task.models.business.BusinessType;
import bingo.vkcrm.task.models.business.CallBackResult;
import bingo.vkcrm.task.models.business.Result;
import bingo.vkcrm.task.services.AppTaskService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.JobExecutionContext;

import java.util.List;

/**
 * Created by szsonic on 2015/12/14.
 */
public class SyncBusinessType extends AbstractQuartzTask {
    private static final Log log = LogFactory.getLog(SyncBusinessType.class);

    @Override
    public boolean doTask(JobExecutionContext jobExecutionContext) throws Exception {
        AppTaskService appTaskService = (AppTaskService) jobExecutionContext.getMergedJobDataMap().get("appTaskService");
        String host= ApplicationContext.getProperty("app.hostAndPort.test");
        CallBackResult callBackResult = appTaskService.queryBusinessType(host);
        log.debug(callBackResult);
        if ("0".equals(callBackResult.getCode())) {
            //代表调用成功
            Result result = callBackResult.getResult();
            if (result != null) {
                List<BusinessType> businessTypeList = result.getData();
                List<BusinessType> localList = appTaskService.queryBusinessType4Local();
                if (businessTypeList != null) {
                    for (BusinessType appType : businessTypeList) {
                        for (BusinessType localType : localList) {
                            String appCode = appType.getCode();
                            String localCode = localType.getCode();
                            if (appCode.equals(localCode)) {
                                //代表这个code在本地和APP都有，标记为共有
                                localType.setFlag(1);
                                appType.setFlag(1);
                                break;
                            }
                        }
                    }
                    //以APP返回的数据为准，如果flag=1，代表这两个集合中都有，则做更新操作


                    for (BusinessType businessType : businessTypeList) {
                        if ("0".equals(businessType.getParent_code())) {
                            //如果parentCode=0,则表示没有父级code，数据库中做null处理
                            businessType.setParent_code(null);
                        }
                        if (1 == businessType.getFlag()) {
                            //这个数据是需要更新的
                            appTaskService.updateBusinessType(businessType);
                        } else {
                            //否则这个数据是需要新增的
                            appTaskService.insertBusinessType(businessType);
                        }
                        CacheUtil.set(CachePrefix.BizType, businessType.getCode(), businessType.getName());
                        //无论是新增的，还是更新，都在缓存中设置一遍
                    }

                    //本地数据，如果为0，代表该数据已经被删除了
                    for (BusinessType businessType : localList) {
                        if (0 == businessType.getFlag()) {
                            appTaskService.deleteBusinessType(businessType);
                        }
                    }

                }
            }
        }

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
