/**  
 * @Title: CustomerHouse.java
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
 * @ClassName: CustomerHouse   
 * @Description:客房关系信息
 * @author: luoml01 
 * @date: 2016年3月14日 下午2:29:48   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有   
 */
@Table(name = "mid_customer_house")
public class CustomerHouse extends BaseModel implements Serializable{
    /**   
	 * @Fields serialVersionUID : TODO 
	 */     
	    
	private static final long serialVersionUID = -7595421973552356318L;
	/**
     * 房屋id
     */
    private String houseId;
    /**
     * 房屋编码
     */
    private String houseCode;
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
     * 房屋状态
     */
    private String status;
    
    /**
     * 房屋状态文本
     */
    private String statusText;
    
    /**
     * 房屋名称
     */
    private String houseName;
    
    /**
	 * 是否已删除:0-未删除，1-已删除
	 */
    @FieldInfo(fieldChineseName = "是否已删除")
	private String isDeleted = "0";
    
    
    /** 
	 * @return statusText 
	 */
	public String getStatusText() {
		 return this.getValue("HouseStatus", this.statusText);
	}

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

	/** 
	 * @return houseCode 
	 */
	public String getHouseCode() {
		return houseCode;
	}

	/**   
	 * @param: houseCode the houseCode to set   
	 */
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
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
	 * @param: status the status to set   
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	/** 
	 * @return status 
	 */
	public String getStatus() {
		return status;
	}

	/** 
	 * @return houseName 
	 */
	public String getHouseName() {
		return houseName;
	}

	/**   
	 * @param: houseName the houseName to set   
	 */
	public void setHouseName(String houseName) {
		this.houseName = houseName;
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
