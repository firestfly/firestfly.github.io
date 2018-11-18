package bingo.vkcrm.service.house.v1.models;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 房屋表实例
 */
@Table(name = "main_house")
public class HouseBasic extends BaseModel {

	/**
	 * 房屋Id
	 */
    @Column(name = "id")
	private String id;
    /**
     * 房屋编码
     */
    @Column(name = "code")
	private String code;
    /**
     * 所属房屋编码
     */
    @Column(name = "parentId")
	private String parentId;
    /**
     * 房屋名称
     */
	private String name;
    /**
     * 辅助编码
     */
	private String assistCode;
    /**
     * 所属项目编码
     */
	private String projectId;
    /**
     * 所属项目名称
     */
	private String projectName;
    /**
     * 所属楼栋编码
     */
	private String buildingCode;
	/**
	 * 所属楼栋名称
	 */
	private String buildingName;
    /**
     * 所属单元
     */
	private String unit;
    /**
     * 所属楼层
     */
	private int floor;
	/**
	 * 房号
	 */
	private String roomNumber;
    /**
     * 房屋状态
     */
    private Integer status;
    /**
     * 房屋状态文本
     */
    private String statusText;
    /**
     * 产权类型
     */
    private Integer equityType;
    /**
     * 产权类型文本
     */
    private String equityTypeText;
    
    /**
     * 常用联系人ID
     */
    private String contactsId;
    /**
     * 常用联系人姓名
     */
	private String contactsName;
    /**
     * 常用联系号码
     */
	private String contactsMobile;
    /**
     * 是否拥有子房屋
     */
	private boolean hasSubRoom;
    /**
     * 是否为子房屋
     */
	private boolean isSubRoom;
	
	/**
	 * 是否虚拟房屋
	 */
	private boolean isVirtual;
	
	/**
	 * 是否合并房
	 */
	private boolean isCombine;
	
    /**
     * 宽带类型
     */
    private Integer broadband;
    /**
     * 宽带类型文本
     */
    private String broadbandText;
    /**
     * 交付时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date deliverTime;
    /**
     * 入伙时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date checkInTime;
    /**
     * 是否二手房
     */
    private boolean isSecondhand;
    
    /** 修改人名称 */
    private String modifier;    
    /** 修改人ID */
    private String modifierId;
    /** 修改时间 */
    private Date modifyTime;
    /** 是否被删除0：存在；1被删除 */
    private String isDeleted;
    /** 删除人名称 */
    private String deleter;
    /** 删除人ID */
    private String deleterId;
    /** 删除时间 */
    private Date deleteTime;
    
    
    
    
    
    
    

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

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
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

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
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

    public int getFloor() {
        return floor;
    }

    public String getRoomNumber() {
		return roomNumber;
	}

	public void setRoomNumber(String roomNumber) {
		this.roomNumber = roomNumber;
	}

	public void setFloor(int floor) {
        this.floor = floor;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getStatusText() {
        return this.getValue("HouseStatus", this.status);
    }


    public Integer getEquityType() {
        return equityType;
    }

    public void setEquityType(Integer equityType) {
        this.equityType = equityType;
    }

    public String getEquityTypeText() {
        return this.getValue("equityType", this.equityType);
    }


    public String getContactsId() {
		return contactsId;
	}

	public void setContactsId(String contactsId) {
		this.contactsId = contactsId;
	}

	public String getContactsName() {
        return contactsName;
    }

    public void setContactsName(String contactsName) {
        this.contactsName = contactsName;
    }

    public String getContactsMobile() {
		return contactsMobile;
	}

	public void setContactsMobile(String contactsMobile) {
		this.contactsMobile = contactsMobile;
	}

	public boolean isHasSubRoom() {
        return hasSubRoom;
    }

    public void setHasSubRoom(boolean hasSubRoom) {
        this.hasSubRoom = hasSubRoom;
    }

    public boolean isSubRoom() {
        return isSubRoom;
    }

    public void setIsSubRoom(boolean isSubRoom) {
        this.isSubRoom = isSubRoom;
    }

    public Integer getBroadband() {
        return broadband;
    }

    public void setBroadband(Integer broadband) {
        this.broadband = broadband;
    }

    public String getBroadbandText() {
        return this.getValue("Broadband", this.broadband);
    }


    public Date getDeliverTime() {
        return deliverTime;
    }

    public void setDeliverTime(Date deliverTime) {
        this.deliverTime = deliverTime;
    }

    public Date getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(Date checkInTime) {
        this.checkInTime = checkInTime;
    }

    public boolean isSecondhand() {
        return isSecondhand;
    }

    public void setIsSecondhand(boolean isSecondhand) {
        this.isSecondhand = isSecondhand;
    }

	/**
	 * @return the isVirtual
	 */
	public boolean isVirtual() {
		return isVirtual;
	}

	/**
	 * @param isVirtual the isVirtual to set
	 */
	public void setVirtual(boolean isVirtual) {
		this.isVirtual = isVirtual;
	}

	/**
	 * @return the isCombine
	 */
	public boolean isCombine() {
		return isCombine;
	}

	/**
	 * @param isCombine the isCombine to set
	 */
	public void setCombine(boolean isCombine) {
		this.isCombine = isCombine;
	}

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

	/**
	 * @return the isDeleted
	 */
	public String getIsDeleted() {
		return isDeleted;
	}

	/**
	 * @param isDeleted the isDeleted to set
	 */
	public void setIsDeleted(String isDeleted) {
		this.isDeleted = isDeleted;
	}

	/**
	 * @return the deleter
	 */
	public String getDeleter() {
		return deleter;
	}

	/**
	 * @param deleter the deleter to set
	 */
	public void setDeleter(String deleter) {
		this.deleter = deleter;
	}

	/**
	 * @return the deleterId
	 */
	public String getDeleterId() {
		return deleterId;
	}

	/**
	 * @param deleterId the deleterId to set
	 */
	public void setDeleterId(String deleterId) {
		this.deleterId = deleterId;
	}

	/**
	 * @return the deleteTime
	 */
	public Date getDeleteTime() {
		return deleteTime;
	}

	/**
	 * @param deleteTime the deleteTime to set
	 */
	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}

	/**
	 * @param isSubRoom the isSubRoom to set
	 */
	public void setSubRoom(boolean isSubRoom) {
		this.isSubRoom = isSubRoom;
	}

	/**
	 * @param isSecondhand the isSecondhand to set
	 */
	public void setSecondhand(boolean isSecondhand) {
		this.isSecondhand = isSecondhand;
	}
    
    
    
}