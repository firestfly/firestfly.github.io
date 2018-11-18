/**
 * @Title: House.java
 * @Package: bingo.vkcrm.service.house.v1.models
 * @author: luoml01
 * @date: 2016年3月15日下午7:33:33
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

import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.model.BaseModel;

/**
 * @ClassName: House
 * @Description:TODO
 * @author: luoml01
 * @date: 2016年3月15日 下午7:33:33
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */
public class House extends BaseModel implements Serializable{

	/**
	 * @Fields serialVersionUID : TODO
	 */

	private static final long serialVersionUID = -4991299805238436296L;
	/**
	 * 房屋id，逻辑主键varchar(32) NOT NULL
	 */
	private String id;
	/**
	 * varchar(50) NULL房屋编码
	 */
	private String houseCode;
	/**
	 * varchar(32) NULL所属房屋编码
	 */
	private String parentId;
	/**
	 * varchar(150) NULL房屋名称
	 */
	private String houseName;
	/**
	 * varchar(150) NULL房屋名（学名）
	 */
	private String houseNameFormal;
	/**
	 * varchar(50) NULL辅助编码
	 */
	private String assistCode;
	/**
	 * varchar(32) NULL所属项目编码
	 */
	private String projectId;
	/**
	 * varchar(50) NULL所属楼栋编码
	 */
	private String buildingCode;
	/**
	 * varchar(180) NULL所属楼栋
	 */
	private String buildingName;
	/**
	 * varchar(180) NULL楼栋名（学名）
	 */
	private String buildingNameFormal;
	/**
	 * varchar(30) NULL所属单元
	 */
	private String unit;
	/**
	 * tinyint(1) NULL所属楼层
	 */
	private String floor;
	/**
	 * varchar(30) NULL房号
	 */
	private String roomNumber;
	/**
	 * tinyint(1) NOT NULL房屋状态
	 */
	private String status;
	/**
	 * tinyint(1) NULL产权类型
	 */
	private String equityType;
	/**
	 * tinyint(1) NULL产权类型文本
	 */
	private String equityTypeText;
	/**
	 * varchar(32) NULL
	 */
	private String contactsId;
	/**
	 * varchar(90) NULL常用联系人姓名
	 */
	private String contactsName;
	/**
	 * varchar(30) NULL常用联系人电话
	 */
	private String contactsMobile;
	/**
	 * tinyint(1) NULL
	 */
	private String broadband;
	/**
	 * datetime NULL入住时间
	 */
	@FieldInfo(fieldChineseName = "入住时间")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date checkInTime;
	/**
	 * datetime NULL交付日期
	 */
	@FieldInfo(fieldChineseName = "交付日期")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date deliverTime;
	/**
	 * tinyint(1) NULL是否拥有子房屋
	 */
	private boolean hasSubroom;
	/**
	 * tinyint(1) NULL是否是子房屋
	 */
	private boolean isSubroom;
	/**
	 * tinyint(1) NULL是否虚拟房屋
	 */
	private boolean isVirtual;
	/**
	 * tinyint(1) NULL是否合并房屋
	 */
	private boolean isCombine;
	/**
	 * tinyint(1) NULL是否二手房
	 */
	private boolean isSecondhand;
	/**
	 * varchar(90) NULL记录最后一次更新人
	 */
	private String modifier;
	/**
	 * varchar(36) NULL记录最后一次更新人id
	 */
	private String modifierId;
	/**
	 * datetime NULL记录最后一次更新时间
	 */
	@FieldInfo(fieldChineseName = "记录最后一次更新时间")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date modifyTime;
	/**
	 * tinyint(1) NULL记录是否已删除
	 */
	private String isDeleted = "0";
	/**
	 * varchar(64) NULL数据删除人
	 */
	private String deleter;
	/**
	 * varchar(32) NULL数据删除人id
	 */
	private String deleterId;
	/**
	 * datetime NULL数据删除时间
	 */
	@FieldInfo(fieldChineseName = "数据删除时间")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date deleteTime;

	/**
	 * varchar(256) NULL地址
	 */
	private String address;
	/**
	 * varchar(30) NULL省份
	 */
	private String province;
	/**
	 * varchar(60) NULL城市
	 */
	private String city;
	/**
	 * varchar(60) NULL区域
	 */
	private String district;
	/**
	 * varchar(50) NULL
	 */
	private String buildingNo;
	/**
	 * varchar(15) NULL朝向
	 */
	private String orientation;
	/**
	 * tinyint(1) NULL房数
	 */
	private String roomCount;
	/**
	 * tinyint(1) NULL厅数
	 */
	private String hallCount;
	/**
	 * tinyint(1) NULL厨数;
	 */
	private String kitchenCount;
	/**
	 * tinyint(1) NULL卫树
	 */
	private String toiletCount;
	/**
	 * decimal(8,2) unsigned NULL预售套内面积
	 */
	private BigDecimal areaOfPreSale;
	/**
	 * decimal(8,2) NULL建筑面积
	 */
	private BigDecimal builtUpArea;
	/**
	 * decimal(8,2) NULL实测建筑面积
	 */
	private BigDecimal actualConstructionArea;
	/**
	 * decimal(8,2) NULL预售建筑面积
	 */
	private BigDecimal preSaleConstructionArea;
	/**
	 * decimal(8,2) NULL物业面积
	 */
	private BigDecimal propertyArea;
	/**
	 * decimal(8,2) NULL实测地下室面积
	 */
	private BigDecimal measuredBasementArea;
	/**
	 * decimal(8,2) NULL露台面积
	 */
	private BigDecimal terraceArea;
	/**
	 * decimal(8,2) NULL套内面积
	 */
	private BigDecimal setArea;
	/**
	 * decimal(8,2) NULL实测公摊面积
	 */
	private BigDecimal measuredPoolArea;
	/**
	 * decimal(8,2) NULL花园面积
	 */
	private BigDecimal gardenArea;
	/**
	 * decimal(8,2) NULL地下室面积
	 */
	private BigDecimal basementArea;
	/**
	 * decimal(8,2) NULL实测套内面积
	 */
	private BigDecimal fieldMeasuredArea;
	/**
	 * decimal(8,2) NULL公摊面积
	 */
	private BigDecimal poolArea;
	/**
	 * decimal(8,2) NULL车库面积
	 */
	private BigDecimal garageArea;
	/**
	 * decimal(8,2) NULL销售装修单价
	 */
	private BigDecimal salesUnitPrice;
	/**
	 * decimal(8,2) NULL参考服务单价
	 */
	private BigDecimal referenceServiceCharge;
	/**
	 * tinyint(1) NULL是否附属房产
	 */
	private String isSubsidiary;
	/**
	 * varchar(255) NULL实际用途
	 */
	private String practicalUse;

	/**
	 * VARCHAR(32) DEFAULT NULL COMMENT '追单'
	 */
	private String layout;
	/**
	 * 项目编码
	 */
	private String projectCode;
	/**
	 * 项目名称
	 */
	private String projectName;



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
	 * @return houseCode
	 */
	public String getHouseCode() {
		return houseCode;
	}
	/**
	 * @param: houseCode the houseCode to set
	 */
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}
	/**
	 * @return parentId
	 */
	public String getParentId() {
		return parentId;
	}
	/**
	 * @param: parentId the parentId to set
	 */
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	/**
	 * @return houseName
	 */
	public String getHouseName() {
		return houseName;
	}
	/**
	 * @param: houseName the houseName to set
	 */
	public void setHouseName(String houseName) {
		this.houseName = houseName;
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
	 * @return assistCode
	 */
	public String getAssistCode() {
		return assistCode;
	}
	/**
	 * @param: assistCode the assistCode to set
	 */
	public void setAssistCode(String assistCode) {
		this.assistCode = assistCode;
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
	 * @return buildingNameFormal
	 */
	public String getBuildingNameFormal() {
		return buildingNameFormal;
	}
	/**
	 * @param: buildingNameFormal the buildingNameFormal to set
	 */
	public void setBuildingNameFormal(String buildingNameFormal) {
		this.buildingNameFormal = buildingNameFormal;
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
	 * @return roomNumber
	 */
	public String getRoomNumber() {
		return roomNumber;
	}
	/**
	 * @param: roomNumber the roomNumber to set
	 */
	public void setRoomNumber(String roomNumber) {
		this.roomNumber = roomNumber;
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
	 * @return equityTypeText
	 */
	public String getEquityTypeText() {
		return this.getValue("HouseEquityType", this.equityTypeText);
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
	 * @return contactsName
	 */
	public String getContactsName() {
		return contactsName;
	}
	/**
	 * @param: contactsName the contactsName to set
	 */
	public void setContactsName(String contactsName) {
		this.contactsName = contactsName;
	}
	/**
	 * @return contactsMobile
	 */
	public String getContactsMobile() {
		return contactsMobile;
	}
	/**
	 * @param: contactsMobile the contactsMobile to set
	 */
	public void setContactsMobile(String contactsMobile) {
		this.contactsMobile = contactsMobile;
	}
	/**
	 * @return broadband
	 */
	public String getBroadband() {
		return broadband;
	}
	/**
	 * @param: broadband the broadband to set
	 */
	public void setBroadband(String broadband) {
		this.broadband = broadband;
	}
	/**
	 * @return checkInTime
	 */
	public Date getCheckInTime() {
		return checkInTime;
	}
	/**
	 * @param: checkInTime the checkInTime to set
	 */
	public void setCheckInTime(Date checkInTime) {
		this.checkInTime = checkInTime;
	}
	/**
	 * @return deliverTime
	 */
	public Date getDeliverTime() {
		return deliverTime;
	}
	/**
	 * @param: deliverTime the deliverTime to set
	 */
	public void setDeliverTime(Date deliverTime) {
		this.deliverTime = deliverTime;
	}
	/**
	 * @return hasSubroom
	 */
	public boolean isHasSubroom() {
		return hasSubroom;
	}
	/**
	 * @param: hasSubroom the hasSubroom to set
	 */
	public void setHasSubroom(boolean hasSubroom) {
		this.hasSubroom = hasSubroom;
	}
	/**
	 * @return isSubroom
	 */
	public boolean isSubroom() {
		return isSubroom;
	}
	/**
	 * @param: isSubroom the isSubroom to set
	 */
	public void setSubroom(boolean isSubroom) {
		this.isSubroom = isSubroom;
	}
	/**
	 * @return isVirtual
	 */
	public boolean isVirtual() {
		return isVirtual;
	}
	/**
	 * @param: isVirtual the isVirtual to set
	 */
	public void setVirtual(boolean isVirtual) {
		this.isVirtual = isVirtual;
	}
	/**
	 * @return isCombine
	 */
	public boolean isCombine() {
		return isCombine;
	}
	/**
	 * @param: isCombine the isCombine to set
	 */
	public void setCombine(boolean isCombine) {
		this.isCombine = isCombine;
	}
	/**
	 * @return isSecondhand
	 */
	public boolean isSecondhand() {
		return isSecondhand;
	}
	/**
	 * @param: isSecondhand the isSecondhand to set
	 */
	public void setSecondhand(boolean isSecondhand) {
		this.isSecondhand = isSecondhand;
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
	 * @return address
	 */
	public String getAddress() {
		return address;
	}
	/**
	 * @param: address the address to set
	 */
	public void setAddress(String address) {
		this.address = address;
	}
	/**
	 * @return province
	 */
	public String getProvince() {
		return province;
	}
	/**
	 * @param: province the province to set
	 */
	public void setProvince(String province) {
		this.province = province;
	}
	/**
	 * @return city
	 */
	public String getCity() {
		return city;
	}
	/**
	 * @param: city the city to set
	 */
	public void setCity(String city) {
		this.city = city;
	}
	/**
	 * @return district
	 */
	public String getDistrict() {
		return district;
	}
	/**
	 * @param: district the district to set
	 */
	public void setDistrict(String district) {
		this.district = district;
	}
	/**
	 * @return buildingNo
	 */
	public String getBuildingNo() {
		return buildingNo;
	}
	/**
	 * @param: buildingNo the buildingNo to set
	 */
	public void setBuildingNo(String buildingNo) {
		this.buildingNo = buildingNo;
	}
	/**
	 * @return orientation
	 */
	public String getOrientation() {
		return orientation;
	}
	/**
	 * @param: orientation the orientation to set
	 */
	public void setOrientation(String orientation) {
		this.orientation = orientation;
	}
	/**
	 * @return roomCount
	 */
	public String getRoomCount() {
		return roomCount;
	}
	/**
	 * @param: roomCount the roomCount to set
	 */
	public void setRoomCount(String roomCount) {
		this.roomCount = roomCount;
	}
	/**
	 * @return hallCount
	 */
	public String getHallCount() {
		return hallCount;
	}
	/**
	 * @param: hallCount the hallCount to set
	 */
	public void setHallCount(String hallCount) {
		this.hallCount = hallCount;
	}
	/**
	 * @return kitchenCount
	 */
	public String getKitchenCount() {
		return kitchenCount;
	}
	/**
	 * @param: kitchenCount the kitchenCount to set
	 */
	public void setKitchenCount(String kitchenCount) {
		this.kitchenCount = kitchenCount;
	}
	/**
	 * @return toiletCount
	 */
	public String getToiletCount() {
		return toiletCount;
	}
	/**
	 * @param: toiletCount the toiletCount to set
	 */
	public void setToiletCount(String toiletCount) {
		this.toiletCount = toiletCount;
	}
	/**
	 * @return areaOfPreSale
	 */
	public BigDecimal getAreaOfPreSale() {
		return areaOfPreSale;
	}
	/**
	 * @param: areaOfPreSale the areaOfPreSale to set
	 */
	public void setAreaOfPreSale(BigDecimal areaOfPreSale) {
		this.areaOfPreSale = areaOfPreSale;
	}
	/**
	 * @return builtUpArea
	 */
	public BigDecimal getBuiltUpArea() {
		return builtUpArea;
	}
	/**
	 * @param: builtUpArea the builtUpArea to set
	 */
	public void setBuiltUpArea(BigDecimal builtUpArea) {
		this.builtUpArea = builtUpArea;
	}
	/**
	 * @return actualConstructionArea
	 */
	public BigDecimal getActualConstructionArea() {
		return actualConstructionArea;
	}
	/**
	 * @param: actualConstructionArea the actualConstructionArea to set
	 */
	public void setActualConstructionArea(BigDecimal actualConstructionArea) {
		this.actualConstructionArea = actualConstructionArea;
	}
	/**
	 * @return preSaleConstructionArea
	 */
	public BigDecimal getPreSaleConstructionArea() {
		return preSaleConstructionArea;
	}
	/**
	 * @param: preSaleConstructionArea the preSaleConstructionArea to set
	 */
	public void setPreSaleConstructionArea(BigDecimal preSaleConstructionArea) {
		this.preSaleConstructionArea = preSaleConstructionArea;
	}
	/**
	 * @return propertyArea
	 */
	public BigDecimal getPropertyArea() {
		return propertyArea;
	}
	/**
	 * @param: propertyArea the propertyArea to set
	 */
	public void setPropertyArea(BigDecimal propertyArea) {
		this.propertyArea = propertyArea;
	}
	/**
	 * @return measuredBasementArea
	 */
	public BigDecimal getMeasuredBasementArea() {
		return measuredBasementArea;
	}
	/**
	 * @param: measuredBasementArea the measuredBasementArea to set
	 */
	public void setMeasuredBasementArea(BigDecimal measuredBasementArea) {
		this.measuredBasementArea = measuredBasementArea;
	}
	/**
	 * @return terraceArea
	 */
	public BigDecimal getTerraceArea() {
		return terraceArea;
	}
	/**
	 * @param: terraceArea the terraceArea to set
	 */
	public void setTerraceArea(BigDecimal terraceArea) {
		this.terraceArea = terraceArea;
	}
	/**
	 * @return setArea
	 */
	public BigDecimal getSetArea() {
		return setArea;
	}
	/**
	 * @param: setArea the setArea to set
	 */
	public void setSetArea(BigDecimal setArea) {
		this.setArea = setArea;
	}
	/**
	 * @return measuredPoolArea
	 */
	public BigDecimal getMeasuredPoolArea() {
		return measuredPoolArea;
	}
	/**
	 * @param: measuredPoolArea the measuredPoolArea to set
	 */
	public void setMeasuredPoolArea(BigDecimal measuredPoolArea) {
		this.measuredPoolArea = measuredPoolArea;
	}
	/**
	 * @return gardenArea
	 */
	public BigDecimal getGardenArea() {
		return gardenArea;
	}
	/**
	 * @param: gardenArea the gardenArea to set
	 */
	public void setGardenArea(BigDecimal gardenArea) {
		this.gardenArea = gardenArea;
	}
	/**
	 * @return basementArea
	 */
	public BigDecimal getBasementArea() {
		return basementArea;
	}
	/**
	 * @param: basementArea the basementArea to set
	 */
	public void setBasementArea(BigDecimal basementArea) {
		this.basementArea = basementArea;
	}
	/**
	 * @return fieldMeasuredArea
	 */
	public BigDecimal getFieldMeasuredArea() {
		return fieldMeasuredArea;
	}
	/**
	 * @param: fieldMeasuredArea the fieldMeasuredArea to set
	 */
	public void setFieldMeasuredArea(BigDecimal fieldMeasuredArea) {
		this.fieldMeasuredArea = fieldMeasuredArea;
	}
	/**
	 * @return poolArea
	 */
	public BigDecimal getPoolArea() {
		return poolArea;
	}
	/**
	 * @param: poolArea the poolArea to set
	 */
	public void setPoolArea(BigDecimal poolArea) {
		this.poolArea = poolArea;
	}
	/**
	 * @return garageArea
	 */
	public BigDecimal getGarageArea() {
		return garageArea;
	}
	/**
	 * @param: garageArea the garageArea to set
	 */
	public void setGarageArea(BigDecimal garageArea) {
		this.garageArea = garageArea;
	}
	/**
	 * @return salesUnitPrice
	 */
	public BigDecimal getSalesUnitPrice() {
		return salesUnitPrice;
	}
	/**
	 * @param: salesUnitPrice the salesUnitPrice to set
	 */
	public void setSalesUnitPrice(BigDecimal salesUnitPrice) {
		this.salesUnitPrice = salesUnitPrice;
	}
	/**
	 * @return referenceServiceCharge
	 */
	public BigDecimal getReferenceServiceCharge() {
		return referenceServiceCharge;
	}
	/**
	 * @param: referenceServiceCharge the referenceServiceCharge to set
	 */
	public void setReferenceServiceCharge(BigDecimal referenceServiceCharge) {
		this.referenceServiceCharge = referenceServiceCharge;
	}
	/**
	 * @return isSubsidiary
	 */
	public String getIsSubsidiary() {
		return isSubsidiary;
	}
	/**
	 * @param: isSubsidiary the isSubsidiary to set
	 */
	public void setIsSubsidiary(String isSubsidiary) {
		this.isSubsidiary = isSubsidiary;
	}
	/**
	 * @return practicalUse
	 */
	public String getPracticalUse() {
		return practicalUse;
	}
	/**
	 * @param: practicalUse the practicalUse to set
	 */
	public void setPracticalUse(String practicalUse) {
		this.practicalUse = practicalUse;
	}
	/**
	 * @return layout
	 */
	public String getLayout() {
		return layout;
	}
	/**
	 * @param: layout the layout to set
	 */
	public void setLayout(String layout) {
		this.layout = layout;
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

}

