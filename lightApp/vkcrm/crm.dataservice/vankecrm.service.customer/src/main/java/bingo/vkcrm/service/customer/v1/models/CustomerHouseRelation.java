package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.service.model.BaseModel;

/**
 * Created by szsonic on 2015/11/18.
 */
public class CustomerHouseRelation extends BaseModel {
    private String customerId;
    private String houseId;
    private String houseName;
    /**
     * 是否拥有权限
     */
    private boolean hasPermission;
    private Integer relationType;
    private String relationTypeText;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getRelationTypeText() {
        return this.getValue("HouseCustomerRelationType", this.getRelationType());
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public boolean isHasPermission() {
        return hasPermission;
    }

    public void setHasPermission(boolean hasPermission) {
        this.hasPermission = hasPermission;
    }

    public Integer getRelationType() {
        return relationType;
    }

    public void setRelationType(Integer relationType) {
        this.relationType = relationType;
    }
}
