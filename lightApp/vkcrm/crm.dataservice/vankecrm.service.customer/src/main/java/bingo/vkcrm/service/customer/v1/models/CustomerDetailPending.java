package bingo.vkcrm.service.customer.v1.models;

import java.util.Date;

import bingo.vkcrm.service.model.BaseModel;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;

/**
 *  客户详细资料临时资料
 * @author chengsiyuan
 *
 */
@Table(name = "tmp_customer_detail_pending")
public class CustomerDetailPending extends BaseModel {
    /**
	 * 客户ID
	 */
	private String id;
	/**
	 * 邮编
	 */
	private String postCode;
	/**
	 * email
	 */
	private String email;
	/**
	 * qq号码
	 */
	private String qq;
	/**
	 * 微信号
	 */
	private String weChat;
	/**
	 * 生日
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthday;
	/**
	 * 血型
	 */
	private Integer blood;
	/**
	 * 血型文本
	 */
	private String bloodText;
	/**
	 * 职业
	 */
	private Integer occupation;
	/**
	 * 职业文本
	 */
	private String occupationText;
	/**
	 * 户籍地址
	 */
	private String registerAddr;
	/**
	 * 通讯地址
	 */
	private String contactAddr;
	/**
	 * 工作单位
	 */
	private String company;
	/**
	 * 工作单位地址
	 */
	private String companyAddr;
	/**
	 * 紧急联系人
	 */
	private String urgencyContacts;
	/**
	 * 紧急联系人电话
	 */
	private String urgencyPhoneNumber;
	/**
	 * 紧急联系人手机
	 */
	private String urgencyMobileNumber;
	/**
	 * 备注
	 */
	private String remark;
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostCode() {
        return postCode;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq;
    }

    public String getWeChat() {
        return weChat;
    }

    public void setWeChat(String weChat) {
        this.weChat = weChat;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public Integer getBlood() {
        return blood;
    }

    public void setBlood(Integer blood) {
        this.blood = blood;
    }

    public String getBloodText() {
        return this.getValue("CustomerBlood", this.blood);
    }


    public Integer getOccupation() {
        return occupation;
    }

    public void setOccupation(Integer occupation) {
        this.occupation = occupation;
    }

    public String getOccupationText() {
        return this.getValue("CustomerOccupation", this.occupation);
    }

    public String getRegisterAddr() {
        return registerAddr;
    }

    public void setRegisterAddr(String registerAddr) {
        this.registerAddr = registerAddr;
    }

    public String getContactAddr() {
        return contactAddr;
    }

    public void setContactAddr(String contactAddr) {
        this.contactAddr = contactAddr;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getCompanyAddr() {
        return companyAddr;
    }

    public void setCompanyAddr(String companyAddr) {
        this.companyAddr = companyAddr;
    }

    public String getUrgencyContacts() {
        return urgencyContacts;
    }

    public void setUrgencyContacts(String urgencyContacts) {
        this.urgencyContacts = urgencyContacts;
    }

    public String getUrgencyPhoneNumber() {
        return urgencyPhoneNumber;
    }

    public void setUrgencyPhoneNumber(String urgencyPhoneNumber) {
        this.urgencyPhoneNumber = urgencyPhoneNumber;
    }

    public String getUrgencyMobileNumber() {
        return urgencyMobileNumber;
    }

    public void setUrgencyMobileNumber(String urgencyMobileNumber) {
        this.urgencyMobileNumber = urgencyMobileNumber;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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
    
}
