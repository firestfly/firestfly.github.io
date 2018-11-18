package bingo.vkcrm.service.report.v1.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import bingo.vkcrm.service.model.BaseModel;

public class PetsInfo extends BaseModel{
	
//	查询条件：管理中心、项目、网格、楼栋、房间、房屋状态（全部、常住、空置、出租、度假）、客户姓名、主用手机、证件类型、证件号码、领养时间段；
//	显示内容：宠物名称、品种、宠物性别、领养时间、描述、管理中心、项目、网格、单元、楼栋、房屋、房屋状态、客户姓名、主用手机、证件类型、证件号码；
	private String  name; //宠物名称
	private String breed;//品种
	private String sex;//宠物性别
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date adoptTime;//领养时间
	private String description;//描述
	private String company;// 管理中心
	private String projectId;//项目Id
	private String gridCode;//网格code
	private String unit;//单元
	private String buildingCode;//楼栋code
	private String houseCode;//房屋code
	private String status;//房屋状态 code 数字
	private String fullName;//客户姓名
	private String mainMobile;//主用手机
	private String certificateType;//证件类型
	private String certificateId ;//证件号码
	private String adoptTimeStart ;//领养时间查询，开始
	private String adoptTimeEnd;//领养时间查询，结束
	
	private String projectText;//项目中文显示名称
	
	private String gridName;//网格中文显示名称
	
	private String buildingName;//楼栋中文显示名称
	
	private String houseName;//房屋中文显示名称
	
	private String statusText;//房屋状态中文显示
	
	private String certificateText;//证件类型中文显示
	
	private String mcName;//管理中心
	
	private String startPage;
	
	
	private int StartPagePra;
	
	private int pageSizeParm;
	
	
	private String sysUserId;
	
	
	private String houseId;
	
	private String gridId;
	
	private String houseStatus;
	
	private String mcId;
	
	
	
	public String getHouseId() {
		return houseId;
	}
	public void setHouseId(String houseId) {
		this.houseId = houseId;
	}
	public String getGridId() {
		return gridId;
	}
	public void setGridId(String gridId) {
		this.gridId = gridId;
	}
	public String getHouseStatus() {
		return houseStatus;
	}
	public void setHouseStatus(String houseStatus) {
		this.houseStatus = houseStatus;
	}
	public String getMcId() {
		return mcId;
	}
	public void setMcId(String mcId) {
		this.mcId = mcId;
	}
	public String getSysUserId() {
		return sysUserId;
	}
	public void setSysUserId(String sysUserId) {
		this.sysUserId = sysUserId;
	}
	public int getStartPagePra() {
		return StartPagePra;
	}
	public void setStartPagePra(int startPagePra) {
		StartPagePra = startPagePra;
	}
	public int getPageSizeParm() {
		return pageSizeParm;
	}
	public void setPageSizeParm(int pageSizeParm) {
		this.pageSizeParm = pageSizeParm;
	}
	public String getStartPage() {
		return startPage;
	}
	public void setStartPage(String startPage) {
		this.startPage = startPage;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getMcName() {
		return mcName;
	}
	public void setMcName(String mcName) {
		this.mcName = mcName;
	}
	public String getProjectText() {
		return projectText;
	}
	public void setProjectText(String projectText) {
		this.projectText = projectText;
	}
	public String getGridName() {
		return gridName;
	}
	public void setGridName(String gridName) {
		this.gridName = gridName;
	}
	public String getBuildingName() {
		return buildingName;
	}
	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}
	public String getHouseName() {
		return houseName;
	}
	public void setHouseName(String houseName) {
		this.houseName = houseName;
	}
	public String getStatusText() {
		return statusText;
	}
	public void setStatusText(String statusText) {
		this.statusText = statusText;
	}
	public String getCertificateText() {
		return certificateText;
	}
	public void setCertificateText(String certificateText) {
		this.certificateText = certificateText;
	}
	private String curPage;
	
	private String pageSize;
	
   private String totalpage;
   
   private String  totalsize;
   
   
	
	public String getTotalpage() {
	return totalpage;
}
public void setTotalpage(String totalpage) {
	this.totalpage = totalpage;
}
public String getTotalsize() {
	return totalsize;
}
public void setTotalsize(String totalsize) {
	this.totalsize = totalsize;
}
	public String getCurPage() {
		return curPage;
	}
	public void setCurPage(String curPage) {
		this.curPage = curPage;
	}
	public String getPageSize() {
		return pageSize;
	}
	public void setPageSize(String pageSize) {
		this.pageSize = pageSize;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBreed() {
		return breed;
	}
	public void setBreed(String breed) {
		this.breed = breed;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public Date getAdoptTime() {
		return adoptTime;
	}
	public void setAdoptTime(Date adoptTime) {
		this.adoptTime = adoptTime;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getGridCode() {
		return gridCode;
	}
	public void setGridCode(String gridCode) {
		this.gridCode = gridCode;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getBuildingCode() {
		return buildingCode;
	}
	public void setBuildingCode(String buildingCode) {
		this.buildingCode = buildingCode;
	}
	public String getHouseCode() {
		return houseCode;
	}
	public void setHouseCode(String houseCode) {
		this.houseCode = houseCode;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getMainMobile() {
		return mainMobile;
	}
	public void setMainMobile(String mainMobile) {
		this.mainMobile = mainMobile;
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
	public String getAdoptTimeStart() {
		return adoptTimeStart;
	}
	public void setAdoptTimeStart(String adoptTimeStart) {
		this.adoptTimeStart = adoptTimeStart;
	}
	public String getAdoptTimeEnd() {
		return adoptTimeEnd;
	}
	public void setAdoptTimeEnd(String adoptTimeEnd) {
		this.adoptTimeEnd = adoptTimeEnd;
	}
	
	
}
