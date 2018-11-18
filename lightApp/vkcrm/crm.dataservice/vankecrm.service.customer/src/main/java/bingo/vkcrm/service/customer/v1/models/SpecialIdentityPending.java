package bingo.vkcrm.service.customer.v1.models;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;
import bingo.vkcrm.service.model.BaseModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 特殊身份临时表
 * @author chengsiyuan
 *
 */
@Table(name = "tmp_cust_specialidentity_pending")
public class SpecialIdentityPending extends BaseModel {
    /**
     * id
     */
    @UUID
    private String id;
    /**
     * 客户id
     */
    private String customerId;
    /**
     * 特殊身份id
     */
    private Integer identity;
    /**
     * 特殊身份文本
     */
    private String identityText;
    /**
     * 开始时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date beginDate;
    /**
     * 结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date endDate;
    /**
     * 持续时间
     */
    private long duration;
    /**
     * 创建人
     */
    private String creator;
    /**
     * 创建人ID
     */
    private String creatorId;
    /**
     * 创建时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd hh:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
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
     * 修改人时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd hh:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date modifyTime;
    /**
     * 删除人
     */
    private String deleter;
    /**
     * 删除人ID
     */
    private String deleterId;
    /**
     * 删除时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd hh:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date deleteTime;
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
     * 是否已验证（0、未验证、1、已验证）
     */
    private String hasApprove;
    
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

    public Integer getIdentity() {
        return identity;
    }

    public void setIdentity(Integer identity) {
        this.identity = identity;
    }

    public String getIdentityText() {
        return this.getValue("CustomerIdentity", this.identity);
    }


    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
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

	public String getDeleter() {
		return deleter;
	}

	public void setDeleter(String deleter) {
		this.deleter = deleter;
	}

	public String getDeleterId() {
		return deleterId;
	}

	public void setDeleterId(String deleterId) {
		this.deleterId = deleterId;
	}

	public Date getDeleteTime() {
		return deleteTime;
	}

	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}

	public String getHasApprove() {
		return hasApprove;
	}

	public void setHasApprove(String hasApprove) {
		this.hasApprove = hasApprove;
	}
    
}
