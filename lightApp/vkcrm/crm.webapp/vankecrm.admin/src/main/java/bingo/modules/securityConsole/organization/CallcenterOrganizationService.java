package bingo.modules.securityConsole.organization;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.core.utils.StringUtils;
import bingo.dao.Dao;
import bingo.security.SecurityContext;

@Service
public class CallcenterOrganizationService extends BaseService {
	/**
	 * 根据主键获取单条数据
	 */
	public TelGroup findById(String orgId) {
		return callCenterRnDao.select(TelGroup.class, orgId);
	}
	

	/**
	 * 通过主键删除UsfOrganization对象
	 * 1.同时删除该组织的子组织及组织下的用户
	 * @param orgId 主键
	 * @return
	 */
	public void deleteOrganization(String orgId) {
		
		List<TelGroup> telGroups = callCenterRnDao.getJdbcDao().queryForList(TelGroup.class, "callcenter.organization.selectDeleteGroups", orgId,orgId,orgId);		
		for(TelGroup telGroup : telGroups){
			telGroup.setIsDeleted("1");
			telGroup.setDeleter(SecurityContext.getCurrentUser().getName());
			telGroup.setDeleterId(SecurityContext.getCurrentUser().getId());
			telGroup.setDeleteTime(new Date());
		}
		callCenterDao.batchUpdate(TelGroup.class, telGroups);
	}

	/**
	 * 创建或更新UsfOrganization 对象
	 * @param usfOrganization
	 */
	public void saveOrUpdate(TelGroup telGroup) {
		if (StringUtils.isEmpty(telGroup.getId())) {
			telGroup.setId(Dao.getUUID());
			callCenterDao.insert(telGroup);
		} else {
			callCenterDao.update(telGroup);
		}
	}
}