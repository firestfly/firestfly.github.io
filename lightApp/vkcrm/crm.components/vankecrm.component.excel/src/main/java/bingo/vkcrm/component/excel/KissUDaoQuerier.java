package bingo.vkcrm.component.excel;

import bingo.dao.Dao;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;

/**
 * Created by Wangzr on 16/3/4.
 */
public class KissUDaoQuerier implements IDataQuerier {
    public KissUDaoQuerier() {
    }

    public List<Map<String, Object>> queryPage(String daoName, String sqlId, int start, int end, String sortExpress, Map<String, Object> queryParams) {
        return Dao.get(daoName).queryForListMapPage(sqlId, start, end, sortExpress, queryParams, true);
    }

    public Map<String, Object> querySum(String daoName, String sumSqlId, Map<String, Object> queryParams) {
        return Dao.get(daoName).queryForMap(sumSqlId, queryParams);
    }

    public int queryTotal(String daoName, String countSqlId, String sqlId, Map<String, Object> queryParams) {
        return StringUtils.isEmpty(countSqlId)?Dao.get(daoName).queryForPageCount(sqlId, queryParams):Dao.get(daoName).queryForInt(countSqlId, queryParams);
    }

    public List<Map<String, Object>> queryAll(String daoName, String sqlId, Map<String, Object> queryParams) {
        return Dao.get(daoName).queryForListMap(sqlId, queryParams);
    }
}
