package bingo.vkcrm.service.house.v1.models;

import bingo.dao.orm.annotations.Table;

import bingo.vkcrm.common.enums.CachePrefix;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonFormat;

import org.springframework.format.annotation.NumberFormat;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 房屋详细信息
 */
@Table(name = "main_house_detail")
public class HouseDetail extends BaseModel {

    /**
     * 房屋ID
     */
    private String id;
    /**
     * 地址
     */
    private String address;
    /**
     * 省份
     */
    private String province;
    /**
     * 城市
     */
    private String city;
    /**
     * 区域
     */
    private String district;
    /**
     * 房号
     */
    private String buildingNo;
    /**
     * 楼层
     */
    private Integer floor;
    /**
     * 单元
     */
    private String unit;
    /**
     * 朝向
     */
    private String orientation;
    /**
     * 房数
     */
    private Integer roomCount;
    /**
     * 厅数
     */
    private Integer hallCount;
    /**
     * 厨数
     */
    private Integer kitchenCount;
    /**
     * 卫数
     */
    private Integer toiletCount;
    /**
     * 预售套内面积
     */
    private BigDecimal areaOfPreSale;
    /**
     * 建筑面积
     */
    private BigDecimal builtUpArea;
    /**
     * 实测建筑面积
     */
    private BigDecimal actualConstructionArea;
    /**
     * 预售建筑面积
     */
    private BigDecimal preSaleConstructionArea;
    /**
     * 物业面积
     */
    private BigDecimal propertyArea;
    /**
     * 实测地下室面积
     */
    private BigDecimal measuredBasementArea;
    /**
     * 露台面积
     */
    private BigDecimal terraceArea;
    /**
     * 套内面积
     */
    private BigDecimal setArea;
    /**
     * 实测公摊面积
     */
    private BigDecimal measuredPoolArea;
    /**
     * 花园面积
     */
    private BigDecimal gardenArea;
    /**
     * 地下室面积
     */
    private BigDecimal basementArea;
    /**
     * 实测套内面积
     */
    private BigDecimal fieldMeasuredArea;
    /**
     * 公摊面积
     */
    private BigDecimal poolArea;
    /**
     * 车库面积
     */
    private BigDecimal garageArea;
    /**
     * 销售装修单价
     */
    private BigDecimal salesUnitPrice;
    /**
     * 参考服务单价
     */
    private BigDecimal referenceServiceCharge;
    /**
     * 是否附属房产
     */
    private boolean isSubsidiary;
    /**
     * 实际用途
     */
    private String practicalUse;
    /**
     * 房屋配置
     */
    private String layout;
    /**
     * 房屋配置文本
     */
    private String layoutText;
    /**
     * 修改人名称
     */
    private String modifier;
    /**
     * 修改人ID
     */
    private String modifierId;
    /**
     * 修改时间
     */
    private Date modifyTime;


    /**
     * @return the modifier
     */
    public String getModifier() {
        return modifier;
    }

    /**
     * @param modifier the modifier to set
     */
    public void setModifier(String modifier) {
        this.modifier = modifier;
    }

    /**
     * @return the modifierId
     */
    public String getModifierId() {
        return modifierId;
    }

    /**
     * @param modifierId the modifierId to set
     */
    public void setModifierId(String modifierId) {
        this.modifierId = modifierId;
    }

    /**
     * @return the modifyTime
     */
    public Date getModifyTime() {
        return modifyTime;
    }

    /**
     * @param modifyTime the modifyTime to set
     */
    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getBuildingNo() {
        return buildingNo;
    }

    public void setBuildingNo(String buildingNo) {
        this.buildingNo = buildingNo;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getOrientation() {
        return orientation;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }

    public Integer getRoomCount() {
        return roomCount;
    }

    public void setRoomCount(Integer roomCount) {
        this.roomCount = roomCount;
    }

    public Integer getHallCount() {
        return hallCount;
    }

    public void setHallCount(Integer hallCount) {
        this.hallCount = hallCount;
    }

    public Integer getKitchenCount() {
        return kitchenCount;
    }

    public void setKitchenCount(Integer kitchenCount) {
        this.kitchenCount = kitchenCount;
    }

    public Integer getToiletCount() {
        return toiletCount;
    }

    public void setToiletCount(Integer toiletCount) {
        this.toiletCount = toiletCount;
    }

    public BigDecimal getAreaOfPreSale() {
        return areaOfPreSale;
    }

    public void setAreaOfPreSale(BigDecimal areaOfPreSale) {
        this.areaOfPreSale = areaOfPreSale;
    }

    public BigDecimal getBuiltUpArea() {
        return builtUpArea;
    }

    public void setBuiltUpArea(BigDecimal builtUpArea) {
        this.builtUpArea = builtUpArea;
    }

    public BigDecimal getActualConstructionArea() {
        return actualConstructionArea;
    }

    public void setActualConstructionArea(BigDecimal actualConstructionArea) {
        this.actualConstructionArea = actualConstructionArea;
    }

    public BigDecimal getPreSaleConstructionArea() {
        return preSaleConstructionArea;
    }

    public void setPreSaleConstructionArea(BigDecimal preSaleConstructionArea) {
        this.preSaleConstructionArea = preSaleConstructionArea;
    }

    public BigDecimal getPropertyArea() {
        return propertyArea;
    }

    public void setPropertyArea(BigDecimal propertyArea) {
        this.propertyArea = propertyArea;
    }

    public BigDecimal getMeasuredBasementArea() {
        return measuredBasementArea;
    }

    public void setMeasuredBasementArea(BigDecimal measuredBasementArea) {
        this.measuredBasementArea = measuredBasementArea;
    }

    public BigDecimal getTerraceArea() {
        return terraceArea;
    }

    public void setTerraceArea(BigDecimal terraceArea) {
        this.terraceArea = terraceArea;
    }

    public BigDecimal getSetArea() {
        return setArea;
    }

    public void setSetArea(BigDecimal setArea) {
        this.setArea = setArea;
    }

    public BigDecimal getMeasuredPoolArea() {
        return measuredPoolArea;
    }

    public void setMeasuredPoolArea(BigDecimal measuredPoolArea) {
        this.measuredPoolArea = measuredPoolArea;
    }

    public BigDecimal getGardenArea() {
        return gardenArea;
    }

    public void setGardenArea(BigDecimal gardenArea) {
        this.gardenArea = gardenArea;
    }

    public BigDecimal getBasementArea() {
        return basementArea;
    }

    public void setBasementArea(BigDecimal basementArea) {
        this.basementArea = basementArea;
    }

    public BigDecimal getFieldMeasuredArea() {
        return fieldMeasuredArea;
    }

    public void setFieldMeasuredArea(BigDecimal fieldMeasuredArea) {
        this.fieldMeasuredArea = fieldMeasuredArea;
    }

    public BigDecimal getPoolArea() {
        return poolArea;
    }

    public void setPoolArea(BigDecimal poolArea) {
        this.poolArea = poolArea;
    }

    public BigDecimal getGarageArea() {
        return garageArea;
    }

    public void setGarageArea(BigDecimal garageArea) {
        this.garageArea = garageArea;
    }

    public BigDecimal getSalesUnitPrice() {
        return salesUnitPrice;
    }

    public void setSalesUnitPrice(BigDecimal salesUnitPrice) {
        this.salesUnitPrice = salesUnitPrice;
    }

    public BigDecimal getReferenceServiceCharge() {
        return referenceServiceCharge;
    }

    public void setReferenceServiceCharge(BigDecimal referenceServiceCharge) {
        this.referenceServiceCharge = referenceServiceCharge;
    }

    public boolean isSubsidiary() {
        return isSubsidiary;
    }

    public void setIsSubsidiary(boolean isSubsidiary) {
        this.isSubsidiary = isSubsidiary;
    }

    public String getPracticalUse() {
        return practicalUse;
    }

    public void setPracticalUse(String practicalUse) {
        this.practicalUse = practicalUse;
    }

    public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public String getLayoutText() {
        return super.getFromCache(CachePrefix.Layout, this.layout);
    }

}
