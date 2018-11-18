package bingo.vkcrm.component.notify;

import bingo.vkcrm.component.notify.impl.DbNotifyService;
import bingo.vkcrm.component.notify.impl.RedisNotifyService;
import bingo.vkcrm.component.notify.models.Notify;
import bingo.vkcrm.component.notify.models.NotifySubscribe;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 通知发布者
 * Created by Wangzr on 16/1/6.
 */
public class NotifyPublisher {

    private static final Log log = LogFactory.getLog(NotifyPublisher.class);

    public NotifyPublisher() {
        this.subscribers = new ArrayList<NotifySubscriber>(0);
        this.values = new ArrayList<String>(0);
        this.ruleController = NotifyRuleController.getInstance();
    }

    private DaoFactory factory;
    private DbNotifyService dbService;
    private RedisNotifyService redisService;
    private NotifyRuleController ruleController;

    public void setDaoFactory(DaoFactory factory){
        this.factory = factory;
    }

    public void setDbService(DbNotifyService dbService) {
        this.dbService = dbService;
    }

    public void setRedisService(RedisNotifyService redisService) {
        this.redisService = redisService;
    }

    /**
     * Id
     */
    private String id;
    /**
     * 通知类型
     */
    private String type;
    /**
     * 发起人计算方式
     */
    private String initialtorMode;
    /**
     * 规则值
     */
    private List<String> values;
    /**
     * 所有订阅者
     */
    private List<NotifySubscriber> subscribers;
    /**
     * 是否已计算出发起人用户
     */
    private boolean isResolvedInitialtors;
    /**
     * 发起人用户id集合
     */
    private List<String> initialtorIds;
    /**
     * 注册订阅者
     */
    public void registerSubscriber(NotifySubscriber subscriber){
        this.subscribers.add(subscriber);
    }

    public boolean isUserCanPublish(String publisherId){
        if(!isResolvedInitialtors || this.initialtorIds.size() == 0){
            log.debug("[" + this.toString() + "]开始计算发布人");
            if(this.factory == null){
                throw new NullPointerException("未设置DaoFactory");
            }
            this.ruleController.setDaoFactory(this.factory);
            this.initialtorIds = ruleController.resolve(this.getInitialtorMode(), this.getValues());
            this.isResolvedInitialtors = true;
        }
        log.debug("[" + this.toString() + "]发布人数量:" + this.initialtorIds.size());
        return this.initialtorIds.contains(publisherId);
    }

    public void resolveSubscriber(){
        for(NotifySubscriber subscriber: this.subscribers){
            String subscriberDesc = subscriber.toString();
            // 计算订阅者用户
            subscriber.setRecipientIds(ruleController.resolve(subscriber.getRecipientMode(), subscriber.getValues()));
            log.debug(subscriberDesc + " 计算结果用户数: " + subscriber.getRecipientIds().size());
        }
    }

    public void publish(String content, String publisherId){
        this.ruleController.setDaoFactory(this.factory);
        // 添加通知内容
        Notify notify = dbService.addNotify(this.type, content, publisherId);

        for(NotifySubscriber subscriber: this.subscribers){
            String subscriberDesc = subscriber.toString();
            if(subscriber.getRecipientIds().size() > 0) {
                // (数据库)添加到通知关联用户
                dbService.addNotifyToUsers(notify, subscriber.getRecipientIds());
                log.debug(subscriberDesc + " 数据库已添加关联用户");
                // (缓存)向每个人推送一条通知
                // redisService.addNotifyToUsers(notify, subscriber.getRecipientIds());
                // log.debug(subscriberDesc + " Redis已添加关联用户");
            }
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getInitialtorMode() {
        return initialtorMode;
    }

    public void setInitialtorMode(String initialtorMode) {
        this.initialtorMode = initialtorMode;
    }

    public List<String> getValues() {
        return values;
    }

    public void setValues(List<String> values) {
        this.values = values;
    }

    public List<NotifySubscriber> getSubscribers() {
        return subscribers;
    }

    @Override
    public String toString() {
        return "通知类型:" + this.type + ";发起人计算规则:" + this.initialtorMode;
    }
}
