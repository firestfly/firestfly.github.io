package bingo.vkcrm.service.customer.v1.models;

import java.util.Date;

import bingo.dao.orm.annotations.Table;
import bingo.dao.orm.annotations.UUID;
import bingo.vkcrm.service.model.BaseModel;

/**
 * 个人兴趣爱好临时表
 * @author chengsiyuan
 *
 */
@Table(name="tmp_cust_hobbies_pending")
public class HobbyPending extends BaseModel {
	@UUID
	private String id;
	private String customerId;
	private Integer contentId;
	private String contentText;
	private String creator;
	private String creatorId;
	private Date createTime;
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

	public Integer getContentId() {
		return contentId;
	}

	public void setContentId(Integer contentId) {
		this.contentId = contentId;
	}

	public String getContentText() {
		return this.getValue("CustomerHobbies", this.contentId);
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

	public String getHasApprove() {
		return hasApprove;
	}

	public void setHasApprove(String hasApprove) {
		this.hasApprove = hasApprove;
	}
	
}
