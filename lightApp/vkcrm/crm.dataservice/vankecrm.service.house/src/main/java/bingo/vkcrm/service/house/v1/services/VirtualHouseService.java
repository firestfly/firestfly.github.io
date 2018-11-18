package bingo.vkcrm.service.house.v1.services;

import bingo.dao.Page;
import bingo.vkcrm.service.house.v1.models.*;
import bingo.vkcrm.service.service.BaseService;

import org.springframework.stereotype.Service;
import java.util.*;

/**
 * 虚拟房屋service
 */
@Service
public class VirtualHouseService extends BaseService {

    /**
     * 查询项目下的车位分组信息
     *
     * @param projectId 所属项目id
     * @return List<CarportGroup>
     */
    public List<VirtualHouse> getVirtualHouses(String beginTime,Page pager) {
        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("beginTime", beginTime);
        List<VirtualHouse> list = centerRoDao.queryForListPage(VirtualHouse.class, pager, "sql.query.virtualHouse", null, parameters, true);
        return list;
    }


}
