package bingo.vkcrm.task.services;

import bingo.vkcrm.service.model.*;
import bingo.vkcrm.service.service.BaseService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 日志服务
 */
@Service
public class LogService extends BaseService {
    /**
     * 保存异常日志
     *
     * @param exceptionLogs 异常日志集合
     * @return
     */
    public boolean saveExceptionLogs(List<ExceptionLog> exceptionLogs) {
        return logDao.batchInsert(ExceptionLog.class, exceptionLogs) != null;
    }

    /**
     * 保存服务请求日志
     *
     * @param restAccessLogs 服务请求日志集合
     * @return
     */
    public boolean saveAccessLogs(List<RestAccessLog> restAccessLogs) {
        return logDao.batchInsert(RestAccessLog.class, restAccessLogs) != null;
    }

    /**
     * 保存接口请求日志
     *
     * @param interfaceAccessLogs 接口请求日志集合
     * @return
     */
    public boolean saveInterfaceLogs(List<InterfaceAccessLog> interfaceAccessLogs){
        return logDao.batchInsert(InterfaceAccessLog.class, interfaceAccessLogs) != null;
    }

    /**
     * 保存数据修改日志
     *
     * @param dataChangeLogs 数据修改日志集合
     * @return
     */
    public boolean saveDataChangeLogs(List<DataChangeLog> dataChangeLogs) {
        return logDao.batchUpdate("sql.insert.dataChangelogs", dataChangeLogs).length >0;
    }

    /**
     * 保存数据修改详细日志
     *
     * @param dataChangeLogItems 数据修改详细日志集合
     * @return
     */
    public boolean saveDataChangeLogItems(List<Comparison> dataChangeLogItems) {
        return logDao.batchInsert(Comparison.class, dataChangeLogItems) != null;
    }

    /**
     * 保存数据修改日志
     *
     * @param dataChangeLogs     数据修改日志集合
     * @param dataChangeLogItems 数据修改详细日志集合
     * @return
     */
    public boolean saveDataChangeLog(List<DataChangeLog> dataChangeLogs, List<Comparison> dataChangeLogItems) {
        saveDataChangeLogs(dataChangeLogs);
        saveDataChangeLogItems(dataChangeLogItems);
        return true;
    }

    /**
     * 保存关联修改日志
     *
     * @param relationChangeLogs 关联修改日志
     * @return
     */
    public boolean saveRelationChangeLogs(List<RelationChangeLog> relationChangeLogs) {
        return logDao.batchUpdate("sql.insert.relationlogs",relationChangeLogs).length>0;
    }
}
