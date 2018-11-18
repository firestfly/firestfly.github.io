package bingo.vkcrm.service.customer.v1.models.report;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 查询车辆信息结果
 * @author chengsiyuan
 *
 */
public class CarReport {

	/**
	 * 车牌号
	 */
	private String licenseNumber;
	/**
	 * 购买时间
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date buyTime;
	/**
	 * 颜色
	 */
	private String color;
	/**
	 * 品牌
	 */
	private String brand;
	/**
	 * 客户名称
	 */
	private String fullName;
	/**
	 * 证件号码
	 */
	private String certificateId;
	/**
	 * 证件类型
	 */
	private int certificateType;
	/**
	 * 主用手机
	 */
	private String mainMobile;
	/**
	 * 房屋状态
	 */
	private String status;
	/**
	 * 房屋名称
	 */
	private String houseName;
	/**
	 * 楼层
	 */
	private String floor;
	/**
	 * 楼栋名称
	 */
	private String buildingName;
	/**
	 * 单元
	 */
	private String unit;
	/**
	 * 项目名称
	 */
	private String projectName;
	/**
	 * 网格名称
	 */
	private String gridName;
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
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getCertificateId() {
		return certificateId;
	}
	public void setCertificateId(String certificateId) {
		this.certificateId = certificateId;
	}
	public int getCertificateType() {
		return certificateType;
	}
	public void setCertificateType(int certificateType) {
		this.certificateType = certificateType;
	}
	public String getMainMobile() {
		return mainMobile;
	}
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getHouseName() {
		return houseName;
	}
	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}
	public String getFloor() {
		return floor;
	}
	public void setFloor(String floor) {
		this.floor = floor;
	}
	public String getBuildingName() {
		return buildingName;
	}
	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getGridName() {
		return gridName;
	}
	public void setGridName(String gridName) {
		this.gridName = gridName;
	}
	
}
