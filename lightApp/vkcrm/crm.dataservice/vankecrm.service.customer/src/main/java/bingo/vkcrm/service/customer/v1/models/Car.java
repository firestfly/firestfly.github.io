package bingo.vkcrm.service.customer.v1.models;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;
import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 客户车辆信息
 */
@Table(name = "dim_cust_cars")
public class Car extends BaseModel{
	/**
	 * id
	 */
	@UUID
	private String id;
	/**
	 * 房屋ID
	 */
	@Column(insert = false,update = false)
	@Deprecated
	private String houseId;
	/**
	 * 房屋编码（对外时使用，对内用houseId）
	 */
	@Column(insert = false,update = false)
	@Deprecated
	private String houseCode;

	/**
	 * 建筑编码（业务）
	 */
	@Column(insert = false,update = false)
	private String buildingCode;

	/**
	 * 建筑编码
	 */
	@Column(insert = false,update = false)
	private String buildingId;

	/**
	 * 建筑类型
	 */
	@Column(insert = false,update = false)
	private String buildingType;

	/**
	 * 客户id
	 */
	@FieldInfo(fieldChineseName = "客户编码")
	private String customerId;
	/**
	 * 车牌号
	 */
	@FieldInfo(fieldChineseName = "车牌号")
	private String licenseNumber;
	/**
	 * 购买时间
	 */
	@FieldInfo(fieldChineseName = "购买时间")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date buyTime;
	/**
	 * 品牌
	 */
	private Integer brand;
	/**
	 * 品牌文本
	 */
	@FieldInfo(fieldChineseName = "品牌")
	private String brandText;
	/**
	 * 颜色
	 */
	private Integer color;
	/**
	 * 颜色文本
	 */
	@FieldInfo(fieldChineseName = "颜色")
	private String colorText;
	/**
	 * 状态
	 */
	private Integer status;
	/**
	 * 状态文本
	 */
	@FieldInfo(fieldChineseName = "状态")
	private String statusText;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getLicenseNumber() {
		return licenseNumber;
	}

	public void setLicenseNumber(String licenseNumber) {
		this.licenseNumber = licenseNumber;
	}

	public Date getBuyTime() {
		return buyTime;
	}

	public void setBuyTime(Date buyTime) {
		this.buyTime = buyTime;
	}

	public Integer getBrand() {
		return brand;
	}

	public void setBrand(Integer brand) {
		this.brand = brand;
	}

	public String getBrandText() {
		return this.getValue("CarBrand", this.brand);
	}

	public Integer getColor() {
		return color;
	}

	public void setColor(Integer color) {
		this.color = color;
	}

	public String getColorText() {
		return this.getValue("CarColor", this.color);
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getStatusText() {
		return this.getValue("CarStatus", this.status);
	}

	public String getHouseId() {
		return houseId;
	}

	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}

	/**
	 * @return the houseCode
	 */
	public String getHouseCode() {
		return houseCode;
	}

	/**
	 * @param houseCode the houseCode to set
	 */
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}

	public String getBuildingCode() {
		return buildingCode;
	}

	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}

	public String getBuildingId() {
		return buildingId;
	}

	public void setBuildingId(String buildingId) {
		this.buildingId = buildingId;
	}

	public String getBuildingType() {
		return buildingType;
	}

	public void setBuildingType(String buildingType) {
		this.buildingType = buildingType;
	}
}
