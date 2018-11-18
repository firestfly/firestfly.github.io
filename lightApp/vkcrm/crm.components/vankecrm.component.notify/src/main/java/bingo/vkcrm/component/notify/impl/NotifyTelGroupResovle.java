package bingo.vkcrm.component.notify.impl;

import bingo.dao.IDao;
import bingo.vkcrm.component.notify.NotifyRuleResolve;

import java.util.*;

/**
 * Created by Wangzr on 16/1/19.
 */
public class NotifyTelGroupResovle extends NotifyRuleResolve {

    public String[] resolve(List<String> values) {
        IDao bizDao = factory.getBizDao();
        Set<String> userIds = new HashSet<String>(0);
        Map<String, Object> parameters = new HashMap<String, Object>();
        for(String val : values){
            parameters.put("groupId", val);
            List<String> users = bizDao.queryForList(String.class, "sql.notify.resolve.byTelGroup", parameters);
            userIds.addAll(users);
        }
        return userIds.toArray(new String[0]);
    }
}
