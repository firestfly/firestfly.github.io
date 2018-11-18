package bingo.vkcrm.service.customer.v1.models.report;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 客户信息查询报表查询条件
 * @author chengsiyuan
 *
 */
public class CustomerReportCondition {

	/**
	 * 项目id
	 */
	private String projectId;
	/**
	 * 网格id
	 */
	private String gridId;
	/**
	 * 管理中心id
	 */
	private String organizationId;
	/**
	 * 楼栋编码
	 */
	private String buildingCode;
	/**
	 * 房屋名
	 */
	private String houseName;
	/**
	 * 房屋状态
	 */
	private String houseStatus;
	/**
	 * 客房关系类型
	 */
	private String relationType;
	/**
	 * 年龄段起始
	 */
	private Integer ageTypeBegin;
	/**
	 * 年龄段结束
	 */
	private Integer ageTypeEnd;
	/**
	 * 客户类型
	 */
	private String customerType;
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
	 * 客户名称
	 */
	private String customerName;
	/**
	 * 主用手机
	 */
	private String mainMobile;
	/**
	 * 生日
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date birthday;
	/**
	 * 年龄段起始生日
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date birthdayForm;
	/**
	 * 年龄段生日结束
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date birthdayTo;
	/**
	 * 交付日期
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date deliverTime;
	/**
	 * 入住日期
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date checkInTime;
	/**
	 * 是否二手房
	 */
	private Boolean isSecondhand;
	/**
	 * 页码
	 */
	private Integer curPage;
	/**
	 * 每页大小
	 */
	private Integer pageSize;
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getGridId() {
		return gridId;
	}
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
	public String getOrganizationId() {
		return organizationId;
	}
	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}
	public String getHouseName() {
		return houseName;
	}
	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}
	public String getHouseStatus() {
		return houseStatus;
	}
	public void setHouseStatus(String houseStatus) {
		this.houseStatus = houseStatus;
	}
	public String getRelationType() {
		return relationType;
	}
	public void setRelationType(String relationType) {
		this.relationType = relationType;
	}
	
	public Integer getAgeTypeBegin() {
		return ageTypeBegin;
	}
	public void setAgeTypeBegin(Integer ageTypeBegin) {
		this.ageTypeBegin = ageTypeBegin;
	}
	public Integer getAgeTypeEnd() {
		return ageTypeEnd;
	}
	public void setAgeTypeEnd(Integer ageTypeEnd) {
		this.ageTypeEnd = ageTypeEnd;
	}
	public String getCustomerType() {
		return customerType;
	}
	public void setCustomerType(String customerType) {
		this.customerType = customerType;
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
	public Date getBirthday() {
		return birthday;
	}
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
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
	public Boolean getIsSecondhand() {
		return isSecondhand;
	}
	public void setIsSecondhand(Boolean isSecondhand) {
		this.isSecondhand = isSecondhand;
	}
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	public String getMainMobile() {
		return mainMobile;
	}
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
	}
	public String getBuildingCode() {
		return buildingCode;
	}
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}
	public Date getBirthdayForm() {
		return birthdayForm;
	}
	public void setBirthdayForm(Date birthdayForm) {
		this.birthdayForm = birthdayForm;
	}
	public Date getBirthdayTo() {
		return birthdayTo;
	}
	public void setBirthdayTo(Date birthdayTo) {
		this.birthdayTo = birthdayTo;
	}
	public Integer getCurPage() {
		return curPage;
	}
	public void setCurPage(Integer curPage) {
		this.curPage = curPage;
	}
	public Integer getPageSize() {
		return pageSize;
	}
	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}
	
	
}
