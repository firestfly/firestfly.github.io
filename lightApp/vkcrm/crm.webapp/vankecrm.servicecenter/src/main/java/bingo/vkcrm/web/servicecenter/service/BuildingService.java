package bingo.vkcrm.web.servicecenter.service;

import java.util.HashMap;
import java.util.Map;

import bingo.vkcrm.service.enums.BuildingTypes;
import bingo.vkcrm.service.service.BaseService;
import org.springframework.stereotype.Service;


@Service
public class BuildingService extends BaseService {

    /**
     * 获取房屋所属项目以及物业公司
     *
     * @param houseId 房屋ID
     */
    public Map<String, Object> getHouseProjectCompany(String houseId) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("houseId", houseId);
        return centerRoDao.queryForMap("sql.query.house.project.company", map);
    }

    /**
     * 获取建筑所属项目以及物业公司
     *
     * @param buildingId
     */
    public Map<String, Object> getProjectCompany(String buildingId, String buildingType) {
        Map<String, Object> map = new HashMap<String, Object>();
        if (BuildingTypes.House.getValue().equals(buildingType)) {
            map.put("houseId", buildingId);
            return centerRoDao.queryForMap("sql.query.house.project.company", map);
        } else if (BuildingTypes.Carport.getValue().equals(buildingType)) {
            map.put("carportId", buildingId);
            return centerRoDao.queryForMap("sql.query.carport.project.company", map);
        }
        return null;
    }


}