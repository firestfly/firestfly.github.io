package bingo.vkcrm.service.house.v1.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Grid {
	
	/**
	 * 房屋Code
	 */
	private String houseCode;
	
	/**
	 * 房屋交付日期
	 */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date deliverTime;
	/**
	 * 网格id
	 */
	private String id;
	/**
	 * 网格编码
	 */
	private String code;
	/**
	 * 网格名称
	 */
	private String name;
	/**
	 * description
	 */
	private String description;
	/**
	 * 所属项目id
	 */
	private String projectId;
	/**
	 * 是否外盘
	 */
	private boolean isOuter;
	/**
	 * 管家id
	 */
	private String managerId;
	/**
	 * 管家姓名
	 */
	private String managerName;
	
	/**
	 * 管家手机
	 */
	private String mobilePhone;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getManagerId() {
		return managerId;
	}

	public void setManagerId(String managerId) {
		this.managerId = managerId;
	}

	public String getManagerName() {
		return managerName;
	}

	public void setManagerName(String managerName) {
		this.managerName = managerName;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}

	public String getHouseCode() {
		return houseCode;
	}

	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}

	public Date getDeliverTime() {
		return deliverTime;
	}

	public void setDeliverTime(Date deliverTime) {
		this.deliverTime = deliverTime;
	}

	public boolean isOuter() {
		return isOuter;
	}

	public void setOuter(boolean isOuter) {
		this.isOuter = isOuter;
	}
	
}
