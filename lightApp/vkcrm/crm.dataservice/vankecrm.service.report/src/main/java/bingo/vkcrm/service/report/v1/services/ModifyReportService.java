package bingo.vkcrm.service.report.v1.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import bingo.vkcrm.service.model.DictionaryItem;
import bingo.vkcrm.service.service.BaseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.dao.Page;
import bingo.vkcrm.service.report.v1.model.CustomerModifyReport;
import bingo.vkcrm.service.report.v1.model.RelationChangereport;


@Service
public class ModifyReportService extends BaseService {

	/**
	 * 客户信息修改报表
	 * @param projectId
	 * @param gridId
	 * @param organizationId
	 * @param modifyField
	 * @param userName
	 * @param modifyDateBegin
	 * @param modifyDateEnd
	 * @param page
	 * @return
	 */
	public List<CustomerModifyReport> getCustomerModifyReport(String projectId,String gridId,String organizationId,String modifyField,
			String userName,Date modifyDateBegin,Date modifyDateEnd, String customerName,Page page){
		List<CustomerModifyReport> list = new ArrayList<CustomerModifyReport>();
		Map<String, Object> parameters = new HashMap<String, Object>();
		//项目id
		parameters.put("projectId", projectId);
		//网格id
		parameters.put("gridId", gridId);
		//管理中心id
		parameters.put("organizationId", organizationId);
		//修改字段
		parameters.put("modifyField", modifyField);
		//用户名
		parameters.put("userName", userName);
		//修改时间段起始
		parameters.put("modifyDateBegin", modifyDateBegin);	
		//修改时间段结束
		parameters.put("modifyDateEnd", modifyDateEnd);
		if(StringUtils.isNotEmpty(customerName)){
			parameters.put("customerName", customerName);
		}
		list = logRoDao.queryForListPage(CustomerModifyReport.class, page,"sql-customerModifyReport", null, parameters, true);
		return list;
	}
	
	public List<RelationChangereport> getRelationChangeReport(String projectId,String gridId,String organizationId,String changeType,
			String userName,Date modifyDateBegin,Date modifyDateEnd, Page page){
		List<RelationChangereport> list = new ArrayList<RelationChangereport>();
		Map<String, Object> parameters = new HashMap<String, Object>();
		//项目id
		parameters.put("projectId", projectId);
		//网格id
		parameters.put("gridId", gridId);
		//管理中心id
		parameters.put("organizationId", organizationId);
		//修改内容
		parameters.put("changeType", changeType);
		//用户名
		parameters.put("userName", userName);
		//修改时间段起始
		parameters.put("modifyDateBegin", modifyDateBegin);		
		//修改时间段结束
		parameters.put("modifyDateEnd", modifyDateEnd);
		list = logRoDao.queryForListPage(RelationChangereport.class, page,"sql-relationChangeReport", null, parameters, true);
		return list;
	}

	public List<DictionaryItem> getModifyItem(){
		return logRoDao.queryForList(DictionaryItem.class,"sql-modifyitem",null);
	}
}
