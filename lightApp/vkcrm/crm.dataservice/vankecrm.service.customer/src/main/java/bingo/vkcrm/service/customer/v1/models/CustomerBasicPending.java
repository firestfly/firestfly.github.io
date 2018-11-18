package bingo.vkcrm.service.customer.v1.models;


import java.util.Date;

import bingo.vkcrm.service.model.BaseModel;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;

/**
 * 客户基本信息临时表
 * @author chengsiyuan
 *
 */
@Table(name = "tmp_customer_pending")
public class CustomerBasicPending extends BaseModel {
	/**
	 * 客户id
	 */
	@UUID
	private String id;
	/**
	 * CRM客户id(修改时使用)
	 */
	private String crmCustomerId;
    /**
     * 姓
     */
	private String firstName;
    /**
     * 名
     */
	private String lastName;
    /**
     * 客户全称
     */
	private String fullName;
    /**
     * 性别
     */
	private Integer sex;
    /**
     * 性别文本
     */
	private String sexText;
    /**
     * 客户类型
     */
	private Integer customerType;
    /**
     * 客户类型名称
     */
	private String customerTypeText;
    /**
     * 主要手机号
     */
	private String mainMobile;
    /**
     * 备用手机号
     */
	private String standByMobile;
    /**
     * 家庭电话
     */
	private String homeTel;
    /**
     * 办公电话
     */
	private String officeTel;
    /**
     * 与业主关系
     */
    private String relationType;
    /**
     * 与业主关系文本
     */
    private String relationTypeText;
    /**
     * 创建人
     */
    private String creator;
    /**
     * 创建人ID
     */
    private String creatorId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    /**
     * 修改人
     */
    private String modifier;
    /**
     * 修改人ID
     */
    private String modifierId;
    /**
     * 修改时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifyTime;
    /**
     * 审核状态（1、待审核、2、审核通过、3、审核未通过）
     */
    private Integer approveStatus;
    /**
     * 来源渠道（1、呼叫中心）
     */
    private Integer from;
    /**
     * 操作（1、新增、2、删除）
     */
    private Integer operator;
    /**
     * 房屋id（添加客户（临时表）时）
     */
    private String houseId;
    /**
     * 与房屋关系（添加客户（临时表）时）
     */
    private String[] hcRelationTypes;
    private String contentIds;
    private String identity;
	private String houseCode;
	private String projectCode;
	private String projectId;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getCrmCustomerId() {
		return crmCustomerId;
	}

	public void setCrmCustomerId(String crmCustomerId) {
		this.crmCustomerId = crmCustomerId;
	}

	public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getSexText() {
        return getValue("CustomerSex", this.sex);
    }

    public Integer getCustomerType() {
        return customerType;
    }

    public void setCustomerType(Integer customerType) {
        this.customerType = customerType;
    }

    public String getCustomerTypeText() {
        return this.getValue("CustomerType", this.customerType);
    }

    public String getMainMobile() {
        return mainMobile;
    }

    public void setMainMobile(String mainMobile) {
        this.mainMobile = mainMobile;
    }

    public String getStandByMobile() {
        return standByMobile;
    }

    public void setStandByMobile(String standByMobile) {
        this.standByMobile = standByMobile;
    }

    public String getHomeTel() {
        return homeTel;
    }

    public void setHomeTel(String homeTel) {
        this.homeTel = homeTel;
    }

    public String getOfficeTel() {
        return officeTel;
    }

    public void setOfficeTel(String officeTel) {
        this.officeTel = officeTel;
    }
    
	public String getRelationType() {
		return relationType;
	}

	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}

	public String getRelationTypeText() {
		return this.getValue("HouseCustomerRelationType", this.relationType);
	}

	public Integer getApproveStatus() {
		return approveStatus;
	}

	public void setApproveStatus(Integer approveStatus) {
		this.approveStatus = approveStatus;
	}

	public Integer getFrom() {
		return from;
	}

	public void setFrom(Integer from) {
		this.from = from;
	}

	public Integer getOperator() {
		return operator;
	}

	public void setOperator(Integer operator) {
		this.operator = operator;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(String creatorId) {
		this.creatorId = creatorId;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getModifier() {
		return modifier;
	}

	public void setModifier(String modifier) {
		this.modifier = modifier;
	}

	public String getModifierId() {
		return modifierId;
	}

	public void setModifierId(String modifierId) {
		this.modifierId = modifierId;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}

	/**
	 * @return the houseId
	 */
	public String getHouseId() {
		return houseId;
	}

	/**
	 * @param houseId the houseId to set
	 */
	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}

	public String[] getHcRelationTypes() {
		return hcRelationTypes;
	}

	public void setHcRelationTypes(String[] hcRelationTypes) {
		this.hcRelationTypes = hcRelationTypes;
	}




	public String getProjectCode() {
		return projectCode;
	}

	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}

	/**
     * 兴趣爱好contentid数组
     */
	public String getContentIds() {
		return contentIds;
	}

	public void setContentIds(String contentIds) {
		this.contentIds = contentIds;
	}

	/**
     * 特殊身份id数组
     */
	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
}
