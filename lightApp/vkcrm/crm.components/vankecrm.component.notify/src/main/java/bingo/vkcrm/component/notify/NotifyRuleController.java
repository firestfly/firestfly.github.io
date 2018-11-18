package bingo.vkcrm.component.notify;

import bingo.vkcrm.component.notify.impl.NotifyOrgResolve;
import bingo.vkcrm.component.notify.impl.NotifyRoleResolve;
import bingo.vkcrm.component.notify.impl.NotifyTelGroupResovle;
import bingo.vkcrm.component.notify.impl.NotifyUserResolve;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.*;

/**
 * Created by Wangzr on 16/1/19.
 */
public class NotifyRuleController {
    private static final Log log = LogFactory.getLog(NotifyRuleController.class);
    private Map<String, NotifyRuleResolve> resolveMap;

    private NotifyRuleController() {
        this.resolveMap = new HashMap<String, NotifyRuleResolve>();
        this.resolveMap.put("user", new NotifyUserResolve());
        this.resolveMap.put("role", new NotifyRoleResolve());
        this.resolveMap.put("telGroup", new NotifyTelGroupResovle());
        this.resolveMap.put("org", new NotifyOrgResolve());
    }

    private static NotifyRuleController instance;
    /**
     * 获取实例
     * @return
     */
    public static synchronized NotifyRuleController getInstance(){
        if(instance == null){
            instance = new NotifyRuleController();
        }
        return instance;
    }

    private DaoFactory factory;
    public void setDaoFactory(DaoFactory factory){
        this.factory = factory;
    }

    /**
     * 计算人员
     * @param mode 计算规则
     * @param values 值
     * @return
     */
    public List<String> resolve(String mode, List<String> values){
        if(!this.resolveMap.containsKey(mode)){
            throw new NullPointerException("规则" + mode + "不存在");
        }
        NotifyRuleResolve rule = this.resolveMap.get(mode);
        rule.setDaoFactory(this.factory);
        String[] userIds = rule.resolve(values);
        if(mode == "user"){
            log.info("人员计算结果 => 规则:" + mode + " 用户数量:" + userIds.length);
        } else {
            log.info("计算人员结果 => 规则:" + mode + " 规则值:"+ StringUtils.join(values, ",") +" 用户数量:" + userIds.length);
        }

        List<String> users = new ArrayList<String>(userIds.length);
        users.addAll(Arrays.asList(userIds));
        return users;
    }
}
