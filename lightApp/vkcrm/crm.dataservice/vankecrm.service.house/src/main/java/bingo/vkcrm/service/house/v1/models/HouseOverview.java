package bingo.vkcrm.service.house.v1.models;

import java.util.Date;

import bingo.vkcrm.service.model.BaseModel;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.common.core.utils.StringUtils;

/**
 * 房屋概览
 * Created by Wangzr on 15/8/31.
 */
public class HouseOverview extends BaseModel {

    private String houseId;//房屋Id
    private String houseName;//房屋名称
    private String houseCode;//房屋名称
    private String roomNumber;//房屋编号
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date checkInTime;//入住日期
    private String contactsName;//常用联系人
	private Integer status;//状态
	private String statusText;//状态文本
    private Integer hasSubroom;//是否拥有子房屋
    private String owner;//业主
    private String[] ownerArray;//业主(数组)
    private String parentId;//父房屋ID
    private String isSubRoom;//是否子房屋
    private String isVirtual;//是否虚拟房屋
    private String isCombine;//是否合并房屋
    private String mergeToHouseId;//合并到房屋
    private String propertyArea;//物业面积    

    public String getHouseId() {
        return houseId;
    }

    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Date getCheckInTime() {
		return checkInTime;
	}

	public void setCheckInTime(Date checkInTime) {
		this.checkInTime = checkInTime;
	}

	public String getContactsName() {
		return contactsName;
	}

	public void setContactsName(String contactsName) {
		this.contactsName = contactsName;
	}

	public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getStatusText() {
		return this.getValue("HouseStatus", this.status);
	}

    public Integer getHasSubroom() {
		return hasSubroom;
	}

	public void setHasSubroom(Integer hasSubroom) {
		this.hasSubroom = hasSubroom;
	}

	public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
        if(StringUtils.isNotEmpty(owner)){
            this.ownerArray = owner.split(",");
        }
    }

    public void setOwnerArray(String[] ownerArray) {
        this.ownerArray = ownerArray;
    }

    public String[] getOwnerArray() {
        return ownerArray;
    }

	/**
	 * @return the parentId
	 */
	public String getParentId() {
		return parentId;
	}

	/**
	 * @param parentId the parentId to set
	 */
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	/**
	 * @return the isSubRoom
	 */
	public String getIsSubRoom() {
		return isSubRoom;
	}

	/**
	 * @param isSubRoom the isSubRoom to set
	 */
	public void setIsSubRoom(String isSubRoom) {
		this.isSubRoom = isSubRoom;
	}

	/**
	 * @return the isVirtual
	 */
	public String getIsVirtual() {
		return isVirtual;
	}

	/**
	 * @param isVirtual the isVirtual to set
	 */
	public void setIsVirtual(String isVirtual) {
		this.isVirtual = isVirtual;
	}

	/**
	 * @return the isCombine
	 */
	public String getIsCombine() {
		return isCombine;
	}

	/**
	 * @param isCombine the isCombine to set
	 */
	public void setIsCombine(String isCombine) {
		this.isCombine = isCombine;
	}

	/**
	 * @return the mergeToHouseId
	 */
	public String getMergeToHouseId() {
		return mergeToHouseId;
	}

	/**
	 * @param mergeToHouseId the mergeToHouseId to set
	 */
	public void setMergeToHouseId(String mergeToHouseId) {
		this.mergeToHouseId = mergeToHouseId;
	}

	/**
	 * @return the propertyArea
	 */
	public String getPropertyArea() {
		return propertyArea;
	}

	/**
	 * @param propertyArea the propertyArea to set
	 */
	public void setPropertyArea(String propertyArea) {
		this.propertyArea = propertyArea;
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
