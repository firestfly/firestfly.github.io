package bingo.vkcrm.service.house.v1.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 房屋信息 Created by Wangzr on 15/9/18.
 */
public class HouseLite {

	private String houseId;
	private String houseName;
	private String houseCode;
	private String buildingId;
	private String buildingName;
	private String buildingCode;
	private String projectId;
	private String projectName;
	private String projectCode;
	private String managerName;
	private boolean isOuter;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date deliverTime;

	/**
	 * @return the houseId
	 */
	public String getHouseId() {
		return houseId;
	}

	/**
	 * @param houseId
	 *            the houseId to set
	 */
	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}

	/**
	 * @return the houseName
	 */
	public String getHouseName() {
		return houseName;
	}

	/**
	 * @param houseName
	 *            the houseName to set
	 */
	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}

	/**
	 * @return the houseCode
	 */
	public String getHouseCode() {
		return houseCode;
	}

	/**
	 * @param houseCode
	 *            the houseCode to set
	 */
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}

	/**
	 * @return the buildingId
	 */
	public String getBuildingId() {
		return buildingId;
	}

	/**
	 * @param buildingId
	 *            the buildingId to set
	 */
	public void setBuildingId(String buildingId) {
		this.buildingId = buildingId;
	}

	/**
	 * @return the buildingName
	 */
	public String getBuildingName() {
		return buildingName;
	}

	/**
	 * @param buildingName
	 *            the buildingName to set
	 */
	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}

	/**
	 * @return the buildingCode
	 */
	public String getBuildingCode() {
		return buildingCode;
	}

	/**
	 * @param buildingCode
	 *            the buildingCode to set
	 */
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}

	/**
	 * @return the projectId
	 */
	public String getProjectId() {
		return projectId;
	}

	/**
	 * @param projectId
	 *            the projectId to set
	 */
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	/**
	 * @return the projectName
	 */
	public String getProjectName() {
		return projectName;
	}

	/**
	 * @param projectName
	 *            the projectName to set
	 */
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	/**
	 * @return the projectCode
	 */
	public String getProjectCode() {
		return projectCode;
	}

	/**
	 * @param projectCode
	 *            the projectCode to set
	 */
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}

	/**
	 * @return the managerName
	 */
	public String getManagerName() {
		return managerName;
	}

	/**
	 * @param managerName
	 *            the managerName to set
	 */
	public void setManagerName(String managerName) {
		this.managerName = managerName;
	}

	/**
	 * @return the deliverTime
	 */
	public Date getDeliverTime() {
		return deliverTime;
	}

	/**
	 * @param deliverTime
	 *            the deliverTime to set
	 */
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
