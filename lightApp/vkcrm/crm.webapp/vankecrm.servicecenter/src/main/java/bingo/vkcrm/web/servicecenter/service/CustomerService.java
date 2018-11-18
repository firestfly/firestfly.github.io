package bingo.vkcrm.web.servicecenter.service;

import java.util.List;
import java.util.Map;

import bingo.vkcrm.service.service.BaseService;

import org.springframework.stereotype.Service;

import bingo.common.core.ApplicationFactory;
import bingo.dao.Page;
import bingo.vkcrm.web.servicecenter.model.ExcelImportLog;

/**
 * Created by 程思远 on 2015/8/25.
 * 查询用户详细信息
 */
@Service
public class CustomerService extends BaseService {

    /**
     * 插入Excel导入日志信息
     *
     * @param excelImportLog
     */
    public void saveExcelImportLog(ExcelImportLog excelImportLog) {
        centerDao.insert(excelImportLog);
    }

    /**
     * 查询Excel导入日志信息列表
     *
     * @param queryMap
     * @param pager
     * @return
     */
    public List<ExcelImportLog> queryNotPayCustomerImportLog(Map<String, Object> queryMap, Page pager) {
        return centerRoDao.queryForListPage(ExcelImportLog.class, pager, "sql.customer.query.notPayCustomer.importLog", null, queryMap, true);
    }


    /**
     * 查询Excel导入日志信息
     *
     * @param queryMap
     * @return
     */
    public ExcelImportLog queryNotPayCustomerImportLog(Map<String, Object> queryMap) {
        return centerRoDao.queryForObject(ExcelImportLog.class, "sql.customer.query.notPayCustomer.importLog", queryMap);
    }



}
