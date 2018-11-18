package bingo.modules.securityConsole.notity;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;

import java.util.Date;

/**
 * 通知订阅关系
 */
@Table(name = "biz_notify_subscribe")
public class NotifySubscribe {
    /**
     * 订阅关系id
     */
    private String id;
    /**
     * 订阅关系类型
     */
    private Integer type;
    /**
     * 标题
     */
    private String title;
    /**
     * 发起人计算规则（用户、角色、话务分组、组织架构）
     */
    private String initialtorMode;
    /**
     * 接收人计算规则（用户、角色、话务分组、组织架构）
     */
    private String recipientMode;
    /**
     * 创建人
     */
    private String createdBy;
    /**
     * 创建时间
     */
    @Column(name = "created_at")
    private Date createdDate;
    /**
     * 更新人
     */
    private String updatedBy;
    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    private Date updatedDate;
    /**
     * 是否已删除
     */
    @Column(name = "deleted")
    private boolean isDeleted;
    /**
     * 删除人
     */
    @Column(name = "deleted_by")
    private String deletedBy;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean isDeleted) {
        isDeleted = isDeleted;
    }

    public String getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    public Date getDeletedDate() {
        return deletedDate;
    }

    public void setDeletedDate(Date deletedDate) {
        this.deletedDate = deletedDate;
    }
}
