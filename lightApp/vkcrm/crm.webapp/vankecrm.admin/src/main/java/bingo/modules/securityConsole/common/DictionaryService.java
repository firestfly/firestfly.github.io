package bingo.modules.securityConsole.common;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.common.BaseService;

/**
 * Created by 邱楚生 on 2015/9/17.
 * 通用服务累，多模块公用服务
 */
@Service
public class DictionaryService extends BaseService {

    /**
     * 获取字典表数据
     * @param dictionaryCode 数据字典code dim_dictionary.code
     * @return 数据字典项列表
     */
    public List<DictionaryItem> queryCallcenterItems(String dictionaryCode){
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("dictionaryCode", dictionaryCode);
        List<DictionaryItem> items = serviceCenterRnDao.queryForList(DictionaryItem.class, "sql.query.dictionary", parameters);
        return items;
    }

}
