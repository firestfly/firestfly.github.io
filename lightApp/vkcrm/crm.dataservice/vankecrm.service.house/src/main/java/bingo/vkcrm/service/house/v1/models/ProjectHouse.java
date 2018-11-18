/**  
 * @Title: ProjectHouse.java
 * @Package: bingo.vkcrm.service.house.v1.models
 * @author: luoml01 
 * @date: 2016年3月15日下午6:44:32
 * @version V1.0 
 * @see       
 * @since JDK 1.6  
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */   
package bingo.vkcrm.service.house.v1.models;

import java.io.Serializable;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.model.BaseModel;

/**   
 * @ClassName: ProjectHouse   
 * @Description:TODO
 * @author: luoml01 
 * @date: 2016年3月15日 下午6:44:32   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有   
 */
@Table(name = "mid_project_house")
public class ProjectHouse extends BaseModel implements Serializable{

	/**   
	 * @Fields serialVersionUID : TODO 
	 */     
	    
	private static final long serialVersionUID = -7774105230645122525L;
	
	/**
	 * 房屋id
	 */
	private String houseId;
	/**
	 * 所属项目id
	 */
	private String projectId;
	//项目编码
	private String projectCode;
	//项目名称
	private String projectName;
	/**
	 * 楼栋id
	 */
	private String buildingId;
	/**
	 * 楼栋编码
	 */
	private String buildingCode;
	/**
	 * 楼栋名称
	 */
	private String buildingName;
	/**
	 * varchar(150) NULL房屋名（学名）
	 */
	private String houseNameFormal;
	/**
	 * 单元id
	 */
	private String unitId;
	/**
	 * 单元
	 */
	private String unit;
	/**
	 * 楼层
	 */
	private String floor;
	/**
	 * 门牌号
	 */
	private String number;
	/**
	 * 所属网格id
	 */
	private String gridId;
	/**
	 * 网格关系修改人
	 */
	private String gridModifier;
	/**
	 * 网格关系修改人id
	 */
	private String gridModifierId;
	/**
	 * 网格关系修改时间
	 */
	@FieldInfo(fieldChineseName = "网格关系修改时间")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date gridModifyTimedatetime;
	
	/**
	 * 房屋记录最后一次更新时间
	 */
	@FieldInfo(fieldChineseName = "记录最后一次更新时间")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date modifyTime;
	
	/**
	 * 房屋楼栋是否有效：0-有效；1-无效
	 */
	private String houseIsDeleted;
	
	/** 
	 * @return houseId 
	 */
	public String getHouseId() {
		return houseId;
	}
	/**   
	 * @param: houseId the houseId to set   
	 */
	public void setHouseId(String houseId) {
		this.houseId = houseId;
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
	 * @return projectName 
	 */
	public String getProjectName() {
		return projectName;
	}
	/**   
	 * @param: projectName the projectName to set   
	 */
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	/** 
	 * @return buildingId 
	 */
	public String getBuildingId() {
		return buildingId;
	}
	/**   
	 * @param: buildingId the buildingId to set   
	 */
	public void setBuildingId(String buildingId) {
		this.buildingId = buildingId;
	}
	/** 
	 * @return buildingCode 
	 */
	public String getBuildingCode() {
		return buildingCode;
	}
	/**   
	 * @param: buildingCode the buildingCode to set   
	 */
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}
	/** 
	 * @return buildingName 
	 */
	public String getBuildingName() {
		return buildingName;
	}
	/**   
	 * @param: buildingName the buildingName to set   
	 */
	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}
	/** 
	 * @return unitId 
	 */
	public String getUnitId() {
		return unitId;
	}
	/**   
	 * @param: unitId the unitId to set   
	 */
	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}
	/** 
	 * @return unit 
	 */
	public String getUnit() {
		return unit;
	}
	/**   
	 * @param: unit the unit to set   
	 */
	public void setUnit(String unit) {
		this.unit = unit;
	}
	/** 
	 * @return floor 
	 */
	public String getFloor() {
		return floor;
	}
	/**   
	 * @param: floor the floor to set   
	 */
	public void setFloor(String floor) {
		this.floor = floor;
	}
	/** 
	 * @return number 
	 */
	public String getNumber() {
		return number;
	}
	/**   
	 * @param: number the number to set   
	 */
	public void setNumber(String number) {
		this.number = number;
	}
	/** 
	 * @return gridId 
	 */
	public String getGridId() {
		return gridId;
	}
	/**   
	 * @param: gridId the gridId to set   
	 */
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
	/** 
	 * @return gridModifier 
	 */
	public String getGridModifier() {
		return gridModifier;
	}
	/**   
	 * @param: gridModifier the gridModifier to set   
	 */
	public void setGridModifier(String gridModifier) {
		this.gridModifier = gridModifier;
	}
	/** 
	 * @return gridModifierId 
	 */
	public String getGridModifierId() {
		return gridModifierId;
	}
	/**   
	 * @param: gridModifierId the gridModifierId to set   
	 */
	public void setGridModifierId(String gridModifierId) {
		this.gridModifierId = gridModifierId;
	}
	/** 
	 * @return gridModifyTimedatetime 
	 */
	public Date getGridModifyTimedatetime() {
		return gridModifyTimedatetime;
	}
	/**   
	 * @param: gridModifyTimedatetime the gridModifyTimedatetime to set   
	 */
	public void setGridModifyTimedatetime(Date gridModifyTimedatetime) {
		this.gridModifyTimedatetime = gridModifyTimedatetime;
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
	 * @return houseNameFormal 
	 */
	public String getHouseNameFormal() {
		return houseNameFormal;
	}
	/**   
	 * @param: houseNameFormal the houseNameFormal to set   
	 */
	public void setHouseNameFormal(String houseNameFormal) {
		this.houseNameFormal = houseNameFormal;
	}
	/** 
	 * @return houseIsDeleted 
	 */
	public String getHouseIsDeleted() {
		return houseIsDeleted;
	}
	/**   
	 * @param: houseIsDeleted the houseIsDeleted to set   
	 */
	public void setHouseIsDeleted(String houseIsDeleted) {
		this.houseIsDeleted = houseIsDeleted;
	}
	
}
