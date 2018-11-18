package bingo.vkcrm.component.notify.models;

import java.util.List;

/**
 * Created by Wangzr on 16/1/15.
 */
public class NotifySubscribe {

    /**
     * 订阅Id
     */
    String id;
    /**
     * 订阅类型
     */
    String type;
    /**
     * 发布者类型(计算规则)
     */
    String initialtorMode;
    /**
     * 订阅者类型(计算规则)
     */
    String recipientMode;
    /**
     * 是否已删除
     */
    boolean deleted;
    /**
     * 订阅规则集合
     */
    List<NotifySubscribeRule> initialtorRules;
    /**
     * 订阅规则集合
     */
    List<NotifySubscribeRule> recipientRules;


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

    public String getRecipientMode() {
        return recipientMode;
    }

    public void setRecipientMode(String recipientMode) {
        this.recipientMode = recipientMode;
    }

    public boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public List<NotifySubscribeRule> getInitialtorRules() {
        return initialtorRules;
    }

    public void setInitialtorRules(List<NotifySubscribeRule> initialtorRules) {
        this.initialtorRules = initialtorRules;
    }

    public List<NotifySubscribeRule> getRecipientRules() {
        return recipientRules;
    }

    public void setRecipientRules(List<NotifySubscribeRule> recipientRules) {
        this.recipientRules = recipientRules;
    }
}
