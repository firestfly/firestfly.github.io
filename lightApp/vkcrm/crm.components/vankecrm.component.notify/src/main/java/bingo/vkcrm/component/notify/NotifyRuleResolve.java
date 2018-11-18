package bingo.vkcrm.component.notify;

import java.util.List;

/**
 * Created by Wangzr on 16/1/19.
 */
public abstract class NotifyRuleResolve {

    protected DaoFactory factory;

    /**
     * 设置Dao工厂类
     * @param factory
     */
    public void setDaoFactory(DaoFactory factory){
        this.factory = factory;
    }

    /**
     * 计算人员
     * @param values
     * @return
     */
    public abstract String[] resolve(List<String> values);
}
