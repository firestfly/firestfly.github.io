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
 * 客户宠物信息
 */
@Table(name = "dim_cust_pets")
public class Pet extends BaseModel {
    /**
     * uuid
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
     * 房屋编码
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
     * 宠物名
     */
    @FieldInfo(fieldChineseName = "宠物名")
    private String name;
    /**
     * 宠物品种
     */
    private Integer breed;
    /**
     * 宠物品种文本
     */
    @FieldInfo(fieldChineseName = "宠物品种")
    private String breedText;
    /**
     * 宠物性别
     */
    private Integer sex;
    /**
     * 宠物性别文本
     */
    @FieldInfo(fieldChineseName = "宠物性别")
    private String sexText;
    /**
     * 领养时间
     */
    @FieldInfo(fieldChineseName = "领养时间")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date adoptTime;
    /**
     * 状态
     */
    private Integer status;
    /**
     * 状态文本
     */
    @FieldInfo(fieldChineseName = "状态")
    private String statusText;
    /**
     * 描述
     */
    @FieldInfo(fieldChineseName = "描述")
    private String description;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getBreed() {
        return breed;
    }

    public void setBreed(Integer breed) {
        this.breed = breed;
    }

    public String getBreedText() {
        return this.getValue("PetBreed", this.breed);
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getSexText() {
        return this.getValue("PetSex", this.sex);
    }

    public Date getAdoptTime() {
        return adoptTime;
    }

    public void setAdoptTime(Date adoptTime) {
        this.adoptTime = adoptTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getStatusText() {
        return this.getValue("PetStatus", this.status);
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
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
    
}
