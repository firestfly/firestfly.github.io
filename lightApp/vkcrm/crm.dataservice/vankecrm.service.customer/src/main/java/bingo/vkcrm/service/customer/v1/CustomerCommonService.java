package bingo.vkcrm.service.customer.v1;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import bingo.vkcrm.service.service.BaseService;

import java.util.HashMap;
import java.util.Map;

/**
 * 客服中心公用服务
 * Created by 邱楚生 手机号码:15916451862,13560392970 QQ:65509713 on 15/11/24.
 */
@Service
public class CustomerCommonService extends BaseService {

    /**
     * 根据房屋Code查询房屋ID
     * @param houseCode 房屋编码
     * @return 房屋ID
     */
    @Cacheable(value = "House", key = "'HouseId_'.concat(#houseCode)")
    public String getHouseIdByCode(String houseCode) {
        Map<String,String> map=new HashMap<String, String>();
        map.put("houseCode",houseCode);
        return centerRoDao.queryForString("customer.commom.getHouseIdByCode", map);
    }

    /**
     * 根据车位Code查询车位ID
     * @param carportCode 车位编码
     * @return 车位ID
     */
    @Cacheable(value = "Carport", key = "'CarportId_'.concat(#carportCode)")
    public String getCarportIdByCode(String carportCode) {
        Map<String,String> map=new HashMap<String, String>();
        map.put("carportCode",carportCode);
        return centerRoDao.queryForString("customer.commom.getCarportIdByCode", map);
    }
    
    /**
     * 根据项目Code查询项目ID
     * @param projectCode 车位编码
     * @return 项目ID
     */
    @Cacheable(value = "Project", key = "'ProjectId_'.concat(#projectCode)")
    public String getProjectIdByCode(String projectCode) {
        Map<String,String> map=new HashMap<String, String>();
        map.put("projectCode",projectCode);
        return centerRoDao.queryForString("customer.commom.getProjectIdByCode", map);
    }
	
	
	
}
