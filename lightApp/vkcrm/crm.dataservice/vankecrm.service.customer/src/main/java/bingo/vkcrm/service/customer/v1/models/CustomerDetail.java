package bingo.vkcrm.service.customer.v1.models;

import bingo.dao.orm.annotations.Column;
import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.model.BaseModel;
import bingo.vkcrm.service.utils.JsonDateSerializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 客户详细资料实例
 */
@Table(name = "main_customer_detail")
public class CustomerDetail extends BaseModel {
	/**
	 * 客户ID
	 */
	private String id;
	/**
	 * 邮编
	 */
    @FieldInfo(fieldChineseName = "邮编")
	private String postCode;
	/**
	 * email
	 */
    @FieldInfo(fieldChineseName = "email")
	private String email;
	/**
	 * qq号码
	 */
    @FieldInfo(fieldChineseName = "qq号码")
	private String qq;
	/**
	 * 微信号
	 */
    @FieldInfo(fieldChineseName = "微信号")
	private String weChat;
	/**
	 * 生日
	 */
    @FieldInfo(fieldChineseName = "生日")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthday;
    /**
     * 血型
     */
	private Integer blood;
	/**
	 * 血型文本
	 */
    @FieldInfo(fieldChineseName = "血型")
	private String bloodText;
    /**
     * 职业
     */
	private Integer occupation;
	/**
	 * 职业文本
	 */
    @FieldInfo(fieldChineseName = "职业")
	private String occupationText;
	/**
	 * 户籍地址
	 */
    @FieldInfo(fieldChineseName = "户籍地址")
	private String registerAddr;
	/**
	 * 通讯地址
	 */
    @FieldInfo(fieldChineseName = "通讯地址")
	private String contactAddr;
	/**
	 * 工作单位
	 */
    @FieldInfo(fieldChineseName = "工作单位")
	private String company;
	/**
	 * 工作单位地址
	 */
    @FieldInfo(fieldChineseName = "工作单位地址")
	private String companyAddr;
	/**
	 * 紧急联系人
	 */
    @FieldInfo(fieldChineseName = "紧急联系人")
	private String urgencyContacts;
	/**
	 * 紧急联系人电话
	 */
    @FieldInfo(fieldChineseName = "紧急联系人电话")
	private String urgencyPhoneNumber;
	/**
	 * 紧急联系人手机
	 */
    @FieldInfo(fieldChineseName = "紧急联系人手机")
	private String urgencyMobileNumber;
	/**
	 * 备注
	 */
    @FieldInfo(fieldChineseName = "备注")
	private String remark;
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
    private Date modifyTime;

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
    @JsonSerialize(using=JsonDateSerializer.class)
    public Date getBirthday() {

        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public Integer getBlood() {
        return blood;
    }

    public String getBloodText() {
        return this.getValue("CustomerBlood", this.blood);
    }

    public Integer getOccupation() {
        return occupation;
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

    public void setBlood(Integer blood) {
        this.blood = blood;
    }

    public void setOccupation(Integer occupation) {
        this.occupation = occupation;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

}
