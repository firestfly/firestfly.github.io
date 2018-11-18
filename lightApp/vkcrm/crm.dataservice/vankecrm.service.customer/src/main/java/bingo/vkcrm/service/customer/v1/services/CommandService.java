package bingo.vkcrm.service.customer.v1.services;

import bingo.dao.Page;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.CustomerInfo4Command;
import bingo.vkcrm.service.service.BaseService;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by szsonic on 2015/11/16.
 */
@Service
public class CommandService extends CustomerCommonService {
    public List<CustomerInfo4Command> queryCustomer(String customerId,String fullName, String mainMobile, String licenseNumber, String houseId, String buildingCode, String projectId, Page page) {
        Map<String, Object> params = new HashMap<String, Object>();
        if (projectId != null) {
            params.put("projectId", projectId);
        }
        if (fullName != null) {
            params.put("fullName", fullName);
        }
        if (mainMobile != null) {
            params.put("mainMobile", mainMobile);
        }
        if (licenseNumber != null) {
            params.put("licenseNumber", licenseNumber);
        }
        if (houseId != null) {
            params.put("houseId", houseId);
        }
        if (buildingCode != null) {
            params.put("buildingCode", buildingCode);
        }
        if(customerId!=null){
            params.put("customerId", customerId);
        }
        return centerRoDao.queryForListPage(CustomerInfo4Command.class, page, "service.query.customer.queryCustomer4Command", null, params, true);
    }
}
