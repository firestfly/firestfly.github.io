package bingo.vkcrm.service.customer.v1.models.report;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class PetsReportCondition {

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
	 * 领养时间段起始
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date adoptBeginTime;
	/**
	 * 领养时间段结束
	 */
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date adoptEndTime;
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
	public String getBuildingCode() {
		return buildingCode;
	}
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
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
	public Date getAdoptBeginTime() {
		return adoptBeginTime;
	}
	public void setAdoptBeginTime(Date adoptBeginTime) {
		this.adoptBeginTime = adoptBeginTime;
	}
	public Date getAdoptEndTime() {
		return adoptEndTime;
	}
	public void setAdoptEndTime(Date adoptEndTime) {
		this.adoptEndTime = adoptEndTime;
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
