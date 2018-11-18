/**  
 * @Title: Customer.java
 * @Package: bingo.vkcrm.service.customer.v1.models
 * @author: luoml01 
 * @date: 2016年3月14日下午2:29:48
 * @version V1.0 
 * @see       
 * @since JDK 1.6
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有
 */   
package bingo.vkcrm.service.customer.v1.models;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.dao.orm.annotations.Table;
import bingo.vkcrm.service.annotation.FieldInfo;
import bingo.vkcrm.service.model.BaseModel;

/**   
 * @ClassName: Customer   
 * @Description:客户信息
 * @author: luoml01 
 * @date: 2016年3月14日 下午2:29:48   
 * @Copyright: Conpyright (c) 2016 深圳市万科物业发展有限公司 版权所有   
 */
@Table(name = "main_customer")
public class Customer extends BaseModel implements Serializable{
	/**   
	 * @Fields serialVersionUID : TODO 
	 */     
	    
	private static final long serialVersionUID = -1346614222559560566L;
	/**
     * 客户ID
     */
    private String id;
    /**
     * 客户编码
     */
    @FieldInfo(fieldChineseName = "客户编码")
    private String code;
    /**
     * 姓
     */
    @FieldInfo(fieldChineseName = "姓")
    private String firstName;
    /**
     * 名
     */
    @FieldInfo(fieldChineseName = "名")
    private String lastName;
    /**
     * 客户全称
     */
    @FieldInfo(fieldChineseName = "客户全称")
    private String fullName;
    /**
     * 性别
     */
    private Integer sex;
    /**
     * 性别文本
     */
    @FieldInfo(fieldChineseName = "性别")
    private String sexText;
    /**
     * 客户类型
     */
    private Integer customerType;
    /**
     * 客户类型名称
     */
    @FieldInfo(fieldChineseName = "客户类型")
    private String customerTypeText;
    /**
     * 主要手机号
     */
    @FieldInfo(fieldChineseName = "主要手机号")
    private String mainMobile;
    /**
     * 备用手机号
     */
    @FieldInfo(fieldChineseName = "备用手机号")
    private String standbyMobile;
    /**
     * 家庭电话
     */
    @FieldInfo(fieldChineseName = "家庭电话")
    private String homeTel;
    /**
     * 办公电话
     */
    @FieldInfo(fieldChineseName = "办公电话")
    private String officeTel;
    /**
     * 联系地址
     */
    @FieldInfo(fieldChineseName = "联系地址")
    private String contactAddr;
    /**
     * 客户归属
     */
    private Integer affiliation;
    /**
     * 客户归属文本
     */
    @FieldInfo(fieldChineseName = "客户归属")
    private String affiliationText;
    /**
     * 证件类型
     */
    private Integer certificateType;
    /**
     * 证件类型文本
     */
    @FieldInfo(fieldChineseName = "证件类型")
    private String certificateTypeText;
    /**
     * 证件号码
     */
    @FieldInfo(fieldChineseName = "证件号码")
    private String certificateId;
    
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
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
	 * 是否已删除:0-未删除，1-已删除
	 */
    @FieldInfo(fieldChineseName = "是否已删除")
	private String isDeleted = "0";
    
    /**
	 * 特殊身份
	 */
    private List<SpecialIdentity> specialIdentitys;
    
    /**
	 * 个人兴趣爱好实例
	 */
    private List<Hobby> hobbys;
    
    /**
	 * 客户与房屋的关系
	 */
    private List<CustomerHouse> customerHouses;
	/** 
	 * @return id 
	 */
	public String getId() {
		return id;
	}
	/**   
	 * @param: id the id to set   
	 */
	public void setId(String id) {
		this.id = id;
	}
	/** 
	 * @return code 
	 */
	public String getCode() {
		return code;
	}
	/**   
	 * @param: code the code to set   
	 */
	public void setCode(String code) {
		this.code = code;
	}
	/** 
	 * @return firstName 
	 */
	public String getFirstName() {
		return firstName;
	}
	/**   
	 * @param: firstName the firstName to set   
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	/** 
	 * @return lastName 
	 */
	public String getLastName() {
		return lastName;
	}
	/**   
	 * @param: lastName the lastName to set   
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	/** 
	 * @return fullName 
	 */
	public String getFullName() {
		return fullName;
	}
	/**   
	 * @param: fullName the fullName to set   
	 */
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	/** 
	 * @return sex 
	 */
	public Integer getSex() {
		return sex;
	}
	/**   
	 * @param: sex the sex to set   
	 */
	public void setSex(Integer sex) {
		this.sex = sex;
	}
	/** 
	 * @return sexText 
	 */
	public String getSexText() {
		return this.getValue("CustomerSex", this.sex);
	}
	/**   
	 * @param: sexText the sexText to set   
	 */
	public void setSexText(String sexText) {
		this.sexText = sexText;
	}
	/** 
	 * @return customerType 
	 */
	public Integer getCustomerType() {
		return customerType;
	}
	/**   
	 * @param: customerType the customerType to set   
	 */
	public void setCustomerType(Integer customerType) {
		this.customerType = customerType;
	}
	/** 
	 * @return customerTypeText 
	 */
	public String getCustomerTypeText() {
		return getValue("CustomerType", this.customerType);
	}
	/**   
	 * @param: customerTypeText the customerTypeText to set   
	 */
	public void setCustomerTypeText(String customerTypeText) {
		this.customerTypeText = customerTypeText;
	}
	/** 
	 * @return mainMobile 
	 */
	public String getMainMobile() {
		return mainMobile;
	}
	/**   
	 * @param: mainMobile the mainMobile to set   
	 */
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
	}
	/** 
	 * @return standbyMobile 
	 */
	public String getStandbyMobile() {
		return standbyMobile;
	}
	/**   
	 * @param: standbyMobile the standbyMobile to set   
	 */
	public void setStandbyMobile(String standbyMobile) {
		this.standbyMobile = standbyMobile;
	}
	/** 
	 * @return homeTel 
	 */
	public String getHomeTel() {
		return homeTel;
	}
	/**   
	 * @param: homeTel the homeTel to set   
	 */
	public void setHomeTel(String homeTel) {
		this.homeTel = homeTel;
	}
	/** 
	 * @return officeTel 
	 */
	public String getOfficeTel() {
		return officeTel;
	}
	/**   
	 * @param: officeTel the officeTel to set   
	 */
	public void setOfficeTel(String officeTel) {
		this.officeTel = officeTel;
	}
	/** 
	 * @return contactAddr 
	 */
	public String getContactAddr() {
		return contactAddr;
	}
	/**   
	 * @param: contactAddr the contactAddr to set   
	 */
	public void setContactAddr(String contactAddr) {
		this.contactAddr = contactAddr;
	}
	/** 
	 * @return affiliation 
	 */
	public Integer getAffiliation() {
		return affiliation;
	}
	/**   
	 * @param: affiliation the affiliation to set   
	 */
	public void setAffiliation(Integer affiliation) {
		this.affiliation = affiliation;
	}
	/** 
	 * @return affiliationText 
	 */
	public String getAffiliationText() {
		return this.getValue("CustomerAffilication", this.affiliation);
	}
	/**   
	 * @param: affiliationText the affiliationText to set   
	 */
	public void setAffiliationText(String affiliationText) {
		this.affiliationText = affiliationText;
	}
	/** 
	 * @return certificateType 
	 */
	public Integer getCertificateType() {
		return certificateType;
	}
	/**   
	 * @param: certificateType the certificateType to set   
	 */
	public void setCertificateType(Integer certificateType) {
		this.certificateType = certificateType;
	}
	/** 
	 * @return certificateTypeText 
	 */
	public String getCertificateTypeText() {
		return this.getValue("CustomerCertificateType", this.certificateType);
	}
	/**   
	 * @param: certificateTypeText the certificateTypeText to set   
	 */
	public void setCertificateTypeText(String certificateTypeText) {
		this.certificateTypeText = certificateTypeText;
	}
	/** 
	 * @return certificateId 
	 */
	public String getCertificateId() {
		return certificateId;
	}
	/**   
	 * @param: certificateId the certificateId to set   
	 */
	public void setCertificateId(String certificateId) {
		this.certificateId = certificateId;
	}
	/** 
	 * @return postCode 
	 */
	public String getPostCode() {
		return postCode;
	}
	/**   
	 * @param: postCode the postCode to set   
	 */
	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}
	/** 
	 * @return email 
	 */
	public String getEmail() {
		return email;
	}
	/**   
	 * @param: email the email to set   
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	/** 
	 * @return qq 
	 */
	public String getQq() {
		return qq;
	}
	/**   
	 * @param: qq the qq to set   
	 */
	public void setQq(String qq) {
		this.qq = qq;
	}
	/** 
	 * @return weChat 
	 */
	public String getWeChat() {
		return weChat;
	}
	/**   
	 * @param: weChat the weChat to set   
	 */
	public void setWeChat(String weChat) {
		this.weChat = weChat;
	}
	/** 
	 * @return birthday 
	 */
	public Date getBirthday() {
		return birthday;
	}
	/**   
	 * @param: birthday the birthday to set   
	 */
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	/** 
	 * @return blood 
	 */
	public Integer getBlood() {
		return blood;
	}
	/**   
	 * @param: blood the blood to set   
	 */
	public void setBlood(Integer blood) {
		this.blood = blood;
	}
	/** 
	 * @return bloodText 
	 */
	public String getBloodText() {
		return this.getValue("CustomerBlood", this.blood);
	}
	/**   
	 * @param: bloodText the bloodText to set   
	 */
	public void setBloodText(String bloodText) {
		this.bloodText = bloodText;
	}
	/** 
	 * @return occupation 
	 */
	public Integer getOccupation() {
		return occupation;
	}
	/**   
	 * @param: occupation the occupation to set   
	 */
	public void setOccupation(Integer occupation) {
		this.occupation = occupation;
	}
	/** 
	 * @return occupationText 
	 */
	public String getOccupationText() {
		return this.getValue("CustomerOccupation", this.occupation);
	}
	/**   
	 * @param: occupationText the occupationText to set   
	 */
	public void setOccupationText(String occupationText) {
		this.occupationText = occupationText;
	}
	/** 
	 * @return registerAddr 
	 */
	public String getRegisterAddr() {
		return registerAddr;
	}
	/**   
	 * @param: registerAddr the registerAddr to set   
	 */
	public void setRegisterAddr(String registerAddr) {
		this.registerAddr = registerAddr;
	}
	/** 
	 * @return company 
	 */
	public String getCompany() {
		return company;
	}
	/**   
	 * @param: company the company to set   
	 */
	public void setCompany(String company) {
		this.company = company;
	}
	/** 
	 * @return companyAddr 
	 */
	public String getCompanyAddr() {
		return companyAddr;
	}
	/**   
	 * @param: companyAddr the companyAddr to set   
	 */
	public void setCompanyAddr(String companyAddr) {
		this.companyAddr = companyAddr;
	}
	/** 
	 * @return urgencyContacts 
	 */
	public String getUrgencyContacts() {
		return urgencyContacts;
	}
	/**   
	 * @param: urgencyContacts the urgencyContacts to set   
	 */
	public void setUrgencyContacts(String urgencyContacts) {
		this.urgencyContacts = urgencyContacts;
	}
	/** 
	 * @return urgencyPhoneNumber 
	 */
	public String getUrgencyPhoneNumber() {
		return urgencyPhoneNumber;
	}
	/**   
	 * @param: urgencyPhoneNumber the urgencyPhoneNumber to set   
	 */
	public void setUrgencyPhoneNumber(String urgencyPhoneNumber) {
		this.urgencyPhoneNumber = urgencyPhoneNumber;
	}
	/** 
	 * @return urgencyMobileNumber 
	 */
	public String getUrgencyMobileNumber() {
		return urgencyMobileNumber;
	}
	/**   
	 * @param: urgencyMobileNumber the urgencyMobileNumber to set   
	 */
	public void setUrgencyMobileNumber(String urgencyMobileNumber) {
		this.urgencyMobileNumber = urgencyMobileNumber;
	}
	/** 
	 * @return remark 
	 */
	public String getRemark() {
		return remark;
	}
	/**   
	 * @param: remark the remark to set   
	 */
	public void setRemark(String remark) {
		this.remark = remark;
	}
	/** 
	 * @return specialIdentitys 
	 */
	public List<SpecialIdentity> getSpecialIdentitys() {
		return specialIdentitys;
	}
	/**   
	 * @param: specialIdentitys the specialIdentitys to set   
	 */
	public void setSpecialIdentitys(List<SpecialIdentity> specialIdentitys) {
		this.specialIdentitys = specialIdentitys;
	}
	/** 
	 * @return hobbys 
	 */
	public List<Hobby> getHobbys() {
		return hobbys;
	}
	/**   
	 * @param: hobbys the hobbys to set   
	 */
	public void setHobbys(List<Hobby> hobbys) {
		this.hobbys = hobbys;
	}
	/** 
	 * @return customerHouses 
	 */
	public List<CustomerHouse> getCustomerHouses() {
		return customerHouses;
	}
	/**   
	 * @param: customerHouses the customerHouses to set   
	 */
	public void setCustomerHouses(List<CustomerHouse> customerHouses) {
		this.customerHouses = customerHouses;
	}
	/** 
	 * @return isDeleted 
	 */
	public String getIsDeleted() {
		return isDeleted;
	}
	/**   
	 * @param: isDeleted the isDeleted to set   
	 */
	public void setIsDeleted(String isDeleted) {
		this.isDeleted = isDeleted;
	}
	
}
