package bingo.vkcrm.service.house.v1.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.common.core.utils.StringUtils;

/**
 * 房屋概览
 * Created by 邱楚生 手机号码:15916451862,13560392970 QQ:65509713 on 15/11/06
 */
public class HouseOverviewMain {
	
    /** 房屋Id */
    private String houseId;
    /** 房屋名称 */
    private String houseName;
    /** 房屋编号 */
    private String roomNumber;
    /** 入住日期 */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date checkInTime;
    /** 常用联系人 */
    private String contactsName;
    /** 状态 */
    private int status;
    /** 状态文本 */
    private String statusText;
    /** 是否拥有子房屋 */
    private Integer hasSubroom;
    /** 业主 */
    private String owner;
    /** 业主(数组) */
    private String[] ownerArray;
    

    /**
     * 父房屋ID
     */
    private String parentId;
    
    /**
     * 是否子房屋
     */
    private String isSubRoom;
    
    /**
     * 是否虚拟房屋
     */
    private String isVirtual;
    
    /**
     * 是否合并房屋
     */
    private String isCombine;
    
    /**
     * 合并到房屋
     */
    private String mergeToHouseId;
    
    
    /** 原始房屋列表 */
    private List<HouseOverviewMain> parentHouses = new ArrayList<HouseOverviewMain>();
    /** 子房屋列表 */
    private List<HouseOverviewMain> subHouses = new ArrayList<HouseOverviewMain>();
    

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
        return statusText;
    }

    public void setStatusText(String statusText) {
        this.statusText = statusText;
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
	 * @return the parentHouses
	 */
	public List<HouseOverviewMain> getParentHouses() {
		return parentHouses;
	}

	/**
	 * @param parentHouses the parentHouses to set
	 */
	public void setParentHouses(List<HouseOverviewMain> parentHouses) {
		this.parentHouses = parentHouses;
	}

	/**
	 * @return the subHouses
	 */
	public List<HouseOverviewMain> getSubHouses() {
		return subHouses;
	}

	/**
	 * @param subHouses the subHouses to set
	 */
	public void setSubHouses(List<HouseOverviewMain> subHouses) {
		this.subHouses = subHouses;
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
	
	
    
    
    
}
