package bingo.vkcrm.component.notify.models;

import java.util.Date;

/**
 * Created by Wangzr on 16/1/19.
 */
public class NotifyUser {

    /**
     * 用户Id
     */
    String userId;
    /**
     * 订阅id
     */
    String subscribeId;
    /**
     * 是否已接收
     */
    Boolean received;
    /**
     * 接收时间
     */
    Date receivedAt;
    /**
     * 是否已读
     */
    Boolean read;
    /**
     * 已读时间
     */
    Date readAt;
    /**
     * 是否已删除
     */
    Boolean deleted;
    /**
     * 删除时间
     */
    Date deletedAt;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSubscribeId() {
        return subscribeId;
    }

    public void setSubscribeId(String subscribeId) {
        this.subscribeId = subscribeId;
    }

    public Boolean getReceived() {
        return received;
    }

    public void setReceived(Boolean received) {
        this.received = received;
    }

    public Date getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(Date receivedAt) {
        this.receivedAt = receivedAt;
    }

    public Boolean getRead() {
        return read;
    }

    public void setRead(Boolean read) {
        this.read = read;
    }

    public Date getReadAt() {
        return readAt;
    }

    public void setReadAt(Date readAt) {
        this.readAt = readAt;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public Date getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Date deletedAt) {
        this.deletedAt = deletedAt;
    }
}
