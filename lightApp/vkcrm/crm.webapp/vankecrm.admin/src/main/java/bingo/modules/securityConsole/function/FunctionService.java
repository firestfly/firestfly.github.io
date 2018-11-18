package bingo.modules.securityConsole.function;

import org.springframework.stereotype.Service;

import bingo.common.BaseService;
import bingo.common.core.utils.StringUtils;
import bingo.dao.Dao;

@Service
public class FunctionService extends BaseService {

	public SecPermission getFunction(String functionId) {
		return rnDao.select(SecPermission.class, functionId);
	}

	public void deleteFunction(String functionId) {
		dao.delete(SecPermission.class, functionId);
	}

	public void saveFunction(SecPermission secPermission) {
		if (StringUtils.isEmpty(secPermission.getId())) {
			secPermission.setId(Dao.getUUID());
			secPermission.setPath(getFunctionPath(secPermission));
			dao.insert(secPermission);
		} else {
			secPermission.setPath(getFunctionPath(secPermission));
			dao.update(secPermission);
		}
	}
	
	private String getFunctionPath(SecPermission secPermission) {
		if (StringUtils.isEmpty(secPermission.getParent())) {
			return secPermission.getId();
		}
		
		SecPermission parentPermission = rnDao.select(SecPermission.class, secPermission.getParent());
		if (null == parentPermission || StringUtils.isEmpty(parentPermission.getPath())) {
			return secPermission.getId();
		}
		
		return parentPermission.getPath() + "." + secPermission.getId();
	}
	
	// 检查权限编码的唯一性
	public boolean checkUniqueFunctionCode(String functionId, String functionCode) {
		if (StringUtils.isEmpty(functionId)) {
			return rnDao.getJdbcDao().exists("function.checkfunctionCode", functionCode);
		} else {
			return rnDao.getJdbcDao().exists("function.checkfunctionCodeForUpdate", functionCode, functionId);
		}
	}

	public SecPermissionRule getRule(String ruleId) {
		return rnDao.select(SecPermissionRule.class, ruleId);
	}
	
	public void deleteRule(String ruleId) {
		dao.delete(SecPermissionRule.class, ruleId);
	}
	
	public void saveRule(SecPermissionRule secPermissionRule) {
		if (StringUtils.isEmpty(secPermissionRule.getId())) {
			dao.insert(secPermissionRule);
		} else {
			dao.update(secPermissionRule);
		}
	}
}