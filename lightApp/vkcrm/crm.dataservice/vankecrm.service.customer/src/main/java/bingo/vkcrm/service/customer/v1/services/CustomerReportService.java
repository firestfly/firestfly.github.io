package bingo.vkcrm.service.customer.v1.services;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bingo.dao.Page;
import bingo.vkcrm.service.customer.v1.CustomerCommonService;
import bingo.vkcrm.service.customer.v1.models.SpecialIdentity;
import bingo.vkcrm.service.customer.v1.models.report.*;
import java.util.List;

/**
 * 客户相关信息报表服务
 * @author chengsiyuan
 *
 */
@Service
public class CustomerReportService extends CustomerCommonService {
	@Autowired
	SpecialIdentityService specialIdentityService;
	/**
	 * 获取客户车辆信息报表
	 * @param carReportCondition
	 * @return
	 */
    public List<CarReport> queryCarsReport(CarReportCondition carReportCondition,Page pager){
    	List<CarReport> carReportList = null;
    	carReportList = centerRoDao.queryForListPage(CarReport.class, pager,
                "sql-query-cars-report", "", carReportCondition, true);
    	return carReportList;
    }
    
    /**
     * 获取客户宠物信息报表
     * @param petsReportCondition
     * @return
     */
    public List<PetsReport> queryPetsReport(PetsReportCondition petsReportCondition,Page pager){
    	List<PetsReport> PetsReportList = null;
    	PetsReportList = centerRoDao.queryForListPage(PetsReport.class, pager,
                "sql-query-pets-report", "", petsReportCondition, true);
    	return PetsReportList;
    }
    
    /**
     * 获取客户信息报表
     * @param customerReportCondition
     * @return
     */
    public List<CustomerReport> queryCusReport(CustomerReportCondition customerReportCondition,Page pager){
    	List<CustomerReport> customerReportList = null;
    	customerReportList = centerRoDao.queryForListPage(CustomerReport.class, pager,
                "sql-query-customer-report", "", customerReportCondition, true);
    	//遍历获取客户特殊身份
    	for (CustomerReport customerReport : customerReportList) {
			if(StringUtils.isNotBlank(customerReport.getId())){
				List<SpecialIdentity> specialIdentities = specialIdentityService.queryAll(customerReport.getId());
				customerReport.setSpecialIdentities(specialIdentities);
			}
		}
    	return customerReportList;
    }

    
}
