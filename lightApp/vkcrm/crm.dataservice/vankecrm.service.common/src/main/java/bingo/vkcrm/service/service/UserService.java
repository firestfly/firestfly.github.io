package bingo.vkcrm.service.service;

import bingo.common.core.ApplicationContext;
import bingo.common.core.ApplicationFactory;
import bingo.dao.IDao;
import bingo.vkcrm.service.common.User;
import bingo.vkcrm.service.exceptions.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Wangzr on 16/2/2.
 */
@Service
public class UserService extends BaseService {

    public boolean hasRole(String userId, String roleCode) throws Throwable{
        if(sysRoDao == null) {
            sysRoDao = (IDao) ApplicationFactory.getBeanForName("sysRoDao");
        }

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userId", userId);
        parameters.put("roleCode", roleCode);
        return sysRoDao.queryForInt("sec.user.hasRole", parameters) > 0;
    }

    /**
     * 检查用户是否有权限
     *
     * @param userId    用户ID
     * @param operation 操作权限
     * @return 用户是否有操作权限
     */
    public boolean hasPermission(String userId, String operation) {
        if(sysRoDao == null) {
            sysRoDao = (IDao) ApplicationFactory.getBeanForName("sysRoDao");
        }

        Map<String, Object> parameters = new HashMap<String, Object>();
        parameters.put("userId", userId);
        parameters.put("permissionCode", operation);

        return sysRoDao.queryForInt("sec.user.hasPermission", parameters) > 0;
    }
}
