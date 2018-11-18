package bingo.vkcrm.service.customer.v1.models.blackcar;

import java.util.Date;

import bingo.dao.orm.annotations.Table;
/**
 * 临时表 客车关系pojo
 * @ClassName: TempCustomerCarRelation   
 * @Description:TODO
 * @author: huangsx 
 * @date: 2016年4月7日 下午7:54:02   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
@Table(name ="temp_customer_car_relation")
public class TempCustomerCarRelation {
	public static final String CREATE_NAME ="heimao2hao";
	private String id;
	private String customerCode ;
	private String carCode  ;
	private String createName ;
	private Date createTime;
//	private Integer isDeleted;
	private Date modifyTime; 
	private String modifierId;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
//	public Integer getIsDeleted() {
//		return isDeleted;
//	}
//	public void setIsDeleted(Integer isDeleted) {
//		this.isDeleted = isDeleted;
//	}

	public String getModifierId() {
		return modifierId;
	}
	public void setModifierId(String modifierId) {
		this.modifierId = modifierId;
	}
	public String getCreateName() {
		return createName;
	}
	public void setCreateName(String createName) {
		this.createName = createName;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	
	public String getCustomerCode() {
		return customerCode;
	}
	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}
	public String getCarCode() {
		return carCode;
	}
	public void setCarCode(String carCode) {
		this.carCode = carCode;
	}
	public Date getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	
	public TempCustomerCarRelation(String id, String customerCode, String carCode, String createName, Date createTime,
			Date modifyTime, String modifierId) {
		super();
		this.id = id;
		this.customerCode = customerCode;
		this.carCode = carCode;
		this.createName = createName;
		this.createTime = createTime;
		this.modifyTime = modifyTime;
		this.modifierId = modifierId;
	}
	public TempCustomerCarRelation() {
		super();
	}
}
