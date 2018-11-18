/**  
 * @Title: CarportCustomer.java
 * @Package: bingo.vkcrm.service.customer.v1.models
 * @author: luoml01 
 * @date: 2016年3月14日下午2:29:48
 * @version V1.0
 * @see       
 * @since JDK 1.6  
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
package bingo.vkcrm.service.customer.v1.models;

import java.io.Serializable;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.model.BaseModel;

/**   
 * @ClassName: CarportCustomer   
 * @Description:客车房关系信息
 * @author: luoml01 
 * @date: 2016年3月14日 下午2:29:48   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有   
 */
@Table(name = "mid_carport_customer")
public class CarportCustomer extends BaseModel implements Serializable{
	/**   
	 * @Fields serialVersionUID : TODO 
	 */     
	    
	private static final long serialVersionUID = 2108279750997778487L;
	/**
     * 车位id
     */
    private String carportId;
    /**
     * 车位编码
     */
    private String carportCode;
    /**
     * 客户ID
     */
    private String customerId;
    /**
     * 客户编码
     */
    private String customerCode;
    /**
     * 关联关系
     */
    private Integer relationType;
    /**
     * 关联关系文本
     */
    private String relationTypeText;
    
    /**
     * 车位状态
     */
    private String status;
    
    /**
     * 车位状态文本
     */
    private String statusText;
    
    /**
     * 车位名称
     */
    private String carportName;
    
    /**
     * 车场ID
     */
    private String carparkId;
    
    /**
	 * varchar(32) NULL车场编码
	 */
	private String lotcode;
	
	/**
	 * 是否已删除:0-未删除，1-已删除
	 */
    @FieldInfo(fieldChineseName = "是否已删除")
	private String isDeleted = "0";
    
	/** 
	 * @return carportId 
	 */
	public String getCarportId() {
		return carportId;
	}

	/**   
	 * @param: carportId the carportId to set   
	 */
	public void setCarportId(String carportId) {
		this.carportId = carportId;
	}

	/** 
	 * @return carportCode 
	 */
	public String getCarportCode() {
		return carportCode;
	}

	/**   
	 * @param: carportCode the carportCode to set   
	 */
	public void setCarportCode(String carportCode) {
		this.carportCode = carportCode;
	}

	/** 
	 * @return customerId 
	 */
	public String getCustomerId() {
		return customerId;
	}

	/**   
	 * @param: customerId the customerId to set   
	 */
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	/** 
	 * @return customerCode 
	 */
	public String getCustomerCode() {
		return customerCode;
	}

	/**   
	 * @param: customerCode the customerCode to set   
	 */
	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}

	/** 
	 * @return relationType 
	 */
	public Integer getRelationType() {
		return relationType;
	}

	/**   
	 * @param: relationType the relationType to set   
	 */
	public void setRelationType(Integer relationType) {
		this.relationType = relationType;
	}

	/** 
	 * @return status 
	 */
	public String getStatus() {
		return status;
	}

	/**   
	 * @param: status the status to set   
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	/** 
	 * @return relationTypeText 
	 */
	public String getRelationTypeText() {
		return this.getValue("HouseCustomerRelationType", this.relationType);
	}

	/** 
	 * @return statusText 
	 */
	public String getStatusText() {
		return this.getValue("CarportStatus", this.statusText);
	}

	/** 
	 * @return carportName 
	 */
	public String getCarportName() {
		return carportName;
	}

	/**   
	 * @param: carportName the carportName to set   
	 */
	public void setCarportName(String carportName) {
		this.carportName = carportName;
	}

	/** 
	 * @return carparkId 
	 */
	public String getCarparkId() {
		return carparkId;
	}

	/**   
	 * @param: carparkId the carparkId to set   
	 */
	public void setCarparkId(String carparkId) {
		this.carparkId = carparkId;
	}

	/** 
	 * @return lotcode 
	 */
	public String getLotcode() {
		return lotcode;
	}

	/**   
	 * @param: lotcode the lotcode to set   
	 */
	public void setLotcode(String lotcode) {
		this.lotcode = lotcode;
	}

	/** 
	 * @return isDeleted 
	 */
	public String getIsDeleted() {
		return isDeleted;
	}

	/**   
	 * @param: isDeleted the isDeleted to set   
	 */
	public void setIsDeleted(String isDeleted) {
		this.isDeleted = isDeleted;
	}
    
}
