/**
 * This file created at 2014-7-30.
 *
 * Copyright (c) 2002-2014 Bingosoft, Inc. All rights reserved.
 */
package bingo.vkcrm.schedule.projectrole;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.core.ApplicationFactory;


/**
 * <code>{@link ProjectRoleSchedule}</code>
 *
 * 用户项目权限更新定时器
 * 每天凌晨跑此定时器，更新过期项目权限 及管理中心权限
 *
 * @author Administrator
 */
@Service
public class ProjectRoleSchedule extends BaseService {

	public void scheduleStrat(){		
		
		serviceCenterDao.update("sql.schedule.projectrole.startrole", null);
		serviceCenterDao.update("sql.schedule.projectrole.endrole", null);		
		
		// 删除过期的管理中心、公司权限
		List<MidOrganizationUser> roles = serviceCenterDao.queryForList(MidOrganizationUser.class, "sql.schedule.projectrole.queryParentRole", null);
		if(null != roles && roles.size() > 0){
			String ids = delRole(roles);
			
			// 删除过期管理中心上级权限（目前是住宅类、非住宅类）
			Map<String, String> queryParam = new HashMap<String, String>();
			queryParam.put("ids", ids);
			roles = serviceCenterDao.queryForList(MidOrganizationUser.class, "sql.schedule.projectrole.queryParentParentRole", queryParam);
			if(null != roles && roles.size() > 0){
				ids = delRole(roles);
				
				// 上级的上级（目前没有，预留一层深度）
				queryParam.put("ids", ids);
				roles = serviceCenterDao.queryForList(MidOrganizationUser.class, "sql.schedule.projectrole.queryParentParentRole", queryParam);
				if(null != roles && roles.size() > 0){
					ids = delRole(roles);
				}
			}
		}
		
		// 启用刚启用项目的管理中心，以及管理中心上级
		roles = serviceCenterDao.queryForList(MidOrganizationUser.class, "sql.schedule.projectrole.queryNewParentRole", null);
		if(null != roles && roles.size() > 0){
			String ids = newRole(roles);
			
			// 删除过期管理中心上级权限（目前是住宅类、非住宅类）
			Map<String, String> queryParam = new HashMap<String, String>();
			queryParam.put("ids", ids);
			roles = serviceCenterDao.queryForList(MidOrganizationUser.class, "sql.schedule.projectrole.queryNewParentParentRole", queryParam);
			if(null != roles && roles.size() > 0){
				ids = newRole(roles);
				
				// 上级的上级（目前没有，预留一层深度）
				queryParam.put("ids", ids);
				roles = serviceCenterDao.queryForList(MidOrganizationUser.class, "sql.schedule.projectrole.queryNewParentParentRole", queryParam);
				if(null != roles && roles.size() > 0){
					ids = newRole(roles);
				}
			}
		}
	}
	
	/**
	 * 删除权限信息
	 * @param roles
	 * @return
	 */
	private String delRole(List<MidOrganizationUser> roles){
		String ids = "";
		for(MidOrganizationUser role : roles){
			role.setIsdeleted("1");
			role.setDeletebyUser("项目权限过期");
			role.setDeletebyUserid("sys");
			role.setDeletetime(new Date());
			ids += role.getOrganizationId() + ",";
			serviceCenterDao.updateFields(role,"isdeleted","deletebyUser","deletebyUserid");
		}
		return ids.substring(0, ids.length() - 1);
	}
	
	/**
	 * 插入新的授权记录
	 * @param roles
	 * @return
	 */
	private String newRole(List<MidOrganizationUser> roles){
		String ids = "";
		for(MidOrganizationUser role : roles){
			role.setIsdeleted("0");
			role.setCreator("系统");
			role.setCreatorid("sys");
			role.setCreatetime(new Date());
			ids += role.getOrganizationId() + ",";
		}
		serviceCenterDao.batchInsert(MidOrganizationUser.class, roles);
		return ids.substring(0, ids.length() - 1);
	}
	
	
	// For Test
	public static void main(String[] args){
		ProjectRoleSchedule service = ApplicationFactory.getBeanForName(ProjectRoleSchedule.class,"projectRoleSchedule");
		service.scheduleStrat();
		System.exit(0);
	}
}
