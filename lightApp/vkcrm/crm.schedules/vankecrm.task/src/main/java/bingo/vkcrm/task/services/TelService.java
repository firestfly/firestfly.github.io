package bingo.vkcrm.task.services;

import bingo.vkcrm.service.model.ExceptionLog;
import bingo.vkcrm.service.service.BaseService;
import bingo.vkcrm.task.models.tel.SetStatus;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 话务相关服务
 */
@Service
public class TelService extends BaseService{
    /**
     * 保存坐席信息集合
     *
     * @param setStatuses 坐席状态信息集合
     * @return
     */
    public boolean saveSetStatuses(List<SetStatus> setStatuses) {
        return bizDao.batchInsert(ExceptionLog.class, setStatuses) != null;
    }
}
