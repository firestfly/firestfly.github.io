package bingo.vkcrm.service.customer.v1.models.blackcar;

import java.util.Date;

import bingo.dao.orm.annotations.Table;
/**
 * 客户出入闸关系数据记录pojo
 * @ClassName: CustomerOutRecord   
 * @Description:
 * @author: huangsx 
 * @date: 2016年4月7日 下午7:52:31   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
@Table(name="customer_out_record")
public class CustomerOutRecord {
	public static final String CREATE_NAME ="heimao2hao";
	private String id;
	private String customerCode ;
	private String doorCode ;
	private String inOutTime ;
	private String direction ;
	private String relation ;
	private Double price ;
	//isDeleted
	private String createName;
	private Date createTime;
	private String modifierId;
	private Date modifyTime;
	
	public CustomerOutRecord() {
		super();
	
	}



	public CustomerOutRecord(String id, String customerCode, String doorCode, String inOutTime, String direction,
			String relation, Double price, String createName, Date createTime, String modifierId, Date modifyTime) {
		super();
		this.id = id;
		this.customerCode = customerCode;
		this.doorCode = doorCode;
		this.inOutTime = inOutTime;
		this.direction = direction;
		this.relation = relation;
		this.price = price;
		this.createName = createName;
		this.createTime = createTime;
		this.modifierId = modifierId;
		this.modifyTime = modifyTime;
	}



	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}



	public String getCustomerCode() {
		return customerCode;
	}



	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}



	public String getDoorCode() {
		return doorCode;
	}



	public void setDoorCode(String doorCode) {
		this.doorCode = doorCode;
	}




	public String getInOutTime() {
		return inOutTime;
	}

	public void setInOutTime(String inOutTime) {
		this.inOutTime = inOutTime;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	public String getRelation() {
		return relation;
	}

	public void setRelation(String relation) {
		this.relation = relation;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
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

	public String getModifierId() {
		return modifierId;
	}

	public void setModifierId(String modifierId) {
		this.modifierId = modifierId;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	

	
	
}
