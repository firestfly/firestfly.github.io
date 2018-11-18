package bingo.vkcrm.component.notify;

import java.util.ArrayList;
import java.util.List;

/**
 * 通知订阅者
 * Created by Wangzr on 16/1/6.
 */
public class NotifySubscriber {

    public NotifySubscriber() {
        this.values = new ArrayList<String>(0);
        this.recipientIds = new ArrayList<String>(0);
    }

    /**
     * 订阅人计算模式
     */
    private String recipientMode;
    /**
     * 规则值集合
     */
    private List<String> values;
    /**
     * 订阅人用户Id集合
     */
    private List<String> recipientIds;


    public String getRecipientMode() {
        return recipientMode;
    }

    public void setRecipientMode(String recipientMode) {
        this.recipientMode = recipientMode;
    }

    public List<String> getValues() {
        return values;
    }

    public void setValues(List<String> values) {
        this.values = values;
    }

    public List<String> getRecipientIds() {
        return recipientIds;
    }

    public void setRecipientIds(List<String> recipientIds) {
        this.recipientIds = recipientIds;
    }

    @Override
    public String toString(){
        return "计算模式:" + recipientMode;
    }

    public boolean hasRecipientId(String recipientId){
        return this.recipientIds.contains(recipientId);
    }

    public void removeRecipientId(String recipientId){
        this.recipientIds.remove(recipientId);
    }
}
