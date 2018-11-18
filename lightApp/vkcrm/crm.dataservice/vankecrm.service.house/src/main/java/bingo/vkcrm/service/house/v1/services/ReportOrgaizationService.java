package bingo.vkcrm.service.house.v1.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.vkcrm.service.house.v1.models.OrganizationList;
import bingo.vkcrm.service.service.BaseService;

@Service
public class ReportOrgaizationService extends BaseService{

	public List<OrganizationList> getProjects(String organizationId){
		List<OrganizationList> list = new ArrayList<OrganizationList>();
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("organizationId", organizationId);
		list = centerDao.queryForList(OrganizationList.class, "sql.projects", parameters);
		return list;
	}
	public List<OrganizationList> getGirds(String projectId){
		List<OrganizationList> list = new ArrayList<OrganizationList>();
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("projectId", projectId);
		list = centerDao.queryForList(OrganizationList.class, "sql.girds", parameters);
		return list;
	}
	public List<OrganizationList> getOrganizations(){
		List<OrganizationList> list = new ArrayList<OrganizationList>();
		list = centerDao.queryForList(OrganizationList.class, "sql.organizations", null);
		return list;
	}
}
