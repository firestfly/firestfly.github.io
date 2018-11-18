package bingo.modules.securityConsole.project;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.core.utils.DateUtils;
import bingo.modules.securityConsole.log.SecLogService;
import bingo.security.SecurityContext;

@Service
public class ProjectService extends BaseService {
	private SecLogService secLogService;

	/**
	 * @return the secLogService
	 */
	public SecLogService getSecLogService() {
		return secLogService;
	}

	/**
	 * @param secLogService the secLogService to set
	 */
	public void setSecLogService(SecLogService secLogService) {
		this.secLogService = secLogService;
	}


	/**
	 * 返回已选组织信息
	 * @param roleId
	 * @param entity
	 * @return
	 */
	public List<Map<String, Object>> getSelectedOperationDataRulePrivilegeList(String roleId,String entity) {
		return serviceCenterRnDao.getJdbcDao().queryForListMap("project.function.selectedRoleRuleList.org", roleId);
	}
	
	/**
	 * 通过项目名称查询项目信息
	 * @param projectName
	 * @return
	 */
	public List<Map<String, Object>> queryProject(String projectName) {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("PROJECT_NAME", projectName);		
		return serviceCenterRnDao.queryForListMap("project.function.queryProject", queryMap);
	}
	
	/**
	 * 通过项目名称查询项目信息
	 * @param projectName
	 * @return
	 */
	public List<Map<String, Object>> querySelectedProject(String userId) {
		return serviceCenterRnDao.getJdbcDao().queryForListMap("project.function.querySelectedProject", userId);
	}
	
	/**
	 * 根据勾选组织获取组织下的所有项目信息
	 * @param organizationId
	 * @return
	 */
	public List<Map<String, Object>> querySelectedOrgProject(String organizationId){
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("ORGANIZATION_IDS", "'"+organizationId+"'");
		List<Map<String, Object>> projects = serviceCenterRnDao.queryForListMap("project.function.queryProjectResust", queryMap);
		return projects;
	}
	
	

	/**
	 * 保存组织和项目的权限
	 * @param organizationList 选择组织列表
	 * @param projectList 选择项目列表
	 * @param userId 用户ID
	 */
	public void savePrivilege(String[] projectList, String userId) {
		
		// 把项目信息转换成对象
		List<Project> projects = new ArrayList<Project>();		
		for(String projectStr : projectList){
			System.out.println(projectStr);
			String[] projectArr = projectStr.split(":");
			if(StringUtils.isNotEmpty(projectArr[0])){
				Project project = new Project();
				project.setId(projectArr[0]);
				if(projectArr.length>1 && StringUtils.isNotEmpty(projectArr[1]) && !projectArr[1].toUpperCase().equals("NULL")){
					project.setStartTime(DateUtils.toDate(projectArr[1]));
				}
				if(projectArr.length>2 && StringUtils.isNotEmpty(projectArr[2]) && !projectArr[2].toUpperCase().equals("NULL")){
					project.setEndTime(DateUtils.toDate(projectArr[2]));
				}
				projects.add(project);
			}
		}
		
		// 获取当前项目授权列表
		List<MidOrganizationUser> midOrganizationUsers = 
				serviceCenterDao.getJdbcDao().queryForList(MidOrganizationUser.class, "project.function.querySelectedOrganization", userId);
		List<Project> newProjectList = new ArrayList<Project>();
		for(MidOrganizationUser midOrganizationUser : midOrganizationUsers){
			midOrganizationUser.setIsdeleted("1");
		}
		// 将被删除的授权改成可用，没有修改的保持不变
		for(Project project : projects){
			boolean isProjectExist = false;
			for(MidOrganizationUser midOrganizationUser : midOrganizationUsers){
				if(midOrganizationUser.getOrganizationId().equals(project.getId())){
					System.out.println(project.getId()+" : "+midOrganizationUser.getOrganizationId());
					midOrganizationUser.setIsdeleted("0");
					midOrganizationUser.setDeletebyUserid("");
					midOrganizationUser.setDeletebyUser("");
					midOrganizationUser.setDeletetime(null);
					isProjectExist = true;
					boolean isTimeEquals = true;
					if(!dateEquals(project.getStartTime(),midOrganizationUser.getStartTime())){
						isTimeEquals = false;
					}
					if(!dateEquals(project.getEndTime(),midOrganizationUser.getEndTime())){
						isTimeEquals = false;
					}
					if(!isTimeEquals){
						midOrganizationUser.setStartTime(project.getStartTime());
						midOrganizationUser.setEndTime(project.getEndTime());
					}
				}
			}
			if(!isProjectExist){
				newProjectList.add(project);
			}
		}
		// 删除授权
		for(MidOrganizationUser midOrganizationUser : midOrganizationUsers){
			if(midOrganizationUser.getIsdeleted().equals("1") && StringUtils.isEmpty(midOrganizationUser.getDeletebyUserid())){
				midOrganizationUser.setDeletebyUserid(SecurityContext.getCurrentUser().getId());
				midOrganizationUser.setDeletebyUser(SecurityContext.getCurrentUser().getName());
				midOrganizationUser.setDeletetime(new Date());
			}
		}
		
		// 添加新的权限数据
		List<MidOrganizationUser> newMidOrganizationUsers = new ArrayList<MidOrganizationUser>();
		for(Project project : newProjectList){
				MidOrganizationUser midOrganizationUser = new MidOrganizationUser();
				midOrganizationUser.setUserId(userId);
				midOrganizationUser.setOrganizationId(project.getId());
				midOrganizationUser.setStartTime(project.getStartTime());
				midOrganizationUser.setEndTime(project.getEndTime());
				midOrganizationUser.setCreatorid(SecurityContext.getCurrentUser().getId());
				midOrganizationUser.setCreator(SecurityContext.getCurrentUser().getName());
				midOrganizationUser.setCreatetime(new Date());
				midOrganizationUser.setIsdeleted("0");
				newMidOrganizationUsers.add(midOrganizationUser);
		}

		serviceCenterDao.batchUpdate(MidOrganizationUser.class, midOrganizationUsers);
		serviceCenterDao.batchInsert(MidOrganizationUser.class, newMidOrganizationUsers);

		
		//==================添加组织树权限===================================		
		List<Map<String, Object>> parents = serviceCenterDao.getJdbcDao().queryForListMap("project.function.queryProjectParents",userId,userId,userId,userId);
		List<MidOrganizationUser> parentsEditList = new ArrayList<MidOrganizationUser>();
		List<MidOrganizationUser> parentsNewList = new ArrayList<MidOrganizationUser>();
		List<String> newParentsList = new ArrayList<String>();
		
		// 将被删除的授权改成可用，没有修改的保持不变
		if(null != parents){
			for(Map<String, Object> parent : parents){
				if(null != parent.get("PARENT_ID")){
					boolean isParentExist = false;
					for(MidOrganizationUser midOrganizationUser : midOrganizationUsers){
						if(midOrganizationUser.getOrganizationId().equals(parent.get("PARENT_ID"))){
							midOrganizationUser.setIsdeleted("0");
							midOrganizationUser.setDeletebyUserid("");
							midOrganizationUser.setDeletebyUser("");
							midOrganizationUser.setDeletetime(null);
							parentsEditList.add(midOrganizationUser);
							isParentExist = true;
							break;
						}
					}
					if(!isParentExist){
						newParentsList.add(parent.get("PARENT_ID").toString());
					}
				
				}
			}
			
			// 设置新的组织权限
			for(String newParent : newParentsList){
				if(StringUtils.isNotEmpty(newParent)){
					MidOrganizationUser midOrganizationUser = new MidOrganizationUser();
					midOrganizationUser.setUserId(userId);
					midOrganizationUser.setOrganizationId(newParent);
					midOrganizationUser.setStartTime(null);
					midOrganizationUser.setEndTime(null);
					midOrganizationUser.setCreatorid(SecurityContext.getCurrentUser().getId());
					midOrganizationUser.setCreator(SecurityContext.getCurrentUser().getName());
					midOrganizationUser.setCreatetime(new Date());
					midOrganizationUser.setIsdeleted("0");
					parentsNewList.add(midOrganizationUser);
				}
			}
			
			serviceCenterDao.batchUpdate(MidOrganizationUser.class, parentsEditList);
			serviceCenterDao.batchInsert(MidOrganizationUser.class, parentsNewList);
			
		}
	}
	
	/**
	 * 将字符串数组拼接成in字符串
	 * @param strArray
	 * @return
	 */
	public String joinString(String[] strArray){
		if(null == strArray || strArray.length < 1){
			return "''";
		}
		String result = "''";
		for(String str : strArray){
			result += ",'"+str+"'";
		}
		return result;
	}
	
	/**
	 * 比对2个日期是否一样
	 * @param date1
	 * @param date2 
	 * @return 两个日期是否一样
	 */
	public boolean dateEquals(Date date1,Date date2){
		if(null == date1 && null == date2){
			return true;
		}
		if(null == date1 || null == date2){
			return false;
		}		
		String date1Str = DateUtils.toString(date1, DateUtils.DATE_FORMAT); 
		String date2Str = DateUtils.toString(date2, DateUtils.DATE_FORMAT);
		return date1Str.equals(date2Str);
	}
	
	
	
}