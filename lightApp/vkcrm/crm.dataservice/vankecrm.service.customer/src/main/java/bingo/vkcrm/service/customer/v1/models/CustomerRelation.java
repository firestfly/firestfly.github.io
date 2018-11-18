package bingo.vkcrm.service.customer.v1.models;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;

/**
 * 客户间关系实例
 */
@Table(name = "mid_customer_relation")
public class CustomerRelation extends BaseModel {
	/**
	 * 客户编码
	 */
	private String customerId;
	/**
	 * 目标客户编码
	 */
	private String toCustomerId;
	/**
	 * 目标客户名称
	 */
	private String toCustomerName;
	/**
	 * 关系
	 */
	private Integer relationType;
	/**
	 * 关系文本
	 */
	private String relationTypeText;
	/**
	 * 目标客户手机号码
	 */
	private String mainMobileNumber;
    /**
     * 创建人
     */
    private String creator;
    /**
     * 创建人ID
     */
    private String creatorId;

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getToCustomerId() {
        return toCustomerId;
    }

    public void setToCustomerId(String toCustomerId) {
        this.toCustomerId = toCustomerId;
    }

    public String getToCustomerName() {
        return toCustomerName;
    }

    public void setToCustomerName(String toCustomerName) {
        this.toCustomerName = toCustomerName;
    }

    public Integer getRelationType() {
        return relationType;
    }

    public void setRelationType(Integer relationType) {
        this.relationType = relationType;
    }

    public String getRelationTypeText() {
        return this.getValue("CustomerRelationType", this.relationType);
    }

    public String getMainMobileNumber() {
        return mainMobileNumber;
    }

    public void setMainMobileNumber(String mainMobileNumber) {
        this.mainMobileNumber = mainMobileNumber;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }
}
