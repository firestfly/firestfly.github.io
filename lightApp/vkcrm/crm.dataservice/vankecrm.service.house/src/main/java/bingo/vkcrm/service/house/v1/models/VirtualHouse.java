package bingo.vkcrm.service.house.v1.models;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 查询虚拟房屋（对外接口）
 * @author chengsiyaun
 *
 */
public class VirtualHouse {

	/**
	 * 房屋code
	 */
	private String code;
	/**
	 * 房屋名称
	 */
	private String name;
	/**
	 * 房屋辅助编码
	 */
	private String assistCode;
	/**
	 * 楼栋编码
	 */
	private String buildingCode;
	/**
	 * 楼栋名称
	 */
	private String buildingName;
	/**
	 * 单元
	 */
	private String unit;
	/**
	 * 楼层
	 */
	private String floor;
	/**
	 * 房号
	 */
	private String roomNumber;
	/**
	 * 状态
	 */
	private String status;
	/**
	 * 产权类型
	 */
	private String equityType;
	/**
	 * 宽带
	 */
	private String broadband;
	/**
	 * 入住时间
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date checkInTime;
	/**
	 * 交付时间
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date deliverTime;
	/**
	 * 是否拥有子房屋
	 */
	private String hasSubroom;
	/**
	 * 是否子房屋
	 */
	private String isSubroom;
	/**
	 * 是否合并房屋
	 */
	private String isCombine;
	/**
	 * 是否二手房
	 */
	private String isSecondhand;
	/**
	 * 修改日期
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date modifyTime;
	/**
	 * 删除日期
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date deleteTime;
	/**
	 * 联系人编码
	 */
	private String customerCode;
	/**
	 * 项目编码
	 */
	private String projectCode;
	/**
	 * 所有合并房code
	 */
	private String mergeToHouseIds;
	/**
	 * 物业面积
	 */
	private String propertyArea;
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
	public String getAssistCode() {
		return assistCode;
	}
	public void setAssistCode(String assistCode) {
		this.assistCode = assistCode;
	}
	public String getBuildingCode() {
		return buildingCode;
	}
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
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
	public String getFloor() {
		return floor;
	}
	public void setFloor(String floor) {
		this.floor = floor;
	}
	public String getRoomNumber() {
		return roomNumber;
	}
	public void setRoomNumber(String roomNumber) {
		this.roomNumber = roomNumber;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getEquityType() {
		return equityType;
	}
	public void setEquityType(String equityType) {
		this.equityType = equityType;
	}
	public String getBroadband() {
		return broadband;
	}
	public void setBroadband(String broadband) {
		this.broadband = broadband;
	}
	
	public Date getCheckInTime() {
		return checkInTime;
	}
	public void setCheckInTime(Date checkInTime) {
		this.checkInTime = checkInTime;
	}
	public Date getDeliverTime() {
		return deliverTime;
	}
	public void setDeliverTime(Date deliverTime) {
		this.deliverTime = deliverTime;
	}
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}
	public String getHasSubroom() {
		return hasSubroom;
	}
	public void setHasSubroom(String hasSubroom) {
		this.hasSubroom = hasSubroom;
	}
	public String getIsSubroom() {
		return isSubroom;
	}
	public void setIsSubroom(String isSubroom) {
		this.isSubroom = isSubroom;
	}
	public String getIsCombine() {
		return isCombine;
	}
	public void setIsCombine(String isCombine) {
		this.isCombine = isCombine;
	}
	public String getIsSecondhand() {
		return isSecondhand;
	}
	public void setIsSecondhand(String isSecondhand) {
		this.isSecondhand = isSecondhand;
	}
	
	public Date getModifyTime() {
		return modifyTime;
	}
	public Date getDeleteTime() {
		return deleteTime;
	}
	public String getCustomerCode() {
		return customerCode;
	}
	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}
	public String getProjectCode() {
		return projectCode;
	}
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}
	public String getMergeToHouseIds() {
		return mergeToHouseIds;
	}
	public void setMergeToHouseIds(String mergeToHouseIds) {
		this.mergeToHouseIds = mergeToHouseIds;
	}
	public String getPropertyArea() {
		return propertyArea;
	}
	public void setPropertyArea(String propertyArea) {
		this.propertyArea = propertyArea;
	}
	
}
