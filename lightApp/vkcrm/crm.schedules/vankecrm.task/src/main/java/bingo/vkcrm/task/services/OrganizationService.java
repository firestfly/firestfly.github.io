package bingo.vkcrm.task.services;

import bingo.dao.IDao;
import bingo.vkcrm.service.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 组织架构服务
 */
@Service
public class OrganizationService extends BaseService {
    @Autowired
    IDao centerDao;

    /**
     * 获取组织架构信息
     *
     * @param houseId 房屋编码
     * @return
     */
    public Map<String, Object> queryOrganization(String houseId) {
        Map<String,Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("HouseId",houseId);
        return centerDao.queryForMap("sql.select.organization", paramsMap);
    }
}
