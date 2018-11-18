package bingo.modules.securityConsole.notity;

import bingo.dao.orm.annotations.Table;

/**
 * 通知订阅关系规则配置
 */
@Table(name = "biz_notify_subscribe_rules")
public class NotifySubscribeRule {
    /**
     * 规则id（自增）
     */
    private String id;
    /**
     * 订阅关系id
     */
    private String subscribeId;
    /**
     * 依据（initiator发起人/recipient接收人）
     */
    private String basis;
    /**
     * 值
     */
    private String value;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubscribeId() {
        return subscribeId;
    }

    public void setSubscribeId(String subscribeId) {
        this.subscribeId = subscribeId;
    }

    public String getBasis() {
        return basis;
    }

    public void setBasis(String basis) {
        this.basis = basis;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
