package bingo.vkcrm.service.customer.v1.models.blackcat;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Column;

/**
 * 房客信息
 * 
 * @author Administrator
 *
 */
public class HouseCustomer {

	/**
	 * 人员ID
	 */
	private String customerCode;
	/**
	 * 姓名
	 */
	private String CustomerName;
	/**
	 * 性别
	 */
	private String sexText;
	/**
	 * 证件号
	 */
	private String certificateId;
	/**
	 * 出生日期
	 */
	@Column(name = "buy_time")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthday;
	/**
	 * 更新日期
	 */
	@Column(name = "buy_time")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date createTime;
	/**
	 * 客房关系客房关系:[{楼栋,房号,关系,状态}]
	 */
	private List<HouseCustomerRelation> houseCustomerRelation;

	public String getCustomerCode() {
		return customerCode;
	}

	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}

	public String getCustomerName() {
		return CustomerName;
	}

	public void setCustomerName(String customerName) {
		CustomerName = customerName;
	}

	public String getSexText() {
		return sexText;
	}

	public void setSexText(String sexText) {
		this.sexText = sexText;
	}

	public String getCertificateId() {
		return certificateId;
	}

	public void setCertificateId(String certificateId) {
		this.certificateId = certificateId;
	}

	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public List<HouseCustomerRelation> getHouseCustomerRelation() {
		return houseCustomerRelation;
	}

	public void setHouseCustomerRelation(List<HouseCustomerRelation> houseCustomerRelation) {
		this.houseCustomerRelation = houseCustomerRelation;
	}

}
