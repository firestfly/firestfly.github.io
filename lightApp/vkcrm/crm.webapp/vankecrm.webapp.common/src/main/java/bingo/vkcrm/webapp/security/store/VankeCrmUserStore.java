package bingo.vkcrm.webapp.security.store;

import bingo.dao.IDao;
import bingo.dao.orm.mapping.TypeMapper;
import bingo.security.principal.IUser;
import bingo.security.principal.User;
import bingo.security.store.IUserStore;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class VankeCrmUserStore implements IUserStore {
    public static final String GET_USER_BY_LOGIN_ID_SQL = "security.getUserByMobile";
    public static final String GET_USER_LOGIN_INFO_SQL  = "security.getUserLoginInfoByMobile";

    protected IDao dao;

    public IUser getUserByLoginId(String mobile) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("Mobile", mobile);

        Map<String, Object> queryResult = dao.queryForMap(GET_USER_BY_LOGIN_ID_SQL, params);
        if (null != queryResult) {
            IUser user = TypeMapper.fillEntity(User.class, queryResult);
            for (String key: queryResult.keySet()) {
                user.getProperties().put(key.replace(" ", "_").toLowerCase(), queryResult.get(key));
            }
            return user;
        }
        return null;
    }

    public IUser getUserLoginInfo(String mobile) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("Mobile", mobile);

        return dao.queryForObject(User.class, GET_USER_LOGIN_INFO_SQL, params);
    }

    public IDao getDao() {
        return dao;
    }

    public void setDao(IDao dao) {
        this.dao = dao;
    }
}
