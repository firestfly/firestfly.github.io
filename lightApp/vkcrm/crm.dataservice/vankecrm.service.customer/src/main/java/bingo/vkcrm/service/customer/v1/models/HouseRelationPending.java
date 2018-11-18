package bingo.vkcrm.service.customer.v1.models;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;

/**
 * 客户与房屋的关系临时表
 * Created by chengsiyuan on 15/9/18.
 */
@Table(name="tmp_customer_house_pending")
public class HouseRelationPending extends BaseModel {

    /**
     * 房屋id
     */
    private String houseId;
    /**
     *
     */
    private String customerId;
    private Integer relationType;
    private String relationTypeText;
    /**
     * 审核状态（1、待审核、2、审核通过、3、审核未通过）
     */
    private Integer approveStatus;
    /**
     * 来源渠道（1、呼叫中心）
     */
    private Integer from;
    /**
     * 操作（1、新增、2、删除）
     */
    private Integer operator;
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
	public Integer getApproveStatus() {
		return approveStatus;
	}
	public void setApproveStatus(Integer approveStatus) {
		this.approveStatus = approveStatus;
	}
	public Integer getFrom() {
		return from;
	}
	public void setFrom(Integer from) {
		this.from = from;
	}
	public Integer getOperator() {
		return operator;
	}
	public void setOperator(Integer operator) {
		this.operator = operator;
	}
    

}
