package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.service.model.BaseModel;

import java.util.Date;

/**
 * 客户与房屋的关系
 * Created by Wangzr on 15/9/18.
 */
public class HouseRelation extends BaseModel {
    /**
     * 房屋编码
     */
    private String houseId;
    /**
     * 客户编码
     */
    private String customerId;
    /**
     * 关联关系
     */
    private Integer relationType;
    /**
     * 关联关系文本
     */
    private String relationTypeText;
    /**
     * 是否拥有权限
     */
    private boolean hasPermission;
    /**
     * 是否已删除
     */
    private Boolean isDeleted;
    /**
     * 删除人
     */
    private String deleter;
    /**
     * 删除人ID
     */
    private String deleterId;
    /**
     * 删除时间
     */
    private Date deletedTime;



    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }


    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }


    public Integer getRelationType() {
        return relationType;
    }

    public void setRelationType(Integer relationType) {
        this.relationType = relationType;
    }


    public String getRelationTypeText() {
        return this.getValue("HouseCustomerRelationType", this.relationType);
    }


    public boolean isHasPermission() {
        return hasPermission;
    }

    public void setHasPermission(boolean hasPermission) {
        this.hasPermission = hasPermission;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getDeleter() {
        return deleter;
    }

    public void setDeleter(String deleter) {
        this.deleter = deleter;
    }

    public String getDeleterId() {
        return deleterId;
    }

    public void setDeleterId(String deleterId) {
        this.deleterId = deleterId;
    }

    public Date getDeletedTime() {
        return deletedTime;
    }

    public void setDeletedTime(Date deletedTime) {
        this.deletedTime = deletedTime;
    }
}
