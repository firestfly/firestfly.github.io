package bingo.vkcrm.service.customer.v1.models.report;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.vkcrm.service.customer.v1.models.SpecialIdentity;

/**
 * 查询客户信息结果
 * @author chengsiyuan
 *
 */
public class CustomerReport {
	/**
	 * 客户id
	 */
	private String id;
	/**
	 * 客户名称
	 */
	private String fullName;
	/**
	 * 客户性别
	 */
	private String sex;
	/**
	 * 客户年龄
	 */
	private Double age;
	/**
	 * 客户类型
	 */
	private String customerType;
	/**
	 * 主用手机
	 */
	private String mainMobile;
	/**
	 * 备用手机
	 */
	private String standbyMobile;
	/**
	 * 客户归属
	 */
	private String affiliation;
	/**
	 * 证件类型
	 */
	private String certificateType;
	/**
	 * 证件号码
	 */
	private String certificateId;
	/**
	 * 客房关系
	 */
	private String relationType;
	/**
	 * 生日
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthday;
	/**
	 * 紧急联系人
	 */
	private String urgencyContacts;
	/**
	 * 紧急联系人电话号码
	 */
	private String urgencyPhoneNumber;
	/**
	 * 紧急联系人手机号码
	 */
	private String urgencyMobileNumber;
	/**
	 * 是否有车
	 */
	private String haveCar;
	/**
	 * 邮编
	 */
	private String postCode;
	/**
	 * email
	 */
	private String email;
	/**
	 * qq号
	 */
	private String qq;
	/**
	 * 微信号
	 */
	private String weChat;
	/**
	 * 血型
	 */
	private String blood;
	/**
	 * 职业
	 */
	private String occupation;
	/**
	 * 户籍地址
	 */
	private String registerAddr;
	/**
	 * 联系地址
	 */
	private String contactAddr;
	/**
	 * 工作单位
	 */
	private String company;
	/**
	 * 工作地址
	 */
	private String companyAddr;
	/**
	 * 物业地址
	 */
	private String houseAddr;
	/**
	 * 特殊身份
	 */
	private List<SpecialIdentity> specialIdentities;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getCustomerType() {
		return customerType;
	}
	public void setCustomerType(String customerType) {
		this.customerType = customerType;
	}
	public String getMainMobile() {
		return mainMobile;
	}
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
	}
	public String getStandbyMobile() {
		return standbyMobile;
	}
	public void setStandbyMobile(String standbyMobile) {
		this.standbyMobile = standbyMobile;
	}
	public String getAffiliation() {
		return affiliation;
	}
	public void setAffiliation(String affiliation) {
		this.affiliation = affiliation;
	}
	public String getCertificateType() {
		return certificateType;
	}
	public void setCertificateType(String certificateType) {
		this.certificateType = certificateType;
	}
	public String getCertificateId() {
		return certificateId;
	}
	public void setCertificateId(String certificateId) {
		this.certificateId = certificateId;
	}
	public String getRelationType() {
		return relationType;
	}
	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}
//	public Date getBirthday() {
//		return birthday;
//	}
//	public void setBirthday(Date birthday) {
//		this.birthday = birthday;
//	}
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
	public String getBlood() {
		return blood;
	}
	public void setBlood(String blood) {
		this.blood = blood;
	}
	public String getOccupation() {
		return occupation;
	}
	public void setOccupation(String occupation) {
		this.occupation = occupation;
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
	public String getHouseAddr() {
		return houseAddr;
	}
	public void setHouseAddr(String houseAddr) {
		this.houseAddr = houseAddr;
	}
	public List<SpecialIdentity> getSpecialIdentities() {
		return specialIdentities;
	}
	public void setSpecialIdentities(List<SpecialIdentity> specialIdentities) {
		this.specialIdentities = specialIdentities;
	}
	public String getHaveCar() {
		return haveCar;
	}
	public void setHaveCar(String haveCar) {
		this.haveCar = haveCar;
	}
	public Double getAge() {
		return age;
	}
	public void setAge(Double age) {
		this.age = age;
	}
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	
}
