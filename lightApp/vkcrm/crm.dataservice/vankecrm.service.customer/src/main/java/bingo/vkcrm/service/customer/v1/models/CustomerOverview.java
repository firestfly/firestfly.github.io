package bingo.vkcrm.service.customer.v1.models;

import bingo.vkcrm.service.model.BaseModel;

/**
 * 房屋客户信息
 */
public class CustomerOverview extends BaseModel {

	/**
	 * 房屋逻辑ID
	 */
	private String houseId;
	/**
	 * 客户逻辑ID
	 */
	private String customerId;
	/**
	 * 主要手机号码
	 */
	private String mainMobileNumber;
	/**
	 * 客户姓名
	 */
	private String fullName;
	/**
	 * 客户与房屋的关系
	 */
	private String relationType;
    /**
     * 客户与房屋关系文本
     */
    private String relationTypeText;



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

	public String getMainMobileNumber() {
		return mainMobileNumber;
	}

	public void setMainMobileNumber(String mainMobileNumber) {
		this.mainMobileNumber = mainMobileNumber;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getRelationType() {
		return relationType;
	}

	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}

    public String getRelationTypeText() {
        return this.getValue("HouseCustomerRelationType", this.relationType);
    }
}
