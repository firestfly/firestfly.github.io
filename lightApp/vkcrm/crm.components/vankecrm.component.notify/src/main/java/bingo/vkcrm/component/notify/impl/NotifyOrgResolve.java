package bingo.vkcrm.component.notify.impl;

import bingo.dao.IDao;
import bingo.vkcrm.component.notify.DaoFactory;
import bingo.vkcrm.component.notify.NotifyRuleResolve;

import java.util.*;

/**
 * Created by Wangzr on 16/1/19.
 */
public class NotifyOrgResolve extends NotifyRuleResolve {

    public String[] resolve(List<String> values) {
        IDao orgDao = factory.getOrgDao();
        Set<String> userIds = new HashSet<String>(0);
        Map<String, Object> parameters = new HashMap<String, Object>();
        for(String val : values){
            parameters.put("orgId", val);
            List<String> users = orgDao.queryForList(String.class, "sql.notify.resolve.byOrg", parameters);
            userIds.addAll(users);
        }
        return userIds.toArray(new String[0]);
    }
}
