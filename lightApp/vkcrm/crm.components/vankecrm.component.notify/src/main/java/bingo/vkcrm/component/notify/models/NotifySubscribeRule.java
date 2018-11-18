package bingo.vkcrm.component.notify.models;

import bingo.dao.orm.annotations.Column;

import java.math.BigInteger;

/**
 * Created by Wangzr on 16/1/19.
 */
public class NotifySubscribeRule {

    /**
     * id
     */
    BigInteger id;
    /**
     * 订阅关系Id
     */
    @Column(name = "subscribe_id")
    String subscribeId;
    /**
     * 依据
     */
    String basis;
    /**
     * 值(用户id,角色id,话务分组id,组织架构id)
     */
    String value;


    public BigInteger getId() {
        return id;
    }

    public void setId(BigInteger id) {
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
