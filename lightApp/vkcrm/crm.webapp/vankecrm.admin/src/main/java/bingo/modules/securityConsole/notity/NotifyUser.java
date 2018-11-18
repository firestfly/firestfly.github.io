package bingo.modules.securityConsole.notity;

import bingo.dao.orm.annotations.Column;
import org.springframework.stereotype.Controller;

import java.util.Date;

/**
 * 通知关联用户
 */
public class NotifyUser {

    /**
     * id
     */
    private String id;
    /**
     * 用户id
     */
    private String userId;
    /**
     * 通知id
     */
    private String notifyId;
    /**
     * 是否已接收
     */
    @Column(name = "received")
    private boolean isReceived;
    /**
     * 接受时间
     */
    @Column(name = "received_at")
    private Date receivedDate;
    /**
     * 是否已读
     */
    @Column(name = "read")
    private boolean isRead;
    /**
     * 已读时间
     */
    @Column(name = "read_at")
    private Date readDate;
    /**
     * 是否已删除
     */
    @Column(name = "deleted")
    private boolean isDeleted;
    /**
     * 删除时间
     */
    @Column(name = "deleted_at")
    private Date deletedDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNotifyId() {
        return notifyId;
    }

    public void setNotifyId(String notifyId) {
        this.notifyId = notifyId;
    }

    public boolean getIsReceived() {
        return isReceived;
    }

    public void setReceived(boolean isReceived) {
        this.isReceived = isReceived;
    }

    public Date getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(Date receivedDate) {
        this.receivedDate = receivedDate;
    }

    public boolean getIsRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }

    public Date getReadDate() {
        return readDate;
    }

    public void setReadDate(Date readDate) {
        this.readDate = readDate;
    }

    public boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean isDeleted) {
        isDeleted = isDeleted;
    }

    public Date getDeletedDate() {
        return deletedDate;
    }

    public void setDeletedDate(Date deletedDate) {
        this.deletedDate = deletedDate;
    }
}
