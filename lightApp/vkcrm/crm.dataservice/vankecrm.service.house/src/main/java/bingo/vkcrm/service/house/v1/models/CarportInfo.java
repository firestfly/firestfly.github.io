/**  
 * @Title: CarportInfo.java
 * @Package: bingo.vkcrm.service.house.v1.models
 * @author: luoml01 
 * @date: 2016年3月14日下午2:29:48
 * @version V1.0 
 * @see       
 * @since JDK 1.6  
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */ 
package bingo.vkcrm.service.house.v1.models;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.IsKey;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;

/**   
 * @ClassName: CarportInfo   
 * @Description:车位信息
 * @author: luoml01 
 * @date: 2016年3月14日 下午2:29:48   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有   
 */
@Table(name = "main_carport")
public class CarportInfo extends BaseModel implements Serializable{

	/**   
	 * @Fields serialVersionUID : TODO 
	 */     
	    
	private static final long serialVersionUID = 8008188252209827142L;
	/**
	 * varchar(32) NOT NULL车位id，业务主键uuid
	 */
	@IsKey
	private String id;
	/**
	 * varchar(50) NOT NULL车位编码
	 */
	private String code;
	/**
	 * varchar(50) NULL辅助编码
	 */
	private String assistantCode;
	/**
	 * varchar(90) NOT NULL车位名称
	 */
	private String name;
	/**
	 * varchar(32) NULL
	 */
	private String carparkId;
	/**
	 * varchar(32) NOT NULL所属项目id
	 */
	private String projectId;
	/**
	 * tinyint(2) NULL车位类型
	 */
	private String parkingType;
	/**
     * 车位类型文本
     */
    private String parkingTypeText;
	/**
	 * tinyint(2) NULL
	 */
	private String equityType;
	/**
     * 产权类型文本
     */
    private String equityTypeText;
	/**
	 * decimal(8,2) NULL
	 */
	private BigDecimal area;
	/**
	 * varchar(32) NULL联系人id
	 */
	private String contactsId;
	/**
	 * tinyint(1) NULL车位状态 1、出租 2、出售
	 */
	private String status;
	/**
     * 车位状态文本
     */
    private String statusText;
	/**
	 * datetime NULL出租、出售开始时间
	 */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date startTime;
	/**
	 * varchar(64) NULL最后一次更新人
	 */
	private String modifier;
	/**
	 * varchar(32) NULL最后一次更新人id
	 */
	private String modifierId;
	/**
	 * datetime NULL最后一次更新时间
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date modifyTime;
	/**
	 * tinyint(1) NULL记录是否已删除
	 */
	private String isDeleted = "0";
	/**
	 * varchar(64) NULL记录删除人
	 */
	private String deleter;
	/**
	 * varchar(32) NULL记录删除人id
	 */
	private String deleterId;
	/**
	 * datetime NULL删除时间
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date deleteTime;
	/**
	 * varchar(32) NULL车场编码
	 */
	private String lotcode;
	/**
	 * varchar(32) NULL
	 */
	private String groupId;
	/**
	 * varchar(32) NULL
	 */
	private String groupModifierId;
	/**
	 * datetime NULL
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date groupModifyTime;
	/**
	 * varchar(100) NULL车场名称
	 */
	private String carparkName;
	/**
	 * 项目编码
	 */
	private String projectCode;
	/**
	 * 项目名称
	 */
	private String porjectName;
	
	/** 
	 * @return id 
	 */
	public String getId() {
		return id;
	}
	/**   
	 * @param: id the id to set   
	 */
	public void setId(String id) {
		this.id = id;
	}
	/** 
	 * @return code 
	 */
	public String getCode() {
		return code;
	}
	/**   
	 * @param: code the code to set   
	 */
	public void setCode(String code) {
		this.code = code;
	}
	/** 
	 * @return assistantCode 
	 */
	public String getAssistantCode() {
		return assistantCode;
	}
	/**   
	 * @param: assistantCode the assistantCode to set   
	 */
	public void setAssistantCode(String assistantCode) {
		this.assistantCode = assistantCode;
	}
	/** 
	 * @return name 
	 */
	public String getName() {
		return name;
	}
	/**   
	 * @param: name the name to set   
	 */
	public void setName(String name) {
		this.name = name;
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
	 * @return projectId 
	 */
	public String getProjectId() {
		return projectId;
	}
	/**   
	 * @param: projectId the projectId to set   
	 */
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	/** 
	 * @return parkingType 
	 */
	public String getParkingType() {
		return parkingType;
	}
	/**   
	 * @param: parkingType the parkingType to set   
	 */
	public void setParkingType(String parkingType) {
		this.parkingType = parkingType;
	}
	/** 
	 * @return equityType 
	 */
	public String getEquityType() {
		return equityType;
	}
	/**   
	 * @param: equityType the equityType to set   
	 */
	public void setEquityType(String equityType) {
		this.equityType = equityType;
	}
	/** 
	 * @return area 
	 */
	public BigDecimal getArea() {
		return area;
	}
	/**   
	 * @param: area the area to set   
	 */
	public void setArea(BigDecimal area) {
		this.area = area;
	}
	/** 
	 * @return contactsId 
	 */
	public String getContactsId() {
		return contactsId;
	}
	/**   
	 * @param: contactsId the contactsId to set   
	 */
	public void setContactsId(String contactsId) {
		this.contactsId = contactsId;
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
	 * @return startTime 
	 */
	public Date getStartTime() {
		return startTime;
	}
	/**   
	 * @param: startTime the startTime to set   
	 */
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	/** 
	 * @return modifier 
	 */
	public String getModifier() {
		return modifier;
	}
	/**   
	 * @param: modifier the modifier to set   
	 */
	public void setModifier(String modifier) {
		this.modifier = modifier;
	}
	/** 
	 * @return modifierId 
	 */
	public String getModifierId() {
		return modifierId;
	}
	/**   
	 * @param: modifierId the modifierId to set   
	 */
	public void setModifierId(String modifierId) {
		this.modifierId = modifierId;
	}
	/** 
	 * @return modifyTime 
	 */
	public Date getModifyTime() {
		return modifyTime;
	}
	/**   
	 * @param: modifyTime the modifyTime to set   
	 */
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
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
	/** 
	 * @return deleter 
	 */
	public String getDeleter() {
		return deleter;
	}
	/**   
	 * @param: deleter the deleter to set   
	 */
	public void setDeleter(String deleter) {
		this.deleter = deleter;
	}
	/** 
	 * @return deleterId 
	 */
	public String getDeleterId() {
		return deleterId;
	}
	/**   
	 * @param: deleterId the deleterId to set   
	 */
	public void setDeleterId(String deleterId) {
		this.deleterId = deleterId;
	}
	/** 
	 * @return deleteTime 
	 */
	public Date getDeleteTime() {
		return deleteTime;
	}
	/**   
	 * @param: deleteTime the deleteTime to set   
	 */
	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
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
	 * @return groupId 
	 */
	public String getGroupId() {
		return groupId;
	}
	/**   
	 * @param: groupId the groupId to set   
	 */
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	/** 
	 * @return groupModifierId 
	 */
	public String getGroupModifierId() {
		return groupModifierId;
	}
	/**   
	 * @param: groupModifierId the groupModifierId to set   
	 */
	public void setGroupModifierId(String groupModifierId) {
		this.groupModifierId = groupModifierId;
	}
	/** 
	 * @return groupModifyTime 
	 */
	public Date getGroupModifyTime() {
		return groupModifyTime;
	}
	/**   
	 * @param: groupModifyTime the groupModifyTime to set   
	 */
	public void setGroupModifyTime(Date groupModifyTime) {
		this.groupModifyTime = groupModifyTime;
	}
	/** 
	 * @return carparkName 
	 */
	public String getCarparkName() {
		return carparkName;
	}
	/**   
	 * @param: carparkName the carparkName to set   
	 */
	public void setCarparkName(String carparkName) {
		this.carparkName = carparkName;
	}
	/** 
	 * @return parkingTypeText 
	 */
	public String getParkingTypeText() {
		return getValue("ParkingType", this.parkingType);
	}
	/** 
	 * @return equityTypeText 
	 */
	public String getEquityTypeText() {
		return getValue("EquityType", this.equityType);
	}
	/** 
	 * @return statusText 
	 */
	public String getStatusText() {
		return getValue("CarportStatus", this.status);
	}
	/** 
	 * @return projectCode 
	 */
	public String getProjectCode() {
		return projectCode;
	}
	/**   
	 * @param: projectCode the projectCode to set   
	 */
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}
	/** 
	 * @return porjectName 
	 */
	public String getPorjectName() {
		return porjectName;
	}
	/**   
	 * @param: porjectName the porjectName to set   
	 */
	public void setPorjectName(String porjectName) {
		this.porjectName = porjectName;
	}
	
}
